import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireServerAdmin } from "@/lib/auth/session";
import { getAdminVouchers, createAdminVoucher, updateAdminVoucher, deleteAdminVoucher } from "@/lib/db";

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
			voucher_type,
			value_formatted,
			numeric_value,
			coins_cost,
			highlight_tag,
			codes,
		} = body;

		if (!brand_name || !title) {
			return NextResponse.json({ error: "Company brand name and voucher title are required." }, { status: 400 });
		}

		const numVal = Math.max(0, Number(numeric_value) || 0);
		const coinCost = Math.max(1, Number(coins_cost) || (numVal > 0 ? Math.round(numVal * 2) : 200));

		const res = await createAdminVoucher({
			adminId: user.id,
			adminEmail: user.email || "admin@opensmile.ai",
			brandName: String(brand_name).trim(),
			title: String(title).trim(),
			description: description ? String(description).trim() : undefined,
			category: category ? String(category).trim().toLowerCase() : "ecommerce",
			imageUrl: image_url ? String(image_url).trim() : undefined,
			voucherType: voucher_type ? String(voucher_type).trim() : "gift_card",
			valueFormatted: value_formatted ? String(value_formatted).trim() : undefined,
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

export async function PATCH(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await request.json();
		const {
			id,
			brand_name,
			title,
			description,
			category,
			image_url,
			voucher_type,
			value_formatted,
			numeric_value,
			coins_cost,
			highlight_tag,
			is_active,
		} = body;

		if (!id || !brand_name || !title) {
			return NextResponse.json(
				{ error: "Voucher ID, brand name, and title are required." },
				{ status: 400 }
			);
		}

		const numVal = numeric_value !== undefined ? Math.max(0, Number(numeric_value) || 0) : 0;
		const coinCost = Math.max(1, Number(coins_cost) || (numVal > 0 ? Math.round(numVal * 2) : 200));

		const res = await updateAdminVoucher({
			adminId: user.id,
			adminEmail: user.email || "admin@opensmile.ai",
			voucherId: String(id),
			brandName: String(brand_name).trim(),
			title: String(title).trim(),
			description: description !== undefined ? String(description).trim() : undefined,
			category: category ? String(category).trim().toLowerCase() : "ecommerce",
			imageUrl: image_url !== undefined ? (image_url ? String(image_url).trim() : null) : undefined,
			voucherType: voucher_type !== undefined ? String(voucher_type).trim() : undefined,
			valueFormatted: value_formatted !== undefined ? (value_formatted ? String(value_formatted).trim() : null) : undefined,
			numericValue: numVal,
			coinsCost: coinCost,
			highlightTag: highlight_tag !== undefined ? (highlight_tag ? String(highlight_tag).trim() : null) : undefined,
			isActive: is_active !== undefined ? Boolean(is_active) : undefined,
		});

		return NextResponse.json(res);
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : "Failed to update voucher";
		return NextResponse.json({ error: msg }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json({ error: "Voucher ID is required." }, { status: 400 });
		}

		const res = await deleteAdminVoucher({
			adminId: user.id,
			adminEmail: user.email || "admin@opensmile.ai",
			voucherId: id,
		});

		return NextResponse.json(res);
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : "Failed to delete voucher";
		return NextResponse.json({ error: msg }, { status: 500 });
	}
}
