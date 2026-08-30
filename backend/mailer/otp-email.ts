import { sendEmail } from "./send-email";
import { getOTPEmailHtml } from "./templates";

export { getOTPEmailHtml };

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
	if (!email) return;
	await sendEmail({
		to: email,
		subject: `[Open Smile] Verification Code: ${otp}`,
		text: `Open Smile Verification Code\n\nYour one-time verification code is:\n${otp}\n\nThis code will expire in 5 minutes.\nIf you did not request this code, you can safely ignore this email.\n\n— The Open Smile Team`,
		html: getOTPEmailHtml(otp),
	});
}



