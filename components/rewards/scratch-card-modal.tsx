'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Copy, Check, Gift } from 'lucide-react';
import { ScratchCard } from '@/components/rewards/scratch-card';
import { Button } from '@/components/ui/button';
import { CoinIcon } from '../icons';

function SparkleStar({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden="true">
			<path d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z" />
		</svg>
	);
}

export interface ScratchCardItem {
	id: string;
	title: string;
	source: string;
	date: string;
	coins: number;
	isScratched: boolean;
	themeColor?: string;
	badge?: string;
	message?: string;
	voucherId?: string;
	voucherTitle?: string;
	voucherCode?: string;
	voucherBrand?: string;
}

interface ScratchCardModalProps {
	card: ScratchCardItem | null;
	isOpen: boolean;
	onClose: () => void;
	onCardScratched: (cardId: string, coinsWon: number) => void;
	onScratchAttempt?: () => boolean;
	userName?: string | null;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 350;
const SCRATCH_FINISH_PERCENT = 45;
const DEFAULT_COVER_COLOR = '#FF2D78';

const BACKDROP_TRANSITION = { duration: 0.2 } as const;
const PANEL_TRANSITION = {
	type: 'spring',
	damping: 25,
	stiffness: 350,
} as const;

export function ScratchCardModal({
	card,
	isOpen,
	onClose,
	onCardScratched,
	onScratchAttempt,
	userName,
}: ScratchCardModalProps) {
	const [isCompleted, setIsCompleted] = React.useState(false);
	const [copied, setCopied] = React.useState(false);
	const titleId = React.useId();
	const displayName = userName?.trim().split(/\s+/)[0];

	React.useEffect(() => {
		if (card) {
			setIsCompleted(card.isScratched);
			setCopied(false);
		}
	}, [card]);

	React.useEffect(() => {
		if (!isOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	React.useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	const handleComplete = React.useCallback(() => {
		if (!card) return;
		setIsCompleted(true);
		onCardScratched(card.id, card.coins);
	}, [card, onCardScratched]);

	const handleRedeem = React.useCallback(() => {
		if (card && !isCompleted) {
			handleComplete();
		}
		onClose();
	}, [card, isCompleted, handleComplete, onClose]);

	const handleCopyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleBackdropClick = React.useCallback(() => {
		onClose();
	}, [onClose]);

	const stopPropagation = React.useCallback((event: React.MouseEvent) => {
		event.stopPropagation();
	}, []);

	return (
		<AnimatePresence>
			{isOpen && card && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					role="dialog"
					aria-modal="true"
					aria-labelledby={titleId}>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={BACKDROP_TRANSITION}
						onClick={handleBackdropClick}
						className="fixed inset-0 bg-black/70 backdrop-blur-xs"
						aria-hidden="true"
					/>

					{/* Hurray Header */}
					<motion.div
						initial={{ opacity: 0, y: -16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -16 }}
						transition={PANEL_TRANSITION}
						className="fixed top-8 sm:top-12 left-0 right-0 z-20 flex flex-col items-center text-center px-4 pointer-events-none">
						<div className="relative inline-flex items-center justify-center">
							<SparkleStar className="absolute -left-5 -top-1 size-4 text-[#FDE047] drop-shadow-[0_0_8px_rgba(253,224,71,0.9)] animate-pulse" />
							<SparkleStar className="absolute -right-5 -top-0.5 size-3.5 text-[#FDE047] drop-shadow-[0_0_8px_rgba(253,224,71,0.9)] animate-pulse delay-200" />
							<SparkleStar className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 size-2.5 text-[#FDE047] drop-shadow-[0_0_6px_rgba(253,224,71,0.8)] opacity-90" />

							<h2
								className="relative font-black tracking-widest text-4xl sm:text-5xl uppercase select-none text-[#FEE600] px-2 py-0.5"
								style={{
									textShadow:
										'0 1px 0 #8B5CF6, 0 2px 0 #7C3AED, 0 3px 0 #6D28D9, 0 4px 0 #5B21B6, 0 5px 0 #4C1D95, 0 6px 0 #2E1065, 0 8px 14px rgba(0,0,0,0.85)',
									filter: 'drop-shadow(0 4px 10px rgba(124, 58, 237, 0.5))',
								}}>
								HURRAY!
							</h2>
						</div>

						<p className="mt-2.5 text-base sm:text-lg font-medium text-white/95 tracking-tight">
							{displayName ? (
								<strong className="font-extrabold text-white">{displayName}, </strong>
							) : null}
							{card.voucherCode ? "Here's your scratch voucher!" : "You've won a scratch card!"}
						</p>
					</motion.div>

					{/* Centered Scratch Card Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={PANEL_TRANSITION}
						onClick={stopPropagation}
						className="relative z-10 flex flex-col items-center justify-center">
						<span
							id={titleId}
							className="sr-only">
							{card.title} scratch card
						</span>

						<button
							type="button"
							onClick={onClose}
							className="absolute -top-3.5 -right-3.5 z-30 flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-background font-bold shadow-brutal transition-all hover:-translate-y-0.5 hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
							aria-label="Close">
							<X className="size-4.5 stroke-[2.5] text-foreground" />
						</button>

						<ScratchCard
							width={CARD_WIDTH}
							height={CARD_HEIGHT}
							finishPercent={SCRATCH_FINISH_PERCENT}
							isScratched={card.isScratched}
							coverColor={card.themeColor || DEFAULT_COVER_COLOR}
							coverText="SCRATCH HERE"
							onScratchAttempt={onScratchAttempt}
							onComplete={handleComplete}>
							{card.voucherCode ? (
								<div className="flex size-full flex-col items-center justify-between py-2.5 px-2 text-center">
									<div>
										<span className="inline-block border border-black rounded-xs bg-accent px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black">
											{card.voucherBrand || 'Gift Voucher'}
										</span>
										<p className="mt-1.5 font-title text-sm font-black uppercase tracking-tight text-foreground leading-tight">
											{card.voucherTitle || card.title}
										</p>
									</div>

									<div className="my-auto flex flex-col items-center justify-center w-full px-1">
										<p className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
											Redemption Code
										</p>
										<div className="flex items-center justify-between gap-1.5 w-full border-[length:var(--border-width)] border-black rounded-lg bg-card px-2.5 py-1.5 shadow-brutal-xs">
											<span className="font-mono text-xs sm:text-sm font-black tracking-wider text-primary truncate">
												{card.voucherCode}
											</span>
											<button
												type="button"
												onClick={() => handleCopyCode(card.voucherCode!)}
												className="p-1 hover:bg-muted rounded-xs cursor-pointer"
												title="Copy voucher code">
												{copied ? (
													<Check className="size-3.5 text-success" />
												) : (
													<Copy className="size-3.5 text-foreground" />
												)}
											</button>
										</div>
									</div>

									<Button
										type="button"
										onClick={handleRedeem}
										variant="default"
										size="default"
										className="w-full font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm">
										Claim Voucher
									</Button>
								</div>
							) : card.coins === 0 ? (
								<div className="flex size-full flex-col items-center justify-between py-2 px-1 text-center">
									<p className="font-mono text-xs font-bold tracking-tight text-muted-foreground">
										Better luck next time!
									</p>
									<div className="flex flex-col items-center justify-center my-auto">
										<div className="mb-2 flex size-14 items-center justify-center rounded-2xl border-[length:var(--border-width)] border-black bg-muted/80 shadow-brutal-sm">
											<span
												className="text-3xl select-none"
												role="img"
												aria-label="Empty reward">
												🙈
											</span>
										</div>
										<h3 className="font-display text-lg font-black uppercase tracking-tight text-foreground">
											Oops! Nothing here
										</h3>
										<p className="mt-1 font-mono text-xs font-bold leading-snug text-muted-foreground">
											you might be lucky next time
										</p>
									</div>
									<Button
										type="button"
										onClick={onClose}
										variant="outline"
										size="default"
										className="w-full font-mono text-xs font-bold uppercase tracking-wider">
										Close
									</Button>
								</div>
							) : (
								<div className="flex size-full flex-col items-center justify-between py-2 px-1 text-center">
									<p className="font-mono text-xs font-bold tracking-tight text-muted-foreground">
										🎉Congratulations! You have won
									</p>
									<div className="flex flex-col items-center justify-center my-auto gap-0.5">
										<div className="flex items-center justify-center gap-2">
											<CoinIcon className="size-11" />
											<span className="font-mono text-4xl sm:text-5xl font-black text-foreground tracking-tight">
												{card.coins}
											</span>
										</div>
										<span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
											Coins
										</span>
									</div>
									<Button
										type="button"
										onClick={handleRedeem}
										variant="default"
										size="default"
										className="w-full font-mono text-xs font-bold uppercase tracking-wider">
										Redeem coins
									</Button>
								</div>
							)}
						</ScratchCard>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
