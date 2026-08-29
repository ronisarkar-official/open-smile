# PRD — Open Smile

**Status:** Draft — core auth/infra built, core product loop not yet scaffolded
**Owner:** Roni Sarkar
**Context:** AI Unleashed hackathon submission

---

## 1. Summary

Open Smile is a gamified, AI-powered smile-recognition rewards platform. Users capture a photo through the browser, an on-device model scores how genuinely they're smiling, and that score converts into coins. Coins accumulate toward real rewards (Amazon gift vouchers). A live leaderboard (daily/weekly/monthly) and a referral system drive repeat engagement.

**One-line pitch:** *"Duolingo streaks meet facial AI — smile more, win more."*

## 2. Problem Statement

Most "AI + webcam" demo projects stop at binary detection (smiling: yes/no) — a novelty with no depth, no reason to return, and no defense against trivial abuse. There's no product in this space that treats smile detection as a *measurable, gameable, and rewarding* mechanic the way fitness or language apps treat streaks. Open Smile fills that gap: real facial-geometry scoring, a real coin economy, and retention mechanics borrowed from proven gamification patterns (Duolingo streaks, Snapchat streak grace windows, scratch-card reveal psychology).

## 3. Goals

- Ship a working, demoable core loop: capture → score → coin reward → leaderboard.
- Make the scoring mechanic feel legitimate (real landmark-based geometry, not a gimmick), so it survives judge scrutiny.
- Build in anti-cheat from the start, not as a bolt-on — this is the first question judges will ask.
- Keep the privacy story genuinely true: minimal retention, opt-in publishing, client-side scoring where possible.
- Drive organic growth through referrals and shareable result cards, not paid acquisition.

### Non-Goals (for this phase)
- Real payment/voucher API integration — voucher codes are pre-seeded for demo purposes.
- Mobile native app — web only.
- Production-grade multi-account/device-fingerprint fraud detection — email-based dedup is sufficient for a hackathon demo; flagged explicitly as a future hardening item.

## 4. Target Users

- **Primary:** casual users looking for a quick, fun, shareable interaction — the core "smile, get scored, get rewarded" loop.
- **Secondary:** competitive users drawn in by the leaderboard and streak mechanics, who return specifically to defend rank or protect a streak.
- **Judges (hackathon-specific audience):** need to see technical legitimacy (real AI scoring), a defensible anti-cheat story, and a believable growth loop within a short demo window.

## 5. User Stories

| As a... | I want to... | So that... |
|---|---|---|
| First-time visitor | Try the smile capture without signing up first | I can see the value before committing to an account |
| Returning user | See my coin balance and streak immediately after login | I know where I stand without hunting for it |
| Competitive user | See daily/weekly/monthly leaderboards update live | I stay motivated to keep my rank |
| Any user | Get a scratch card instead of an instant number after capture | The reward moment feels earned and exciting, not flat |
| Any user | Refer friends and get bonus coins when they actually engage | I'm incentivized to grow the platform, not just invite empty accounts |
| Any user | Reach 2000 coins and redeem a real gift voucher | The time I've spent has tangible payoff |
| Privacy-conscious user | Know my photo isn't stored indefinitely | I can trust the app with facial data |
| Social user | Optionally share my smile publicly and get liked | I get social validation and can browse others' posts |

## 6. Functional Requirements

### 6.1 Smile Capture & Scoring
- Webcam capture via `navigator.mediaDevices.getUserMedia`.
- Client-side facial landmark detection (face-api.js or MediaPipe Face Landmarker) — no server GPU cost, no raw video required server-side for scoring.
- Smile score (0–100) computed from landmark ratios: mouth curvature, mouth width/height ratio, cheek raise, eye crinkle (Duchenne-smile signal).
- Score maps to a base coin amount (e.g. score ÷ 10).

### 6.2 Coin Economy
- **Append-only ledger** — every coin event (capture, streak bonus, referral, signup bonus, explore post) is an insert into `coin_ledger` (`user_id`, `coins`, `reason`, `created_at`). Balance is derived, never stored as a mutable field.
- Daily capture cap to bound farming.
- Streak multiplier applies to capture payout, capped at a ceiling (e.g. 2x).

### 6.3 Reward Tiers
- Milestone badges at 100 / 500 / 1000 coins.
- Amazon gift voucher unlock at 2000 coins (configurable threshold).
- Demo-mode: voucher codes pre-seeded in `rewards`, not issued via a live payment API.

### 6.4 Leaderboard
- Daily, weekly, monthly top-smiler rankings, aggregated from `coin_ledger` via `leaderboard_view`.
- Bonus coins for topping a period.
- "Most Improved Smiler" category (delta in average smile score) as a secondary, more inclusive ranking.
- Real-time updates via Supabase Realtime — no polling.

### 6.5 Anti-Cheat / Integrity Layer
- **Cooldown:** derived from `MAX(created_at)` in `smile_captures` per user — no separate cooldown table. Indexed on `(user_id, created_at)`.
- **Liveness check:** blink detection or prompted head movement required before a capture is accepted.
- **Duplicate-image detection:** perceptual hash (pHash-style, not cryptographic) stored in `image_hashes`, matched by Hamming distance against a user's recent hashes — catches re-photographed or recompressed re-uploads that a byte-exact hash would miss.
- **Daily caps:** on captures and on referral rewards per referrer.

### 6.6 Refer & Earn
- Unique referral code/link per user, generated on signup.
- Referral recorded as `pending` on signup; reward triggers only on the referred user's **first successful capture** — not on signup alone, to block fake-account farming.
- Referrer gets a flat bonus (e.g. +200 coins); referred user gets their signup bonus plus a small referral bonus (e.g. +50 coins).
- Capped per referrer per day (e.g. 5 rewarded referrals/day).
- Recorded in `coin_ledger` with `reason: 'referral_bonus'`.

### 6.7 First Signup Bonus
- One-time flat coin grant on account creation, delivered via the same scratch-card mechanic as ongoing rewards.
- One bonus per verified identity (email-based dedup for demo scope).

### 6.8 Snapchat-Style Streak System
- `streaks` table: `user_id`, `streak_count`, `last_capture_at`, `freeze_available`.
- Increments on capture within a 24–48 hour grace window (not a strict midnight cutoff).
- Resets to 0 on a missed window, unless a streak freeze is active (one per week, consumable).
- Multiplies capture coin payout, capped.
- UI: flame icon scaling with streak length; "streak about to expire" banner within a few hours of loss.

### 6.9 Scratch Card Reveal
- Coin value computed and locked **server-side** before the card renders — the scratch interaction is a pure reveal animation, never a source of truth, and cannot be gamed by refreshing mid-scratch.
- Canvas-based scratch interaction (`globalCompositeOperation: 'destination-out'`).
- Used for both capture rewards and the signup bonus.

### 6.10 Social Share
- Auto-generated shareable result card (e.g. "I scored 94 on Open Smile 😁"), sized for Instagram/WhatsApp stories.
- Generated server-side for cross-device consistency.
- Includes the user's referral code/QR — every share doubles as a referral funnel.

### 6.11 Explore Feed
- **Opt-in only** — a capture is private by default; posting requires an explicit action after the scratch-card reveal. Never auto-published.
- `posts` table, separate from `smile_captures`, so private captures never enter the public feed table.
- Likes via a `likes` table with a unique `(user_id, post_id)` constraint; like count denormalized for fast reads.
- Same 1-day auto-delete policy as raw captures applies to Explore posts and their images.
- Small capped daily coin reward for posting, to seed early feed activity.

## 7. Non-Functional Requirements

### Privacy
- Images stored via ImageKit auto-delete after 1 day — applies uniformly to captures and Explore posts.
- Prefer sending only derived scores to the server where a feature doesn't strictly need the image server-side.
- No feature may default to public visibility for facial data.

### Security
- All coin values server-computed and locked before any client-facing reveal — never trust a client-submitted coin amount.
- All DB queries parameterized via `lib/db/collections.ts` typed helpers — no raw inline SQL, no string-interpolated queries.
- Rate limiting is DB-backed (`rate_limits` table) to survive serverless cold starts.
- OTPs stored hashed, attempt-limited, and expiry-cleaned on a schedule.

### Performance
- Smile scoring must run client-side with no perceptible lag on capture (target: sub-second landmark detection on a typical laptop webcam).
- Leaderboard updates must propagate via Realtime without requiring a manual refresh.

### Reliability
- Supabase free-tier auto-pauses after 7 days of inactivity — a scheduled keep-alive ping is required so the database doesn't go offline between demo/dev sessions.

## 8. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui | Matches existing stack, fast to build polished UI |
| Smile detection | face-api.js / MediaPipe Face Landmarker | Client-side, zero server GPU cost |
| Database | Supabase Postgres, raw `pg` pool, no ORM | Relational ledger + leaderboard aggregation is a SQL-shaped problem |
| Realtime | Supabase Realtime | Live leaderboard updates without polling |
| Auth | Better Auth (owns `user`/`session`/`account`/`verification` directly in the same Postgres DB) + custom email-OTP layer | TypeScript-native, full session control, no vendor lock-in |
| Storage | ImageKit, 1-day auto-delete | Matches the privacy pitch, no long-term biometric retention |
| Design | Neubrutalism (see DESIGN.md) | Distinctive, high-energy aesthetic matching a gamified reward product |

## 9. User Flow (happy path)

1. Land on the app → click **Capture Smile** (no login required yet).
2. Webcam opens; landmark detection runs client-side; smile score computed.
3. Scratch card appears with the (already server-locked) coin reward hidden underneath.
4. User scratches to reveal → prompted to log in/sign up to claim and save the reward.
5. Post-auth: coin transaction inserted into ledger, streak updated, leaderboard updates live.
6. User lands on `/dashboard` (or back on `/capture` if login was triggered mid-capture) — sees balance, streak, progress toward next reward tier.
7. At 2000 coins, user triggers the claim flow and receives a seeded voucher code.

## 10. Data Model (summary)

**Owned by Better Auth:** `user`, `session`, `account`, `verification`.

**App tables (Postgres, FK to `user.id`):**
- `smile_captures` — id, user_id, smile_score, coins_awarded, created_at
- `coin_ledger` — id, user_id, coins, reason, created_at
- `streaks` — user_id, streak_count, last_capture_at, freeze_available
- `rewards` — id, user_id, tier, voucher_code, claimed_at
- `referrals` — id, referrer_id, referred_id, status, created_at
- `posts` — id, user_id, image_url, smile_score, like_count, created_at
- `likes` — id, user_id, post_id, created_at (unique on user_id+post_id)
- `leaderboard_view` — derived, aggregates `coin_ledger` by period

**Anti-cheat:**
- `image_hashes` — id, user_id, image_hash, created_at (perceptual hash, indexed on user_id + hash)
- Cooldown — no table, derived from `smile_captures(user_id, created_at)`

**Infra:**
- `beta_waitlist`, `otp_codes`, `rate_limits`

Full detail in `architecture.md`.

## 11. Success Metrics

Given hackathon scope, success is measured primarily by demo outcomes rather than production KPIs:
- Live demo completes the full loop (capture → score → coin → leaderboard update) without failure.
- Anti-cheat story is answerable on the spot, not hand-waved.
- Judges can see the privacy pitch is structurally true (auto-delete, opt-in publishing), not just claimed.

Longer-term (post-hackathon, if continued):
- D1/D7 retention driven by streak mechanics.
- Referral-driven signups as a % of total signups.
- Voucher redemption rate at the 2000-coin threshold.

## 12. Current Build Status

**Built:** landing page, full auth flow (signup/login/forgot-password/reset-password), email-OTP verification, dashboard + settings, beta waitlist, ImageKit upload/auth, health check.

**Not yet built — the core product loop:**
- `/capture` — highest priority, this is the product
- Scratch card reveal
- `/leaderboard`
- `/explore`
- `/rewards`
- `/refer`
- `/u/[username]` public profile
- Voucher claim confirmation
- Admin dashboard

## 13. Open Questions

- [ ] Finalize the smile-score formula — which landmark ratios, what weighting.
- [ ] Decide whether photos are stored at all for scoring, or purely scored client-side with no image ever reaching the server.
- [ ] Scaffold the Next.js routes for the core loop.
- [ ] Seed voucher codes for demo.
- [ ] Build Supabase schema (per Section 10) + Realtime subscription for the leaderboard.
- [ ] Live activity marquee: currently using a static placeholder component (`components/marquee/activity-marquee.tsx`); replace with live data from `coin_ledger` via `GET /api/activity/recent` in the real-data pass.

## 14. Related Documents

- `architecture.md` — system design and data flow
- `security.md` — threat model and security requirements
- `AGENTS.md` — conventions for AI coding agents working in this repo
- `rules.md` — flat product/engineering/contribution rules checklist
- `DESIGN.md` — neubrutalism design system
