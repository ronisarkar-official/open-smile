export async function GET() {
	const rawBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';
	const baseUrl = rawBaseUrl.replace(/\/+$/, '');

	const content = `# Open Smile — Full Platform & Architecture Documentation

> Smile more, win more. Open Smile is a gamified, privacy-first rewards platform where daily smiles captured through client-side computer vision convert into real gift vouchers.

## 1. Executive Overview
Open Smile is a wellness and engagement platform combining computer vision with gamified retention mechanics. Users access the app directly via desktop or mobile web browsers. A lightweight client-side computer vision model measures smile intensity and authenticity (0–100). Validated scores reward users with coins via an interactive post-capture scratch card. Coins can be accumulated and redeemed for Amazon gift cards and partner vouchers.

## 2. Core Gameplay Loop
1. **Camera Initiation**: User grants browser camera permissions. The video stream is processed entirely within the local browser context via HTML5 Canvas and client-side computer vision models (MediaPipe Face Landmarker / face-api.js).
2. **Liveness & Anti-Spoofing Check**: Before scoring, active liveness verification ensures the presence of a live human subject through blink detection and facial landmark tracking.
3. **Smile Scoring (0–100)**: The client model measures facial landmarks (mouth corner elevation, eye constriction, lip curvature) to compute an authenticity score.
4. **Reward Calculation**:
   - Scores below 40: Warm encouragement, no coins awarded.
   - Scores 40–69: Base coin tier.
   - Scores 70–89: Silver tier with bonus multiplier.
   - Scores 90–100: Gold tier with maximum coin payout and rare badge unlocks.
5. **Interactive Scratch Card**: An interactive canvas-based scratch card reveals the won coin reward.
6. **Streaks & Multipliers**: Users who capture smiles daily maintain consecutive streaks, unlocking multiplier bonuses and tiered trophies.

## 3. Anti-Cheat & Integrity Layer
Maintaining an honest reward economy is central to Open Smile. The platform employs layered defenses:
- **Client-Side Liveness Detection**: Blocks static photos, screens, and pre-recorded videos using real-time motion and blink verification.
- **Perceptual Image Hashing (pHash)**: Re-submitted or re-photographed images are detected and rejected by comparing Hamming distances against prior submissions.
- **Capture Cooldowns**: Enforces a strict cooldown between captures, derived dynamically from the timestamp of the latest capture.
- **Daily Capture Caps**: Prevents automated farming by capping rewarded captures per user per day.
- **Referral Safeguards**: Per-referrer daily reward caps to prevent bot syndicates from draining the voucher pool.

## 4. Privacy & Biometrics Posture
- **Zero Facial Data Retention**: Raw video feeds, face meshes, and facial biometric feature vectors are never transmitted to or stored on any server.
- **Client-Side Inference**: All neural network inference takes place locally inside the user's browser sandbox.
- **Ephemerality**: Any photo optionally shared to the public Explore feed is stored with a strict 24-hour auto-deletion lifecycle. Public sharing is strictly opt-in; captures are private by default.

## 5. Economy & Coin Ledger
- **Append-Only Auditing**: Balances are never maintained as a single mutable database column. Every coin movement (signup bonus, daily smile capture, streak bonus, referral reward, voucher redemption) is an immutable insert into an auditable ledger table. Current balance equals the sum of all positive and negative ledger movements.
- **Voucher Marketplace**: Users exchange coins for digital voucher codes from merchants such as Amazon, delivered securely to their verified email address.

## 6. Public Pages & Site Navigation
- [Home Page](${baseUrl}/): Overview, interactive preview, and core mechanics.
- [Smile Demo](${baseUrl}/try): Instant browser webcam smile test with no account required.
- [Join via Referral](${baseUrl}/join): Referral-linked registration flow.
- [Member Login](${baseUrl}/login): Authentication portal for existing smilers.
- [Member Registration](${baseUrl}/signup): Account creation and email-OTP verification.
- [Daily Leaderboard](${baseUrl}/leaderboard): Daily, weekly, and monthly smile rankings.
- [Rewards Marketplace](${baseUrl}/rewards): Voucher redemption catalog and badge gallery.
- [Referral Hub](${baseUrl}/refer): Referral code management and invite tracking.
- [Public Smiler Profiles](${baseUrl}/u/): Shareable smiler profile pages showcasing streak badges and statistics.

## 7. Companion Endpoints
- [LLMs Index](${baseUrl}/llms.txt): Concise index and link structure for fast agentic navigation.
- [Main Sitemap XML](${baseUrl}/sitemap.xml): Machine-readable index of core application pages.
- [Smiler Profiles Sitemap XML](${baseUrl}/sitemap-users.xml): Dedicated index of public smiler profile pages.
- [Robots TXT](${baseUrl}/robots.txt): Crawler rules and crawl-delay policies.
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400',
		},
	});
}
