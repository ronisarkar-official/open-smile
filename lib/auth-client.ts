import { createAuthClient } from "better-auth/react";
import {
	twoFactorClient,
	organizationClient,
	adminClient,
	multiSessionClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
	plugins: [
		twoFactorClient(),
		organizationClient(),
		adminClient(),
		multiSessionClient(),
	],
});

export const {
	signIn,
	signUp,
	signOut,
	useSession,
	changePassword,
	changeEmail,
	deleteUser,
	linkSocial,
	unlinkAccount,
	listAccounts,
	listSessions,
	revokeSession,
	revokeOtherSessions,
	twoFactor,
	organization,
	admin,
	multiSession,
} = authClient;