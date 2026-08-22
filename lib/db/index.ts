/**
 * ── Database Module ──────────────────────────────────────
 *
 * Single import path for all PostgreSQL utilities:
 *
 * ```ts
 * import { getPool, findUserByEmail } from "@/lib/db";
 * ```
 */

export { getPool, getSupabase } from "./client";
export * from "./collections";
export { ensureIndexes } from "./indexes";
