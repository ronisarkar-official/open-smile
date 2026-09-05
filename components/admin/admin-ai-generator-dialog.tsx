'use client';

import * as React from 'react';
import {
	Sparkles,
	Send,
	Check,
	RotateCw,
	Flame,
	Coins,
	User,
	Users,
	Wand2,
	ChevronRight,
	Bot,
	AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type {
	AINotificationDraft,
	AIEmailDraft,
	AIUserContext,
} from '@/lib/ai/types';

interface AdminAiGeneratorDialogProps {
	mode: 'notification' | 'email';
	audience: 'all' | 'specific';
	user?: AIUserContext | null;
	category?: string;
	template?: string;
	onApplyNotification?: (draft: AINotificationDraft) => void;
	onApplyEmail?: (draft: AIEmailDraft) => void;
	triggerClassName?: string;
	triggerText?: string;
}

const NOTIFICATION_PROMPT_CHIPS = [
	{ label: 'Weekend 2x Coins', prompt: 'Announce weekend double coin multiplier on all smiles between 6 PM and 11 PM' },
	{ label: 'Streak Expiry Warning', prompt: 'Urgent reminder before midnight to keep streak alive and maintain reward multipliers' },
	{ label: 'New Voucher Drop', prompt: 'Exclusive new Amazon vouchers have been restocked in the marketplace' },
	{ label: 'Leaderboard Podium Battle', prompt: 'Top 3 spots on the weekly leaderboard are close, smile now to claim the podium crown' },
	{ label: 'Weekend Challenge', prompt: 'Challenge smilers to maintain an active 3-day streak this weekend to unlock bonus coins' },
];

const EMAIL_PROMPT_CHIPS = [
	{ label: 'Weekly Rewards Digest', prompt: 'Weekly overview of coins earned, active streak, and top available Amazon vouchers to redeem' },
	{ label: 'Streak Preservation Alert', prompt: 'Friendly urgent heads up that their streak is about to reset tonight' },
	{ label: 'Exclusive Voucher Unlocked', prompt: 'Congratulations on unlocking the next voucher tier in the marketplace' },
	{ label: 'Inactivity Re-engagement', prompt: 'We miss your smile! Come back today for a 50 coin instant comeback bonus' },
	{ label: 'Major Platform Update', prompt: 'Exciting announcement about new face landmark tracking, gesture controls, and bonus drops' },
];

const TONES = [
	{ id: 'energetic', label: 'Energetic 🔥' },
	{ id: 'urgent', label: 'Urgent ⚡' },
	{ id: 'friendly', label: 'Friendly 😊' },
	{ id: 'celebratory', label: 'Celebratory 🎉' },
	{ id: 'professional', label: 'Professional 💼' },
];

export function AdminAiGeneratorDialog({
	mode,
	audience,
	user,
	category,
	template,
	onApplyNotification,
	onApplyEmail,
	triggerClassName,
	triggerText = 'Write with AI ✨',
}: AdminAiGeneratorDialogProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [topic, setTopic] = React.useState('');
	const [tone, setTone] = React.useState<any>('energetic');
	const [isGenerating, setIsGenerating] = React.useState(false);
	const [notificationDraft, setNotificationDraft] = React.useState<AINotificationDraft | null>(null);
	const [emailDraft, setEmailDraft] = React.useState<AIEmailDraft | null>(null);
	const [providerMeta, setProviderMeta] = React.useState<{ provider?: string; model?: string } | null>(null);

	const { toast } = useToast();

	const isSingleUser = audience === 'specific';
	const chips = mode === 'notification' ? NOTIFICATION_PROMPT_CHIPS : EMAIL_PROMPT_CHIPS;

	const handleGenerate = async () => {
		if (!topic.trim()) {
			toast({
				title: 'Prompt required',
				description: 'Please enter instructions or choose a prompt suggestion.',
				variant: 'error',
			});
			return;
		}

		setIsGenerating(true);
		setNotificationDraft(null);
		setEmailDraft(null);

		try {
			const res = await fetch('/api/admin/ai/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: mode,
					topic: topic.trim(),
					tone,
					audience,
					user: isSingleUser ? user : null,
					category,
					template,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to generate copy');

			setProviderMeta({ provider: data.provider, model: data.model });

			if (mode === 'notification') {
				setNotificationDraft(data.draft);
			} else {
				setEmailDraft(data.draft);
			}

			toast({
				title: 'AI Draft Generated! 🚀',
				description: `Generated with ${data.model || 'AI engine'}`,
			});
		} catch (err: any) {
			toast({
				title: 'AI Generation Failed',
				description: err?.message || 'Could not connect to AI service. Check AI settings.',
				variant: 'error',
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const handleApply = () => {
		if (mode === 'notification' && notificationDraft && onApplyNotification) {
			onApplyNotification(notificationDraft);
			setIsOpen(false);
			toast({
				title: 'Applied to Notification Form ✅',
				description: 'Title, description, category, and action fields populated.',
			});
		} else if (mode === 'email' && emailDraft && onApplyEmail) {
			onApplyEmail(emailDraft);
			setIsOpen(false);
			toast({
				title: 'Applied to Mail Composer ✅',
				description: 'Subject, headline, body, and CTA populated.',
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					type="button"
					className={cn(
						'bg-accent text-accent-foreground border-[length:var(--border-width)] border-black font-mono text-xs font-black uppercase tracking-wider shadow-brutal-xs brutal-lift flex items-center gap-1.5',
						triggerClassName,
					)}
				>
					<Sparkles className="size-3.5 text-black animate-pulse" />
					<span>{triggerText}</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[length:var(--border-width)] border-black bg-card shadow-brutal p-6">
				<DialogHeader className="border-b-[length:var(--border-width)] border-black/15 pb-4">
					<div className="flex items-center gap-2.5">
						<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black bg-accent text-accent-foreground flex items-center justify-center shadow-brutal-xs">
							<Bot className="size-5" />
						</div>
						<div>
							<DialogTitle className="font-title font-black text-xl">
								AI {mode === 'notification' ? 'Notification Assistant' : 'Campaign Copywriter'}
							</DialogTitle>
							<DialogDescription className="font-mono text-xs text-muted-foreground">
								Generate high-conversion Neubrutalist copy in seconds
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-5 pt-2">
					<div
						className={cn(
							'border-[length:var(--border-width)] border-black rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-brutal-xs',
							isSingleUser ? 'bg-primary/10 border-primary' : 'bg-accent/15 border-accent',
						)}
					>
						<div className="flex items-start gap-2.5">
							<div className="size-8 rounded-md border border-black bg-background flex items-center justify-center shrink-0 mt-0.5">
								{isSingleUser ? <User className="size-4 text-primary" /> : <Users className="size-4 text-accent-foreground" />}
							</div>
							<div>
								<div className="font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
									<span>{isSingleUser ? 'Target: Single Smiler' : 'Target: Community Broadcast'}</span>
									<span
										className={cn(
											'px-1.5 py-0.5 rounded text-[10px] border border-black',
											isSingleUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-black',
										)}
									>
										{isSingleUser ? 'Personalized Mode' : 'All Users Mode'}
									</span>
								</div>
								<div className="font-title font-bold text-xs text-foreground mt-0.5">
									{isSingleUser ? (
										user ? (
											<span>
												Customizing for <strong className="underline">{user.name || user.email}</strong> ({user.email})
											</span>
										) : (
											<span className="text-amber-600 font-mono">
												No user selected from combobox. (Will write generic 1-on-1 copy)
											</span>
										)
									) : (
										<span>Broadcasting to all registered smilers with platform-wide engagement tone.</span>
									)}
								</div>
							</div>
						</div>

						{isSingleUser && user && (
							<div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono text-[11px] font-black border border-black bg-background px-2.5 py-1 rounded shadow-brutal-xs">
								<span className="flex items-center gap-1 text-amber-500">
									<Flame className="size-3.5 fill-amber-500" />
									{user.streak_count ?? 0}d
								</span>
								<span className="text-black/30">|</span>
								<span className="flex items-center gap-1 text-primary">
									<Coins className="size-3.5" />
									{user.coin_balance?.toLocaleString() ?? 0}
								</span>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label className="font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between">
							<span>Quick Idea Templates</span>
							<span className="text-[10px] text-muted-foreground font-normal">Click to insert</span>
						</Label>
						<div className="flex flex-wrap gap-1.5">
							{chips.map((chip, idx) => (
								<button
									key={idx}
									type="button"
									onClick={() => setTopic(chip.prompt)}
									className="border border-black rounded-md px-2.5 py-1 font-mono text-[11px] font-bold bg-background hover:bg-muted transition-all cursor-pointer shadow-brutal-xs text-left"
								>
									{chip.label}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<Label className="font-mono text-xs font-bold uppercase tracking-wider">
							Instructions / Topic Prompt
						</Label>
						<textarea
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
							rows={3}
							placeholder={
								mode === 'notification'
									? 'e.g. Announce a 2x weekend multiplier for all smiles between 8 PM and 11 PM tonight...'
									: 'e.g. Congratulate the user on reaching a 7-day streak and invite them to explore new vouchers...'
							}
							className="w-full border-[length:var(--border-width)] border-black rounded-lg p-3 font-mono text-xs bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black resize-none"
						/>
					</div>

					<div className="space-y-2">
						<Label className="font-mono text-xs font-bold uppercase tracking-wider">
							Voice & Tone
						</Label>
						<div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
							{TONES.map((t) => (
								<button
									key={t.id}
									type="button"
									onClick={() => setTone(t.id)}
									className={cn(
										'border-[length:var(--border-width)] rounded-md py-1.5 px-2 font-mono text-[11px] font-bold transition-all cursor-pointer text-center',
										tone === t.id
											? 'border-black bg-primary text-primary-foreground shadow-brutal-xs'
											: 'border-black/20 bg-background text-muted-foreground hover:border-black hover:text-foreground',
									)}
								>
									{t.label}
								</button>
							))}
						</div>
					</div>

					<div className="pt-2">
						<Button
							type="button"
							onClick={handleGenerate}
							disabled={isGenerating || !topic.trim()}
							className="w-full py-3 border-[length:var(--border-width)] border-black bg-black text-white hover:bg-black/90 font-mono text-xs font-black uppercase tracking-wider shadow-brutal-xs brutal-lift flex items-center justify-center gap-2"
						>
							{isGenerating ? (
								<>
									<RotateCw className="size-4 animate-spin text-accent" />
									<span>Generating with AI...</span>
								</>
							) : (
								<>
									<Wand2 className="size-4 text-accent" />
									<span>Generate Draft Copy</span>
								</>
							)}
						</Button>
					</div>

					{notificationDraft && (
						<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-muted/40 space-y-4 shadow-brutal-xs">
							<div className="flex items-center justify-between border-b border-black/15 pb-2">
								<span className="font-mono text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
									<Check className="size-4 text-emerald-600" />
									Generated Notification Preview
								</span>
								{providerMeta?.model && (
									<span className="font-mono text-[10px] text-muted-foreground">
										{providerMeta.model}
									</span>
								)}
							</div>

							<div className="space-y-2 bg-background border-[length:var(--border-width)] border-black rounded-lg p-3.5 shadow-brutal-xs">
								<div className="flex items-center gap-2">
									<span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-black bg-accent text-black">
										{notificationDraft.category}
									</span>
									<span className="font-mono text-[10px] uppercase text-muted-foreground">
										Icon: {notificationDraft.icon_type}
									</span>
								</div>
								<div className="font-title font-black text-base text-foreground">
									{notificationDraft.title}
								</div>
								<p className="font-sans text-xs text-muted-foreground leading-relaxed">
									{notificationDraft.description}
								</p>
								<div className="pt-2 flex items-center justify-between border-t border-black/10">
									<span className="font-mono text-[10px] text-muted-foreground">
										Action: {notificationDraft.action_url}
									</span>
									<span className="font-mono text-xs font-black px-2.5 py-1 rounded border border-black bg-primary text-primary-foreground shadow-brutal-xs">
										{notificationDraft.action_label}
									</span>
								</div>
							</div>

							<Button
								type="button"
								onClick={handleApply}
								className="w-full border-[length:var(--border-width)] border-black bg-accent text-black hover:bg-accent/90 font-mono text-xs font-black uppercase tracking-wider shadow-brutal-xs brutal-lift flex items-center justify-center gap-2"
							>
								<Check className="size-4" />
								<span>Apply to Notification Form</span>
							</Button>
						</div>
					)}

					{emailDraft && (
						<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-muted/40 space-y-4 shadow-brutal-xs">
							<div className="flex items-center justify-between border-b border-black/15 pb-2">
								<span className="font-mono text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
									<Check className="size-4 text-emerald-600" />
									Generated Email Campaign Preview
								</span>
								{providerMeta?.model && (
									<span className="font-mono text-[10px] text-muted-foreground">
										{providerMeta.model}
									</span>
								)}
							</div>

							<div className="space-y-3 bg-background border-[length:var(--border-width)] border-black rounded-lg p-3.5 shadow-brutal-xs">
								<div>
									<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block">
										Subject Line
									</span>
									<div className="font-title font-black text-sm text-foreground">
										{emailDraft.subject}
									</div>
								</div>

								<div>
									<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block">
										Headline Banner
									</span>
									<div className="font-title font-bold text-xs text-foreground">
										{emailDraft.headline}
									</div>
								</div>

								<div>
									<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block">
										Markdown Content
									</span>
									<div className="font-sans text-xs text-foreground bg-muted/30 p-2.5 rounded border border-black/10 whitespace-pre-line">
										{emailDraft.body}
									</div>
								</div>

								<div className="pt-2 flex items-center justify-between border-t border-black/10">
									<span className="font-mono text-[10px] text-muted-foreground">
										CTA Link: {emailDraft.cta_url}
									</span>
									<span className="font-mono text-xs font-black px-2.5 py-1 rounded border border-black bg-accent text-black shadow-brutal-xs">
										{emailDraft.cta_label}
									</span>
								</div>
							</div>

							<Button
								type="button"
								onClick={handleApply}
								className="w-full border-[length:var(--border-width)] border-black bg-accent text-black hover:bg-accent/90 font-mono text-xs font-black uppercase tracking-wider shadow-brutal-xs brutal-lift flex items-center justify-center gap-2"
							>
								<Check className="size-4" />
								<span>Apply to Email Composer</span>
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
