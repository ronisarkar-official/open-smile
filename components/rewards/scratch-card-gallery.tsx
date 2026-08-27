'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	ArrowRight,
	Camera,
	Gift,
	History,
	Trophy,
	Sparkles,
	CheckCircle2,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import {
	ScratchCardModal,
	type ScratchCardItem,
} from '@/components/rewards/scratch-card-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const initialCards: ScratchCardItem[] = [
	{
		id: 'sc-1',
		title: "Today's Smile Check",
		source: 'Daily Streak Bonus',
		date: 'Today',
		coins: 35,
		isScratched: false,
		themeColor: '#FF2D78',
		badge: 'NEW',
	},
	{
		id: 'sc-2',
		title: 'Referral Mystery Gift',
		source: 'Friend Invite (Alex)',
		date: 'Yesterday',
		coins: 200,
		isScratched: false,
		themeColor: '#22C55E',
		badge: 'SUPER',
	},
	{
		id: 'sc-3',
		title: '3-Day Streak Milestone',
		source: 'Habit Reward',
		date: 'Aug 22, 2026',
		coins: 50,
		isScratched: true,
		themeColor: '#7B61FF',
	},
	{
		id: 'sc-4',
		title: 'Duchenne Smile 95+ Score',
		source: 'Quality Smile Check',
		date: 'Aug 21, 2026',
		coins: 40,
		isScratched: true,
		themeColor: '#C6F135',
	},
	{
		id: 'sc-5',
		title: 'First Smile Bonus',
		source: 'Signup Welcome',
		date: 'Aug 18, 2026',
		coins: 100,
		isScratched: true,
		themeColor: '#FBBF24',
	},
	{
		id: 'sc-6',
		title: 'Daily Smile Check',
		source: 'Daily Streak',
		date: 'Aug 17, 2026',
		coins: 20,
		isScratched: true,
		themeColor: '#22C55E',
	},
];

export function ScratchCardGallery() {
	const [cards, setCards] = React.useState<ScratchCardItem[]>(initialCards);
	const [selectedCard, setSelectedCard] =
		React.useState<ScratchCardItem | null>(null);
	const [modalOpen, setModalOpen] = React.useState(false);

	const totalCoinsWon = cards
		.filter((c) => c.isScratched)
		.reduce((acc, c) => acc + c.coins, 0);

	const handleCardClick = (card: ScratchCardItem) => {
		setSelectedCard(card);
		setModalOpen(true);
	};

	const handleCardScratched = (cardId: string) => {
		setCards((prev) =>
			prev.map((c) => (c.id === cardId ? { ...c, isScratched: true } : c)),
		);
	};

	return (
		<div className="space-y-6">
			<div className="mx-auto w-full max-w-sm">
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-primary p-4 shadow-brutal flex items-center justify-between">
					<div>
						<p className="font-mono text-[11px] font-black uppercase tracking-wider text-primary-foreground">
							Total Scratch Wins
						</p>
						<p className="font-mono text-2xl sm:text-3xl font-black text-primary-foreground mt-1 flex items-center gap-1.5 tabular-nums">
							<span>+{totalCoinsWon}</span>
							<CoinIcon className="size-8 text-primary-foreground" />
						</p>
					</div>
					<div className="flex size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-card shadow-brutal-sm">
						<Trophy
							className="size-5 text-foreground"
							strokeWidth={2.5}
						/>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between flex-wrap gap-3 border-b-[length:var(--border-width)] border-black/15 pb-3">
				<div className="flex items-center gap-2">
					<h2 className="font-title text-base sm:text-lg font-black tracking-tight text-foreground">
						Scratch Card History
					</h2>
				</div>
			</div>

			{cards.length === 0 ?
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-8 text-center shadow-brutal">
					<div className="mx-auto flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-muted">
						<Gift className="size-6 text-muted-foreground" />
					</div>
					<h3 className="mt-3 font-title text-lg font-black">
						No Scratch Cards Found
					</h3>
					<p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
						No cards in this view yet.
					</p>
					<Button
						asChild
						size="sm"
						className="mt-4 font-mono text-xs font-bold">
						<Link href="/capture">Capture Today&apos;s Smile →</Link>
					</Button>
				</div>
			:	<div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
					{cards.map((card) => {
						const isUnscratched = !card.isScratched;

						return (
							<div
								key={card.id}
								onClick={() => handleCardClick(card)}
								className={cn(
									'group relative flex min-h-52 flex-col justify-between border-[length:var(--border-width)] border-black rounded-xl p-4 cursor-pointer transition-all duration-200 brutal-lift select-none',
									isUnscratched ?
										'bg-primary shadow-brutal-lg hover:shadow-brutal-xl'
									:	'bg-card shadow-brutal hover:shadow-brutal-md',
								)}>
								{isUnscratched && (
									<span className="absolute -top-2.5 -right-2.5 border-[length:var(--border-width)] border-black rounded-md bg-secondary px-2 py-0.5 font-mono text-[9px] font-black uppercase text-secondary-foreground shadow-brutal-xs animate-bounce">
										Tap to Scratch
									</span>
								)}

								<div className="flex items-start justify-between gap-1">
									<span
										className={cn(
											'border border-black/30 rounded-xs px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase truncate max-w-[110px]',
											isUnscratched ?
												'bg-card/90 text-foreground'
											:	'bg-muted text-muted-foreground',
										)}>
										{card.source}
									</span>
									{card.badge ?
										<span className="border border-black rounded-xs bg-accent px-1.5 py-0.5 font-mono text-[9px] font-black text-black">
											{card.badge}
										</span>
									: !isUnscratched ?
										<span className="font-mono text-[9px] font-semibold text-muted-foreground">
											{card.date}
										</span>
									:	null}
								</div>

								<div className="my-auto flex flex-col items-center justify-center py-2 text-center">
									{isUnscratched ?
										<>
											<div className="flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
												<Gift
													className="size-6 text-primary-foreground"
													strokeWidth={2.5}
												/>
											</div>
											<p className="mt-2.5 font-title text-xs font-black uppercase tracking-tight text-black">
												Mystery Reward
											</p>
											<p className="font-mono text-[9px] font-bold text-black/70 mt-0.5">
												Win bonus coins
											</p>
										</>
									:	<>
											<div className="flex items-center justify-center gap-1.5">
												<CoinIcon
													className="size-8 shrink-0"
													strokeWidth={2.5}
												/>
												<p className="font-mono text-3xl font-black text-foreground tabular-nums tracking-tight">
													{card.coins}
												</p>
											</div>

											<p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
												Coins Won
											</p>
										</>
									}
								</div>

								<div className="pt-2 text-center">
									{isUnscratched ?
										<></>
									:	<span className="inline-flex items-center gap-1 rounded-sm bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-black text-emerald-700 dark:text-emerald-400">
											<CheckCircle2
												className="size-3 shrink-0"
												strokeWidth={2.5}
											/>
											Received
										</span>
									}
								</div>
							</div>
						);
					})}
				</div>
			}

			<ScratchCardModal
				card={selectedCard}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onCardScratched={handleCardScratched}
			/>
		</div>
	);
}
