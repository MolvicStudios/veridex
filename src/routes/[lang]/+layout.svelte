<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import ApiKeyDrawer from '$lib/components/ApiKeyDrawer.svelte';
	import type { Lang } from '$lib/translations.js';

	let { data, children } = $props();
	const lang = $derived(data.lang as Lang);
</script>

<svelte:head>
	<!-- Google AdSense -->
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1513893788851225" crossorigin="anonymous"></script>
</svelte:head>

<Header {lang} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer {lang} />
<CookieBanner {lang} />
<ApiKeyDrawer {lang} />
