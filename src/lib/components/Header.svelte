<script lang="ts">
	import { theme, apiDrawerOpen, dailyCount, apiKeyStore } from '$lib/stores.js';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';

	let { lang }: { lang: Lang } = $props();
	const t = $derived(getT(lang));
	const hasOwnKey = $derived($apiKeyStore.key.trim().length > 0);
</script>

<header class="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60">
	<div class="container-app flex items-center justify-between h-14">
		<!-- Logo -->
		<a href="/{lang}" class="flex items-center gap-2 font-bold text-lg tracking-tight">
			<span class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black">P</span>
			<span class="hidden sm:block">Veridex<span class="text-slate-400 font-normal text-sm">.quest</span></span>
		</a>

		<!-- Nav -->
		<nav class="hidden md:flex items-center gap-5 text-sm text-slate-600 dark:text-slate-400">
			<a href="/{lang}" class="hover:text-slate-900 dark:hover:text-white transition">{t.nav.home}</a>
			<a href="/{lang}/privacy" class="hover:text-slate-900 dark:hover:text-white transition">{t.nav.privacy}</a>
			<a href="/{lang}/cookies" class="hover:text-slate-900 dark:hover:text-white transition">{t.nav.cookies}</a>
			<a href="/{lang}/terms" class="hover:text-slate-900 dark:hover:text-white transition">{t.nav.terms}</a>
		</nav>

		<!-- Actions -->
		<div class="flex items-center gap-2">
			<!-- Lang switcher -->
			<a
				href={lang === 'es' ? '/en' : '/es'}
				class="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
			>
				{lang === 'es' ? 'EN' : 'ES'}
			</a>

			<!-- API Key drawer toggle -->
			<button
				onclick={() => apiDrawerOpen.set(true)}
				class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition {hasOwnKey
					? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
					: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}"
			>
				{#if hasOwnKey}
					<span>∞</span>
					<span class="hidden sm:inline">{t.apiDrawer.unlimitedBadge}</span>
				{:else}
					<span>🔑</span>
					<span class="hidden sm:inline">{t.apiDrawer.title}</span>
				{/if}
			</button>

			<!-- Theme toggle -->
			<button
				onclick={() => theme.toggle()}
				class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition text-base"
				aria-label="Toggle theme"
			>
				{$theme === 'dark' ? '☀️' : '🌙'}
			</button>
		</div>
	</div>
</header>
