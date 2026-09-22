import { betterAuth } from "better-auth";
import { getPool } from "../db/client";
import { sendWelcomeEmail, sendResetPasswordEmail } from "../mailer";
import {
	twoFactor,
	organization,
	admin,
	bearer,
	multiSession,
	openAPI,
} from "better-auth/plugins";

const effectiveBaseUrl =
	process.env.BETTER_AUTH_URL ||
	(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

if (process.env.NODE_ENV === "production") {
	if (!process.env.DATABASE_URL) {
		throw new Error(
			"DATABASE_URL is required in production. Add it to your environment before deploying."
		);
	}
	if (!process.env.BETTER_AUTH_SECRET) {
		throw new Error(
			"BETTER_AUTH_SECRET is required in production. Sessions would be insecure without a signing secret."
		);
	}
	if (!effectiveBaseUrl) {
		throw new Error(
			"BETTER_AUTH_URL or VERCEL_URL is required in production. Set BETTER_AUTH_URL to your deployed origin (e.g. https://app.example.com)."
		);
	}
}

function extractRefCodeFromContext(context: any): string | null {
	if (!context) return null;
	if (typeof context.getCookie === "function") {
		const val = context.getCookie("ref_code");
		if (val) return String(val).trim().toUpperCase();
	}
	const headers = context.headers || context.context?.headers || context.request?.headers;
	if (headers) {
		let cookieHeader = "";
		if (typeof headers.get === "function") {
			cookieHeader = headers.get("cookie") || "";
		} else if (typeof headers.cookie === "string") {
			cookieHeader = headers.cookie;
		}
		if (cookieHeader) {
			const match = cookieHeader.match(/ref_code=([^;]+)/i);
			if (match?.[1]) {
				return decodeURIComponent(match[1]).trim().toUpperCase();
			}
		}
	}
	return null;
}

async function getReferralCode(context?: any): Promise<string | null> {
	const fromCtx = extractRefCodeFromContext(context);
	if (fromCtx) return fromCtx;

	try {
		const { cookies } = await import("next/headers");
		const cookieStore = await cookies();
		const val = cookieStore.get("ref_code")?.value;
		if (val) return decodeURIComponent(val).trim().toUpperCase();
	} catch {}

	return null;
}

export const auth = betterAuth({
	database: process.env.DATABASE_URL
		? getPool()
		: (undefined as never),
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: effectiveBaseUrl,
	trustedOrigins: [
		process.env.BETTER_AUTH_URL,
		process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
		process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
		"https://*.vercel.app",
	].filter(Boolean) as string[],

	user: {
		deleteUser: {
			enabled: true,
		},
		changeEmail: {
			enabled: true,
		},
	},

	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github"],
			requireLocalEmailVerified: true,
		},
	},

	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 8,
		sendResetPassword: async ({ user, token }) => {
			const base = (effectiveBaseUrl || "").replace(/\/+$/, "");
			if (!base) return;
			const resetUrl =
				`${base}/reset-password` +
				`?token=${encodeURIComponent(token)}` +
				`&email=${encodeURIComponent(user.email)}`;
			try {
				await sendResetPasswordEmail(user.email, resetUrl);
			} catch (err) {
				console.error("[auth] Reset-password email failed:", err);
			}
		},
		revokeSessionsOnPasswordReset: true,
	},

	logger: {
		disabled: false,
		verbose: process.env.NODE_ENV === "development",
	},

	socialProviders: {
		github: {
			clientId: process.env.AUTH_GITHUB_ID || process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || "",
			mapProfileToUser: (profile) => ({
				name: profile.name || profile.login || profile.email?.split("@")[0] || "User",
				email: profile.email,
				image: profile.avatar_url,
			}),
		},
		google: {
			clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
			mapProfileToUser: (profile) => ({
				name: profile.name || profile.email?.split("@")[0] || "User",
				email: profile.email,
				image: profile.picture,
			}),
		},
	},

	session: {
		expiresIn: 60 * 60 * 24 * 30,
		updateAge: 60 * 60 * 24,
		cookieCache: {
			enabled: true,
			maxAge: 60,
		},
	},

	advanced: {
		useSecureCookies: process.env.NODE_ENV === "production",
	},

	databaseHooks: {
		user: {
			create: {
				before: async (user: any, context?: any) => {
					let referredBy: string | null = null;
					try {
						const refCode = await getReferralCode(context);
						if (refCode) {
							const { findUserByReferralCode } = await import("../db/referral-queries");
							const referrer = await findUserByReferralCode(refCode);
							if (referrer && referrer.id !== user.id) {
								referredBy = referrer.id;
							}
						}
					} catch (e) {
						console.error("[auth] Error resolving referral in user.create.before:", e);
					}

					const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
					const fallbackPrefix = (user.id || user.email || "SMILE").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
					const userReferralCode = `SMILE-${fallbackPrefix}${randomSuffix}`;

					return {
						data: {
							...user,
							name: user.name || user.email?.split("@")[0] || "User",
							image: user.image || "/icons/default-icon.webp",
							referral_code: user.referral_code || userReferralCode,
							referred_by: referredBy || user.referred_by || null,
						},
					};
				},
				after: async (user: any, context?: any) => {
					void sendWelcomeEmail(user.email, user.name ?? "").catch((err) => {
						console.error("[auth] Welcome email failed:", err);
					});

					try {
						const refCode = await getReferralCode(context);
						if (user?.id) {
							const { createPendingReferral } = await import("../db/referral-queries");
							if (refCode) {
								await createPendingReferral({
									referrerCode: refCode,
									newUserId: user.id,
								});
							} else if (user.referred_by) {
								await createPendingReferral({
									referrerId: user.referred_by,
									newUserId: user.id,
								});
							}
						}
					} catch (refErr) {
						console.error("[auth] Failed to link referral in user.create.after:", refErr);
					}
				},
			},
		},
	},

	plugins: [
		twoFactor(),
		organization(),
		admin(),
		bearer(),
		multiSession(),
		openAPI(),
	],
});
