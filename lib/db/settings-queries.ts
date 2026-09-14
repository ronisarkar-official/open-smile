import { getPool } from './client';
import { DEFAULT_DRAWING_SPEC } from '@/lib/mediapipe-drawing';
import { DEFAULT_AI_CONFIG } from '@/lib/ai/types';
import {
	SMILE_TIERS,
	DEFAULT_LUCKY_DROP_CHANCE,
	DEFAULT_LUCKY_BONUS_MIN,
	DEFAULT_LUCKY_BONUS_MAX,
	type CaptureRewardConfig,
} from '@/lib/reward-calculator';
import { logAdminAction } from './admin-queries';

export const DEFAULT_CAPTURE_REWARD_CONFIG: CaptureRewardConfig = {
	coin_multiplier: 1.0,
	min_smile_score_threshold: 11,
	scratch_min_coins: 5,
	scratch_max_coins: 100,
	lucky_drop_enabled: true,
	lucky_drop_chance: DEFAULT_LUCKY_DROP_CHANCE,
	lucky_bonus_min: DEFAULT_LUCKY_BONUS_MIN,
	lucky_bonus_max: DEFAULT_LUCKY_BONUS_MAX,
	tiers: SMILE_TIERS,
};

export async function getSystemSettings() {
	const pool = getPool();
	const { rows } = await pool.query(
		`SELECT key, value, description, updated_at, updated_by FROM system_settings ORDER BY key ASC`,
	);
	const settings: Record<string, any> = {};
	for (const row of rows) {
		settings[row.key] = {
			value: row.value,
			description: row.description,
			updatedAt: row.updated_at,
			updatedBy: row.updated_by,
		};
	}
	return settings;
}

export async function getSystemSettingsMap(): Promise<Record<string, any>> {
	const pool = getPool();
	const { rows } = await pool.query(`SELECT key, value FROM system_settings`);
	const defaults: Record<string, any> = {
		maintenance_mode: false,
		signup_enabled: true,
		beta_waitlist_mode: false,
		marketplace_enabled: true,
		explore_feed_enabled: true,
		explore_posting_enabled: true,
		leaderboard_enabled: true,
		scratch_cards_enabled: true,
		email_otp_required: true,
		liveness_detection_enabled: true,
		image_hash_check_enabled: true,
		auto_flag_anomalies_enabled: true,
		max_daily_captures_per_user: 10,
		min_smile_score_threshold: 11,
		coin_multiplier: 1.0,
		referral_reward_coins: 200,
		referee_bonus_coins: 50,
		referral_referrer_min_coins: 50,
		referral_referrer_max_coins: 200,
		referral_referee_min_coins: 20,
		referral_referee_max_coins: 50,
		max_daily_referral_rewards: 5,
		daily_streak_coins: 5,
		scratch_min_coins: 5,
		scratch_max_coins: 100,
		daily_podium_1_min_coins: 70,
		daily_podium_1_max_coins: 99,
		daily_podium_2_min_coins: 40,
		daily_podium_2_max_coins: 69,
		daily_podium_3_min_coins: 15,
		daily_podium_3_max_coins: 39,
		weekly_podium_1_min_coins: 250,
		weekly_podium_1_max_coins: 400,
		weekly_podium_2_min_coins: 120,
		weekly_podium_2_max_coins: 200,
		weekly_podium_3_min_coins: 60,
		weekly_podium_3_max_coins: 100,
		monthly_podium_1_min_coins: 800,
		monthly_podium_1_max_coins: 1200,
		monthly_podium_2_min_coins: 400,
		monthly_podium_2_max_coins: 600,
		monthly_podium_3_min_coins: 200,
		monthly_podium_3_max_coins: 350,
		palm_shutter_enabled: true,
		mediapipe_drawing_spec: DEFAULT_DRAWING_SPEC,
		ai_config: DEFAULT_AI_CONFIG,
		capture_reward_config: DEFAULT_CAPTURE_REWARD_CONFIG,
	};
	for (const row of rows) {
		defaults[row.key] = row.value;
	}

	if (defaults.capture_reward_config) {
		defaults.capture_reward_config = {
			...DEFAULT_CAPTURE_REWARD_CONFIG,
			...defaults.capture_reward_config,
			coin_multiplier: Number(defaults.coin_multiplier ?? defaults.capture_reward_config.coin_multiplier ?? 1.0),
			min_smile_score_threshold: Number(defaults.min_smile_score_threshold ?? defaults.capture_reward_config.min_smile_score_threshold ?? 11),
			scratch_min_coins: Number(defaults.scratch_min_coins ?? defaults.capture_reward_config.scratch_min_coins ?? 5),
			scratch_max_coins: Number(defaults.scratch_max_coins ?? defaults.capture_reward_config.scratch_max_coins ?? 100),
		};
	}

	return defaults;
}

export async function updateSystemSetting(
	adminId: string,
	adminEmail: string,
	key: string,
	value: any,
	description?: string,
) {
	const pool = getPool();
	await pool.query(
		`INSERT INTO system_settings (key, value, description, updated_at, updated_by)
		 VALUES ($1, $2::jsonb, $3, NOW(), $4)
		 ON CONFLICT (key) DO UPDATE
		 SET value = EXCLUDED.value,
			 description = COALESCE(EXCLUDED.description, system_settings.description),
			 updated_at = NOW(),
			 updated_by = EXCLUDED.updated_by`,
		[key, JSON.stringify(value), description || null, adminEmail],
	);

	await logAdminAction(
		adminId,
		adminEmail,
		'update_setting',
		'system_setting',
		key,
		{
			key,
			value,
		},
	);

	return { success: true, key, value };
}

export async function getAdminAuditLogs(params: {
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 30, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const countRes = await pool.query(
		`SELECT COUNT(*)::int as count FROM admin_audit_logs`,
	);
	const logsRes = await pool.query(
		`SELECT id, admin_id, admin_email, action, target_type, target_id, details, created_at
		 FROM admin_audit_logs
		 ORDER BY created_at DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset],
	);

	return {
		logs: logsRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function bootstrapAdminUser(userId: string, email: string) {
	const pool = getPool();
	const adminEmails = (process.env.ADMIN_EMAILS || 'ronisarkar10938@gmail.com')
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);

	const isAuthorized =
		adminEmails.includes(email.toLowerCase()) ||
		process.env.NODE_ENV !== 'production';
	if (!isAuthorized) {
		return { success: false, error: 'Unauthorized email' };
	}

	await pool.query(`UPDATE "user" SET role = 'admin' WHERE id = $1`, [userId]);

	await logAdminAction(userId, email, 'bootstrap_admin', 'user', userId, {
		email,
	});

	return { success: true, role: 'admin' };
}

export async function adminDeleteUser(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
) {
	if (adminId === targetUserId) {
		throw new Error('Cannot delete your own admin account');
	}

	const pool = getPool();
	const deleteQuery = `
		WITH 
		  d_el1 AS (DELETE FROM explore_likes WHERE user_id = $1),
		  d_l1 AS (DELETE FROM likes WHERE user_id = $1),
		  d_el2 AS (DELETE FROM explore_likes WHERE post_id IN (SELECT id FROM explore_posts WHERE user_id = $1)),
		  d_ep AS (DELETE FROM explore_posts WHERE user_id = $1),
		  d_l2 AS (DELETE FROM likes WHERE post_id IN (SELECT id FROM posts WHERE user_id = $1)),
		  d_p AS (DELETE FROM posts WHERE user_id = $1),
		  d_ih AS (DELETE FROM image_hashes WHERE user_id = $1),
		  d_sc AS (DELETE FROM smile_captures WHERE user_id = $1),
		  d_cl AS (DELETE FROM coin_ledger WHERE user_id = $1),
		  d_st AS (DELETE FROM streaks WHERE user_id = $1),
		  d_rw AS (DELETE FROM rewards WHERE user_id = $1),
		  d_vc AS (DELETE FROM vouchers WHERE user_id = $1),
		  d_cards AS (DELETE FROM scratch_cards WHERE user_id = $1),
		  d_ls AS (DELETE FROM leaderboard_settlements WHERE user_id = $1),
		  d_ref AS (DELETE FROM referrals WHERE referrer_id = $1 OR referred_id = $1),
		  u_vi AS (UPDATE voucher_inventory SET status = 'available', claimed_by = NULL, claimed_at = NULL WHERE claimed_by = $1),
		  d_s1 AS (DELETE FROM session WHERE "userId" = $1),
		  d_s2 AS (DELETE FROM sessions WHERE user_id = $1),
		  d_a1 AS (DELETE FROM account WHERE "userId" = $1),
		  d_a2 AS (DELETE FROM accounts WHERE user_id = $1),
		  d_tf AS (DELETE FROM "twoFactor" WHERE "userId" = $1),
		  d_mem AS (DELETE FROM member WHERE "userId" = $1),
		  d_inv AS (DELETE FROM invitation WHERE "inviterId" = $1)
		DELETE FROM "user" WHERE id = $1
		RETURNING id, name, email, role;
	`;

	const res = await pool.query(deleteQuery, [targetUserId]);
	if (!res.rows[0]) {
		return { success: false, error: 'User not found' };
	}

	const targetUser = res.rows[0];

	await logAdminAction(
		adminId,
		adminEmail,
		'delete_user',
		'user',
		targetUserId,
		{
			deletedUserName: targetUser.name,
			deletedUserEmail: targetUser.email,
			deletedUserRole: targetUser.role,
		},
	);

	return { success: true, deletedUserId: targetUserId };
}
