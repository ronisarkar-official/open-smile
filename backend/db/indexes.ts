import { getPool } from "./client";

const globalForIndexes = globalThis as typeof globalThis & {
	__indexesPromise?: Promise<void>;
};

export function ensureIndexes(): Promise<void> {
	const g = globalForIndexes;
	if (!g.__indexesPromise) {
		g.__indexesPromise = (async () => {
			try {
				const pool = getPool();
				await pool.query(`
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

					CREATE TABLE IF NOT EXISTS scratch_cards (
						id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
						user_id TEXT NOT NULL,
						title TEXT NOT NULL,
						source TEXT NOT NULL,
						coins INTEGER NOT NULL DEFAULT 0,
						voucher_id TEXT,
						voucher_title TEXT,
						voucher_code TEXT,
						voucher_brand TEXT,
						is_scratched BOOLEAN NOT NULL DEFAULT FALSE,
						theme_color TEXT DEFAULT '#FF2D78',
						badge TEXT,
						created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
						scratched_at TIMESTAMPTZ
					);

					CREATE INDEX IF NOT EXISTS idx_scratch_cards_user_scratched ON scratch_cards (user_id, is_scratched, created_at DESC);

					CREATE TABLE IF NOT EXISTS leaderboard_settlements (
						id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
						period TEXT NOT NULL,
						period_date DATE NOT NULL,
						rank INTEGER NOT NULL,
						user_id TEXT NOT NULL,
						score INTEGER NOT NULL,
						coins_awarded INTEGER NOT NULL,
						card_id UUID,
						settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
						CONSTRAINT uq_leaderboard_settlement UNIQUE (period, period_date, rank)
					);

					CREATE INDEX IF NOT EXISTS idx_leaderboard_settlements_date ON leaderboard_settlements (period, period_date);

					CREATE TABLE IF NOT EXISTS system_settings (
						key TEXT PRIMARY KEY,
						value JSONB NOT NULL,
						description TEXT,
						updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
						updated_by TEXT
					);

					CREATE TABLE IF NOT EXISTS admin_audit_logs (
						id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
						admin_id TEXT NOT NULL,
						admin_email TEXT NOT NULL,
						action TEXT NOT NULL,
						target_type TEXT NOT NULL,
						target_id TEXT,
						details JSONB,
						created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
					);

					CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs (created_at DESC);

					CREATE TABLE IF NOT EXISTS voucher_inventory (
						id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
						voucher_id TEXT NOT NULL,
						brand_name TEXT NOT NULL,
						title TEXT NOT NULL,
						code TEXT NOT NULL,
						status TEXT NOT NULL DEFAULT 'available',
						claimed_by TEXT,
						claimed_at TIMESTAMPTZ,
						created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
						CONSTRAINT uq_voucher_code UNIQUE (code)
					);

					CREATE INDEX IF NOT EXISTS idx_voucher_inventory_status ON voucher_inventory (voucher_id, status);

					ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
					ALTER TABLE "user" ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;
					ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banReason" TEXT;
					ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banExpires" TIMESTAMPTZ;

					ALTER TABLE smile_captures ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT FALSE;
					ALTER TABLE smile_captures ADD COLUMN IF NOT EXISTS flag_reason TEXT;
					ALTER TABLE smile_captures ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ;
					ALTER TABLE smile_captures ADD COLUMN IF NOT EXISTS flagged_by TEXT;

					INSERT INTO system_settings (key, value, description, updated_at)
					VALUES 
						('maintenance_mode', 'false'::jsonb, 'Global maintenance mode flag', NOW()),
						('marketplace_enabled', 'true'::jsonb, 'Voucher marketplace visibility', NOW()),
						('explore_feed_enabled', 'true'::jsonb, 'Explore social feed visibility', NOW()),
						('coin_multiplier', '1.0'::jsonb, 'Global coin reward multiplier', NOW()),
						('min_capture_cooldown_minutes', '60'::jsonb, 'Minimum minutes between scored captures', NOW()),
						('referral_reward_coins', '50'::jsonb, 'Coin grant for successful referral', NOW())
					ON CONFLICT (key) DO NOTHING;

					CREATE INDEX IF NOT EXISTS idx_explore_posts_created ON explore_posts (created_at DESC);

					DELETE FROM otp_codes WHERE expires_at <= NOW();
					DELETE FROM rate_limits WHERE expires_at <= NOW();
					WITH expired AS (
						SELECT id FROM explore_posts WHERE created_at <= NOW() - INTERVAL '24 hours'
					),
					del_likes AS (
						DELETE FROM explore_likes WHERE post_id IN (SELECT id FROM expired)
					),
					del_posts AS (
						DELETE FROM posts WHERE id IN (SELECT id FROM expired)
					)
					DELETE FROM explore_posts WHERE id IN (SELECT id FROM expired);
				`);
				console.log("✓ PostgreSQL tables ensured");
			} catch (err) {
				console.error("✗ PostgreSQL table setup failed:", err);
			}
		})();
	}
	return g.__indexesPromise;
}
