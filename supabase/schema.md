# Open Smile — Database Schema Reference

> [!WARNING]
> This schema is for context only and is not meant to be run directly.
> Table order and constraints may not be valid for sequential execution.

```sql
CREATE TABLE public.otp_codes (
  email text NOT NULL,
  otp_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  CONSTRAINT otp_codes_pkey PRIMARY KEY (email)
);

CREATE TABLE public.rate_limits (
  id text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  window_start bigint NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  CONSTRAINT rate_limits_pkey PRIMARY KEY (id)
);

CREATE TABLE public.beta_waitlist (
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT beta_waitlist_pkey PRIMARY KEY (email)
);

CREATE TABLE public.user (
  id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  emailVerified boolean NOT NULL,
  image text,
  createdAt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  twoFactorEnabled boolean,
  role text,
  banned boolean,
  banReason text,
  banExpires timestamp with time zone,
  password_hash text,
  streak_count integer DEFAULT 0,
  last_streak_at timestamp with time zone,
  referral_code text,
  referred_by text,
  email_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE public.session (
  id text NOT NULL,
  expiresAt timestamp with time zone NOT NULL,
  token text NOT NULL UNIQUE,
  createdAt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp with time zone NOT NULL,
  ipAddress text,
  userAgent text,
  userId text NOT NULL,
  activeOrganizationId text,
  impersonatedBy text,
  CONSTRAINT session_pkey PRIMARY KEY (id),
  CONSTRAINT session_userId_fkey FOREIGN KEY (userId) REFERENCES public.user(id)
);

CREATE TABLE public.account (
  id text NOT NULL,
  accountId text NOT NULL,
  providerId text NOT NULL,
  userId text NOT NULL,
  accessToken text,
  refreshToken text,
  idToken text,
  accessTokenExpiresAt timestamp with time zone,
  refreshTokenExpiresAt timestamp with time zone,
  scope text,
  password text,
  createdAt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp with time zone NOT NULL,
  CONSTRAINT account_pkey PRIMARY KEY (id),
  CONSTRAINT account_userId_fkey FOREIGN KEY (userId) REFERENCES public.user(id)
);

CREATE TABLE public.verification (
  id text NOT NULL,
  identifier text NOT NULL,
  value text NOT NULL,
  expiresAt timestamp with time zone NOT NULL,
  createdAt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT verification_pkey PRIMARY KEY (id)
);

CREATE TABLE public.twoFactor (
  id text NOT NULL,
  secret text NOT NULL,
  backupCodes text NOT NULL,
  userId text NOT NULL,
  verified boolean,
  failedVerificationCount integer,
  lockedUntil timestamp with time zone,
  CONSTRAINT twoFactor_pkey PRIMARY KEY (id),
  CONSTRAINT twoFactor_userId_fkey FOREIGN KEY (userId) REFERENCES public.user(id)
);

CREATE TABLE public.organization (
  id text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo text,
  createdAt timestamp with time zone NOT NULL,
  metadata text,
  CONSTRAINT organization_pkey PRIMARY KEY (id)
);

CREATE TABLE public.member (
  id text NOT NULL,
  organizationId text NOT NULL,
  userId text NOT NULL,
  role text NOT NULL,
  createdAt timestamp with time zone NOT NULL,
  CONSTRAINT member_pkey PRIMARY KEY (id),
  CONSTRAINT member_organizationId_fkey FOREIGN KEY (organizationId) REFERENCES public.organization(id),
  CONSTRAINT member_userId_fkey FOREIGN KEY (userId) REFERENCES public.user(id)
);

CREATE TABLE public.invitation (
  id text NOT NULL,
  organizationId text NOT NULL,
  email text NOT NULL,
  role text,
  status text NOT NULL,
  expiresAt timestamp with time zone NOT NULL,
  createdAt timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  inviterId text NOT NULL,
  CONSTRAINT invitation_pkey PRIMARY KEY (id),
  CONSTRAINT invitation_organizationId_fkey FOREIGN KEY (organizationId) REFERENCES public.organization(id),
  CONSTRAINT invitation_inviterId_fkey FOREIGN KEY (inviterId) REFERENCES public.user(id)
);

CREATE TABLE public.smile_captures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  smile_score integer NOT NULL CHECK (smile_score >= 0 AND smile_score <= 100),
  coins_awarded integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT smile_captures_pkey PRIMARY KEY (id),
  CONSTRAINT smile_captures_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE public.coin_ledger (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  coins integer NOT NULL,
  reason text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT coin_ledger_pkey PRIMARY KEY (id),
  CONSTRAINT coin_ledger_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE public.streaks (
  user_id text NOT NULL,
  streak_count integer NOT NULL DEFAULT 0,
  last_capture_at timestamp with time zone,
  freeze_available boolean NOT NULL DEFAULT true,
  freeze_used_at timestamp with time zone,
  CONSTRAINT streaks_pkey PRIMARY KEY (user_id),
  CONSTRAINT streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE public.rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  tier text NOT NULL,
  provider text NOT NULL,
  voucher_code text NOT NULL UNIQUE,
  coins_spent integer NOT NULL,
  claimed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT rewards_pkey PRIMARY KEY (id),
  CONSTRAINT rewards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE public.referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  referrer_id text NOT NULL,
  referred_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  CONSTRAINT referrals_pkey PRIMARY KEY (id),
  CONSTRAINT referrals_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.user(id),
  CONSTRAINT referrals_referred_id_fkey FOREIGN KEY (referred_id) REFERENCES public.user(id)
);

CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  capture_id uuid,
  image_url text NOT NULL,
  smile_score integer NOT NULL CHECK (smile_score >= 0 AND smile_score <= 100),
  like_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT posts_capture_id_fkey FOREIGN KEY (capture_id) REFERENCES public.smile_captures(id)
);

CREATE TABLE public.likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT likes_pkey PRIMARY KEY (id),
  CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

CREATE TABLE public.image_hashes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  capture_id uuid,
  image_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  phash text,
  CONSTRAINT image_hashes_pkey PRIMARY KEY (id),
  CONSTRAINT image_hashes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT image_hashes_capture_id_fkey FOREIGN KEY (capture_id) REFERENCES public.smile_captures(id)
);

CREATE TABLE public.sessions (
  id text NOT NULL DEFAULT (gen_random_uuid())::text,
  user_id text NOT NULL,
  token text NOT NULL UNIQUE,
  user_agent text,
  ip_address text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE public.explore_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  capture_id uuid,
  image_url text NOT NULL,
  smile_score integer NOT NULL,
  caption text,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT explore_posts_pkey PRIMARY KEY (id),
  CONSTRAINT explore_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT explore_posts_capture_id_fkey FOREIGN KEY (capture_id) REFERENCES public.smile_captures(id)
);

CREATE TABLE public.explore_likes (
  user_id text NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT explore_likes_pkey PRIMARY KEY (user_id, post_id),
  CONSTRAINT explore_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT explore_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.explore_posts(id)
);

CREATE TABLE public.vouchers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  voucher_type text NOT NULL,
  coin_cost integer NOT NULL,
  code text NOT NULL,
  status text NOT NULL DEFAULT 'claimed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vouchers_pkey PRIMARY KEY (id),
  CONSTRAINT vouchers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE public.accounts (
  id text NOT NULL DEFAULT (gen_random_uuid())::text,
  user_id text NOT NULL,
  provider_id text NOT NULL,
  account_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
```
