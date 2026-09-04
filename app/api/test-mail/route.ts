import { NextRequest, NextResponse } from "next/server";
import {
	sendOTPEmail,
	sendWelcomeEmail,
	sendResetPasswordEmail,
	sendLoginNotificationEmail,
	sendBetaWaitlistEmail,
	getOTPEmailHtml,
	getWelcomeEmailHtml,
	getResetPasswordEmailHtml,
	getLoginNotificationEmailHtml,
	getBetaWaitlistEmailHtml,
} from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPreviewHtml(type: string, email: string, name?: string, customCode?: string): string {
	const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");
	const safeEmail = email || "user@example.com";
	const safeName = name || "Alex";
	const safeCode = customCode || "849201";

	switch (type) {
		case "otp":
			return getOTPEmailHtml(safeCode);
		case "welcome":
			return getWelcomeEmailHtml(safeName, appUrl);
		case "reset-password":
			const resetLink = `${appUrl}/reset-password?token=preview_test_token_123&email=${encodeURIComponent(safeEmail)}`;
			return getResetPasswordEmailHtml(resetLink);
		case "login-alert":
			return getLoginNotificationEmailHtml({
				time: new Date().toUTCString(),
				ip: "127.0.0.1 (Localhost)",
				userAgent: "Chrome 128 (Windows 11)",
			}, appUrl);
		case "beta-waitlist":
		default:
			return getBetaWaitlistEmailHtml();
	}
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const type = searchParams.get("type") || "otp";
	const email = searchParams.get("email") || "user@example.com";
	const name = searchParams.get("name") || "Alex";
	const code = searchParams.get("code") || "849201";

	const html = getPreviewHtml(type, email, name, code);
	return new NextResponse(html, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"X-Frame-Options": "SAMEORIGIN",
		},
	});
}

export async function POST(req: NextRequest) {
	try {
		const { email, type = "otp", name = "Alex", customCode } = await req.json();

		if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
			return NextResponse.json(
				{ error: "A valid recipient email address is required." },
				{ status: 400 }
			);
		}

		const normalizedEmail = email.trim().toLowerCase();
		const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

		switch (type) {
			case "otp":
				await sendOTPEmail(normalizedEmail, customCode || "849201");
				break;
			case "welcome":
				await sendWelcomeEmail(normalizedEmail, name || "Alex");
				break;
			case "reset-password":
				await sendResetPasswordEmail(
					normalizedEmail,
					`${appUrl}/reset-password?token=test_reset_token_${Date.now()}&email=${encodeURIComponent(normalizedEmail)}`
				);
				break;
			case "login-alert":
				await sendLoginNotificationEmail(normalizedEmail, {
					time: new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "long", timeZone: "UTC" }),
					ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1",
					userAgent: req.headers.get("user-agent") || "Test Web Client",
				});
				break;
			case "beta-waitlist":
				await sendBetaWaitlistEmail(normalizedEmail);
				break;
			default:
				return NextResponse.json({ error: `Unknown email template type: ${type}` }, { status: 400 });
		}

		const isRealSmtp = Boolean(
			process.env.EMAIL_USER &&
			process.env.EMAIL_PASS &&
			process.env.EMAIL_USER !== "your_email@gmail.com" &&
			process.env.EMAIL_PASS !== "your_gmail_app_password"
		);

		return NextResponse.json({
			success: true,
			message: isRealSmtp
				? `Test email (${type}) sent successfully to ${normalizedEmail} via SMTP!`
				: `Test email (${type}) dispatched in Development Mode (logged to server terminal).`,
			deliveryMode: isRealSmtp ? "smtp" : "dev-console",
		});
	} catch (error) {
		console.error("[test-mail] Error sending test email:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Failed to send test email" },
			{ status: 500 }
		);
	}
}

