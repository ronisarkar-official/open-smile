# Open Smile 😁

Smile more, win more. Open Smile is a gamified, AI-powered smile-recognition rewards platform — capture a photo through your browser, get scored on how genuinely you're smiling, and turn that score into coins redeemable for real rewards.

> *"Duolingo streaks meet facial AI."*

Built for **AI Unleashed**.

## What it does

1. **Capture** — open your webcam and smile. An on-device model scores you 0–100 based on facial landmark geometry (mouth curvature, width/height ratio, eye crinkle) — not just a binary "smiling: yes/no."
2. **Earn** — your score converts into coins. A scratch card hides the reward until you reveal it.
3. **Compete** — daily, weekly, and monthly leaderboards track the top smilers, with a live-updating podium.
4. **Redeem** — hit 2000 coins, claim an Amazon gift voucher.
5. **Grow** — streaks, referrals, and an opt-in public feed keep the loop going.

## Why it's different

Most "AI + webcam" projects stop at binary detection. Open Smile differentiates on:

- **Smile quality scoring**, not a flag — intensity is computed from real facial landmark geometry, aiming for a genuine "Duchenne smile" signal rather than any open-mouth photo counting equally.
- **Retention mechanics** — Snapchat-style streaks with grace windows and freezes, multipliers, and tiered badges instead of one all-or-nothing goal.
- **Anti-cheat by design** — capture cooldowns, liveness checks, and perceptual image hashing block spam and spoofing from day one, not as an afterthought.
- **Privacy-first** — captured images auto-delete after 1 day, scoring happens client-side wherever possible, and posting to the public feed is opt-in only. We don't retain your face.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| Smile detection | face-api.js / MediaPipe Face Landmarker — runs entirely client-side |
| Database | Supabase (Postgres) via a raw `pg` pool — no ORM |
| Realtime | Supabase Realtime — live leaderboard updates |
| Auth | Better Auth — owns its own `user`/`session`/`account` tables directly in Postgres, plus a custom email-OTP verification layer |
| Storage | ImageKit — images auto-delete after 1 day |
| Design | Neubrutalism — thick borders, hard offset shadows, zero border-radius, tactile press physics |

See [`AGENTS.md`](./AGENTS.md) for architectural conventions and [`security.md`](./security.md) for the security model, and [`DESIGN.md`](./DESIGN.md) for the full design system.

## Getting started

\`\`\`bash
git clone https://github.com/ronisarkar-official/open-smile.git
cd open-smile
npm install
\`\`\`

Create a \`.env.local\` with:

\`\`\`bash
DATABASE_URL=            # Supabase Postgres connection string (pooled, port 6543, for serverless)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# mailer (transactional emails: OTP, welcome, login notification, reset password, beta waitlist)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
\`\`\`

Run the Supabase migration:

\`\`\`bash
# apply supabase/migrations/001_init.sql against your Supabase Postgres instance
\`\`\`

Then:

\`\`\`bash
npm run dev
\`\`\`

## Project status

**Built:** landing page, full auth flow (signup, login, forgot/reset password), email-OTP verification, dashboard + settings, beta waitlist, ImageKit upload/auth, health check.

**In progress / not yet built — the core product loop:**
- [ ] \`/capture\` — webcam capture + client-side smile scoring
- [ ] Scratch card reveal
- [ ] \`/leaderboard\` — daily / weekly / monthly rankings
- [ ] \`/explore\` — public opt-in smile feed
- [ ] \`/rewards\` — badge gallery + voucher redemption
- [ ] \`/refer\` — referral system
- [ ] \`/u/[username]\` — public profile
- [ ] Admin dashboard

## Project structure

\`\`\`
open-smile/
├── app/
│   ├── (auth)/         → login, signup, forgot-password, reset-password
│   ├── api/
│   │   ├── auth/       → Better Auth catch-all + custom OTP routes
│   │   ├── beta-join/
│   │   ├── health/
│   │   └── imagekit/   → auth + upload routes
│   ├── dashboard/       → dashboard, dashboard/settings
│   └── verify-otp/
├── lib/
│   ├── db/              → pg pool client + typed query helpers
│   ├── mailer/           → transactional email templates
│   ├── auth-client.ts, server-auth.ts, otp.ts, rate-limit.ts, imagekit.ts
├── supabase/migrations/  → SQL schema
└── hooks/
\`\`\`

## Core mechanics, briefly

- **Coin ledger is append-only.** Every coin movement (capture, streak bonus, referral, signup bonus) is an insert, never a mutated balance — auditable by design.
- **Rewards are server-computed, never client-trusted.** The scratch card is a reveal animation over an already-locked value.
- **Streaks** use a 24–48 hour grace window (Snapchat-style, not a strict midnight cutoff) with a once-a-week freeze to protect against timezone edge cases and accidental breaks.
- **Referrals** only pay out after the referred user's first successful capture, not on signup alone, capped per referrer per day.

## License

Not yet decided.

## Team

Built by [Roni Sarkar](https://roni-sarkar.vercel.app) ([@ronisarkar-official](https://github.com/ronisarkar-official)).
