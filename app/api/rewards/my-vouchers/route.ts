import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/lib/db/client';
import { requireServerUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const pool = getPool();
		const { rows } = await pool.query(
			`SELECT r.id, r.tier, r.provider, r.voucher_code, r.coins_spent, r.claimed_at,
			        r.voucher_id, COALESCE(r.redirect_url, vc.redirect_url) as redirect_url, r.pin,
			        COALESCE(
			            r.image_url,
			            vc.image_url,
			            (SELECT vc2.image_url FROM vouchers_catalog vc2 WHERE LOWER(vc2.brand_name) = LOWER(r.provider) AND vc2.image_url IS NOT NULL LIMIT 1)
			        ) as image_url
			 FROM rewards r
			 LEFT JOIN vouchers_catalog vc ON r.voucher_id = vc.id
			 WHERE r.user_id = $1
			 ORDER BY r.claimed_at DESC`,
			[user.id]
		);

		const vouchers = rows.map((r) => {
			const provider = r.provider || 'Brand';
			const claimedAt = r.claimed_at ? new Date(r.claimed_at) : new Date();
			const expiresAt = new Date(claimedAt.getTime() + 365 * 24 * 60 * 60 * 1000);

			const fallbackWebsite = provider.toLowerCase().includes('flipkart')
				? 'https://flipkart.com'
				: provider.toLowerCase().includes('boat')
				? 'https://boat-lifestyle.com'
				: provider.toLowerCase().includes('apple')
				? 'https://www.apple.com'
				: provider.toLowerCase().includes('lenskart')
				? 'https://www.lenskart.com'
				: 'https://www.google.com';

			return {
				id: String(r.id),
				voucherId: r.voucher_id || String(r.id),
				brandName: provider,
				title: `${r.tier || '₹250'} ${provider} Voucher`,
				valueFormatted: r.tier || '₹250',
				code: r.voucher_code,
				pin: r.pin || null,
				claimedAt: claimedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				expiresAt: expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				coinsSpent: Number(r.coins_spent) || 0,
				logoBg: provider.toLowerCase().includes('flipkart') ? '#2874F0' : provider.toLowerCase().includes('boat') ? '#E21B24' : '#FF9900',
				websiteUrl: r.redirect_url || fallbackWebsite,
				imageUrl: r.image_url || undefined,
				status: 'active',
			};
		});

		return NextResponse.json(vouchers);
	} catch (err) {
		console.error('My vouchers error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
