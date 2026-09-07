import type { MetadataRoute } from 'next';
import { getPublicProfilesForSitemap } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const rawBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';
	const baseUrl = rawBaseUrl.replace(/\/+$/, '');

	const staticLastModified = new Date('2026-09-07T00:00:00.000Z');

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${baseUrl}`,
			lastModified: staticLastModified,
		},
		{
			url: `${baseUrl}/try`,
			lastModified: staticLastModified,
		},
		{
			url: `${baseUrl}/login`,
			lastModified: staticLastModified,
		},
		{
			url: `${baseUrl}/signup`,
			lastModified: staticLastModified,
		},
	];

	try {
		const publicUsers = await getPublicProfilesForSitemap(500);
		const dynamicRoutes: MetadataRoute.Sitemap = publicUsers.map((user) => ({
			url: `${baseUrl}/u/${encodeURIComponent(user.username)}`,
			lastModified: user.updatedAt ? new Date(user.updatedAt) : staticLastModified,
		}));

		return [...staticRoutes, ...dynamicRoutes];
	} catch {
		return staticRoutes;
	}
}

