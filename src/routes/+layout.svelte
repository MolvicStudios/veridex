<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme, cookieConsent, dailyCount, apiKeyStore } from '$lib/stores.js';

	let { children } = $props();

	onMount(() => {
		theme.init();
		cookieConsent.load();
		dailyCount.load();
		apiKeyStore.load();
	});
</script>

{@render children()}
