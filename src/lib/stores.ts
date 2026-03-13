import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { AnalysisResult } from '../types/analysis.js';

// ── Theme ──────────────────────────────────────────────────────────────────
function createThemeStore() {
	const { subscribe, set, update } = writable<'dark' | 'light'>('dark');

	function init() {
		if (!browser) return;
		const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
		const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		const theme = saved ?? preferred;
		set(theme);
		apply(theme);
	}

	function toggle() {
		update((t) => {
			const next = t === 'dark' ? 'light' : 'dark';
			if (browser) { localStorage.setItem('theme', next); apply(next); }
			return next;
		});
	}

	function apply(t: 'dark' | 'light') {
		document.documentElement.classList.toggle('dark', t === 'dark');
	}

	return { subscribe, init, toggle };
}
export const theme = createThemeStore();

// ── Daily counter (3 free analyses/day) ───────────────────────────────────
function createCounterStore() {
	const { subscribe, set, update } = writable(0);

	function load() {
		if (!browser) return;
		const today = new Date().toDateString();
		if (localStorage.getItem('daily_day') !== today) {
			localStorage.setItem('daily_day', today);
			localStorage.setItem('daily_count', '0');
			set(0);
		} else {
			set(Number(localStorage.getItem('daily_count')) || 0);
		}
	}

	function increment() {
		if (!browser) return;
		update((n) => {
			const next = n + 1;
			localStorage.setItem('daily_count', String(next));
			return next;
		});
	}

	return { subscribe, load, increment };
}
export const dailyCount = createCounterStore();

// ── API key settings ───────────────────────────────────────────────────────
export type ProviderId = 'groq' | 'mistral' | 'openai' | 'google' | 'anthropic' | 'xai' | 'deepseek';

export interface ProviderConfig {
	key: string;
	model: string;
}

export interface ApiKeySettings {
	activeProvider: ProviderId;
	groq: ProviderConfig;
	mistral: ProviderConfig;
	openai: ProviderConfig;
	google: ProviderConfig;
	anthropic: ProviderConfig;
	xai: ProviderConfig;
	deepseek: ProviderConfig;
}

const API_KEY_DEFAULTS: ApiKeySettings = {
	activeProvider: 'groq',
	groq: { key: '', model: 'llama-3.3-70b-versatile' },
	mistral: { key: '', model: 'mistral-small-latest' },
	openai: { key: '', model: 'gpt-4o-mini' },
	google: { key: '', model: 'gemini-2.0-flash' },
	anthropic: { key: '', model: 'claude-3-5-haiku-20241022' },
	xai: { key: '', model: 'grok-3-mini' },
	deepseek: { key: '', model: 'deepseek-chat' }
};

function createApiKeyStore() {
	const { subscribe, set, update } = writable<ApiKeySettings>(API_KEY_DEFAULTS);

	function load() {
		if (!browser) return;
		const raw = localStorage.getItem('veridex_api');
		if (raw) {
			try {
				const parsed = JSON.parse(raw);
				// Migrate old format (single key/provider/model)
				if ('key' in parsed && !('groq' in parsed)) {
					const migrated: ApiKeySettings = { ...API_KEY_DEFAULTS };
					if (parsed.provider && parsed.key) {
						migrated[parsed.provider as ProviderId] = { key: parsed.key, model: parsed.model || '' };
						migrated.activeProvider = parsed.provider;
					}
					set(migrated);
				} else {
					set({ ...API_KEY_DEFAULTS, ...parsed });
				}
			} catch { /* ignore */ }
		}
	}

	function saveProvider(provider: ProviderId, config: ProviderConfig) {
		update(s => {
			const next = { ...s, [provider]: config };
			if (browser) localStorage.setItem('veridex_api', JSON.stringify(next));
			return next;
		});
	}

	function setActive(provider: ProviderId) {
		update(s => {
			const next = { ...s, activeProvider: provider };
			if (browser) localStorage.setItem('veridex_api', JSON.stringify(next));
			return next;
		});
	}

	function clearProvider(provider: ProviderId) {
		update(s => {
			const next = { ...s, [provider]: { ...API_KEY_DEFAULTS[provider] } };
			if (browser) localStorage.setItem('veridex_api', JSON.stringify(next));
			return next;
		});
	}

	function clearAll() {
		set(API_KEY_DEFAULTS);
		if (browser) localStorage.removeItem('veridex_api');
	}

	return { subscribe, load, saveProvider, setActive, clearProvider, clearAll };
}
export const apiKeyStore = createApiKeyStore();


// ── Shared analysis result (used between form and result page) ─────────────
export const currentResult = writable<AnalysisResult | null>(null);

// ── Drawer open state ──────────────────────────────────────────────────────
export const apiDrawerOpen = writable(false);
