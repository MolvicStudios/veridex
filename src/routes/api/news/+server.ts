import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsItem } from '../../../types/analysis.js';

// Cache for 15 minutes (edge cache header)
const SOURCES = {
	en: 'https://feeds.bbci.co.uk/news/world/rss.xml',
	es: 'https://ep00.epimg.net/rss/elpais/portada.xml'
};

const FALLBACK_ES = 'https://feeds.bbci.co.uk/mundo/rss.xml';

function parseRSS(xml: string, fallbackSource: string): NewsItem[] {
	const items: NewsItem[] = [];
	const itemRegex = /<item>([\s\S]*?)<\/item>/g;
	let match: RegExpExecArray | null;

	while ((match = itemRegex.exec(xml)) !== null && items.length < 9) {
		const item = match[1];

		const titleRaw = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] ?? '';
		// Skip "Image" and other non-news titles
		if (!titleRaw || titleRaw.trim().length < 10) continue;

		const linkRaw =
			item.match(/<link>([^<]+)<\/link>/)?.[1] ??
			item.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? '';

		const descRaw = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] ?? '';
		const description = descRaw.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim().slice(0, 250);

		const pubDateRaw = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? '';
		let pubDate = '';
		if (pubDateRaw) {
			try {
				pubDate = new Date(pubDateRaw).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
			} catch { pubDate = ''; }
		}

		const sourceRaw =
			item.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ??
			item.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/)?.[1] ?? '';
		const source = sourceRaw.replace(/<[^>]*>/g, '').trim() || fallbackSource;

		const thumbnail =
			item.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ??
			item.match(/<media:content[^>]*url="([^"]+)[^>]*type="image/)?.[1] ??
			item.match(/<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"/)?.[1] ?? '';

		const title = titleRaw.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
		const link = linkRaw.trim();

		if (title && link) {
			items.push({ title, link, description, pubDate, source, thumbnail });
		}
	}

	return items;
}

export const GET: RequestHandler = async ({ url }) => {
	const lang = (url.searchParams.get('lang') ?? 'es') as 'es' | 'en';
	const primaryUrl = SOURCES[lang];
	const fallback = lang === 'es' ? FALLBACK_ES : SOURCES.en;
	const sourceName = lang === 'es' ? 'El País' : 'BBC News';
	const fallbackName = lang === 'es' ? 'BBC Mundo' : 'BBC News';

	let items: NewsItem[] = [];

	// Try primary
	try {
		const res = await fetch(primaryUrl, {
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Veridex/1.0)' },
			signal: AbortSignal.timeout(8000)
		});
		if (res.ok) {
			items = parseRSS(await res.text(), sourceName);
		}
	} catch { /* try fallback */ }

	// Try fallback if primary failed or returned nothing
	if (items.length === 0 && fallback !== primaryUrl) {
		try {
			const res = await fetch(fallback, {
				headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Veridex/1.0)' },
				signal: AbortSignal.timeout(8000)
			});
			if (res.ok) {
				items = parseRSS(await res.text(), fallbackName);
			}
		} catch { /* give up */ }
	}

	return json(
		{ items },
		{
			headers: {
				'Cache-Control': 'public, max-age=900, s-maxage=900'
			}
		}
	);
};
