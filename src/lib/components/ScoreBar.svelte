<script lang="ts">
import { scoreColor, invertedScoreColor } from '$lib/utils.js';

let {
label,
description = '',
value,
inverted = false,
isCorroboration = false,
maxValue = 100
}: {
label: string;
description?: string;
value: number;
inverted?: boolean;
isCorroboration?: boolean;
maxValue?: number;
} = $props();

const pct = $derived(Math.round((value / maxValue) * 100));
const color = $derived(inverted ? invertedScoreColor(pct) : scoreColor(pct));
</script>

<div class="space-y-1.5">
<div class="flex items-center justify-between text-sm">
<div class="flex items-center gap-1.5">
<span class="font-medium text-slate-700 dark:text-slate-300">{label}</span>
{#if description}
<span class="relative group inline-flex">
<span class="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center cursor-help leading-none select-none">?</span>
<span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-slate-800 dark:bg-slate-600 text-white text-xs leading-snug shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 text-left">
{description}
<span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-600"></span>
</span>
</span>
{/if}
</div>
<span class="font-semibold tabular-nums {scoreColor(inverted ? 100 - pct : pct).replace('bg-', 'text-')}">
{isCorroboration ? `${value}/${maxValue}` : `${value}%`}
</span>
</div>
<div class="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
<div
class="h-full rounded-full score-bar {color}"
style="width: {pct}%"
></div>
</div>
</div>
