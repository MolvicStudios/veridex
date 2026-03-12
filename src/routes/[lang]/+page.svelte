<script lang="ts">
	import { onMount } from 'svelte';
	import AnalysisForm from '$lib/components/AnalysisForm.svelte';
	import ResultPanel from '$lib/components/ResultPanel.svelte';
	import NewsSection from '$lib/components/NewsSection.svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';
	import { currentResult } from '$lib/stores.js';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';
	import type { AnalysisResult, NewsItem } from '../../../types/analysis.js';

	let { data } = $props();
	const lang = $derived(data.lang as Lang);
	const t = $derived(getT(lang));

	// Result state
	let result = $state<AnalysisResult | null>(null);

	// News state
	let newsItems = $state<NewsItem[]>([]);
	let newsLoading = $state(true);
	let newsError = $state(false);

	// Form ref for pre-filling
	let formRef = $state<InstanceType<typeof AnalysisForm> | null>(null);

	// Scroll target
	let formSection: HTMLElement;

	function onResult(r: AnalysisResult) {
		result = r;
		currentResult.set(r);
		// Scroll to result
		setTimeout(() => {
			document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 100);
	}

	function onNewAnalysis() {
		result = null;
		currentResult.set(null);
		setTimeout(() => {
			formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 50);
	}

	function onVerifyNews(item: NewsItem) {
		result = null;
		currentResult.set(null);
		formRef?.prefillUrl(item.link);
		setTimeout(() => {
			formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 50);
	}

	onMount(async () => {
		try {
			const res = await fetch(`/api/news?lang=${lang}`);
			if (res.ok) {
				const data = await res.json();
				newsItems = data.items ?? [];
			} else {
				newsError = true;
			}
		} catch {
			newsError = true;
		} finally {
			newsLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{t.meta.title}</title>
	<meta name="description" content={t.meta.description} />
	<meta property="og:title" content={t.meta.title} />
	<meta property="og:description" content={t.meta.description} />
	<meta property="og:url" content="https://veridex.quest/{lang}" />
	<link rel="canonical" href="https://veridex.quest/{lang}" />
	<link rel="alternate" hreflang="es" href="https://veridex.quest/es" />
	<link rel="alternate" hreflang="en" href="https://veridex.quest/en" />
</svelte:head>

<!-- Hero section -->
<section class="relative overflow-hidden pt-16 pb-10">
	<!-- Background glow -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		<div class="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/8 dark:bg-blue-600/12 blur-3xl"></div>
	</div>

	<div class="container-app relative">
		<div class="text-center mb-10">
			<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20 mb-4">
				✨ {t.hero.badge}
			</span>
			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
				{t.hero.title}
			</h1>
			<p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">{t.hero.subtitle}</p>
				<p class="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium">{t.hero.disclaimer}</p>
			</div>

			<!-- Form card -->
		<div bind:this={formSection} id="analyze-section" class="card p-6 max-w-2xl mx-auto shadow-xl">
			<AnalysisForm bind:this={formRef} {lang} {onResult} />
		</div>
	</div>
</section>

<!-- Ad -->
<div class="container-app"><AdBanner /></div>

<!-- Result section -->
{#if result}
	<section id="result-section" class="container-app py-4 pb-12 fade-up">
		<ResultPanel {result} {lang} {onNewAnalysis} />
	</section>
{/if}

<!-- News Research section -->
<section class="container-app pb-16">
	<NewsSection
		{lang}
		items={newsItems}
		loading={newsLoading}
		error={newsError}
		onVerify={onVerifyNews}
	/>
</section>

<!-- How it works -->
<section class="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 py-16">
	<div class="container-app">
		<h2 class="text-2xl font-bold text-center mb-10">{t.howItWorks.title}</h2>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
			{#each t.howItWorks.steps as step, i}
				<div class="text-center space-y-3">
					<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg">
						{i + 1}
					</div>
					<h3 class="font-semibold">{step.title}</h3>
					<p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
