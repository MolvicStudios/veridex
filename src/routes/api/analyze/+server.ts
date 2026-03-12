import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { analyzeWithUserKey, analyzeWithEnvKey, extractJSON } from '$lib/ai.js';
import { GROQ_API_KEY, OPENROUTER_API_KEY, AI_PROVIDER } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	let body: {
		content?: string;
		url?: string;
		userKey?: string;
		provider?: string;
		model?: string;
	};

	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	const { content, url, userKey, provider, model } = body;

	if (!content || typeof content !== 'string' || content.trim().length < 50) {
		throw error(400, 'Content too short');
	}

	try {
		let rawJson: string;

		if (userKey && typeof userKey === 'string' && userKey.trim().length > 0) {
			// User's own key — unlimited
			rawJson = await analyzeWithUserKey({
				provider: (provider as 'groq' | 'mistral' | 'openrouter') ?? 'groq',
				apiKey: userKey.trim(),
				model: model ?? 'llama-3.3-70b-versatile',
				content: content.trim()
			});
		} else {
			// Server key
			rawJson = await analyzeWithEnvKey(
				content.trim(),
				GROQ_API_KEY ?? '',
				OPENROUTER_API_KEY ?? '',
				AI_PROVIDER ?? 'groq'
			);
		}

		const result = JSON.parse(extractJSON(rawJson));

		if (url) result.article_url = url;
		result.analyzed_at = new Date().toISOString();

		return json(result);
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'Unknown error';
		if (msg.includes('401') || msg.includes('invalid') || msg.includes('Unauthorized')) {
			return json({ error: 'invalid_key' }, { status: 401 });
		}
		console.error('Analyze error:', msg);
		throw error(500, 'Analysis failed');
	}
};
