<script lang="ts">
import { apiDrawerOpen, apiKeyStore } from '$lib/stores.js';
import type { ProviderId } from '$lib/stores.js';
import type { Lang } from '$lib/translations.js';
import { getT } from '$lib/translations.js';

let { lang }: { lang: Lang } = $props();
const t = $derived(getT(lang));
const d = $derived(t.apiDrawer);

let keys = $state({
groq: $apiKeyStore.groq.key,
mistral: $apiKeyStore.mistral.key,
openai: $apiKeyStore.openai.key,
google: $apiKeyStore.google.key,
anthropic: $apiKeyStore.anthropic.key,
xai: $apiKeyStore.xai.key,
deepseek: $apiKeyStore.deepseek.key
});
let models = $state({
groq: $apiKeyStore.groq.model,
mistral: $apiKeyStore.mistral.model,
openai: $apiKeyStore.openai.model,
google: $apiKeyStore.google.model,
anthropic: $apiKeyStore.anthropic.model,
xai: $apiKeyStore.xai.model,
deepseek: $apiKeyStore.deepseek.model
});
let showKeys = $state({ groq: false, mistral: false, openai: false, google: false, anthropic: false, xai: false, deepseek: false });
let activeProvider = $state<ProviderId>($apiKeyStore.activeProvider);
let toast = $state('');

$effect(() => {
if ($apiDrawerOpen) {
keys = {
groq: $apiKeyStore.groq.key,
mistral: $apiKeyStore.mistral.key,
openai: $apiKeyStore.openai.key,
google: $apiKeyStore.google.key,
anthropic: $apiKeyStore.anthropic.key,
xai: $apiKeyStore.xai.key,
deepseek: $apiKeyStore.deepseek.key
};
models = {
groq: $apiKeyStore.groq.model,
mistral: $apiKeyStore.mistral.model,
openai: $apiKeyStore.openai.model,
google: $apiKeyStore.google.model,
anthropic: $apiKeyStore.anthropic.model,
xai: $apiKeyStore.xai.model,
deepseek: $apiKeyStore.deepseek.model
};
activeProvider = $apiKeyStore.activeProvider;
}
});

function saveProvider(p: ProviderId) {
apiKeyStore.saveProvider(p, { key: keys[p].trim(), model: models[p] });
if (keys[p].trim()) {
activeProvider = p;
apiKeyStore.setActive(p);
}
showToast(d.savedMsg);
}

function clearProvider(p: ProviderId) {
keys[p] = '';
apiKeyStore.clearProvider(p);
showToast(d.clearedMsg);
}

function setActive(p: ProviderId) {
activeProvider = p;
apiKeyStore.setActive(p);
}

function showToast(msg: string) {
toast = msg;
setTimeout(() => (toast = ''), 3000);
}

function close() { apiDrawerOpen.set(false); }

const providers: ProviderId[] = ['groq', 'mistral', 'openai', 'google', 'anthropic', 'xai', 'deepseek'];
const savedCount = $derived(providers.filter(p => $apiKeyStore[p].key.trim()).length);
</script>

{#if $apiDrawerOpen}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onclick={close}></div>

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

<div class="p-5 space-y-4 flex-1">
{#if savedCount > 0}
<div class="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
<span>✅</span>
<span class="font-medium">{d.unlimitedBadge} · {savedCount} {savedCount === 1 ? 'proveedor configurado' : 'proveedores configurados'}</span>
</div>
{/if}

{#each providers as p}
{@const pd = d.providers[p]}
{@const modelList = d.models[p]}
{@const hasKey = keys[p].trim().length > 0}
{@const isActive = activeProvider === p}

<div class="border rounded-xl overflow-hidden transition-colors {isActive && hasKey ? 'border-blue-500 dark:border-blue-400' : 'border-slate-200 dark:border-slate-700'}">
<!-- Provider header row -->
<div class="flex items-center gap-3 px-4 py-3 {isActive && hasKey ? 'bg-blue-500/5' : 'bg-slate-50 dark:bg-slate-800/50'}">
<div class="flex-1 min-w-0">
<div class="flex items-center gap-2 flex-wrap">
<span class="font-semibold text-sm">{pd.name}</span>
{#if hasKey}
<span class="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">✓ guardada</span>
{/if}
{#if isActive && hasKey}
<span class="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium">● activo</span>
{/if}
</div>
<p class="text-xs text-slate-400 truncate mt-0.5">{pd.description}</p>
</div>
{#if hasKey && !isActive}
<button
onclick={() => setActive(p)}
class="text-xs px-3 py-1.5 rounded-lg border border-blue-400 text-blue-500 hover:bg-blue-500/10 transition font-medium flex-shrink-0"
>Usar</button>
{/if}
</div>

<!-- Provider body -->
<div class="p-4 space-y-3 border-t border-slate-200 dark:border-slate-700">
<div class="space-y-1.5">
<label for="model-{p}" class="text-xs font-medium text-slate-600 dark:text-slate-400">{d.model}</label>
<select id="model-{p}" bind:value={models[p]} class="input-field text-sm py-2">
{#each modelList as m}
<option value={m.id}>{m.name}</option>
{/each}
</select>
</div>

<div class="space-y-1.5">
<label for="key-{p}" class="text-xs font-medium text-slate-600 dark:text-slate-400">{d.apiKeyLabel}</label>
<div class="relative">
<input
id="key-{p}"
type={showKeys[p] ? 'text' : 'password'}
bind:value={keys[p]}
placeholder={d.apiKeyPlaceholder}
class="input-field pr-16 font-mono text-xs"
autocomplete="off"
autocorrect="off"
spellcheck="false"
/>
<button
onclick={() => (showKeys[p] = !showKeys[p])}
class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 hover:text-blue-600 font-medium"
>{showKeys[p] ? d.hideKey : d.showKey}</button>
</div>
</div>

<div class="flex gap-2">
<button onclick={() => saveProvider(p)} class="flex-1 btn-primary py-2 text-xs">{d.saveBtn}</button>
{#if hasKey}
<button onclick={() => clearProvider(p)} class="btn-secondary py-2 text-xs px-3">{d.clearBtn}</button>
{/if}
</div>

<a href={pd.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-xs text-blue-500 hover:underline">
🔑 {d.howToGet} — {pd.name} ↗
</a>
</div>
</div>
{/each}

{#if toast}
<div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-center text-slate-700 dark:text-slate-300 fade-up">
{toast}
</div>
{/if}
</div>
</div>
{/if}
