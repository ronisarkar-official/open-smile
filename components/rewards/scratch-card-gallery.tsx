'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Gift,
  History,
  Trophy,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { ScratchCardModal, type ScratchCardItem } from '@/components/rewards/scratch-card-modal';
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
  const [filter, setFilter] = React.useState<'all' | 'unscratched' | 'history'>('all');
  const [selectedCard, setSelectedCard] = React.useState<ScratchCardItem | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const unscratchedCount = cards.filter((c) => !c.isScratched).length;
  const scratchedCount = cards.filter((c) => c.isScratched).length;
  const totalCoinsWon = cards
    .filter((c) => c.isScratched)
    .reduce((acc, c) => acc + c.coins, 0);

  const handleCardClick = (card: ScratchCardItem) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCardScratched = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isScratched: true } : c))
    );
  };

  const filteredCards = cards.filter((c) => {
    if (filter === 'unscratched') return !c.isScratched;
    if (filter === 'history') return c.isScratched;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-[length:var(--border-width)] border-black rounded-lg bg-primary p-4 shadow-brutal flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-black uppercase text-primary-foreground">
              Total Scratch Wins
            </p>
            <p className="font-mono text-3xl font-black text-primary-foreground mt-1 flex items-center gap-1.5">
              <span>+{totalCoinsWon}</span>
              <CoinIcon className="size-6 text-primary-foreground" />
            </p>
          </div>
          <div className="flex size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-card shadow-brutal-sm">
            <Trophy className="size-5 text-foreground" strokeWidth={2.5} />
          </div>
        </div>

        <div className="border-[length:var(--border-width)] border-black rounded-lg bg-secondary p-4 shadow-brutal flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-black uppercase text-secondary-foreground">
              Ready to Scratch
            </p>
            <p className="font-mono text-3xl font-black text-secondary-foreground mt-1">
              {unscratchedCount} {unscratchedCount === 1 ? 'Card' : 'Cards'}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-card shadow-brutal-sm">
            <Gift className="size-5 text-foreground" strokeWidth={2.5} />
          </div>
        </div>

        <div className="border-[length:var(--border-width)] border-black rounded-lg bg-accent p-4 shadow-brutal flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-black uppercase text-black">
              Scratched History
            </p>
            <p className="font-mono text-3xl font-black text-black mt-1">
              {scratchedCount}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-card shadow-brutal-sm">
            <History className="size-5 text-black" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 border-b-[length:var(--border-width)] border-black/15 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'border-[length:var(--border-width)] rounded-md px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all',
              filter === 'all'
                ? 'border-black bg-primary text-primary-foreground shadow-brutal-sm'
                : 'border-transparent bg-card text-muted-foreground hover:border-black'
            )}
          >
            All ({cards.length})
          </button>
          <button
            onClick={() => setFilter('unscratched')}
            className={cn(
              'border-[length:var(--border-width)] rounded-md px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5',
              filter === 'unscratched'
                ? 'border-black bg-secondary text-secondary-foreground shadow-brutal-sm'
                : 'border-transparent bg-card text-muted-foreground hover:border-black'
            )}
          >
            <span>Ready to Scratch</span>
            {unscratchedCount > 0 && (
              <span className="flex size-4 items-center justify-center border border-black rounded-xs bg-black font-mono text-[10px] text-white">
                {unscratchedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('history')}
            className={cn(
              'border-[length:var(--border-width)] rounded-md px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all',
              filter === 'history'
                ? 'border-black bg-card text-foreground shadow-brutal-sm'
                : 'border-transparent bg-card text-muted-foreground hover:border-black'
            )}
          >
            History ({scratchedCount})
          </button>
        </div>

        <Link
          href="/capture"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-accent-foreground hover:underline"
        >
          <Camera className="size-3.5" strokeWidth={2.5} />
          <span>Capture Smile for More Cards</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {filteredCards.length === 0 ? (
        <div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-8 text-center shadow-brutal">
          <div className="mx-auto flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-muted">
            <Gift className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-3 font-title text-lg font-black">No Scratch Cards Found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            {filter === 'unscratched'
              ? 'You have scratched all your reward cards! Take your daily smile check to earn another.'
              : 'No cards in this view yet.'}
          </p>
          <Button asChild size="sm" className="mt-4 font-mono text-xs font-bold">
            <Link href="/capture">Capture Today&apos;s Smile →</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {filteredCards.map((card) => {
            const isUnscratched = !card.isScratched;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={cn(
                  'group relative flex min-h-48 flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg p-4 cursor-pointer transition-all brutal-lift select-none',
                  isUnscratched
                    ? 'bg-primary shadow-brutal-lg'
                    : 'bg-card shadow-brutal'
                )}
              >
                {isUnscratched && (
                  <span className="absolute -top-2.5 -right-2.5 border-[length:var(--border-width)] border-black rounded-md bg-secondary px-2 py-0.5 font-mono text-[9px] font-black uppercase text-secondary-foreground shadow-brutal-sm animate-bounce">
                    Tap to Scratch
                  </span>
                )}

                <div className="flex items-start justify-between gap-1">
                  <span
                    className={cn(
                      'border border-black rounded-xs px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase',
                      isUnscratched ? 'bg-card text-foreground' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {card.source}
                  </span>
                  {card.badge && (
                    <span className="border border-black rounded-xs bg-accent px-1.5 py-0.2 font-mono text-[9px] font-black text-black">
                      {card.badge}
                    </span>
                  )}
                </div>

                <div className="my-auto flex flex-col items-center py-2 text-center">
                  {isUnscratched ? (
                    <>
                      <div className="flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-card shadow-brutal-sm group-hover:scale-105 transition-transform">
                        <Gift className="size-6 text-primary-foreground" strokeWidth={2.5} />
                      </div>
                      <p className="mt-2 font-mono text-xs font-black uppercase tracking-wider text-black">
                        Mystery Reward
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-secondary/30">
                        <CoinIcon className="size-6 text-secondary" />
                      </div>
                      <p className="mt-2 font-mono text-2xl font-black text-foreground flex items-center gap-1.5">
                        <span>+{card.coins}</span>
                        <CoinIcon className="size-5" />
                      </p>
                    </>
                  )}
                </div>

                <div className="border-t-[length:var(--border-width)] border-black/15 pt-2">
                  <p className="font-title text-xs font-black truncate">{card.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground font-semibold mt-0.5">
                    {card.date} • {isUnscratched ? 'Ready' : 'Claimed'}
                  </p>
                </div>
              </div>
            );
          })}
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
