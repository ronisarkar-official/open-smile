import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { adminSeedVoucherCodes } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await request.json();
		const voucherId = String(body?.voucherId || "");
		const brandName = String(body?.brandName || "");
		const title = String(body?.title || "");
		const codes = Array.isArray(body?.codes) ? body.codes : [];

		if (!voucherId || !brandName || codes.length === 0) {
			return NextResponse.json({ error: "voucherId, brandName and codes array are required" }, { status: 400 });
		}

		const result = await adminSeedVoucherCodes(user.id, user.email, voucherId, brandName, title, codes);
		return NextResponse.json(result);
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to seed vouchers" }, { status: 500 });
	}
}
