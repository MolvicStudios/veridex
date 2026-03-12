<script lang="ts">
	import LegalPage from '$lib/components/LegalPage.svelte';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';

	let { data } = $props();
	const lang = $derived(data.lang as Lang);
	const t = $derived(getT(lang));
	const p = $derived(t.terms);
</script>

<svelte:head>
	<title>{p.title} — Prospectly.shop</title>
</svelte:head>

<div class="container-app py-12">
	<div class="max-w-2xl">
		<h1 class="text-3xl font-bold mb-1">{p.title}</h1>
		<p class="text-sm text-slate-400 mb-8">{p.lastUpdated}</p>
		<LegalPage {lang} sections={p.sections} />
	</div>
</div>
