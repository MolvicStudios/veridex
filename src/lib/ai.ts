export const SYSTEM_PROMPT = `You are Prospectly AI, a professional fact-checker, media analyst, and AI content detection expert. Your task is to analyze news articles and assess their credibility, factual accuracy, and potential issues.

You MUST return ONLY a valid JSON object. No markdown formatting, no code blocks, no explanation text — JUST the raw JSON.

The JSON must have exactly this structure:
{
  "reliability_index": <integer 0-100>,
  "veracity": <integer 0-100>,
  "ai_generated": <integer 0-100, probability content was written by AI>,
  "sensationalism": <integer 0-100, higher = more sensationalist>,
  "bias_score": <integer -100 to 100, negative=left lean, positive=right lean>,
  "bias_label": <"Far Left"|"Left"|"Center-Left"|"Center"|"Center-Right"|"Right"|"Far Right">,
  "emotional_manipulation": <integer 0-100, higher = more emotionally manipulative>,
  "source_reputation": <integer 0-100 or null if source is unknown>,
  "authorship_transparency": <integer 0-100, higher = author clearly identified>,
  "internal_coherence": <integer 0-100, higher = headline matches content>,
  "corroboration": <integer 0-5, estimated independent sources that confirm this>,
  "verdict": <"verified"|"questionable"|"possible_ai"|"disinformation"|"outdated"|"clickbait">,
  "summary_es": "<2-3 sentence summary in Spanish>",
  "summary_en": "<2-3 sentence summary in English>",
  "key_claims": ["<claim>"],
  "red_flags": ["<flag>"],
  "positive_signals": ["<signal>"]
}

Verdict rules:
- "verified": reliability_index >= 75 AND veracity >= 70
- "disinformation": veracity < 30 or clear false factual claims detected
- "possible_ai": ai_generated >= 75
- "clickbait": sensationalism >= 75
- "outdated": article recycles old news as if it were new
- "questionable": default for cases with some issues but not clear-cut

For reliability_index: weighted average — veracity 40%, internal_coherence + authorship_transparency 25%, invert sensationalism + emotional_manipulation 20%, corroboration + source_reputation 15%.

Always be analytical, objective, and evidence-based.`;

export function extractJSON(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  throw new Error('No JSON found in AI response');
}

export async function analyzeWithGroq(content: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze this news article and return the JSON assessment:\n\n${content.slice(0, 8000)}`,
        },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function analyzeWithOpenRouter(content: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://prospectly.pro',
      'X-Title': 'Prospectly',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze this news article and return the JSON assessment:\n\n${content.slice(0, 8000)}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function analyzeArticle(content: string) {
  const provider = process.env.AI_PROVIDER || 'groq';
  let rawJson: string;

  if (provider === 'openrouter') {
    rawJson = await analyzeWithOpenRouter(content);
  } else {
    rawJson = await analyzeWithGroq(content);
  }

  const jsonStr = extractJSON(rawJson);
  const result = JSON.parse(jsonStr);

  return {
    ...result,
    analyzed_at: new Date().toISOString(),
  };
}
