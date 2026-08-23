import { createAuthClient } from "better-auth/react";
import {
	twoFactorClient,
	organizationClient,
	adminClient,
	multiSessionClient,
} from "better-auth/client/plugins";

const clientBaseURL =
	process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
	(typeof window !== "undefined" ? window.location.origin : undefined) ||
	"http://localhost:3000";

export const authClient = createAuthClient({
	baseURL: clientBaseURL,
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