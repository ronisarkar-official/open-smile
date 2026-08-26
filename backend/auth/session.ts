import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function getServerUser(
	h?: Headers,
): Promise<{
	id: string;
	email: string;
	name?: string | null;
} | null> {
	const reqHeaders = h ?? (await headers());
	const session = await auth.api.getSession({ headers: reqHeaders });
	if (!session?.user?.id) return null;
	return session.user as {
		id: string;
		email: string;
		name?: string | null;
	};
}

export async function requireServerUser(): Promise<
	| {
			user: { id: string; email: string; name?: string | null };
			error: null;
	  }
	| { user: null; error: NextResponse }
> {
	const user = await getServerUser();
	if (!user) {
		return {
			user: null,
			error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}
	return { user, error: null as never };
}
