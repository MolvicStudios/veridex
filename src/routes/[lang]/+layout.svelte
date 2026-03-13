<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import ApiKeyDrawer from '$lib/components/ApiKeyDrawer.svelte';
	import type { Lang } from '$lib/translations.js';
	let { data, children } = $props();
	const lang = $derived(data.lang as Lang);
</script>

<Header {lang} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer {lang} />
<CookieBanner {lang} />
<ApiKeyDrawer {lang} />
