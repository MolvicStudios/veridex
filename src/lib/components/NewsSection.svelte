<script lang="ts">
	import type { NewsItem } from '../../types/analysis.js';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';

	let {
		lang,
		items = [],
		loading = false,
		error = false,
		onVerify
	}: {
		lang: Lang;
		items?: NewsItem[];
		loading?: boolean;
		error?: boolean;
		onVerify: (item: NewsItem) => void;
	} = $props();

	const t = $derived(getT(lang));
	const n = $derived(t.news);
</script>

<section class="mt-16">
	<!-- Section header -->
	<div class="flex items-end justify-between mb-6">
		<div>
			<div class="flex items-center gap-2 mb-1">
				<span class="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500"></span>
				<h2 class="text-xl font-bold">{n.title}</h2>
			</div>
			<p class="text-slate-500 dark:text-slate-400 text-sm pl-3">{n.subtitle}</p>
		</div>
		<div class="text-2xl animate-pulse">📡</div>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(6) as _}
				<div class="card p-4 space-y-3 animate-pulse">
					<div class="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
					<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
					<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
					<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
				</div>
			{/each}
		</div>
	{:else if error}
		<div class="card p-8 text-center text-slate-500 dark:text-slate-400">
			<p class="text-3xl mb-2">📰</p>
			<p class="text-sm">{n.error}</p>
		</div>
	{:else if items.length === 0}
		<div class="card p-8 text-center text-slate-500 dark:text-slate-400">
			<p class="text-3xl mb-2">📰</p>
			<p class="text-sm">{n.noNews}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each items as item, i}
				<article
					class="card flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 fade-up"
					style="animation-delay: {i * 60}ms"
				>
					<!-- Thumbnail -->
					{#if item.thumbnail}
						<div class="h-36 overflow-hidden bg-slate-100 dark:bg-slate-800">
							<img
								src={item.thumbnail}
								alt={item.title}
								class="w-full h-full object-cover"
								loading="lazy"
								onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
							/>
						</div>
					{:else}
						<div class="h-24 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 flex items-center justify-center text-3xl">📰</div>
					{/if}

					<!-- Content -->
					<div class="p-4 flex flex-col flex-1 gap-2">
						{#if item.source}
							<span class="text-xs font-semibold text-blue-500 uppercase tracking-wide">{item.source}</span>
						{/if}
						<h3 class="text-sm font-semibold leading-snug line-clamp-3 text-slate-800 dark:text-slate-100">{item.title}</h3>
						{#if item.description}
							<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">{item.description}</p>
						{/if}

						<!-- Date -->
						{#if item.pubDate}
							<p class="text-xs text-slate-400">{item.pubDate}</p>
						{/if}

						<!-- Actions -->
						<div class="flex gap-2 pt-1 mt-auto">
							<button
								onclick={() => onVerify(item)}
								class="flex-1 btn-primary py-1.5 text-xs"
							>🔍 {n.verifyBtn}</button>
							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-secondary py-1.5 text-xs px-3"
							>↗</a>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>
