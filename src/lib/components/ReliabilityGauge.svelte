<script lang="ts">
	import { scoreTextColor } from '$lib/utils.js';

	let { value }: { value: number } = $props();

	const clamp = $derived(Math.min(100, Math.max(0, value)));
	// rotate from -90deg (0%) to +90deg (100%)
	const deg = $derived(-90 + (clamp / 100) * 180);
	const color = $derived(scoreTextColor(clamp));

	const gradientId = `gauge-grad-${Math.random().toString(36).slice(2)}`;
</script>

<div class="flex flex-col items-center gap-3">
	<div class="relative w-44 h-24 overflow-hidden">
		<!-- Semi-circle track -->
		<svg viewBox="0 0 200 100" class="w-full h-full">
			<defs>
				<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stop-color="#ef4444" />
					<stop offset="50%" stop-color="#f59e0b" />
					<stop offset="100%" stop-color="#10b981" />
				</linearGradient>
			</defs>
			<!-- Background track -->
			<path
				d="M 15 95 A 85 85 0 0 1 185 95"
				fill="none"
				stroke="currentColor"
				stroke-width="16"
				stroke-linecap="round"
				class="text-slate-200 dark:text-slate-700"
			/>
			<!-- Colored arc -->
			<path
				d="M 15 95 A 85 85 0 0 1 185 95"
				fill="none"
				stroke="url(#{gradientId})"
				stroke-width="16"
				stroke-linecap="round"
				stroke-dasharray="267"
				stroke-dashoffset={267 - (clamp / 100) * 267}
				class="transition-all duration-1000 ease-out"
			/>
			<!-- Needle -->
			<g transform="translate(100 95)">
				<line
					x1="0"
					y1="0"
					x2="0"
					y2="-68"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					class="text-slate-800 dark:text-white gauge-needle"
					style="--to: {deg}deg; transform-origin: 0 0; transform: rotate({deg}deg)"
				/>
				<circle cx="0" cy="0" r="5" class="text-slate-800 dark:text-white fill-current" />
			</g>
		</svg>
	</div>

	<!-- Score number -->
	<div class="text-center -mt-4">
		<div class="text-4xl font-black {color} tabular-nums">{clamp}</div>
		<div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">/ 100</div>
	</div>
</div>
