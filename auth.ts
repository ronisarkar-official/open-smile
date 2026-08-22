import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendWelcomeEmail, sendResetPasswordEmail } from "@/lib/mailer";
import {
	twoFactor,
	organization,
	admin,
	bearer,
	multiSession,
	openAPI,
} from "better-auth/plugins";

// Fail fast in production: auth silently shipping without a database
// or signing secret is a security hazard.
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
	if (!process.env.BETTER_AUTH_URL) {
		throw new Error(
			"BETTER_AUTH_URL is required in production. Set it to your deployed origin (e.g. https://app.example.com)."
		);
	}
}

export const auth = betterAuth({
	database: process.env.DATABASE_URL
		? new Pool({ connectionString: process.env.DATABASE_URL })
		: (undefined as never),
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,

	// User Management Features
	user: {
		deleteUser: {
			enabled: true,
		},
		changeEmail: {
			enabled: true,
		},
	},

	// Account Linking (Google & GitHub SSO)
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github"],
			// Local users created through this app's OTP flow don't carry
			// Better Auth's `emailVerified` flag, so without this the implicit
			// linking gate rejects GitHub/Google sign-ins for existing users
			// with "account_not_linked". These providers verify emails
			// themselves, so local verification is not required to link.
			requireLocalEmailVerified: false,
		},
	},

	// Email & Password Auth
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 8,
		// Sends the magic reset link. We build our own URL so the user
		// lands on the reset page with the token pre-filled — no extra hop.
		sendResetPassword: async ({ user, token }) => {
			const base = (process.env.BETTER_AUTH_URL || "").replace(/\/+$/, "");
			if (!base) return; // dev: no origin configured; npm logs already cover it
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
		// After a password reset, invalidate the user's other sessions.
		revokeSessionsOnPasswordReset: true,
	},

	// Social OAuth Providers
	socialProviders: {
		github: {
			clientId: process.env.AUTH_GITHUB_ID || "",
			clientSecret: process.env.AUTH_GITHUB_SECRET || "",
		},
		google: {
			clientId: process.env.AUTH_GOOGLE_ID || "",
			clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
		},
	},

	// Session Management
	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: 60,
		},
	},

	// Advanced Production Security Settings
	advanced: {
		useSecureCookies: process.env.NODE_ENV === "production",
	},

	// Run side-effects on auth lifecycle events
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					try {
						await sendWelcomeEmail(user.email, user.name ?? "");
					} catch (err) {
						console.error("[auth] Welcome email failed:", err);
					}
				},
			},
		},
	},

	// Plugin Suite (Zero-config plugins)
	plugins: [
		twoFactor(),
		organization(),
		admin(),
		bearer(),
		multiSession(),
		openAPI(),
	],
});