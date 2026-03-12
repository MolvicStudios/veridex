<script lang="ts">
	import { apiDrawerOpen, apiKeyStore } from '$lib/stores.js';
	import type { ApiKeySettings } from '$lib/stores.js';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';

	let { lang }: { lang: Lang } = $props();
	const t = $derived(getT(lang));
	const d = $derived(t.apiDrawer);

	// Local form state
	let provider = $state<ApiKeySettings['provider']>($apiKeyStore.provider);
	let model = $state($apiKeyStore.model);
	let key = $state($apiKeyStore.key);
	let showKey = $state(false);
	let howToOpen = $state(false);
	let toast = $state('');

	// Sync from store on open
	$effect(() => {
		if ($apiDrawerOpen) {
			provider = $apiKeyStore.provider;
			model = $apiKeyStore.model;
			key = $apiKeyStore.key;
		}
	});

	// Reset model when provider changes
	function onProviderChange(p: ApiKeySettings['provider']) {
		provider = p;
		model = d.models[p][0].id;
	}

	function save() {
		apiKeyStore.save({ provider, model, key: key.trim() });
		showToast(d.savedMsg);
	}

	function clear() {
		key = '';
		apiKeyStore.clear();
		provider = 'groq';
		model = d.models.groq[0].id;
		showToast(d.clearedMsg);
	}

	function showToast(msg: string) {
		toast = msg;
		setTimeout(() => (toast = ''), 3000);
	}

	function close() { apiDrawerOpen.set(false); }

	const hasKey = $derived(key.trim().length > 0);
	const currentProvider = $derived(d.providers[provider]);
	const currentModels = $derived(d.models[provider]);
</script>

<!-- Overlay -->
{#if $apiDrawerOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
		onclick={close}
	></div>

	<!-- Drawer panel -->
	<div
		class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col drawer-enter border-l border-slate-200 dark:border-slate-800 overflow-y-auto"
		role="dialog"
		aria-modal="true"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
			<div>
				<h2 class="font-bold text-lg">{d.title}</h2>
				<p class="text-sm text-slate-500 dark:text-slate-400">{d.subtitle}</p>
			</div>
			<button onclick={close} class="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-xl transition">✕</button>
		</div>

		<div class="p-5 space-y-5 flex-1">
			<!-- Status badge -->
			{#if hasKey}
				<div class="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
					<span class="text-base">✅</span>
					<span class="font-medium">{d.unlimitedBadge} — {d.savedMsg}</span>
				</div>
			{/if}

			<!-- Provider selector -->
			<div class="space-y-2">
				<p class="text-sm font-medium text-slate-700 dark:text-slate-300">{d.provider}</p>
				<div class="grid grid-cols-3 gap-2">
					{#each (['groq', 'mistral', 'openrouter'] as const) as p}
						<button
							onclick={() => onProviderChange(p)}
							class="p-3 rounded-xl border text-xs font-medium text-center transition {provider === p
								? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
								: 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'}"
						>
							<div class="font-semibold">{d.providers[p].name}</div>
							<div class="text-xs opacity-70 mt-0.5 hidden sm:block">{d.providers[p].description}</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Model selector -->
			<div class="space-y-2">
				<label for="model-select" class="text-sm font-medium text-slate-700 dark:text-slate-300">{d.model}</label>
				<select
					id="model-select"
					bind:value={model}
					class="input-field text-sm"
				>
					{#each currentModels as m}
						<option value={m.id}>{m.name}</option>
					{/each}
				</select>
			</div>

			<!-- API Key input -->
			<div class="space-y-2">
				<label for="api-key-input" class="text-sm font-medium text-slate-700 dark:text-slate-300">{d.apiKeyLabel}</label>
				<div class="relative">
					<input
						id="api-key-input"
						type={showKey ? 'text' : 'password'}
						bind:value={key}
						placeholder={d.apiKeyPlaceholder}
						class="input-field pr-20 font-mono text-sm"
						autocomplete="off"
						autocorrect="off"
						spellcheck="false"
					/>
					<button
						onclick={() => (showKey = !showKey)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 hover:text-blue-600 font-medium"
					>{showKey ? d.hideKey : d.showKey}</button>
				</div>
			</div>

			<!-- Action buttons -->
			<div class="flex gap-2">
				<button onclick={save} class="flex-1 btn-primary py-2.5 text-sm">{d.saveBtn}</button>
				{#if hasKey}
					<button onclick={clear} class="btn-secondary py-2.5 text-sm px-4">{d.clearBtn}</button>
				{/if}
			</div>

			<!-- Toast -->
			{#if toast}
				<div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-center text-slate-700 dark:text-slate-300 fade-up">
					{toast}
				</div>
			{/if}

			<!-- How to get key -->
			<div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
				<button
					onclick={() => (howToOpen = !howToOpen)}
					class="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left"
				>
					<span>🔑 {d.howToGet}</span>
					<span class="text-slate-400 transition-transform duration-200 {howToOpen ? 'rotate-180' : ''}">▼</span>
				</button>

				{#if howToOpen}
					<div class="border-t border-slate-200 dark:border-slate-700 p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-sm font-semibold">
								<span class="w-6 h-6 rounded-md bg-blue-500/15 text-blue-500 flex items-center justify-center text-xs font-bold">{currentProvider.name[0]}</span>
								{currentProvider.name}
								<a href={currentProvider.url} target="_blank" rel="noopener noreferrer" class="text-xs text-blue-500 hover:underline ml-auto">{currentProvider.urlText} ↗</a>
							</div>
							<ol class="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
								{#each currentProvider.steps as step, i}
									<li class="flex gap-2">
										<span class="w-5 h-5 rounded-full bg-blue-500/15 text-blue-500 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{i + 1}</span>
										{step}
									</li>
								{/each}
							</ol>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
