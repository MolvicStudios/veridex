<script lang="ts">
	import { browser } from '$app/environment';
	import ReliabilityGauge from './ReliabilityGauge.svelte';
	import VerdictBadge from './VerdictBadge.svelte';
	import ScoreBar from './ScoreBar.svelte';
	import AdBanner from './AdBanner.svelte';
	import type { AnalysisResult } from '../../types/analysis.js';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';
	import { formatDate, encodeResult } from '$lib/utils.js';

	let { result, lang, onNewAnalysis }: {
		result: AnalysisResult;
		lang: Lang;
		onNewAnalysis: () => void;
	} = $props();

	const t = $derived(getT(lang));
	const summary = $derived(lang === 'es' ? result.summary_es : result.summary_en);

	// Derive bias label from score to guarantee consistency (AI sometimes returns mismatched label/score)
	function biasLabelFromScore(score: number): string {
		if (score <= -60) return 'Far Left';
		if (score <= -25) return 'Left';
		if (score <= -10) return 'Center-Left';
		if (score < 10) return 'Center';
		if (score < 25) return 'Center-Right';
		if (score < 60) return 'Right';
		return 'Far Right';
	}
	const derivedBiasKey = $derived(biasLabelFromScore(result.bias_score));
	const biasLabel = $derived((t.biasLabels as Record<string, string>)[derivedBiasKey] ?? derivedBiasKey);

	// Multi-model metadata
	const modelsUsed = $derived(result.models_used ?? []);
	const isConsensus = $derived(modelsUsed.length > 1);
	const scoreRanges = $derived(result.score_ranges ?? {});
	// Disagreement = any key score spread >= 20 points
	const hasDisagreement = $derived(
		isConsensus && Object.values(scoreRanges).some(r => (r.max - r.min) >= 20)
	);

	let shareCopied = $state(false);

	function share() {
		if (!browser) return;
		const encoded = encodeResult(result);
		const url = `${window.location.origin}/${lang}/result#${encoded}`;
		navigator.clipboard.writeText(url).then(() => {
			shareCopied = true;
			setTimeout(() => (shareCopied = false), 2500);
		});
	}
</script>

<div class="space-y-6 fade-up">
	<!-- Top: Gauge + Verdict -->
	<div class="card p-6 flex flex-col sm:flex-row items-center gap-6">
		<div class="flex-shrink-0">
			<ReliabilityGauge value={result.reliability_index} />
		</div>

		<div class="flex-1 text-center sm:text-left space-y-3">
			<p class="text-xs font-semibold uppercase tracking-widest text-slate-400">{t.scores.reliability_index}</p>
			<VerdictBadge
				verdict={result.verdict}
				label={t.verdicts[result.verdict]}
				description={t.verdictDescriptions[result.verdict]}
			/>

			{#if result.article_url}
				<a
					href={result.article_url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs text-blue-500 hover:underline block truncate max-w-xs"
				>{result.article_url}</a>
			{/if}
			<p class="text-xs text-slate-400">{t.results.analyzedAt}: {formatDate(result.analyzed_at, lang)}</p>

			<!-- Models used badge -->
			{#if isConsensus}
				<div class="flex flex-wrap gap-1 mt-1">
					{#each modelsUsed as m}
						<span class="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 font-mono">{m.split('/')[0]}</span>
					{/each}
				</div>
			{:else if modelsUsed.length === 1}
				<p class="text-xs text-slate-400">{t.results.analyzedWith}: <span class="font-mono text-slate-500">{modelsUsed[0]}</span></p>
			{/if}

			<!-- Disagreement warning -->
			{#if hasDisagreement}
				<p class="text-xs text-amber-500 flex items-center gap-1">⚠️ {t.results.modelDisagreement}</p>
			{/if}
		</div>

		<!-- Actions -->
		<div class="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
			<button onclick={share} class="btn-secondary text-sm py-2 gap-1.5">
				{#if shareCopied}✅ {t.results.shareCopied}{:else}🔗 {t.results.shareBtn}{/if}
			</button>
			<button onclick={onNewAnalysis} class="btn-primary text-sm py-2">
				← {t.results.newAnalysis}
			</button>
		</div>
	</div>

	<!-- Ad -->
	<AdBanner />

	<!-- Summary -->
	<div class="card p-5 space-y-2">
		<h3 class="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.results.summary}</h3>
		<p class="text-slate-800 dark:text-slate-200 leading-relaxed">{summary}</p>
	</div>

	<!-- Scores grid -->
	<div class="card p-5 space-y-4">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<ScoreBar
				label={t.scores.veracity}
				description={t.scoreDescriptions.veracity}
				value={result.veracity}
			/>
			<ScoreBar
				label={t.scores.ai_generated}
				description={t.scoreDescriptions.ai_generated}
				value={result.ai_generated}
				inverted
			/>
			<ScoreBar
				label={t.scores.sensationalism}
				description={t.scoreDescriptions.sensationalism}
				value={result.sensationalism}
				inverted
			/>
			<ScoreBar
				label={t.scores.emotional_manipulation}
				description={t.scoreDescriptions.emotional_manipulation}
				value={result.emotional_manipulation}
				inverted
			/>
			<ScoreBar
				label={t.scores.authorship_transparency}
				description={t.scoreDescriptions.authorship_transparency}
				value={result.authorship_transparency}
			/>
			<ScoreBar
				label={t.scores.internal_coherence}
				description={t.scoreDescriptions.internal_coherence}
				value={result.internal_coherence}
			/>
			{#if result.source_reputation !== null}
				<ScoreBar
					label={t.scores.source_reputation}
					description={t.scoreDescriptions.source_reputation}
					value={result.source_reputation}
				/>
			{/if}
			<ScoreBar
				label={t.scores.corroboration}
				description={t.scoreDescriptions.corroboration}
				value={result.corroboration}
				isCorroboration
				maxValue={5}
			/>
		</div>

		<!-- Bias -->
		<div class="pt-3 border-t border-slate-100 dark:border-slate-800">
			<div class="flex items-center justify-between mb-1.5 text-sm">
				<span class="font-medium text-slate-700 dark:text-slate-300">{t.scores.bias}</span>
				<span class="text-xs font-semibold text-blue-500">{biasLabel}</span>
			</div>
			<div class="relative h-3 rounded-full bg-gradient-to-r from-red-500 via-slate-200 to-blue-600 dark:via-slate-700">
				<div
					class="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-400 shadow transition-all duration-700"
					style="left: calc({((result.bias_score + 100) / 200) * 100}% - 8px)"
				></div>
			</div>
			<div class="flex justify-between text-xs text-slate-400 mt-1">
				<span>{lang === 'es' ? 'Izquierda' : 'Left'}</span>
				<span>{lang === 'es' ? 'Centro' : 'Center'}</span>
				<span>{lang === 'es' ? 'Derecha' : 'Right'}</span>
			</div>
		</div>
	</div>

	<!-- Key claims, red flags, positive signals -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<!-- Key claims -->
		<div class="card p-4 space-y-2">
			<h3 class="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
				<span>📋</span>{t.results.keyClaims}
			</h3>
			{#if result.key_claims?.length}
				<ul class="space-y-1.5">
					{#each result.key_claims as claim}
						<li class="text-sm text-slate-700 dark:text-slate-300 flex gap-2 leading-snug">
							<span class="text-blue-400 flex-shrink-0 mt-0.5">→</span>{claim}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-slate-400">—</p>
			{/if}
		</div>

		<!-- Red flags -->
		<div class="card p-4 space-y-2">
			<h3 class="font-semibold text-sm text-red-400 uppercase tracking-wider flex items-center gap-1.5">
				<span>🚩</span>{t.results.redFlags}
			</h3>
			{#if result.red_flags?.length}
				<ul class="space-y-1.5">
					{#each result.red_flags as flag}
						<li class="text-sm text-slate-700 dark:text-slate-300 flex gap-2 leading-snug">
							<span class="text-red-400 flex-shrink-0 mt-0.5">•</span>{flag}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-slate-400">{t.results.noRedFlags}</p>
			{/if}
		</div>

		<!-- Positive signals -->
		<div class="card p-4 space-y-2">
			<h3 class="font-semibold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
				<span>✅</span>{t.results.positiveSignals}
			</h3>
			{#if result.positive_signals?.length}
				<ul class="space-y-1.5">
					{#each result.positive_signals as sig}
						<li class="text-sm text-slate-700 dark:text-slate-300 flex gap-2 leading-snug">
							<span class="text-emerald-400 flex-shrink-0 mt-0.5">•</span>{sig}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-slate-400">{t.results.noPositiveSignals}</p>
			{/if}
		</div>
	</div>

	<AdBanner />
</div>
