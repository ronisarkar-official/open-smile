import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireServerUser } from '@/lib/auth/session';
import { claimVoucherAtomic, getSystemSettingsMap } from '@/lib/db';
import { sendVoucherClaimedEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
		const voucherId = body.voucher_id;
		const brandName = body.brand;
		const coinsCost = Number(body.coins_cost) || 0;

		if (!voucherId) {
			return NextResponse.json(
				{ error: 'Voucher ID is required.' },
				{ status: 400 }
			);
		}

		const res = await claimVoucherAtomic({
			userId: user.id,
			voucherId,
			coinsCost,
			brandName,
		});

		if (!res.success || !res.claim) {
			return NextResponse.json(
				{ error: res.message || 'Failed to claim voucher.' },
				{ status: 400 }
			);
		}

		if (user.email) {
			sendVoucherClaimedEmail({
				to: user.email,
				name: user.name || 'Smiler',
				userId: user.id,
				brandName: res.claim.brandName,
				voucherTitle: res.claim.title,
				voucherCode: res.claim.code,
				pin: res.claim.pin,
				valueFormatted: res.claim.valueFormatted,
				coinsSpent: res.claim.coinsSpent,
				expiresAt: res.claim.expiresAt,
				websiteUrl: res.claim.websiteUrl,
			}).catch((mailErr) => {
				console.error('Failed to send voucher email:', mailErr);
			});
		}

		return NextResponse.json(res.claim);
	} catch (err) {
		console.error('Claim voucher error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

