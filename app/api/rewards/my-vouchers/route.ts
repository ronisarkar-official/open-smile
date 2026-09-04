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
			`SELECT id, tier, provider, voucher_code, coins_spent, claimed_at
			 FROM rewards
			 WHERE user_id = $1
			 ORDER BY claimed_at DESC`,
			[user.id]
		);

		const vouchers = rows.map((r) => {
			const provider = r.provider || 'Amazon';
			const claimedAt = r.claimed_at ? new Date(r.claimed_at) : new Date();
			const expiresAt = new Date(claimedAt.getTime() + 365 * 24 * 60 * 60 * 1000);

			return {
				id: String(r.id),
				voucherId: String(r.id),
				brandName: provider,
				title: `${r.tier || '₹250'} ${provider} Voucher`,
				valueFormatted: r.tier || '₹250',
				code: r.voucher_code,
				pin: '7492',
				claimedAt: claimedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				expiresAt: expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				coinsSpent: Number(r.coins_spent) || 0,
				logoBg: provider.toLowerCase().includes('flipkart') ? '#2874F0' : provider.toLowerCase().includes('boat') ? '#E21B24' : '#FF9900',
				websiteUrl: provider.toLowerCase().includes('flipkart') ? 'https://flipkart.com' : provider.toLowerCase().includes('boat') ? 'https://boat-lifestyle.com' : 'https://amazon.in',
				status: 'active',
			};
		});

		return NextResponse.json(vouchers);
	} catch (err) {
		console.error('My vouchers error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
