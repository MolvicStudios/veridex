import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NewsItem } from '../../../types/analysis.js';

// Multiple sources per language — worldwide variety
const SOURCES_EN = [
	// US
	{ url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NY Times' },
	{ url: 'https://feeds.washingtonpost.com/rss/world', name: 'Washington Post' },
	{ url: 'https://feeds.npr.org/1004/rss.xml', name: 'NPR World' },
	// UK
	{ url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC News' },
	{ url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' },
	{ url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', name: 'BBC Tech' },
	// Wire services
	{ url: 'https://feeds.reuters.com/reuters/topNews', name: 'Reuters' },
	// Asia-Pacific
	{ url: 'https://www3.nhk.or.jp/nhkworld/en/news/rss/index.xml', name: 'NHK World' },
	{ url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
	// Europe
	{ url: 'https://www.dw.com/rss/en/top-stories/rss-en-all', name: 'DW News' },
	{ url: 'https://www.france24.com/en/rss', name: 'France 24' },
	// Africa/Americas
	{ url: 'https://www.abc.net.au/news/feed/2942460/rss.xml', name: 'ABC Australia' }
];

const SOURCES_ES = [
	// España
	{ url: 'https://ep00.epimg.net/rss/elpais/portada.xml', name: 'El País' },
	{ url: 'https://www.elmundo.es/rss/portada.xml', name: 'El Mundo' },
	{ url: 'https://www.20minutos.es/rss/', name: '20minutos' },
	{ url: 'https://www.rtve.es/api/noticias.rss', name: 'RTVE' },
	// Latinoamérica
	{ url: 'https://www.infobae.com/feeds/rss/', name: 'Infobae' },
	{ url: 'https://rss.eluniversal.com.mx/rss.xml', name: 'El Universal MX' },
	{ url: 'https://rss.dw.com/xml/rss-es-all', name: 'DW Español' },
	// Internacional en español
	{ url: 'https://feeds.bbci.co.uk/mundo/rss.xml', name: 'BBC Mundo' },
	{ url: 'https://www.france24.com/es/rss', name: 'France 24 ES' },
	{ url: 'https://cnnespanol.cnn.com/feed/', name: 'CNN Español' }
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

/** Shuffle array in place (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export const GET: RequestHandler = async ({ url }) => {
	const lang = (url.searchParams.get('lang') ?? 'es') as 'es' | 'en';
	const allSources = lang === 'es' ? [...SOURCES_ES] : [...SOURCES_EN];

	// Randomly pick 4 sources each time for variety on refresh
	const picked = shuffle(allSources).slice(0, 4);

	const results = await Promise.all(
		picked.map(s => fetchSource(s.url, s.name, 3))
	);

	// Interleave: take 1 from each source in round-robin for max variety
	const interleaved: NewsItem[] = [];
	const maxLen = Math.max(...results.map(r => r.length));
	for (let i = 0; i < maxLen && interleaved.length < 9; i++) {
		for (const arr of results) {
			if (arr[i] && interleaved.length < 9) interleaved.push(arr[i]);
		}
	}

	// If we got nothing, try more sources as fallback
	let items = interleaved;
	if (items.length === 0) {
		const remaining = allSources.filter(s => !picked.includes(s));
		for (const s of remaining) {
			items = await fetchSource(s.url, s.name, 9);
			if (items.length > 0) break;
		}
	}

	return json(
		{ items },
		{ headers: { 'Cache-Control': 'public, max-age=120, s-maxage=120' } }
	);
};
