import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';

	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/', '/try', '/join', '/u/', '/login', '/signup', '/llms.txt'],
				disallow: [
					'/admin/',
					'/api/',
					'/dashboard/',
					'/capture/',
					'/profile/',
					'/notifications/',
					'/refer/',
					'/streak/',
					'/verify-otp/',
					'/reset-password/',
					'/forgot-password/',
					'/offline/',
				],
			},
			{
				userAgent: ['GPTBot', 'ClaudeBot', 'Bytespider', 'CCBot'],
				disallow: ['/'],
			},
			{
				userAgent: ['ChatGPT-User', 'PerplexityBot'],
				allow: ['/', '/try', '/join', '/u/', '/llms.txt'],
				disallow: [
					'/admin/',
					'/api/',
					'/dashboard/',
					'/capture/',
					'/profile/',
					'/notifications/',
					'/refer/',
					'/streak/',
					'/verify-otp/',
					'/reset-password/',
					'/forgot-password/',
					'/offline/',
				],
			},
		],
		sitemap: `${baseUrl.replace(/\/+$/, '')}/sitemap.xml`,
	};
}
