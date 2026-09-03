import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendWelcomeEmail, sendResetPasswordEmail } from "../mailer";
import {
	twoFactor,
	organization,
	admin,
	bearer,
	multiSession,
	openAPI,
} from "better-auth/plugins";

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
			const base = (process.env.BETTER_AUTH_URL || "").replace(/\/+$/, "");
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
				before: async (user) => {
					return {
						data: {
							...user,
							name: user.name || user.email?.split("@")[0] || "User",
							image: user.image || "/icons/default-icon.webp",
						},
					};
				},
				after: async (user) => {
					void sendWelcomeEmail(user.email, user.name ?? "").catch((err) => {
						console.error("[auth] Welcome email failed:", err);
					});
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
