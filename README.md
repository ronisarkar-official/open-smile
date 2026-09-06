# Open Smile 😁

Smile more, win more. Open Smile is a gamified, AI-powered smile-recognition rewards platform — capture a photo through your browser, get scored on how genuinely you're smiling, and turn that score into coins redeemable for real rewards.

> *"Duolingo streaks meet facial AI — smile more, win more."*

Built for **AI Unleashed**.

---

## What it does

1. **On-Device Facial AI Capture** — Open your webcam and smile. MediaPipe Face Landmarker runs client-side via WebAssembly, tracking 478 3D facial landmarks to evaluate genuine smile geometry (mouth curvature, lip stretch, cheek elevation, and Duchenne eye crinkles) on a continuous 0–100 scale.
2. **Anti-Cheat & Liveness Verification** — On-device `LivenessDetector` enforces natural blink detection and dynamic micro-movements to reject printed photos or static screens, while perceptual hashing (pHash) blocks re-uploaded images.
3. **Scratch Cards & Coin Engine** — Successful captures award an interactive scratch card holding your locked coin reward. Scratching the card triggers tactile sound and haptic physics, crediting coins into an auditable, append-only ledger.
4. **Daily Streaks & Multipliers** — Maintain daily smile habits to earn streak multipliers (up to 3.0x), milestone badges, and emergency streak freeze cards.
5. **Live Leaderboards & Podium Settlements** — Real-time daily, weekly, and monthly leaderboards. Nightly automated settlements award podium finishers (Gold, Silver, Bronze) with exclusive bonus scratch cards.
6. **Voucher Marketplace** — Redeem your coins for real-world gift cards (Amazon, Flipkart, Swiggy, Apple, and more) with instant voucher code generation.
7. **Referral Network** — Share your personalized link (`?ref=CODE`). To prevent sybil farming, referral bonuses for both parties unlock only after the invited friend completes their first verified capture.
8. **Opt-in Explore Community Feed** — Share your best smiles to the public feed, like community posts, and discover smile streaks around the world.
9. **Public Profiles (`/u/[username]`)** — Shareable showcase of your smile achievements, lifetime coin earnings, longest streaks, and earned badges.
10. **Admin Command Center** — Real-time control room for platform maintenance, dynamic game parameters (cooldowns, min smile thresholds, coin multipliers), voucher seeding, and feed moderation.
11. **Installable PWA** — Offline fallback, service worker caching, and installable mobile experience.

---

## Why it's different

- **Continuous smile quality scoring**, not a binary flag — Analyzes subtle landmark geometry for genuine "Duchenne smiles" rather than treating any open mouth equally.
- **Privacy-first by design** — Raw video feeds and camera frames **never leave your device** during scoring. Public feed posts use ImageKit with a strict **1-day auto-delete policy**. We do not hoard face data.
- **Defensive anti-cheat** — Cooldowns derived from capture history, client-side liveness verification, daily capture caps, and hamming distance checks on perceptual image hashes stop automated exploits.
- **Append-only ledger** — Balances are derived from `SUM(coins)` across immutable ledger rows, eliminating balance tampering and race conditions.
- **Tactile soft neubrutalism** — Clean, high-energy UI featuring a signature 7px corner radius, crisp outline strokes, zero-blur directional brutal shadows, and responsive press physics.

---

## Tech stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Motion |
| **Smile & Liveness AI** | MediaPipe Tasks Vision Face Landmarker (WASM) — 100% on-device client-side execution |
| **Game & Rewards Engine** | FastAPI (`backend_py/`) with `asyncpg` — transactional coin engine, anti-cheat, and streaks |
| **Database** | Supabase Postgres — unified database queried via `pg` (Node.js) and `asyncpg` (Python) |
| **Auth** | Better Auth (`session`, `user`, `account`) + custom email-OTP verification layer |
| **Image Storage** | ImageKit — signed client uploads with uniform 1-day auto-delete lifecycle |
| **Design System** | Soft Neubrutalism (7px radius, high-contrast neon accents, directional drop shadows) |
| **Scheduled Tasks** | Vercel Cron — nightly leaderboard settlement, cleanup, and database keep-alive |

For detailed documentation:
- Architecture & call flows: [`architecture.md`](./architecture.md)
- Design tokens & component rules: [`DESIGN.md`](./DESIGN.md)
- Threat model & anti-cheat policies: [`security.md`](./security.md)
- Agent & codebase guidelines: [`AGENTS.md`](./AGENTS.md)

---

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.11+ (with [`uv`](https://docs.astral.sh/uv/) recommended)
- A Supabase Postgres instance
- ImageKit account (for optional photo sharing)

### Installation

```bash
git clone https://github.com/ronisarkar-official/open-smile.git
cd open-smile
npm install
```

### Environment configuration

Create `.env.local` in the project root:

```bash
# ── Better Auth ───────────────────────────────────────────
BETTER_AUTH_SECRET=your_32_char_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# ── Supabase Postgres ─────────────────────────────────────
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ── ImageKit (1-Day Auto-Delete Media) ────────────────────
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# ── Transactional Email (SMTP / OTP) ──────────────────────
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# ── Admin & Security ──────────────────────────────────────
ADMIN_EMAILS=your_email@example.com
CRON_SECRET=your_cron_secret

# ── Optional Python Backend URL ───────────────────────────
FASTAPI_URL=http://localhost:8000
```

### Database setup

Apply the SQL migration against your Supabase Postgres database:

```bash
# Execute supabase/migrations/001_init.sql in the Supabase SQL Editor
```

### Running locally

Run both the Next.js frontend and FastAPI game engine concurrently:

```bash
npm run dev:all
```

Or run them individually in separate terminals:

```bash
# Terminal 1: Next.js Frontend (port 3000)
npm run dev

# Terminal 2: FastAPI Engine (port 8000)
npm run dev:py
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Core mechanics, briefly

- **Coin ledger is strictly append-only.** Every coin movement (capture reward, scratch reveal, referral bonus, voucher claim) is an insert with a dedicated reason code — balances are derived, never directly updated.
- **Rewards are locked server-side.** Scratch cards are interactive reveals over an already cryptographically and transactionally locked outcome.
- **Streaks feature safety margins.** Designed with grace windows and freeze cards to protect smilers from timezone anomalies and accidental breaks.
- **Anti-farming referral gates.** Referral bonuses trigger only after the invited user passes anti-cheat and completes their first valid smile capture.

---

## License

MIT

---

## Team

Built by [Roni Sarkar](https://roni-sarkar.vercel.app) ([@ronisarkar-official](https://github.com/ronisarkar-official)).
