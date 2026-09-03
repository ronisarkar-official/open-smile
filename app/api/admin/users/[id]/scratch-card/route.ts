import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { adminGrantUserScratchCard } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { id } = await params;
		const body = await request.json();
		const coins = Number(body?.coins ?? body?.amount);
		const title = body?.title ? String(body.title).trim() : (body?.reason ? String(body.reason).trim() : "");
		const badge = body?.badge ? String(body.badge).trim() : undefined;
		const themeColor = body?.themeColor ? String(body.themeColor).trim() : undefined;

		if (isNaN(coins) || coins <= 0) {
			return NextResponse.json(
				{ error: "Coins reward must be a positive number greater than 0" },
				{ status: 400 }
			);
		}

		const card = await adminGrantUserScratchCard(
			user.id,
			user.email,
			id,
			Math.floor(coins),
			title || undefined,
			badge,
			themeColor
		);

		return NextResponse.json({ success: true, card, userId: id });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Failed to grant scratch card";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
