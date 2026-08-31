import crypto from "crypto";

const TICKET_TTL_MS = 5 * 60 * 1000;

function getSecret(): string {
	const secret = process.env.BETTER_AUTH_SECRET;
	if (!secret) {
		throw new Error("BETTER_AUTH_SECRET is required for ticket signing");
	}
	return secret;
}

interface TicketPayload {
	email: string;
	type: "login" | "signup";
	userId?: string;
	passwordHash?: string;
	name?: string;
	iat: number;
	exp: number;
}

export function createAuthTicket(params: {
	email: string;
	type: "login" | "signup";
	userId?: string;
	passwordHash?: string;
	name?: string;
}): string {
	const now = Date.now();
	const payload: TicketPayload = {
		...params,
		iat: now,
		exp: now + TICKET_TTL_MS,
	};

	const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
	const signature = crypto
		.createHmac("sha256", getSecret())
		.update(payloadB64)
		.digest("base64url");

	return `${payloadB64}.${signature}`;
}

export function verifyAuthTicket<T extends TicketPayload = TicketPayload>(
	ticket: string,
	expectedType: "login" | "signup",
): { valid: boolean; payload: T | null } {
	const parts = ticket.split(".");
	if (parts.length !== 2) {
		return { valid: false, payload: null };
	}

	const [payloadB64, providedSig] = parts;

	const expectedSig = crypto
		.createHmac("sha256", getSecret())
		.update(payloadB64)
		.digest("base64url");

	const sigBuf = Buffer.from(providedSig, "base64url");
	const expectedBuf = Buffer.from(expectedSig, "base64url");
	if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
		return { valid: false, payload: null };
	}

	try {
		const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as T;

		if (payload.type !== expectedType) {
			return { valid: false, payload: null };
		}

		if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
			return { valid: false, payload: null };
		}

		return { valid: true, payload };
	} catch {
		return { valid: false, payload: null };
	}
}
