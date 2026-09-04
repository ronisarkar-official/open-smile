export type EmailTemplateType =
	| 'otp'
	| 'welcome'
	| 'login-alert'
	| 'reset-password'
	| 'streak-reminder'
	| 'reward-unlocked'
	| 'broadcast'
	| 'custom';

export type EmailProviderType = 'resend' | 'smtp' | 'mock';

export type EmailLogStatus =
	| 'sent'
	| 'dev_logged'
	| 'failed'
	| 'suppressed'
	| 'disabled';

export type EmailCategory =
	| 'security'
	| 'streaks'
	| 'rewards'
	| 'leaderboard'
	| 'marketing'
	| 'system';

export type EmailInput = {
	to: string;
	subject: string;
	text: string;
	html?: string;
	fromName?: string;
	replyTo?: string;
	template?: EmailTemplateType;
	userId?: string;
	category?: EmailCategory;
	metadata?: Record<string, unknown>;
};

export type SendEmailResult = {
	success: boolean;
	messageId?: string;
	error?: string;
	provider: EmailProviderType;
	status: EmailLogStatus;
};

export type MailerDiagnostics = {
	healthy: boolean;
	provider: EmailProviderType;
	latencyMs?: number;
	error?: string;
	details: {
		hasResendKey: boolean;
		hasSmtpUser: boolean;
		hasSmtpPass: boolean;
		smtpHost: string;
		smtpPort: number;
		fromAddress: string;
	};
};

