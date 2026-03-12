import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { Lang } from '$lib/translations.js';

const VALID_LANGS: Lang[] = ['es', 'en'];

export const load: LayoutLoad = ({ params }) => {
	const lang = params.lang as Lang;
	if (!VALID_LANGS.includes(lang)) {
		throw error(404, 'Not found');
	}
	return { lang };
};
