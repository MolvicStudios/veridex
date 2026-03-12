<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ResultPanel from '$lib/components/ResultPanel.svelte';
	import { currentResult } from '$lib/stores.js';
	import type { Lang } from '$lib/translations.js';
	import { decodeResult } from '$lib/utils.js';
	import type { AnalysisResult } from '../../../../types/analysis.js';

	let { data } = $props();
	const lang = $derived(data.lang as Lang);
	let result = $state<AnalysisResult | null>(null);
	let loading = $state(true);

	onMount(() => {
		// Try from store first
		const stored = $currentResult;
		if (stored) { result = stored; loading = false; return; }

		// Try from URL hash (shared link)
		if (browser && window.location.hash) {
			const decoded = decodeResult(window.location.hash.slice(1));
			if (decoded) { result = decoded; loading = false; return; }
		}

		// Nothing found, go back home
		loading = false;
		goto(`/${lang}`);
	});

	function onNewAnalysis() {
		currentResult.set(null);
		goto(`/${lang}`);
	}
</script>

<svelte:head>
	<title>Resultado del análisis — Veridex.quest</title>
</svelte:head>

<div class="container-app py-10">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<span class="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></span>
		</div>
	{:else if result}
		<ResultPanel {result} {lang} {onNewAnalysis} />
	{/if}
</div>
