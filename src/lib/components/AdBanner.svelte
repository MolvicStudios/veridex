<script lang="ts">
	import { cookieConsent } from '$lib/stores.js';
</script>

<!-- Google AdSense — only renders after consent -->
{#if $cookieConsent === 'accepted'}
	<div class="my-4 flex justify-center">
		<ins
			class="adsbygoogle"
			style="display:block;text-align:center;"
			data-ad-client="ca-pub-1513893788851225"
			data-ad-slot="auto"
			data-ad-format="auto"
			data-full-width-responsive="true"
		></ins>
	</div>
{/if}
