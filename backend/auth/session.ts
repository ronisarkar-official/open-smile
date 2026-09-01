import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { getPool } from "../db/client";

export async function getServerUser(
	h?: Headers,
): Promise<{
	id: string;
	email: string;
	name?: string | null;
} | null> {
	const reqHeaders = h ?? (await headers());
	try {
		const session = await auth.api.getSession({ headers: reqHeaders });
		if (session?.user?.id) {
			return session.user as {
				id: string;
				email: string;
				name?: string | null;
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

			const pool = getPool();
			const { rows } = await pool.query(
				`SELECT u.id, u.email, u.name
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
				};
			}

			const fallback = await pool.query(
				`SELECT u.id, u.email, u.name
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
				};
			}
		}
	} catch {}

	return null;
}

export async function requireServerUser(): Promise<
	| {
			user: { id: string; email: string; name?: string | null };
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
