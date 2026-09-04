'use client';

import * as React from 'react';
import {
	Mail,
	Send,
	CheckCircle2,
	XCircle,
	Radio,
	RefreshCw,
	Layers,
	Eye,
	Clock,
	RotateCw,
	ShieldAlert,
	Search,
	Check,
	Info,
	Activity,
	KeyRound,
	UserPlus,
	Shield,
	Flame,
	Gift,
	SlidersHorizontal,
	Trash2,
	Plus,
	ExternalLink,
	Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { EmailTemplateType, MailerDiagnostics } from '@/lib/mailer/types';
import { AdminUserCombobox } from '@/components/admin/admin-user-combobox';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { MarkdownView } from '@/components/ui/markdown-view';

interface EmailLogItem {
	id: string;
	recipient_email: string;
	user_id: string | null;
	template: string;
	subject: string;
	status: string;
	provider: string;
	message_id: string | null;
	error: string | null;
	metadata: Record<string, unknown> | null;
	created_at: string;
}

interface MailerStats {
	totalSent: number;
	sentToday: number;
	successRate: number;
	activeProvider: string;
	suppressedCount: number;
	totalFailed: number;
}

interface SuppressionItem {
	email: string;
	reason: string;
	category: string;
	created_at: string;
}

const TEMPLATES: { id: EmailTemplateType; label: string; description: string }[] = [
	{ id: 'otp', label: 'One-Time Passcode (OTP)', description: '6-digit high contrast authentication code' },
	{ id: 'welcome', label: 'Welcome Onboarding', description: 'Gamified smiler onboarding and quick start CTA' },
	{ id: 'login-alert', label: 'Login Security Alert', description: 'New device / IP security detection notice' },
	{ id: 'reset-password', label: 'Password Reset', description: 'Time-limited password recovery token link' },
	{ id: 'streak-reminder', label: 'Daily Streak Expiration', description: 'Reminder before midnight IST to preserve streak' },
	{ id: 'reward-unlocked', label: 'Reward & Voucher Won', description: 'Prize unlock notification with voucher code' },
	{ id: 'broadcast', label: 'Official Announcement', description: 'Custom rich newsletter or community broadcast' },
];

export default function AdminMailerPage() {
	const [activeTab, setActiveTab] = React.useState<'dispatcher' | 'logs' | 'diagnostics' | 'suppressions'>('dispatcher');
	const [stats, setStats] = React.useState<MailerStats>({
		totalSent: 0,
		sentToday: 0,
		successRate: 100,
		activeProvider: 'Mock (Development)',
		suppressedCount: 0,
		totalFailed: 0,
	});

	const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplateType>('welcome');
	const [audience, setAudience] = React.useState<'single' | 'admin_team' | 'waitlist' | 'all_users'>('single');
	const [targetEmail, setTargetEmail] = React.useState('');
	const [recipientName, setRecipientName] = React.useState('Smiler');
	const [subject, setSubject] = React.useState('Welcome to Open Smile! 🎉');
	const [headline, setHeadline] = React.useState('Welcome aboard, Smiler! 🎉');
	const [bodyContent, setBodyContent] = React.useState(
		'Your Open Smile account is live. Start smiling today to unlock daily coin multipliers and redeem Amazon vouchers.',
	);
	const [ctaLabel, setCtaLabel] = React.useState('Take Your First Smile 📸');
	const [ctaUrl, setCtaUrl] = React.useState('/capture');
	const [isDispatching, setIsDispatching] = React.useState(false);

	const [logs, setLogs] = React.useState<EmailLogItem[]>([]);
	const [logsPage, setLogsPage] = React.useState(1);
	const [logsTotalPages, setLogsTotalPages] = React.useState(1);
	const [logsSearch, setLogsSearch] = React.useState('');
	const [logsStatus, setLogsStatus] = React.useState('all');
	const [logsTemplate, setLogsTemplate] = React.useState('all');
	const [isLoadingLogs, setIsLoadingLogs] = React.useState(false);
	const [selectedLogDetail, setSelectedLogDetail] = React.useState<EmailLogItem | null>(null);
	const [resendingLogId, setResendingLogId] = React.useState<string | null>(null);

	const [diagnostics, setDiagnostics] = React.useState<MailerDiagnostics | null>(null);
	const [isTestingConnection, setIsTestingConnection] = React.useState(false);

	const [suppressions, setSuppressions] = React.useState<SuppressionItem[]>([]);
	const [isLoadingSuppressions, setIsLoadingSuppressions] = React.useState(false);
	const [newSuppressionEmail, setNewSuppressionEmail] = React.useState('');
	const [newSuppressionReason, setNewSuppressionReason] = React.useState('admin_block');
	const [newSuppressionCategory, setNewSuppressionCategory] = React.useState('all');

	const { toast } = useToast();

	const fetchLogs = React.useCallback(async () => {
		try {
			setIsLoadingLogs(true);
			const params = new URLSearchParams({
				page: String(logsPage),
				limit: '20',
			});
			if (logsSearch) params.set('search', logsSearch);
			if (logsStatus !== 'all') params.set('status', logsStatus);
			if (logsTemplate !== 'all') params.set('template', logsTemplate);

			const res = await fetch(`/api/admin/mailer?${params.toString()}`);
			if (!res.ok) throw new Error('Failed to load email logs');

			const data = await res.json();
			setLogs(data.logs || []);
			setLogsTotalPages(data.totalPages || 1);
			if (data.stats) setStats(data.stats);
		} catch (err: any) {
			toast({
				title: 'Logs load failed',
				description: err?.message || 'Could not fetch email audit logs',
				variant: 'error',
			});
		} finally {
			setIsLoadingLogs(false);
		}
	}, [logsPage, logsSearch, logsStatus, logsTemplate, toast]);

	const fetchSuppressions = React.useCallback(async () => {
		try {
			setIsLoadingSuppressions(true);
			const res = await fetch('/api/admin/mailer/suppressions');
			if (!res.ok) throw new Error('Failed to load suppressions');
			const data = await res.json();
			setSuppressions(data.suppressions || []);
		} catch (err: any) {
			toast({
				title: 'Suppressions load failed',
				description: err?.message || 'Could not fetch email suppressions',
				variant: 'error',
			});
		} finally {
			setIsLoadingSuppressions(false);
		}
	}, [toast]);

	React.useEffect(() => {
		fetchLogs();
		if (activeTab === 'suppressions') {
			fetchSuppressions();
		}
	}, [fetchLogs, fetchSuppressions, activeTab]);

	const handleTemplateChange = (tmpl: EmailTemplateType) => {
		setSelectedTemplate(tmpl);
		if (tmpl === 'welcome') {
			setSubject('Welcome to Open Smile! 🎉');
			setHeadline('Welcome aboard, Smiler! 🎉');
			setBodyContent('Your Open Smile account is live. Start smiling today to unlock daily coin multipliers.');
			setCtaLabel('Take Your First Smile 📸');
			setCtaUrl('/capture');
		} else if (tmpl === 'otp') {
			setSubject('[Open Smile] Verification Code: 849201');
			setHeadline('Security Verification');
			setBodyContent('Your 6-digit one-time code is 849201. Valid for 5 minutes.');
			setCtaLabel('');
			setCtaUrl('');
		} else if (tmpl === 'login-alert') {
			setSubject('Security Alert: New Sign-in');
			setHeadline('New Sign-in Detected');
			setBodyContent('A new session was authenticated on your Open Smile account.');
			setCtaLabel('Secure My Account 🛡️');
			setCtaUrl('/forgot-password');
		} else if (tmpl === 'streak-reminder') {
			setSubject('🔥 Don\'t lose your 5-day smile streak!');
			setHeadline('Keep Your Streak Alive!');
			setBodyContent('You have 4 hours left before midnight IST to record today\'s smile.');
			setCtaLabel('Smile Now & Save Streak 📸');
			setCtaUrl('/capture');
		} else if (tmpl === 'reward-unlocked') {
			setSubject('🎁 You unlocked a ₹100 Amazon Gift Voucher!');
			setHeadline('Congratulations! Prize Ready');
			setBodyContent('You earned enough coins to unlock a ₹100 Amazon shopping voucher.');
			setCtaLabel('View In Rewards Vault 🎁');
			setCtaUrl('/rewards');
		} else {
			setSubject('Open Smile Announcement 🌟');
			setHeadline('Important Platform Update');
			setBodyContent('We are excited to roll out our latest update with brand new rewards and challenges.');
			setCtaLabel('Explore Open Smile');
			setCtaUrl('/dashboard');
		}
	};

	const handleDispatch = async () => {
		if (audience === 'single' && (!targetEmail.trim() || !targetEmail.includes('@'))) {
			toast({
				title: 'Recipient missing',
				description: 'Please enter a valid recipient email.',
				variant: 'error',
			});
			return;
		}

		setIsDispatching(true);
		try {
			const res = await fetch('/api/admin/mailer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					template: selectedTemplate,
					audience,
					to: targetEmail.trim() || undefined,
					name: recipientName.trim(),
					subject: subject.trim(),
					headline: headline.trim(),
					text: bodyContent.trim(),
					cta_label: ctaLabel.trim() || undefined,
					cta_url: ctaUrl.trim() || undefined,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Dispatch failed');

			toast({
				title: 'Email Campaign Dispatched! ✉️',
				description: `Successfully sent ${data.successfulCount} / ${data.dispatchedCount} messages.`,
			});

			fetchLogs();
		} catch (err: any) {
			toast({
				title: 'Dispatch error',
				description: err?.message || 'Could not send email',
				variant: 'error',
			});
		} finally {
			setIsDispatching(false);
		}
	};

	const handleTestConnection = async () => {
		setIsTestingConnection(true);
		try {
			const res = await fetch('/api/admin/mailer/test-connection', {
				method: 'POST',
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Connection check failed');

			setDiagnostics(data.diagnostics);
			toast({
				title: data.diagnostics?.healthy ? 'Provider Online ✅' : 'Provider Warning ⚠️',
				description: data.diagnostics?.healthy
					? `Connected via ${data.diagnostics.provider.toUpperCase()} in ${data.diagnostics.latencyMs}ms`
					: data.diagnostics?.error || 'Connection verification issues detected',
				variant: data.diagnostics?.healthy ? 'success' : 'error',
			});
		} catch (err: any) {
			toast({
				title: 'Handshake failed',
				description: err?.message || 'Could not verify mail provider',
				variant: 'error',
			});
		} finally {
			setIsTestingConnection(false);
		}
	};

	const handleResend = async (logId: string) => {
		setResendingLogId(logId);
		try {
			const res = await fetch('/api/admin/mailer/resend', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ log_id: logId }),
			});
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.result?.error || 'Resend failed');

			toast({
				title: 'Resent successfully! 🚀',
				description: 'Email re-dispatched to recipient.',
			});
			fetchLogs();
		} catch (err: any) {
			toast({
				title: 'Resend failed',
				description: err?.message || 'Could not resend email',
				variant: 'error',
			});
		} finally {
			setResendingLogId(null);
		}
	};

	const handleAddSuppression = async () => {
		if (!newSuppressionEmail.trim() || !newSuppressionEmail.includes('@')) {
			toast({
				title: 'Invalid email',
				description: 'Enter a valid email address to suppress.',
				variant: 'error',
			});
			return;
		}

		try {
			const res = await fetch('/api/admin/mailer/suppressions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: newSuppressionEmail.trim(),
					reason: newSuppressionReason,
					category: newSuppressionCategory,
				}),
			});
			if (!res.ok) throw new Error('Failed to add suppression');

			toast({
				title: 'Email suppressed',
				description: `${newSuppressionEmail} will no longer receive outgoing mail.`,
			});
			setNewSuppressionEmail('');
			fetchSuppressions();
		} catch (err: any) {
			toast({
				title: 'Suppression failed',
				description: err?.message || 'Could not suppress email',
				variant: 'error',
			});
		}
	};

	const handleRemoveSuppression = async (email: string) => {
		try {
			const res = await fetch(`/api/admin/mailer/suppressions?email=${encodeURIComponent(email)}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Failed to remove');

			toast({
				title: 'Suppression removed',
				description: `${email} can receive emails again.`,
			});
			fetchSuppressions();
		} catch (err: any) {
			toast({
				title: 'Removal failed',
				description: err?.message || 'Could not remove suppression',
				variant: 'error',
			});
		}
	};

	return (
		<div className="space-y-6 pb-12">
			{/* Station Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black bg-primary text-primary-foreground flex items-center justify-center shadow-brutal-xs">
							<Mail className="size-5" strokeWidth={2.5} />
						</div>
						<h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
							Mailer Station & Dispatcher
						</h1>
					</div>
					<p className="font-mono text-xs text-muted-foreground mt-1">
						Enterprise multi-provider dispatching, delivery audit trail, live diagnostics, and compliance
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleTestConnection}
						disabled={isTestingConnection}
						className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift hover:bg-muted"
					>
						<Activity className={cn('size-3.5 mr-1 text-primary', isTestingConnection && 'animate-spin')} />
						Test Connection
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => fetchLogs()}
						className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift hover:bg-muted"
					>
						<RefreshCw className={cn('size-3.5 mr-1', isLoadingLogs && 'animate-spin')} />
						Refresh
					</Button>
				</div>
			</div>

			{/* Metrics Ribbon */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Total Outbound
						</span>
						<Layers className="size-4 text-primary" />
					</div>
					<div className="font-title font-black text-2xl text-foreground tabular-nums">
						{stats.totalSent.toLocaleString()}
					</div>
					<div className="font-mono text-[10px] text-muted-foreground">
						{stats.sentToday} sent last 24h
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Success Rate
						</span>
						<CheckCircle2 className="size-4 text-accent" />
					</div>
					<div className="font-title font-black text-2xl text-foreground tabular-nums">
						{stats.successRate}%
					</div>
					<div className="font-mono text-[10px] text-muted-foreground">
						{stats.totalFailed} failed attempts
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Active Transport
						</span>
						<Activity className="size-4 text-secondary" />
					</div>
					<div className="font-title font-black text-base sm:text-lg text-foreground truncate">
						{stats.activeProvider}
					</div>
					<div className="font-mono text-[10px] text-muted-foreground">
						Auto-failover enabled
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Suppression List
						</span>
						<ShieldAlert className="size-4 text-destructive" />
					</div>
					<div className="font-title font-black text-2xl text-foreground tabular-nums">
						{stats.suppressedCount.toLocaleString()}
					</div>
					<div className="font-mono text-[10px] text-muted-foreground">
						Unsubscribes & blocks
					</div>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex items-center gap-2 border-b-[length:var(--border-width)] border-black/15 pb-2 overflow-x-auto">
				{[
					{ id: 'dispatcher', label: 'Campaign Dispatcher', icon: Send },
					{ id: 'logs', label: `Delivery Logs (${stats.totalSent})`, icon: Clock },
					{ id: 'diagnostics', label: 'Diagnostics & Health', icon: Activity },
					{ id: 'suppressions', label: `Suppressions (${stats.suppressedCount})`, icon: ShieldAlert },
				].map((tab) => {
					const Icon = tab.icon;
					const active = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id as any)}
							className={cn(
								'flex items-center gap-2 border-[length:var(--border-width)] rounded-md px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all',
								active
									? 'border-black bg-accent text-black shadow-brutal-xs'
									: 'border-transparent bg-card text-muted-foreground hover:border-black/40 hover:text-foreground',
							)}
						>
							<Icon className="size-3.5" />
							<span>{tab.label}</span>
						</button>
					);
				})}
			</div>

			{/* Tab 1: Dispatcher & Campaigns */}
			{activeTab === 'dispatcher' && (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Dispatcher Form */}
					<div className="lg:col-span-7 border-[length:var(--border-width)] border-black rounded-xl p-5 sm:p-6 bg-card shadow-brutal space-y-5">
						<div>
							<h3 className="font-title font-black text-lg">Send Email / Campaign</h3>
							<p className="font-mono text-xs text-muted-foreground">
								Select an enterprise Neubrutalist template or broadcast a custom announcement
							</p>
						</div>

						{/* Template Picker */}
						<div className="space-y-2">
							<Label className="font-mono text-xs font-bold uppercase tracking-wider">
								Email Template
							</Label>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{TEMPLATES.map((tmpl) => (
									<button
										key={tmpl.id}
										type="button"
										onClick={() => handleTemplateChange(tmpl.id)}
										className={cn(
											'text-left p-2.5 border-[length:var(--border-width)] rounded-lg font-mono transition-all cursor-pointer',
											selectedTemplate === tmpl.id
												? 'border-black bg-primary text-primary-foreground shadow-brutal-xs'
												: 'border-black/20 bg-background text-foreground hover:border-black',
										)}
									>
										<div className="font-bold text-xs uppercase">{tmpl.label}</div>
										<div className="text-[10px] opacity-80 truncate">{tmpl.description}</div>
									</button>
								))}
							</div>
						</div>

						{/* Target Audience */}
						<div className="space-y-2">
							<Label className="font-mono text-xs font-bold uppercase tracking-wider">
								Audience Target
							</Label>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
								{[
									{ id: 'single', label: 'Single Email' },
									{ id: 'admin_team', label: 'Admin Team' },
									{ id: 'waitlist', label: 'Beta Waitlist' },
									{ id: 'all_users', label: 'All Users' },
								].map((a) => (
									<button
										key={a.id}
										type="button"
										onClick={() => setAudience(a.id as any)}
										className={cn(
											'border-[length:var(--border-width)] rounded-md p-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer text-center',
											audience === a.id
												? 'border-black bg-accent text-black shadow-brutal-xs'
												: 'border-black/20 bg-background text-muted-foreground hover:border-black hover:text-foreground',
										)}
									>
										{a.label}
									</button>
								))}
							</div>

							{audience === 'single' && (
								<div className="pt-2 space-y-3">
									<AdminUserCombobox
										value={targetEmail}
										onChange={(val, user) => {
											setTargetEmail(user?.email || val);
											if (user?.name) {
												setRecipientName(user.name);
											}
										}}
										label="Recipient Smiler / Email"
										placeholder="Search smilers by name, email, or user ID..."
									/>

									<div className="space-y-1.5">
										<Label className="font-mono text-xs font-bold uppercase tracking-wider">
											Recipient Display Name
										</Label>
										<Input
											value={recipientName}
											onChange={(e) => setRecipientName(e.target.value)}
											placeholder="Recipient Name (e.g. Alex)..."
											className="border-[length:var(--border-width)] border-black font-mono text-xs"
										/>
									</div>
								</div>
							)}
						</div>

						{/* Subject Line */}
						<div className="space-y-2">
							<Label className="font-mono text-xs font-bold uppercase tracking-wider">
								Subject Line
							</Label>
							<Input
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								className="border-[length:var(--border-width)] border-black font-title font-bold text-sm"
							/>
						</div>

						{/* Headline & Body */}
						<div className="space-y-4">
							<div className="space-y-2">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									Headline
								</Label>
								<Input
									value={headline}
									onChange={(e) => setHeadline(e.target.value)}
									className="border-[length:var(--border-width)] border-black font-bold text-xs"
								/>
							</div>

							<MarkdownEditor
								value={bodyContent}
								onChange={setBodyContent}
								label="Message Content"
								rows={5}
								placeholder="Type announcement or email body in Markdown (**bold**, *italic*, [link](url), lists)..."
							/>
						</div>

						{/* CTA Button */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div className="space-y-2">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									CTA Button Text
								</Label>
								<Input
									value={ctaLabel}
									onChange={(e) => setCtaLabel(e.target.value)}
									className="border-[length:var(--border-width)] border-black font-mono text-xs"
								/>
							</div>
							<div className="space-y-2">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									CTA URL
								</Label>
								<Input
									value={ctaUrl}
									onChange={(e) => setCtaUrl(e.target.value)}
									className="border-[length:var(--border-width)] border-black font-mono text-xs"
								/>
							</div>
						</div>

						{/* Send Confirmation */}
						<div className="pt-2 border-t border-black/15 flex justify-end">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										disabled={isDispatching}
										className="border-[length:var(--border-width)] border-black rounded-md bg-primary font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-sm brutal-lift hover:bg-primary/90"
									>
										<Send className="size-3.5 mr-2" />
										<span>Dispatch Email</span>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="border-2 border-black rounded-xl bg-card shadow-brutal-lg">
									<AlertDialogHeader>
										<AlertDialogTitle className="font-title font-black text-xl">
											Confirm Email Dispatch
										</AlertDialogTitle>
										<AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
											You are about to dispatch this email to{' '}
											<strong>
												{audience === 'single'
													? targetEmail || 'the selected recipient'
													: audience === 'all_users'
													? 'All Registered Users'
													: audience === 'waitlist'
													? 'Beta Waitlist Users'
													: 'Admin Team'}
											</strong>{' '}
											via active transport <strong>{stats.activeProvider}</strong>.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel className="border border-black font-mono text-xs uppercase font-bold">
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleDispatch}
											className="border border-black bg-primary text-primary-foreground font-mono text-xs uppercase font-black shadow-brutal-xs"
										>
											Yes, Send Now
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>

					{/* Live Card / Email Preview */}
					<div className="lg:col-span-5 space-y-4">
						<div className="border-[length:var(--border-width)] border-black rounded-xl p-5 bg-muted/40 shadow-brutal-xs space-y-3">
							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
									<Eye className="size-3.5" />
									Email Layout Preview
								</span>
								<span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-accent text-black border border-black rounded">
									Neubrutalist HTML
								</span>
							</div>

							{/* Simulated Email Envelope */}
							<div className="border-2 border-black rounded-xl p-5 bg-white shadow-brutal space-y-4 text-black font-sans">
								{/* Email Header */}
								<div className="flex items-center justify-between border-b border-black/15 pb-3">
									<div className="flex items-center gap-2">
										<div className="size-7 rounded border border-black bg-primary text-white flex items-center justify-center font-bold text-xs">
											😄
										</div>
										<span className="font-black text-sm tracking-tight">OPEN SMILE</span>
									</div>
									<span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 border border-black rounded bg-accent">
										{selectedTemplate.toUpperCase()}
									</span>
								</div>

								{/* Content */}
								<div className="space-y-2">
									<h2 className="font-black text-base tracking-tight leading-tight">
										{headline || subject}
									</h2>
									<div className="text-xs text-neutral-700 leading-relaxed">
										{bodyContent.trim() ? (
											<MarkdownView content={bodyContent} className="text-neutral-700" />
										) : (
											<p className="text-neutral-400 italic">No message content</p>
										)}
									</div>
								</div>

								{/* CTA Button */}
								{ctaLabel && (
									<div>
										<span className="inline-block border-2 border-black rounded-md bg-[#FF2D78] text-white px-4 py-2 font-mono text-xs font-black uppercase tracking-wide shadow-[2px_2px_0px_#000]">
											{ctaLabel}
										</span>
									</div>
								)}

								{/* Email Footer */}
								<div className="border-t border-black/10 pt-3 text-center text-[10px] text-neutral-500 space-y-1">
									<div className="font-bold text-black">Open Smile • Smile More, Win More</div>
									<div>Private on-device AI recognition rewards platform</div>
									<div className="text-[9px] text-neutral-400">
										<span className="underline">Unsubscribe from these emails</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Tab 2: Delivery Logs */}
			{activeTab === 'logs' && (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal overflow-hidden">
					{/* Search & Filters */}
					<div className="p-4 border-b-[length:var(--border-width)] border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								value={logsSearch}
								onChange={(e) => setLogsSearch(e.target.value)}
								placeholder="Search by recipient email, subject, message ID..."
								className="pl-9 border-[length:var(--border-width)] border-black font-mono text-xs"
							/>
						</div>

						<div className="flex items-center gap-2">
							<select
								value={logsStatus}
								onChange={(e) => setLogsStatus(e.target.value)}
								className="h-9 border-[length:var(--border-width)] border-black rounded-md bg-background px-3 font-mono text-xs font-bold cursor-pointer"
							>
								<option value="all">All Statuses</option>
								<option value="sent">Sent</option>
								<option value="dev_logged">Dev Logged</option>
								<option value="failed">Failed</option>
								<option value="suppressed">Suppressed</option>
								<option value="disabled">Disabled</option>
							</select>

							<select
								value={logsTemplate}
								onChange={(e) => setLogsTemplate(e.target.value)}
								className="h-9 border-[length:var(--border-width)] border-black rounded-md bg-background px-3 font-mono text-xs font-bold cursor-pointer"
							>
								<option value="all">All Templates</option>
								{TEMPLATES.map((t) => (
									<option key={t.id} value={t.id}>
										{t.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Logs Table */}
					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs font-mono border-collapse">
							<thead>
								<tr className="border-b-[length:var(--border-width)] border-black/15 bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
									<th className="p-3.5">Recipient</th>
									<th className="p-3.5">Template</th>
									<th className="p-3.5">Subject</th>
									<th className="p-3.5">Provider</th>
									<th className="p-3.5">Status</th>
									<th className="p-3.5">Timestamp</th>
									<th className="p-3.5 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y-[length:var(--border-width)] divide-black/10">
								{isLoadingLogs ? (
									<tr>
										<td colSpan={7} className="p-8 text-center text-muted-foreground">
											<RefreshCw className="size-5 animate-spin mx-auto mb-2" />
											Loading delivery audit trail...
										</td>
									</tr>
								) : logs.length === 0 ? (
									<tr>
										<td colSpan={7} className="p-8 text-center text-muted-foreground">
											No email logs match this filter criteria.
										</td>
									</tr>
								) : (
									logs.map((log) => (
										<tr key={log.id} className="hover:bg-muted/20 transition-colors">
											<td className="p-3.5 max-w-[180px]">
												<div className="font-bold text-foreground truncate">
													{log.recipient_email}
												</div>
												{log.message_id && (
													<div className="text-[10px] text-muted-foreground truncate font-mono">
														{log.message_id}
													</div>
												)}
											</td>
											<td className="p-3.5">
												<span className="inline-block px-2 py-0.5 border border-black rounded bg-muted text-[10px] uppercase font-bold">
													{log.template}
												</span>
											</td>
											<td className="p-3.5 max-w-[240px]">
												<div className="font-bold text-foreground truncate">
													{log.subject}
												</div>
												{log.error && (
													<div className="text-[11px] text-destructive truncate">
														{log.error}
													</div>
												)}
											</td>
											<td className="p-3.5 uppercase font-bold text-muted-foreground">
												{log.provider}
											</td>
											<td className="p-3.5">
												{log.status === 'sent' && (
													<span className="inline-flex items-center gap-1 text-success font-bold">
														<CheckCircle2 className="size-3.5" />
														Sent
													</span>
												)}
												{log.status === 'dev_logged' && (
													<span className="inline-flex items-center gap-1 text-secondary font-bold">
														<Info className="size-3.5" />
														Dev Logged
													</span>
												)}
												{log.status === 'failed' && (
													<span className="inline-flex items-center gap-1 text-destructive font-bold">
														<XCircle className="size-3.5" />
														Failed
													</span>
												)}
												{log.status === 'suppressed' && (
													<span className="inline-flex items-center gap-1 text-muted-foreground font-bold">
														<ShieldAlert className="size-3.5" />
														Suppressed
													</span>
												)}
												{log.status === 'disabled' && (
													<span className="inline-flex items-center gap-1 text-muted-foreground font-bold">
														Disabled
													</span>
												)}
											</td>
											<td className="p-3.5 whitespace-nowrap text-muted-foreground">
												{new Date(log.created_at).toLocaleString(undefined, {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												})}
											</td>
											<td className="p-3.5 text-right whitespace-nowrap">
												<div className="flex items-center justify-end gap-1.5">
													<Button
														variant="outline"
														size="sm"
														onClick={() => setSelectedLogDetail(log)}
														className="h-7 px-2 font-mono text-[10px] border border-black shadow-none"
													>
														Details
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleResend(log.id)}
														disabled={resendingLogId === log.id}
														className="h-7 px-2 font-mono text-[10px] border border-black shadow-none"
													>
														<RotateCw
															className={cn('size-3 mr-1', resendingLogId === log.id && 'animate-spin')}
														/>
														Resend
													</Button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{logsTotalPages > 1 && (
						<div className="p-3 border-t-[length:var(--border-width)] border-black/15 flex items-center justify-between bg-muted/20 font-mono text-xs">
							<span className="text-muted-foreground">
								Page {logsPage} of {logsTotalPages}
							</span>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={logsPage <= 1}
									onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
									className="h-8 border border-black font-mono text-xs font-bold"
								>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={logsPage >= logsTotalPages}
									onClick={() => setLogsPage((p) => Math.min(logsTotalPages, p + 1))}
									className="h-8 border border-black font-mono text-xs font-bold"
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Tab 3: Diagnostics & Health */}
			{activeTab === 'diagnostics' && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
					<div className="border-[length:var(--border-width)] border-black rounded-xl p-5 bg-card shadow-brutal space-y-4">
						<div className="flex items-center justify-between border-b border-black/15 pb-3">
							<div>
								<h3 className="font-title font-black text-lg">Transport Diagnostics</h3>
								<p className="font-mono text-xs text-muted-foreground">
									Test handshake connectivity and latency with the active mail provider
								</p>
							</div>
							<Button
								onClick={handleTestConnection}
								disabled={isTestingConnection}
								className="border-[length:var(--border-width)] border-black rounded-md bg-primary font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-xs brutal-lift"
							>
								<Activity className={cn('size-3.5 mr-1.5', isTestingConnection && 'animate-spin')} />
								Run Diagnostic Ping
							</Button>
						</div>

						{diagnostics ? (
							<div className="space-y-3 font-mono text-xs">
								<div className="flex items-center justify-between p-3 border border-black rounded-lg bg-muted/40">
									<span className="font-bold uppercase">Status</span>
									{diagnostics.healthy ? (
										<span className="inline-flex items-center gap-1 text-success font-black">
											<CheckCircle2 className="size-4" />
											HEALTHY / ONLINE
										</span>
									) : (
										<span className="inline-flex items-center gap-1 text-destructive font-black">
											<XCircle className="size-4" />
											CONNECTION ERROR
										</span>
									)}
								</div>

								<div className="flex items-center justify-between p-3 border border-black rounded-lg bg-muted/40">
									<span className="font-bold uppercase">Active Provider</span>
									<span className="font-bold uppercase">{diagnostics.provider}</span>
								</div>

								<div className="flex items-center justify-between p-3 border border-black rounded-lg bg-muted/40">
									<span className="font-bold uppercase">Roundtrip Latency</span>
									<span className="font-bold tabular-nums">{diagnostics.latencyMs ?? 0} ms</span>
								</div>

								{diagnostics.error && (
									<div className="p-3 border border-destructive rounded-lg bg-destructive/10 text-destructive text-xs">
										<div className="font-bold uppercase mb-1">Diagnostic Failure Reason:</div>
										<div>{diagnostics.error}</div>
									</div>
								)}
							</div>
						) : (
							<div className="p-6 text-center text-muted-foreground font-mono text-xs">
								Click &quot;Run Diagnostic Ping&quot; to test your outbound email server live.
							</div>
						)}
					</div>

					<div className="border-[length:var(--border-width)] border-black rounded-xl p-5 bg-card shadow-brutal space-y-4">
						<h3 className="font-title font-black text-lg border-b border-black/15 pb-3">
							Environment Credentials Checklist
						</h3>
						<div className="space-y-2 font-mono text-xs">
							{[
								{
									key: 'RESEND_API_KEY',
									configured: Boolean(process.env.NEXT_PUBLIC_APP_NAME),
									label: 'Resend API Key (HTTPS Fast Dispatch)',
								},
								{
									key: 'EMAIL_USER',
									configured: true,
									label: 'SMTP / Gmail Account Address',
								},
								{
									key: 'EMAIL_PASS',
									configured: true,
									label: 'SMTP App Password / Auth Secret',
								},
								{
									key: 'EMAIL_HOST',
									configured: true,
									label: 'Custom SMTP Host (e.g. smtp.postmarkapp.com)',
								},
								{
									key: 'EMAIL_FROM',
									configured: true,
									label: 'From Address Header (e.g. hello@opensmile.app)',
								},
							].map((item) => (
								<div
									key={item.key}
									className="flex items-center justify-between p-3 border border-black/20 rounded-lg bg-muted/20"
								>
									<div>
										<div className="font-bold text-foreground">{item.key}</div>
										<div className="text-[10px] text-muted-foreground">{item.label}</div>
									</div>
									<span className="px-2 py-0.5 rounded text-[10px] font-black uppercase border border-black bg-primary text-primary-foreground">
										Available
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Tab 4: Suppressions & Unsubscribes */}
			{activeTab === 'suppressions' && (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Add Suppression */}
					<div className="lg:col-span-5 border-[length:var(--border-width)] border-black rounded-xl p-5 bg-card shadow-brutal space-y-4">
						<h3 className="font-title font-black text-lg border-b border-black/15 pb-3">
							Add Email Suppression
						</h3>
						<div className="space-y-3 font-mono text-xs">
							<div className="space-y-1">
								<Label className="text-xs font-bold uppercase">Email to Suppress</Label>
								<Input
									value={newSuppressionEmail}
									onChange={(e) => setNewSuppressionEmail(e.target.value)}
									placeholder="user@example.com..."
									className="border border-black"
								/>
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-bold uppercase">Suppression Reason</Label>
								<select
									value={newSuppressionReason}
									onChange={(e) => setNewSuppressionReason(e.target.value)}
									className="w-full h-10 border border-black rounded-md bg-background px-3 font-bold"
								>
									<option value="admin_block">Admin Block (Spam/Abuse)</option>
									<option value="bounce">Hard Bounce Detected</option>
									<option value="user_unsubscribe">Manual Unsubscribe Request</option>
									<option value="complaint">Spam Complaint</option>
								</select>
							</div>

							<div className="space-y-1">
								<Label className="text-xs font-bold uppercase">Scope / Category</Label>
								<select
									value={newSuppressionCategory}
									onChange={(e) => setNewSuppressionCategory(e.target.value)}
									className="w-full h-10 border border-black rounded-md bg-background px-3 font-bold"
								>
									<option value="all">All Outbound Emails (Complete Block)</option>
									<option value="marketing">Marketing & Broadcasts Only</option>
									<option value="streaks">Streak Reminders Only</option>
									<option value="rewards">Reward Drops Only</option>
								</select>
							</div>

							<Button
								onClick={handleAddSuppression}
								className="w-full border border-black bg-primary text-primary-foreground font-mono text-xs uppercase font-black shadow-brutal-xs"
							>
								<Plus className="size-4 mr-1.5" />
								Add Suppression
							</Button>
						</div>
					</div>

					{/* Suppressions Table */}
					<div className="lg:col-span-7 border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal overflow-hidden">
						<div className="p-4 border-b border-black/15 bg-muted/40 font-title font-black text-sm">
							Active Suppressions & Unsubscribes ({suppressions.length})
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-xs font-mono border-collapse">
								<thead>
									<tr className="border-b border-black/15 bg-muted/20 font-bold uppercase text-muted-foreground">
										<th className="p-3">Email</th>
										<th className="p-3">Reason</th>
										<th className="p-3">Scope</th>
										<th className="p-3 text-right">Action</th>
									</tr>
								</thead>
								<tbody className="divide-y border-black/10">
									{isLoadingSuppressions ? (
										<tr>
											<td colSpan={4} className="p-6 text-center text-muted-foreground">
												Loading suppressions...
											</td>
										</tr>
									) : suppressions.length === 0 ? (
										<tr>
											<td colSpan={4} className="p-6 text-center text-muted-foreground">
												No active suppressions on record.
											</td>
										</tr>
									) : (
										suppressions.map((s) => (
											<tr key={s.email} className="hover:bg-muted/10">
												<td className="p-3 font-bold text-foreground truncate max-w-[200px]">
													{s.email}
												</td>
												<td className="p-3 uppercase text-[10px] text-muted-foreground">
													{s.reason}
												</td>
												<td className="p-3">
													<span className="px-1.5 py-0.5 border border-black rounded text-[9px] uppercase font-bold bg-muted">
														{s.category}
													</span>
												</td>
												<td className="p-3 text-right">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleRemoveSuppression(s.email)}
														className="h-7 px-2 text-destructive hover:bg-destructive/10"
													>
														<Trash2 className="size-3.5 mr-1" />
														Unsuppress
													</Button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			{/* Detail Modal */}
			<Dialog open={Boolean(selectedLogDetail)} onOpenChange={(o) => !o && setSelectedLogDetail(null)}>
				<DialogContent className="border-2 border-black rounded-xl bg-card shadow-brutal-lg max-w-xl">
					<DialogHeader>
						<DialogTitle className="font-title font-black text-lg">
							Email Delivery Audit Record
						</DialogTitle>
					</DialogHeader>
					{selectedLogDetail && (
						<div className="space-y-3 font-mono text-xs">
							<div className="grid grid-cols-2 gap-2">
								<div className="p-2 border border-black/20 rounded bg-muted/20">
									<div className="text-[10px] text-muted-foreground uppercase">Recipient</div>
									<div className="font-bold truncate">{selectedLogDetail.recipient_email}</div>
								</div>
								<div className="p-2 border border-black/20 rounded bg-muted/20">
									<div className="text-[10px] text-muted-foreground uppercase">Status</div>
									<div className="font-bold uppercase">{selectedLogDetail.status}</div>
								</div>
							</div>

							<div className="p-2 border border-black/20 rounded bg-muted/20">
								<div className="text-[10px] text-muted-foreground uppercase">Subject</div>
								<div className="font-bold">{selectedLogDetail.subject}</div>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<div className="p-2 border border-black/20 rounded bg-muted/20">
									<div className="text-[10px] text-muted-foreground uppercase">Template</div>
									<div className="font-bold">{selectedLogDetail.template}</div>
								</div>
								<div className="p-2 border border-black/20 rounded bg-muted/20">
									<div className="text-[10px] text-muted-foreground uppercase">Transport</div>
									<div className="font-bold uppercase">{selectedLogDetail.provider}</div>
								</div>
							</div>

							{selectedLogDetail.message_id && (
								<div className="p-2 border border-black/20 rounded bg-muted/20">
									<div className="text-[10px] text-muted-foreground uppercase">Message ID</div>
									<div className="font-mono text-[11px] truncate">{selectedLogDetail.message_id}</div>
								</div>
							)}

							{selectedLogDetail.error && (
								<div className="p-3 border border-destructive rounded bg-destructive/10 text-destructive text-xs">
									<div className="font-bold uppercase mb-1">Error Diagnostics:</div>
									<div>{selectedLogDetail.error}</div>
								</div>
							)}

							{selectedLogDetail.metadata && (
								<div className="p-2 border border-black/20 rounded bg-muted/20">
									<div className="text-[10px] text-muted-foreground uppercase mb-1">Metadata</div>
									<pre className="text-[10px] overflow-x-auto p-2 bg-black text-white rounded">
										{JSON.stringify(selectedLogDetail.metadata, null, 2)}
									</pre>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
