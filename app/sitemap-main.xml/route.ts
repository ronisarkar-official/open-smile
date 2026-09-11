export async function GET() {
	const rawBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';
	const baseUrl = rawBaseUrl.replace(/\/+$/, '');

	const staticLastModified = '2026-09-07T00:00:00.000Z';

	const staticRoutes = [
		{ url: `${baseUrl}`, lastmod: staticLastModified, changefreq: 'daily', priority: '1.0' },
		{ url: `${baseUrl}/try`, lastmod: staticLastModified, changefreq: 'weekly', priority: '0.9' },
		{ url: `${baseUrl}/login`, lastmod: staticLastModified, changefreq: 'monthly', priority: '0.5' },
		{ url: `${baseUrl}/signup`, lastmod: staticLastModified, changefreq: 'monthly', priority: '0.8' },
	];

	const urls = staticRoutes
		.map(
			(route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400',
		},
	});
}
