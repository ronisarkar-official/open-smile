import { NextRequest, NextResponse } from 'next/server';
import { addEmailSuppression, removeEmailSuppression } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const email = searchParams.get('email');
	const category = searchParams.get('category') || 'all';

	if (!email || !email.includes('@')) {
		return new NextResponse('Invalid or missing email address', { status: 400 });
	}

	try {
		await addEmailSuppression(email, 'user_unsubscribe', category);
	} catch (err) {
		console.error('[mailer/unsubscribe] error:', err);
	}

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unsubscribed — Open Smile</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #faf8f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f0f0f;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  .card {
    background: #ffffff;
    border: 2px solid #0f0f0f;
    border-radius: 8px;
    box-shadow: 4px 4px 0px #0f0f0f;
    padding: 36px 32px;
    max-width: 460px;
    width: 90%;
    text-align: center;
  }
  .badge {
    display: inline-block;
    background-color: #FFD23F;
    color: #0f0f0f;
    font-size: 11px;
    font-weight: 900;
    padding: 4px 10px;
    border: 1.5px solid #0f0f0f;
    border-radius: 4px;
    box-shadow: 2px 2px 0px #0f0f0f;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 22px;
    font-weight: 900;
    margin: 0 0 12px;
  }
  p {
    color: #57534e;
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 24px;
  }
  .btn {
    display: inline-block;
    background: #FF2D78;
    color: #ffffff;
    text-decoration: none;
    padding: 12px 24px;
    font-size: 13px;
    font-weight: 900;
    border: 2px solid #0f0f0f;
    border-radius: 6px;
    box-shadow: 3px 3px 0px #0f0f0f;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="badge">PREFERENCES UPDATED</div>
    <h1>You've been unsubscribed</h1>
    <p>We've updated our records for <strong>${email.replace(/</g, '&lt;')}</strong>. You will no longer receive <em>${category}</em> notifications from Open Smile.</p>
    <a href="/dashboard" class="btn">Return to Open Smile</a>
  </div>
</body>
</html>`;

	return new NextResponse(html, {
		status: 200,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	});
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json().catch(() => ({}));
		const email = body?.email ? String(body.email).trim() : '';
		const category = body?.category ? String(body.category).trim() : 'all';
		const reason = body?.reason ? String(body.reason).trim() : 'unsubscribe';
		const undo = Boolean(body?.undo);

		if (!email || !email.includes('@')) {
			return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
		}

		if (undo) {
			const success = await removeEmailSuppression(email);
			return NextResponse.json({ success, action: 'removed' });
		}

		await addEmailSuppression(email, reason, category);
		return NextResponse.json({ success: true, action: 'suppressed' });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to update email suppression' },
			{ status: 500 },
		);
	}
}
