import { getPool } from './client';
import { deleteFromImageKitByUrl } from '../services/imagekit';
import { getUserCoinBalance } from './capture-queries';

export async function logAdminAction(
	adminId: string,
	adminEmail: string,
	action: string,
	targetType: string,
	targetId?: string | null,
	details?: Record<string, any>,
): Promise<void> {
	const pool = getPool();
	await pool.query(
		`INSERT INTO admin_audit_logs (admin_id, admin_email, action, target_type, target_id, details, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())`,
		[
			adminId,
			adminEmail,
			action,
			targetType,
			targetId || null,
			JSON.stringify(details || {}),
		],
	);
}

export async function getAdminDashboardStats() {
	const pool = getPool();
	const [
		aggregatedStatsRes,
		recentCapturesRes,
		recentLogsRes,
		recentSignupsRes,
	] = await Promise.all([
		pool.query(`
			SELECT
				(SELECT COUNT(*)::int FROM "user") AS total_users,
				(SELECT COUNT(*)::int FROM smile_captures) AS total_captures,
				(SELECT AVG(smile_score)::numeric(10,1) FROM smile_captures) AS avg_score,
				(SELECT COUNT(*)::int FROM smile_captures WHERE created_at >= CURRENT_DATE) AS captures_today,
				(SELECT COUNT(DISTINCT user_id)::int FROM smile_captures WHERE created_at >= CURRENT_DATE) AS active_today,
				(SELECT COALESCE(SUM(CASE WHEN coins > 0 THEN coins ELSE 0 END), 0)::bigint FROM coin_ledger) AS minted,
				(SELECT COALESCE(SUM(CASE WHEN coins < 0 THEN ABS(coins) ELSE 0 END), 0)::bigint FROM coin_ledger) AS spent,
				(SELECT COUNT(*)::int FROM rewards) AS total_claims,
				(SELECT COUNT(*)::int FROM smile_captures WHERE flagged = true) AS total_flags;
		`),
		pool.query(`SELECT sc.id, sc.smile_score, sc.coins_awarded, sc.created_at, sc.flagged, u.id as user_id, u.name as user_name, u.email as user_email, COALESCE(u.image, '/icons/default-icon.webp') as user_image
			FROM smile_captures sc
			JOIN "user" u ON sc.user_id = u.id
			ORDER BY sc.created_at DESC LIMIT 6`),
		pool.query(`SELECT id, admin_email, action, target_type, target_id, details, created_at
			FROM admin_audit_logs ORDER BY created_at DESC LIMIT 6`),
		pool.query(`SELECT id, name, email, COALESCE(image, '/icons/default-icon.webp') as image, COALESCE(role, 'user') as role, created_at
			FROM "user" ORDER BY created_at DESC LIMIT 5`),
	]);

	const agg = aggregatedStatsRes.rows[0] || {};

	return {
		totalUsers: agg.total_users || 0,
		totalCaptures: agg.total_captures || 0,
		averageScore: Number(agg.avg_score) || 0,
		capturesToday: agg.captures_today || 0,
		activeUsersToday: agg.active_today || 0,
		totalCoinsMinted: Number(agg.minted) || 0,
		totalCoinsSpent: Number(agg.spent) || 0,
		totalVoucherClaims: agg.total_claims || 0,
		totalFlaggedCaptures: agg.total_flags || 0,
		recentCaptures: recentCapturesRes.rows,
		recentAuditLogs: recentLogsRes.rows,
		recentSignups: recentSignupsRes.rows,
	};
}

export async function getAdminUsers(params: {
	search?: string;
	role?: string;
	banned?: string;
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 20, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const whereClauses: string[] = ['1=1'];
	const values: any[] = [];
	let paramIndex = 1;

	if (params.search && params.search.trim()) {
		whereClauses.push(
			`(u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.id ILIKE $${paramIndex})`,
		);
		values.push(`%${params.search.trim()}%`);
		paramIndex++;
	}

	if (params.role && params.role !== 'all') {
		whereClauses.push(`COALESCE(u.role, 'user') = $${paramIndex}`);
		values.push(params.role);
		paramIndex++;
	}

	if (params.banned === 'true') {
		whereClauses.push(`u.banned = true`);
	} else if (params.banned === 'false') {
		whereClauses.push(`(u.banned = false OR u.banned IS NULL)`);
	}

	const whereSql = whereClauses.join(' AND ');

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS count FROM "user" u WHERE ${whereSql}`,
		values,
	);
	const total = countRes.rows[0]?.count || 0;

	values.push(limit, offset);
	const listRes = await pool.query(
		`WITH page_users AS (
			SELECT 
				u.id,
				u.name,
				u.email,
				COALESCE(u.image, '/icons/default-icon.webp') AS image,
				COALESCE(u.role, 'user') AS role,
				COALESCE(u.banned, false) AS banned,
				u."banReason",
				u."banExpires",
				u.created_at,
				COALESCE(u.streak_count, 0) AS streak_count
			FROM "user" u
			WHERE ${whereSql}
			ORDER BY u.created_at DESC
			LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
		)
		SELECT 
			pu.*,
			COALESCE(cl.balance, 0)::bigint AS coin_balance,
			COALESCE(sc.captures_count, 0)::int AS captures_count
		FROM page_users pu
		LEFT JOIN (
			SELECT user_id, SUM(coins) AS balance
			FROM coin_ledger
			WHERE user_id IN (SELECT id FROM page_users)
			GROUP BY user_id
		) cl ON cl.user_id = pu.id
		LEFT JOIN (
			SELECT user_id, COUNT(*) AS captures_count
			FROM smile_captures
			WHERE user_id IN (SELECT id FROM page_users)
			GROUP BY user_id
		) sc ON sc.user_id = pu.id
		ORDER BY pu.created_at DESC`,
		values,
	);

	return {
		users: listRes.rows,
		total,
		limit,
		offset,
	};
}

export async function getAdminUserDetail(userId: string) {
	const pool = getPool();
	const [
		userRes,
		balance,
		capturesRes,
		ledgerRes,
		rewardsRes,
		scratchCardsRes,
	] = await Promise.all([
		pool.query(
			`SELECT u.id, u.name, u.email, COALESCE(u.image, '/icons/default-icon.webp') AS image, COALESCE(u.role, 'user') AS role,
				COALESCE(u.banned, false) AS banned, u."banReason", u."banExpires",
				u.created_at, COALESCE(u.streak_count, 0) AS streak_count,
				u.referral_code, u.referred_by
			 FROM "user" u WHERE u.id = $1`,
			[userId],
		),
		getUserCoinBalance(userId),
		pool.query(
			`SELECT id, smile_score, coins_awarded, COALESCE(flagged, false) AS flagged, flag_reason, created_at
			 FROM smile_captures WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
			[userId],
		),
		pool.query(
			`SELECT id, coins, reason, created_at
			 FROM coin_ledger WHERE user_id = $1 ORDER BY created_at DESC LIMIT 25`,
			[userId],
		),
		pool.query(
			`SELECT id, tier, provider, voucher_code, coins_spent, claimed_at
			 FROM rewards WHERE user_id = $1 ORDER BY claimed_at DESC LIMIT 10`,
			[userId],
		),
		pool.query(
			`SELECT id, title, source, coins, is_scratched, theme_color, badge, created_at, scratched_at
			 FROM scratch_cards WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
			[userId],
		),
	]);

	if (!userRes.rows[0]) return null;

	return {
		user: userRes.rows[0],
		balance,
		captures: capturesRes.rows,
		ledger: ledgerRes.rows,
		rewards: rewardsRes.rows,
		scratchCards: scratchCardsRes.rows,
	};
}

export async function adminGrantUserScratchCard(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	coins: number,
	title?: string,
	badge?: string,
	themeColor?: string,
) {
	const pool = getPool();
	const sanitizedTitle = (title && title.trim()) || 'Admin Surprise Reward';
	const sanitizedBadge = (badge && badge.trim()) || '🎁';
	const sanitizedTheme = (themeColor && themeColor.trim()) || '#FF2D78';

	const res = await pool.query(
		`INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
		 VALUES ($1, $2, 'Admin Grant', $3, false, $4, $5, NOW())
		 RETURNING id, user_id, title, source, coins, is_scratched, theme_color, badge, created_at`,
		[targetUserId, sanitizedTitle, coins, sanitizedTheme, sanitizedBadge],
	);

	const card = res.rows[0];

	await logAdminAction(
		adminId,
		adminEmail,
		'grant_scratch_card',
		'user',
		targetUserId,
		{
			cardId: card?.id,
			coins,
			title: sanitizedTitle,
			badge: sanitizedBadge,
			themeColor: sanitizedTheme,
		},
	);

	return card;
}

export async function adminAdjustUserCoins(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	amount: number,
	reason: string,
) {
	const pool = getPool();
	const sanitizedReason = reason.trim() || 'Admin manual adjustment';
	await pool.query(
		`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
		 VALUES ($1, $2, $3, NOW())`,
		[targetUserId, amount, `admin_adjustment: ${sanitizedReason}`],
	);
	const newBalance = await getUserCoinBalance(targetUserId);

	await logAdminAction(
		adminId,
		adminEmail,
		'adjust_coins',
		'user',
		targetUserId,
		{
			amount,
			reason: sanitizedReason,
			newBalance,
		},
	);

	return newBalance;
}

export async function adminSetUserRole(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	role: string,
) {
	const pool = getPool();
	const validRole = role === 'admin' ? 'admin' : 'user';
	await pool.query(`UPDATE "user" SET role = $1 WHERE id = $2`, [
		validRole,
		targetUserId,
	]);

	await logAdminAction(adminId, adminEmail, 'set_role', 'user', targetUserId, {
		newRole: validRole,
	});

	return { success: true, role: validRole };
}

export async function adminSetUserBan(
	adminId: string,
	adminEmail: string,
	targetUserId: string,
	banned: boolean,
	banReason?: string | null,
	banExpires?: Date | null,
) {
	const pool = getPool();
	await pool.query(
		`UPDATE "user"
		 SET banned = $1, "banReason" = $2, "banExpires" = $3
		 WHERE id = $4`,
		[
			banned,
			banned ? banReason || 'Violating platform guidelines' : null,
			banned ? banExpires || null : null,
			targetUserId,
		],
	);

	if (banned) {
		await pool
			.query(`DELETE FROM "session" WHERE "userId" = $1`, [targetUserId])
			.catch(() => {});
		await pool
			.query(`DELETE FROM "sessions" WHERE user_id = $1`, [targetUserId])
			.catch(() => {});
	}

	await logAdminAction(
		adminId,
		adminEmail,
		banned ? 'ban_user' : 'unban_user',
		'user',
		targetUserId,
		{
			banned,
			banReason,
			banExpires,
		},
	);

	return { success: true, banned };
}

export async function getAdminCaptures(params: {
	search?: string;
	minScore?: number;
	maxScore?: number;
	flaggedOnly?: boolean;
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 25, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const where: string[] = ['1=1'];
	const values: any[] = [];
	let idx = 1;

	if (params.search && params.search.trim()) {
		where.push(
			`(u.name ILIKE $${idx} OR u.email ILIKE $${idx} OR sc.user_id ILIKE $${idx})`,
		);
		values.push(`%${params.search.trim()}%`);
		idx++;
	}

	if (typeof params.minScore === 'number' && !isNaN(params.minScore)) {
		where.push(`sc.smile_score >= $${idx}`);
		values.push(params.minScore);
		idx++;
	}

	if (typeof params.maxScore === 'number' && !isNaN(params.maxScore)) {
		where.push(`sc.smile_score <= $${idx}`);
		values.push(params.maxScore);
		idx++;
	}

	if (params.flaggedOnly) {
		where.push(`sc.flagged = true`);
	}

	const whereSql = where.join(' AND ');

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS count
		 FROM smile_captures sc
		 JOIN "user" u ON sc.user_id = u.id
		 WHERE ${whereSql}`,
		values,
	);

	values.push(limit, offset);
	const listRes = await pool.query(
		`SELECT 
			sc.id,
			sc.user_id,
			u.name AS user_name,
			u.email AS user_email,
			COALESCE(u.image, '/icons/default-icon.webp') AS user_image,
			sc.smile_score,
			sc.coins_awarded,
			COALESCE(sc.flagged, false) AS flagged,
			sc.flag_reason,
			sc.flagged_at,
			sc.flagged_by,
			sc.created_at
		 FROM smile_captures sc
		 JOIN "user" u ON sc.user_id = u.id
		 WHERE ${whereSql}
		 ORDER BY sc.created_at DESC
		 LIMIT $${idx} OFFSET $${idx + 1}`,
		values,
	);

	return {
		captures: listRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function adminFlagCapture(
	adminId: string,
	adminEmail: string,
	captureId: string,
	reason: string,
	deductCoins = true,
) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const captureRes = await client.query(
			`SELECT user_id, coins_awarded, flagged FROM smile_captures WHERE id = $1 FOR UPDATE`,
			[captureId],
		);
		if (!captureRes.rows[0]) {
			await client.query('ROLLBACK');
			return { success: false, error: 'Capture not found' };
		}
		const capture = captureRes.rows[0];
		const alreadyFlagged = Boolean(capture.flagged);

		await client.query(
			`UPDATE smile_captures
			 SET flagged = true, flag_reason = $1, flagged_at = NOW(), flagged_by = $2
			 WHERE id = $3`,
			[reason, adminEmail, captureId],
		);

		let clawedBackCoins = 0;
		if (deductCoins && !alreadyFlagged && Number(capture.coins_awarded) > 0) {
			clawedBackCoins = Number(capture.coins_awarded);
			await client.query(
				`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
				 VALUES ($1, $2, $3, NOW())`,
				[capture.user_id, -clawedBackCoins, `anti_cheat_clawback: ${reason}`],
			);
		}

		await client.query('COMMIT');

		await logAdminAction(
			adminId,
			adminEmail,
			'flag_capture',
			'capture',
			captureId,
			{
				reason,
				clawedBackCoins,
				userId: capture.user_id,
			},
		);

		return { success: true, clawedBackCoins };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function getAdminVouchers() {
	const pool = getPool();
	const inventoryRes = await pool.query(
		`SELECT voucher_id, brand_name, title, status, COUNT(*)::int as count
		 FROM voucher_inventory
		 GROUP BY voucher_id, brand_name, title, status`,
	);

	const claimsRes = await pool.query(
		`SELECT COUNT(*)::int as total_claims, COALESCE(SUM(coins_spent), 0)::bigint as total_spent
		 FROM rewards`,
	);

	let catalogRows = [];
	try {
		const catalogRes = await pool.query(
			`SELECT id, brand_name as "brandName", title, description, details, category, image_url as "imageUrl",
			        numeric_value as "numericValue", coins_cost as "coinsCost", highlight_tag as "highlightTag",
			        is_active as "isActive", redirect_url as "redirectUrl",
			        COALESCE(voucher_type, 'gift_card') as "voucherType",
			        COALESCE(value_formatted, '₹' || numeric_value::text) as "valueFormatted",
			        created_at as "createdAt"
			 FROM vouchers_catalog
			 ORDER BY created_at DESC`,
		);
		catalogRows = catalogRes.rows;
	} catch (err) {
		console.warn('Failed to query vouchers_catalog with details, falling back:', err);
		try {
			const fallbackRes = await pool.query(
				`SELECT id, brand_name as "brandName", title, description, category, image_url as "imageUrl",
				        numeric_value as "numericValue", coins_cost as "coinsCost", highlight_tag as "highlightTag",
				        is_active as "isActive", redirect_url as "redirectUrl",
				        COALESCE(voucher_type, 'gift_card') as "voucherType",
				        COALESCE(value_formatted, '₹' || numeric_value::text) as "valueFormatted",
				        created_at as "createdAt"
				 FROM vouchers_catalog
				 ORDER BY created_at DESC`,
			);
			catalogRows = fallbackRes.rows.map((r: any) => ({ ...r, details: null }));
		} catch (fallbackErr) {
			console.error('Failed fallback query vouchers_catalog:', fallbackErr);
		}
	}

	return {
		inventorySummary: inventoryRes.rows,
		catalog: catalogRows,
		totalClaims: claimsRes.rows[0]?.total_claims || 0,
		totalCoinsSpent: Number(claimsRes.rows[0]?.total_spent) || 0,
	};
}

export async function createAdminVoucher(params: {
	adminId: string;
	adminEmail: string;
	brandName: string;
	title: string;
	description?: string;
	details?: string;
	category?: string;
	imageUrl?: string;
	voucherType?: string;
	valueFormatted?: string;
	numericValue: number;
	coinsCost: number;
	highlightTag?: string;
	redirectUrl?: string;
	codes?: string[];
}) {
	const pool = getPool();
	const cleanBrand =
		params.brandName
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '')
			.slice(0, 4) || 'vouc';
	const id = `${cleanBrand}-${params.numericValue || 'rew'}-${Date.now().toString(36).slice(-4)}`;

	await pool.query(
		`INSERT INTO vouchers_catalog (id, brand_name, title, description, details, category, image_url, numeric_value, coins_cost, highlight_tag, is_active, voucher_type, value_formatted, redirect_url, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, $11, $12, $13, NOW())
		 ON CONFLICT (id) DO UPDATE SET
		 	brand_name = EXCLUDED.brand_name,
		 	title = EXCLUDED.title,
		 	description = EXCLUDED.description,
		 	details = EXCLUDED.details,
		 	category = EXCLUDED.category,
		 	image_url = EXCLUDED.image_url,
		 	numeric_value = EXCLUDED.numeric_value,
		 	coins_cost = EXCLUDED.coins_cost,
		 	highlight_tag = EXCLUDED.highlight_tag,
		 	voucher_type = EXCLUDED.voucher_type,
		 	value_formatted = EXCLUDED.value_formatted,
		 	redirect_url = EXCLUDED.redirect_url`,
		[
			id,
			params.brandName,
			params.title,
			params.description || `Redeem ${params.title} with smile coins.`,
			params.details || null,
			params.category || 'ecommerce',
			params.imageUrl || null,
			params.numericValue,
			params.coinsCost,
			params.highlightTag || null,
			params.voucherType || 'gift_card',
			params.valueFormatted ||
				(params.numericValue ? `₹${params.numericValue}` : params.title),
			params.redirectUrl || null,
		],
	);

	let insertedCodes = 0;
	if (params.codes && params.codes.length > 0) {
		const cleanCodes = Array.from(
			new Set(params.codes.map((c) => c.trim()).filter(Boolean)),
		);
		for (const rawCode of cleanCodes) {
			let code = rawCode;
			let pin: string | null = null;
			if (rawCode.includes(':')) {
				const parts = rawCode.split(':');
				code = parts[0].trim();
				pin = parts.slice(1).join(':').trim() || null;
			} else if (rawCode.includes(',')) {
				const parts = rawCode.split(',');
				code = parts[0].trim();
				pin = parts.slice(1).join(',').trim() || null;
			}
			const res = await pool.query(
				`INSERT INTO voucher_inventory (voucher_id, brand_name, title, code, pin, status, created_at)
				 VALUES ($1, $2, $3, $4, $5, 'available', NOW())
				 ON CONFLICT (code) DO NOTHING`,
				[id, params.brandName, params.title, code, pin],
			);
			if (res.rowCount && res.rowCount > 0) insertedCodes++;
		}
	}

	await logAdminAction(
		params.adminId,
		params.adminEmail,
		'create_voucher',
		'voucher',
		id,
		{
			brandName: params.brandName,
			title: params.title,
			numericValue: params.numericValue,
			coinsCost: params.coinsCost,
			voucherType: params.voucherType,
			valueFormatted: params.valueFormatted,
			redirectUrl: params.redirectUrl,
			codesCount: insertedCodes,
		},
	);

	return { success: true, voucherId: id, insertedCodes };
}

export async function updateAdminVoucher(params: {
	adminId: string;
	adminEmail: string;
	voucherId: string;
	brandName: string;
	title: string;
	description?: string;
	details?: string | null;
	category?: string;
	imageUrl?: string | null;
	voucherType?: string;
	valueFormatted?: string | null;
	numericValue: number;
	coinsCost: number;
	highlightTag?: string | null;
	redirectUrl?: string | null;
	isActive?: boolean;
}) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		const vRes = await client.query(
			`UPDATE vouchers_catalog
			 SET brand_name = $2,
			     title = $3,
			     description = $4,
			     details = $5,
			     category = $6,
			     image_url = $7,
			     numeric_value = $8,
			     coins_cost = $9,
			     highlight_tag = $10,
			     is_active = COALESCE($11, is_active),
			     voucher_type = COALESCE($12, voucher_type),
			     value_formatted = COALESCE($13, value_formatted),
			     redirect_url = COALESCE($14, redirect_url)
			 WHERE id = $1
			 RETURNING id, brand_name as "brandName", title, description, details, category, image_url as "imageUrl",
			           numeric_value as "numericValue", coins_cost as "coinsCost", highlight_tag as "highlightTag",
			           is_active as "isActive", voucher_type as "voucherType", value_formatted as "valueFormatted",
			           redirect_url as "redirectUrl"`,
			[
				params.voucherId,
				params.brandName,
				params.title,
				params.description !== undefined ? params.description : null,
				params.details !== undefined ? params.details : null,
				params.category || 'ecommerce',
				params.imageUrl !== undefined ? params.imageUrl : null,
				params.numericValue,
				params.coinsCost,
				params.highlightTag !== undefined ? params.highlightTag : null,
				params.isActive !== undefined ? params.isActive : null,
				params.voucherType !== undefined ? params.voucherType : null,
				params.valueFormatted !== undefined ? params.valueFormatted : null,
				params.redirectUrl !== undefined ? params.redirectUrl : null,
			],
		);

		if (vRes.rowCount === 0) {
			throw new Error('Voucher not found');
		}

		await client.query(
			`UPDATE voucher_inventory
			 SET brand_name = $2, title = $3
			 WHERE voucher_id = $1`,
			[params.voucherId, params.brandName, params.title],
		);

		await client.query('COMMIT');

		await logAdminAction(
			params.adminId,
			params.adminEmail,
			'update_voucher',
			'voucher',
			params.voucherId,
			{
				brandName: params.brandName,
				title: params.title,
				numericValue: params.numericValue,
				coinsCost: params.coinsCost,
				voucherType: params.voucherType,
				valueFormatted: params.valueFormatted,
				redirectUrl: params.redirectUrl,
				isActive: params.isActive,
			},
		);

		return { success: true, voucher: vRes.rows[0] };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function deleteAdminVoucher(params: {
	adminId: string;
	adminEmail: string;
	voucherId: string;
}) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		const vRes = await client.query(
			`SELECT brand_name, title FROM vouchers_catalog WHERE id = $1`,
			[params.voucherId],
		);
		const voucher = vRes.rows[0];
		if (!voucher) {
			throw new Error('Voucher not found');
		}

		const invRes = await client.query(
			`DELETE FROM voucher_inventory WHERE voucher_id = $1 AND status = 'available'`,
			[params.voucherId],
		);

		await client.query(`DELETE FROM vouchers_catalog WHERE id = $1`, [
			params.voucherId,
		]);

		await client.query('COMMIT');

		await logAdminAction(
			params.adminId,
			params.adminEmail,
			'delete_voucher',
			'voucher',
			params.voucherId,
			{
				brandName: voucher.brand_name,
				title: voucher.title,
				deletedAvailableCodes: invRes.rowCount || 0,
			},
		);

		return { success: true, deletedAvailableCodes: invRes.rowCount || 0 };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function adminSeedVoucherCodes(
	adminId: string,
	adminEmail: string,
	voucherId: string,
	brandName: string,
	title: string,
	codes: string[],
) {
	const pool = getPool();
	const cleanCodes = Array.from(
		new Set(codes.map((c) => c.trim()).filter(Boolean)),
	);
	if (cleanCodes.length === 0) {
		return { success: false, inserted: 0, total: 0 };
	}

	let inserted = 0;
	for (const rawCode of cleanCodes) {
		let code = rawCode;
		let pin: string | null = null;
		if (rawCode.includes(':')) {
			const parts = rawCode.split(':');
			code = parts[0].trim();
			pin = parts.slice(1).join(':').trim() || null;
		} else if (rawCode.includes(',')) {
			const parts = rawCode.split(',');
			code = parts[0].trim();
			pin = parts.slice(1).join(',').trim() || null;
		}
		const res = await pool.query(
			`INSERT INTO voucher_inventory (voucher_id, brand_name, title, code, pin, status, created_at)
			 VALUES ($1, $2, $3, $4, $5, 'available', NOW())
			 ON CONFLICT (code) DO NOTHING`,
			[voucherId, brandName, title, code, pin],
		);
		if (res.rowCount && res.rowCount > 0) inserted++;
	}

	await logAdminAction(
		adminId,
		adminEmail,
		'seed_vouchers',
		'voucher',
		voucherId,
		{
			brandName,
			title,
			codesCount: cleanCodes.length,
			inserted,
		},
	);

	return { success: true, inserted, total: cleanCodes.length };
}

export async function claimVoucherAtomic(params: {
	userId: string;
	voucherId: string;
	coinsCost?: number;
	brandName?: string;
}) {
	const pool = getPool();
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const invRes = await client.query(
			`SELECT id, voucher_id, brand_name, title, code, pin
			 FROM voucher_inventory
			 WHERE voucher_id = $1 AND status = 'available'
			 ORDER BY created_at ASC
			 LIMIT 1
			 FOR UPDATE SKIP LOCKED`,
			[params.voucherId],
		);

		if (invRes.rowCount === 0 || !invRes.rows[0]) {
			await client.query('ROLLBACK');
			return {
				success: false,
				error: 'OUT_OF_STOCK',
				message: 'This voucher is currently out of stock.',
			};
		}

		const inv = invRes.rows[0];

		const catRes = await client.query(
			`SELECT id, brand_name as "brandName", title, description, details, category, image_url as "imageUrl",
			        numeric_value as "numericValue", coins_cost as "coinsCost", highlight_tag as "highlightTag",
			        value_formatted as "valueFormatted", redirect_url as "redirectUrl", is_active as "isActive"
			 FROM vouchers_catalog
			 WHERE id = $1`,
			[params.voucherId],
		);

		const catalogItem = catRes.rows[0];
		const brandName = catalogItem?.brandName || inv.brand_name || params.brandName || 'Brand';
		const title = catalogItem?.title || inv.title || `${brandName} Voucher`;
		const coinsCost = Number(catalogItem?.coinsCost ?? params.coinsCost ?? 0);
		const valueFormatted = catalogItem?.valueFormatted || (catalogItem?.numericValue ? `₹${catalogItem.numericValue}` : `₹${Math.round(coinsCost / 2)}`);
		const redirectUrl = catalogItem?.redirectUrl || null;
		const imageUrl = catalogItem?.imageUrl || null;

		const balRes = await client.query(
			`SELECT COALESCE(SUM(coins), 0)::bigint AS balance FROM coin_ledger WHERE user_id = $1`,
			[params.userId],
		);
		const currentBalance = Number(balRes.rows[0]?.balance || 0);
		if (currentBalance < coinsCost) {
			await client.query('ROLLBACK');
			return {
				success: false,
				error: 'INSUFFICIENT_COINS',
				message: `Insufficient coins. You have ${currentBalance} coins, but ${coinsCost} are required.`,
			};
		}

		await client.query(
			`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
			 VALUES ($1, $2, 'voucher_claim', NOW())`,
			[params.userId, -coinsCost],
		);

		const now = new Date();
		const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

		await client.query(
			`UPDATE voucher_inventory
			 SET status = 'claimed', claimed_by = $1, claimed_at = $2
			 WHERE id = $3`,
			[params.userId, now, inv.id],
		);

		const rewardRes = await client.query(
			`INSERT INTO rewards (user_id, tier, provider, voucher_code, coins_spent, claimed_at, voucher_id, redirect_url, pin, image_url)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			 RETURNING id`,
			[
				params.userId,
				valueFormatted,
				brandName,
				inv.code,
				coinsCost,
				now,
				params.voucherId,
				redirectUrl,
				inv.pin || null,
				imageUrl,
			],
		);

		await client.query(
			`INSERT INTO vouchers (user_id, voucher_type, coin_cost, code, status, created_at)
			 VALUES ($1, $2, $3, $4, 'claimed', $5)`,
			[params.userId, `${valueFormatted} ${brandName} Voucher`, coinsCost, inv.code, now],
		);

		await client.query(
			`INSERT INTO scratch_cards (user_id, title, source, coins, voucher_id, voucher_title, voucher_code, voucher_brand, is_scratched, theme_color, badge, created_at)
			 VALUES ($1, $2, 'Voucher Marketplace', 0, $3, $4, $5, $6, true, '#22C55E', 'VOUCHER', $7)`,
			[
				params.userId,
				`${brandName} Voucher (${valueFormatted})`,
				params.voucherId,
				`${valueFormatted} ${brandName} Voucher`,
				inv.code,
				brandName,
				now,
			],
		);

		await client.query('COMMIT');

		const fallbackWebsite = brandName.toLowerCase().includes('flipkart')
			? 'https://flipkart.com'
			: brandName.toLowerCase().includes('boat')
			? 'https://boat-lifestyle.com'
			: brandName.toLowerCase().includes('apple')
			? 'https://www.apple.com'
			: brandName.toLowerCase().includes('lenskart')
			? 'https://www.lenskart.com'
			: 'https://www.google.com';

		return {
			success: true,
			claim: {
				id: String(rewardRes.rows[0]?.id),
				voucherId: params.voucherId,
				brandName,
				title,
				valueFormatted,
				code: inv.code,
				pin: inv.pin || null,
				claimedAt: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				expiresAt: expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				coinsSpent: coinsCost,
				logoBg: brandName.toLowerCase().includes('flipkart') ? '#2874F0' : brandName.toLowerCase().includes('boat') ? '#E21B24' : '#FF9900',
				websiteUrl: redirectUrl || fallbackWebsite,
				imageUrl: imageUrl || undefined,
				status: 'active' as const,
			},
		};
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function getAdminVoucherClaims(params: {
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 50, 1), 200);
	const offset = Math.max(params.offset || 0, 0);

	const countRes = await pool.query(
		`SELECT COUNT(*)::int as count FROM rewards`,
	);
	const claimsRes = await pool.query(
		`SELECT r.id, r.user_id, u.name as user_name, u.email as user_email,
				r.tier, r.provider, r.voucher_code, r.coins_spent, r.claimed_at,
				r.redirect_url, r.pin, r.voucher_id, r.image_url
		 FROM rewards r
		 JOIN "user" u ON r.user_id = u.id
		 ORDER BY r.claimed_at DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset],
	);

	return {
		claims: claimsRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function getAdminExplorePosts(params: {
	limit?: number;
	offset?: number;
}) {
	const pool = getPool();
	const limit = Math.min(Math.max(params.limit || 24, 1), 100);
	const offset = Math.max(params.offset || 0, 0);

	const countRes = await pool.query(
		`SELECT COUNT(*)::int as count FROM explore_posts`,
	);
	const postsRes = await pool.query(
		`SELECT ep.id, ep.user_id, u.name as user_name, u.email as user_email,
				ep.image_url, ep.smile_score, ep.caption, ep.likes_count, ep.created_at
		 FROM explore_posts ep
		 JOIN "user" u ON ep.user_id = u.id
		 ORDER BY ep.created_at DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset],
	);

	return {
		posts: postsRes.rows,
		total: countRes.rows[0]?.count || 0,
		limit,
		offset,
	};
}

export async function adminDeleteExplorePost(
	adminId: string,
	adminEmail: string,
	postId: string,
) {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		await client.query(`DELETE FROM explore_likes WHERE post_id = $1`, [
			postId,
		]);
		const del = await client.query(
			`DELETE FROM explore_posts WHERE id = $1 RETURNING user_id`,
			[postId],
		);
		await client.query('COMMIT');

		await logAdminAction(
			adminId,
			adminEmail,
			'delete_explore_post',
			'explore_post',
			postId,
			{
				deleted: (del.rowCount || 0) > 0,
				authorUserId: del.rows[0]?.user_id,
			},
		);

		return { success: true, deleted: (del.rowCount || 0) > 0 };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

export async function deleteUserExplorePost(
	userId: string,
	postId: string,
): Promise<{ success: boolean; deleted: boolean; error?: string }> {
	const pool = getPool();
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		const checkRes = await client.query(
			`SELECT id, image_url FROM explore_posts WHERE id = $1 AND user_id = $2`,
			[postId, userId],
		);

		if (checkRes.rows.length === 0) {
			await client.query('ROLLBACK');
			return { success: false, deleted: false, error: 'Post not found or unauthorized' };
		}

		const imageUrl = checkRes.rows[0]?.image_url;

		await client.query(`DELETE FROM explore_likes WHERE post_id = $1`, [postId]);
		await client.query(`DELETE FROM likes WHERE post_id = $1`, [postId]);
		await client.query(`DELETE FROM posts WHERE id = $1 AND user_id = $2`, [postId, userId]);
		const del = await client.query(
			`DELETE FROM explore_posts WHERE id = $1 AND user_id = $2 RETURNING id`,
			[postId, userId],
		);

		await client.query('COMMIT');

		if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes('ik.imagekit.io')) {
			deleteFromImageKitByUrl(imageUrl).catch(() => {});
		}

		return { success: true, deleted: (del.rowCount || 0) > 0 };
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}
