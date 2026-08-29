'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { ScratchCard } from '@/components/rewards/scratch-card';
import { CoinIcon } from '../icons';

export interface ScratchCardItem {
	id: string;
	title: string;
	source: string;
	date: string;
	coins: number;
	isScratched: boolean;
	themeColor?: string;
	badge?: string;
}

interface ScratchCardModalProps {
	card: ScratchCardItem | null;
	isOpen: boolean;
	onClose: () => void;
	onCardScratched: (cardId: string, coinsWon: number) => void;
	onScratchAttempt?: () => boolean;
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
}: ScratchCardModalProps) {
	const [isCompleted, setIsCompleted] = React.useState(false);
	const titleId = React.useId();

	React.useEffect(() => {
		if (card) {
			setIsCompleted(card.isScratched);
		}
	}, [card]);

	// Lock body scroll while the modal is open.
	React.useEffect(() => {
		if (!isOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	// Close on Escape.
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

	const handleBackdropClick = React.useCallback(() => {
		onClose();
	}, [onClose]);

	// Prevent the modal panel from closing the dialog when clicked.
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
							className="absolute -top-3.5 -right-3.5 z-30 flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-background font-bold shadow-brutal transition-all hover:-translate-y-0.5 hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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
							<div className="flex size-full flex-col items-center justify-center text-center">
								<span className="flex items-center gap-1 font-mono text-4xl font-black text-foreground">
									<CoinIcon className="size-10" />
									{card.coins}
								</span>
								{isCompleted && (
									<p className="mt-1 font-title text-xs font-bold text-success">
										Added to your coin balance!
									</p>
								)}
							</div>
						</ScratchCard>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
