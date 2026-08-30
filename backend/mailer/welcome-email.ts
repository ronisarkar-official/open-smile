import { sendEmail } from "./send-email";
import { getWelcomeEmailHtml } from "./templates";

export { getWelcomeEmailHtml };

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
	if (!to) return;
	const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

	await sendEmail({
		to,
		subject: "Welcome to Open Smile! 🎉",
		text: `Welcome to Open Smile! 🎉\n\nHi ${name || "there"},\n\nYour Open Smile account is ready. Get ready to turn your daily smiles into real rewards.\n\nCapture smiles, score your genuine smile rating with on-device AI, earn coins, and redeem them for real vouchers.\n\nStart smiling now: ${appUrl}/capture\n\n— The Open Smile Team`,
		html: getWelcomeEmailHtml(name, appUrl),
	});
}



