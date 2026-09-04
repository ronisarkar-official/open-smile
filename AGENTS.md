# AGENTS.md — Open Smile

This file orients AI coding agents (Claude Code, Cursor, etc.) working in this repository. Read this before making changes.

## What this project is

Open Smile is a gamified, AI-powered smile-recognition rewards platform. Users capture a photo through the browser, an on-device model scores how genuinely they're smiling (0–100), and that score converts into coins. Coins accumulate toward real rewards (Amazon gift vouchers). A live leaderboard (daily/weekly/monthly) and referral system drive repeat engagement.

One-line pitch: *"Duolingo streaks meet facial AI — smile more, win more."*

## Current build status

**Built:** landing page, full auth flow (signup/login/forgot-password/reset-password), custom email-OTP verification, dashboard + settings, beta waitlist, ImageKit upload/auth routes, health check.

**Not yet built — this is the actual product:**
- `/capture` — webcam capture + client-side smile scoring (highest priority, this is the core loop)
- Scratch card reveal (post-capture coin reveal animation)
- `/leaderboard` — daily/weekly/monthly rankings
- `/explore` — public opt-in feed of smile posts
- `/rewards` — badge gallery + voucher redemption
- `/refer` — referral code/link page
- `/u/[username]` — public profile
- Admin dashboard (voucher seeding, anti-cheat flags, moderation)

When picking up work, default to building toward the missing core loop unless told otherwise — auth/infra is done, the product isn't.

## Tech stack — do not deviate without discussion

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| Smile detection | face-api.js or MediaPipe Face Landmarker — **client-side only**, never send raw video/images to a server for scoring |
| Database | Supabase Postgres — **raw `pg` pool, no ORM**. See `lib/db/collections.ts` for the pattern |
| Realtime | Supabase Realtime (leaderboard live updates) |
| Auth | Better Auth — owns its own `user`/`session`/`account`/`verification` tables directly in the same Postgres DB. It does **not** sit on top of Supabase Auth; Supabase in this stack is just Postgres + Realtime + (optionally) Storage |
| Storage | ImageKit — images auto-delete after 1 day |
| Design | Neubrutalism (see DESIGN.md) — thick black borders, hard offset shadows, zero border-radius |

**Important history note:** an earlier iteration briefly used MongoDB. It has been fully removed. If you see Mongo-flavored naming (e.g. `collections.ts`) that's a naming holdover, not a live dependency — the actual implementation underneath is Postgres via `pg`. Do not reintroduce MongoDB or a Mongo-style document model.

## Database conventions

- All queries go through `lib/db/client.ts` (pool) and `lib/db/collections.ts` (typed, parameterized query helpers). **Do not write raw inline SQL in route handlers or components** — add a new typed helper to `collections.ts` instead, following the existing pattern (see `findUserByEmail`, `upsertOtpCode`).
- Always use parameterized queries (`$1`, `$2`, ...). Never string-interpolate user input into SQL.
- Coin balances are **never** stored as a mutable running total. Every coin movement (capture reward, signup bonus, referral bonus, streak bonus, explore post reward) is an **insert** into `coin_ledger` with a `reason` column. Current balance = `SUM(coins)` over a user's ledger rows. This makes the economy auditable and reversible — do not "optimize" this into a single mutable balance column.
- Expired rows (`otp_codes`, `rate_limits`) are cleaned up via explicit `DELETE ... WHERE expires_at <= NOW()` calls, not TTL indexes (Postgres has none). If you add a new expiring table, add a matching cleanup helper and wire it into the same scheduled cleanup job — don't leave it to grow unbounded.

## Auth conventions

- Better Auth's catch-all route (`app/api/auth/[...all]/route.ts`) handles its own schema and standard flows. Don't hand-roll session/JWT logic outside of it.
- The custom OTP layer (`send-otp`, `verify-otp`, `check-credentials`, `mark-verified`, `notify-login`) sits *alongside* Better Auth, not as a replacement. If you touch this flow, keep the OTP hash (never store plaintext OTPs), attempt counting, and expiry logic intact — this is a security-relevant path, see SECURITY.md.
- When adding a new authenticated route, redirect unauthenticated users to `/login` with a `redirectTo`/`callbackURL` param so they land back where they started after auth — don't hard-redirect everyone to `/dashboard` post-login. Default post-login redirect is `/dashboard`; the one exception is a login triggered from mid-capture flow, which should return to `/capture`.

## Anti-cheat — do not weaken these without discussion

This is a facial-recognition rewards app; the anti-cheat layer is core to the product's credibility, not optional hardening:
- Capture cooldown (derived from `MAX(created_at)` in `smile_captures`, not a separate table)
- Liveness check (blink detection / prompted head movement) before a capture counts
- Perceptual image hashing (`image_hashes` table, pHash-style — not cryptographic hash) to reject re-submitted or re-photographed images
- Daily capture caps and per-referrer daily referral-reward caps

## Design system

Neubrutalism per DESIGN.md — thick borders, hard offset shadows, zero radius, tactile press physics on interactive elements. Go loud on: landing, capture screen, score reveal, leaderboard podium, badges, scratch card. Stay calm on: auth forms, settings, voucher-claim confirmation (trust-sensitive moments shouldn't fight the user with visual noise).

## Privacy posture — keep this consistent across features

The product's stated privacy pitch is "we don't retain your face." Concretely:
- Photos are stored via ImageKit with a 1-day auto-delete policy — this applies to Explore feed posts too, not just raw captures.
- Explore posting is **opt-in only**. A capture is private by default; posting to the public feed requires an explicit user action. Never auto-publish a capture.
- Prefer sending only derived scores to the server where the feature allows it, not raw images, when a feature doesn't strictly need the image server-side.

## Before submitting changes

- Match existing patterns in `lib/db/collections.ts`, `lib/mailer/`, and the API route structure under `app/api/` rather than introducing new conventions.
- No code comments (project preference) — keep code self-explanatory through naming instead.
- Keep fixes minimal and targeted — preserve existing code structure rather than refactoring unrelated areas while making a change.


## Codebase Knowledge Graph (Graphify)

This project has a pre-computed Graphify knowledge graph in `graphify-out/graph.json`.

**Rules for AI Agents:**
- **DO NOT scan or grep the whole repository blind.** Before reading files or searching across directories to understand architecture, dependencies, or call flows, **you MUST query the graph first**:
  - `graphify query "<question>"` — broad BFS search for relevant components and files.
  - `graphify path "<SymbolA>" "<SymbolB>"` — trace the exact shortest call path between two symbols.
  - `graphify explain "<Symbol>"` — focused explanation of a node and its connections.
- Check `graphify-out/GRAPH_REPORT.md` for community clusters, god nodes, and architecture insights.
- After modifying or adding code files, always run `graphify update .` to keep `graphify-out/graph.json` synchronized.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
