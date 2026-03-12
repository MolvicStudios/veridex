<script lang="ts">
	import { cookieConsent } from '$lib/stores.js';
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';

	let { lang }: { lang: Lang } = $props();
	const t = $derived(getT(lang));
	const visible = $derived($cookieConsent === null);
</script>

{#if visible}
	<div
		class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 card p-4 shadow-xl fade-up"
		role="dialog"
		aria-label="Cookie consent"
	>
		<p class="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
			{t.cookie.message}
			<a href="/{lang}/cookies" class="text-blue-500 hover:underline ml-1">{t.cookie.learnMore}</a>
		</p>
		<div class="flex gap-2">
			<button
				onclick={() => cookieConsent.accept()}
				class="flex-1 btn-primary py-2 text-sm"
			>{t.cookie.accept}</button>
			<button
				onclick={() => cookieConsent.reject()}
				class="flex-1 btn-secondary py-2 text-sm"
			>{t.cookie.reject}</button>
		</div>
	</div>
{/if}
