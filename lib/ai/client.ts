import { getSystemSettingsMap } from '@/lib/db';
import {
	AIConfig,
	DEFAULT_AI_CONFIG,
	AIGenerateRequest,
	AINotificationDraft,
	AIEmailDraft,
	AITestResult,
} from './types';

export function maskApiKey(key: string): string {
	if (!key) return '';
	const trimmed = key.trim();
	if (trimmed.length <= 8) return '••••••••';
	return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
}

export async function getActiveAIConfig(): Promise<AIConfig> {
	const settings = await getSystemSettingsMap();
	const stored = settings.ai_config as Partial<AIConfig> | undefined;

	const envKey =
		process.env.GEMINI_API_KEY ||
		process.env.OPENAI_API_KEY ||
		process.env.GROQ_API_KEY ||
		process.env.OPENROUTER_API_KEY ||
		'';

	const envProvider = process.env.GROQ_API_KEY
		? 'groq'
		: process.env.OPENROUTER_API_KEY
		? 'openrouter'
		: process.env.OPENAI_API_KEY
		? 'openai'
		: process.env.GEMINI_API_KEY
		? 'gemini'
		: 'custom';

	const provider = stored?.provider || envProvider;

	let baseUrl = stored?.baseUrl;
	if (!baseUrl) {
		if (provider === 'groq') baseUrl = 'https://api.groq.com/openai/v1';
		else if (provider === 'openrouter') baseUrl = 'https://openrouter.ai/api/v1';
		else if (provider === 'gemini') baseUrl = 'https://generativelanguage.googleapis.com/v1beta/openai';
		else if (provider === 'deepseek') baseUrl = 'https://api.deepseek.com/v1';
		else if (provider === 'ollama') baseUrl = 'http://localhost:11434/v1';
		else baseUrl = 'https://api.openai.com/v1';
	}

	let model = stored?.model;
	if (!model) {
		if (provider === 'groq') model = 'llama-3.3-70b-versatile';
		else if (provider === 'openrouter') model = 'openai/gpt-4o-mini';
		else if (provider === 'gemini') model = 'gemini-2.5-flash';
		else if (provider === 'deepseek') model = 'deepseek-chat';
		else if (provider === 'ollama') model = 'llama3';
		else model = 'gpt-4o-mini';
	}

	const apiKey = stored?.apiKey?.trim() || envKey.trim();

	return {
		enabled: stored?.enabled ?? DEFAULT_AI_CONFIG.enabled,
		provider,
		apiKey,
		baseUrl: baseUrl.replace(/\/+$/, ''),
		model,
		temperature: typeof stored?.temperature === 'number' ? stored.temperature : DEFAULT_AI_CONFIG.temperature,
		maxTokens: typeof stored?.maxTokens === 'number' ? stored.maxTokens : DEFAULT_AI_CONFIG.maxTokens,
		systemPersona: stored?.systemPersona || DEFAULT_AI_CONFIG.systemPersona,
	};
}

export async function callAICompletion(
	config: AIConfig,
	messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
	options?: { jsonMode?: boolean; maxTokens?: number; temperature?: number },
): Promise<string> {
	if (!config.apiKey && config.provider !== 'ollama') {
		throw new Error(
			'AI API key is missing. Please configure your API key in Admin Settings > AI Engine or set GEMINI_API_KEY / OPENAI_API_KEY in environment variables.',
		);
	}

	const endpoint = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (config.apiKey) {
		headers['Authorization'] = `Bearer ${config.apiKey}`;
	}

	if (config.provider === 'openrouter') {
		headers['HTTP-Referer'] = 'https://opensmile.app';
		headers['X-Title'] = 'Open Smile Admin AI';
	}

	const payload: Record<string, any> = {
		model: config.model,
		messages,
		temperature: options?.temperature ?? config.temperature ?? 0.7,
		max_tokens: options?.maxTokens ?? Math.max(config.maxTokens ?? 2500, 2500),
	};

	if (options?.jsonMode) {
		payload.response_format = { type: 'json_object' };
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 35000);

	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
			signal: controller.signal,
		});

		if (!res.ok) {
			const errorText = await res.text().catch(() => '');
			let parsedError = errorText;
			try {
				const jsonErr = JSON.parse(errorText);
				parsedError = jsonErr.error?.message || jsonErr.message || errorText;
			} catch {}

			throw new Error(`AI Provider returned HTTP ${res.status}: ${parsedError}`);
		}

		const data = await res.json();
		const messageContent = data?.choices?.[0]?.message?.content;

		if (typeof messageContent !== 'string') {
			throw new Error('AI Provider returned an invalid or empty message payload.');
		}

		return messageContent.trim();
	} catch (err: any) {
		if (err.name === 'AbortError') {
			throw new Error('AI Provider request timed out after 35 seconds. Check endpoint responsiveness.');
		}
		throw err;
	} finally {
		clearTimeout(timeout);
	}
}

export async function testAIConnection(config: AIConfig): Promise<AITestResult> {
	const startTime = Date.now();
	try {
		const sampleResponse = await callAICompletion(
			config,
			[
				{
					role: 'system',
					content: 'You are an AI health check agent. Return a short confirmation response.',
				},
				{
					role: 'user',
					content: 'Confirm connection in 5 words or less.',
				},
			],
			{ maxTokens: 200, temperature: 0.2 },
		);

		const latencyMs = Date.now() - startTime;
		return {
			healthy: true,
			latencyMs,
			provider: config.provider,
			model: config.model,
			sampleResponse,
		};
	} catch (err: any) {
		const latencyMs = Date.now() - startTime;
		return {
			healthy: false,
			latencyMs,
			provider: config.provider,
			model: config.model,
			error: err?.message || 'Connection test failed',
		};
	}
}

function parseJsonClean<T>(rawText: string): T {
	let text = rawText.trim();
	if (text.startsWith('```json')) {
		text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
	} else if (text.startsWith('```')) {
		text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
	}
	text = text.trim();

	const startIdx = text.indexOf('{');
	const endIdx = text.lastIndexOf('}');
	if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
		text = text.substring(startIdx, endIdx + 1);
	}

	try {
		return JSON.parse(text) as T;
	} catch {
		const sanitized = text
			.replace(/,\s*([\]}])/g, '$1')
			.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
		return JSON.parse(sanitized) as T;
	}
}

export async function generateNotificationDraft(
	config: AIConfig,
	request: AIGenerateRequest,
): Promise<AINotificationDraft> {
	const isSingle = request.audience === 'specific';
	const user = request.user;

	const audienceContext = isSingle
		? `[AUDIENCE: SINGLE SPECIFIC USER]
Recipient: ${user?.name || 'Smiler'}
Email: ${user?.email || 'unspecified'}
Current Daily Streak: ${user?.streak_count ?? 0} days
Coin Balance: ${user?.coin_balance ?? 0} coins
Role: ${user?.role || 'user'}

REQUIREMENT FOR SINGLE USER:
Write highly personalized, direct 1-on-1 copy addressing ${user?.name || 'them'} directly. Mention their ${user?.streak_count ?? 0}-day streak and ${user?.coin_balance ?? 0} coins if relevant to celebrate or challenge them. Make it feel personally delivered.`
		: `[AUDIENCE: ALL SMILERS (MASS COMMUNITY BROADCAST)]
Target: Every registered smiler across the entire Open Smile platform.

REQUIREMENT FOR ALL USERS:
Write high-energy, broad community announcement copy. Do NOT mention individual user metrics or specific personal streaks. Use exciting, inclusive language about community events, coin multipliers, leaderboard updates, voucher drops, or platform milestones.`;

	const systemPrompt = `${config.systemPersona}

You are drafting an in-app push notification for the Open Smile Admin broadcast system.
You MUST output ONLY valid JSON matching this exact structure:
{
  "title": "Short, punchy title under 60 chars (with 1 emoji)",
  "description": "Engaging description between 50 and 160 characters",
  "category": "system" | "rewards" | "streaks" | "leaderboard" | "social",
  "icon_type": "bell" | "flame" | "gift" | "trophy" | "sparkles" | "camera" | "alert",
  "action_label": "Short button CTA under 25 chars, e.g. 'Smile Now 📸' or 'View Rewards 🎁'",
  "action_url": "Relative app URL, e.g. '/capture', '/rewards', '/leaderboard', or '/dashboard'"
}

${audienceContext}`;

	const userPrompt = `Admin Topic & Instructions: "${request.topic || 'General engagement reminder'}"
Desired Tone: "${request.tone || 'energetic'}"
Category Preference: "${request.category || 'system'}"

Generate the notification JSON now.`;

	const rawResponse = await callAICompletion(
		config,
		[
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt },
		],
		{ jsonMode: true, maxTokens: 2500, temperature: request.tone === 'urgent' ? 0.4 : 0.75 },
	);

	const parsed = parseJsonClean<Partial<AINotificationDraft>>(rawResponse);

	return {
		title: parsed.title || 'Special Open Smile Update! 🎉',
		description:
			parsed.description ||
			'Smile today to keep your daily streak alive and boost your coin multiplier.',
		category: (['system', 'rewards', 'streaks', 'leaderboard', 'social'].includes(
			parsed.category as any,
		)
			? parsed.category
			: 'system') as any,
		icon_type: (['bell', 'flame', 'gift', 'trophy', 'sparkles', 'camera', 'alert'].includes(
			parsed.icon_type as any,
		)
			? parsed.icon_type
			: 'bell') as any,
		action_label: parsed.action_label || 'Check It Out 🚀',
		action_url: parsed.action_url || '/capture',
	};
}

export async function generateEmailDraft(
	config: AIConfig,
	request: AIGenerateRequest,
): Promise<AIEmailDraft> {
	const isSingle = request.audience === 'specific';
	const user = request.user;

	const audienceContext = isSingle
		? `[AUDIENCE: SINGLE EMAIL RECIPIENT]
Recipient Name: ${user?.name || 'Smiler'}
Email: ${user?.email || 'smiler@example.com'}
Current Streak: ${user?.streak_count ?? 0} days
Coin Balance: ${user?.coin_balance ?? 0} coins

REQUIREMENT FOR SINGLE EMAIL:
Address the recipient personally as "${user?.name || 'Smiler'}". Personalize the body by referencing their current progress (${user?.streak_count ?? 0}-day streak, ${user?.coin_balance ?? 0} coins) to give them tailored motivation.`
		: `[AUDIENCE: ALL USERS / BROADCAST CAMPAIGN]
Target: All Open Smile smilers and waitlist subscribers.

REQUIREMENT FOR BROADCAST:
Craft a high-impact newsletter/announcement suitable for every recipient. Focus on collective achievements, platform features, new voucher additions, or community challenges.`;

	const systemPrompt = `${config.systemPersona}

You are writing an official email campaign for Open Smile.
The email body will be rendered in Markdown.
You MUST output ONLY valid JSON matching this exact structure:
{
  "subject": "Catchy email subject line under 60 chars (with 1-2 emoji)",
  "headline": "Bold hero headline under 80 chars",
  "body": "Well-structured Markdown text with bold accents, bullet points, and an encouraging tone (2-4 concise paragraphs)",
  "cta_label": "Button text, e.g. 'Claim Your Rewards 🎁' or 'Keep Your Streak Alive ⚡'",
  "cta_url": "Destination link, e.g. '/capture', '/rewards', or '/leaderboard'"
}

${audienceContext}`;

	const userPrompt = `Campaign Topic: "${request.topic || 'Exciting community update'}"
Desired Tone: "${request.tone || 'energetic'}"
Template Style: "${request.template || 'broadcast'}"

Generate the email draft JSON now.`;

	const rawResponse = await callAICompletion(
		config,
		[
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt },
		],
		{ jsonMode: true, maxTokens: 2500, temperature: request.tone === 'urgent' ? 0.35 : 0.75 },
	);

	const parsed = parseJsonClean<Partial<AIEmailDraft>>(rawResponse);

	return {
		subject: parsed.subject || 'Exciting News from Open Smile! 🎉',
		headline: parsed.headline || 'Your Daily Smile Awaits!',
		body:
			parsed.body ||
			'Keep your daily streak going and turn your smiles into Amazon vouchers today.',
		cta_label: parsed.cta_label || 'Take Your Smile 📸',
		cta_url: parsed.cta_url || '/capture',
	};
}
