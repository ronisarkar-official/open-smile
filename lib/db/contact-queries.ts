import { getPool } from "./client";

export interface ContactMessageRow {
	id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	ip: string | null;
	user_id: string | null;
	status: string;
	created_at: Date;
}

export interface InsertContactMessageParams {
	name: string;
	email: string;
	subject: string;
	message: string;
	ip?: string;
	userId?: string;
}

export async function insertContactMessage(params: InsertContactMessageParams): Promise<ContactMessageRow> {
	const pool = getPool();
	const { rows } = await pool.query(
		`INSERT INTO contact_messages (name, email, subject, message, ip, user_id)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, name, email, subject, message, ip, user_id, status, created_at`,
		[
			params.name.trim(),
			params.email.trim().toLowerCase(),
			params.subject.trim(),
			params.message.trim(),
			params.ip ?? null,
			params.userId ?? null,
		],
	);

	return rows[0];
}

export async function listContactMessages(limit = 50, offset = 0): Promise<ContactMessageRow[]> {
	const pool = getPool();
	const { rows } = await pool.query(
		`SELECT id, name, email, subject, message, ip, user_id, status, created_at
		 FROM contact_messages
		 ORDER BY created_at DESC
		 LIMIT $1 OFFSET $2`,
		[limit, offset],
	);

	return rows;
}
