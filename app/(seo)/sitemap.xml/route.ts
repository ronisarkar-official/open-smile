export async function GET() {
	const rawBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';
	const baseUrl = rawBaseUrl.replace(/\/+$/, '');

	const now = new Date().toISOString();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-users.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
		},
	});
}
