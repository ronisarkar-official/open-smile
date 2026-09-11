export async function GET() {
	const content = `# Open Smile

> Smile more, win more. A playful, on-device AI smile-recognition rewards platform.

## Overview
Open Smile is a gamified daily wellness and rewards platform. Users smile at their device camera, an on-device computer vision model measures the smile score (0-100), and points convert into coins that can be redeemed for real-world rewards including Amazon gift cards and merchant vouchers.

## Core Features
- **On-Device AI Smile Detection**: High-performance computer vision runs client-side in the browser. No raw photos or camera feeds are sent to external servers.
- **Instant Scratch Cards**: After scoring, an interactive scratch card reveals the won coin reward.
- **Daily Streaks**: Consecutive daily smiles unlock streak multipliers and rare badges.
- **Leaderboard**: Daily, weekly, and all-time smile rankings.
- **Voucher Marketplace**: Direct redemption of coin balances into gift cards.
- **Privacy & Security**: Liveness detection, anti-cheat image hashing, zero cloud storage of facial biometric data, and 24-hour auto-delete for opt-in public posts.

## Key Links
- Home: https://open-smile.vercel.app/
- Free Smile Demo: https://open-smile.vercel.app/try
- Join via Referral: https://open-smile.vercel.app/join
- Member Login: https://open-smile.vercel.app/login
- Member Signup: https://open-smile.vercel.app/signup
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400',
		},
	});
}
