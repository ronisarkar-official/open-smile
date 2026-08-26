# Architecture — Open Smile

This document describes how Open Smile is put together: system boundaries, data flow, and the reasoning behind the key structural decisions. For conventions and coding rules, see AGENTS.md. For the threat model, see security.md.

## System overview

Open Smile is a single Next.js 15 application (App Router) with no separate backend service. All server-side logic lives in Next.js API routes and server components, talking to one Supabase Postgres database. There is no microservice split — the boundaries that matter here are *client vs. server* and *trusted vs. untrusted computation*, not separate deployable services.

```mermaid
flowchart TB
    subgraph Client["Browser (Client)"]
        Webcam["Webcam Feed"]
        FaceAI["MediaPipe / face-api.js<br/>(Client-Side Scoring)"]
        UI["UI / Scratch Card<br/>(Reveal Animation)"]
        RealtimeSub["Realtime Listener<br/>(Live Leaderboard)"]
        
        Webcam --> FaceAI
        FaceAI -->|"Smile Score (0-100) + pHash"| UI
    end

    subgraph Server["Next.js 15 Server (App Router)"]
        AuthRoutes["/api/auth/* & Custom OTP<br/>(Better Auth + OTP Handlers)"]
        CaptureRoute["/api/capture<br/>(Score Validation, Anti-Cheat, Coin Engine)"]
        LeaderboardRoute["/api/leaderboard<br/>(Aggregation Queries)"]
        ImageKitAuth["/api/imagekit/*<br/>(Upload Auth & Signatures)"]
        BetaRoute["/api/beta-join<br/>(Waitlist Handler)"]
        DBPool["backend/db/collections.ts<br/>(Parameterized SQL Pool via pg)"]
        
        CaptureRoute --> DBPool
        AuthRoutes --> DBPool
        LeaderboardRoute --> DBPool
        BetaRoute --> DBPool
    end

    subgraph Database["Supabase Postgres (Single DB)"]
        AuthTables["Better Auth Tables<br/>(user, session, account, verification)"]
        AppTables["App Tables<br/>(smile_captures, coin_ledger, streaks, rewards, referrals, posts, image_hashes)"]
        InfraTables["Infra Tables<br/>(otp_codes, rate_limits, beta_waitlist)"]
        RealtimeEngine["Supabase Realtime Engine"]
        
        DBPool -->|"Parameterized SQL ($1, $2)"| AuthTables
        DBPool -->|"Parameterized SQL ($1, $2)"| AppTables
        DBPool -->|"Parameterized SQL ($1, $2)"| InfraTables
        AppTables -.->|"CDC / WAL Events"| RealtimeEngine
    end

    subgraph Storage["External Storage"]
        ImageKit["ImageKit Storage<br/>(1-Day Auto-Delete Lifecycle)"]
    end

    UI -->|"Submit Score + Frame pHash"| CaptureRoute
    CaptureRoute -->|"Return Locked Coins"| UI
    UI -.->|"Request Upload Signature"| ImageKitAuth
    ImageKitAuth -.->|"Signed Upload Credentials"| UI
    UI -.->|"Upload Image (Opt-in Explore only)"| ImageKit
    RealtimeEngine -.->|"Live Updates (WebSocket)"| RealtimeSub
```

## Why this shape

**Single Next.js app, no separate backend.** The product doesn't need independent scaling of frontend vs. backend, and a hackathon/early-stage timeline favors one deployable unit over service-to-service complexity. Next.js API routes are sufficient for everything here — auth, scoring validation, leaderboard queries.

**One Postgres database, not split by concern.** Auth data (Better Auth's tables), the coin economy, and social/anti-cheat data all live in the same Postgres instance. This is deliberate: the coin ledger needs to join against `user.id` constantly (leaderboards, referral payouts, streak lookups), and splitting auth into a separate store (e.g. keeping Supabase Auth while app data lives elsewhere) would mean syncing user IDs across two systems for no real benefit. See the "Auth Architecture" reasoning below.

**Client-side smile scoring, not server-side.** MediaPipe/face-api.js run in-browser. This is both a cost decision (no server GPU needed) and a privacy decision (raw video frames don't need to leave the device for scoring in most flows). The server's job is to *validate and price* a score, not compute it from raw media.

## Auth architecture

Better Auth owns `user`, `session`, `account`, and `verification` directly in the same Postgres database — it does **not** sit on top of Supabase Auth. In this stack, Supabase is purely Postgres + Realtime + (optionally) Storage; its own Auth product is unused.

- Access is via a raw `pg` connection pool (`backend/db/client.ts`), not an ORM. `backend/db/collections.ts` centralizes typed, parameterized query helpers so SQL isn't scattered through route handlers.
- A custom email-OTP layer sits alongside Better Auth (`otp_codes` table + `send-otp` / `verify-otp` / `check-credentials` / `mark-verified` / `notify-login` routes) for verification and login-notification flows Better Auth doesn't handle out of the box.
- App tables (`smile_captures`, `coin_ledger`, etc.) reference `user.id` as a plain foreign key — one source of truth, no UID-syncing between systems.
- **Known integration seam:** Supabase Realtime's built-in RLS policies expect Supabase Auth JWTs by default. Since auth is Better Auth, per-user Realtime channel authorization (e.g. private leaderboard subscriptions) needs the Better Auth session passed into Realtime's presence/broadcast auth callback manually. This is the one place the "two systems, one database" architecture requires extra wiring, and it should be verified before relying on Realtime for anything access-controlled.

## Data flow: a smile capture, end to end

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as Browser (MediaPipe / UI)
    participant Server as Next.js API (/api/capture)
    participant DB as Supabase Postgres
    participant Realtime as Supabase Realtime

    User->>Client: Smiles into webcam
    Client->>Client: Detect landmarks (mouth curvature, eye crinkle)
    Client->>Client: Compute score (0–100) & frame pHash
    Client->>Server: POST /api/capture (score, pHash, liveness proof)

    Note over Server,DB: Anti-Cheat Pipeline (Fast-Reject)
    Server->>DB: 1. Cooldown check (MAX created_at in smile_captures)
    Server->>DB: 2. Liveness check verification
    Server->>DB: 3. pHash duplicate check (image_hashes table)
    Server->>DB: 4. Daily capture cap check

    Note over Server,DB: Coin & Streak Processing
    Server->>DB: Calculate base coins × streak multiplier
    Server->>DB: INSERT into coin_ledger (reason: 'capture')
    Server->>DB: UPDATE streaks & INSERT smile_captures & image_hashes

    Server-->>Client: Return locked coin reward & updated streak
    Client->>User: Play Scratch Card reveal animation
    DB-->>Realtime: Emit coin_ledger insert event
    Realtime-->>Client: Broadcast live leaderboard update
```

1. **Client:** webcam frame → MediaPipe/face-api.js landmark detection (in-browser) → smile score (0–100) computed from mouth curvature, width/height ratio, eye crinkle.
2. **Client → Server:** score (and enough metadata for anti-cheat, e.g. a perceptual hash of the frame) is sent to the capture endpoint. The raw image itself only goes to ImageKit if the feature needs persistence (e.g. a potential Explore post) — not to the scoring path.
3. **Server, anti-cheat checks (in order, reject fast):**
   - Cooldown check — `MAX(created_at)` for this user in `smile_captures`, reject if inside the cooldown window.
   - Liveness signal present — reject captures that skipped the liveness check client-side.
   - Perceptual hash check against `image_hashes` for this user — reject near-duplicate/re-photographed images.
   - Daily capture cap check.
4. **Server, coin calculation:** score → base coins, multiplied by current streak multiplier (capped), inserted as a **new row** in `coin_ledger` (never a balance mutation) with `reason: 'capture'`. Streak state (`streaks` table) updated.
5. **Server → Client:** the *already-locked* coin amount is returned. The scratch card is purely a client-side reveal animation over this value — it has no authority over what the reward actually is.
6. **Realtime:** the leaderboard's underlying aggregation reflects the new ledger row; connected clients see the update via Supabase Realtime without polling.

## Data flow: referrals

```mermaid
sequenceDiagram
    autonumber
    actor Referrer
    actor Friend as Referred Friend
    participant Client as Friend's Browser
    participant Server as Next.js API
    participant DB as Supabase Postgres

    Note over Referrer,Friend: Referral Link Shared (?ref=REFERRER_CODE)
    Friend->>Server: POST /api/auth/sign-up (email, password, ref_code)
    Server->>DB: Create User & INSERT referrals (status: 'pending')
    Note over DB: No coins awarded yet (anti-farming protection)

    Friend->>Client: Completes first smile capture
    Client->>Server: POST /api/capture (first valid capture score)
    Server->>DB: Validate capture & pass anti-cheat checks

    Note over Server,DB: Referral Activation Trigger
    Server->>DB: Find pending referral for Friend
    Server->>DB: Check Referrer's daily referral reward cap
    Server->>DB: INSERT coin_ledger for Referrer (reason: 'referral_bonus')
    Server->>DB: INSERT coin_ledger for Friend (reason: 'referral_bonus')
    Server->>DB: UPDATE referrals SET status = 'rewarded'

    Server-->>Client: Return capture reward + referral welcome bonus
```

1. Signup via a referral link records a `referrals` row (`referrer_id`, `referred_id`, `status: 'pending'`).
2. The reward does **not** trigger on signup. It triggers when the referred user completes their first successful capture (i.e. passes the anti-cheat checks above and gets a `coin_ledger` row) — this closes the "create fake accounts for free coins" loophole that a signup-triggered reward would leave open.
3. On trigger: two `coin_ledger` inserts (referrer bonus, referred bonus) with `reason: 'referral_bonus'`, gated by a per-referrer daily cap checked against that day's already-rewarded referrals.

## Storage boundaries

- **Postgres (Supabase):** all structured data — users, sessions, coins, streaks, rewards, referrals, post metadata, likes, OTPs, rate limits. Source of truth for everything transactional.
- **ImageKit:** binary image data only. 1-day auto-delete applies uniformly — captures and Explore posts alike. Postgres never stores image bytes, only `image_url` references.
- **Nothing is cached outside these two stores** at this stage — no separate cache/queue layer yet. If leaderboard aggregation queries become a bottleneck, the planned mitigation is a materialized view or scheduled rollup table in Postgres, not a new caching service, to keep the "one database" property intact.

## Cross-cutting concerns

- **Rate limiting** is DB-backed (`rate_limits` table, windowed counters), not in-memory — this matters specifically because the app deploys to a serverless environment (Vercel) where in-memory state doesn't survive across invocations/cold starts.
- **Expiry/cleanup** (OTPs, rate limit windows) is explicit `DELETE ... WHERE expires_at <= NOW()` logic, run on a schedule, since Postgres has no equivalent to MongoDB's TTL indexes (a leftover consideration from before the Mongo → Postgres migration).
- **No comments in code** — architecture and intent live in these docs (AGENTS.md, security.md, this file), not inline in the codebase, per project convention.

## What's structurally missing

The product's core loop (`/capture`, scratch card, `/leaderboard`, `/explore`, `/rewards`, `/refer`) is not yet scaffolded — everything built so far is auth and infrastructure. Architecturally, none of this requires new services or a stack change; it's new API routes and pages on top of the same Postgres database and the same client-side scoring approach already decided above.

## Deployment note

Supabase free-tier projects auto-pause after 7 days of API inactivity. A scheduled keep-alive ping (e.g. a GitHub Actions cron hitting a lightweight endpoint every 2-3 days) is required to prevent the database going offline between active development/demo sessions.
