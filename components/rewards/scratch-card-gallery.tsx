'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Gift, Trophy, CheckCircle2, RefreshCw, Tag, Sparkles } from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import {
	ScratchCardModal,
	type ScratchCardItem,
} from '@/components/rewards/scratch-card-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { emitCoinBalanceUpdate } from '@/components/ui/user-coin-balance';

interface ScratchCardTileProps {
	card: ScratchCardItem;
	index: number;
	onSelect: (card: ScratchCardItem) => void;
}

function ScratchCardTile({ card, index, onSelect }: ScratchCardTileProps) {
	const isUnscratched = !card.isScratched;
	const isVoucher = Boolean(card.voucherCode || card.voucherBrand);

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.04, duration: 0.25 }}
			onClick={() => onSelect(card)}
			className={cn(
				'group relative flex min-h-52 flex-col justify-between border-[length:var(--border-width)] border-black rounded-xl p-4 cursor-pointer transition-all duration-200 brutal-lift select-none',
				isUnscratched
					? 'bg-primary shadow-brutal-lg hover:shadow-brutal-xl'
					: 'bg-card shadow-brutal hover:shadow-brutal-md'
			)}>
			{isUnscratched && (
				<span className="absolute -top-2.5 -right-2.5 border-[length:var(--border-width)] border-black rounded-md bg-secondary px-2 py-0.5 font-mono text-[9px] font-black uppercase text-secondary-foreground shadow-brutal-xs animate-bounce">
					Tap to Scratch
				</span>
			)}

			<div className="flex items-start justify-between gap-1">
				<span
					title={card.source}
					className={cn(
						'border border-black/30 rounded-xs px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase truncate max-w-[110px]',
						isUnscratched ? 'bg-card/90 text-foreground' : 'bg-muted text-muted-foreground'
					)}>
					{isUnscratched
						? (isVoucher ? (card.voucherBrand || 'Voucher') : 'Mystery Card')
						: (card.voucherBrand ? card.voucherBrand : card.source)}
				</span>

				{card.badge ? (
					<span className="border border-black rounded-xs bg-accent px-1.5 py-0.5 font-mono text-[9px] font-black text-black">
						{card.badge}
					</span>
				) : !isUnscratched ? (
					<span className="font-mono text-[9px] font-semibold text-muted-foreground">
						{card.date}
					</span>
				) : null}
			</div>

			<div className="my-auto flex flex-col items-center justify-center py-2 text-center">
				{isUnscratched ? (
					<>
						<div className="flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
							{isVoucher ? (
								<Tag className="size-6 text-primary-foreground" strokeWidth={2.5} />
							) : (
								<Gift className="size-6 text-primary-foreground" strokeWidth={2.5} />
							)}
						</div>
						<p className="mt-2.5 font-title text-xs font-black uppercase tracking-tight text-black">
							{isVoucher ? (card.voucherTitle || 'Surprise Voucher') : 'Mystery Smile Reward'}
						</p>
						<p className="font-mono text-[9px] font-bold text-black/70 mt-0.5 flex items-center justify-center gap-1">
							<Sparkles className="size-2.5 inline" />
							<span>Scratch to reveal reward</span>
						</p>
					</>
				) : isVoucher ? (
					<>
						<div className="flex size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-accent shadow-brutal-xs">
							<Tag className="size-5 text-black" strokeWidth={2.5} />
						</div>
						<p className="mt-2 font-title text-xs font-black uppercase tracking-tight text-foreground truncate max-w-[140px]">
							{card.voucherTitle || card.title}
						</p>
						{card.voucherCode && (
							<span className="mt-1 inline-block border border-black/20 rounded-xs bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-primary truncate max-w-[130px]">
								{card.voucherCode}
							</span>
						)}
					</>
				) : (
					<>
						<div className="flex items-center justify-center gap-1.5">
							{card.coins > 0 ? (
								<>
									<CoinIcon className="size-8 shrink-0" strokeWidth={2.5} />
									<p className="font-mono text-3xl font-black text-foreground tabular-nums tracking-tight">
										{card.coins}
									</p>
								</>
							) : (
								<p className="font-mono text-xl font-black text-muted-foreground tracking-tight">
									0 COINS
								</p>
							)}
						</div>
						<p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
							{card.coins > 0 ? 'Coins Won' : 'Better Luck Next Time'}
						</p>
					</>
				)}
			</div>

			<div className="pt-2 text-center">
				{!isUnscratched && (
					<span className="inline-flex items-center gap-1 rounded-sm bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-black text-emerald-700 dark:text-emerald-400">
						<CheckCircle2 className="size-3 shrink-0" strokeWidth={2.5} />
						{isVoucher ? 'Voucher Claimed' : 'Received'}
					</span>
				)}
			</div>
		</motion.div>
	);
}

export function ScratchCardGallery() {
	const [cards, setCards] = React.useState<ScratchCardItem[]>([]);
	const [filterTab, setFilterTab] = React.useState<'all' | 'unscratched' | 'scratched'>('all');
	const [selectedCard, setSelectedCard] = React.useState<ScratchCardItem | null>(null);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(true);

	const fetchCards = React.useCallback(async () => {
		setLoading(true);
		try {
			let res = await fetch('/api/v1/rewards/scratch-cards');
			if (!res.ok) {
				res = await fetch('/api/rewards/scratch-cards');
			}
			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data.cards)) {
					setCards(data.cards);
				}
			}
		} catch {
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchCards();
	}, [fetchCards]);

	const totalCoinsWon = cards
		.filter((c) => c.isScratched)
		.reduce((acc, c) => acc + (c.coins || 0), 0);

	const unscratchedCount = cards.filter((c) => !c.isScratched).length;
	const scratchedCount = cards.filter((c) => c.isScratched).length;
	const vouchersCount = cards.filter((c) => c.voucherCode || c.voucherBrand).length;

	const filteredCards = cards.filter((c) => {
		if (filterTab === 'unscratched') return !c.isScratched;
		if (filterTab === 'scratched') return c.isScratched;
		return true;
	});

	const handleCardClick = (card: ScratchCardItem) => {
		setSelectedCard(card);
		setModalOpen(true);
	};

	const handleCardScratched = async (cardId: string, coinsWon: number) => {
		setCards((prev) =>
			prev.map((c) =>
				c.id === cardId ? { ...c, coins: coinsWon, isScratched: true } : c
			)
		);

		try {
			let res = await fetch(`/api/v1/rewards/scratch-cards/${cardId}/scratch`, {
				method: 'POST',
			});
			if (!res.ok) {
				res = await fetch(`/api/rewards/scratch-cards/${cardId}/scratch`, {
					method: 'POST',
				});
			}
			if (res.ok) {
				const data = await res.json();
				if (typeof data.balance === 'number') {
					emitCoinBalanceUpdate(data.balance);
					return;
				}
			}
		} catch {}

		emitCoinBalanceUpdate();
	};

	return (
		<div className="space-y-6">
			{/* Stats Summary Banner */}
			<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
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
						<Trophy className="size-5 text-foreground" strokeWidth={2.5} />
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-secondary p-4 shadow-brutal flex items-center justify-between">
					<div>
						<p className="font-mono text-[11px] font-black uppercase tracking-wider text-secondary-foreground">
							Waiting to Scratch
						</p>
						<p className="font-mono text-2xl sm:text-3xl font-black text-secondary-foreground mt-1 flex items-center gap-1.5 tabular-nums">
							<span>{unscratchedCount}</span>
							<span className="text-xs font-bold uppercase tracking-wider">Cards</span>
						</p>
					</div>
					<div className="flex size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-card shadow-brutal-sm">
						<Gift className="size-5 text-foreground" strokeWidth={2.5} />
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-accent p-4 shadow-brutal flex items-center justify-between">
					<div>
						<p className="font-mono text-[11px] font-black uppercase tracking-wider text-black">
							Earned Vouchers
						</p>
						<p className="font-mono text-2xl sm:text-3xl font-black text-black mt-1 flex items-center gap-1.5 tabular-nums">
							<span>{vouchersCount}</span>
							<span className="text-xs font-bold uppercase tracking-wider">Vouchers</span>
						</p>
					</div>
					<div className="flex size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-card shadow-brutal-sm">
						<Tag className="size-5 text-black" strokeWidth={2.5} />
					</div>
				</div>
			</div>

			{/* Filter Tabs & Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b-[length:var(--border-width)] border-black/15 pb-3">
				<div className="flex items-center gap-2">
					<h2 className="font-title text-base sm:text-lg font-black tracking-tight text-foreground">
						Scratch Card & Voucher Vault
					</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={fetchCards}
						disabled={loading}
						className="size-8 p-0"
						title="Refresh scratch cards">
						<RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
					</Button>
				</div>

				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => setFilterTab('all')}
						className={cn(
							'border-[length:var(--border-width)] border-black rounded-md px-3 py-1 font-mono text-xs font-bold uppercase transition-all cursor-pointer brutal-lift',
							filterTab === 'all'
								? 'bg-primary text-primary-foreground shadow-brutal-xs'
								: 'bg-card text-foreground hover:bg-muted'
						)}>
						All ({cards.length})
					</button>
					<button
						type="button"
						onClick={() => setFilterTab('unscratched')}
						className={cn(
							'border-[length:var(--border-width)] border-black rounded-md px-3 py-1 font-mono text-xs font-bold uppercase transition-all cursor-pointer brutal-lift',
							filterTab === 'unscratched'
								? 'bg-secondary text-secondary-foreground shadow-brutal-xs'
								: 'bg-card text-foreground hover:bg-muted'
						)}>
						Waiting ({unscratchedCount})
					</button>
					<button
						type="button"
						onClick={() => setFilterTab('scratched')}
						className={cn(
							'border-[length:var(--border-width)] border-black rounded-md px-3 py-1 font-mono text-xs font-bold uppercase transition-all cursor-pointer brutal-lift',
							filterTab === 'scratched'
								? 'bg-accent text-black shadow-brutal-xs'
								: 'bg-card text-foreground hover:bg-muted'
						)}>
						Scratched ({scratchedCount})
					</button>
				</div>
			</div>

			{/* Cards Grid / Empty State */}
			{loading && cards.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal">
					<RefreshCw className="size-8 animate-spin text-primary" />
					<p className="mt-3 font-mono text-xs font-bold text-muted-foreground">
						Loading your scratch cards & vouchers...
					</p>
				</div>
			) : filteredCards.length === 0 ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-8 text-center shadow-brutal">
					<div className="mx-auto flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-muted shadow-brutal-sm">
						<Gift className="size-6 text-muted-foreground" />
					</div>
					<h3 className="mt-3 font-title text-lg font-black">
						{filterTab === 'unscratched'
							? 'No Unscratched Cards Waiting'
							: filterTab === 'scratched'
							? 'No Scratched Cards History Yet'
							: 'No Scratch Cards Found'}
					</h3>
					<p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
						{filterTab === 'unscratched'
							? 'You have scratched all your cards! Capture your smile or hit daily streaks to unlock more scratch vouchers.'
							: 'Capture a smile or earn milestone rewards to get your mystery scratch cards.'}
					</p>
					<Button asChild size="sm" className="mt-4 font-mono text-xs font-bold shadow-brutal-sm brutal-lift">
						<Link href="/capture">Capture Today&apos;s Smile →</Link>
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
					{filteredCards.map((card, index) => (
						<ScratchCardTile
							key={card.id}
							card={card}
							index={index}
							onSelect={handleCardClick}
						/>
					))}
				</div>
			)}

			<ScratchCardModal
				card={selectedCard}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onCardScratched={handleCardScratched}
			/>
		</div>
	);
}
