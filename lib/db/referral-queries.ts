import { getPool } from './client';
import { getSystemSettingsMap } from './settings-queries';
import { createNotification } from './notification-queries';

export async function findUserByReferralCode(code: string): Promise<{
	id: string;
	name: string;
	image: string | null;
	referralCode: string;
} | null> {
	if (!code || !code.trim()) return null;
	const pool = getPool();
	const { rows } = await pool.query(
		`SELECT id, name, image, referral_code FROM "user" WHERE UPPER(referral_code) = UPPER($1) AND (banned IS NOT TRUE) LIMIT 1`,
		[code.trim()],
	);
	if (!rows[0]) return null;
	return {
		id: rows[0].id,
		name: rows[0].name || 'Smiler',
		image: rows[0].image || '/icons/default-icon.webp',
		referralCode: rows[0].referral_code,
	};
}

export async function createPendingReferral(params: {
	referrerCode?: string | null;
	referrerId?: string | null;
	newUserId: string;
}): Promise<{ success: boolean; referralId?: string; referrerId?: string; error?: string }> {
	const { referrerCode, referrerId: explicitReferrerId, newUserId } = params;
	if ((!referrerCode && !explicitReferrerId) || !newUserId) {
		return { success: false, error: 'Missing referrer or newUserId' };
	}

	let targetReferrerId = explicitReferrerId;

	if (!targetReferrerId && referrerCode) {
		const referrer = await findUserByReferralCode(referrerCode);
		if (!referrer) {
			return { success: false, error: 'Referrer not found' };
		}
		targetReferrerId = referrer.id;
	}

	if (!targetReferrerId) {
		return { success: false, error: 'Could not resolve referrer' };
	}

	// Prevent self-referral
	if (targetReferrerId === newUserId) {
		return { success: false, error: 'Cannot refer oneself' };
	}

	const pool = getPool();
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// Set referred_by on new user if not already set
		await client.query(
			`UPDATE "user" SET referred_by = $1 WHERE id = $2 AND (referred_by IS NULL OR referred_by = '')`,
			[targetReferrerId, newUserId],
		);

		// Insert pending referral
		const res = await client.query(
			`INSERT INTO referrals (id, referrer_id, referred_id, status, created_at)
			 VALUES (gen_random_uuid(), $1, $2, 'pending', NOW())
			 ON CONFLICT (referred_id) DO NOTHING
			 RETURNING id`,
			[targetReferrerId, newUserId],
		);

		await client.query('COMMIT');
		return {
			success: true,
			referralId: res.rows[0]?.id ? String(res.rows[0].id) : undefined,
			referrerId: targetReferrerId,
		};
	} catch (err: any) {
		await client.query('ROLLBACK');
		console.error('[createPendingReferral] Error:', err);
		return { success: false, error: err.message };
	} finally {
		client.release();
	}
}

export async function processReferralRewardOnFirstCapture(params: {
	userId: string;
	reqCookieRefCode?: string | null;
}): Promise<{
	referralBonusUnlocked: boolean;
	welcomeCardId: string | null;
	referrerCoinsWon?: number;
	refereeCoinsWon?: number;
}> {
	const { userId, reqCookieRefCode } = params;
	const pool = getPool();

	try {
		// Check that this user has captures
		const countRes = await pool.query(
			`SELECT COUNT(*) FROM smile_captures WHERE user_id = $1`,
			[userId],
		);
		const capturesCount = parseInt(countRes.rows[0]?.count || '0', 10);
		if (capturesCount < 1) {
			return { referralBonusUnlocked: false, welcomeCardId: null };
		}

		// Look for pending referral
		let refRes = await pool.query(
			`SELECT id, referrer_id FROM referrals WHERE referred_id = $1 AND status = 'pending' LIMIT 1`,
			[userId],
		);

		// Fallback: If not in referrals table yet, check user.referred_by or cookie
		if (refRes.rows.length === 0) {
			const userRow = await pool.query(
				`SELECT referred_by FROM "user" WHERE id = $1`,
				[userId],
			);
			const referredBy = userRow.rows[0]?.referred_by;

			if (referredBy) {
				await createPendingReferral({
					referrerId: referredBy,
					newUserId: userId,
				});
			} else if (reqCookieRefCode) {
				await createPendingReferral({
					referrerCode: reqCookieRefCode,
					newUserId: userId,
				});
			}

			refRes = await pool.query(
				`SELECT id, referrer_id FROM referrals WHERE referred_id = $1 AND status = 'pending' LIMIT 1`,
				[userId],
			);
		}

		if (refRes.rows.length === 0) {
			return { referralBonusUnlocked: false, welcomeCardId: null };
		}

		const referralRow = refRes.rows[0];
		const referrerId = referralRow.referrer_id;
		const settings = await getSystemSettingsMap();

		const referrerMin = Math.max(5, Number(settings.referral_referrer_min_coins) || 50);
		const referrerMax = Math.max(referrerMin, Number(settings.referral_referrer_max_coins) || 200);
		const refereeMin = Math.max(5, Number(settings.referral_referee_min_coins || settings.referee_bonus_coins) || 20);
		const refereeMax = Math.max(refereeMin, Number(settings.referral_referee_max_coins) || 50);
		const maxDailyRewards = Math.max(1, Number(settings.max_daily_referral_rewards) || 5);

		const referrerCoinsWon = Math.floor(Math.random() * (referrerMax - referrerMin + 1)) + referrerMin;
		const refereeCoinsWon = Math.floor(Math.random() * (refereeMax - refereeMin + 1)) + refereeMin;

		// Check referrer daily cap
		const referrerDailyRes = await pool.query(
			`SELECT COUNT(*) FROM scratch_cards
			 WHERE user_id = $1 AND source = 'Referral Reward'
			   AND created_at AT TIME ZONE 'Asia/Kolkata' >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date`,
			[referrerId],
		);
		const referrerDailyCount = parseInt(referrerDailyRes.rows[0]?.count || '0', 10);

		// Award Mystery Scratch Card to Referrer if under cap
		if (referrerDailyCount < maxDailyRewards) {
			await pool.query(
				`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
				 VALUES ($1, 'Referral Bonus Card', 'Referral Reward', $2, false, '#FF2D78', '🎁', NOW())`,
				[referrerId, referrerCoinsWon],
			);
		}

		// Award Welcome Scratch Card to Newly Referred Friend
		const friendCardRes = await pool.query(
			`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
			 VALUES ($1, 'Welcome Bonus Card', 'Friend Referral', $2, false, '#C6F135', '🎉', NOW())
			 RETURNING id`,
			[userId, refereeCoinsWon],
		);
		const welcomeCardId = friendCardRes.rows[0]?.id ? String(friendCardRes.rows[0].id) : null;

		// Mark referral completed
		await pool.query(
			`UPDATE referrals SET status = 'completed', completed_at = NOW() WHERE id = $1`,
			[referralRow.id],
		);

		void createNotification({
			userId: referrerId,
			title: 'Friend Joined & Smiled! 🎁',
			description: 'Your friend just completed their first smile! A referral bonus scratch card was awarded.',
			category: 'social',
			iconType: 'gift',
			actionLabel: 'Claim Scratch Card',
			actionUrl: '/rewards',
		}).catch(() => {});

		return {
			referralBonusUnlocked: true,
			welcomeCardId,
			referrerCoinsWon,
			refereeCoinsWon,
		};
	} catch (e) {
		console.error('[processReferralRewardOnFirstCapture] Error:', e);
		return { referralBonusUnlocked: false, welcomeCardId: null };
	}
}

