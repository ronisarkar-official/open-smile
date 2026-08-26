import nodemailer from "nodemailer";
import type { EmailInput } from "./types";

function hasMailConfig(): boolean {
	const user = process.env.EMAIL_USER?.trim();
	const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
	return Boolean(
		user &&
			pass &&
			user !== "your_email@gmail.com" &&
			pass !== "your_gmail_app_password"
	);
}

function devLog(to: string, subject: string, text: string) {
	console.log("\n=========================================");
	console.log("🛠️  DEVELOPMENT MODE EMAIL 🛠️");
	console.log(`To: ${to}`);
	console.log(`Subject: ${subject}`);
	console.log(text);
	console.log("=========================================\n");
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function textToHtml(text: string): string {
	return text
		.split("\n")
		.map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : ""))
		.join("");
}

export async function sendEmail({ to, subject, text, html }: EmailInput): Promise<void> {
	const user = process.env.EMAIL_USER?.trim();
	const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

	if (!hasMailConfig() || !user || !pass) {
		devLog(to, subject, text);
		return;
	}

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: { user, pass },
	});

	try {
		await transporter.sendMail({
			from: user,
			to,
			subject,
			text,
			html: html ?? textToHtml(text),
		});
	} catch (error) {
		console.error("[mailer] send failed", {
			subject,
			reason: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}
