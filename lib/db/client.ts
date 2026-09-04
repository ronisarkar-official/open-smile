import { Pool } from "pg";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DATABASE_URL = process.env.DATABASE_URL;

const globalForPg = globalThis as typeof globalThis & {
	_pgPool?: Pool;
	_supabase?: SupabaseClient;
};

let _pool: Pool | null = null;

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

	_pool = new Pool({
		connectionString: DATABASE_URL,
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 8000,
	});

	if (process.env.NODE_ENV === "development") {
		globalForPg._pgPool = _pool;
	}

	return _pool;
}

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
