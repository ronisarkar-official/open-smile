import { getPool, getSupabase } from './client';
import { ensureIndexes } from './indexes';
import { logAdminAction } from './admin-queries';
import { getSystemSettingsMap } from './settings-queries';

export interface DbNotification {
	id: string;
	user_id: string;
	title: string;
	description: string;
	category: string;
	icon_type: string;
	action_label: string | null;
	action_url: string | null;
	read: boolean;
	read_at: string | null;
	created_at: string;
}

export interface UserNotificationPreferences {
	user_id: string;
	security_emails: boolean;
	streak_reminders: boolean;
	leaderboard_alerts: boolean;
	reward_alerts: boolean;
	marketing_emails: boolean;
	in_app_streaks: boolean;
	in_app_rewards: boolean;
	in_app_leaderboard: boolean;
	in_app_system: boolean;
	updated_at: string;
}

export interface DbEmailLog {
	id: string;
	recipient_email: string;
	user_id: string | null;
	template: string;
	subject: string;
	status: string;
	provider: string;
	message_id: string | null;
	error: string | null;
	metadata: Record<string, unknown> | null;
	created_at: string;
}

export interface DbEmailSuppression {
	email: string;
	reason: string;
	category: string;
	created_at: string;
}

export async function getUserNotifications(
	userId: string,
	options?: {
		limit?: number;
		offset?: number;
		category?: string;
		unreadOnly?: boolean;
	},
): Promise<{
	notifications: DbNotification[];
	total: number;
	unreadCount: number;
	categoryCounts: Record<string, number>;
}> {
	await ensureIndexes();
	const pool = getPool();
	const limit = Math.max(1, Math.min(100, options?.limit ?? 30));
	const offset = Math.max(0, options?.offset ?? 0);

	const unreadRes = await pool.query(
		`SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND read = false`,
		[userId],
	);
	const unreadCount = Number(unreadRes.rows[0]?.count ?? 0);

	const catRes = await pool.query(
		`SELECT category, COUNT(*)::int AS count FROM notifications WHERE user_id = $1 GROUP BY category`,
		[userId],
	);
	const categoryCounts: Record<string, number> = {
		rewards: 0,
		streaks: 0,
		leaderboard: 0,
		social: 0,
		system: 0,
	};
	let totalAll = 0;
	for (const row of catRes.rows) {
		const count = Number(row.count);
		categoryCounts[row.category] = count;
		totalAll += count;
	}

	const conditions: string[] = ['user_id = $1'];
	const params: unknown[] = [userId];

	if (options?.unreadOnly) {
		conditions.push('read = false');
	} else if (options?.category && options.category !== 'all') {
		params.push(options.category);
		conditions.push(`category = $${params.length}`);
	}

	const whereClause = conditions.join(' AND ');
	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total FROM notifications WHERE ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT id, user_id, title, description, category, icon_type, action_label, action_url, read, read_at, created_at
		 FROM notifications
		 WHERE ${whereClause}
		 ORDER BY created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		notifications: rows,
		total,
		unreadCount,
		categoryCounts,
	};
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
	await ensureIndexes();
	const { rows } = await getPool().query(
		`SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND read = false`,
		[userId],
	);
	return Number(rows[0]?.count ?? 0);
}

export async function markNotificationAsRead(
	userId: string,
	notificationId: string,
): Promise<boolean> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`UPDATE notifications
		 SET read = true, read_at = NOW()
		 WHERE id = $1 AND user_id = $2 AND read = false`,
		[notificationId, userId],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function markAllNotificationsAsRead(userId: string): Promise<number> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`UPDATE notifications
		 SET read = true, read_at = NOW()
		 WHERE user_id = $1 AND read = false`,
		[userId],
	);
	return rowCount ?? 0;
}

export async function deleteNotification(
	userId: string,
	notificationId: string,
): Promise<boolean> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
		[notificationId, userId],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function clearReadNotifications(userId: string): Promise<number> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`DELETE FROM notifications WHERE user_id = $1 AND read = true`,
		[userId],
	);
	return rowCount ?? 0;
}

export async function createNotification(params: {
	userId: string;
	title: string;
	description: string;
	category?: string;
	iconType?: string;
	actionLabel?: string;
	actionUrl?: string;
}): Promise<DbNotification | null> {
	await ensureIndexes();
	const pool = getPool();

	const settings = await getSystemSettingsMap();
	if (settings.in_app_notifications_enabled === false) {
		return null;
	}

	const category = params.category ?? 'system';
	const iconType = params.iconType ?? 'bell';

	const { rows } = await pool.query(
		`INSERT INTO notifications (user_id, title, description, category, icon_type, action_label, action_url, read, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW())
		 RETURNING *`,
		[
			params.userId,
			params.title,
			params.description,
			category,
			iconType,
			params.actionLabel ?? null,
			params.actionUrl ?? null,
		],
	);

	return rows[0] ?? null;
}

export async function notifyUnscratchedCard(
	userId: string,
	cardId: string,
): Promise<boolean> {
	await ensureIndexes();
	const pool = getPool();

	const cardRes = await pool.query(
		`SELECT id, is_scratched, created_at
		 FROM scratch_cards
		 WHERE id = $1 AND user_id = $2`,
		[cardId, userId],
	);

	if (!cardRes.rows || cardRes.rows.length === 0) {
		return false;
	}

	const card = cardRes.rows[0];
	if (card.is_scratched) {
		return false;
	}

	const existingRes = await pool.query(
		`SELECT id FROM notifications
		 WHERE user_id = $1
		   AND category = 'rewards'
		   AND action_url = '/rewards'
		   AND created_at >= ($2::timestamptz - INTERVAL '5 seconds')`,
		[userId, card.created_at],
	);

	if (existingRes.rows && existingRes.rows.length > 0) {
		return false;
	}

	const created = await createNotification({
		userId,
		title: 'You won a Scratch Card! 🎁',
		description: 'You have an unscratched reward waiting from your smile check. Scratch it to reveal your prize!',
		category: 'rewards',
		iconType: 'gift',
		actionLabel: 'Scratch Now',
		actionUrl: '/rewards',
	});

	return Boolean(created);
}

export async function syncUnscratchedCardNotifications(
	userId: string,
): Promise<number> {
	await ensureIndexes();
	const pool = getPool();

	const { rows } = await pool.query(
		`SELECT sc.id, sc.created_at
		 FROM scratch_cards sc
		 WHERE sc.user_id = $1
		   AND sc.is_scratched = false
		   AND sc.created_at <= NOW() - INTERVAL '30 seconds'
		   AND NOT EXISTS (
		     SELECT 1 FROM notifications n
		     WHERE n.user_id = $1
		       AND n.category = 'rewards'
		       AND n.action_url = '/rewards'
		       AND n.created_at >= sc.created_at - INTERVAL '5 seconds'
		   )
		 ORDER BY sc.created_at ASC
		 LIMIT 3`,
		[userId],
	);

	let count = 0;
	for (const row of rows) {
		const created = await createNotification({
			userId,
			title: 'You won a Scratch Card! 🎁',
			description: 'You have an unscratched reward waiting from your smile check. Scratch it to reveal your prize!',
			category: 'rewards',
			iconType: 'gift',
			actionLabel: 'Scratch Now',
			actionUrl: '/rewards',
		});
		if (created) {
			count++;
		}
	}

	return count;
}

export async function createBroadcastNotification(params: {
	target: 'all' | 'active_7d' | 'specific';
	targetUserId?: string;
	title: string;
	description: string;
	category?: string;
	iconType?: string;
	actionLabel?: string;
	actionUrl?: string;
	adminId: string;
	adminEmail: string;
}): Promise<{ count: number }> {
	await ensureIndexes();
	const pool = getPool();
	const category = params.category ?? 'system';
	const iconType = params.iconType ?? 'bell';

	let targetUserIds: string[] = [];

	if (params.target === 'specific' && params.targetUserId) {
		const checkUser = await pool.query(
			`SELECT id FROM "user" WHERE id = $1 OR LOWER(email) = LOWER($1) LIMIT 1`,
			[params.targetUserId.trim()],
		);
		if (checkUser.rows[0]) {
			targetUserIds = [checkUser.rows[0].id];
		}
	} else if (params.target === 'active_7d') {
		const activeRes = await pool.query(
			`SELECT DISTINCT user_id FROM smile_captures WHERE created_at >= NOW() - INTERVAL '7 days'`,
		);
		targetUserIds = activeRes.rows.map((r) => r.user_id);
	} else {
		const allRes = await pool.query(`SELECT id FROM "user" WHERE banned IS NOT TRUE`);
		targetUserIds = allRes.rows.map((r) => r.id);
	}

	if (targetUserIds.length === 0) {
		return { count: 0 };
	}

	const batchSize = 250;
	let insertedCount = 0;

	for (let i = 0; i < targetUserIds.length; i += batchSize) {
		const chunk = targetUserIds.slice(i, i + batchSize);
		const valuePlaceholders: string[] = [];
		const values: unknown[] = [];

		chunk.forEach((uid, index) => {
			const offset = index * 7;
			valuePlaceholders.push(
				`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`,
			);
			values.push(
				uid,
				params.title,
				params.description,
				category,
				iconType,
				params.actionLabel ?? null,
				params.actionUrl ?? null,
			);
		});

		const query = `
			INSERT INTO notifications (user_id, title, description, category, icon_type, action_label, action_url)
			VALUES ${valuePlaceholders.join(', ')}
		`;
		const res = await pool.query(query, values);
		insertedCount += res.rowCount ?? 0;
	}

	await logAdminAction(
		params.adminId,
		params.adminEmail,
		'BROADCAST_NOTIFICATION',
		'notifications',
		params.target,
		{
			title: params.title,
			category,
			targetedCount: targetUserIds.length,
			insertedCount,
		},
	);

	return { count: insertedCount };
}

export async function getAdminNotifications(options?: {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
}): Promise<{
	notifications: (DbNotification & { user_name?: string; user_email?: string })[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}> {
	await ensureIndexes();
	const pool = getPool();
	const page = Math.max(1, options?.page ?? 1);
	const limit = Math.max(1, Math.min(100, options?.limit ?? 25));
	const offset = (page - 1) * limit;

	const conditions: string[] = [];
	const params: unknown[] = [];

	if (options?.category && options.category !== 'all') {
		params.push(options.category);
		conditions.push(`n.category = $${params.length}`);
	}

	if (options?.search) {
		params.push(`%${options.search.trim().toLowerCase()}%`);
		const pIdx = params.length;
		conditions.push(
			`(LOWER(n.title) LIKE $${pIdx} OR LOWER(n.description) LIKE $${pIdx} OR LOWER(u.email) LIKE $${pIdx} OR LOWER(COALESCE(u.name, '')) LIKE $${pIdx})`,
		);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total
		 FROM notifications n
		 LEFT JOIN "user" u ON n.user_id = u.id
		 ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / limit));

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT n.id, n.user_id, n.title, n.description, n.category, n.icon_type, n.action_label, n.action_url, n.read, n.read_at, n.created_at,
		        u.name AS user_name, u.email AS user_email
		 FROM notifications n
		 LEFT JOIN "user" u ON n.user_id = u.id
		 ${whereClause}
		 ORDER BY n.created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		notifications: rows,
		total,
		page,
		limit,
		totalPages,
	};
}

export async function deleteNotificationAdmin(notificationId: string): Promise<boolean> {
	await ensureIndexes();
	const { rowCount } = await getPool().query(
		`DELETE FROM notifications WHERE id = $1`,
		[notificationId],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function getUserNotificationPreferences(
	userId: string,
): Promise<UserNotificationPreferences> {
	await ensureIndexes();
	const pool = getPool();
	const { rows } = await pool.query(
		`SELECT user_id, security_emails, streak_reminders, leaderboard_alerts, reward_alerts, marketing_emails, in_app_streaks, in_app_rewards, in_app_leaderboard, in_app_system, updated_at
		 FROM user_notification_preferences
		 WHERE user_id = $1
		 LIMIT 1`,
		[userId],
	);

	if (rows[0]) {
		return rows[0];
	}

	const defaultPrefs: UserNotificationPreferences = {
		user_id: userId,
		security_emails: true,
		streak_reminders: true,
		leaderboard_alerts: true,
		reward_alerts: true,
		marketing_emails: false,
		in_app_streaks: true,
		in_app_rewards: true,
		in_app_leaderboard: true,
		in_app_system: true,
		updated_at: new Date().toISOString(),
	};

	await pool.query(
		`INSERT INTO user_notification_preferences (user_id, security_emails, streak_reminders, leaderboard_alerts, reward_alerts, marketing_emails, in_app_streaks, in_app_rewards, in_app_leaderboard, in_app_system, updated_at)
		 VALUES ($1, true, true, true, true, false, true, true, true, true, NOW())
		 ON CONFLICT (user_id) DO NOTHING`,
		[userId],
	);

	return defaultPrefs;
}

export async function upsertUserNotificationPreferences(
	userId: string,
	prefs: Partial<UserNotificationPreferences>,
): Promise<UserNotificationPreferences> {
	await ensureIndexes();
	const current = await getUserNotificationPreferences(userId);
	const updated: UserNotificationPreferences = {
		...current,
		...prefs,
		user_id: userId,
		updated_at: new Date().toISOString(),
	};

	const { rows } = await getPool().query(
		`INSERT INTO user_notification_preferences (
			user_id, security_emails, streak_reminders, leaderboard_alerts, reward_alerts, marketing_emails,
			in_app_streaks, in_app_rewards, in_app_leaderboard, in_app_system, updated_at
		 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
		 ON CONFLICT (user_id) DO UPDATE SET
			security_emails = EXCLUDED.security_emails,
			streak_reminders = EXCLUDED.streak_reminders,
			leaderboard_alerts = EXCLUDED.leaderboard_alerts,
			reward_alerts = EXCLUDED.reward_alerts,
			marketing_emails = EXCLUDED.marketing_emails,
			in_app_streaks = EXCLUDED.in_app_streaks,
			in_app_rewards = EXCLUDED.in_app_rewards,
			in_app_leaderboard = EXCLUDED.in_app_leaderboard,
			in_app_system = EXCLUDED.in_app_system,
			updated_at = NOW()
		 RETURNING *`,
		[
			userId,
			updated.security_emails,
			updated.streak_reminders,
			updated.leaderboard_alerts,
			updated.reward_alerts,
			updated.marketing_emails,
			updated.in_app_streaks,
			updated.in_app_rewards,
			updated.in_app_leaderboard,
			updated.in_app_system,
		],
	);

	return rows[0];
}

export async function insertEmailLog(entry: {
	recipient_email: string;
	user_id?: string | null;
	template: string;
	subject: string;
	status: string;
	provider: string;
	message_id?: string | null;
	error?: string | null;
	metadata?: Record<string, unknown> | null;
}): Promise<DbEmailLog> {
	await ensureIndexes();
	const { rows } = await getPool().query(
		`INSERT INTO email_logs (recipient_email, user_id, template, subject, status, provider, message_id, error, metadata, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
		 RETURNING *`,
		[
			entry.recipient_email.toLowerCase().trim(),
			entry.user_id ?? null,
			entry.template,
			entry.subject,
			entry.status,
			entry.provider,
			entry.message_id ?? null,
			entry.error ?? null,
			entry.metadata ? JSON.stringify(entry.metadata) : null,
		],
	);
	return rows[0];
}

export async function getEmailLogs(options?: {
	page?: number;
	limit?: number;
	status?: string;
	template?: string;
	search?: string;
}): Promise<{
	logs: DbEmailLog[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}> {
	await ensureIndexes();
	const pool = getPool();
	const page = Math.max(1, options?.page ?? 1);
	const limit = Math.max(1, Math.min(100, options?.limit ?? 25));
	const offset = (page - 1) * limit;

	const conditions: string[] = [];
	const params: unknown[] = [];

	if (options?.status && options.status !== 'all') {
		params.push(options.status);
		conditions.push(`status = $${params.length}`);
	}

	if (options?.template && options.template !== 'all') {
		params.push(options.template);
		conditions.push(`template = $${params.length}`);
	}

	if (options?.search) {
		params.push(`%${options.search.trim().toLowerCase()}%`);
		const pIdx = params.length;
		conditions.push(
			`(LOWER(recipient_email) LIKE $${pIdx} OR LOWER(subject) LIKE $${pIdx} OR LOWER(COALESCE(message_id, '')) LIKE $${pIdx})`,
		);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total FROM email_logs ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / limit));

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT id, recipient_email, user_id, template, subject, status, provider, message_id, error, metadata, created_at
		 FROM email_logs
		 ${whereClause}
		 ORDER BY created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		logs: rows,
		total,
		page,
		limit,
		totalPages,
	};
}

export async function getEmailLogById(id: string): Promise<DbEmailLog | null> {
	await ensureIndexes();
	const { rows } = await getPool().query(
		`SELECT id, recipient_email, user_id, template, subject, status, provider, message_id, error, metadata, created_at
		 FROM email_logs
		 WHERE id = $1
		 LIMIT 1`,
		[id],
	);
	return rows[0] ?? null;
}

export async function getEmailStats(): Promise<{
	totalSent: number;
	sentToday: number;
	successRate: number;
	activeProvider: string;
	suppressedCount: number;
	totalFailed: number;
}> {
	await ensureIndexes();
	const pool = getPool();

	const totalsRes = await pool.query(
		`SELECT 
			COUNT(*)::int AS total,
			COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END)::int AS today,
			COUNT(CASE WHEN status IN ('sent', 'dev_logged') THEN 1 END)::int AS successful,
			COUNT(CASE WHEN status = 'failed' THEN 1 END)::int AS failed
		 FROM email_logs`,
	);

	const suppRes = await pool.query(`SELECT COUNT(*)::int AS count FROM email_suppressions`);
	const suppressedCount = Number(suppRes.rows[0]?.count ?? 0);

	const row = totalsRes.rows[0] ?? {};
	const total = Number(row.total ?? 0);
	const successful = Number(row.successful ?? 0);
	const failed = Number(row.failed ?? 0);
	const today = Number(row.today ?? 0);
	const successRate = total > 0 ? Math.round((successful / total) * 100) : 100;

	let activeProvider = 'Mock (Development)';
	if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
		activeProvider = 'SMTP (Nodemailer)';
	}

	return {
		totalSent: total,
		sentToday: today,
		successRate,
		activeProvider,
		suppressedCount,
		totalFailed: failed,
	};
}

export async function isEmailSuppressed(
	email: string,
	category?: string,
): Promise<boolean> {
	await ensureIndexes();
	const normalized = email.toLowerCase().trim();
	const pool = getPool();

	const { rows } = await pool.query(
		`SELECT reason, category FROM email_suppressions WHERE email = $1 LIMIT 1`,
		[normalized],
	);

	if (rows.length === 0) return false;
	const entry = rows[0];
	if (entry.category === 'all') return true;
	if (category && entry.category === category) return true;
	return false;
}

export async function addEmailSuppression(
	email: string,
	reason?: string,
	category?: string,
): Promise<void> {
	await ensureIndexes();
	const normalized = email.toLowerCase().trim();
	await getPool().query(
		`INSERT INTO email_suppressions (email, reason, category, created_at)
		 VALUES ($1, $2, $3, NOW())
		 ON CONFLICT (email) DO UPDATE SET
			reason = EXCLUDED.reason,
			category = EXCLUDED.category,
			created_at = NOW()`,
		[normalized, reason ?? 'unsubscribe', category ?? 'all'],
	);
}

export async function removeEmailSuppression(email: string): Promise<boolean> {
	await ensureIndexes();
	const normalized = email.toLowerCase().trim();
	const { rowCount } = await getPool().query(
		`DELETE FROM email_suppressions WHERE email = $1`,
		[normalized],
	);
	return Boolean(rowCount && rowCount > 0);
}

export async function listEmailSuppressions(options?: {
	page?: number;
	limit?: number;
	search?: string;
}): Promise<{
	suppressions: DbEmailSuppression[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}> {
	await ensureIndexes();
	const pool = getPool();
	const page = Math.max(1, options?.page ?? 1);
	const limit = Math.max(1, Math.min(100, options?.limit ?? 25));
	const offset = (page - 1) * limit;

	const conditions: string[] = [];
	const params: unknown[] = [];

	if (options?.search) {
		params.push(`%${options.search.trim().toLowerCase()}%`);
		conditions.push(`(LOWER(email) LIKE $1 OR LOWER(reason) LIKE $1)`);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	const countRes = await pool.query(
		`SELECT COUNT(*)::int AS total FROM email_suppressions ${whereClause}`,
		params,
	);
	const total = Number(countRes.rows[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / limit));

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const { rows } = await pool.query(
		`SELECT email, reason, category, created_at
		 FROM email_suppressions
		 ${whereClause}
		 ORDER BY created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return {
		suppressions: rows,
		total,
		page,
		limit,
		totalPages,
	};
}

export interface SitemapProfileItem {
	username: string;
	updatedAt?: string | Date;
}

export async function getPublicProfilesForSitemap(
	limit = 500,
): Promise<SitemapProfileItem[]> {
	try {
		const pool = getPool();
		const { rows } = await pool.query(
			`SELECT name, COALESCE("updatedAt", created_at, NOW()) as updated_at
			 FROM "user"
			 WHERE name IS NOT NULL AND TRIM(name) != ''
			 ORDER BY updated_at DESC
			 LIMIT $1`,
			[Math.max(1, Math.min(limit, 5000))],
		);

		const seen = new Set<string>();
		const result: SitemapProfileItem[] = [];

		for (const row of rows) {
			const slug = (row.name as string).trim().toLowerCase().replace(/\s+/g, '-');
			if (!slug || seen.has(slug)) continue;
			seen.add(slug);
			result.push({
				username: slug,
				updatedAt: row.updated_at,
			});
		}

		return result;
	} catch {
		return [];
	}
}
