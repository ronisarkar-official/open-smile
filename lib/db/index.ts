/**
 * ── Database Module ──────────────────────────────────────
 *
 * Single import path for all MongoDB utilities:
 *
 * ```ts
 * import { getDb, getMongoClient, usersCollection } from "@/lib/db";
 * ```
 */

export { getMongoClient, getDb } from "./client";
export * from "./collections";
export { ensureIndexes } from "./indexes";
