export const SYSTEM_PROMPT = `You are Veridex AI, a professional fact-checker, media analyst, and AI content detection expert. Analyze news articles and assess their credibility, factual accuracy, and potential issues.

You MUST return ONLY a valid JSON object — no markdown, no code blocks, no explanation — JUST raw JSON with exactly this structure:

{
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
}

Verdict rules:
- "verified": reliability_index >= 75 AND veracity >= 70
- "disinformation": veracity < 30 or clear false facts detected
- "possible_ai": ai_generated >= 75
- "clickbait": sensationalism >= 75
- "outdated": old news presented as new
- "questionable": default for ambiguous cases

reliability_index = weighted avg: veracity×40% + (coherence+authorship)×25% + invert(sensationalism+manipulation)×20% + (corroboration+reputation)×15%.`;

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
	const messages = [
		{ role: 'system', content: SYSTEM_PROMPT },
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
