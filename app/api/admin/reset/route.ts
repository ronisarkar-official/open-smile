import { NextResponse } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { adminResetPlatform } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const scope = body.scope;
		const purgeCaptures = Boolean(body.purgeCaptures);

		if (!scope || !["coins", "streaks", "leaderboard", "all"].includes(scope)) {
			return NextResponse.json(
				{ error: "Invalid scope. Allowed scopes: coins, streaks, leaderboard, all" },
				{ status: 400 }
			);
		}

		const result = await adminResetPlatform(
			user.id,
			user.email || "admin@opensmile.ai",
			scope,
			purgeCaptures
		);

		return NextResponse.json(result);
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || "Failed to execute platform reset" },
			{ status: 500 }
		);
	}
}
