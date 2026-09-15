import { sendEmailSafe } from "./send-email";
import { renderEmailLayout } from "./styles";
import type { SendEmailResult } from "./types";

export interface ContactEmailPayload {
	name: string;
	email: string;
	subject: string;
	message: string;
	ip?: string;
	userId?: string;
	sentAt?: Date;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function getContactEmailHtml(payload: ContactEmailPayload): string {
	const { name, email, subject, message, ip, sentAt = new Date() } = payload;
	const formattedDate = sentAt.toLocaleString("en-IN", {
		timeZone: "Asia/Kolkata",
		dateStyle: "medium",
		timeStyle: "short",
	});

	const escapedName = escapeHtml(name);
	const escapedEmail = escapeHtml(email);
	const escapedSubject = escapeHtml(subject);
	const escapedMessage = escapeHtml(message).replace(/\n/g, "<br/>");
	const mailtoHref = `mailto:${encodeURIComponent(email)}?subject=Re:%20${encodeURIComponent(subject)}`;

	return renderEmailLayout({
		title: `Contact Inquiry: ${escapedSubject}`,
		badgeText: "NEW INQUIRY",
		badgeBg: "#7B61FF",
		badgeColor: "#ffffff",
		content: `
			<h1 style="font-size: 22px; font-weight: 800; color: #0f0f0f; margin: 0 0 8px; letter-spacing: -0.5px;">
				New Message from Contact Form
			</h1>
			<p style="color: #57534e; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
				A user has submitted an inquiry on the <strong>Open Smile</strong> contact page.
			</p>

			<div style="background-color: #faf8f5; border: 1.5px solid #0f0f0f; border-radius: 7px; box-shadow: 3px 3px 0px #0f0f0f; padding: 20px; margin: 0 0 24px;">
				<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
					<tr>
						<td style="padding: 6px 0; font-weight: 700; color: #0f0f0f; width: 90px;">From:</td>
						<td style="padding: 6px 0; color: #0f0f0f;"><strong>${escapedName}</strong> (&lt;<a href="mailto:${escapedEmail}" style="color: #7B61FF; font-weight: 600; text-decoration: underline;">${escapedEmail}</a>&gt;)</td>
					</tr>
					<tr>
						<td style="padding: 6px 0; font-weight: 700; color: #0f0f0f;">Subject:</td>
						<td style="padding: 6px 0; color: #0f0f0f; font-weight: 600;">${escapedSubject}</td>
					</tr>
					<tr>
						<td style="padding: 6px 0; font-weight: 700; color: #0f0f0f;">Time (IST):</td>
						<td style="padding: 6px 0; color: #57534e;">${formattedDate} IST</td>
					</tr>
					${ip ? `
					<tr>
						<td style="padding: 6px 0; font-weight: 700; color: #0f0f0f;">IP:</td>
						<td style="padding: 6px 0; color: #57534e; font-family: monospace;">${escapeHtml(ip)}</td>
					</tr>` : ""}
				</table>
			</div>

			<div style="margin: 0 0 24px;">
				<div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f0f0f; margin-bottom: 8px;">
					Message Content:
				</div>
				<div style="background-color: #ffffff; border: 1.5px solid #0f0f0f; border-radius: 7px; box-shadow: 3px 3px 0px #0f0f0f; padding: 18px 20px; font-size: 15px; line-height: 1.65; color: #1c1917;">
					${escapedMessage}
				</div>
			</div>

			<div style="text-align: center; margin: 30px 0 10px;">
				<a href="${mailtoHref}" style="display: inline-block; background-color: #FF2D78; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 12px 28px; border: 1.5px solid #0f0f0f; border-radius: 7px; box-shadow: 3px 3px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">
					Reply to ${escapedName} ✉️
				</a>
			</div>
		`,
		footerNote: "You are receiving this notification because an inquiry was submitted on Open Smile.",
	});
}

export async function sendContactNotificationEmail(payload: ContactEmailPayload): Promise<SendEmailResult> {
	const recipientEmail =
		process.env.CONTACT_EMAIL?.trim() ||
		process.env.EMAIL_USER?.trim() ||
		"thor82464@gmail.com";

	const plainText = [
		`New Inquiry via Open Smile Contact Form`,
		`----------------------------------------`,
		`From: ${payload.name} <${payload.email}>`,
		`Subject: ${payload.subject}`,
		`Date: ${(payload.sentAt || new Date()).toISOString()}`,
		payload.ip ? `IP: ${payload.ip}` : "",
		`----------------------------------------`,
		`Message:`,
		payload.message,
		`----------------------------------------`,
		`Reply directly to: ${payload.email}`,
	]
		.filter(Boolean)
		.join("\n");

	return sendEmailSafe({
		to: recipientEmail,
		replyTo: payload.email,
		fromName: "Open Smile Contact",
		subject: `[Contact Us] ${payload.subject} (from ${payload.name})`,
		text: plainText,
		html: getContactEmailHtml(payload),
		template: "contact",
		category: "system",
		userId: payload.userId,
		metadata: {
			senderName: payload.name,
			senderEmail: payload.email,
			ip: payload.ip,
		},
	});
}
