'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Gift, CheckCircle2, RefreshCw, Tag, Sparkles, ChevronDown, Copy, Check } from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import {
	ScratchCardModal,
	type ScratchCardItem,
} from '@/components/rewards/scratch-card-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { emitCoinBalanceUpdate, COIN_BALANCE_EVENT } from '@/components/ui/user-coin-balance';

interface ScratchCardTileProps {
	card: ScratchCardItem;
	index: number;
	onSelect: (card: ScratchCardItem) => void;
}

function ScratchCardTile({ card, index, onSelect }: ScratchCardTileProps) {
	const isUnscratched = !card.isScratched;
	const isVoucher = Boolean(card.voucherCode || card.voucherBrand);
	const [copied, setCopied] = React.useState(false);

	const handleCopyCode = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!card.voucherCode) return;
		navigator.clipboard.writeText(card.voucherCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.04, duration: 0.25 }}
			onClick={isUnscratched ? () => onSelect(card) : undefined}
			className={cn(
				'group relative flex min-h-52 flex-col justify-between border-[length:var(--border-width)] border-black rounded-xl p-4 transition-all duration-200',
				isUnscratched
					? 'cursor-pointer brutal-lift select-none bg-primary shadow-brutal-lg hover:shadow-brutal-xl'
					: 'cursor-default bg-card shadow-brutal'
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
							<button
								type="button"
								onClick={handleCopyCode}
								title="Click to copy voucher code"
								className="mt-1.5 inline-flex items-center gap-1 border border-black/20 rounded-xs bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-primary hover:bg-muted/80 transition-colors cursor-pointer max-w-[130px]">
								<span className="truncate">{card.voucherCode}</span>
								{copied ? (
									<Check className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
								) : (
									<Copy className="size-3 shrink-0 text-muted-foreground hover:text-foreground" />
								)}
							</button>
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

const PAGE_SIZE = 8;

export function ScratchCardGallery() {
	const [cards, setCards] = React.useState<ScratchCardItem[]>([]);
	const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
	const [selectedCard, setSelectedCard] = React.useState<ScratchCardItem | null>(null);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const isFetchingRef = React.useRef(false);

	const fetchCards = React.useCallback(async (silent = false) => {
		if (isFetchingRef.current) return;
		if (!silent) setLoading(true);
		try {
			isFetchingRef.current = true;
			let res = await fetch('/api/v1/rewards/scratch-cards', {
				cache: 'no-store',
				headers: { 'Cache-Control': 'no-cache' },
			});
			if (!res.ok) {
				res = await fetch('/api/rewards/scratch-cards', {
					cache: 'no-store',
					headers: { 'Cache-Control': 'no-cache' },
				});
			}
			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data.cards)) {
					setCards(data.cards);
				}
			}
		} catch {
		} finally {
			isFetchingRef.current = false;
			if (!silent) setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchCards();

		const handleAutoSync = () => {
			if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
				fetchCards(true);
			}
		};

		window.addEventListener(COIN_BALANCE_EVENT, handleAutoSync);
		window.addEventListener('visibilitychange', handleAutoSync);
		window.addEventListener('focus', handleAutoSync);

		const syncInterval = setInterval(() => {
			if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
				fetchCards(true);
			}
		}, 15000);

		const WinBroadcastChannel = typeof window !== 'undefined'
			? (window as unknown as { BroadcastChannel?: typeof BroadcastChannel }).BroadcastChannel
			: undefined;

		let channel: BroadcastChannel | null = null;
		if (WinBroadcastChannel) {
			try {
				channel = new WinBroadcastChannel('open-smile-scratch-cards');
				channel.onmessage = () => {
					fetchCards(true);
				};
			} catch {}
		}

		return () => {
			window.removeEventListener(COIN_BALANCE_EVENT, handleAutoSync);
			window.removeEventListener('visibilitychange', handleAutoSync);
			window.removeEventListener('focus', handleAutoSync);
			clearInterval(syncInterval);
			if (channel) {
				channel.close();
			}
		};
	}, [fetchCards]);

	const handleCardClick = (card: ScratchCardItem) => {
		if (card.isScratched) return;
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

	const orderedCards = React.useMemo(() => {
		const unscratched = cards.filter((c) => !c.isScratched);
		const scratched = cards.filter((c) => c.isScratched);
		return [...unscratched, ...scratched];
	}, [cards]);

	const displayedCards = React.useMemo(() => {
		return orderedCards.slice(0, visibleCount);
	}, [orderedCards, visibleCount]);

	const hasMore = orderedCards.length > visibleCount;

	const handleLoadMore = () => {
		setVisibleCount((prev) => prev + PAGE_SIZE);
	};

	return (
		<div className="space-y-4">
			<div className="border-b-[length:var(--border-width)] border-black pb-3 sm:pb-4">
				<h2 className="font-title text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-foreground leading-tight">
					Scratch Card &amp; Voucher Vault
				</h2>
			</div>

			{loading && cards.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal">
					<RefreshCw className="size-8 animate-spin text-primary" />
					<p className="mt-3 font-mono text-xs font-bold text-muted-foreground">
						Loading your scratch cards &amp; vouchers...
					</p>
				</div>
			) : displayedCards.length === 0 ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 sm:p-8 text-center shadow-brutal space-y-2">
					<div className="mx-auto flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-muted shadow-brutal-sm">
						<Gift className="size-6 text-muted-foreground" />
					</div>
					<h3 className="mt-3 font-title text-lg font-black">
						No Scratch Cards Found
					</h3>
					<p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
						Capture a daily smile or maintain your streak to earn mystery scratch cards.
					</p>
					<Button asChild size="sm" className="mt-3 font-mono text-xs font-bold shadow-brutal-sm brutal-lift">
						<Link href="/capture">Capture Today&apos;s Smile →</Link>
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
					{displayedCards.map((card, index) => (
						<ScratchCardTile
							key={card.id}
							card={card}
							index={index}
							onSelect={handleCardClick}
						/>
					))}
				</div>
			)}

			{hasMore && (
				<div className="flex justify-center pt-1 sm:pt-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleLoadMore}
						className="border-[length:var(--border-width)] border-black rounded-lg bg-card text-foreground font-title text-xs font-black uppercase tracking-wider px-5 h-9 shadow-brutal-xs hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none gap-1.5 cursor-pointer brutal-lift"
					>
						<span>Load More Cards</span>
						<ChevronDown className="size-4" strokeWidth={2.5} />
					</Button>
				</div>
			)}

			<ScratchCardModal
				card={selectedCard}
				isOpen={modalOpen}
				onClose={() => {
					setModalOpen(false);
					setSelectedCard(null);
				}}
				onCardScratched={handleCardScratched}
			/>
		</div>
	);
}
