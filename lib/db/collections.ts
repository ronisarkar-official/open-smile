import { getDb } from "./client";
import type { Document } from "mongodb";

/**
 * ── Typed Collection Accessors ───────────────────────────
 *
 * Centralises collection-name strings so they are defined in
 * one place and discoverable via auto-complete.
 *
 * @example
 * ```ts
 * import { usersCollection } from "@/lib/db";
 * const user = await usersCollection().findOne({ email });
 * ```
 */

/* ── Better Auth core collections ── */
export function usersCollection() {
	return getDb().collection("user");
}

export function sessionsCollection() {
	return getDb().collection("session");
}

export function accountsCollection() {
	return getDb().collection("account");
}

export function verificationsCollection() {
	return getDb().collection("verification");
}

/* ── Better Auth plugin collections ── */
export function twoFactorsCollection() {
	return getDb().collection("twoFactors");
}

export function organizationsCollection() {
	return getDb().collection("organizations");
}

export function membersCollection() {
	return getDb().collection("members");
}

export function invitationsCollection() {
	return getDb().collection("invitations");
}

/* ── Beta waitlist ── */

export interface BetaWaitlistDoc extends Document {
	/** Normalized (lowercased, trimmed) email — unique per signup */
	email: string;
	createdAt: Date;
}

export function betaWaitlistCollection() {
	return getDb().collection<BetaWaitlistDoc>("betaWaitlist");
}

/* ── OTP codes (email verification / login OTP) ── */

export interface OtpCodeDoc extends Document {
	/** Normalized (lowercased, trimmed) email — unique per user */
	email: string;
	/** SHA-256 of the OTP. Plaintext OTP is never persisted. */
	otpHash: string;
	/** Failed verification attempts for the current code */
	attempts: number;
	createdAt: Date;
	/** TTL index — the record is auto-deleted once expired */
	expiresAt: Date;
}

export function otpCodesCollection() {
	return getDb().collection<OtpCodeDoc>("otpCodes");
}

/* ── Rate limiting (DB-backed, TTL-aware) ── */

export interface RateLimitDoc extends Document {
	/** Semantic key, e.g. `otp-send:email:user@x.com` */
	_id: string;
	count: number;
	windowStart: number;
	/** TTL index — the record is auto-deleted once the window passes */
	expiresAt: Date;
}

export function rateLimitsCollection() {
	return getDb().collection<RateLimitDoc>("rateLimits");
}
