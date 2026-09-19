<div align="center">

# 😁 Open Smile

**The gamified, AI-powered smile-recognition rewards platform.**  
*Duolingo streaks meet on-device facial AI — smile more, win more.*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.11+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase Postgres](https://img.shields.io/badge/Database-Supabase_Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![MediaPipe](https://img.shields.io/badge/Facial_AI-MediaPipe_WASM-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-orange?style=for-the-badge)](https://better-auth.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

[**Live Demo**](https://open-smile.vercel.app) · [**Explore Architecture**](./architecture.md) · [**Design System**](./DESIGN.md) · [**Security & Anti-Cheat**](./security.md) · [**Report Bug**](https://github.com/ronisarkar-official/open-smile/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Architectural Invariants](#-architectural-invariants)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Configuration](#environment-configuration)
  - [Database Initialization](#database-initialization)
  - [Running Locally](#running-locally)
- [Core Game Mechanics & Economy](#-core-game-mechanics--economy)
- [Anti-Cheat & Security Posture](#-anti-cheat--security-posture)
- [API & Route Reference](#-api--route-reference)
- [Available Scripts](#-available-scripts)
- [The Team Behind Open Smile](#-the-team-behind-open-smile)
- [Contributing Guidelines](#-contributing-guidelines)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

**Open Smile** turns daily facial smiles into tangible real-world rewards. Powered by client-side WebAssembly computer vision, the application tracks 478 3D facial landmarks directly inside the user's browser, assessing genuine **Duchenne smile geometry** (zygomatic major lip elevation and orbicularis oculi eye crinkles) on a continuous scale from 0 to 100.

High-scoring smiles award interactive scratch cards that reveal coins credited into a strictly auditable, append-only ledger. Smilers can maintain daily habit streaks, unlock milestone badges, compete on real-time leaderboards, and redeem accumulated coins for instant e-gift vouchers from Amazon, Swiggy, Apple, Flipkart, and more.

### 💡 Why Open Smile Stands Out

- **100% Client-Side Machine Learning** — Zero server GPU compute costs and absolute user privacy. Raw webcam feeds and camera frames never leave the user's browser during evaluation.
- **Strict "We Don't Retain Your Face" Privacy** — Any optional photo shared to the public community feed lives in ImageKit backed by a non-negotiable **1-day auto-delete lifecycle policy**.
- **Financial-Grade Tamper-Resistant Economy** — Coin balances are computed dynamically as `SUM(coins)` across immutable transaction rows. Direct balance mutation is impossible.
- **Robust Multi-Layer Anti-Spoofing** — Natural blink detection, head micro-movements, hardware-accelerated perceptual image hashing (pHash), dynamic capture cooldowns, and daily transaction caps.
- **Soft Neubrutalism Aesthetic** — An ultra-tactile interface with high-contrast borders, bold retro palettes, directional drop shadows, and responsive press physics.

---

## ⚡ Key Features

### 1. 🎯 On-Device Facial AI & Continuous Smile Scoring
- Evaluates genuine smile geometry using **MediaPipe Face Landmarker** running client-side via WebAssembly (`@mediapipe/tasks-vision`).
- Rather than a crude binary check, scores the smile on a granular **0 to 100 curve** based on lip-corner distance, mouth curvature, cheek elevation, and genuine eye crinkles.
- Models (`face_landmarker.task`, `gesture_recognizer.task`) and WASM binaries are self-hosted locally in `/public/models/` for offline resilience and zero CDN latency.

### 2. 🛡️ Client-Side Liveness & Anti-Spoofing Engine
- Integrated `LivenessDetector` requires physical proof of life (e.g., voluntary blink verification or head orientation cues) prior to capture.
- Computes perceptual image hashes (pHash) on the capture frame to calculate Hamming distance against prior submissions, instantly rejecting re-uploaded or re-photographed digital screens.

### 3. 🎫 Interactive Tactile Scratch Cards
- Successful captures award an unscratched digital scratch card containing a server-locked coin value.
- Smilers scratch the card in real-time with dynamic particle bursts, haptic feedback, and audio cues.
- The reveal action triggers an atomic database transaction that updates card state and commits credits to the ledger.

### 4. 🔥 Daily Streaks, Multipliers & Streak Freezes
- Encourages positive daily habits with progressive streak tiers.
- Higher streaks unlock dynamic multipliers (up to **3.0x bonus coins** per capture).
- Smilers can deploy emergency **Streak Freeze Cards** to protect their progress against missed days or timezone shifts.

### 5. 🏆 Live Leaderboards & Nightly Podium Settlements
- Real-time rankings across **Daily**, **Weekly**, and **Monthly** time windows.
- Automated midnight settlement cron jobs (`/api/cron/leaderboard-settlement`) lock final rankings and grant exclusive bonus podium scratch cards (Gold, Silver, Bronze) directly to winner inventories.

### 6. 🎁 Instant Voucher Marketplace
- Built-in rewards catalog supporting top-tier merchants (Amazon, Flipkart, Swiggy, Apple, Google Play).
- Atomic redemption guarantees zero double-spend: verifies live ledger balance, logs debit transaction, and reveals unique digital redemption codes instantly.

### 7. 🤝 Sybil-Resistant Referral Network
- Every smiler receives a unique referral code and shareable invite link (`?ref=CODE`).
- **Anti-farming invariant:** Referral bonuses for both parties remain locked until the invited user completes their first verified facial capture and passes anti-cheat checks.

### 8. 📸 Privacy-First Explore Feed
- Opt-in community feed showcasing verified smiles from across the globe.
- Captures are private by default; publishing requires explicit user consent.
- Media hosted with a mandatory **1-day auto-delete lifecycle**.

### 9. 👤 Public Smiler Profiles (`/u/[username]`)
- Shareable personal showcase displaying lifetime smile achievements, longest streaks, global rank, and earned milestone badges.

### 10. 🎛️ Admin Command Center
- Live administrative cockpit (`/admin`) for operational maintenance:
  - Runtime parameter adjustments (cooldown duration, min smile threshold, coin multipliers).
  - Real-time catalog and voucher inventory seeding.
  - Explore feed post moderation and suspension controls.
  - Comprehensive immutable audit logs (`admin_audit_logs`).

### 11. 📱 Installable Progressive Web App (PWA)
- Full service worker (`public/sw.js`) caching with offline fallbacks, standalone launch mode, and native mobile ergonomics.

---

## 🏗️ System Architecture

Open Smile is architected as a high-throughput hybrid web platform: a **Next.js 15 App Router** frontend and BFF paired with an asynchronous **FastAPI (`backend_py/`)** gaming engine, both communicating directly with a single **Supabase Postgres** instance.

```mermaid
flowchart TB
    subgraph Client["Browser (Client Experience)"]
        Webcam["Webcam Video Stream"]
        MediaPipe["MediaPipe Face Landmarker<br/>(Client-Side WASM 0-100 Score)"]
        Liveness["LivenessDetector<br/>(Blink + Micro-Movement Proof)"]
        pHash["pHash Frame Fingerprint"]
        UI["Neubrutalist UI & Scratch Cards<br/>(React 19 / Motion / Tailwind v4)"]
        
        Webcam --> MediaPipe
        MediaPipe --> Liveness
        Liveness --> pHash
        pHash --> UI
    end

    subgraph Gateway["Next.js 15 Gateway (App Router BFF)"]
        Pages["Server & Client Components<br/>(/capture, /leaderboard, /rewards, /explore)"]
        AuthRoute["Better Auth & Custom OTP<br/>(/api/auth/*)"]
        ImageKitRoute["ImageKit Signed Token API<br/>(/api/imagekit/*)"]
        AdminRoute["Admin Endpoints & Audit<br/>(/api/admin/*)"]
        Rewrite["API Rewriter<br/>(/api/v1/:path* → FastAPI)"]
        NodePool["Node.js pg Connection Pool<br/>(lib/db/client.ts)"]
        
        Pages --> NodePool
        AuthRoute --> NodePool
        AdminRoute --> NodePool
    end

    subgraph FastAPIEngine["FastAPI Game Engine (backend_py/)"]
        CaptureRouter["/api/v1/capture<br/>(Anti-Cheat, Cooldowns, Scratch Awarding)"]
        StreakRouter["/api/v1/streaks<br/>(Streak Counting & Multipliers)"]
        RewardRouter["/api/v1/rewards<br/>(Scratch Cards & Voucher Marketplace)"]
        LeaderboardRouter["/api/v1/leaderboard<br/>(Daily / Weekly / Monthly Aggregations)"]
        ReferralRouter["/api/v1/refer<br/>(Attribution & First-Capture Unlock)"]
        ExploreRouter["/api/v1/explore<br/>(Public Feed & Likes)"]
        CronRouter["/api/v1/cron<br/>(Midnight Settlement & Cleans)"]
        PyPool["asyncpg Connection Pool<br/>(backend_py/database.py)"]
        
        CaptureRouter --> PyPool
        StreakRouter --> PyPool
        RewardRouter --> PyPool
        LeaderboardRouter --> PyPool
        ReferralRouter --> PyPool
        ExploreRouter --> PyPool
        CronRouter --> PyPool
    end

    subgraph Database["Supabase Postgres (Unified Storage)"]
        AuthSchema["Auth Tables<br/>(user, session, account, verification)"]
        LedgerSchema["Economy & Ledger<br/>(coin_ledger, scratch_cards, smile_captures)"]
        SocialSchema["Social & Badges<br/>(streaks, referrals, posts, likes, hashes)"]
        CatalogSchema["Marketplace & Crons<br/>(vouchers, claimed_vouchers, settlements)"]
        InfraSchema["Security & Limits<br/>(system_settings, rate_limits, otp_codes)"]
        
        NodePool --> AuthSchema
        NodePool --> InfraSchema
        PyPool --> LedgerSchema
        PyPool --> SocialSchema
        PyPool --> CatalogSchema
        PyPool --> AuthSchema
    end

    subgraph External["External Infrastructure"]
        ImageKit["ImageKit Storage<br/>(1-Day Auto-Delete Lifecycle)"]
        VercelCron["Vercel Cron Triggers<br/>(Automated Midnight Tasks)"]
    end

    UI -->|"Navigate & Server Render"| Pages
    UI -->|"Authenticate & OTP"| AuthRoute
    UI -->|"Signed Upload Credentials"| ImageKitRoute
    UI -.->|"Upload Media (Opt-in Feed)"| ImageKit
    UI -->|"Score, Scratch & Claim Requests"| Rewrite
    Rewrite -->|"Reverse Proxy /api/v1"| FastAPIEngine
    VercelCron -->|"Invoke Crons"| Gateway
    Gateway -->|"Delegate"| CronRouter
```

---

## 🔒 Architectural Invariants

1. **Client-Side Biometric Compute**: Raw video streams and camera frames **never** leave the user's browser. The server only receives derived mathematical metrics (normalized 0–100 score, liveness confirmation, perceptual hash).
2. **Immutable Append-Only Ledger (`coin_ledger`)**: Coin balances are never saved as a mutable number. A user's live balance is strictly derived via:
   $$\text{Balance} = \sum_{\text{ledger}} \text{coins}$$
   Every credit or debit is an atomic row insert (`capture`, `scratch_card_*`, `referral_bonus`, `voucher_redemption`, `signup_bonus`).
3. **Dual-Engine Synergy**:
   - **Next.js 15**: Manages React Server Components, server-rendered views, SEO, Better Auth lifecycle, ImageKit token signing, and admin dashboards.
   - **FastAPI (`backend_py/`)**: Executes high-concurrency game logic, anti-cheat validation, streak multipliers, dynamic scratch card generation, and database-level settlements via `asyncpg`.
4. **Single Source of Truth**: Both engines talk to the exact same Postgres database. FastAPI authenticates incoming sessions directly by validating Better Auth's `session` table.
5. **Pre-Locked Game Rewards**: Scratch cards represent interactive reveals over an already cryptographically locked server-side value. Client UI can never manipulate awarded coin counts.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose & Rationale |
|---|---|---|
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) | Fast React Server Components, file-system routing, and built-in edge optimizations. |
| **UI Library** | [React 19](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/) | Modern component architecture, actions, and end-to-end type safety. |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) | High-performance utility-first styling configured for custom Soft Neubrutalism. |
| **Animations** | [Motion (Framer Motion)](https://motion.dev/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Fluid scratch-card gestures, tactile button physics, and podium particle celebrations. |
| **Computer Vision / AI** | [MediaPipe Tasks Vision](https://developers.google.com/mediapipe) | On-device 3D facial landmark detection running via WebAssembly (`@mediapipe/tasks-vision`). |
| **Game Backend** | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+) | Ultra-low-latency asynchronous REST API for gameplay, anti-cheat, and settlements. |
| **Python Database Driver** | [`asyncpg`](https://github.com/MagicStack/asyncpg) | High-throughput asynchronous PostgreSQL connection pool for Python. |
| **Node Database Driver** | [`pg`](https://node-postgres.com/) (Node.js) | Standard parameterized PostgreSQL client pool for Next.js BFF routes. |
| **Database** | [Supabase Postgres](https://supabase.com/) | Unified relational PostgreSQL database holding auth, gameplay, and ledger tables. |
| **Authentication** | [Better Auth](https://better-auth.com/) + Custom OTP | Session management, password hashing, OAuth, and custom email-OTP verification. |
| **Cloud Media Storage** | [ImageKit](https://imagekit.io/) | Signed image upload endpoints with an automated 1-day deletion lifecycle policy. |
| **Email Delivery** | [Nodemailer](https://nodemailer.com/) (SMTP) | Transactional OTP codes and new-login security alerts. |
| **Scheduled Jobs** | [Vercel Cron](https://vercel.com/docs/cron-jobs) | Automated midnight leaderboard settlements, rate-limit purges, and DB keep-alive. |

---

## 📁 Repository Structure

```
open-smile/
├── api/                           # Vercel Serverless Python entrypoint
│   └── index.py                   # FastAPI application initialization & routers
├── app/                           # Next.js 15 App Router
│   ├── (auth)/                    # Authentication routes (login, signup, password reset)
│   ├── (dashboard)/               # Authenticated smiler experience (capture, streaks, leaderboard)
│   ├── (legal)/                   # Compliance & legal (privacy, terms, rules, cookies, security)
│   ├── (marketing)/               # Public marketing pages (about, contact, try, join/[code])
│   ├── (seo)/                     # SEO indices & feeds (sitemap.xml, llms.txt)
│   ├── admin/                     # Administrative command center (settings, vouchers, logs)
│   ├── api/                       # Next.js API Routes (BFF gateway & webhooks)
│   ├── u/                         # Public user profile (/u/[username])
│   ├── verify-otp/                # Standalone OTP verification (/verify-otp)
│   ├── layout.tsx                 # Root layout with fonts, theme & providers
│   ├── manifest.ts                # Progressive Web App (PWA) manifest
│   ├── page.tsx                   # High-converting Neubrutalist landing page
│   └── robots.ts                  # Search crawler directives
├── backend_py/                    # Dedicated Python Game & Reward Engine
│   ├── database.py                # asyncpg connection pool initialization
│   ├── dependencies.py            # Session validation & auth injection
│   ├── models/                    # Pydantic schemas (capture, rewards, referrals)
│   ├── routers/                   # Modular API routers
│   │   ├── capture.py             # Anti-cheat evaluation & reward calculation
│   │   ├── cron.py                # Nightly settlement & database maintenance
│   │   ├── explore.py             # Public feed retrieval & like management
│   │   ├── leaderboard.py         # Windowed leaderboard aggregation
│   │   ├── referrals.py           # Referral code generation & claim logic
│   │   ├── rewards.py             # Scratch card fulfillment & voucher redemption
│   │   └── streaks.py             # Streak tracking & freeze card handlers
│   ├── services/                  # Business logic services
│   └── tests/                     # Pytest automated test suite
├── components/                    # Reusable Neubrutalist UI component library
│   ├── pwa/                       # PWA install prompt & offline indicators
│   ├── ui/                        # Button, Card, Dialog, Toast, Input primitives
│   ├── capture-view.tsx           # Webcam streaming, MediaPipe canvas & scoring
│   ├── scratch-card.tsx           # Interactive canvas scratch reveal component
│   └── voucher-claim-modal.tsx    # Secure voucher code display dialog
├── hooks/                         # Custom React hooks (capture, audio, toast, timer)
├── lib/                           # Core Node.js business logic & helpers
│   ├── db/                        # Parameterized pg queries (client.ts, collections.ts)
│   ├── mailer/                    # Nodemailer email generation & templates
│   └── phash.ts                   # Perceptual image hashing algorithm
├── public/                        # Static assets & client binaries
│   ├── models/                    # MediaPipe WASM and landmark detection task files
│   └── sw.js                      # Progressive Web App Service Worker
├── supabase/                      # Database documentation & schemas
│   └── schema.md                  # Comprehensive Postgres table reference
├── architecture.md                # Detailed technical architectural documentation
├── DESIGN.md                      # Neubrutalism design tokens, physics & color palette
├── security.md                    # Threat modeling, anti-cheat & security rules
├── package.json                   # Node.js project manifest & npm scripts
└── requirements.txt               # Python dependencies
```

---

## 🚀 Getting Started

Follow these instructions to run Open Smile locally on your development machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20.x or later) & `npm`
- [Python](https://www.python.org/) (v3.11 or later)
- [`uv`](https://docs.astral.sh/uv/) (recommended for fast Python environment management) or `pip`
- A [Supabase](https://supabase.com/) Postgres project (or any standard PostgreSQL 15+ instance)
- *(Optional)* An [ImageKit](https://imagekit.io/) account for testing opt-in photo sharing

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ronisarkar-official/open-smile.git
   cd open-smile
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install Python dependencies:**
   Using `uv` (recommended):
   ```bash
   uv venv
   uv pip install -r requirements.txt
   ```
   Or standard `pip`:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

---

### Environment Configuration

Create a `.env.local` file in the project root by copying the template:

```bash
cp .env.example .env.local
```

Populate the configuration variables:

| Variable | Required | Description | Example |
|---|---|---|---|
| `BETTER_AUTH_SECRET` | **Yes** | 32-character hex secret for cookie signing (`openssl rand -hex 32`) | `7b23...fa91` |
| `BETTER_AUTH_URL` | **Yes** | Base URL for server-side auth calls | `http://localhost:3000` |
| `NEXT_PUBLIC_BETTER_AUTH_URL`| **Yes** | Public application origin for client requests | `http://localhost:3000` |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string (pooled recommended) | `postgresql://postgres.[ref]:[pw]@...` |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Supabase Project URL | `https://[ref].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Supabase Service Role Key (admin privileges) | `eyJhbGciOi...` |
| `EMAIL_USER` | **Yes** | SMTP email username for OTP delivery | `your-app@gmail.com` |
| `EMAIL_PASS` | **Yes** | SMTP app password | `abcd efgh ijkl mnop` |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | Optional | ImageKit public key for client-side uploads | `public_...` |
| `IMAGEKIT_PRIVATE_KEY` | Optional | ImageKit private key for signature generation | `private_...` |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`| Optional | ImageKit CDN endpoint URL | `https://ik.imagekit.io/your_id` |
| `ADMIN_EMAILS` | Optional | Comma-separated list of admin email addresses | `admin@opensmile.app` |
| `CRON_SECRET` | Optional | Secret Bearer token authorizing Vercel Cron routes | `super_secret_cron_token` |
| `FASTAPI_URL` | Optional | Address of local Python engine (default: `http://localhost:8000`) | `http://localhost:8000` |

---

### Database Initialization

1. Connect to your database using the [Supabase SQL Editor](https://supabase.com/dashboard) or your preferred SQL GUI (`psql`, DBeaver).
2. Reference [`supabase/schema.md`](./supabase/schema.md) to inspect and verify table definitions:
   - Auth tables (`user`, `session`, `account`, `verification`)
   - Gameplay tables (`smile_captures`, `coin_ledger`, `scratch_cards`, `streaks`, `referrals`)
   - Marketplace tables (`vouchers_catalog`, `claimed_vouchers`, `leaderboard_settlements`)
   - Anti-cheat & system tables (`image_hashes`, `rate_limits`, `otp_codes`, `system_settings`)

---

### Running Locally

Run both the Next.js frontend and the FastAPI backend concurrently using a single command:

```bash
npm run dev:all
```

Alternatively, run each service in separate terminal windows:

```bash
# Terminal 1 — Next.js Frontend & BFF (Port 3000)
npm run dev

# Terminal 2 — FastAPI Gaming Engine (Port 8000)
npm run dev:py
```

Once running, navigate to:
- **Web Application:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🎮 Core Game Mechanics & Economy

```
┌─────────────────────────────────────────────────────────────┐
│                 THE OPEN SMILE CORE LOOP                    │
│                                                             │
│   Webcam Smile ──► MediaPipe Score ──► Liveness Verified    │
│                            │                                │
│                            ▼                                │
│                   Anti-Cheat Evaluated                      │
│   (Cooldown + Cap + pHash Non-Duplicate Verification)       │
│                            │                                │
│                            ▼                                │
│               Scratch Card Awarded (Locked)                 │
│                            │                                │
│                            ▼                                │
│                Tactile Scratch Reveal                       │
│                            │                                │
│                            ▼                                │
│              Atomic `coin_ledger` Insert                    │
│                            │                                │
│                            ▼                                │
│           Streak Multiplier + Voucher Redemption            │
└─────────────────────────────────────────────────────────────┘
```

### Reward Formula
The coins awarded per capture are calculated deterministically on the server:

$$\text{Coins} = \max\left(5, \left\lfloor \frac{\text{Smile Score}}{10} \times \text{Streak Multiplier} \times \text{Global Multiplier} \right\rfloor\right)$$

- **Smile Score**: Continuous integer between 0 and 100 derived from facial geometry.
- **Minimum Threshold**: Configurable via `system_settings` (default: 40). Scores below this threshold award zero coins.
- **Streak Multiplier**:
  - Days 1–2: `1.0x`
  - Days 3–6: `1.2x`
  - Days 7–13: `1.5x`
  - Days 14–29: `2.0x`
  - Days 30+: `3.0x`

---

## 🛡️ Anti-Cheat & Security Posture

| Defense Layer | Mechanism | Protection Scope |
|---|---|---|
| **Capture Cooldown** | Derived from `MAX(created_at)` in `smile_captures` | Eliminates rapid-fire automated submission bots. |
| **Liveness Verification** | Client-side natural blink & orientation detection | Rejects static prints, digital screens, and recorded video loops. |
| **Perceptual Hashing (pHash)** | Computes 64-bit DCT perceptual hash on frame | Detects re-submitted or re-compressed duplicate photos via Hamming distance ($\le 5$). |
| **Daily Capture Caps** | Capped at $N$ captures/day per user (dynamic setting) | Restricts farming volume per account. |
| **Referral Lock Gate** | Referral bonuses defer until first valid capture | Blocks sybil farming via automated signup scripts. |
| **Database-Backed Rate Limiting** | Stored in Postgres `rate_limits` table | Survives serverless cold starts across auth, OTP, and capture routes. |
| **Tamper-Proof Ledger** | Immutable append-only `coin_ledger` | Prevents race-condition exploits and direct balance manipulation. |
| **Ephemeral Image Retention** | 1-Day ImageKit auto-delete lifecycle | Upholds user privacy: biometric images are never hoarded. |

---

## 🔌 API & Route Reference

### Next.js BFF & Gateway Routes (`/api/...`)

- `POST /api/auth/[...all]` — Better Auth session, login, and registration handler.
- `POST /api/auth/send-otp` — Generates and dispatches 6-digit cryptographic email OTP.
- `POST /api/auth/verify-otp` — Validates email verification code with attempt throttling.
- `POST /api/imagekit/auth` — Generates signed upload credentials for client image uploads.
- `GET  /api/health` — Comprehensive system health check (Postgres, Python backend, SMTP).
- `POST /api/cron/leaderboard-settlement` — Midnight cron job finalizing rankings and distributing prizes.
- `POST /api/cron/cleanup` — Midnight cleanup purging expired OTPs and obsolete rate-limit counters.

### FastAPI Game Engine Endpoints (`/api/v1/...`)

All `/api/v1/*` requests are transparently rewritten by Next.js to FastAPI and authenticated via session cookies.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/capture/submit` | Validates liveness, verifies pHash, calculates score, and issues a locked scratch card. |
| `GET`  | `/api/v1/rewards/scratch-cards` | Retrieves active smiler scratch card inventory. |
| `POST` | `/api/v1/rewards/scratch-cards/{id}/scratch` | Atomically redeems scratch card and inserts coins into ledger. |
| `GET`  | `/api/v1/rewards/vouchers` | Lists active voucher marketplace catalog. |
| `POST` | `/api/v1/rewards/claim-voucher` | Atomically redeems voucher against live coin balance. |
| `GET`  | `/api/v1/streaks/me` | Fetches active streak count, grace window, and freeze card status. |
| `POST` | `/api/v1/streaks/use-freeze` | Activates an emergency streak freeze card. |
| `GET`  | `/api/v1/leaderboard` | Returns windowed rankings (`daily`, `weekly`, `monthly`). |
| `GET`  | `/api/v1/refer/stats` | Retrieves personalized referral code, count, and unlocked rewards. |
| `GET`  | `/api/v1/explore` | Fetches public opt-in community smile posts. |
| `POST` | `/api/v1/explore/{id}/like` | Toggles community like reaction on an explore post. |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js frontend development server at `localhost:3000`. |
| `npm run dev:py` | Starts the Python FastAPI engine via `uvicorn` on `localhost:8000`. |
| `npm run dev:all` | Concurrently launches both Next.js and FastAPI with synchronized logging. |
| `npm run test:py` | Executes the automated test suite using `pytest`. |
| `npm run build` | Produces an optimized production build of the Next.js application. |
| `npm run start` | Launches the Next.js application in production mode. |
| `npm run lint` | Runs ESLint across all TypeScript and React files. |

---

## 👥 The Team Behind Open Smile

Open Smile was conceived, designed, and engineered by a multidisciplinary team of 5 developers combining on-device computer vision, resilient cloud infrastructure, transactional database architecture, and tactile neubrutalist UI engineering.

| Creator | Role & Discipline | Core Domains | Engineering Focus |
|---|---|---|---|
| **[Roni Sarkar](https://github.com/ronisarkar-official)** | **Frontend & UI/UX Lead** | Next.js 15, Tailwind CSS v4, Motion, PWA | Architected the signature soft neubrutalist UI system, interactive canvas scratch-card reveals, tactile physics, smiler dashboard, and responsive mobile PWA experience. |
| **Akash** | **Backend & Game Engine** | FastAPI, Python 3.11+, asyncpg | Designed the real-time scoring verification pipeline, streak multiplier math, rate-limiting layers, and sybil-resistant referral unlock gates. |
| **Subal** | **AI & Computer Vision** | MediaPipe WASM, 3D Face Landmarker | Fine-tuned in-browser 478 3D facial landmark detection, genuine Duchenne smile curvature scoring algorithms (0–100), and client-side liveness blink verification. |
| **Sohan** | **Database Architect** | Supabase Postgres, SQL Migrations | Implemented the tamper-proof append-only `coin_ledger`, ACID transaction boundaries, immutable audit logs, and optimized relational indexing. |
| **Ayushi** | **Cloud & Infrastructure** | Vercel Edge, ImageKit, SMTP | Engineered zero-retention cloud storage pipelines with strict 24-hour auto-purge lifecycles, Vercel cron midnight settlements, and transactional email deliverability. |

---

## 🤝 Contributing Guidelines

We warmly welcome contributions from the open-source community! Whether you are fixing bugs, optimizing ML inference latency, proposing new reward vouchers, or improving accessibility, your help makes Open Smile better.

### Development Workflow

1. **Fork the Repository**:
   Click the **Fork** button at the top right of this repository to create your personal copy.

2. **Clone & Create a Feature Branch**:
   ```bash
   git clone https://github.com/<your-username>/open-smile.git
   cd open-smile
   git checkout -b feat/your-feature-name
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   uv venv && uv pip install -r requirements.txt
   ```

4. **Adhere to Code & Architecture Invariants**:
   - **Privacy Posture**: Never transmit raw video feeds or biometric imagery to any backend server. All facial landmark scoring must run strictly client-side via `@mediapipe/tasks-vision`.
   - **Append-Only Economy**: Never write updates or mutations to a mutable "balance" column. Every coin adjustment must be an atomic `INSERT` into `coin_ledger` with an explicit `reason`.
   - **Database Discipline**: All Postgres interactions must use parameterized SQL (`$1, $2, ...`) via `lib/db/collections.ts` or `asyncpg`. Never string-interpolate queries.
   - **Code Cleanliness**: Follow the repository's convention of self-documenting code through descriptive naming without extraneous inline comments.
   - **Design Fidelity**: All UI modifications must follow the Soft Neubrutalism design system in [`DESIGN.md`](./DESIGN.md) (7px border-radius, crisp borders, directional brutal shadows).

5. **Validate Your Changes**:
   ```bash
   # Run TypeScript & ESLint validation
   npm run lint

   # Run Python backend test suite
   npm run test:py

   # Verify production build compilation
   npm run build
   ```

6. **Submit a Pull Request**:
   - Commit your changes with a clear, conventional commit message (e.g., `feat: add streak freeze animation` or `fix: resolve pHash calculation edge case`).
   - Push your branch to GitHub:
     ```bash
     git push origin feat/your-feature-name
     ```
   - Open a Pull Request targeting the `master` branch. Include a descriptive summary of your changes, any relevant issue numbers, and screenshots/screen-recordings of UI adjustments.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.

---

## 🙏 Acknowledgments

- **[Google MediaPipe](https://developers.google.com/mediapipe)** for pioneering on-device, client-side WebAssembly vision models.
- **[Supabase](https://supabase.com/)** for providing a reliable, developer-friendly PostgreSQL ecosystem.
- **[Vercel](https://vercel.com/)** for world-class Next.js hosting, Edge runtime, and automated scheduled crons.
- **[Better Auth](https://better-auth.com/)** for robust, modern web authentication.
- All our early testers and smilers who keep the streaks alive! 😁

