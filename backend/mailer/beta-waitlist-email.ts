import { sendEmail } from "./send-email";
import { emailCss } from "./styles";

export async function sendBetaWaitlistEmail(to: string): Promise<void> {
	if (!to) return;
	await sendEmail({
		to,
		subject: "You're on the beta list",
		text: `Thanks for joining the waitlist!\n\nWe'll email you the moment the beta opens.\n\n— The team`,
		html: `<div class="wrap"><div class="card">
			<h1>You're on the list</h1>
			<p>Thanks for joining the beta waitlist. We'll email you the moment the beta opens.</p>
		</div><div class="footer">You're receiving this because you joined the waitlist.</div></div><style>${emailCss}</style>`,
	});
}
