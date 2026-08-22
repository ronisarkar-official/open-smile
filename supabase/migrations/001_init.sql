-- ── Custom App Tables ─────────────────────────────────────
-- Better Auth manages its own tables (user, session, account, verification, etc.)
-- via `npx auth migrate`. These are the additional app-specific tables.

CREATE TABLE IF NOT EXISTS otp_codes (
  email TEXT PRIMARY KEY,
  otp_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limits (
  id TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start BIGINT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS beta_waitlist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
