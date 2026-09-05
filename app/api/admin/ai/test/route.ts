import { NextRequest, NextResponse } from 'next/server';
import { requireServerAdmin } from '@/lib/auth/session';
import { getActiveAIConfig, testAIConnection } from '@/lib/ai/client';
import type { AIConfig } from '@/lib/ai/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
	try {
		const { user, error } = await requireServerAdmin();
		if (!user) return error;

		const body = await req.json().catch(() => ({}));
		const activeConfig = await getActiveAIConfig();

		const configToTest: AIConfig = {
			enabled: body.enabled !== undefined ? Boolean(body.enabled) : activeConfig.enabled,
			provider: body.provider || activeConfig.provider,
			apiKey: body.apiKey !== undefined && body.apiKey.trim() !== '' ? body.apiKey.trim() : activeConfig.apiKey,
			baseUrl: body.baseUrl !== undefined && body.baseUrl.trim() !== '' ? body.baseUrl.trim().replace(/\/+$/, '') : activeConfig.baseUrl,
			model: body.model !== undefined && body.model.trim() !== '' ? body.model.trim() : activeConfig.model,
			temperature: typeof body.temperature === 'number' ? body.temperature : activeConfig.temperature,
			maxTokens: typeof body.maxTokens === 'number' ? body.maxTokens : activeConfig.maxTokens,
			systemPersona: body.systemPersona || activeConfig.systemPersona,
		};

		const result = await testAIConnection(configToTest);

		return NextResponse.json({
			success: result.healthy,
			...result,
		});
	} catch (err: any) {
		return NextResponse.json(
			{
				success: false,
				healthy: false,
				error: err?.message || 'Failed to test AI provider connection',
			},
			{ status: 500 },
		);
	}
}
