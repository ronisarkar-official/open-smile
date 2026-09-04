import { NextRequest, NextResponse } from 'next/server';
import { requireServerAdmin } from '@/lib/auth/session';
import { getEmailLogs, getEmailStats, getPool, logAdminAction } from '@/lib/db';
import {
	sendEmailSafe,
	getOTPEmailHtml,
	getWelcomeEmailHtml,
	getResetPasswordEmailHtml,
	getLoginNotificationEmailHtml,
	getBetaWaitlistEmailHtml,
	getStreakReminderEmailHtml,
	getRewardUnlockedEmailHtml,
	getAdminBroadcastEmailHtml,
	markdownToEmailHtml,
} from '@/lib/mailer';
import type { EmailTemplateType } from '@/lib/mailer/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get('page') || '1', 10);
		const limit = parseInt(searchParams.get('limit') || '25', 10);
		const status = searchParams.get('status') || undefined;
		const template = searchParams.get('template') || undefined;
		const search = searchParams.get('search') || undefined;

		const logsData = await getEmailLogs({ page, limit, status, template, search });
		const stats = await getEmailStats();

		return NextResponse.json({
			success: true,
			...logsData,
			stats,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to fetch email logs' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const template = (body?.template || 'custom') as EmailTemplateType;
		const audience = body?.audience || 'single';
		const targetEmail = body?.to ? String(body.to).trim() : '';
		const subject = body?.subject ? String(body.subject).trim() : 'Open Smile Update';
		const text = body?.text ? String(body.text).trim() : '';
		const headline = body?.headline ? String(body.headline).trim() : subject;
		const customHtml = body?.html ? String(body.html) : undefined;
		const ctaLabel = body?.cta_label ? String(body.cta_label).trim() : undefined;
		const ctaUrl = body?.cta_url ? String(body.cta_url).trim() : undefined;

		const appUrl = (process.env.BETTER_AUTH_URL || 'http://localhost:3000').replace(/\/+$/, '');

		let recipients: { email: string; name?: string }[] = [];

		if (audience === 'single') {
			if (!targetEmail || !targetEmail.includes('@')) {
				return NextResponse.json(
					{ error: 'Valid recipient email is required for single target' },
					{ status: 400 },
				);
			}
			recipients = [{ email: targetEmail, name: body?.name || targetEmail.split('@')[0] }];
		} else if (audience === 'all_users') {
			const pool = getPool();
			const usersRes = await pool.query(`SELECT email, name FROM "user" WHERE banned IS NOT TRUE LIMIT 500`);
			recipients = usersRes.rows;
		} else if (audience === 'waitlist') {
			const pool = getPool();
			const waitRes = await pool.query(`SELECT email FROM beta_waitlist LIMIT 500`);
			recipients = waitRes.rows;
		} else if (audience === 'admin_team') {
			recipients = [{ email: user.email, name: user.name || 'Admin' }];
		}

		if (recipients.length === 0) {
			return NextResponse.json({ error: 'No recipients found for selected audience' }, { status: 400 });
		}

		const results: { email: string; success: boolean; status: string; error?: string }[] = [];

		for (const recipient of recipients) {
			const email = recipient.email;
			const name = recipient.name || 'Smiler';
			const unsubscribeUrl = `${appUrl}/api/mailer/unsubscribe?email=${encodeURIComponent(email)}&category=marketing`;

			let resolvedHtml: string | undefined = customHtml;
			let resolvedSubject = subject;
			let resolvedText = text || subject;

			if (template === 'otp') {
				resolvedSubject = `[Open Smile] Verification Code: 849201`;
				resolvedHtml = getOTPEmailHtml('849201');
				resolvedText = `Your Open Smile verification code is 849201.`;
			} else if (template === 'welcome') {
				resolvedSubject = `Welcome to Open Smile! 🎉`;
				resolvedHtml = getWelcomeEmailHtml(name, appUrl);
				resolvedText = `Welcome to Open Smile! Take your first smile to earn rewards.`;
			} else if (template === 'login-alert') {
				resolvedSubject = `Security Alert: New Sign-in`;
				resolvedHtml = getLoginNotificationEmailHtml(
					{ time: new Date().toUTCString(), ip: '127.0.0.1 (Manual Test)', userAgent: 'Admin Lab Console' },
					appUrl,
				);
				resolvedText = `New sign-in detected on your account.`;
			} else if (template === 'reset-password') {
				resolvedSubject = `Reset Your Password 🔑`;
				resolvedHtml = getResetPasswordEmailHtml(`${appUrl}/reset-password?token=preview_token_12345`);
				resolvedText = `Reset your password at ${appUrl}/reset-password`;
			} else if (template === 'streak-reminder') {
				resolvedSubject = `🔥 Don't lose your 5-day smile streak!`;
				resolvedHtml = getStreakReminderEmailHtml(name, 5, 4, appUrl, unsubscribeUrl);
				resolvedText = `You have 4 hours left to keep your 5-day smile streak active.`;
			} else if (template === 'reward-unlocked') {
				resolvedSubject = `🎁 You unlocked a ₹100 Amazon Gift Voucher!`;
				resolvedHtml = getRewardUnlockedEmailHtml(name, '₹100 Amazon Voucher', 250, 'AMZN-9281-SMILE', appUrl, unsubscribeUrl);
				resolvedText = `Congratulations! You unlocked a ₹100 Amazon Voucher.`;
			} else if (template === 'broadcast') {
				resolvedHtml = getAdminBroadcastEmailHtml(
					subject,
					headline,
					customHtml || markdownToEmailHtml(text),
					ctaLabel,
					ctaUrl,
					appUrl,
					unsubscribeUrl,
				);
			}

			const sendRes = await sendEmailSafe({
				to: email,
				subject: resolvedSubject,
				text: resolvedText,
				html: resolvedHtml,
				template,
				category: template === 'otp' || template === 'login-alert' || template === 'reset-password' ? 'security' : 'marketing',
				metadata: { dispatchedBy: user.email, audience },
			});

			results.push({
				email,
				success: sendRes.success,
				status: sendRes.status,
				error: sendRes.error,
			});
		}

		await logAdminAction(
			user.id,
			user.email,
			'DISPATCH_EMAIL_CAMPAIGN',
			'mailer',
			audience,
			{
				template,
				recipientCount: recipients.length,
				successCount: results.filter((r) => r.success).length,
			},
		);

		return NextResponse.json({
			success: true,
			dispatchedCount: recipients.length,
			successfulCount: results.filter((r) => r.success).length,
			results: results.slice(0, 50),
		});
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to dispatch email campaign' },
			{ status: 500 },
		);
	}
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
