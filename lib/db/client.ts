import { MongoClient, Db } from "mongodb";

/**
 * ── MongoDB Client Singleton ─────────────────────────────
 *
 * Provides a lazily-initialised, singleton MongoClient.
 *
 * In **development** the client is cached on `globalThis` so
 * Next.js hot-module-reloads don't leak connections.
 *
 * In **production** a simple module-level variable is used.
 *
 * @example
 * ```ts
 * import { getDb } from "@/lib/db";
 * const users = await getDb().collection("users").find().toArray();
 * ```
 */

const MONGODB_URI = process.env.MONGODB_DIRECT_URI;

/* ---------- dev-safe global cache key ---------- */
const globalForMongo = globalThis as typeof globalThis & {
	_mongoClient?: MongoClient;
};

let _client: MongoClient | null = null;

/**
 * Return the singleton `MongoClient`.
 * Creates & connects it on first call.
 */
export function getMongoClient(): MongoClient {
	if (process.env.NODE_ENV === "development" && globalForMongo._mongoClient) {
		return globalForMongo._mongoClient;
	}

	if (_client) return _client;

	if (!MONGODB_URI) {
		throw new Error(
			"MONGODB_DIRECT_URI is not set. " +
				"Please add it to your .env.local file.\n" +
				"Example: mongodb+srv://user:pass@cluster.mongodb.net/dbname"
		);
	}

	_client = new MongoClient(MONGODB_URI);

	if (process.env.NODE_ENV === "development") {
		globalForMongo._mongoClient = _client;
	}

	return _client;
}

/**
 * Shorthand — return the default `Db` instance (or a named one).
 *
 * @param name  Optional database name. When omitted the DB name
 *              from the connection string is used.
 */
export function getDb(name?: string): Db {
	return getMongoClient().db(name);
}

/* ── Startup connection test (runs once on first import) ── */
(async () => {
	if (MONGODB_URI) {
		try {
			const client = getMongoClient();
			await client.connect();
			await client.db().admin().ping();
			console.log("✓ MongoDB connected successfully");
		} catch (err) {
			console.error("✗ MongoDB connection failed:", err);
		}
	}
})();
