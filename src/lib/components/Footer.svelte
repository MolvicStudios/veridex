<script lang="ts">
	import type { Lang } from '$lib/translations.js';
	import { getT } from '$lib/translations.js';

	let { lang }: { lang: Lang } = $props();
	const t = $derived(getT(lang));
	const year = new Date().getFullYear();
</script>

<footer class="mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
	<div class="container-app py-10">
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
			<!-- Brand -->
			<div>
				<div class="flex items-center gap-2 font-bold text-base mb-2">
					<span class="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black">P</span>
					Prospectly.shop
				</div>
				<p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.footer.tagline}</p>
				<p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.nav.by} <a href="https://molvicstudios.pro" class="hover:text-blue-500 transition" target="_blank" rel="noopener noreferrer">MolvicStudios.pro</a></p>
			</div>

			<!-- Nav -->
			<div>
				<p class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{t.footer.links}</p>
				<ul class="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
					<li><a href="/{lang}" class="hover:text-blue-500 transition">{t.nav.home}</a></li>
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<p class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{t.footer.legal}</p>
				<ul class="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
					<li><a href="/{lang}/privacy" class="hover:text-blue-500 transition">{t.nav.privacy}</a></li>
					<li><a href="/{lang}/cookies" class="hover:text-blue-500 transition">{t.nav.cookies}</a></li>
					<li><a href="/{lang}/terms" class="hover:text-blue-500 transition">{t.nav.terms}</a></li>
				</ul>
			</div>
		</div>

		<div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
			<p>© {year} MolvicStudios.pro. {t.footer.rights}</p>
			<p class="text-center max-w-md opacity-70">{t.disclaimer}</p>
		</div>
	</div>
</footer>
