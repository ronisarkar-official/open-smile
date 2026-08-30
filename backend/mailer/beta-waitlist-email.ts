import { sendEmail } from "./send-email";
import { getBetaWaitlistEmailHtml } from "./templates";

export { getBetaWaitlistEmailHtml };

export async function sendBetaWaitlistEmail(to: string): Promise<void> {
	if (!to) return;
	await sendEmail({
		to,
		subject: "[Open Smile] You're on the Beta List! 🚀",
		text: `You're on the Open Smile Beta List! 🚀\n\nThanks for joining the Open Smile waitlist.\n\nYou have secured early access to our AI-powered smile rewards platform. We will notify you the moment beta invites roll out.\n\n— The Open Smile Team`,
		html: getBetaWaitlistEmailHtml(),
	});
}



