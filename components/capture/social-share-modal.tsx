'use client';

import * as React from 'react';
import {
	Share2,
	Download,
	Copy,
	Check,
	Sparkles,
	Camera,
	ShieldCheck,
	Flame,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function WhatsAppIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.201.301-.777.979-.953 1.18-.175.201-.35.226-.652.075s-1.272-.469-2.423-1.496c-.896-.799-1.501-1.786-1.677-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.301.301-.501.101-.201.05-.376-.025-.527s-.677-1.631-.928-2.233c-.244-.587-.492-.507-.677-.517-.175-.01-.376-.01-.577-.01s-.527.075-.802.376c-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.201 2.122 3.24 5.14 4.544.718.31 1.279.495 1.716.634.721.23 1.377.198 1.896.12.578-.088 1.78-.727 2.031-1.429.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.54 2 2.08 6.46 2.08 11.96c0 1.87.52 3.61 1.42 5.11L2 22l5.06-1.46a9.92 9.92 0 0 0 4.98 1.34c5.5 0 9.96-4.46 9.96-9.96C22 6.46 17.54 2 12.04 2zm0 18.18c-1.62 0-3.13-.48-4.4-1.31l-.32-.21-3.05.88.89-2.98-.23-.34a8.16 8.16 0 0 1-1.25-4.26c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.22-8.04 8.22z" />
		</svg>
	);
}

function XIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

function TelegramIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
		</svg>
	);
}

function FacebookIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
		</svg>
	);
}

function RedditIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
		</svg>
	);
}

function LinkedInIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
		</svg>
	);
}

interface SocialShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageSrc: string | null;
	score: number;
	userName?: string;
}

export function SocialShareModal({
	isOpen,
	onClose,
	imageSrc,
	score,
	userName,
}: SocialShareModalProps) {
	const [isGenerating, setIsGenerating] = React.useState(false);
	const [copiedLink, setCopiedLink] = React.useState(false);

	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

	const cardConfig = React.useMemo(() => {
		if (score >= 85) {
			return {
				bgHex: '#FFD23F',
				accentHex: '#FF2D78',
				vibe: 'SUPERSTAR SMILE ✨',
				comment: 'Blinded the AI with pure joy!',
			};
		}
		if (score >= 70) {
			return {
				bgHex: '#C6F135',
				accentHex: '#7B61FF',
				vibe: 'GENUINE SMILE 😄',
				comment: 'Great energy & real smile!',
			};
		}
		return {
			bgHex: '#7B61FF',
			accentHex: '#FFD23F',
			vibe: 'SMILE CHECK COMPLETE ⚡',
			comment: 'Daily smile check unlocked!',
		};
	}, [score]);

	const origin = typeof window !== 'undefined' ? window.location.origin : 'https://opensmile.app';
	const siteUrl = origin.includes('localhost') ? 'https://opensmile.app' : origin;
	const shareMessage = `I scored ${score}/100 on Open Smile! 😄 Check out my genuine smile score & earn daily rewards: ${siteUrl}`;
	const shareTitle = `I scored ${score}/100 on Open Smile!`;

	const renderCanvasImage = React.useCallback(async (): Promise<Blob | null> => {
		const canvas = canvasRef.current || document.createElement('canvas');
		canvas.width = 1080;
		canvas.height = 1350;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		ctx.fillStyle = cardConfig.bgHex;
		ctx.fillRect(0, 0, 1080, 1350);

		ctx.fillStyle = '#00000015';
		for (let x = 0; x < 1080; x += 40) {
			for (let y = 0; y < 1350; y += 40) {
				ctx.beginPath();
				ctx.arc(x, y, 2.5, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		ctx.fillStyle = '#0F0F0F';
		ctx.fillRect(52, 52, 984, 1254);

		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(44, 44, 984, 1254);

		ctx.lineWidth = 10;
		ctx.strokeStyle = '#0F0F0F';
		ctx.strokeRect(44, 44, 984, 1254);

		ctx.fillStyle = cardConfig.bgHex;
		ctx.fillRect(80, 80, 912, 100);
		ctx.strokeRect(80, 80, 912, 100);

		ctx.fillStyle = '#0F0F0F';
		ctx.font = '900 38px monospace';
		ctx.textAlign = 'left';
		ctx.fillText('OPEN SMILE', 110, 144);

		ctx.fillStyle = cardConfig.accentHex;
		ctx.fillRect(720, 95, 240, 68);
		ctx.strokeRect(720, 95, 240, 68);

		ctx.fillStyle =
			cardConfig.accentHex === '#FFD23F' || cardConfig.accentHex === '#C6F135'
				? '#0F0F0F'
				: '#FFFFFF';
		ctx.font = '900 28px monospace';
		ctx.textAlign = 'center';
		ctx.fillText(`${score}/100 PTS`, 840, 140);

		const photoX = 80;
		const photoY = 210;
		const photoW = 912;
		const photoH = 750;

		ctx.fillStyle = '#1A1A1A';
		ctx.fillRect(photoX, photoY, photoW, photoH);

		if (imageSrc) {
			try {
				const img = new Image();
				if (!imageSrc.startsWith('data:')) {
					img.crossOrigin = 'anonymous';
				}
				img.src = imageSrc;
				await new Promise((resolve, reject) => {
					if (img.complete && img.naturalWidth !== 0) {
						resolve(null);
					} else {
						img.onload = () => resolve(null);
						img.onerror = reject;
					}
				});

				const imgRatio = img.width / img.height;
				const boxRatio = photoW / photoH;
				let sWidth = img.width;
				let sHeight = img.height;
				let sx = 0;
				let sy = 0;

				if (imgRatio > boxRatio) {
					sWidth = img.height * boxRatio;
					sx = (img.width - sWidth) / 2;
				} else {
					sHeight = img.width / boxRatio;
					sy = (img.height - sHeight) / 2;
				}

				ctx.drawImage(img, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);
			} catch {}
		}

		ctx.lineWidth = 10;
		ctx.strokeStyle = '#0F0F0F';
		ctx.strokeRect(photoX, photoY, photoW, photoH);

		ctx.save();
		ctx.translate(140, 240);
		ctx.rotate((-4 * Math.PI) / 180);
		ctx.fillStyle = cardConfig.accentHex;
		ctx.fillRect(-10, -10, 360, 68);
		ctx.strokeRect(-10, -10, 360, 68);
		ctx.fillStyle =
			cardConfig.accentHex === '#FFD23F' || cardConfig.accentHex === '#C6F135'
				? '#0F0F0F'
				: '#FFFFFF';
		ctx.font = '900 26px monospace';
		ctx.textAlign = 'center';
		ctx.fillText(cardConfig.vibe, 170, 34);
		ctx.restore();

		ctx.fillStyle = '#0F0F0F';
		ctx.fillRect(80, 990, 912, 180);

		ctx.fillStyle = cardConfig.bgHex;
		ctx.fillRect(80, 980, 912, 180);
		ctx.strokeRect(80, 980, 912, 180);

		ctx.fillStyle = '#0F0F0F';
		ctx.font = '900 36px sans-serif';
		ctx.textAlign = 'left';
		ctx.fillText(`“${cardConfig.comment}”`, 110, 1050);

		ctx.font = 'bold 24px monospace';
		ctx.fillStyle = '#44403C';
		const creatorLine = userName
			? `SMILER: ${userName.toUpperCase()} • OPEN-SMILE.APP`
			: 'OPEN-SMILE.APP • ON-DEVICE FACIAL AI';
		ctx.fillText(creatorLine, 110, 1110);

		ctx.font = 'bold 22px monospace';
		ctx.fillStyle = '#78716C';
		ctx.textAlign = 'center';
		ctx.fillText('SMILE DAILY & WIN REWARDS — VERIFIED BY ON-DEVICE AI', 540, 1240);

		return new Promise<Blob | null>((resolve) => {
			canvas.toBlob((blob) => resolve(blob), 'image/png');
		});
	}, [cardConfig, imageSrc, score, userName]);

	const handleDownload = async () => {
		setIsGenerating(true);
		try {
			const blob = await renderCanvasImage();
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `opensmile-${score}pts-${Date.now()}.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleNativeShare = async () => {
		setIsGenerating(true);
		try {
			const blob = await renderCanvasImage();
			if (blob && typeof navigator !== 'undefined' && navigator.share) {
				const file = new File([blob], `opensmile-score-${score}.png`, { type: 'image/png' });
				if (navigator.canShare && navigator.canShare({ files: [file] })) {
					await navigator.share({
						title: shareTitle,
						text: shareMessage,
						files: [file],
					});
					return;
				}
			}

			if (typeof navigator !== 'undefined' && navigator.share) {
				await navigator.share({
					title: shareTitle,
					text: shareMessage,
					url: siteUrl,
				});
				return;
			}

			await handleDownload();
		} catch {
		} finally {
			setIsGenerating(false);
		}
	};

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareMessage);
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2200);
		} catch {}
	};

	const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
	const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareMessage)}`;
	const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareMessage)}`;
	const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(shareMessage)}`;
	const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100%-2rem)] max-w-sm max-h-[92vh] overflow-y-auto p-4 sm:p-5 border-[length:var(--border-width)] border-border rounded-xl bg-card shadow-brutal-xl">
				<DialogHeader className="text-left space-y-0.5">
					<div className="flex items-center justify-between pr-8">
						<div className="flex items-center gap-2">
							<div className="flex size-7 shrink-0 items-center justify-center rounded-md border-[length:var(--border-width)] border-border bg-primary text-primary-foreground shadow-brutal-xs">
								<Sparkles className="size-3.5" strokeWidth={2.5} />
							</div>
							<DialogTitle className="font-title text-base sm:text-lg font-black tracking-tight text-foreground">
								Share Photo Card
							</DialogTitle>
						</div>
						<span className="font-mono text-xs font-black px-2 py-0.5 rounded-md border border-border bg-warning text-warning-foreground shadow-brutal-xs">
							{score}/100
						</span>
					</div>
				</DialogHeader>

				<div className="mt-2 space-y-3.5">
					<div
						style={{ backgroundColor: cardConfig.bgHex }}
						className="relative w-full max-w-[240px] mx-auto aspect-[4/5] rounded-xl border-[length:var(--border-width)] border-border p-3 shadow-brutal flex flex-col justify-between">
						<div className="flex items-center justify-between border-[length:var(--border-width-sm)] border-border bg-card px-2 py-1 rounded-md shadow-brutal-xs">
							<span className="font-mono text-[9px] font-black uppercase tracking-wider text-foreground">
								OPEN SMILE
							</span>
							<span
								style={{ backgroundColor: cardConfig.accentHex }}
								className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded-xs border border-border">
								{score}/100
							</span>
						</div>

						<div className="relative my-2 aspect-[4/3] w-full overflow-hidden rounded-md border-[length:var(--border-width)] border-border bg-muted">
							{imageSrc ? (
								<>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={imageSrc}
										alt="Smile card"
										className="size-full object-cover"
									/>
									<div
										style={{ backgroundColor: cardConfig.accentHex }}
										className="absolute top-1.5 left-1.5 -rotate-2 border border-border px-1.5 py-0.5 font-mono text-[8px] font-black uppercase text-foreground shadow-brutal-xs truncate max-w-[90%]">
										<ShieldCheck className="size-2.5 inline mr-1" />
										VERIFIED
									</div>
								</>
							) : (
								<div className="flex size-full items-center justify-center font-mono text-xs">
									<Camera className="size-5 text-muted-foreground" />
								</div>
							)}
						</div>

						<div className="rounded-md border-[length:var(--border-width-sm)] border-border bg-card/95 p-2 shadow-brutal-xs text-left">
							<p className="font-title text-[11px] font-black line-clamp-1 text-foreground">
								&ldquo;{cardConfig.comment}&rdquo;
							</p>
							<div className="flex items-center justify-between mt-0.5 font-mono text-[8px] text-muted-foreground uppercase">
								<span>{userName || 'Smiler'}</span>
								<span className="flex items-center gap-0.5 text-destructive font-bold">
									<Flame className="size-2.5" /> 100% Genuine
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-2.5 pt-1">
						<Button
							type="button"
							onClick={handleNativeShare}
							disabled={isGenerating}
							className="w-full h-10 gap-2 border-[length:var(--border-width)] border-border bg-primary text-primary-foreground font-mono text-xs font-black uppercase tracking-wider shadow-brutal brutal-lift hover:bg-primary/90">
							<Share2 className="size-4" />
							{isGenerating ? 'Preparing Card...' : 'Share Photo Card'}
						</Button>

						<div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
							<a
								href={whatsappUrl}
								target="_blank"
								rel="noopener noreferrer"
								title="WhatsApp"
								aria-label="Share on WhatsApp"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-[#25D366] text-white shadow-brutal-xs brutal-lift transition-transform">
								<WhatsAppIcon className="size-5" />
							</a>

							<a
								href={twitterUrl}
								target="_blank"
								rel="noopener noreferrer"
								title="Post on X"
								aria-label="Post on X"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-black text-white shadow-brutal-xs brutal-lift transition-transform">
								<XIcon className="size-4" />
							</a>

							<a
								href={telegramUrl}
								target="_blank"
								rel="noopener noreferrer"
								title="Telegram"
								aria-label="Share on Telegram"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-[#229ED9] text-white shadow-brutal-xs brutal-lift transition-transform">
								<TelegramIcon className="size-5" />
							</a>

							<a
								href={facebookUrl}
								target="_blank"
								rel="noopener noreferrer"
								title="Facebook"
								aria-label="Share on Facebook"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-[#1877F2] text-white shadow-brutal-xs brutal-lift transition-transform">
								<FacebookIcon className="size-5" />
							</a>

							<a
								href={redditUrl}
								target="_blank"
								rel="noopener noreferrer"
								title="Reddit"
								aria-label="Share on Reddit"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-[#FF4500] text-white shadow-brutal-xs brutal-lift transition-transform">
								<RedditIcon className="size-5" />
							</a>

							<a
								href={linkedinUrl}
								target="_blank"
								rel="noopener noreferrer"
								title="LinkedIn"
								aria-label="Share on LinkedIn"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-[#0A66C2] text-white shadow-brutal-xs brutal-lift transition-transform">
								<LinkedInIcon className="size-5" />
							</a>

							<button
								type="button"
								onClick={handleDownload}
								disabled={isGenerating}
								title="Download Photo Card"
								aria-label="Download Photo Card (PNG)"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-card text-foreground hover:bg-muted shadow-brutal-xs brutal-lift cursor-pointer transition-transform">
								<Download className="size-4.5" />
							</button>

							<button
								type="button"
								onClick={handleCopyLink}
								title="Copy Share Link & Text"
								aria-label="Copy Share Link & Text"
								className="flex h-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-border bg-card text-foreground hover:bg-muted shadow-brutal-xs brutal-lift cursor-pointer transition-transform">
								{copiedLink ? (
									<Check className="size-4.5 text-success" strokeWidth={3} />
								) : (
									<Copy className="size-4.5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
