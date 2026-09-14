import { getPool } from './client';

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
	referrerCode: string;
	newUserId: string;
}): Promise<{ success: boolean; referralId?: string; error?: string }> {
	const { referrerCode, newUserId } = params;
	if (!referrerCode || !newUserId) {
		return { success: false, error: 'Missing referrerCode or newUserId' };
	}

	const referrer = await findUserByReferralCode(referrerCode);
	if (!referrer) {
		return { success: false, error: 'Referrer not found' };
	}

	// Prevent self-referral
	if (referrer.id === newUserId) {
		return { success: false, error: 'Cannot refer oneself' };
	}

	const pool = getPool();
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// Set referred_by on new user
		await client.query(
			`UPDATE "user" SET referred_by = $1 WHERE id = $2 AND (referred_by IS NULL OR referred_by = '')`,
			[referrer.id, newUserId],
		);

		// Insert pending referral
		const res = await client.query(
			`INSERT INTO referrals (id, referrer_id, referred_id, status, created_at)
			 VALUES (gen_random_uuid(), $1, $2, 'pending', NOW())
			 ON CONFLICT (referred_id) DO NOTHING
			 RETURNING id`,
			[referrer.id, newUserId],
		);

		await client.query('COMMIT');
		return {
			success: true,
			referralId: res.rows[0]?.id ? String(res.rows[0].id) : undefined,
		};
	} catch (err: any) {
		await client.query('ROLLBACK');
		console.error('[createPendingReferral] Error:', err);
		return { success: false, error: err.message };
	} finally {
		client.release();
	}
}
