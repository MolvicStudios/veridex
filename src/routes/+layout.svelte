<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme, dailyCount, apiKeyStore } from '$lib/stores.js';

	let { children } = $props();

	onMount(() => {
		theme.init();
		dailyCount.load();
		apiKeyStore.load();
	});
</script>

{@render children()}
