import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
	try {
		const pool = getPool();
		let rows = [];
		try {
			const res = await pool.query(`
				SELECT 
					vc.id, 
					vc.brand_name as "brandName", 
					vc.title, 
					vc.description, 
					vc.details,
					vc.category, 
					vc.image_url as "imageUrl", 
					vc.numeric_value as "numericValue", 
					vc.coins_cost as "coinsCost", 
					vc.highlight_tag as "highlightTag",
					COALESCE(vc.voucher_type, 'gift_card') as "voucherType",
					COALESCE(vc.value_formatted, '₹' || vc.numeric_value::text) as "valueFormatted",
					COUNT(vi.id) FILTER (WHERE vi.status = 'available')::int as "remainingInventory"
				FROM vouchers_catalog vc
				LEFT JOIN voucher_inventory vi ON vc.id = vi.voucher_id
				WHERE vc.is_active = true
				GROUP BY vc.id, vc.brand_name, vc.title, vc.description, vc.details, vc.category, vc.image_url, vc.numeric_value, vc.coins_cost, vc.highlight_tag, vc.voucher_type, vc.value_formatted
				ORDER BY vc.numeric_value ASC
			`);
			rows = res.rows;
		} catch {
			const fallbackRes = await pool.query(`
				SELECT 
					vc.id, 
					vc.brand_name as "brandName", 
					vc.title, 
					vc.description, 
					vc.category, 
					vc.image_url as "imageUrl", 
					vc.numeric_value as "numericValue", 
					vc.coins_cost as "coinsCost", 
					vc.highlight_tag as "highlightTag",
					COALESCE(vc.voucher_type, 'gift_card') as "voucherType",
					COALESCE(vc.value_formatted, '₹' || vc.numeric_value::text) as "valueFormatted",
					COUNT(vi.id) FILTER (WHERE vi.status = 'available')::int as "remainingInventory"
				FROM vouchers_catalog vc
				LEFT JOIN voucher_inventory vi ON vc.id = vi.voucher_id
				WHERE vc.is_active = true
				GROUP BY vc.id, vc.brand_name, vc.title, vc.description, vc.category, vc.image_url, vc.numeric_value, vc.coins_cost, vc.highlight_tag, vc.voucher_type, vc.value_formatted
				ORDER BY vc.numeric_value ASC
			`);
			rows = fallbackRes.rows.map((r: any) => ({ ...r, details: null }));
		}

		const catalog = rows.map((r) => {
			const brandId = r.brandName.toLowerCase().replace(/\s+/g, '');
			return {
				id: String(r.id),
				brandId,
				brandName: r.brandName,
				category: r.category || 'ecommerce',
				title: r.title,
				voucherType: r.voucherType || 'gift_card',
				valueFormatted: r.valueFormatted || (Number(r.numericValue) > 0 ? `₹${Number(r.numericValue).toLocaleString('en-IN')}` : r.title),
				numericValue: Number(r.numericValue),
				coinsCost: Number(r.coinsCost),
				highlightTag: r.highlightTag || undefined,
				description: r.description || `Redeem ${r.title} with your smile coins.`,
				details: r.details || undefined,
				instructions: [`Copy secret code and apply on ${r.brandName} checkout.`],
				logoBg: '#FF2D78',
				imageUrl: r.imageUrl || undefined,
				isPopular: Number(r.numericValue) >= 500,
				remainingInventory: Number(r.remainingInventory) || 0,
			};
		});

		return NextResponse.json(catalog);
	} catch (err: unknown) {
		console.error('Catalog fetch error:', err);
		return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
	}
}
