import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/services";
import { ensureIndexes, insertContactMessage } from "@/lib/db";
import { sendContactNotificationEmail } from "@/lib/mailer";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 3;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string {
	const forwarded = req.headers.get("x-forwarded-for");
	return forwarded ? forwarded.split(",")[0].trim() : "unknown_ip";
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json().catch(() => null);
		if (!body || typeof body !== "object") {
			return NextResponse.json(
				{ error: "Invalid JSON payload." },
				{ status: 400 },
			);
		}

		const { name, email, subject, message } = body;

		if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
			return NextResponse.json(
				{ error: "Please provide a valid name between 2 and 100 characters." },
				{ status: 400 },
			);
		}

		if (typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.trim().length > 150) {
			return NextResponse.json(
				{ error: "Please provide a valid email address." },
				{ status: 400 },
			);
		}

		if (typeof subject !== "string" || subject.trim().length < 2 || subject.trim().length > 150) {
			return NextResponse.json(
				{ error: "Please provide a subject between 2 and 150 characters." },
				{ status: 400 },
			);
		}

		if (typeof message !== "string" || message.trim().length < 5 || message.trim().length > 3000) {
			return NextResponse.json(
				{ error: "Please provide a message between 5 and 3000 characters." },
				{ status: 400 },
			);
		}

		const cleanName = name.trim();
		const cleanEmail = email.trim().toLowerCase();
		const cleanSubject = subject.trim();
		const cleanMessage = message.trim();
		const ip = getClientIp(req);

		const [byEmail, byIp] = await Promise.all([
			rateLimit(`contact-email:${cleanEmail}`, MAX_PER_EMAIL, WINDOW_MS),
			rateLimit(`contact-ip:${ip}`, MAX_PER_IP, WINDOW_MS),
		]);

		if (!byEmail.allowed || !byIp.allowed) {
			const retryAfter = Math.max(byEmail.retryAfter, byIp.retryAfter);
			return NextResponse.json(
				{ error: "Too many messages sent. Please wait a few minutes before trying again." },
				{
					status: 429,
					headers: { "Retry-After": String(retryAfter) },
				},
			);
		}

		let savedInDb = false;
		if (Boolean(process.env.DATABASE_URL)) {
			try {
				await ensureIndexes();
				await insertContactMessage({
					name: cleanName,
					email: cleanEmail,
					subject: cleanSubject,
					message: cleanMessage,
					ip,
				});
				savedInDb = true;
			} catch (dbError) {
				console.error("[Contact API] Database save error:", dbError);
			}
		}

		const emailResult = await sendContactNotificationEmail({
			name: cleanName,
			email: cleanEmail,
			subject: cleanSubject,
			message: cleanMessage,
			ip,
		}).catch((err) => {
			console.error("[Contact API] Email sending error:", err);
			return { success: false, status: "failed" as const, provider: "mock" as const, error: String(err) };
		});

		if (!emailResult.success && !savedInDb) {
			return NextResponse.json(
				{ error: "Failed to deliver your message. Please try again later or email us directly." },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Your message has been received! Our team will get back to you shortly.",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("[Contact API] Unexpected error:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred. Please try again later." },
			{ status: 500 },
		);
	}
}
