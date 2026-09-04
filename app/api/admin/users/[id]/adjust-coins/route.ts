import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/lib/auth/session";
import { adminAdjustUserCoins } from "@/lib/db";

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
		const amount = Number(body?.amount);
		const reason = String(body?.reason || "");

		if (isNaN(amount) || amount === 0) {
			return NextResponse.json({ error: "Amount must be a non-zero number" }, { status: 400 });
		}

		const newBalance = await adminAdjustUserCoins(user.id, user.email, id, amount, reason);
		return NextResponse.json({ success: true, newBalance, amount, userId: id });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to adjust coins" }, { status: 500 });
	}
}
