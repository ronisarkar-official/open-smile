import nodemailer from "nodemailer";
import type {
	EmailInput,
	EmailProviderType,
	MailerDiagnostics,
	SendEmailResult,
} from "./types";
import { renderEmailLayout } from "./styles";
import {
	getSystemSettingsMap,
	insertEmailLog,
	isEmailSuppressed,
	getUserNotificationPreferences,
} from "@/lib/db";

import { markdownToEmailHtml } from "./markdown";

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function textToHtml(text: string, subject: string): string {
	const contentHtml = markdownToEmailHtml(text);
	return renderEmailLayout({
		title: subject,
		content: `<h1 style="font-size: 22px; font-weight: 800; color: #0f0f0f; margin: 0 0 16px;">${escapeHtml(subject)}</h1>${contentHtml}`,
	});
}

function getActiveProvider(): EmailProviderType {
	if (process.env.RESEND_API_KEY?.trim()) {
		return "resend";
	}
	const user = process.env.EMAIL_USER?.trim();
	const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
	if (
		user &&
		pass &&
		user !== "your_email@gmail.com" &&
		pass !== "your_gmail_app_password"
	) {
		return "smtp";
	}
	return "mock";
}

function getSenderInfo(fromName?: string) {
	const senderName = fromName || process.env.EMAIL_FROM_NAME || "Open Smile";
	const user = process.env.EMAIL_USER?.trim();
	const fromAddress =
		process.env.EMAIL_FROM?.trim() || user || "no-reply@opensmile.app";
	const formattedFrom = `"${senderName}" <${fromAddress}>`;
	return { senderName, fromAddress, formattedFrom };
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

async function sendViaResend(
	apiKey: string,
	from: string,
	to: string,
	subject: string,
	html: string,
	text: string,
	replyTo?: string
): Promise<{ id: string }> {
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to: [to],
			subject,
			html,
			text,
			...(replyTo ? { reply_to: replyTo } : {}),
		}),
	});

	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`Resend API error (${res.status}): ${errText}`);
	}

	const data = (await res.json()) as { id: string };
	return { id: data.id || "resend-ok" };
}

function createSmtpTransporter() {
	const host = process.env.EMAIL_HOST?.trim();
	const user = process.env.EMAIL_USER?.trim();
	const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

	if (host) {
		const port = Number(process.env.EMAIL_PORT) || 587;
		const secure =
			process.env.EMAIL_SECURE === "true" || port === 465;
		return nodemailer.createTransport({
			host,
			port,
			secure,
			auth: { user: user ?? "", pass: pass ?? "" },
		});
	}

	return nodemailer.createTransport({
		service: "gmail",
		auth: { user: user ?? "", pass: pass ?? "" },
	});
}

export async function sendEmailSafe(input: EmailInput): Promise<SendEmailResult> {
	const { to, subject, text, fromName, replyTo, template = "custom", userId, category, metadata } = input;
	const provider = getActiveProvider();
	const { formattedFrom } = getSenderInfo(fromName);
	const resolvedHtml = input.html ?? textToHtml(text, subject);

	try {
		const settings = (await getSystemSettingsMap().catch(() => ({}))) as Record<string, any>;
		if (settings.email_service_enabled === false) {
			await insertEmailLog({
				recipient_email: to,
				user_id: userId,
				template,
				subject,
				status: "disabled",
				provider,
				metadata: { ...metadata, reason: "email_service_enabled_is_false" },
			}).catch(() => {});

			return {
				success: false,
				status: "disabled",
				provider,
				error: "Email service is disabled in system settings",
			};
		}

		const suppressed = await isEmailSuppressed(to, category).catch(() => false);
		if (suppressed) {
			await insertEmailLog({
				recipient_email: to,
				user_id: userId,
				template,
				subject,
				status: "suppressed",
				provider,
				metadata: { ...metadata, reason: "recipient_in_suppression_list" },
			}).catch(() => {});

			return {
				success: false,
				status: "suppressed",
				provider,
				error: "Recipient is suppressed from receiving emails",
			};
		}

		if (userId && category) {
			try {
				const prefs = await getUserNotificationPreferences(userId);
				if (category === "security" && prefs.security_emails === false) {
					return { success: false, status: "suppressed", provider, error: "User opted out of security emails" };
				}
				if (category === "streaks" && prefs.streak_reminders === false) {
					return { success: false, status: "suppressed", provider, error: "User opted out of streak emails" };
				}
				if (category === "rewards" && prefs.reward_alerts === false) {
					return { success: false, status: "suppressed", provider, error: "User opted out of reward emails" };
				}
				if (category === "leaderboard" && prefs.leaderboard_alerts === false) {
					return { success: false, status: "suppressed", provider, error: "User opted out of leaderboard emails" };
				}
				if (category === "marketing" && prefs.marketing_emails === false) {
					return { success: false, status: "suppressed", provider, error: "User opted out of marketing emails" };
				}
			} catch {}
		}

		if (provider === "mock") {
			devLog(to, subject, text, formattedFrom);
			await insertEmailLog({
				recipient_email: to,
				user_id: userId,
				template,
				subject,
				status: "dev_logged",
				provider: "mock",
				message_id: `dev-${Date.now()}`,
				metadata,
			}).catch(() => {});

			return {
				success: true,
				status: "dev_logged",
				provider: "mock",
				messageId: `dev-${Date.now()}`,
			};
		}

		if (provider === "resend") {
			const apiKey = process.env.RESEND_API_KEY!.trim();
			try {
				const result = await sendViaResend(
					apiKey,
					formattedFrom,
					to,
					subject,
					resolvedHtml,
					text,
					replyTo
				);

				await insertEmailLog({
					recipient_email: to,
					user_id: userId,
					template,
					subject,
					status: "sent",
					provider: "resend",
					message_id: result.id,
					metadata,
				}).catch(() => {});

				return {
					success: true,
					status: "sent",
					provider: "resend",
					messageId: result.id,
				};
			} catch (resendErr) {
				const errorMsg = resendErr instanceof Error ? resendErr.message : String(resendErr);
				await insertEmailLog({
					recipient_email: to,
					user_id: userId,
					template,
					subject,
					status: "failed",
					provider: "resend",
					error: errorMsg,
					metadata,
				}).catch(() => {});

				return {
					success: false,
					status: "failed",
					provider: "resend",
					error: errorMsg,
				};
			}
		}

		const transporter = createSmtpTransporter();
		const info = await transporter.sendMail({
			from: formattedFrom,
			to,
			subject,
			text,
			html: resolvedHtml,
			...(replyTo ? { replyTo } : {}),
		});

		await insertEmailLog({
			recipient_email: to,
			user_id: userId,
			template,
			subject,
			status: "sent",
			provider: "smtp",
			message_id: info.messageId,
			metadata,
		}).catch(() => {});

		return {
			success: true,
			status: "sent",
			provider: "smtp",
			messageId: info.messageId,
		};
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		await insertEmailLog({
			recipient_email: to,
			user_id: userId,
			template,
			subject,
			status: "failed",
			provider,
			error: errorMsg,
			metadata,
		}).catch(() => {});

		return {
			success: false,
			status: "failed",
			provider,
			error: errorMsg,
		};
	}
}

export async function sendEmail(input: EmailInput): Promise<void> {
	const result = await sendEmailSafe(input);
	if (!result.success && result.status === "failed") {
		throw new Error(result.error || `Failed to send email to ${input.to}`);
	}
}

export async function verifyMailTransport(): Promise<MailerDiagnostics> {
	const provider = getActiveProvider();
	const hasResendKey = Boolean(process.env.RESEND_API_KEY?.trim());
	const hasSmtpUser = Boolean(process.env.EMAIL_USER?.trim());
	const hasSmtpPass = Boolean(process.env.EMAIL_PASS?.trim());
	const smtpHost = process.env.EMAIL_HOST?.trim() || "smtp.gmail.com";
	const smtpPort = Number(process.env.EMAIL_PORT) || 587;
	const { fromAddress } = getSenderInfo();

	const details = {
		hasResendKey,
		hasSmtpUser,
		hasSmtpPass,
		smtpHost,
		smtpPort,
		fromAddress,
	};

	if (provider === "mock") {
		return {
			healthy: true,
			provider: "mock",
			latencyMs: 1,
			details,
		};
	}

	if (provider === "resend") {
		const start = Date.now();
		try {
			const res = await fetch("https://api.resend.com/api-keys", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
				},
			});
			const latencyMs = Date.now() - start;
			if (res.ok) {
				return {
					healthy: true,
					provider: "resend",
					latencyMs,
					details,
				};
			}
			return {
				healthy: false,
				provider: "resend",
				latencyMs,
				error: `Resend authentication check returned status ${res.status}`,
				details,
			};
		} catch (err) {
			return {
				healthy: false,
				provider: "resend",
				latencyMs: Date.now() - start,
				error: err instanceof Error ? err.message : String(err),
				details,
			};
		}
	}

	const start = Date.now();
	try {
		const transporter = createSmtpTransporter();
		await transporter.verify();
		const latencyMs = Date.now() - start;
		return {
			healthy: true,
			provider: "smtp",
			latencyMs,
			details,
		};
	} catch (err) {
		return {
			healthy: false,
			provider: "smtp",
			latencyMs: Date.now() - start,
			error: err instanceof Error ? err.message : String(err),
			details,
		};
	}
}

