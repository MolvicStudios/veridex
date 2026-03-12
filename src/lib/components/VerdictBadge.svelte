<script lang="ts">
	import { verdictColor, verdictEmoji } from '$lib/utils.js';
	import type { AnalysisResult } from '../../types/analysis.js';

	let { verdict, label, description = '' }: {
		verdict: AnalysisResult['verdict'];
		label: string;
		description?: string;
	} = $props();
</script>

<div class="inline-flex flex-col items-center gap-1">
	<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold {verdictColor(verdict)}">
		<span>{verdictEmoji(verdict)}</span>
		<span>{label}</span>
	</span>
	{#if description}
		<p class="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">{description}</p>
	{/if}
</div>
