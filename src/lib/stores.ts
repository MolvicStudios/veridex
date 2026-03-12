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
export interface ApiKeySettings {
	provider: 'groq' | 'mistral' | 'openrouter';
	key: string;
	model: string;
}

const API_KEY_DEFAULTS: ApiKeySettings = {
	provider: 'groq',
	key: '',
	model: 'llama-3.3-70b-versatile'
};

function createApiKeyStore() {
	const { subscribe, set } = writable<ApiKeySettings>(API_KEY_DEFAULTS);

	function load() {
		if (!browser) return;
		const raw = localStorage.getItem('prospectly_api');
		if (raw) { try { set(JSON.parse(raw)); } catch { /* ignore */ } }
	}

	function save(s: ApiKeySettings) {
		set(s);
		if (browser) localStorage.setItem('prospectly_api', JSON.stringify(s));
	}

	function clear() {
		set(API_KEY_DEFAULTS);
		if (browser) localStorage.removeItem('prospectly_api');
	}

	return { subscribe, load, save, clear };
}
export const apiKeyStore = createApiKeyStore();

// ── Cookie consent ─────────────────────────────────────────────────────────
function createCookieStore() {
	const { subscribe, set } = writable<'accepted' | 'rejected' | null>(null);

	function load() {
		if (!browser) return;
		set(localStorage.getItem('cookie_consent') as 'accepted' | 'rejected' | null);
	}
	function accept() { set('accepted'); if (browser) localStorage.setItem('cookie_consent', 'accepted'); }
	function reject() { set('rejected'); if (browser) localStorage.setItem('cookie_consent', 'rejected'); }

	return { subscribe, load, accept, reject };
}
export const cookieConsent = createCookieStore();

// ── Shared analysis result (used between form and result page) ─────────────
export const currentResult = writable<AnalysisResult | null>(null);

// ── Drawer open state ──────────────────────────────────────────────────────
export const apiDrawerOpen = writable(false);
