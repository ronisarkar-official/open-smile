import crypto from 'crypto';
import { getPool } from './client';

function generateSessionToken(): string {
	return crypto.randomBytes(32).toString('base64url');
}

function generateId(): string {
	return crypto.randomUUID().replace(/-/g, '');
}

export async function createSessionForUser(
	userId: string,
	req?: { headers?: { get?: (name: string) => string | null } },
): Promise<{ id: string; token: string; expiresAt: Date }> {
	const id = generateId();
	const token = generateSessionToken();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
	const ipAddress =
		req?.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() || '';
	const userAgent = req?.headers?.get?.('user-agent') || '';

	await getPool().query(
		`INSERT INTO "session" (id, token, "expiresAt", "userId", "ipAddress", "userAgent", "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
		[id, token, expiresAt, userId, ipAddress, userAgent],
	);

	return { id, token, expiresAt };
}

export async function createUserWithAccount(params: {
	name: string;
	email: string;
	passwordHash: string;
	image?: string;
}): Promise<{ id: string; name: string; email: string }> {
	const pool = getPool();
	const userId = generateId();
	const accountId = generateId();

	await pool.query(
		`INSERT INTO "user" (id, name, email, image, "emailVerified", "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
		[
			userId,
			params.name,
			params.email,
			params.image || '/icons/default-icon.webp',
		],
	);

	await pool.query(
		`INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, 'credential', $4, NOW(), NOW())`,
		[accountId, userId, userId, params.passwordHash],
	);

	return { id: userId, name: params.name, email: params.email };
}

export async function findUserByEmail(email: string) {
	const { rows } = await getPool().query(
		'SELECT * FROM "user" WHERE LOWER(email) = LOWER($1) LIMIT 1',
		[email],
	);
	return rows[0] ?? null;
}

export async function findUserWithPasswordByEmail(email: string) {
	const { rows } = await getPool().query(
		`SELECT 
			u.*,
			COALESCE(a.password, u.password_hash) AS password_hash
		 FROM "user" u
		 LEFT JOIN "account" a 
		   ON a."userId" = u.id 
		   AND (a."providerId" = 'credential' OR a."providerId" = 'email')
		 WHERE LOWER(u.email) = LOWER($1)
		 LIMIT 1`,
		[email],
	);
	return rows[0] ?? null;
}

export async function updateUserEmailVerified(email: string) {
	await getPool().query(
		'UPDATE "user" SET "emailVerified" = true WHERE LOWER(email) = LOWER($1)',
		[email],
	);
}

export async function getUserTwoFactorStatus(userId: string): Promise<boolean> {
	const { rows } = await getPool().query(
		'SELECT "twoFactorEnabled" FROM "user" WHERE id = $1 LIMIT 1',
		[userId],
	);
	return Boolean(rows[0]?.twoFactorEnabled);
}

export async function updateUserTwoFactorStatus(
	userId: string,
	enabled: boolean,
): Promise<boolean> {
	const { rows } = await getPool().query(
		'UPDATE "user" SET "twoFactorEnabled" = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING "twoFactorEnabled"',
		[enabled, userId],
	);
	return Boolean(rows[0]?.twoFactorEnabled);
}

