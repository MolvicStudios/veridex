export type Verdict =
	| 'verified'
	| 'questionable'
	| 'possible_ai'
	| 'disinformation'
	| 'outdated'
	| 'clickbait';

export interface AnalysisResult {
	reliability_index: number;
	veracity: number;
	ai_generated: number;
	sensationalism: number;
	bias_score: number;
	bias_label: string;
	emotional_manipulation: number;
	source_reputation: number | null;
	authorship_transparency: number;
	internal_coherence: number;
	corroboration: number;
	verdict: Verdict;
	summary_es: string;
	summary_en: string;
	key_claims: string[];
	red_flags: string[];
	positive_signals: string[];
	analyzed_at: string;
	article_url?: string;
	models_used?: string[];
	score_ranges?: Record<string, { min: number; max: number }>;
}

export interface NewsItem {
	title: string;
	link: string;
	description: string;
	pubDate: string;
	source: string;
	thumbnail?: string;
}
