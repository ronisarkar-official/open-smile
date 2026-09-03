'use client';

import * as React from 'react';
import {
	Check,
	Copy,
	QrCode,
	Share2,
	Sparkles,
	ExternalLink,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BrandedQrCode } from '@/components/ui/branded-qr-code';

interface ShareProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	name: string;
	username: string;
	streakCount: number;
	tierName: string;
	referralCode?: string;
}

export function ShareProfileModal({
	isOpen,
	onClose,
	name,
	username,
	streakCount,
	tierName,
	referralCode,
}: ShareProfileModalProps) {
	const [copied, setCopied] = React.useState(false);
	const [activeTab, setActiveTab] = React.useState<'link' | 'qr'>('link');

	const origin = typeof window !== 'undefined' ? window.location.origin : 'https://opensmile.app';
	const publicProfileUrl = `${origin}/u/${encodeURIComponent(username)}`;
	const referralUrl = referralCode ? `${origin}/join/${encodeURIComponent(referralCode)}` : publicProfileUrl;

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(publicProfileUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback
		}
	};

	const shareText = `Check out my ${streakCount}-day smile streak and "${tierName}" status on Open Smile! 😄 Join me and earn real rewards for smiling daily:`;

	const handleNativeShare = async () => {
		if (typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({
					title: `${name}'s Open Smile Profile`,
					text: shareText,
					url: referralUrl,
				});
			} catch {
				// User cancelled or share failed
			}
		} else {
			handleCopy();
		}
	};

	const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${referralUrl}`)}`;
	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralUrl)}`;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-lg">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<span className="flex size-7 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground shadow-brutal-xs">
							<Share2 className="size-4" strokeWidth={2.5} />
						</span>
						<DialogTitle className="font-title text-xl font-black tracking-tight">
							Share Smiler Profile
						</DialogTitle>
					</div>
					<p className="font-mono text-xs text-muted-foreground mt-1">
						Brag about your smile streak and invite friends to earn rewards.
					</p>
				</DialogHeader>

				{/* Tab Selector */}
				<div className="grid grid-cols-2 gap-2 mt-2">
					<button
						type="button"
						onClick={() => setActiveTab('link')}
						className={`flex items-center justify-center gap-2 border-[length:var(--border-width)] border-black rounded-lg py-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
							activeTab === 'link'
								? 'bg-primary text-primary-foreground shadow-brutal-xs'
								: 'bg-muted/50 text-muted-foreground hover:bg-muted'
						}`}
					>
						<Share2 className="size-3.5" />
						Share Link
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('qr')}
						className={`flex items-center justify-center gap-2 border-[length:var(--border-width)] border-black rounded-lg py-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
							activeTab === 'qr'
								? 'bg-primary text-primary-foreground shadow-brutal-xs'
								: 'bg-muted/50 text-muted-foreground hover:bg-muted'
						}`}
					>
						<QrCode className="size-3.5" />
						QR Badge
					</button>
				</div>

				{activeTab === 'link' ? (
					<div className="space-y-4 pt-2">
						{/* Card Preview */}
						<div className="border-[length:var(--border-width)] border-black rounded-xl bg-secondary/10 p-4 shadow-brutal-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Sparkles className="size-4 text-primary" strokeWidth={2.5} />
									<span className="font-title text-sm font-black">{name}</span>
								</div>
								<span className="font-mono text-[11px] font-black uppercase px-2 py-0.5 border-[length:var(--border-width)] border-black rounded-md bg-secondary text-secondary-foreground shadow-brutal-xs">
									{streakCount} Day Streak 🔥
								</span>
							</div>
							<p className="mt-1 font-mono text-xs text-muted-foreground">
								Tier: <strong className="text-foreground">{tierName}</strong>
							</p>
						</div>

						{/* Copy Link Input */}
						<div className="space-y-1.5">
							<label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
								Public Profile URL
							</label>
							<div className="flex items-center gap-2">
								<input
									readOnly
									value={publicProfileUrl}
									className="flex-1 border-[length:var(--border-width)] border-black rounded-lg bg-muted/40 px-3 py-2 font-mono text-xs text-foreground select-all focus:outline-none"
								/>
								<Button
									type="button"
									onClick={handleCopy}
									className="border-[length:var(--border-width)] border-black rounded-lg bg-accent text-accent-foreground font-title font-black text-xs uppercase px-4 shadow-brutal-xs brutal-lift hover:bg-accent/90 shrink-0"
								>
									{copied ? (
										<>
											<Check className="size-3.5 mr-1 text-emerald-600" strokeWidth={3} />
											Copied!
										</>
									) : (
										<>
											<Copy className="size-3.5 mr-1" strokeWidth={2.5} />
											Copy
										</>
									)}
								</Button>
							</div>
						</div>

						{/* Social Share Buttons */}
						<div className="pt-2 border-t-[length:var(--border-width)] border-black/15">
							<p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
								Instant Share
							</p>
							<div className="grid grid-cols-2 gap-2">
								<a
									href={whatsappUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 border-[length:var(--border-width)] border-black rounded-lg bg-[#25D366] text-white py-2 font-title font-bold text-xs uppercase shadow-brutal-xs brutal-lift"
								>
									WhatsApp
								</a>
								<a
									href={twitterUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 border-[length:var(--border-width)] border-black rounded-lg bg-black text-white py-2 font-title font-bold text-xs uppercase shadow-brutal-xs brutal-lift"
								>
									Post on X
								</a>
							</div>
						</div>

						{/* Native Web Share Button */}
						{typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
							<Button
								type="button"
								onClick={handleNativeShare}
								className="w-full border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-xs uppercase py-2.5 shadow-brutal brutal-lift hover:bg-primary/90"
							>
								<Share2 className="size-4 mr-1.5" strokeWidth={2.5} />
								Share via Device
							</Button>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center pt-3 pb-1 space-y-4">
						<div className="border-[length:var(--border-width)] border-black rounded-xl bg-white p-4 shadow-brutal-md">
							<BrandedQrCode
								value={publicProfileUrl}
								size={190}
								logoSrc="/icons/icon-192x192.png"
								logoSize={44}
								showDownload
								downloadFileName={`${username}-smile-qr.png`}
							/>
						</div>
						<p className="text-center font-mono text-xs text-muted-foreground max-w-xs">
							Point any phone camera to instantly view your Open Smile profile and streak trophies.
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
