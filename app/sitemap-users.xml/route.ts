import { getPublicProfilesForSitemap } from '@/lib/db';

export async function GET() {
	const rawBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';
	const baseUrl = rawBaseUrl.replace(/\/+$/, '');

	let profiles: Array<{ username: string; updatedAt?: Date | string | null }> = [];
	try {
		profiles = await getPublicProfilesForSitemap(500);
	} catch {
		profiles = [];
	}

	const fallbackDate = new Date().toISOString();

	const urls = profiles
		.map((profile) => {
			const loc = `${baseUrl}/u/${encodeURIComponent(profile.username)}`;
			const lastmod = profile.updatedAt
				? new Date(profile.updatedAt).toISOString()
				: fallbackDate;
			return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
		},
	});
}
