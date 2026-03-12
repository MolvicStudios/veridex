import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	// Detect browser language preference
	const accept = request.headers.get('accept-language') ?? '';
	const lang = accept.toLowerCase().startsWith('es') ? 'es' : 'en';
	throw redirect(302, `/${lang}`);
};
