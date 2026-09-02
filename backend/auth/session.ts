import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { getPool } from "../db/client";

export interface ServerUser {
	id: string;
	email: string;
	name?: string | null;
	role?: string | null;
	banned?: boolean | null;
}

export async function getServerUser(
	h?: Headers,
): Promise<ServerUser | null> {
	const reqHeaders = h ?? (await headers());
	const pool = getPool();

	try {
		const session = await auth.api.getSession({ headers: reqHeaders });
		if (session?.user?.id) {
			const { rows } = await pool.query(
				`SELECT id, email, name, role, banned FROM "user" WHERE id = $1 LIMIT 1`,
				[session.user.id]
			);
			if (rows[0]) {
				return {
					id: rows[0].id,
					email: rows[0].email,
					name: rows[0].name,
					role: rows[0].role || 'user',
					banned: Boolean(rows[0].banned),
				};
			}

			return {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: (session.user as any).role || 'user',
				banned: (session.user as any).banned || false,
			};
		}
	} catch {}

	try {
		const cookieHeader = reqHeaders.get("cookie") || "";
		const match = cookieHeader.match(
			/(?:better-auth\.session_token|__Secure-better-auth\.session_token)=([^;]+)/
		);
		const rawToken = match
			? decodeURIComponent(match[1].trim())
			: reqHeaders.get("authorization")?.replace(/^Bearer\s+/i, "").trim();

		if (rawToken) {
			const tokens = [rawToken];
			if (rawToken.startsWith("s:")) {
				tokens.push(rawToken.slice(2));
			}
			if (rawToken.includes(".")) {
				tokens.push(rawToken.split(".")[0]);
			}

			const { rows } = await pool.query(
				`SELECT u.id, u.email, u.name, u.role, u.banned
				 FROM "session" s
				 JOIN "user" u ON s."userId" = u.id
				 WHERE s.token = ANY($1::text[]) AND s."expiresAt" > NOW()
				 LIMIT 1`,
				[tokens]
			);
			if (rows[0]) {
				return {
					id: rows[0].id,
					email: rows[0].email,
					name: rows[0].name,
					role: rows[0].role || 'user',
					banned: Boolean(rows[0].banned),
				};
			}

			const fallback = await pool.query(
				`SELECT u.id, u.email, u.name, u.role, u.banned
				 FROM "sessions" s
				 JOIN "user" u ON s.user_id = u.id
				 WHERE s.token = ANY($1::text[]) AND s.expires_at > NOW()
				 LIMIT 1`,
				[tokens]
			);
			if (fallback.rows[0]) {
				return {
					id: fallback.rows[0].id,
					email: fallback.rows[0].email,
					name: fallback.rows[0].name,
					role: fallback.rows[0].role || 'user',
					banned: Boolean(fallback.rows[0].banned),
				};
			}
		}
	} catch {}

	return null;
}

export function isUserAdmin(user: { email: string; role?: string | null } | null): boolean {
	if (!user) return false;
	if (user.role === 'admin') return true;
	const adminEmails = (process.env.ADMIN_EMAILS || 'ronisarkar10938@gmail.com')
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
	return adminEmails.includes(user.email.toLowerCase());
}

export async function requireServerUser(): Promise<
	| {
			user: ServerUser;
			error: null;
	  }
	| { user: null; error: NextResponse }
> {
	const user = await getServerUser();
	if (!user) {
		return {
			user: null,
			error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}
	return { user, error: null as never };
}

export async function requireServerAdmin(): Promise<
	| {
			user: ServerUser & { role: 'admin' };
			error: null;
	  }
	| { user: null; error: NextResponse }
> {
	const user = await getServerUser();
	if (!user) {
		return {
			user: null,
			error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	if (!isUserAdmin(user)) {
		return {
			user: null,
			error: NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 }),
		};
	}

	return {
		user: { ...user, role: 'admin' },
		error: null as never,
	};
}
