import { NextRequest, NextResponse } from 'next/server';
import { requireServerAdmin } from '@/lib/auth/session';
import {
	getActiveAIConfig,
	generateNotificationDraft,
	generateEmailDraft,
} from '@/lib/ai/client';
import type { AIGenerateRequest } from '@/lib/ai/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = (await req.json().catch(() => ({}))) as AIGenerateRequest;

		if (!body?.type || !['notification', 'email'].includes(body.type)) {
			return NextResponse.json(
				{ error: "Invalid type: must be 'notification' or 'email'" },
				{ status: 400 },
			);
		}

		if (!body.topic || !body.topic.trim()) {
			return NextResponse.json(
				{ error: 'Prompt topic is required to generate copy' },
				{ status: 400 },
			);
		}

		const config = await getActiveAIConfig();

		if (!config.enabled) {
			return NextResponse.json(
				{ error: 'AI Assistant is currently disabled in Admin Settings > AI Engine' },
				{ status: 400 },
			);
		}

		if (body.type === 'notification') {
			const draft = await generateNotificationDraft(config, body);
			return NextResponse.json({ success: true, draft, provider: config.provider, model: config.model });
		} else {
			const draft = await generateEmailDraft(config, body);
			return NextResponse.json({ success: true, draft, provider: config.provider, model: config.model });
		}
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || 'Failed to generate AI copy' },
			{ status: 500 },
		);
	}
}
