const JSON_SCHEMA = `{
  "reliability_index": <integer 0-100>,
  "veracity": <integer 0-100>,
  "ai_generated": <integer 0-100>,
  "sensationalism": <integer 0-100>,
  "bias_score": <integer -100 to 100, negative=left, positive=right>,
  "bias_label": <"Far Left"|"Left"|"Center-Left"|"Center"|"Center-Right"|"Right"|"Far Right">,
  "emotional_manipulation": <integer 0-100>,
  "source_reputation": <integer 0-100 or null>,
  "authorship_transparency": <integer 0-100>,
  "internal_coherence": <integer 0-100>,
  "corroboration": <integer 0-5>,
  "verdict": <"verified"|"questionable"|"possible_ai"|"disinformation"|"outdated"|"clickbait">,
  "summary_es": "<2-3 sentence summary in Spanish>",
  "summary_en": "<2-3 sentence summary in English>",
  "key_claims": ["<claim1>", "<claim2>"],
  "red_flags": ["<flag>"],
  "positive_signals": ["<signal>"]
}`;

const VERDICT_RULES = `Verdict rules:
- "verified": reliability_index >= 75 AND veracity >= 70
- "disinformation": veracity < 30 or clear false facts detected
- "possible_ai": ai_generated >= 75
- "clickbait": sensationalism >= 75
- "outdated": old news presented as new
- "questionable": default for ambiguous cases

reliability_index = weighted avg: veracity×40% + (coherence+authorship)×25% + invert(sensationalism+manipulation)×20% + (corroboration+reputation)×15%.`;

export const SYSTEM_PROMPT = `You are Veridex AI, a professional fact-checker, media analyst, and AI content detection expert. Analyze news articles and assess their credibility, factual accuracy, and potential issues.

You MUST return ONLY a valid JSON object — no markdown, no code blocks, no explanation — JUST raw JSON with exactly this structure:

${JSON_SCHEMA}

${VERDICT_RULES}`;

// Slightly tuned variants per provider for better compliance
const PROVIDER_PROMPTS: Record<string, string> = {
	groq: SYSTEM_PROMPT,
	mistral: `You are Veridex AI, a professional fact-checker and media analyst. Analyze news articles critically.

Return ONLY a raw JSON object — absolutely no markdown fences, no \`\`\`json, no explanation text before or after. Start your response directly with { and end with }.

JSON structure:
${JSON_SCHEMA}

${VERDICT_RULES}`,
	openrouter: `You are Veridex AI, a professional fact-checker and media analyst.

CRITICAL: Your entire response must be a single valid JSON object. Do not write anything before or after the JSON. Do not use markdown code blocks. Start with { and end with }.

Required JSON structure:
${JSON_SCHEMA}

${VERDICT_RULES}`
};

export function extractJSON(text: string): string {
	const match = text.match(/\{[\s\S]*\}/);
	if (match) return match[0];
	throw new Error('No JSON in AI response');
}

export interface AICallOptions {
	provider: 'groq' | 'mistral' | 'openrouter';
	apiKey: string;
	model: string;
	content: string;
}

// ── Provider call with user key ────────────────────────────────────────────
export async function analyzeWithUserKey(opts: AICallOptions): Promise<string> {
	const { provider, apiKey, model, content } = opts;
	const snippet = content.slice(0, 8000);
	const systemPrompt = PROVIDER_PROMPTS[provider] ?? SYSTEM_PROMPT;
	const messages = [
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: `Analyze this news article and return the JSON:\n\n${snippet}` }
	];

	let url: string;
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiKey}`
	};
	const body: Record<string, unknown> = { model, messages, temperature: 0.1, max_tokens: 2048 };

	if (provider === 'groq') {
		url = 'https://api.groq.com/openai/v1/chat/completions';
		body.response_format = { type: 'json_object' };
	} else if (provider === 'mistral') {
		url = 'https://api.mistral.ai/v1/chat/completions';
		body.response_format = { type: 'json_object' };
	} else {
		url = 'https://openrouter.ai/api/v1/chat/completions';
		headers['HTTP-Referer'] = 'https://veridex.quest';
		headers['X-Title'] = 'Veridex';
	}

	const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
	if (!res.ok) throw new Error(`${provider} API error ${res.status}: ${await res.text()}`);
	const data = await res.json();
	return data.choices[0].message.content;
}

// ── Numeric keys that get averaged ────────────────────────────────────────
const NUMERIC_KEYS = [
	'reliability_index', 'veracity', 'ai_generated', 'sensationalism',
	'emotional_manipulation', 'authorship_transparency', 'internal_coherence',
	'corroboration', 'bias_score'
] as const;

type ParsedResult = Record<string, unknown>;

/** Merge multiple model results into one consensus result.
 *  Numeric fields → average (rounded).
 *  source_reputation → average of non-null values.
 *  verdict / bias_label → majority vote (ties go to first).
 *  summary / claims / flags → taken from the result with highest reliability_index.
 */
export function mergeResults(results: ParsedResult[]): ParsedResult & {
	models_used: string[];
	score_ranges: Record<string, { min: number; max: number }>;
} {
	if (results.length === 1) {
		return { ...results[0], models_used: [], score_ranges: {} } as ReturnType<typeof mergeResults>;
	}

	const merged: ParsedResult = {};

	// Numeric averages + ranges
	const ranges: Record<string, { min: number; max: number }> = {};
	for (const key of NUMERIC_KEYS) {
		const vals = results.map(r => Number(r[key])).filter(v => !isNaN(v));
		if (vals.length) {
			merged[key] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
			ranges[key] = { min: Math.min(...vals), max: Math.max(...vals) };
		}
	}

	// source_reputation (nullable)
	const repVals = results.map(r => r.source_reputation).filter(v => v !== null && v !== undefined) as number[];
	merged.source_reputation = repVals.length ? Math.round(repVals.reduce((a, b) => a + b, 0) / repVals.length) : null;

	// Majority vote for verdict
	const verdictCounts: Record<string, number> = {};
	for (const r of results) {
		const v = String(r.verdict ?? 'questionable');
		verdictCounts[v] = (verdictCounts[v] ?? 0) + 1;
	}
	merged.verdict = Object.entries(verdictCounts).sort((a, b) => b[1] - a[1])[0][0];

	// Majority vote for bias_label
	const biasCounts: Record<string, number> = {};
	for (const r of results) {
		const b = String(r.bias_label ?? 'Center');
		biasCounts[b] = (biasCounts[b] ?? 0) + 1;
	}
	merged.bias_label = Object.entries(biasCounts).sort((a, b) => b[1] - a[1])[0][0];

	// Text fields from best result (highest reliability_index)
	const best = results.reduce((a, b) =>
		Number(a.reliability_index ?? 0) >= Number(b.reliability_index ?? 0) ? a : b
	);
	merged.summary_es = best.summary_es;
	merged.summary_en = best.summary_en;
	merged.key_claims = best.key_claims;
	merged.red_flags = best.red_flags;
	merged.positive_signals = best.positive_signals;

	return { ...merged, models_used: [], score_ranges: ranges } as ReturnType<typeof mergeResults>;
}

export interface MultiModelCall {
	calls: AICallOptions[];
}

/** Run multiple model calls in parallel and return merged + raw results. */
export async function analyzeMultiModel(calls: AICallOptions[]): Promise<{
	merged: ReturnType<typeof mergeResults>;
	modelsUsed: string[];
}> {
	const settled = await Promise.allSettled(
		calls.map(opts => analyzeWithUserKey(opts).then(raw => JSON.parse(extractJSON(raw))))
	);

	const parsed: ParsedResult[] = [];
	const modelsUsed: string[] = [];

	for (let i = 0; i < settled.length; i++) {
		const s = settled[i];
		if (s.status === 'fulfilled') {
			parsed.push(s.value as ParsedResult);
			modelsUsed.push(`${calls[i].provider}/${calls[i].model}`);
		}
	}

	if (parsed.length === 0) throw new Error('All model calls failed');

	const merged = mergeResults(parsed);
	merged.models_used = modelsUsed;
	return { merged, modelsUsed };
}

// ── Server-side call with env key ──────────────────────────────────────────
export async function analyzeWithEnvKey(
	content: string,
	envGroq: string,
	envOpenRouter: string,
	provider = 'groq'
): Promise<string> {
	if (provider === 'openrouter') {
		return analyzeWithUserKey({
			provider: 'openrouter',
			apiKey: envOpenRouter,
			model: 'meta-llama/llama-3.3-70b-instruct:free',
			content
		});
	}
	return analyzeWithUserKey({
		provider: 'groq',
		apiKey: envGroq,
		model: 'llama-3.3-70b-versatile',
		content
	});
}
