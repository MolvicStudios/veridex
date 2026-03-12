<script lang="ts">
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';

	let { lang, sections }: {
		lang: Lang;
		sections: Array<{ title: string; content: string }>;
		title?: string;
		lastUpdated?: string;
	} = $props();

	const t = $derived(getT(lang));
</script>

<article class="prose prose-slate dark:prose-invert max-w-none">
	{#each sections as section}
		<section class="mb-6">
			<h2 class="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">{section.title}</h2>
			<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{section.content}</p>
		</section>
	{/each}
</article>
