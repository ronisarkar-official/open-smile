import { Pool } from "pg";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * ── PostgreSQL Pool Singleton ─────────────────────────────
 *
 * Provides a lazily-initialised, singleton pg Pool.
 *
 * In **development** the pool is cached on `globalThis` so
 * Next.js hot-module-reloads don't leak connections.
 *
 * In **production** a simple module-level variable is used.
 *
 * @example
 * ```ts
 * import { getPool } from "@/lib/db";
 * const { rows } = await getPool().query("SELECT * FROM \"user\" LIMIT 1");
 * ```
 */

const DATABASE_URL = process.env.DATABASE_URL;

/* ---------- dev-safe global cache key ---------- */
const globalForPg = globalThis as typeof globalThis & {
	_pgPool?: Pool;
	_supabase?: SupabaseClient;
};

let _pool: Pool | null = null;

/**
 * Return the singleton `Pool`.
 * Creates it on first call.
 */
export function getPool(): Pool {
	if (process.env.NODE_ENV === "development" && globalForPg._pgPool) {
		return globalForPg._pgPool;
	}

	if (_pool) return _pool;

	if (!DATABASE_URL) {
		throw new Error(
			"DATABASE_URL is not set. " +
				"Please add it to your .env.local file.\n" +
				"Example: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
		);
	}

	_pool = new Pool({ connectionString: DATABASE_URL });

	if (process.env.NODE_ENV === "development") {
		globalForPg._pgPool = _pool;
	}

	return _pool;
}

/**
 * Return the singleton Supabase client (service-role, server-side only).
 */
export function getSupabase(): SupabaseClient {
	if (process.env.NODE_ENV === "development" && globalForPg._supabase) {
		return globalForPg._supabase;
	}

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url || !key) {
		throw new Error(
			"NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set. " +
				"Please add them to your .env.local file."
		);
	}

	const client = createClient(url, key, {
		auth: { persistSession: false, autoRefreshToken: false },
	});

	if (process.env.NODE_ENV === "development") {
		globalForPg._supabase = client;
	}

	return client;
}

/* ── Startup connection test (runs once on first import) ── */
(async () => {
	if (DATABASE_URL) {
		try {
			const pool = getPool();
			await pool.query("SELECT 1");
			console.log("✓ PostgreSQL connected successfully");
		} catch (err) {
			console.error("✗ PostgreSQL connection failed:", err);
		}
	}
})();
