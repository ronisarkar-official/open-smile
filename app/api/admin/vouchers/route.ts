import { NextResponse } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { getAdminVouchers } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const data = await getAdminVouchers();
		return NextResponse.json({ success: true, ...data });
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Failed to fetch vouchers" }, { status: 500 });
	}
}
