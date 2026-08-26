import { sendEmail } from "./send-email";
import { emailCss } from "./styles";

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
	if (!to) return;
	await sendEmail({
		to,
		subject: "Welcome aboard 👋",
		text: `Hi ${name},\n\nWelcome to the app! Your account is ready.\n\nWe're glad to have you on board.\n\n— The team`,
		html: `<div class="wrap"><div class="card">
			<h1>Welcome, ${name}! 👋</h1>
			<p>Your account is ready. We're glad to have you on board.</p>
		</div><div class="footer">You're receiving this because you created an account.</div></div><style>${emailCss}</style>`,
	});
}
