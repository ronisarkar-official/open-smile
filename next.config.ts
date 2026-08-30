import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Pragmatic CSP: 'unsafe-inline' is required for Next.js inline
// bootstrap scripts + the theme init script. It still blocks data:
// injection, mixed content and arbitrary vendor scripts.
const scriptSrc = ["'self'", "'unsafe-inline'"];
if (isDev) {
	scriptSrc.push("'unsafe-eval'"); // Turbopack dev may eval modules
	scriptSrc.push('https://va.vercel-scripts.com'); // Vercel Analytics in development
}

const connectSrc = ["'self'", 'https://*.imagekit.io'];
if (isDev) {
	connectSrc.push('ws:', 'wss:'); // dev HMR websockets
	connectSrc.push('https://va.vercel-scripts.com'); // Vercel Analytics in development
}

const cspParts = [
	`default-src 'self'`,
	`script-src ${scriptSrc.join(' ')} 'wasm-unsafe-eval'`,
	`style-src 'self' 'unsafe-inline'`,
	`img-src 'self' data: blob: https://ik.imagekit.io https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://xubohuah.github.io https://images.unsplash.com https://i.pravatar.cc`,
	`font-src 'self' data:`,
	`connect-src ${connectSrc.join(' ')}`,
	`media-src 'self' blob: data:`,
	`worker-src 'self' blob:`,
	`frame-src 'self'`,
	`frame-ancestors 'none'`,
	`base-uri 'self'`,
	`form-action 'self'`,
	`object-src 'none'`,
];
// Only force HTTPS in production — local dev serves over http.
if (!isDev) cspParts.push(`upgrade-insecure-requests`);
const ContentSecurityPolicy = cspParts.join('; ');

const securityHeaders = [
	{ key: 'Content-Security-Policy', value: ContentSecurityPolicy },
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload',
	},
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(self), microphone=(), geolocation=(), interest-cohort=()',
	},
];

const nextConfig: NextConfig = {
	allowedDevOrigins: ['*', '192.168.29.78'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'xubohuah.github.io',
			},
			{
				protocol: 'https',
				hostname: 'ik.imagekit.io',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'i.pravatar.cc',
			},
		],
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: securityHeaders,
			},
		];
	},
};

export default nextConfig;
