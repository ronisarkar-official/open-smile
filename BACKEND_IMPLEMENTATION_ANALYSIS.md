# Open Smile — Backend Architecture & Implementation Gap Analysis (FastAPI on Vercel)

**Document Version:** 2.0 (Updated with Live Postgres Schema & Python FastAPI on Vercel Architecture)  
**Date:** August 2026  
**Repository:** Open Smile (`ronisarkar-official/boilerplate-no-payment`)

---

## 1. System Architecture: Next.js + Python FastAPI (Vercel Serverless)

Open Smile uses a **hybrid architecture** deployed entirely on **Vercel** with **Supabase PostgreSQL** as the single unified database.

```
                      ┌────────────────────────────────────────────────────────┐
                      │                   Next.js 15 (Frontend)                │
                      │         App Router, UI Components, Client Scoring      │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                      ┌───────────────────────────┴────────────────────────────┐
                      │                   Request Routing                      │
                      ├────────────────────────────┬───────────────────────────┤
                      │                            │                           │
                      ▼                            ▼                           ▼
        ┌───────────────────────────┐┌───────────────────────────┐┌───────────────────────────┐
        │ Next.js Auth API Route    ││ ImageKit Routes           ││ Next.js Rewrites / Proxy  │
        │ /api/auth/*               ││ /api/imagekit/*           ││ /api/v1/*                 │
        ├───────────────────────────┤├───────────────────────────┤├───────────────────────────┤
        │ • Better Auth Handlers    ││ • Upload Auth Signatures  ││ Rewrites to Vercel Python │
        │ • Custom OTP Endpoints    ││ • Direct Uploads          ││ Serverless Function       │
        │ • Password Reset & Verify ││                           ││ api/index.py              │
        └─────────────┬─────────────┘└─────────────┬─────────────┘└─────────────┬─────────────┘
                      │                            │                            │
                      ▼                            │                            ▼
        ┌───────────────────────────┐              │              ┌───────────────────────────┐
        │ PostgreSQL DB (Supabase)  │◄─────────────┼──────────────┤ Python FastAPI (Vercel)   │
        │ (user, session, account)  │              │              │ api/index.py              │
        ├───────────────────────────┤              │              ├───────────────────────────┤
        │ • App Tables              │              │              │ • Capture & Anti-Cheat    │
        │ • Coin Ledger             │              │              │ • Leaderboard Aggregations│
        │ • Streaks & Vouchers      │              │              │ • Rewards Marketplace     │
        │ • Explore Posts & Likes   │              │              │ • Referrals Engine        │
        │ • Image Hashes            │              │              │ • Activity & Notifications│
        └───────────────────────────┘              │              └─────────────┬─────────────┘
                                                   ▼                            │
                                     ┌───────────────────────────┐              │
                                     │ ImageKit (1-Day Storage)  │◄─────────────┘
                                     └───────────────────────────┘
```

### Architectural Boundaries & Rules
1. **Authentication Remains in Next.js (`app/api/auth/*`):**
   - Better Auth, OTP verification (`send-otp`, `verify-otp`), credentials checking, and password resets remain strictly inside Next.js.
   - **Do NOT touch or move authentication files.**
2. **Product Logic Built in Python FastAPI (`api/index.py` & `backend_py/`):**
   - All gamification, anti-cheat, coin ledger transactions, leaderboard aggregations, explore feeds, rewards redemption, and referral triggers are implemented in Python FastAPI.
3. **100% Vercel-Friendly (Serverless Python Runtime):**
   - No external hosting like Render or dedicated long-running containers.
   - FastAPI is exported as an ASGI handler in `api/index.py`. Vercel natively executes it via `@vercel/python`.
   - Next.js proxies/rewrites `/api/v1/:path*` to `api/index.py`.
4. **Session Auth Bridge in FastAPI:**
   - FastAPI reads the Better Auth cookie (`better-auth.session_token` / `__Secure-better-auth.session_token`) or `Authorization: Bearer <token>` from the incoming request.
   - FastAPI dependency `get_current_user` validates the token directly against the `session` table in Postgres (`SELECT * FROM "session" WHERE token = $1 AND "expiresAt" > NOW()`), yielding verified user identity in $< 2\text{ms}$ with zero inter-service overhead.

---

## 2. Live Database Schema Status

The live PostgreSQL database already has the following core tables created:

| Table | Live Columns | FastAPI Model & Domain | Status |
|---|---|---|---|
| `public.user` | `id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`, `twoFactorEnabled`, `role`, `banned`, `banReason`, `banExpires`, `password_hash`, `streak_count`, `last_streak_at`, `referral_code`, `referred_by`, `email_verified`, `created_at`, `updated_at` | User Profile & Auth reference | Live (Managed by Better Auth + Custom fields) |
| `public.smile_captures` | `id` (UUID), `user_id`, `smile_score` (0–100), `coins_awarded`, `created_at` | Capture & Score History | Live |
| `public.coin_ledger` | `id` (UUID), `user_id`, `coins`, `reason`, `created_at` | Append-Only Coin Ledger | Live |
| `public.streaks` | `user_id` (PK), `streak_count`, `last_capture_at`, `freeze_available`, `freeze_used_at` | Streak & Grace Window Engine | Live |
| `public.rewards` | `id` (UUID), `user_id`, `tier`, `provider`, `voucher_code`, `coins_spent`, `claimed_at` | Claimed Voucher Redemptions | Live |
| `public.vouchers` | `id` (UUID), `user_id`, `voucher_type`, `coin_cost`, `code`, `status`, `created_at` | Pre-seeded / Claimed Vouchers | Live |
| `public.referrals` | `id` (UUID), `referrer_id`, `referred_id` (UNIQUE), `status` ('pending'/'completed'), `created_at`, `completed_at` | Referral Program Tracking | Live |
| `public.posts` / `public.explore_posts` | `id` (UUID), `user_id`, `capture_id`, `image_url`, `smile_score`, `caption`, `like_count`/`likes_count`, `created_at` | 24h Opt-In Community Smile Feed | Live |
| `public.likes` / `public.explore_likes` | `id` (UUID) / `(user_id, post_id)` PK, `user_id`, `post_id`, `created_at` | Duplicate-Safe Post Likes | Live |
| `public.image_hashes` | `id` (UUID), `user_id`, `capture_id`, `image_hash`, `phash`, `created_at` | Anti-Cheat Perceptual Hashing (pHash) | Live |
| `public.otp_codes` | `email` (PK), `otp_hash`, `attempts`, `created_at`, `expires_at` | Next.js Email OTP Flow | Live |
| `public.rate_limits` | `id` (PK), `count`, `window_start`, `expires_at` | Rate Limiting | Live |
| `public.beta_waitlist` | `email` (PK), `created_at` | Beta Waitlist | Live |

---

## 3. What Backend APIs & Features Are NOT Implemented (FastAPI Checklist)

The following Python FastAPI backend structure and endpoints need to be built:

### Recommended Project Structure & Ownership

```
d:\open-smile\
├── api\
│   └── index.py                 # [Phase 1 - Subal] FastAPI ASGI entrypoint & router registry
├── backend_py\
│   ├── __init__.py
│   ├── config.py                # [Phase 1 - Subal] Env settings, DB credentials, secrets
│   ├── database.py              # [Phase 1 - Subal] Async PostgreSQL connection pool (asyncpg)
│   ├── dependencies.py          # [Phase 1 - Subal] get_current_user, get_db_pool dependencies
│   ├── models\
│   │   ├── __init__.py
│   │   │   # --- Phase 1 Models (Subal) ---
│   │   ├── user.py              # [Phase 1 - Subal] User session & auth response schemas
│   │   ├── capture.py           # [Phase 1 - Subal] Capture submit, liveness & result schemas
│   │   ├── streaks.py           # [Phase 1 - Subal] Streak status & freeze schemas
│   │   ├── refer.py             # [Phase 1 - Subal] Referral stats & validate schemas
│   │   │   # --- Phase 2 Models (Akash) ---
│   │   ├── leaderboard.py       # [Phase 2 - Akash] Podium & ranking schemas
│   │   ├── rewards.py           # [Phase 2 - Akash] Voucher catalog, claim & badge schemas
│   │   ├── explore.py           # [Phase 2 - Akash] Explore post & like schemas
│   │   └── activity.py          # [Phase 2 - Akash] Marquee activity ticker schemas
│   ├── routers\
│   │   ├── __init__.py
│   │   │   # --- Phase 1 Routers (Subal) ---
│   │   ├── capture.py           # [Phase 1 - Subal] /api/v1/capture (Core smile pipeline)
│   │   ├── streaks.py           # [Phase 1 - Subal] /api/v1/streaks (Streak & freeze APIs)
│   │   ├── refer.py             # [Phase 1 - Subal] /api/v1/refer (Referral stats & validate)
│   │   ├── cron.py              # [Phase 1 - Subal] /api/v1/cron (Cleanup & Keep-alive crons)
│   │   │   # --- Phase 2 Routers (Akash) ---
│   │   ├── leaderboard.py       # [Phase 2 - Akash] /api/v1/leaderboard (Rankings & podium)
│   │   ├── rewards.py           # [Phase 2 - Akash] /api/v1/rewards (Catalog, claims, badges)
│   │   ├── explore.py           # [Phase 2 - Akash] /api/v1/explore (Feed, posts, likes)
│   │   ├── activity.py          # [Phase 2 - Akash] /api/v1/activity (Live recent ticker)
│   │   └── users.py             # [Phase 2 - Akash] /api/v1/users (Public profiles)
│   └── services\
│       │   # --- Phase 1 Services (Subal) ---
│       ├── anti_cheat.py        # [Phase 1 - Subal] Cooldown, daily cap, pHash Hamming, liveness
│       ├── coin_engine.py       # [Phase 1 - Subal] Multipliers, append-only ledger insertions
│       ├── streak_engine.py     # [Phase 1 - Subal] 24-48h grace window & freeze consumption
│       └── referral_engine.py   # [Phase 1 - Subal] Referral rewards trigger on 1st capture
├── requirements.txt             # [Phase 1 - Subal] Python dependencies for Vercel
```

---

### Route Summary Table (Grouped by Phase & Developer)

#### Phase 1: Subal (Lead Developer — Foundation, Core Engine & Security)
| Route Endpoint | Method | Assigned Dev | Core Responsibility |
|---|---|---|---|
| `/api/v1/health` | GET | **Subal** | Serverless health check & status |
| `/api/v1/capture/submit` | POST | **Subal** | Anti-cheat pipeline, liveness, pHash, coin & streak calculation |
| `/api/v1/user/streak` | GET | **Subal** | User streak count, grace window status |
| `/api/v1/user/streak/freeze` | POST | **Subal** | Weekly streak freeze consumption |
| `/api/v1/refer/stats` | GET | **Subal** | User referral code, link, stats, pending counts |
| `/api/v1/refer/validate` | POST | **Subal** | Referral code validation during onboarding |
| `/api/v1/cron/cleanup` | POST | **Subal** | Expired OTP/rate limit/image hash/explore post cleanup |
| `/api/v1/cron/keepalive` | GET | **Subal** | Supabase keepalive ping |

#### Phase 2: Akash (Backend Developer — Gamification, Marketplace & Social)
| Route Endpoint | Method | Assigned Dev | Core Responsibility |
|---|---|---|---|
| `/api/v1/leaderboard` | GET | **Akash** | Daily/Weekly/Monthly rankings, podium top 3, user rank |
| `/api/v1/rewards/catalog` | GET | **Akash** | Voucher brands, tiers, coin costs |
| `/api/v1/rewards/claim` | POST | **Akash** | Atomic balance check, coin deduction, voucher generation |
| `/api/v1/rewards/my-vouchers` | GET | **Akash** | User claimed vouchers list |
| `/api/v1/rewards/badges` | GET | **Akash** | Lifetime milestone badge unlock statuses |
| `/api/v1/rewards/signup-bonus` | POST | **Akash** | One-time +50 coins signup bonus check & award |
| `/api/v1/explore/feed` | GET | **Akash** | 24-hour community feed with like status |
| `/api/v1/explore/post` | POST | **Akash** | Opt-in smile post creation (+5 daily bonus) |
| `/api/v1/explore/{post_id}/like` | POST | **Akash** | Atomic like toggle & count update |
| `/api/v1/activity/recent` | GET | **Akash** | Anonymized live ticker event feed |
| `/api/v1/users/{username}` | GET | **Akash** | Sanitized public user profile data |

---

## PART 1: PHASE 1 SPECIFICATIONS — SUBAL (LEAD BACKEND)

Subal executes **all** foundational infrastructure, anti-cheat validation, capture processing, coin transaction writing, streak engine mechanics, referral reward hooks, and scheduled maintenance crons.

### 1.1 Smile Capture & Anti-Cheat Pipeline (Subal)
- **`POST /api/v1/capture/submit`**
  - **Auth:** Required (via Better Auth session)
  - **Request Body:**
    ```json
    {
      "smile_score": 94,
      "phash": "a1b2c3d4e5f60718",
      "liveness_verified": true
    }
    ```
  - **Anti-Cheat Pipeline (`backend_py/services/anti_cheat.py`):**
    1. **Cooldown Check:** Query `MAX(created_at)` from `smile_captures` for `user_id`. Reject with `429` if elapsed time $< 1\text{ hour}$.
    2. **Daily Cap Check:** Count captures for `user_id` in current UTC day. Reject with `429` if $\ge 5\text{ captures/day}$.
    3. **Liveness Check:** Validate `liveness_verified == true`. Reject with `400` if missing.
    4. **pHash Duplicate Check:** Query user's past 30-day `image_hashes`. Compute Hamming distance. Reject with `400` if distance $\le 5$ (duplicate photo / screen replay).
  - **Coin & Streak Engine (`backend_py/services/streak_engine.py` & `coin_engine.py`):**
    1. Look up user's `streaks` row (streak count & last capture timestamp).
    2. Compute multiplier: $1.0\times$ (day 1), $1.2\times$ (day 2), $1.5\times$ (day 3+), capped at $2.0\times$.
    3. Base coins = $\text{round}(\text{smile\_score} \times 0.15)$. Total coins = $\text{round}(\text{base} \times \text{multiplier})$.
    4. **INSERT** into `smile_captures`.
    5. **INSERT** into `coin_ledger` (`coins: total_coins`, `reason: 'capture'`).
    6. **INSERT** into `image_hashes` (`phash: payload.phash`).
    7. **UPDATE / UPSERT** `streaks` (increment streak count if within 24–48h window; reset if broken).
  - **Referral Trigger Check (`backend_py/services/referral_engine.py`):**
    - Check if this is user's first successful capture and there is a `referrals` row with `referred_id = user.id` and `status = 'pending'`.
    - If found and referrer's daily referral rewards $< 5$:
      - **INSERT** into `coin_ledger` for referrer (`coins: 200`, `reason: 'referral_bonus'`).
      - **INSERT** into `coin_ledger` for referee (`coins: 50`, `reason: 'referral_bonus'`).
      - **UPDATE** `referrals SET status = 'completed', completed_at = NOW()`.
  - **Response:**
    ```json
    {
      "coins_awarded": 18,
      "base_coins": 12,
      "streak_multiplier": 1.5,
      "streak_count": 4,
      "balance": 342,
      "first_capture_bonus_unlocked": true
    }
    ```

### 1.2 Streak & Freeze Management (Subal)
- **`GET /api/v1/user/streak`**
  - **Auth:** Required
  - Returns streak count, grace period expiration timestamp, and `freeze_available` status.
- **`POST /api/v1/user/streak/freeze`**
  - **Auth:** Required
  - Consumes available weekly freeze (`freeze_available = false`, `freeze_used_at = NOW()`).

### 1.3 Refer & Earn Program (Subal)
- **`GET /api/v1/refer/stats`**
  - **Auth:** Required
  - **Logic:** Retrieves user's `referral_code` from `"user"`, total referred friends, pending count, total bonus coins earned from `coin_ledger` (`reason = 'referral_bonus'`), and remaining reward slots for today (max 5/day).
  - **Response:**
    ```json
    {
      "referral_code": "SMILE-R0N1",
      "referral_link": "https://opensmile.app/join/SMILE-R0N1",
      "stats": {
        "friends_referred": 4,
        "bonus_coins_earned": 800,
        "pending_referrals": 2
      },
      "remaining_today": 5
    }
    ```
- **`POST /api/v1/refer/validate`**
  - Validates a referral code during onboarding.

### 1.4 Serverless Maintenance Crons & Health Check (Subal)
- **`POST /api/v1/cron/cleanup`**
  - **Auth:** Protected by `CRON_SECRET` header
  - **Logic:**
    - Deletes expired `otp_codes` (`expires_at <= NOW()`).
    - Deletes expired `rate_limits` (`expires_at <= NOW()`).
    - Deletes 24h expired `explore_posts` and calls ImageKit delete API for associated images.
    - Deletes `image_hashes` older than 30 days.
- **`GET /api/v1/cron/keepalive`**
  - Runs `SELECT 1` on Supabase Postgres to prevent free-tier 7-day auto-pause.
- **`GET /api/v1/health`**
  - Returns `{"status": "ok", "service": "open-smile-fastapi"}`.

---

## PART 2: PHASE 2 SPECIFICATIONS — AKASH (BACKEND DEVELOPER)

Akash executes **all** leaderboard ranking aggregations, rewards and voucher marketplace redemptions, badge calculations, explore community social feeds, like interactions, live activity marquees, and public profile endpoints.

### 2.1 Leaderboard & Podium Engine (Akash)
- **`GET /api/v1/leaderboard`**
  - **Query Params:** `period` (`daily` | `weekly` | `monthly`), `limit` (default 50)
  - **Auth:** Optional (if session exists, includes `is_current_user: true` and user's specific rank)
  - **Logic:** Aggregates `coin_ledger` rows (filtered by `created_at >= period_start`) joined with `"user"` (`name`, `image`).
  - **Response:**
    ```json
    {
      "period": "daily",
      "podium": [
        { "rank": 1, "user_id": "...", "user_name": "Aria Chen", "value": 42300, "avatar_url": "..." },
        { "rank": 2, "user_id": "...", "user_name": "Marcus Webb", "value": 39100, "avatar_url": "..." },
        { "rank": 3, "user_id": "...", "user_name": "Kai Nakamura", "value": 34500, "avatar_url": "..." }
      ],
      "rankings": [
        { "rank": 4, "user_id": "...", "user_name": "Elena R.", "byline": "Level 30", "value": 18420, "change": 1 }
      ],
      "current_user_rank": { "rank": 8, "value": 15620 }
    }
    ```

### 2.2 Rewards & Voucher Marketplace (Akash)
- **`GET /api/v1/rewards/catalog`**
  - Returns available voucher brands (Amazon, Flipkart, boAt, Myntra, Swiggy, Zomato, Starbucks, BookMyShow), denomination tiers, coin costs, and availability.
- **`POST /api/v1/rewards/claim`**
  - **Auth:** Required
  - **Request Body:** `{ "voucher_id": "boat-500", "brand": "boAt", "coins_cost": 750 }`
  - **Logic:**
    1. Calculate current user balance (`SELECT COALESCE(SUM(coins), 0) FROM coin_ledger WHERE user_id = $1`).
    2. If `balance < coins_cost`, return `400 Insufficient Coins`.
    3. Generate unique voucher code & PIN (or pull from pre-seeded `vouchers` table).
    4. **INSERT** into `coin_ledger` (`user_id`, `coins: -coins_cost`, `reason: 'voucher_claim'`).
    5. **INSERT** into `rewards` / `vouchers` (`user_id`, `voucher_code`, `provider`, `coins_spent`).
    6. Return claimed voucher object with expiry date (+1 year).
- **`GET /api/v1/rewards/my-vouchers`**
  - **Auth:** Required
  - Returns all claimed vouchers for the current user from `rewards` / `vouchers`.
- **`GET /api/v1/rewards/badges`**
  - **Auth:** Required
  - Computes lifetime earned coins from `coin_ledger` and returns unlock status for milestone badges (100, 500, 1000, 2000 coins).
- **`POST /api/v1/rewards/signup-bonus`**
  - **Auth:** Required
  - Checks if user has already received a signup bonus (`SELECT 1 FROM coin_ledger WHERE user_id = $1 AND reason = 'signup_bonus'`). If not, grants flat +50 coins to `coin_ledger`.

### 2.3 Explore Feed & Social Smiles (Akash)
- **`GET /api/v1/explore/feed`**
  - **Query Params:** `filter` (`latest` | `top_scored` | `most_liked`), `page` (default 1), `limit` (default 20)
  - **Auth:** Optional (if authenticated, returns `is_liked_by_me`)
  - **Logic:** Queries `explore_posts` / `posts` (`created_at >= NOW() - INTERVAL '24 hours'`) joined with `"user"` (`name`, `image`) and `explore_likes`.
- **`POST /api/v1/explore/post`**
  - **Auth:** Required
  - **Body:** `{ "image_url": "https://ik.imagekit.io/...", "smile_score": 92, "caption": "Morning smile!" }`
  - **Logic:** Inserts into `explore_posts`. If user's first post of the day, awards +5 coins in `coin_ledger` (`reason: 'explore_post_bonus'`).
- **`POST /api/v1/explore/{post_id}/like`**
  - **Auth:** Required
  - **Logic:** Atomic toggle in `explore_likes` / `likes`. Increments or decrements `likes_count` on `explore_posts`. Returns `{ "liked": true, "likes_count": 15 }`.

### 2.4 Live Activity Marquee (Akash)
- **`GET /api/v1/activity/recent`**
  - **Auth:** Public
  - **Logic:** Fetches recent 20 events from `coin_ledger` and `smile_captures` (formatted as anonymous user ticker items: `"Someone just scored 96! 🔥"`, `"Marcus hit a 7-day streak! 🔥"`, `"A user redeemed an Amazon voucher"`).

### 2.5 Public User Profile (Akash)
- **`GET /api/v1/users/{username}`**
  - **Auth:** Public
  - **Logic:** Queries `"user"` by name/username, lifetime smile count from `smile_captures`, best score, streak from `streaks`, current rank, and public active smiles from `explore_posts`. Does not leak email or private data.

---

## 4. Vercel Serverless Python Configuration

### 4.1 Python Dependencies (`requirements.txt`)
```txt
fastapi>=0.115.0
pydantic>=2.10.0
pydantic-settings>=2.7.0
asyncpg>=0.30.0
psycopg[binary,pool]>=3.2.0
imagehash>=4.3.1
Pillow>=10.4.0
httpx>=0.28.0
python-dotenv>=1.0.1
```

### 4.2 Entrypoint: `api/index.py`
Vercel automatically detects `api/index.py` and routes requests to the FastAPI `app` instance:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend_py.routers import (
    capture,
    leaderboard,
    rewards,
    explore,
    refer,
    activity,
    users,
    streaks,
    cron,
)

app = FastAPI(
    title="Open Smile API",
    version="1.0.0",
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phase 1 Routers (Subal)
app.include_router(capture.router, prefix="/api/v1/capture", tags=["Capture"])
app.include_router(streaks.router, prefix="/api/v1/streaks", tags=["Streaks"])
app.include_router(refer.router, prefix="/api/v1/refer", tags=["Referrals"])
app.include_router(cron.router, prefix="/api/v1/cron", tags=["Cron"])

# Phase 2 Routers (Akash)
app.include_router(leaderboard.router, prefix="/api/v1/leaderboard", tags=["Leaderboard"])
app.include_router(rewards.router, prefix="/api/v1/rewards", tags=["Rewards"])
app.include_router(explore.router, prefix="/api/v1/explore", tags=["Explore"])
app.include_router(activity.router, prefix="/api/v1/activity", tags=["Activity"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "service": "open-smile-fastapi"}
```

### 4.3 Next.js Rewrites (`next.config.ts`)
Next.js will seamlessly forward `/api/v1/:path*` to the FastAPI serverless handler:
```typescript
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: '/api/:path*',
    },
  ];
}
```

### 4.4 Serverless Postgres Connection Handling
Because Vercel functions are serverless, we use `asyncpg` with a pooled connection manager or Supabase Session/Transaction pooler (Port 6543) with `max_connections=5` per lambda instance to prevent connection exhaustion.

---

## 5. Better Auth Session Bridge in FastAPI

To authenticate users in FastAPI without touching Next.js auth handlers:

```python
# backend_py/dependencies.py
from fastapi import Request, HTTPException, status, Depends
import asyncpg
from backend_py.database import get_db_pool

async def get_current_user(request: Request, pool=Depends(get_db_pool)):
    session_token = (
        request.cookies.get("better-auth.session_token")
        or request.cookies.get("__Secure-better-auth.session_token")
    )
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]

    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT s."userId", u.id, u.name, u.email, u.image, u.role
            FROM "session" s
            JOIN "user" u ON s."userId" = u.id
            WHERE s.token = $1 AND s."expiresAt" > NOW()
            LIMIT 1
            """,
            session_token,
        )

    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )

    return dict(row)
```

---

## 6. Frontend Wiring Matrix (Grouped by Developer Phase)

### Phase 1 Wiring: Subal (Lead Developer)
| Frontend Component / Page | Current Mock Source | Target FastAPI Endpoint | Assigned Dev |
|---|---|---|---|
| [`components/capture/capture-flow.tsx`](file:///d:/open-smile/components/capture/capture-flow.tsx) | Calls `/api/capture/submit` (legacy) | `POST /api/v1/capture/submit` | **Subal** |
| [`app/(dashboard)/refer/page.tsx`](file:///d:/open-smile/app/(dashboard)/refer/page.tsx) | Static `SMILE-R0N1` and stats | `GET /api/v1/refer/stats` | **Subal** |

### Phase 2 Wiring: Akash (Backend Developer)
| Frontend Component / Page | Current Mock Source | Target FastAPI Endpoint | Assigned Dev |
|---|---|---|---|
| [`components/dashboard/leaderboard-view.tsx`](file:///d:/open-smile/components/dashboard/leaderboard-view.tsx) | Static `leaderboardData` object | `GET /api/v1/leaderboard?period=...` | **Akash** |
| [`components/rewards/voucher-marketplace.tsx`](file:///d:/open-smile/components/rewards/voucher-marketplace.tsx) | Static `VOUCHERS_CATALOG` | `GET /api/v1/rewards/catalog` | **Akash** |
| [`components/rewards/voucher-claim-modal.tsx`](file:///d:/open-smile/components/rewards/voucher-claim-modal.tsx) | Client-side random generator | `POST /api/v1/rewards/claim` | **Akash** |
| [`components/rewards/claimed-vouchers-list.tsx`](file:///d:/open-smile/components/rewards/claimed-vouchers-list.tsx) | Static `INITIAL_CLAIMED_VOUCHERS` | `GET /api/v1/rewards/my-vouchers` | **Akash** |
| [`components/rewards/scratch-card-gallery.tsx`](file:///d:/open-smile/components/rewards/scratch-card-gallery.tsx) | Static cards | `GET /api/v1/rewards/badges`, `POST /api/v1/rewards/signup-bonus` | **Akash** |
| [`app/(dashboard)/explore/page.tsx`](file:///d:/open-smile/app/(dashboard)/explore/page.tsx) | Static `posts` array | `GET /api/v1/explore/feed`, `POST /api/v1/explore/post`, `POST /api/v1/explore/{id}/like` | **Akash** |
| [`components/marquee/activity-marquee.tsx`](file:///d:/open-smile/components/marquee/activity-marquee.tsx) | Static `PLACEHOLDER_ACTIVITY` | `GET /api/v1/activity/recent` | **Akash** |
| [`app/u/[username]/page.tsx`](file:///d:/open-smile/app/u/[username]/page.tsx) | Static `userProfile` | `GET /api/v1/users/{username}` | **Akash** |

---

## 7. 2-Phase Work Distribution Plan: Subal First, Then Akash

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PHASE 1: SUBAL (LEAD DEVELOPER)                      │
│                                                                        │
│ 1.1 Python Infrastructure & DB Scaffold                                │
│     • requirements.txt, backend_py/config.py, backend_py/database.py   │
│     • backend_py/dependencies.py (get_current_user & get_db_pool)      │
│     • api/index.py & next.config.ts rewrites                           │
│                                                                        │
│ 1.2 Anti-Cheat Pipeline & Capture Engine                               │
│     • 1h cooldown, 5/day cap, liveness check, pHash Hamming distance   │
│     • POST /api/v1/capture/submit                                      │
│                                                                        │
│ 1.3 Coin Multiplier & Streak Engine                                    │
│     • Multipliers (1.0x - 2.0x), 24-48h grace window, freeze spend     │
│     • GET /api/v1/user/streak & POST /api/v1/user/streak/freeze        │
│                                                                        │
│ 1.4 Referral Engine & Stats                                            │
│     • 1st capture referee (+50) & referrer (+200) bonus distribution   │
│     • GET /api/v1/refer/stats & POST /api/v1/refer/validate            │
│                                                                        │
│ 1.5 Maintenance Crons & Health Check                                   │
│     • POST /api/v1/cron/cleanup & GET /api/v1/cron/keepalive           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ (Subal completes & commits Phase 1)
┌────────────────────────────────────────────────────────────────────────┐
│                   PHASE 2: AKASH (BACKEND DEVELOPER)                   │
│                                                                        │
│ 2.1 Leaderboard & Podium Aggregations                                  │
│     • Daily/Weekly/Monthly SUM(coins) from coin_ledger                 │
│     • Top-3 podium, ranks 4-50, authenticated user rank lookup         │
│     • GET /api/v1/leaderboard                                          │
│                                                                        │
│ 2.2 Rewards Marketplace & Voucher Claim Engine                         │
│     • Catalog list, balance verification & atomic ledger deduction     │
│     • GET /catalog, POST /claim, GET /my-vouchers, GET /badges         │
│     • POST /api/v1/rewards/signup-bonus (+50 coins)                    │
│                                                                        │
│ 2.3 Explore Social Feed & Likes System                                 │
│     • 24h rolling posts feed with like boolean                         │
│     • POST /explore/post (+5 daily bonus), POST /{post_id}/like toggle │
│                                                                        │
│ 2.4 Activity Marquee & Public User Profiles                            │
│     • GET /api/v1/activity/recent (anonymized ticker feed)             │
│     • GET /api/v1/users/{username} (sanitized public profile)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             PHASE 3: INTEGRATION, WIRING & VERIFICATION                │
│ • Validate end-to-end user loop: capture -> coins -> leaderboard/claim │
│ • Verify Vercel Serverless deployment and zero Git merge conflicts     │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Step-by-Step Breakdown: Phase 1 (Subal)

Subal is the Lead Backend Engineer responsible for building the core system engine from the ground up:

1. **Step 1: Python Scaffold & Database Architecture**
   - Create `requirements.txt` with `fastapi`, `pydantic`, `asyncpg`, `imagehash`, `Pillow`, `httpx`, `python-dotenv`.
   - Create `backend_py/config.py` using Pydantic `BaseSettings` for `DATABASE_URL`, `CRON_SECRET`, `APP_ENV`.
   - Create `backend_py/database.py` with `asyncpg` connection pool initializer (`min_size=1`, `max_size=5` for serverless).
   - Create `backend_py/dependencies.py` implementing `get_current_user` reading Better Auth cookies/headers and querying Postgres `session` table directly.
   - Create `api/index.py` with FastAPI ASGI app and CORS middleware.
   - Configure Next.js rewrites in `next.config.ts` mapping `/api/v1/:path*` to `/api/:path*`.

2. **Step 2: Models & Services for Capture & Anti-Cheat**
   - Create `backend_py/models/user.py`, `backend_py/models/capture.py`, `backend_py/models/streaks.py`, `backend_py/models/refer.py`.
   - Build `backend_py/services/anti_cheat.py`:
     - Cooldown check: $\ge 1\text{ hour}$ elapsed since `MAX(created_at)`.
     - Daily cap check: $< 5\text{ captures/day}$.
     - Liveness check: `liveness_verified == true`.
     - pHash Hamming check: distance $> 5$ against past 30-day `image_hashes`.
   - Build `backend_py/services/streak_engine.py`: 24–48h window evaluation and multiplier calculation ($1.0\times$ to $2.0\times$).
   - Build `backend_py/services/coin_engine.py`: append-only `coin_ledger` insertions.
   - Build `backend_py/services/referral_engine.py`: first capture detection & bonus distribution (+200 referrer / +50 referee).

3. **Step 3: Routers for Capture, Streaks, Referrals & Crons**
   - Create `backend_py/routers/capture.py`: `POST /api/v1/capture/submit`.
   - Create `backend_py/routers/streaks.py`: `GET /api/v1/user/streak`, `POST /api/v1/user/streak/freeze`.
   - Create `backend_py/routers/refer.py`: `GET /api/v1/refer/stats`, `POST /api/v1/refer/validate`.
   - Create `backend_py/routers/cron.py`: `POST /api/v1/cron/cleanup`, `GET /api/v1/cron/keepalive`.
   - Register Subal's routers in `api/index.py`.

---

### Step-by-Step Breakdown: Phase 2 (Akash)

Akash is the Backend Developer responsible for all gamification, marketplace, and social features:

1. **Step 1: Models for Gamification & Feeds**
   - Create `backend_py/models/leaderboard.py`: `LeaderboardResponse`, `PodiumEntry`, `RankingEntry`, `UserRank`.
   - Create `backend_py/models/rewards.py`: `VoucherItem`, `ClaimVoucherRequest`, `ClaimedVoucherResponse`, `BadgeItem`.
   - Create `backend_py/models/explore.py`: `ExplorePostItem`, `CreatePostRequest`, `LikeToggleResponse`.
   - Create `backend_py/models/activity.py`: `ActivityItem`.

2. **Step 2: Leaderboard Router**
   - Create `backend_py/routers/leaderboard.py`:
     - `GET /api/v1/leaderboard` with `period=daily|weekly|monthly`.
     - Aggregates `coin_ledger` grouped by `user_id` with `SUM(coins)` filtered by period.
     - Joins `"user"` table for `name` and `image`.
     - Builds Top 3 podium, ranks 4–50, and current user rank.

3. **Step 3: Rewards & Voucher Marketplace Router**
   - Create `backend_py/routers/rewards.py`:
     - `GET /api/v1/rewards/catalog` (brand vouchers list).
     - `POST /api/v1/rewards/claim` (balance check, deduction in `coin_ledger`, record in `rewards`/`vouchers`).
     - `GET /api/v1/rewards/my-vouchers` (user's redeemed vouchers).
     - `GET /api/v1/rewards/badges` (milestone badge calculation).
     - `POST /api/v1/rewards/signup-bonus` (one-time +50 coins check and insert).

4. **Step 4: Explore Feed, Activity Marquee & User Profile Routers**
   - Create `backend_py/routers/explore.py`:
     - `GET /api/v1/explore/feed` (24h posts sorted by latest/top_scored/most_liked with like boolean).
     - `POST /api/v1/explore/post` (post creation with +5 daily first post bonus).
     - `POST /api/v1/explore/{post_id}/like` (atomic toggle and count update).
   - Create `backend_py/routers/activity.py`:
     - `GET /api/v1/activity/recent` (recent 20 ticker items).
   - Create `backend_py/routers/users.py`:
     - `GET /api/v1/users/{username}` (public profile without leaking private emails).
   - Register Akash's routers in `api/index.py`.

---

### Non-Clash & Collaboration Protocol

| Rule | Protocol |
|---|---|
| **Dedicated Files** | Every router, model, and service has a single owner. Subal never edits Akash's files; Akash never edits Subal's files. |
| **Contract-First DB Access** | Subal establishes `backend_py/dependencies.py` (`get_db_pool` and `get_current_user`). Akash simply imports them into his routers. |
| **Router Mounting** | Subal creates the router mount boilerplate in `api/index.py`. Akash provides his routers named `router` in each router module. |
| **Git Branches** | Subal works on `feat/py-core-capture`; Akash works on `feat/py-gamification-social`. |
| **No Schema Drift** | Both developers write raw SQL against the existing live Postgres schema documented in Section 2 without running unilateral schema migrations. |

