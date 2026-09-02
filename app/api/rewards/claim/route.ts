import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPool } from '@/backend/db/client';
import { requireServerUser } from '@/backend/auth/session';
import { getUserCoinBalance, getSystemSettingsMap } from '@/backend/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function generateVoucherCode(brand: string): string {
	const prefix = brand.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let code = '';
	for (let i = 0; i < 12; i++) {
		if (i > 0 && i % 4 === 0) code += '-';
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return `${prefix}-${code}`;
}

export async function POST(request: NextRequest) {
	try {
		const { user, error } = await requireServerUser();
		if (!user) return error;

		const settings = await getSystemSettingsMap();
		if (settings.marketplace_enabled === false || settings.maintenance_mode === true) {
			return NextResponse.json(
				{ error: 'Voucher marketplace redemptions are currently paused.' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const voucherId = body.voucher_id || 'voucher';
		const brandName = body.brand || 'Brand';
		const coinsCost = Number(body.coins_cost) || 0;

		const currentBalance = await getUserCoinBalance(user.id);
		if (currentBalance < coinsCost) {
			return NextResponse.json(
				{ error: `Insufficient coins. You have ${currentBalance} coins, but ${coinsCost} are required.` },
				{ status: 400 }
			);
		}

		const pool = getPool();
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Deduct coins from ledger
			await client.query(
				`INSERT INTO coin_ledger (user_id, coins, reason, created_at)
				 VALUES ($1, $2, 'voucher_claim', NOW())`,
				[user.id, -coinsCost]
			);

			const code = generateVoucherCode(brandName);
			const now = new Date();
			const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
			const valueFormatted = `₹${Math.round(coinsCost / 2)}`;

			const rewardRes = await client.query(
				`INSERT INTO rewards (user_id, tier, provider, voucher_code, coins_spent, claimed_at)
				 VALUES ($1, $2, $3, $4, $5, $6)
				 RETURNING id`,
				[user.id, valueFormatted, brandName, code, coinsCost, now]
			);

			await client.query(
				`INSERT INTO vouchers (user_id, voucher_type, coin_cost, code, status, created_at)
				 VALUES ($1, $2, $3, $4, 'claimed', $5)`,
				[user.id, `${valueFormatted} ${brandName} Voucher`, coinsCost, code, now]
			);

			await client.query(
				`INSERT INTO scratch_cards (user_id, title, source, coins, voucher_id, voucher_title, voucher_code, voucher_brand, is_scratched, theme_color, badge, created_at)
				 VALUES ($1, $2, 'Voucher Marketplace', 0, $3, $4, $5, $6, true, '#22C55E', 'VOUCHER', $7)`,
				[user.id, `${brandName} Voucher (${valueFormatted})`, voucherId, `${valueFormatted} ${brandName} Voucher`, code, brandName, now]
			);

			await client.query('COMMIT');

			return NextResponse.json({
				id: String(rewardRes.rows[0]?.id),
				voucherId,
				brandName,
				title: `${valueFormatted} ${brandName} Voucher`,
				valueFormatted,
				code,
				pin: '7492',
				claimedAt: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				expiresAt: expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				coinsSpent: coinsCost,
				logoBg: brandName.toLowerCase().includes('flipkart') ? '#2874F0' : brandName.toLowerCase().includes('boat') ? '#E21B24' : '#FF9900',
				websiteUrl: brandName.toLowerCase().includes('flipkart') ? 'https://flipkart.com' : brandName.toLowerCase().includes('boat') ? 'https://boat-lifestyle.com' : 'https://amazon.in',
				status: 'active',
			});
		} catch (txErr) {
			await client.query('ROLLBACK');
			throw txErr;
		} finally {
			client.release();
		}
	} catch (err) {
		console.error('Claim voucher error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
