<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { cookieConsent } from '$lib/stores.js';

	let adRef = $state<HTMLElement | null>(null);
	let pushed = false;

	$effect(() => {
		if (browser && $cookieConsent === 'accepted' && adRef && !pushed) {
			pushed = true;
			try {
				((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
			} catch { /* ad blocked or not loaded */ }
		}
	});
</script>

<!-- Google AdSense — only renders after consent -->
{#if $cookieConsent === 'accepted'}
	<div class="my-4 flex justify-center">
		<ins
			bind:this={adRef}
			class="adsbygoogle"
			style="display:block;text-align:center;"
			data-ad-client="ca-pub-1513893788851225"
			data-ad-slot="auto"
			data-ad-format="auto"
			data-full-width-responsive="true"
		></ins>
	</div>
{/if}
