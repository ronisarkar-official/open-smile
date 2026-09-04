import { sendEmail } from "./send-email";
import { getLoginNotificationEmailHtml, type LoginDetails } from "./templates";

export { getLoginNotificationEmailHtml };
export type { LoginDetails };

export async function sendLoginNotificationEmail(
	to: string,
	details?: LoginDetails
): Promise<void> {
	if (!to) return;

	const loginTime = details?.time || new Date().toUTCString();
	const ipAddress = details?.ip || "Unknown IP";
	const userAgent = details?.userAgent || "Standard Browser";
	const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

	await sendEmail({
		to,
		subject: "[Open Smile] Security Alert: New Sign-in Detected",
		text: `Open Smile Security Alert\n\nWe noticed a new sign-in to your Open Smile account.\n\nDate/Time: ${loginTime}\nIP Address: ${ipAddress}\nDevice: ${userAgent}\n\nIf this was you, no action is needed.\nIf you didn't perform this sign-in, please secure your account immediately:\n${appUrl}/forgot-password\n\n— The Open Smile Team`,
		html: getLoginNotificationEmailHtml(details, appUrl),
	});
}



