import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const accept = request.headers.get('accept-language') ?? '';
	const lang = accept.toLowerCase().startsWith('es') ? 'es' : 'en';
	throw redirect(302, `/${lang}`);
};
