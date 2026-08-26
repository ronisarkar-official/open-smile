# Implementation Plan: Python FastAPI Backend on Vercel (Choice A)

This plan details the migration of the Open Smile backend layer to **Python FastAPI** while preserving the **Next.js 15 App Router** frontend, deployed together as a hybrid Serverless application on Vercel.

---

## 🏗️ Architecture Overview

```
open-smile/
├── api/
│   └── index.py             # Vercel ASGI Serverless Entrypoint (exposes `app`)
├── backend/                 # Python Backend Package
│   ├── __init__.py
│   ├── config.py            # Environment settings (Pydantic Settings)
│   ├── database.py          # PostgreSQL async pool (psycopg[pool] / asyncpg)
│   ├── security.py          # Password hashing (Argon2/bcrypt) & JWT token encoding
│   ├── dependencies.py      # Auth guards (get_current_user, require_user)
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # /api/auth (login, signup, session, logout, otp-send, otp-verify)
│   │   ├── capture.py       # /api/capture/submit (anti-cheat cooldown & coin ledger engine)
│   │   ├── beta_join.py     # /api/beta-join (waitlist signup & rate limiting)
│   │   ├── health.py        # /api/health (database liveness probe)
│   │   └── imagekit.py      # /api/imagekit/auth (upload signature generation)
│   └── services/
│       ├── __init__.py
│       ├── mailer.py        # Transactional email dispatcher (SMTP via smtplib)
│       └── rate_limit.py    # Database-backed sliding window rate limiter
├── requirements.txt         # Python dependencies for Vercel build detector
├── next.config.ts           # Next.js API rewrites for dev (port 8000) & prod (api/index.py)
└── lib/auth-client.ts       # React Auth Client interfacing with FastAPI endpoints
```

---

## User Review Required

> [!IMPORTANT]
> **Authentication Transition**: Better Auth (Node.js) is replaced with FastAPI JWT session management using HTTP-only secure cookies (`access_token`). Existing user accounts in the Supabase PostgreSQL database remain fully compatible.
>
> **Smile Recognition Stays Client-Side**: Facial landmark analysis (MediaPipe) stays 100% in-browser on the client device. The Python FastAPI backend validates scores (0–100), enforces cooldowns, and writes to `coin_ledger`.

---

## Proposed Changes

### 1. Root & Build Configuration

#### [NEW] [requirements.txt](file:///d:/open-smile/requirements.txt)
Define lightweight Python dependencies compliant with Vercel's 250MB limit:
```text
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.9.0
pydantic-settings>=2.4.0
psycopg[binary,pool]>=3.2.0
pyjwt>=2.9.0
passlib[argon2,bcrypt]>=1.7.4
python-multipart>=0.0.12
python-dotenv>=1.0.1
httpx>=0.27.0
```

#### [MODIFY] [next.config.ts](file:///d:/open-smile/next.config.ts)
Add API rewrites so frontend fetch calls to `/api/py/*` or `/api/*` transparently proxy to the FastAPI instance in development and serverless in production.

#### [NEW] [api/index.py](file:///d:/open-smile/api/index.py)
Vercel serverless entry point importing the FastAPI instance `app` from `backend.main`.

---

### 2. Python Backend Core

#### [NEW] [backend/config.py](file:///d:/open-smile/backend/config.py)
Manage environment variables (`DATABASE_URL`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `IMAGEKIT_PRIVATE_KEY`, etc.) with `pydantic-settings`.

#### [NEW] [backend/database.py](file:///d:/open-smile/backend/database.py)
Connection pool management with `psycopg_pool.AsyncConnectionPool` connecting to Supabase PostgreSQL (transaction pooler).

#### [NEW] [backend/security.py](file:///d:/open-smile/backend/security.py)
- Password hashing with `passlib.context.CryptContext(schemes=["argon2", "bcrypt"])`.
- JWT encoding/decoding with `pyjwt` for user session cookies.

#### [NEW] [backend/dependencies.py](file:///d:/open-smile/backend/dependencies.py)
FastAPI `Depends` helpers to extract and authenticate current user from the session cookie or Bearer token.

---

### 3. FastAPI Routers

#### [NEW] [backend/routers/auth.py](file:///d:/open-smile/backend/routers/auth.py)
- `POST /api/auth/sign-up`: Register user, hash password, create DB record, dispatch welcome email.
- `POST /api/auth/sign-in`: Verify credentials, issue HTTP-only JWT session cookie.
- `POST /api/auth/sign-out`: Clear session cookie.
- `GET /api/auth/get-session`: Return authenticated user info for frontend hooks.
- `POST /api/auth/send-otp`: Generate 6-digit OTP, store SHA-256 hash in `otp_codes`, send email.
- `POST /api/auth/verify-otp`: Validate OTP, mark `emailVerified = true`.
- `POST /api/auth/check-credentials`: Validate password without issuing session (step 1).

#### [NEW] [backend/routers/capture.py](file:///d:/open-smile/backend/routers/capture.py)
- `POST /api/capture/submit`:
  - Validate integer `smile_score` (0–100).
  - Enforce 60-minute cooldown via `MAX(created_at)` from `smile_captures`.
  - Calculate `baseCoins = max(1, score // 10)`.
  - Insert record into `smile_captures` and `coin_ledger` (`reason: 'capture'`).

#### [NEW] [backend/routers/beta_join.py](file:///d:/open-smile/backend/routers/beta_join.py)
- `POST /api/beta-join`: Rate-limited waitlist signup, insert to `beta_waitlist`, dispatch confirmation email.

#### [NEW] [backend/routers/health.py](file:///d:/open-smile/backend/routers/health.py)
- `GET /api/health`: Database connection liveness check (`SELECT 1`).

#### [NEW] [backend/routers/imagekit.py](file:///d:/open-smile/backend/routers/imagekit.py)
- `GET /api/imagekit/auth`: Generate HMAC-SHA1 signature and token for client-side uploads.

---

### 4. Python Services

#### [NEW] [backend/services/mailer.py](file:///d:/open-smile/backend/services/mailer.py)
Asynchronous/threadpool SMTP email sending for OTP, welcome, waitlist, and login notification emails.

#### [NEW] [backend/services/rate_limit.py](file:///d:/open-smile/backend/services/rate_limit.py)
Sliding window rate limiter using the `rate_limits` PostgreSQL table.

---

### 5. Frontend Auth Client Adapter

#### [MODIFY] [lib/auth-client.ts](file:///d:/open-smile/lib/auth-client.ts)
Provide drop-in compatible React exports (`useSession`, `signIn`, `signOut`, `signUp`, `getSession`) calling the FastAPI routes so no UI components require refactoring.

#### [DELETE] TypeScript Route Handlers under `app/api/*`
Remove duplicate TypeScript route handlers in `app/api/*` so all `/api/*` traffic is handled by the FastAPI serverless endpoints.

---

## 4. Verification Plan

### Automated Tests
1. **FastAPI Health & Auth Tests**:
   - Run Python test script / `pytest` validating endpoints: `/api/health`, `/api/auth/sign-up`, `/api/auth/sign-in`, `/api/capture/submit`.
2. **Frontend Type Check**:
   - Run `npx tsc --noEmit` to ensure TypeScript compilation passes.
3. **Database Integration**:
   - Verify that inserts into `user`, `smile_captures`, `coin_ledger`, and `otp_codes` match the Supabase Postgres schema.

### Manual Verification
1. Start FastAPI server (`uvicorn api.index:app --port 8000 --reload`).
2. Start Next.js dev server (`npm run dev`).
3. Test signup with email + OTP, login, dashboard balance fetch, and webcam smile capture submission.
