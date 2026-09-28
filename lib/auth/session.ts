import crypto from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { getPool } from "../db/client";

export function signSessionToken(token: string): string {
	const secret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "";
	const signature = crypto
		.createHmac("sha256", secret)
		.update(token)
		.digest("base64");
	return `${token}.${signature}`;
}

export function getSessionCookieName(): string {
	const isSecure = process.env.NODE_ENV === "production";
	const prefix = isSecure ? "__Secure-" : "";
	return `${prefix}better-auth.session_token`;
}

export function setSessionCookie(
	response: NextResponse,
	token: string,
	expiresAt: Date
) {
	const cookieName = getSessionCookieName();
	const signedToken = signSessionToken(token);
	const isSecure = process.env.NODE_ENV === "production";

	response.cookies.set(cookieName, signedToken, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		secure: isSecure,
		expires: expiresAt,
	});

	if (isSecure && cookieName !== "better-auth.session_token") {
		response.cookies.set("better-auth.session_token", signedToken, {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			secure: true,
			expires: expiresAt,
		});
	}
}

export interface ServerUser {
	id: string;
	email: string;
	name?: string | null;
	role?: string | null;
	banned?: boolean | null;
	banReason?: string | null;
	banExpires?: Date | null;
	image?: string | null;
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
				`SELECT id, email, name, role, banned, "banReason", "banExpires", COALESCE(image, '/icons/default-icon.webp') AS image FROM "user" WHERE id = $1 LIMIT 1`,
				[session.user.id]
			);
			if (rows[0]) {
				const isBanned = Boolean(rows[0].banned);
				const banExpires = rows[0].banExpires ? new Date(rows[0].banExpires) : null;
				const isExpired = isBanned && banExpires !== null && banExpires.getTime() <= Date.now();
				const effectiveBanned = isBanned && !isExpired;

				return {
					id: rows[0].id,
					email: rows[0].email,
					name: rows[0].name,
					role: rows[0].role || 'user',
					banned: effectiveBanned,
					banReason: effectiveBanned ? (rows[0].banReason as string | null) : null,
					banExpires: effectiveBanned ? banExpires : null,
					image: rows[0].image,
				};
			}

			const isBanned = Boolean((session.user as any).banned);
			const banExpires = (session.user as any).banExpires ? new Date((session.user as any).banExpires) : null;
			const isExpired = isBanned && banExpires !== null && banExpires.getTime() <= Date.now();
			const effectiveBanned = isBanned && !isExpired;

			return {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: (session.user as any).role || 'user',
				banned: effectiveBanned,
				banReason: effectiveBanned ? ((session.user as any).banReason || null) : null,
				banExpires: effectiveBanned ? banExpires : null,
				image: (session.user as any).image || '/icons/default-icon.webp',
			};
		}
	} catch (err) {
		console.error("[auth] Primary session check failed:", err);
	}

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
				`SELECT u.id, u.email, u.name, u.role, u.banned, u."banReason", u."banExpires", COALESCE(u.image, '/icons/default-icon.webp') AS image
				 FROM "session" s
				 JOIN "user" u ON s."userId" = u.id
				 WHERE s.token = ANY($1::text[]) AND s."expiresAt" > NOW()
				 LIMIT 1`,
				[tokens]
			);
			if (rows[0]) {
				const isBanned = Boolean(rows[0].banned);
				const banExpires = rows[0].banExpires ? new Date(rows[0].banExpires) : null;
				const isExpired = isBanned && banExpires !== null && banExpires.getTime() <= Date.now();
				const effectiveBanned = isBanned && !isExpired;

				return {
					id: rows[0].id,
					email: rows[0].email,
					name: rows[0].name,
					role: rows[0].role || 'user',
					banned: effectiveBanned,
					banReason: effectiveBanned ? (rows[0].banReason as string | null) : null,
					banExpires: effectiveBanned ? banExpires : null,
					image: rows[0].image,
				};
			}

			const fallback = await pool.query(
				`SELECT u.id, u.email, u.name, u.role, u.banned, u."banReason", u."banExpires", COALESCE(u.image, '/icons/default-icon.webp') AS image
				 FROM "sessions" s
				 JOIN "user" u ON s.user_id = u.id
				 WHERE s.token = ANY($1::text[]) AND s.expires_at > NOW()
				 LIMIT 1`,
				[tokens]
			);
			if (fallback.rows[0]) {
				const isBanned = Boolean(fallback.rows[0].banned);
				const banExpires = fallback.rows[0].banExpires ? new Date(fallback.rows[0].banExpires) : null;
				const isExpired = isBanned && banExpires !== null && banExpires.getTime() <= Date.now();
				const effectiveBanned = isBanned && !isExpired;

				return {
					id: fallback.rows[0].id,
					email: fallback.rows[0].email,
					name: fallback.rows[0].name,
					role: fallback.rows[0].role || 'user',
					banned: effectiveBanned,
					banReason: effectiveBanned ? (fallback.rows[0].banReason as string | null) : null,
					banExpires: effectiveBanned ? banExpires : null,
					image: fallback.rows[0].image,
				};
			}
		}
	} catch (err) {
		console.error("[auth] Fallback session check failed:", err);
	}

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
	if (user.banned) {
		return {
			user: null,
			error: NextResponse.json(
				{
					error: "Account suspended",
					banned: true,
					banReason: user.banReason || "Violating platform guidelines",
					banExpires: user.banExpires || null,
				},
				{ status: 403 }
			),
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

	if (user.banned) {
		return {
			user: null,
			error: NextResponse.json(
				{
					error: "Account suspended",
					banned: true,
				},
				{ status: 403 }
			),
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
