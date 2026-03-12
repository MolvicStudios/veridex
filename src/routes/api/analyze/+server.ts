import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { analyzeWithUserKey, analyzeWithEnvKey, analyzeMultiModel, extractJSON } from '$lib/ai.js';
import type { ProviderType } from '$lib/ai.js';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	let body: {
		content?: string;
		url?: string;
		userKey?: string;
		provider?: string;
		model?: string;
		mode?: 'fast' | 'precise';
		extraKeys?: Record<string, { key: string; model: string }>;
	};

	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	const { content, url, userKey, provider, model, mode, extraKeys } = body;

	if (!content || typeof content !== 'string' || content.trim().length < 50) {
		throw error(400, 'Content too short');
	}

	try {
		let rawJson: string;
		let modelsUsed: string[] = [];
		let scoreRanges: Record<string, { min: number; max: number }> = {};

		const hasOwnKey = userKey && typeof userKey === 'string' && userKey.trim().length > 0;

		if (hasOwnKey && mode === 'precise' && extraKeys) {
			// Multi-model consensus with all configured provider keys
			const calls = [];

			// Primary provider
			calls.push({
				provider: (provider as ProviderType) ?? 'groq',
				apiKey: userKey!.trim(),
				model: model ?? 'llama-3.3-70b-versatile',
				content: content.trim()
			});

			// Additional providers from extraKeys
			for (const [p, cfg] of Object.entries(extraKeys)) {
				if (cfg.key?.trim() && p !== provider) {
					calls.push({
						provider: p as ProviderType,
						apiKey: cfg.key.trim(),
						model: cfg.model,
						content: content.trim()
					});
				}
			}

			const { merged, modelsUsed: mu } = await analyzeMultiModel(calls);
			modelsUsed = mu;
			scoreRanges = merged.score_ranges ?? {};

			const result = merged as Record<string, unknown>;
			if (url) result.article_url = url;
			result.analyzed_at = new Date().toISOString();
			result.models_used = modelsUsed;
			result.score_ranges = scoreRanges;
			return json(result);
		}

		if (hasOwnKey) {
			// Single model with user key
			rawJson = await analyzeWithUserKey({
				provider: (provider as ProviderType) ?? 'groq',
				apiKey: userKey!.trim(),
				model: model ?? 'llama-3.3-70b-versatile',
				content: content.trim()
			});
			modelsUsed = [`${provider ?? 'groq'}/${model ?? 'llama-3.3-70b-versatile'}`];
		} else {
			// Server key (free tier) — always single, always Groq
			rawJson = await analyzeWithEnvKey(
				content.trim(),
				env.GROQ_API_KEY ?? ''
			);
			modelsUsed = [`groq/llama-3.3-70b-versatile`];
		}

		const result = JSON.parse(extractJSON(rawJson));
		if (url) result.article_url = url;
		result.analyzed_at = new Date().toISOString();
		result.models_used = modelsUsed;
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
