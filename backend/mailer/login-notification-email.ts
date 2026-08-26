import { sendEmail } from "./send-email";
import { emailCss } from "./styles";

interface LoginDetails {
	time?: string;
	ip?: string;
	userAgent?: string;
}

export async function sendLoginNotificationEmail(
	to: string,
	details?: LoginDetails
): Promise<void> {
	if (!to) return;

	const loginTime = details?.time || new Date().toUTCString();
	const ipAddress = details?.ip || "Unknown IP";
	const userAgent = details?.userAgent || "Standard Browser";

	await sendEmail({
		to,
		subject: "Security alert: New sign-in to your account",
		text: `Security alert\n\nWe noticed a new sign-in to your account.\n\nDate/Time: ${loginTime}\nIP Address: ${ipAddress}\nDevice: ${userAgent}\n\nIf this was you, no action is needed.\nIf you didn't perform this sign-in, please secure your account immediately.`,
		html: `<div class="wrap"><div class="card">
			<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
				<div style="background: #fef2f2; color: #dc2626; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold;">🔒</div>
				<h1 style="margin: 0; font-size: 18px; color: #111827;">New sign-in to your account</h1>
			</div>
			<p>We detected a new sign-in to your account with the following details:</p>
			<div style="background: #f9fafb; border-radius: 8px; padding: 14px; margin: 16px 0; border: 1px solid #f3f4f6;">
				<table>
					<tr><td class="label">Time:</td><td class="value" style="font-weight: normal;">${loginTime}</td></tr>
					<tr><td class="label">IP Address:</td><td class="value" style="font-weight: normal;">${ipAddress}</td></tr>
					<tr><td class="label">Device / Browser:</td><td class="value" style="font-weight: normal;">${userAgent}</td></tr>
				</table>
			</div>
			<p style="font-size: 13px; color: #6b7280;">If this was you, you can safely ignore this email. If you don't recognize this activity, please reset your password immediately.</p>
			<a class="btn" href="${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/forgot-password">Secure Account</a>
		</div><div class="footer">Security notification from your account service.</div></div><style>${emailCss}</style>`,
	});
}
