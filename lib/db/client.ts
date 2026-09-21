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

	const dbUrl = process.env.DATABASE_URL || DATABASE_URL;
	if (!dbUrl) {
		throw new Error(
			"DATABASE_URL is not set. " +
				"Please add it to your .env.local file.\n" +
				"Example: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
		);
	}

	const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

	_pool = new Pool({
		connectionString: dbUrl,
		ssl: { rejectUnauthorized: false },
		max: isServerless ? 3 : 10,
		idleTimeoutMillis: 10000,
		connectionTimeoutMillis: 15000,
		keepAlive: true,
		keepAliveInitialDelayMillis: 5000,
	});

	_pool.on("error", (err) => {
		console.warn("[pg-pool] Idle client disconnected:", err.message);
	});

	const originalQuery = _pool.query.bind(_pool);
	_pool.query = (async (...args: any[]) => {
		try {
			return await (originalQuery as any)(...args);
		} catch (err: any) {
			const isConnError =
				err &&
				(err.code === "ECONNRESET" ||
					err.code === "EPIPE" ||
					err.code === "ECONNREFUSED" ||
					err.code === "ETIMEDOUT" ||
					err.message?.includes("ECONNRESET") ||
					err.message?.includes("Connection terminated unexpectedly") ||
					err.message?.includes("connection closed"));

			if (isConnError) {
				return await (originalQuery as any)(...args);
			}
			throw err;
		}
	}) as typeof _pool.query;

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

