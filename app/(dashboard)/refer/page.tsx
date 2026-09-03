'use client';

import * as React from 'react';
import {
	Camera,
	Check,
	Coins,
	Copy,
	Gift,
	Link2,
	QrCode,
	Share2,
	Sparkles,
	UserPlus,
	Users,
	ArrowUpRight,
	Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { BrandedQrCode } from '@/components/ui/branded-qr-code';
import { cn } from '@/lib/utils';

interface ReferStatsData {
	referral_code: string;
	referral_link: string;
	referrer_max_coins?: number;
	referee_max_coins?: number;
	max_daily_rewards?: number;
	stats: {
		friends_referred: number;
		bonus_coins_earned: number;
		pending_referrals: number;
	};
	remaining_today: number;
}

const steps = [
	{
		number: '01',
		title: 'Share your link',
		description: 'Send your referral link or code to a friend via WhatsApp, SMS, or social apps.',
		icon: Share2,
		color: 'bg-primary text-primary-foreground',
		badgeBg: 'bg-primary/20 text-foreground border-primary/40',
	},
	{
		number: '02',
		title: 'Friend captures a smile',
		description: 'They sign up and complete their first on-device smile check.',
		icon: Camera,
		color: 'bg-accent text-accent-foreground',
		badgeBg: 'bg-accent/30 text-foreground border-accent/60',
	},
	{
		number: '03',
		title: 'Both win Scratch Cards',
		description: 'You unlock a Mystery Scratch Card and your friend unlocks a Welcome Scratch Card!',
		icon: Gift,
		color: 'bg-secondary text-secondary-foreground',
		badgeBg: 'bg-secondary/20 text-foreground border-secondary/40',
	},
];

function WhatsAppIcon({ className = 'size-4' }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
		</svg>
	);
}

function TelegramIcon({ className = 'size-4' }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
		</svg>
	);
}

function XIcon({ className = 'size-4' }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

export default function ReferPage() {
	const [data, setData] = React.useState<ReferStatsData>({
		referral_code: 'SMILE-JOIN',
		referral_link: 'https://opensmile.app/join/SMILE-JOIN',
		stats: {
			friends_referred: 0,
			bonus_coins_earned: 0,
			pending_referrals: 0,
		},
		remaining_today: 5,
	});
	const [copiedCode, setCopiedCode] = React.useState(false);
	const [copiedLink, setCopiedLink] = React.useState(false);
	const [toastMessage, setToastMessage] = React.useState<string | null>(null);
	const [qrDialogOpen, setQrDialogOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const showToast = (msg: string) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 2500);
	};

	React.useEffect(() => {
		async function loadStats() {
			try {
				const res = await fetch('/api/refer/stats');
				if (res.ok) {
					const json = await res.json();
					setData(json);
				}
			} catch {
			} finally {
				setIsLoading(false);
			}
		}
		loadStats();
	}, []);

	const handleCopyCode = () => {
		navigator.clipboard.writeText(data.referral_code);
		setCopiedCode(true);
		showToast('Referral code copied to clipboard!');
		setTimeout(() => setCopiedCode(false), 2000);
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(data.referral_link);
		setCopiedLink(true);
		showToast('Referral link copied to clipboard!');
		setTimeout(() => setCopiedLink(false), 2000);
	};

	const referrerMax = data.referrer_max_coins || 200;
	const refereeMax = data.referee_max_coins || 50;

	const shareMessage = `Join me on Open Smile! Use my referral code ${data.referral_code} to unlock a Welcome Scratch Card with up to ${refereeMax} bonus coins:`;

	const handleShare = async () => {
		if (typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({
					title: 'Join me on Open Smile!',
					text: `Use my code ${data.referral_code} to unlock a Welcome Scratch Card with up to ${refereeMax} bonus coins on your first smile check!`,
					url: data.referral_link,
				});
				return;
			} catch (err: any) {
				if (err.name === 'AbortError') return;
			}
		}
		handleCopyLink();
	};

	const stats = [
		{
			label: 'Friends referred',
			value: data.stats.friends_referred.toLocaleString(),
			icon: Users,
			color: 'bg-accent/20 text-accent-foreground border-accent/40',
			iconColor: 'bg-accent text-accent-foreground',
		},
		{
			label: 'Bonus coins earned',
			value: data.stats.bonus_coins_earned.toLocaleString(),
			icon: Coins,
			color: 'bg-primary/20 text-primary-foreground border-primary/40',
			iconColor: 'bg-primary text-primary-foreground',
		},
		{
			label: 'Pending referrals',
			value: data.stats.pending_referrals.toLocaleString(),
			icon: UserPlus,
			color: 'bg-secondary/20 text-secondary-foreground border-secondary/40',
			iconColor: 'bg-secondary text-secondary-foreground',
		},
	];

	return (
		<main
			id="main-content"
			className="mx-auto w-full max-w-[1200px] px-3.5 py-4 sm:px-6 sm:py-8 space-y-6 sm:space-y-8 relative"
		>
			{/* Floating Toast Feedback */}
			{toastMessage && (
				<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
					<div className="flex items-center gap-2 border-[length:var(--border-width)] border-border bg-foreground text-background px-4 py-2.5 rounded-lg shadow-brutal font-mono text-xs sm:text-sm font-black">
						<Check className="size-4 text-success" strokeWidth={3} />
						<span>{toastMessage}</span>
					</div>
				</div>
			)}

			{/* Page Header */}
			<div className="space-y-2">
				<div className="inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-border rounded-md bg-accent px-2.5 py-0.5 font-mono text-[10px] sm:text-xs font-black uppercase text-accent-foreground shadow-brutal-xs">
					<Sparkles className="size-3" />
					Viral Rewards
				</div>
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-title tracking-tight text-foreground">
					Refer &amp; Earn
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground max-w-[60ch] leading-relaxed text-pretty">
					Invite friends to Open Smile. When they complete their first smile check, you unlock a Mystery Scratch Card (
					<strong className="text-foreground">up to {referrerMax} coins</strong>) and they unlock a Welcome Scratch Card (
					<strong className="text-foreground">up to {refereeMax} coins</strong>).
				</p>
			</div>

			{/* Mobile Incentive Banner (Visible on mobile/tablet) */}
			<div className="lg:hidden border-[length:var(--border-width)] border-border rounded-xl bg-primary p-3.5 sm:p-4 text-primary-foreground shadow-brutal-sm flex items-center justify-between gap-3 min-w-0 w-full">
				<div className="flex items-center gap-3 min-w-0">
					<div className="size-10 rounded-lg border-[length:var(--border-width)] border-border bg-card text-foreground flex items-center justify-center shrink-0 shadow-brutal-xs">
						<Gift className="size-5 text-primary" strokeWidth={2.5} />
					</div>
					<div className="min-w-0">
						<p className="text-sm sm:text-base font-black font-title tracking-tight truncate">
							Win Up To {referrerMax} Coins Per Friend
						</p>
						<p className="text-xs font-semibold text-primary-foreground/90 truncate">
							Both receive exclusive Mystery Scratch Cards
						</p>
					</div>
				</div>
			</div>

			{/* Main Grid: Hero Referral + Side Cards */}
			<section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr] min-w-0 w-full">
				{/* Referral Code & Share Hub */}
				<article className="border-[length:var(--border-width)] border-border rounded-xl bg-card p-3.5 sm:p-6 shadow-brutal flex flex-col justify-between gap-4 sm:gap-5 min-w-0 w-full overflow-hidden">
					<div className="space-y-4 min-w-0 w-full">
						{/* Referral Code Section */}
						<div className="min-w-0 w-full">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2 min-w-0">
									<Link2 className="size-4 sm:size-5 text-primary shrink-0" strokeWidth={2.5} />
									<p className="font-mono text-xs font-bold tracking-[0.12em] uppercase text-muted-foreground truncate">
										Your Referral Code
									</p>
								</div>
								<span className="font-mono text-[10px] font-bold text-muted-foreground shrink-0 hidden sm:inline">
									Tap to copy
								</span>
							</div>

							{/* Interactive Code Box */}
							<div className="mt-2 flex items-stretch gap-2 min-w-0 w-full">
								<button
									type="button"
									onClick={handleCopyCode}
									className="group flex-1 min-w-0 flex items-center justify-between border-[length:var(--border-width)] border-border rounded-lg bg-muted/70 hover:bg-muted active:scale-[0.99] transition-all px-3 py-2.5 sm:px-4 sm:py-3.5 text-left cursor-pointer shadow-brutal-xs overflow-hidden"
									title="Click to copy referral code"
								>
									<span className="font-mono text-base sm:text-2xl font-black tracking-wider text-foreground truncate select-all">
										{data.referral_code}
									</span>
									<span className="font-mono text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2 sm:hidden">
										{copiedCode ? 'Copied!' : 'Copy'}
									</span>
								</button>
								<Button
									variant="outline"
									className="h-auto px-3 sm:px-4 shrink-0 font-mono text-xs font-bold gap-1.5 cursor-pointer border-[length:var(--border-width)] border-border shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5"
									onClick={handleCopyCode}
									aria-label="Copy referral code"
								>
									{copiedCode ? (
										<Check className="size-4 text-success" strokeWidth={2.5} />
									) : (
										<Copy className="size-4" />
									)}
									<span className="hidden sm:inline">{copiedCode ? 'Copied' : 'Copy'}</span>
								</Button>
							</div>
						</div>

						{/* Shareable Link Input */}
						<div className="min-w-0 w-full">
							<p className="font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase text-muted-foreground">
								Shareable Direct Link
							</p>
							<div className="mt-1.5 flex items-stretch gap-2 min-w-0 w-full">
								<button
									type="button"
									onClick={handleCopyLink}
									className="flex-1 min-w-0 overflow-hidden border-[length:var(--border-width)] border-dashed border-border rounded-lg bg-muted/40 hover:bg-muted/60 px-3 py-2 sm:px-4 sm:py-2.5 text-left transition-colors cursor-pointer"
									title="Click to copy link"
								>
									<p className="truncate font-mono text-xs sm:text-sm font-semibold text-muted-foreground select-all">
										{data.referral_link}
									</p>
								</button>
								<Button
									variant="outline"
									size="icon"
									className="size-10 sm:size-11 shrink-0 cursor-pointer border-[length:var(--border-width)] border-border shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5"
									onClick={handleCopyLink}
									aria-label="Copy referral link"
								>
									{copiedLink ? (
										<Check className="size-4.5 text-success" strokeWidth={2.5} />
									) : (
										<Copy className="size-4.5" />
									)}
								</Button>
							</div>
						</div>

						{/* Primary Action Buttons */}
						<div className="pt-1 flex flex-col sm:flex-row gap-2 min-w-0 w-full">
							<Button
								size="lg"
								className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base font-black font-title tracking-tight gap-2 cursor-pointer shadow-brutal brutal-lift min-w-0"
								onClick={handleShare}
							>
								<Share2 className="size-4.5 shrink-0" />
								<span className="truncate">Share Referral Link</span>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base font-black font-title tracking-tight gap-2 cursor-pointer border-[length:var(--border-width)] border-border shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 min-w-0"
								onClick={handleCopyLink}
							>
								{copiedLink ? (
									<Check className="size-4 text-success shrink-0" />
								) : (
									<Copy className="size-4 shrink-0" />
								)}
								<span className="truncate">{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
							</Button>
						</div>

						{/* Quick Mobile Social Share Channels */}
						<div className="pt-1 min-w-0 w-full">
							<p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
								Instant 1-Tap Share
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-0 w-full">
								{/* WhatsApp */}
								<a
									href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
										`${shareMessage} ${data.referral_link}`
									)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 h-11 sm:h-12 rounded-lg border-[length:var(--border-width)] border-border bg-[#25D366]/15 hover:bg-[#25D366]/25 text-foreground transition-transform active:scale-[0.96] shadow-brutal-xs px-2 min-w-0"
									title="Share to WhatsApp"
								>
									<WhatsAppIcon className="size-4 text-[#25D366] shrink-0" />
									<span className="font-mono text-xs font-black truncate">WhatsApp</span>
								</a>

								{/* Telegram */}
								<a
									href={`https://t.me/share/url?url=${encodeURIComponent(
										data.referral_link
									)}&text=${encodeURIComponent(shareMessage)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 h-11 sm:h-12 rounded-lg border-[length:var(--border-width)] border-border bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-foreground transition-transform active:scale-[0.96] shadow-brutal-xs px-2 min-w-0"
									title="Share to Telegram"
								>
									<TelegramIcon className="size-4 text-[#229ED9] shrink-0" />
									<span className="font-mono text-xs font-black truncate">Telegram</span>
								</a>

								{/* X / Twitter */}
								<a
									href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
										shareMessage
									)}&url=${encodeURIComponent(data.referral_link)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 h-11 sm:h-12 rounded-lg border-[length:var(--border-width)] border-border bg-foreground/10 hover:bg-foreground/15 text-foreground transition-transform active:scale-[0.96] shadow-brutal-xs px-2 min-w-0"
									title="Share to X"
								>
									<XIcon className="size-3.5 text-foreground shrink-0" />
									<span className="font-mono text-xs font-black truncate">Post on X</span>
								</a>

								{/* In-Person QR Code Modal Trigger */}
								<Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
									<DialogTrigger asChild>
										<button
											type="button"
											className="flex items-center justify-center gap-1.5 h-11 sm:h-12 rounded-lg border-[length:var(--border-width)] border-border bg-muted hover:bg-muted/80 text-foreground transition-transform active:scale-[0.96] shadow-brutal-xs px-2 min-w-0 cursor-pointer"
											title="Show QR Code"
										>
											<QrCode className="size-4 text-foreground shrink-0" strokeWidth={2.5} />
											<span className="font-mono text-xs font-black truncate">QR Code</span>
										</button>
									</DialogTrigger>
									<DialogContent className="max-w-xs sm:max-w-sm border-[length:var(--border-width)] border-border bg-card shadow-brutal-lg rounded-xl p-5">
										<DialogHeader>
											<DialogTitle className="text-center font-black font-title text-lg uppercase tracking-tight">
												Scan &amp; Join
											</DialogTitle>
										</DialogHeader>
										<div className="flex flex-col items-center gap-4 py-2 text-center w-full">
											<BrandedQrCode
												value={data.referral_link}
												size={210}
												logoSize={50}
												showDownload={true}
												downloadFileName={`open-smile-referral-${data.referral_code}.png`}
											/>
											<div className="space-y-1 w-full">
												<p className="font-mono text-xs font-bold text-muted-foreground uppercase">
													Your Code
												</p>
												<div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-border rounded-md bg-muted px-3 py-1 font-mono text-base font-black">
													{data.referral_code}
												</div>
											</div>
											<Button
												size="sm"
												className="w-full font-mono text-xs font-bold gap-1.5"
												onClick={() => {
													handleCopyLink();
													setQrDialogOpen(false);
												}}
											>
												<Copy className="size-3.5" />
												Copy Link Instead
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</div>

					{/* Anti-cheat daily cap note */}
					<div className="mt-1 flex items-center gap-2.5 border-[length:var(--border-width)] border-border rounded-lg bg-success/15 px-3.5 py-2.5 text-foreground">
						<Sparkles className="size-4 shrink-0 text-success" strokeWidth={2.5} />
						<p className="font-mono text-xs font-bold leading-tight">
							{data.remaining_today} / {data.max_daily_rewards || 5} referral rewards remaining today
						</p>
					</div>
				</article>

				{/* Desktop Side Column (Hidden on small screens since incentive & QR are integrated) */}
				<div className="hidden lg:flex flex-col gap-5">
					{/* Desktop Scratch Card Incentive Card */}
					<article className="border-[length:var(--border-width)] border-border rounded-xl bg-primary p-6 text-primary-foreground shadow-brutal relative overflow-hidden">
						<div className="flex items-center justify-between">
							<Gift className="size-8 text-primary-foreground" strokeWidth={2.5} />
							<span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-primary-foreground/30 bg-primary-foreground/10">
								Dual Scratch Cards
							</span>
						</div>
						<p className="mt-4 text-2xl font-black font-title tracking-tight">
							Win up to {referrerMax} coins per friend
						</p>
						<p className="mt-1 text-sm font-semibold text-primary-foreground/90">
							Your friend also unlocks a Welcome Scratch Card with up to {refereeMax} coins on their first smile check.
						</p>
					</article>

					{/* Desktop QR Card */}
					<article className="border-[length:var(--border-width)] border-border rounded-xl bg-card p-5 shadow-brutal flex flex-col items-center text-center">
						<div className="w-full flex items-center justify-between pb-3 border-b-[length:var(--border-width)] border-border/15">
							<div className="flex items-center gap-2">
								<QrCode className="size-4 text-foreground" strokeWidth={2.5} />
								<p className="font-mono text-xs font-bold tracking-wider uppercase text-muted-foreground">
									In-Person QR Code
								</p>
							</div>
							<span className="font-mono text-[10px] font-bold text-muted-foreground">Live</span>
						</div>
						<div className="mt-4 w-full flex flex-col items-center">
							<BrandedQrCode
								value={data.referral_link}
								size={170}
								logoSize={42}
								showDownload={true}
								downloadFileName={`open-smile-referral-${data.referral_code}.png`}
							/>
						</div>
						<p className="mt-3 font-mono text-xs text-muted-foreground font-semibold">
							Have a friend scan this with their phone camera to join instantly
						</p>
					</article>
				</div>
			</section>

			{/* Referral Stats (Mobile Optimized Row) */}
			<section aria-label="Referral stats" className="space-y-3">
				<div className="flex items-center justify-between">
					<p className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">
						Your Referral Impact
					</p>
					<span className="font-mono text-[11px] font-bold text-muted-foreground">Live Stats</span>
				</div>
				<div className="grid grid-cols-3 gap-2.5 sm:gap-4">
					{stats.map(({ label, value, icon: StatIcon, color, iconColor }) => (
						<article
							key={label}
							className="border-[length:var(--border-width)] border-border rounded-xl bg-card p-3 sm:p-5 shadow-brutal-xs sm:shadow-brutal flex flex-col justify-between min-h-[105px] sm:min-h-36"
						>
							<div className="flex items-center justify-between">
								<div
									className={cn(
										'size-7 sm:size-9 rounded-md border-[length:var(--border-width)] border-border flex items-center justify-center shadow-brutal-xs shrink-0',
										iconColor
									)}
								>
									<StatIcon className="size-3.5 sm:size-5" strokeWidth={2.5} />
								</div>
							</div>
							<div className="mt-2 sm:mt-auto">
								<p className="font-mono text-xl sm:text-3xl lg:text-4xl font-black tracking-tight tabular-nums text-foreground">
									{value}
								</p>
								<p className="font-mono text-[9px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground line-clamp-1 mt-0.5">
									{label}
								</p>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* How it Works Section (Mobile-Friendly Connected Steps) */}
			<section className="space-y-3 pt-2">
				<div className="flex items-center gap-2">
					<Smartphone className="size-4 text-primary" strokeWidth={2.5} />
					<p className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">
						How It Works
					</p>
				</div>
				<h2 className="text-xl sm:text-2xl font-black font-title tracking-tight text-foreground">
					Three Simple Steps
				</h2>

				<ol className="grid gap-3 sm:gap-5 sm:grid-cols-3 pt-1">
					{steps.map((step) => {
						const StepIcon = step.icon;
						return (
							<li
								key={step.number}
								className="border-[length:var(--border-width)] border-border rounded-xl bg-card p-4 sm:p-5 shadow-brutal-xs sm:shadow-brutal flex flex-col justify-between relative overflow-hidden"
							>
								<div className="flex items-center justify-between">
									<span
										className={cn(
											'font-mono text-xs font-black px-2 py-0.5 rounded border-[length:var(--border-width)] shadow-brutal-xs',
											step.badgeBg
										)}
									>
										STEP {step.number}
									</span>
									<div
										className={cn(
											'size-8 sm:size-9 rounded-md border-[length:var(--border-width)] border-border flex items-center justify-center shadow-brutal-xs',
											step.color
										)}
									>
										<StepIcon className="size-4 sm:size-5" strokeWidth={2.5} />
									</div>
								</div>

								<div className="mt-3 sm:mt-6">
									<h3 className="text-sm sm:text-base font-black font-title tracking-tight text-foreground">
										{step.title}
									</h3>
									<p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
										{step.description}
									</p>
								</div>
							</li>
						);
					})}
				</ol>
			</section>
		</main>
	);
}
