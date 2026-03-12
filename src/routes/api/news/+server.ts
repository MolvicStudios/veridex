import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsItem } from '../../../types/analysis.js';

// Multiple sources per language for variety
const SOURCES_EN = [
	{ url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC News' },
	{ url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', name: 'BBC Tech' },
	{ url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NY Times' },
	{ url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' },
	{ url: 'https://feeds.reuters.com/reuters/topNews', name: 'Reuters' }
];

const SOURCES_ES = [
	{ url: 'https://ep00.epimg.net/rss/elpais/portada.xml', name: 'El País' },
	{ url: 'https://www.elmundo.es/rss/portada.xml', name: 'El Mundo' },
	{ url: 'https://feeds.bbci.co.uk/mundo/rss.xml', name: 'BBC Mundo' },
	{ url: 'https://www.20minutos.es/rss/', name: '20minutos' },
	{ url: 'https://www.rtve.es/api/noticias.rss', name: 'RTVE' }
];

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

async function fetchSource(url: string, name: string, perSource: number): Promise<NewsItem[]> {
	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Veridex/1.0)' },
			signal: AbortSignal.timeout(6000)
		});
		if (!res.ok) return [];
		const items = parseRSS(await res.text(), name);
		return items.slice(0, perSource);
	} catch {
		return [];
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const lang = (url.searchParams.get('lang') ?? 'es') as 'es' | 'en';
	const sources = lang === 'es' ? SOURCES_ES : SOURCES_EN;

	// Fetch first 3 sources in parallel, 3 items each = up to 9 varied items
	const results = await Promise.all(
		sources.slice(0, 3).map(s => fetchSource(s.url, s.name, 3))
	);

	// Interleave: take 1 from each source in round-robin for max variety
	const interleaved: NewsItem[] = [];
	const maxLen = Math.max(...results.map(r => r.length));
	for (let i = 0; i < maxLen && interleaved.length < 9; i++) {
		for (const arr of results) {
			if (arr[i] && interleaved.length < 9) interleaved.push(arr[i]);
		}
	}

	// If we got nothing, try remaining sources as fallback
	let items = interleaved;
	if (items.length === 0) {
		for (const s of sources.slice(3)) {
			items = await fetchSource(s.url, s.name, 9);
			if (items.length > 0) break;
		}
	}

	return json(
		{ items },
		{ headers: { 'Cache-Control': 'public, max-age=900, s-maxage=900' } }
	);
};
