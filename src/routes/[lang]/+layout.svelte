<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import ApiKeyDrawer from '$lib/components/ApiKeyDrawer.svelte';
	import type { Lang } from '$lib/translations.js';
	import { cookieConsent } from '$lib/stores.js';

	let { data, children } = $props();
	const lang = $derived(data.lang as Lang);

	// Load AdSense script only after consent
	$effect(() => {
		if (browser && $cookieConsent === 'accepted') {
			if (!document.querySelector('script[src*="adsbygoogle"]')) {
				const s = document.createElement('script');
				s.async = true;
				s.crossOrigin = 'anonymous';
				s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1513893788851225';
				document.head.appendChild(s);
			}
		}
	});
</script>

<Header {lang} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer {lang} />
<CookieBanner {lang} />
<ApiKeyDrawer {lang} />
