import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/backend/auth/session";
import { getAdminVouchers, createAdminVoucher } from "@/backend/db";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const data = await getAdminVouchers();
		return NextResponse.json({ success: true, ...data });
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : "Failed to fetch vouchers";
		return NextResponse.json({ error: msg }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await request.json();
		const {
			brand_name,
			title,
			description,
			category,
			image_url,
			numeric_value,
			coins_cost,
			highlight_tag,
			codes,
		} = body;

		if (!brand_name || !title) {
			return NextResponse.json({ error: "Company brand name and voucher title are required." }, { status: 400 });
		}

		const numVal = Math.max(1, Number(numeric_value) || 100);
		const coinCost = Math.max(1, Number(coins_cost) || Math.round(numVal * 2));

		const res = await createAdminVoucher({
			adminId: user.id,
			adminEmail: user.email || "admin@opensmile.ai",
			brandName: String(brand_name).trim(),
			title: String(title).trim(),
			description: description ? String(description).trim() : undefined,
			category: category ? String(category).trim().toLowerCase() : "ecommerce",
			imageUrl: image_url ? String(image_url).trim() : undefined,
			numericValue: numVal,
			coinsCost: coinCost,
			highlightTag: highlight_tag ? String(highlight_tag).trim() : undefined,
			codes: Array.isArray(codes) ? codes : [],
		});

		return NextResponse.json(res);
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : "Failed to create voucher";
		return NextResponse.json({ error: msg }, { status: 500 });
	}
}
