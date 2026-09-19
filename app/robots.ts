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
				allow: [
					'/',
					'/about',
					'/contact',
					'/try',
					'/join',
					'/privacy',
					'/terms',
					'/rules',
					'/cookies',
					'/security',
					'/u/',
					'/login',
					'/signup',
					'/llms.txt',
					'/llms-full.txt',
				],
				disallow: [
					'/admin/',
					'/api/',
					'/dashboard/',
					'/capture/',
					'/leaderboard/',
					'/rewards/',
					'/explore/',
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
				allow: [
					'/',
					'/about',
					'/contact',
					'/try',
					'/join',
					'/privacy',
					'/terms',
					'/rules',
					'/cookies',
					'/security',
					'/u/',
					'/llms.txt',
					'/llms-full.txt',
				],
				disallow: [
					'/admin/',
					'/api/',
					'/dashboard/',
					'/capture/',
					'/leaderboard/',
					'/rewards/',
					'/explore/',
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
