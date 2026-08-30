import nodemailer from "nodemailer";
import type { EmailInput } from "./types";
import { renderEmailLayout } from "./styles";

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

function devLog(to: string, subject: string, text: string, from: string) {
	console.log("\n=========================================");
	console.log("🛠️  DEVELOPMENT MODE EMAIL 🛠️");
	console.log(`From: ${from}`);
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

function textToHtml(text: string, subject: string): string {
	const paragraphs = text
		.split("\n")
		.map((line) => (line.trim() ? `<p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 8px 0;">${escapeHtml(line)}</p>` : ""))
		.join("");

	return renderEmailLayout({
		title: subject,
		content: `<h1 style="font-size: 22px; font-weight: 800; color: #0f0f0f; margin: 0 0 16px;">${escapeHtml(subject)}</h1>${paragraphs}`,
	});
}

export async function sendEmail({ to, subject, text, html, fromName }: EmailInput): Promise<void> {
	const user = process.env.EMAIL_USER?.trim();
	const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

	const senderName = fromName || process.env.EMAIL_FROM_NAME || "Open Smile";
	const fromAddress = process.env.EMAIL_FROM?.trim() || user || "no-reply@opensmile.app";
	const formattedFrom = `"${senderName}" <${fromAddress}>`;

	if (!hasMailConfig() || !user || !pass) {
		devLog(to, subject, text, formattedFrom);
		return;
	}

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: { user, pass },
	});

	try {
		await transporter.sendMail({
			from: formattedFrom,
			to,
			subject,
			text,
			html: html ?? textToHtml(text, subject),
		});
	} catch (error) {
		console.error("[mailer] send failed", {
			subject,
			reason: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}

