# Security — Open Smile

This document covers the security-relevant design decisions in Open Smile and what to check before shipping changes to any of these surfaces.

## Threat model summary

Open Smile handles three categories of sensitive surface:
1. **Facial image data** — users upload photos of their faces for scoring.
2. **A real-money-adjacent reward economy** — coins convert to Amazon gift vouchers, so the coin ledger is effectively financial data and a target for abuse.
3. **Standard auth** — email/password + OTP, session management, password reset.

## Facial data & privacy

- **Storage:** Images live in ImageKit with a 1-day auto-delete policy. This is a hard requirement — any new feature that touches images (Explore posts, profile photos, etc.) must inherit this expiry, not introduce a separate longer-lived storage path.
- **Client-side scoring where possible:** Smile scoring runs via face-api.js / MediaPipe in-browser. Prefer sending only the derived numeric score to the server, not the raw frame, wherever a feature doesn't need the image server-side. This is both a privacy property and a reduced-liability property — less raw biometric data touching the backend at all.
- **Opt-in publishing:** A capture is private by default. Publishing to the Explore feed requires an explicit user action per capture. Never default a capture to public, and never bulk-publish a user's history without fresh per-item consent.
- **Deletion:** Account deletion (see Open Questions in the project plan) should cascade to all owned images and posts, not just the `user` row.

## Coin ledger integrity

- **Append-only ledger, never a mutable balance.** Every coin movement is an insert into `coin_ledger` with a `reason`. Balance is derived via `SUM(coins)`. This is the primary defense against a whole class of bugs and race conditions where a balance column gets double-credited or corrupted under concurrent writes — do not "simplify" this into a single balance field.
- **Server-computed, never client-trusted.** Coin amounts (capture reward, streak multiplier, referral bonus, signup bonus) must be computed and locked server-side before any client-facing reveal (e.g. the scratch card). The scratch card is purely an animation over an already-decided value — it must never be the mechanism that determines the reward.
- **Referral abuse:** Referral rewards trigger only on the referred user's first successful capture, not on signup alone, and are capped per referrer per day. This blocks the basic "create N fake accounts, get N×signup-bonus" attack. If referral logic is touched, keep both the completion-gate and the daily cap.
- **Anti-cheat layer is load-bearing, not cosmetic:**
  - Capture cooldown, derived from `MAX(created_at)` per user in `smile_captures` — prevents rapid-fire farming.
  - Liveness check (blink / prompted movement) before a capture is accepted — blocks photo-of-a-photo spoofing.
  - Perceptual image hashing (`image_hashes`, pHash-style, small Hamming-distance matching) — blocks re-submission of the same or a re-photographed/recompressed image. This is intentionally *not* a cryptographic hash (MD5/SHA), since those only catch byte-identical files and would miss recompressed or slightly-altered re-uploads.
  - Daily capture caps.
  - Any change that removes or weakens one of these needs an explicit replacement, not a silent removal.

## Auth & session security

- **Better Auth owns `user`/`session`/`account`/`verification`.** Don't hand-roll parallel session logic — route auth-sensitive changes through Better Auth's own flow (`app/api/auth/[...all]/route.ts`) or the documented custom OTP endpoints, not new ad hoc endpoints.
- **OTP handling:**
  - OTPs are stored hashed (`otp_hash`), never in plaintext, in `otp_codes`.
  - Attempts are counted (`attempts` column) and should be capped — reject further verification attempts past a threshold rather than allowing unlimited guesses against a 6-digit code.
  - OTPs expire (`expires_at`) and are cleaned up via scheduled `DELETE ... WHERE expires_at <= NOW()` — verify this cleanup job is actually scheduled in production, not just present as a callable function.
  - `upsertOtpCode` resets `attempts` to 0 on resend — intentional, so a resend doesn't inherit a near-exhausted attempt counter, but also means resend itself should be rate-limited (see below) or it becomes an attempt-counter reset button for an attacker.
- **Rate limiting is DB-backed** (`rate_limits` table), specifically so it survives serverless cold starts where an in-memory limiter would silently reset. Any new sensitive endpoint (OTP send/verify, login, password reset, capture submission) should be covered by this rate limiter, not assumed to be low-risk because it's "just an internal API route."
- **Login notification emails** (`notify-login`) exist as a user-facing signal for unrecognized logins — keep this firing on every successful login, not just failures, so it's useful as an early warning to the user.
- **Password reset:** reset tokens/flows should follow the same expiry + single-use discipline as OTPs. Don't let a reset link remain valid after it's been used once or after a new reset has been requested.

## Input handling

- All database queries go through parameterized queries via `lib/db/collections.ts` (`$1`, `$2`, ...). **Never string-interpolate user input into a SQL string.** Any new query helper must follow this pattern.
- Image uploads (ImageKit) should validate file type/size server-side before upload authorization is granted, not rely on client-side validation alone.

## Known open items (track before production use)

- [ ] Confirm the OTP/rate-limit cleanup job is actually scheduled (cron/Edge Function), not just present as an uncalled function.
- [ ] Define and enforce a max OTP verification attempt count.
- [ ] Confirm ImageKit's 1-day deletion is enforced server-side (a lifecycle policy) rather than relying on a client-triggered delete call that might not fire.
- [ ] Account deletion flow — ensure cascading deletion of images, posts, and ledger data (or documented retention policy) if a user requests deletion.
- [ ] Supabase Realtime channel auth currently needs Better Auth sessions passed into the presence/broadcast callback manually, since Realtime's built-in RLS expects Supabase Auth JWTs by default — verify this doesn't leave a channel accessible without a valid Better Auth session.

## Reporting

If you find a security issue in this codebase, treat it as sensitive by default — don't file it as a public issue with exploit details before it's fixed.
