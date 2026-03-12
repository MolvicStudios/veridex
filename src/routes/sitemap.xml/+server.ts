import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const pages = ['', '/privacy', '/cookies', '/terms'];
	const langs = ['es', 'en'];

	const urls = langs.flatMap(lang =>
		pages.map(page => `
		<url>
			<loc>https://veridex.quest/${lang}${page}</loc>
			<changefreq>${page === '' ? 'daily' : 'monthly'}</changefreq>
			<priority>${page === '' ? '1.0' : '0.3'}</priority>
		</url>`)
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
