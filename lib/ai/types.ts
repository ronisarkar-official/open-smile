export type AIProvider =
	| 'custom'
	| 'groq'
	| 'openrouter'
	| 'openai'
	| 'gemini'
	| 'deepseek'
	| 'mistral'
	| 'ollama';

export interface AIConfig {
	enabled: boolean;
	provider: AIProvider;
	apiKey: string;
	baseUrl: string;
	model: string;
	temperature: number;
	maxTokens: number;
	systemPersona: string;
}

export interface AIProviderPreset {
	id: AIProvider;
	name: string;
	defaultBaseUrl: string;
	defaultModel: string;
	placeholderKey: string;
	description: string;
}

export const AI_PROVIDER_PRESETS: Record<AIProvider, AIProviderPreset> = {
	custom: {
		id: 'custom',
		name: 'Custom (OpenAI-Compatible)',
		defaultBaseUrl: 'https://api.openai.com/v1',
		defaultModel: 'gpt-4o-mini',
		placeholderKey: 'Enter your custom API key...',
		description: 'Connect any OpenAI-compatible API endpoint, local LLM gateway, or proxy.',
	},
	groq: {
		id: 'groq',
		name: 'Groq Cloud',
		defaultBaseUrl: 'https://api.groq.com/openai/v1',
		defaultModel: 'llama-3.3-70b-versatile',
		placeholderKey: 'gsk_...',
		description: 'Ultra low-latency open models running on LPU inference.',
	},
	openrouter: {
		id: 'openrouter',
		name: 'OpenRouter',
		defaultBaseUrl: 'https://openrouter.ai/api/v1',
		defaultModel: 'openai/gpt-4o-mini',
		placeholderKey: 'sk-or-v1-...',
		description: 'Unified gateway to Claude 3.5, GPT-4o, DeepSeek, and Llama models.',
	},
	openai: {
		id: 'openai',
		name: 'OpenAI',
		defaultBaseUrl: 'https://api.openai.com/v1',
		defaultModel: 'gpt-4o-mini',
		placeholderKey: 'sk-proj-...',
		description: 'Official OpenAI GPT-4o and GPT-4o-mini models.',
	},
	gemini: {
		id: 'gemini',
		name: 'Google Gemini',
		defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
		defaultModel: 'gemini-2.5-flash',
		placeholderKey: 'AIzaSy...',
		description: 'Google AI Gemini 2.5 Flash via standard OpenAI-compatible protocol.',
	},
	deepseek: {
		id: 'deepseek',
		name: 'DeepSeek',
		defaultBaseUrl: 'https://api.deepseek.com/v1',
		defaultModel: 'deepseek-chat',
		placeholderKey: 'sk-...',
		description: 'High-capability cost-effective reasoning and chat models.',
	},
	mistral: {
		id: 'mistral',
		name: 'Mistral AI',
		defaultBaseUrl: 'https://api.mistral.ai/v1',
		defaultModel: 'mistral-small-latest',
		placeholderKey: 'mis_...',
		description: 'European frontier models including Mistral Small and Large.',
	},
	ollama: {
		id: 'ollama',
		name: 'Ollama (Local AI)',
		defaultBaseUrl: 'http://localhost:11434/v1',
		defaultModel: 'llama3',
		placeholderKey: 'ollama-local',
		description: 'Self-hosted models running locally on your hardware without cloud fees.',
	},
};

export const DEFAULT_AI_CONFIG: AIConfig = {
	enabled: true,
	provider: 'gemini',
	apiKey: '',
	baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
	model: 'gemini-2.5-flash',
	temperature: 0.7,
	maxTokens: 2500,
	systemPersona:
		'You are the creative copywriter and community gamification specialist for Open Smile, a high-energy facial-recognition rewards platform with a bold Neubrutalist personality. Your tone is energetic, encouraging, witty, and motivating without being spammy. You inspire users to smile, climb the leaderboards, keep their streaks alive, and redeem Amazon gift vouchers.',
};

export interface AIUserContext {
	id?: string;
	name?: string;
	email?: string;
	streak_count?: number;
	coin_balance?: number;
	role?: string;
}

export interface AIGenerateRequest {
	type: 'notification' | 'email';
	topic: string;
	tone?: 'energetic' | 'urgent' | 'friendly' | 'celebratory' | 'professional';
	audience: 'all' | 'specific';
	user?: AIUserContext | null;
	category?: string;
	template?: string;
}

export interface AINotificationDraft {
	title: string;
	description: string;
	category: 'system' | 'rewards' | 'streaks' | 'leaderboard' | 'social';
	icon_type: 'bell' | 'flame' | 'gift' | 'trophy' | 'sparkles' | 'camera' | 'shield' | 'alert';
	action_label: string;
	action_url: string;
}

export interface AIEmailDraft {
	subject: string;
	headline: string;
	body: string;
	cta_label: string;
	cta_url: string;
}

export interface AITestResult {
	healthy: boolean;
	latencyMs: number;
	provider: string;
	model: string;
	sampleResponse?: string;
	error?: string;
}
