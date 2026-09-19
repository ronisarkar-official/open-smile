export async function GET() {
	const rawBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';
	const baseUrl = rawBaseUrl.replace(/\/+$/, '');

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
- [Full LLM Documentation](${baseUrl}/llms-full.txt): Complete platform architecture, rules, coin economy, and anti-cheat documentation.
- [Home](${baseUrl}/): Main landing page with platform overview, live demo preview, and reward showcase.
- [Free Smile Demo](${baseUrl}/try): Interactive on-device camera smile detection demo without requiring an account.
- [Join via Referral](${baseUrl}/join): Onboarding and referral sign-up page for new participants.
- [Member Login](${baseUrl}/login): Account access and authentication portal.
- [Member Signup](${baseUrl}/signup): Registration page to create a new Open Smile account and earn coins.

## Optional
- [Leaderboard](${baseUrl}/leaderboard): Rankings for top daily, weekly, and all-time smiles.
- [Rewards Marketplace](${baseUrl}/rewards): Amazon gift card vouchers and badge achievement redemption.
- [Referral Program](${baseUrl}/refer): Referral code sharing to earn bonus coins.
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400',
		},
	});
}
