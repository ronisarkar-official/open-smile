import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { adminFlagCapture } from "@/backend/db";

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
		const reason = String(body?.reason || "Anti-cheat flag triggered by admin");
		const deductCoins = body?.deductCoins !== false;

		const result = await adminFlagCapture(user.id, user.email, id, reason, deductCoins);
		return NextResponse.json({ ...result, captureId: id });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to flag capture" }, { status: 500 });
	}
}
