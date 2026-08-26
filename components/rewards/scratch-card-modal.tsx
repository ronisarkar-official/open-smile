'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Coins, X } from 'lucide-react';
import { ScratchCard } from '@/components/rewards/scratch-card';

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

export function ScratchCardModal({
	card,
	isOpen,
	onClose,
	onCardScratched,
	onScratchAttempt,
}: ScratchCardModalProps) {
	const [isCompleted, setIsCompleted] = React.useState(false);

	React.useEffect(() => {
		if (card) {
			setIsCompleted(card.isScratched);
		}
	}, [card]);

	if (!isOpen || !card) return null;

	const handleComplete = () => {
		setIsCompleted(true);
		onCardScratched(card.id, card.coins);
	};

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="fixed inset-0 bg-black/70 backdrop-blur-xs"
				/>

				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.9, y: 20 }}
					transition={{ type: 'spring', damping: 25, stiffness: 350 }}
					className="relative z-10 flex flex-col items-center justify-center">
					<button
						type="button"
						onClick={onClose}
						className="absolute -top-3.5 -right-3.5 z-30 flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-background font-bold shadow-brutal transition-all hover:-translate-y-0.5 hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
						aria-label="Close">
						<X className="size-4.5 stroke-[2.5] text-foreground" />
					</button>

					<ScratchCard
						width={280}
						height={350}
						finishPercent={45}
						isScratched={card.isScratched}
						coverColor={card.themeColor || '#FF2D78'}
						coverText="SCRATCH HERE"
						onScratchAttempt={onScratchAttempt}
						onComplete={handleComplete}>
						<div className="flex size-full flex-col items-center justify-center text-center">
							<div className="flex flex-col items-center my-auto">
								<div className="flex size-14 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-secondary shadow-brutal">
									<Coins
										className="size-8 text-black"
										strokeWidth={2.5}
									/>
								</div>
								<div className="mt-3 flex items-baseline gap-1">
									<span className="font-mono text-4xl font-black text-foreground">
										+{card.coins}
									</span>
									<span className="font-mono text-base font-bold text-muted-foreground">
										COINS
									</span>
								</div>
								<p className="mt-1 font-title text-xs font-bold text-success">
									Added to your coin balance!
								</p>
							</div>
						</div>
					</ScratchCard>
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
