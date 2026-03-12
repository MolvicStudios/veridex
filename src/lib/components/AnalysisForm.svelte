<script lang="ts">
	import { dailyCount, apiKeyStore, apiDrawerOpen } from '$lib/stores.js';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';
	import { isValidUrl } from '$lib/utils.js';
	import type { AnalysisResult } from '../../types/analysis.js';

	const FREE_LIMIT = 3;

	let { lang, onResult }: {
		lang: Lang;
		onResult: (r: AnalysisResult) => void;
	} = $props();

	const t = $derived(getT(lang));

	let tab = $state<'url' | 'text'>('url');
	let url = $state('');
	let text = $state('');
	let loading = $state(false);
	let error = $state('');
	let phase = $state<'idle' | 'fetching' | 'analyzing'>('idle');

	// Pre-fill from news item
	export function prefillUrl(u: string) {
		tab = 'url';
		url = u;
	}
	export function prefillText(txt: string) {
		tab = 'text';
		text = txt;
	}

	const hasOwnKey = $derived($apiKeyStore.key.trim().length > 0);
	const remaining = $derived(FREE_LIMIT - $dailyCount);
	const limitReached = $derived(!hasOwnKey && $dailyCount >= FREE_LIMIT);

	async function analyze() {
		error = '';
		const content = tab === 'url' ? url.trim() : text.trim();

		if (!content) { error = t.errors.emptyContent; return; }
		if (tab === 'url' && !isValidUrl(content)) { error = t.errors.invalidUrl; return; }
		if (tab === 'text' && content.length < 100) { error = t.errors.tooShort; return; }
		if (limitReached) return;

		loading = true;
		phase = 'idle';

		try {
			let articleContent = content;

			if (tab === 'url') {
				phase = 'fetching';
				const fetchRes = await fetch('/api/fetch', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: content })
				});
				if (!fetchRes.ok) { error = t.errors.fetchError; loading = false; phase = 'idle'; return; }
				const { text: fetched } = await fetchRes.json();
				if (!fetched || fetched.length < 100) { error = t.errors.fetchError; loading = false; phase = 'idle'; return; }
				articleContent = fetched;
			}

			phase = 'analyzing';
			const body: Record<string, unknown> = {
				content: articleContent,
				url: tab === 'url' ? content : undefined
			};

			if (hasOwnKey) {
				body.userKey = $apiKeyStore.key;
				body.provider = $apiKeyStore.provider;
				body.model = $apiKeyStore.model;
			}

			const res = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				error = j.error === 'invalid_key' ? t.errors.invalidApiKey : t.errors.analyzeError;
				loading = false; phase = 'idle'; return;
			}

			const result: AnalysisResult = await res.json();

			if (!hasOwnKey) dailyCount.increment();
			onResult(result);
		} catch {
			error = t.errors.analyzeError;
		} finally {
			loading = false;
			phase = 'idle';
		}
	}

	const btnLabel = $derived(
		phase === 'fetching' ? t.hero.fetching :
		phase === 'analyzing' ? t.hero.analyzing :
		t.hero.analyzeBtn
	);
</script>

<div class="space-y-4">
	<!-- Limit warning / counter -->
	{#if !hasOwnKey}
		{#if limitReached}
			<div class="card p-4 border-amber-500/30 bg-amber-500/5 space-y-2">
				<p class="font-semibold text-amber-500 text-sm">⚠️ {t.limits.title}</p>
				<p class="text-sm text-slate-600 dark:text-slate-400">{t.limits.message} {t.limits.resetMsg}</p>
				<button
					onclick={() => apiDrawerOpen.set(true)}
					class="text-sm text-blue-500 hover:underline font-medium"
				>🔑 {t.limits.useOwnKey}</button>
			</div>
		{:else if remaining <= 2}
			<p class="text-xs text-amber-500 text-right">{t.limits.remaining(remaining)}</p>
		{/if}
	{:else}
		<p class="text-xs text-emerald-500 text-right">∞ {t.apiDrawer.unlimitedBadge}</p>
	{/if}

	<!-- Tab selector -->
	<div class="flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800/50">
		<button
			onclick={() => (tab = 'url')}
			class="flex-1 py-2 text-sm font-medium rounded-lg transition {tab === 'url'
				? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
				: 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
		>🔗 {t.hero.tabUrl}</button>
		<button
			onclick={() => (tab = 'text')}
			class="flex-1 py-2 text-sm font-medium rounded-lg transition {tab === 'text'
				? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white'
				: 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
		>📄 {t.hero.tabText}</button>
	</div>

	<!-- Input -->
	{#if tab === 'url'}
		<input
			type="url"
			bind:value={url}
			placeholder={t.hero.urlPlaceholder}
			class="input-field"
			disabled={loading || limitReached}
			onkeydown={(e) => e.key === 'Enter' && analyze()}
			autocomplete="off"
		/>
	{:else}
		<textarea
			bind:value={text}
			placeholder={t.hero.textPlaceholder}
			class="input-field min-h-40 resize-y"
			disabled={loading || limitReached}
		></textarea>
	{/if}

	<!-- Error -->
	{#if error}
		<p class="text-sm text-red-500 flex items-center gap-1.5">⚠️ {error}</p>
	{/if}

	<!-- Submit -->
	<button
		onclick={analyze}
		disabled={loading || limitReached}
		class="w-full btn-primary py-3.5 text-base"
	>
		{#if loading}
			<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
		{/if}
		{btnLabel}
	</button>
</div>
