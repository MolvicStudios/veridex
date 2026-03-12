import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	let body: { url?: string };
	try { body = await request.json(); } catch { throw error(400, 'Invalid JSON'); }

	const { url } = body;
	if (!url || typeof url !== 'string') throw error(400, 'Missing url');

	// Validate URL
	let parsed: URL;
	try { parsed = new URL(url); } catch { throw error(400, 'Invalid URL'); }
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		throw error(400, 'Invalid protocol');
	}

	try {
		// Use Jina Reader to extract clean article text
		const jinaUrl = `https://r.jina.ai/${url}`;
		const res = await fetch(jinaUrl, {
			headers: {
				'Accept': 'text/plain',
				'X-Return-Format': 'text'
			},
			signal: AbortSignal.timeout(15000)
		});

		if (!res.ok) throw new Error(`Jina error ${res.status}`);

		const text = await res.text();
		const trimmed = text.slice(0, 12000).trim();

		if (trimmed.length < 100) throw new Error('Content too short');

		return json({ text: trimmed });
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'Fetch failed';
		console.error('Fetch route error:', msg);
		throw error(502, 'Could not fetch article');
	}
};
