# Rules — Open Smile

This file is the single reference for how we work on this project: how the product behaves (game rules), how we write code (engineering rules), and how we collaborate (contribution rules). AGENTS.md, security.md, and architecture.md go deeper on the "why" — this file is the flat, checkable "what."

---

## 1. Product / Gameplay Rules

These define how the app actually behaves. Changing any of these is a product decision, not a refactor — flag it explicitly if you need to change one.

### Smile scoring
- Score range is 0–100, computed client-side from facial landmark geometry (mouth curvature, width/height ratio, eye crinkle).
- A capture only counts if it passes the liveness check (blink / prompted movement). No liveness signal → no reward, no ledger entry.

### Coins
- Coins are **never** a mutable balance column. Every coin event is a row in `coin_ledger` (`user_id`, `coins`, `reason`, `created_at`). Balance = `SUM(coins)` for that user.
- Coin amounts are computed and locked **server-side** before being shown to the client. The scratch card is a reveal animation over an already-decided number — it never determines the reward itself.
- One capture per cooldown window (default: 1 hour). Reject capture attempts inside the window.
- One capture-derived coin reward per day cap, separate from the cooldown, to bound total daily farming even across many cooldown windows.

### Streaks
- Streak increments if the last capture was within a 24–48 hour grace window (Snapchat-style — not a strict midnight cutoff).
- Missing the window resets the streak to 0, **unless** a streak freeze is active.
- One streak freeze available per week, consumable.
- Streak multiplier applies to capture coin payout, capped (default ceiling: 2x) so it can't dominate the economy.

### Rewards
- Milestone badges at 100 / 500 / 1000 coins.
- Amazon gift voucher unlock threshold: 2000 coins (configurable).
- Hackathon/demo: voucher codes are pre-seeded in the database, not issued via a live payment/voucher API.

### Referrals
- Referral reward triggers on the referred user's **first successful capture**, never on signup alone.
- Referral rewards are capped per referrer per day (default: 5 rewarded referrals/day).
- Referral events are `coin_ledger` rows with `reason: 'referral_bonus'` — no separate ledger.

### Signup bonus
- One-time flat grant on account creation, one per verified identity (email-based dedup at minimum).
- Delivered via the same scratch-card mechanic as ongoing rewards — never a lesser plain-toast experience.

### Explore feed
- Opt-in only. A capture is private by default; posting requires an explicit action after the reveal.
- Never auto-publish a capture.
- Posts and their images follow the same 1-day auto-delete policy as raw captures.
- Duplicate likes blocked via a unique constraint on `(user_id, post_id)`.

### Anti-cheat (do not remove without a replacement)
- Capture cooldown.
- Liveness check.
- Perceptual image hashing (pHash-style, not cryptographic) against a user's recent captures.
- Daily capture and referral caps.

---

## 2. Engineering Rules

### Database
- All queries go through `lib/db/client.ts` (pool) and `lib/db/collections.ts` (typed helpers). No raw inline SQL in route handlers or components — add a new helper to `collections.ts` instead.
- Always parameterized queries (`$1`, `$2`, ...). Never string-interpolate user input into SQL.
- No ORM. Raw `pg`, following the existing helper pattern.
- Every expiring table (`otp_codes`, `rate_limits`, etc.) needs a matching cleanup helper wired into the scheduled cleanup job — Postgres has no TTL indexes.

### Auth
- Better Auth owns `user` / `session` / `account` / `verification`. Don't hand-roll parallel session/JWT logic.
- Custom OTP flow sits alongside Better Auth, not instead of it. Keep OTP hashing, attempt counting, and expiry intact if touching this code.
- Default post-login redirect: `/dashboard`. Exception: a login triggered mid-capture returns to `/capture` via a `redirectTo`/`callbackURL` param.

### Smile detection / media
- Scoring runs client-side (MediaPipe / face-api.js). Don't move scoring to the server.
- Prefer sending only the derived score to the server, not the raw frame, unless the feature specifically needs the image persisted.

### Code style
- No comment lines in code — keep it self-explanatory through naming.
- Keep fixes minimal and targeted. Preserve existing code structure and patterns rather than refactoring unrelated areas while making an unrelated change.
- Match existing conventions in `lib/db/collections.ts`, `lib/mailer/`, and the `app/api/` route structure before introducing new patterns.

### Design
- Neubrutalism per DESIGN.md: thick black borders, hard offset shadows, zero border-radius, tactile hover/press physics.
- Go loud (full neubrutalism): landing, capture screen, score reveal, leaderboard podium, badges, scratch card.
- Stay calm (dial it back): auth forms, settings, voucher-claim confirmation — trust-sensitive moments shouldn't fight the user with visual noise.
- Every color pairing must hit 4.5:1 contrast before shipping — yellow-on-white specifically tends to fail, check it explicitly.

### Privacy (non-negotiable across all features)
- Images auto-delete after 1 day via ImageKit — applies to every image-bearing feature, no exceptions or separate longer-lived paths.
- Never default any capture to public.
- Prefer client-side-only processing where a feature doesn't strictly need the server to see the image.

---

## 3. Contribution Rules

### Commits
- Keep commits scoped to one logical change. Don't bundle an unrelated refactor into a feature commit.
- Write commit messages that describe *what changed and why*, not just *what file changed*.

### Branching
- Feature branches off `main`, named descriptively (e.g. `feature/capture-flow`, `fix/otp-attempt-cap`).
- No direct commits to `main` for anything beyond trivial doc fixes.

### Pull requests
- Before opening a PR: confirm anti-cheat, ledger, and privacy rules above haven't been silently weakened.
- If a PR changes any Product/Gameplay Rule in section 1 (coin values, cooldowns, caps, thresholds), say so explicitly in the PR description — these are product decisions, not implementation details, and should be visible as such in review.
- If a PR touches auth, the coin ledger, or anti-cheat, treat it as security-relevant — re-check it against `security.md` before merging, not just against this file.

### Before submitting any change
- Does it preserve the append-only coin ledger (no mutable balance columns introduced)?
- Does it keep reward computation server-side (nothing coin-related trusted from the client)?
- Does it respect the 1-day image auto-delete policy for anything new that touches ImageKit?
- Does it follow the existing `lib/db/collections.ts` query-helper pattern rather than adding raw SQL elsewhere?
- Does it match the neubrutalist design grammar where the feature is user-facing?

If any answer is "no, and that's intentional," say so explicitly in the PR — silent deviations from these rules are the thing this file exists to prevent.
