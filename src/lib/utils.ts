import type { AnalysisResult } from '../types/analysis.js';

export function scoreColor(value: number): string {
	if (value >= 70) return 'bg-emerald-500';
	if (value >= 40) return 'bg-amber-500';
	return 'bg-red-500';
}

export function scoreTextColor(value: number): string {
	if (value >= 70) return 'text-emerald-500';
	if (value >= 40) return 'text-amber-500';
	return 'text-red-500';
}

export function invertedScoreColor(value: number): string {
	// For scores where lower = better (sensationalism, manipulation, ai_generated)
	return scoreColor(100 - value);
}

export function verdictColor(verdict: AnalysisResult['verdict']): string {
	const map: Record<string, string> = {
		verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
		questionable: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
		possible_ai: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
		disinformation: 'bg-red-500/15 text-red-400 border-red-500/30',
		outdated: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
		clickbait: 'bg-pink-500/15 text-pink-400 border-pink-500/30'
	};
	return map[verdict] ?? map.questionable;
}

export function verdictEmoji(verdict: AnalysisResult['verdict']): string {
	const map: Record<string, string> = {
		verified: '✅', questionable: '⚠️', possible_ai: '🤖',
		disinformation: '🔴', outdated: '📅', clickbait: '📢'
	};
	return map[verdict] ?? '⚠️';
}

export function formatDate(iso: string, lang: string): string {
	try {
		return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
			year: 'numeric', month: 'long', day: 'numeric'
		});
	} catch {
		return iso;
	}
}

export function encodeResult(result: AnalysisResult): string {
	return btoa(encodeURIComponent(JSON.stringify(result)));
}

export function decodeResult(encoded: string): AnalysisResult | null {
	try {
		return JSON.parse(decodeURIComponent(atob(encoded)));
	} catch {
		return null;
	}
}

export function isValidUrl(url: string): boolean {
	try {
		const u = new URL(url);
		return u.protocol === 'http:' || u.protocol === 'https:';
	} catch {
		return false;
	}
}
