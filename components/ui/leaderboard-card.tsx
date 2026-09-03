'use client';

import * as React from 'react';
import Link from 'next/link';
import { Camera, Clock, Gift, History, Smile, Sparkles, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	LeaderboardPodium,
	type LeaderboardRanking as LeaderboardPodiumRanking,
} from '@/components/ui/leaderboard-podium';
import {
	LeaderboardRankings,
	type LeaderboardRankingItem,
} from '@/components/ui/leaderboard-rankings';
import { AnimatedNumberCountdown } from '@/components/ui/animated-number-countdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface LeaderboardRunOption {
	id: string;
	label: string;
}

interface LeaderboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	fromDate: string | Date;
	toDate: string | Date;
	resetAt?: string | Date;
	podiumRankings: LeaderboardPodiumRanking[];
	yesterdayPodium?: any[];
	rankings: LeaderboardRankingItem[];
	currentUserRanking?: LeaderboardRankingItem | null;
	currentUserId?: string;
	runOptions?: LeaderboardRunOption[];
	selectedRunId?: string;
	onRunChange?: (runId: string) => void;
	metric?: 'score';
}

function formatRangeDate(date: string | Date) {
	const parsed = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(parsed.getTime())) return '';

	return parsed.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

const TOURNAMENT_REWARDS: Record<
	string,
	{
		label: string;
		desc: string;
		resetLabel: string;
		cards: Array<{
			rank: string;
			name: string;
			range: string;
			medal: string;
			bg: string;
			border: string;
			badgeBg: string;
		}>;
	}
> = {
	daily: {
		label: 'Daily Podium Rewards',
		desc: 'Top 3 win Mystery Scratch Cards',
		resetLabel: 'Resets 12:00 AM UTC',
		cards: [
			{
				rank: '1st',
				name: 'Gold Card',
				range: '70–99',
				medal: '🥇',
				bg: 'bg-rank-1/20 dark:bg-rank-1/15',
				border: 'border-rank-1/60 dark:border-rank-1/40',
				badgeBg: 'bg-rank-1 text-black font-black',
			},
			{
				rank: '2nd',
				name: 'Silver Card',
				range: '40–69',
				medal: '🥈',
				bg: 'bg-rank-2/20 dark:bg-rank-2/15',
				border: 'border-rank-2/50 dark:border-rank-2/30',
				badgeBg: 'bg-rank-2 text-foreground font-black',
			},
			{
				rank: '3rd',
				name: 'Bronze Card',
				range: '15–39',
				medal: '🥉',
				bg: 'bg-rank-3/20 dark:bg-rank-3/15',
				border: 'border-rank-3/50 dark:border-rank-3/30',
				badgeBg: 'bg-rank-3 text-foreground font-black',
			},
		],
	},
	weekly: {
		label: 'Weekly Tournament Stakes',
		desc: 'Top 3 win Weekly Mega Scratch Cards',
		resetLabel: 'Resets Sunday Midnight UTC',
		cards: [
			{
				rank: '1st',
				name: 'Mega Gold',
				range: '250–400',
				medal: '🥇',
				bg: 'bg-rank-1/20 dark:bg-rank-1/15',
				border: 'border-rank-1/60 dark:border-rank-1/40',
				badgeBg: 'bg-rank-1 text-black font-black',
			},
			{
				rank: '2nd',
				name: 'Mega Silver',
				range: '120–200',
				medal: '🥈',
				bg: 'bg-rank-2/20 dark:bg-rank-2/15',
				border: 'border-rank-2/50 dark:border-rank-2/30',
				badgeBg: 'bg-rank-2 text-foreground font-black',
			},
			{
				rank: '3rd',
				name: 'Mega Bronze',
				range: '60–100',
				medal: '🥉',
				bg: 'bg-rank-3/20 dark:bg-rank-3/15',
				border: 'border-rank-3/50 dark:border-rank-3/30',
				badgeBg: 'bg-rank-3 text-foreground font-black',
			},
		],
	},
	monthly: {
		label: 'Monthly Legends League',
		desc: 'Top 3 win Legend Scratch Cards',
		resetLabel: 'Resets Month-End UTC',
		cards: [
			{
				rank: '1st',
				name: 'Legend Gold',
				range: '800–1,200',
				medal: '🥇',
				bg: 'bg-rank-1/20 dark:bg-rank-1/15',
				border: 'border-rank-1/60 dark:border-rank-1/40',
				badgeBg: 'bg-rank-1 text-black font-black',
			},
			{
				rank: '2nd',
				name: 'Master Silver',
				range: '400–600',
				medal: '🥈',
				bg: 'bg-rank-2/20 dark:bg-rank-2/15',
				border: 'border-rank-2/50 dark:border-rank-2/30',
				badgeBg: 'bg-rank-2 text-foreground font-black',
			},
			{
				rank: '3rd',
				name: 'Star Bronze',
				range: '200–350',
				medal: '🥉',
				bg: 'bg-rank-3/20 dark:bg-rank-3/15',
				border: 'border-rank-3/50 dark:border-rank-3/30',
				badgeBg: 'bg-rank-3 text-foreground font-black',
			},
		],
	},
};

const LeaderboardCard = React.forwardRef<HTMLDivElement, LeaderboardCardProps>(
	(
		{
			className,
			title = 'Leaderboard',
			fromDate,
			toDate,
			resetAt,
			podiumRankings,
			yesterdayPodium = [],
			rankings,
			currentUserRanking,
			currentUserId,
			runOptions,
			selectedRunId,
			onRunChange,
			...props
		},
		ref,
	) => {
		const fromLabel = formatRangeDate(fromDate);
		const toLabel = formatRangeDate(toDate);
		const resolvedRunId = selectedRunId ?? runOptions?.[0]?.id ?? 'daily';
		const hasOnRunChange = Boolean(onRunChange);
		const [localRunId, setLocalRunId] = React.useState(resolvedRunId);
		const [countdownText, setCountdownText] = React.useState<string>('');
		const [viewMode, setViewMode] = React.useState<'live' | 'history'>('live');

		React.useEffect(() => {
			if (hasOnRunChange) return;
			setLocalRunId(resolvedRunId);
		}, [hasOnRunChange, resolvedRunId]);

		const activeRunId = hasOnRunChange ? resolvedRunId : localRunId;

		React.useEffect(() => {
			if (!resetAt || activeRunId !== 'daily') {
				setCountdownText('');
				return;
			}

			function updateCountdown() {
				const target = new Date(resetAt!).getTime();
				const now = Date.now();
				const diff = target - now;

				if (diff <= 0) {
					setCountdownText('Resetting now...');
					return;
				}

				const hours = Math.floor(diff / (1000 * 60 * 60));
				const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((diff % (1000 * 60)) / 1000);

				setCountdownText(
					`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
				);
			}

			updateCountdown();
			const interval = setInterval(updateCountdown, 1000);
			return () => clearInterval(interval);
		}, [resetAt, activeRunId]);

		const isRushHour = React.useMemo(() => {
			if (!resetAt || activeRunId !== 'daily') return false;
			const diff = new Date(resetAt).getTime() - Date.now();
			return diff > 0 && diff <= 60 * 60 * 1000;
		}, [resetAt, activeRunId, countdownText]);

		const currentReward =
			TOURNAMENT_REWARDS[activeRunId] || TOURNAMENT_REWARDS.daily;

		return (
			<div
				ref={ref}
				className={cn('brutal-surface bg-card p-4 sm:p-6 shadow-brutal', className)}
				{...props}>
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-border/15 pb-5">
					<div className="space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-border rounded-md bg-accent px-2 py-0.5 font-mono text-[10px] font-black uppercase text-accent-foreground shadow-brutal-xs">
								<Trophy className="size-3" />
								Official Rankings
							</span>
							<span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-border rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] font-black uppercase text-secondary-foreground shadow-brutal-xs">
								<Sparkles className="size-3" />
								Smile Points
							</span>
							{activeRunId === 'daily' && countdownText ? (
								<span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-border rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] font-black text-primary-foreground shadow-brutal-xs">
									<Clock className="size-3" />
									Resets in {countdownText}
								</span>
							) : null}
						</div>
						<h2 className="text-2xl font-black font-title tracking-tight sm:text-3xl text-foreground">
							{title}
						</h2>
						<p className="font-mono text-xs font-semibold text-muted-foreground">
							{fromLabel} - {toLabel}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2.5">
						<div className="flex items-center border-[length:var(--border-width)] border-border rounded-lg p-0.5 bg-muted shadow-brutal-xs">
							<button
								type="button"
								onClick={() => setViewMode('live')}
								className={cn(
									'px-3 py-1.5 font-mono text-xs font-black uppercase tracking-wider transition-all rounded-md',
									viewMode === 'live'
										? 'bg-primary text-primary-foreground border-[length:var(--border-width)] border-border shadow-brutal-xs'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								Live Race
							</button>
							<button
								type="button"
								onClick={() => setViewMode('history')}
								className={cn(
									'px-3 py-1.5 font-mono text-xs font-black uppercase tracking-wider transition-all rounded-md flex items-center gap-1.5',
									viewMode === 'history'
										? 'bg-primary text-primary-foreground border-[length:var(--border-width)] border-border shadow-brutal-xs'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								<History className="size-3.5" />
								{activeRunId === 'daily' ? "Yesterday's Winners" : 'Past Champions'}
							</button>
						</div>

						{runOptions && runOptions.length > 0 ? (
							<div className="w-[140px] shrink-0">
								<Select
									value={activeRunId}
									onValueChange={(value) => {
										if (onRunChange) {
											onRunChange(value);
											return;
										}
										setLocalRunId(value);
									}}>
									<SelectTrigger
										aria-label="Select leaderboard run"
										className="h-10 font-mono text-xs font-black uppercase tracking-wider border-[length:var(--border-width)] border-border shadow-brutal-xs bg-card">
										<SelectValue placeholder="Select period" />
									</SelectTrigger>
									<SelectContent align="end">
										{runOptions.map((option) => (
											<SelectItem
												key={option.id}
												value={option.id}
												className="font-mono text-xs font-bold uppercase tracking-wider">
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						) : null}
					</div>
				</div>

				<div
					className={cn(
						'mb-6 brutal-surface p-4 sm:p-5 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4',
						isRushHour
							? 'bg-destructive/10 border-destructive/80 animate-pulse'
							: 'bg-card'
					)}
				>
							<div className="flex items-center gap-3.5 min-w-0">
								<div
									className={cn(
										'size-11 sm:size-12 rounded-lg border-[length:var(--border-width)] border-border flex items-center justify-center shadow-brutal-xs shrink-0',
										isRushHour
											? 'bg-destructive text-destructive-foreground'
											: 'bg-primary text-primary-foreground'
									)}
								>
									{isRushHour ? (
										<Zap className="size-6 animate-bounce" />
									) : (
										<Gift className="size-6" />
									)}
								</div>

								<div className="space-y-1 min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<span
											className={cn(
												'font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border-[length:var(--border-width)] border-border shadow-brutal-xs',
												isRushHour
													? 'bg-destructive text-destructive-foreground'
													: 'bg-foreground text-background'
											)}
										>
											{isRushHour ? '⚡ Rush Hour Active' : currentReward.label}
										</span>

										{isRushHour && resetAt ? (
											<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border-[length:var(--border-width)] border-border bg-card font-mono text-xs font-black shadow-brutal-xs">
												<Clock className="size-3 text-destructive animate-spin" />
												<AnimatedNumberCountdown
													endDate={resetAt}
													showLabels={false}
													numberClassName="font-mono text-xs font-black text-foreground"
													className="gap-1"
												/>
											</div>
										) : (
											<span className="font-mono text-[11px] font-bold text-muted-foreground flex items-center gap-1">
												<Clock className="size-3 text-muted-foreground" />
												{currentReward.resetLabel}
											</span>
										)}
									</div>

									<p className="text-xs sm:text-sm font-black font-title text-foreground">
										{isRushHour
											? 'Points lock at UTC midnight — podiums win instant Scratch Cards!'
											: currentReward.desc + ' — scratch to reveal your coins!'}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
								{currentReward.cards.map((card) => (
									<div
										key={card.rank}
										className={cn(
											'relative flex flex-col justify-between p-2 sm:px-3 sm:py-2.5 rounded-lg border-[length:var(--border-width)] shadow-brutal-xs brutal-lift min-w-[95px] sm:min-w-[125px]',
											card.bg,
											card.border
										)}
									>
										<div className="flex items-center justify-between gap-1">
											<span className="text-base sm:text-lg">{card.medal}</span>
											<span
												className={cn(
													'font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1 py-0.2 rounded-xs',
													card.badgeBg
												)}
											>
												{card.rank}
											</span>
										</div>
										<div className="mt-1">
											<div className="font-title font-black text-xs sm:text-sm text-foreground leading-tight truncate">
												{card.name}
											</div>
											<div className="mt-0.5 flex items-center gap-0.5 font-mono text-[11px] sm:text-xs font-black text-foreground">
												<span>{card.range}</span>
												<span className="text-[10px]">🪙</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

				{viewMode === 'history' ? (
					yesterdayPodium && yesterdayPodium.length > 0 ? (
						<div className="space-y-6">
							<LeaderboardPodium
								rankings={yesterdayPodium.map((r: any) => ({
									rank: r.rank,
									userId: r.userId,
									userName: r.userName,
									value: r.score,
									avatarUrl: r.avatarUrl,
								}))}
								unit="pts"
								className="mb-8"
							/>
							<div className="overflow-hidden rounded-lg border-[length:var(--border-width)] border-border bg-card shadow-brutal-sm">
								<div className="border-b-[length:var(--border-width)] border-border bg-muted/60 px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center justify-between">
									<span>Archived Winners Podium</span>
									<span>{yesterdayPodium[0]?.periodDate || 'Recent'}</span>
								</div>
								<div className="divide-y divide-border/60">
									{yesterdayPodium.map((winner: any) => {
										const rewardCard =
											currentReward.cards.find((c) =>
												c.rank.startsWith(String(winner.rank))
											) || currentReward.cards[winner.rank - 1];

										return (
											<div
												key={winner.rank}
												className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/40 transition-colors"
											>
												<div className="flex items-center gap-3">
													<span className="font-mono text-xs font-black text-muted-foreground w-6 text-center">
														#{winner.rank}
													</span>
													<Avatar className="size-8 shrink-0 border border-border">
														<AvatarImage
															src={winner.avatarUrl || '/icons/default-icon.webp'}
															alt={winner.userName}
														/>
														<AvatarFallback className="text-xs font-semibold">
															{winner.userName.slice(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-semibold text-foreground">
															{winner.userName}
														</div>
														<div className="font-mono text-xs text-muted-foreground">
															Winning Score: {winner.score} pts
														</div>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<span
														className={cn(
															'inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-border rounded-md px-2.5 py-1 font-mono text-xs font-black shadow-brutal-xs',
															rewardCard
																? rewardCard.badgeBg
																: 'bg-rank-1 text-black font-black'
														)}
													>
														<span className="text-sm leading-none">
															{rewardCard?.medal || '🎁'}
														</span>
														<span>{rewardCard?.name || 'Mystery Scratch Card'}</span>
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					) : (
						<div className="border-[length:var(--border-width)] border-border rounded-lg bg-card p-8 sm:p-12 text-center shadow-brutal space-y-3">
							<History className="size-10 mx-auto text-muted-foreground" />
							<h3 className="text-xl font-black font-title uppercase tracking-tight text-foreground">
								No Archived Settlements Yet
							</h3>
							<p className="font-mono text-xs text-muted-foreground max-w-md mx-auto">
								Settlements run automatically at the close of each period. Check back after the next midnight reset to see archived winners and their revealed Scratch Cards!
							</p>
						</div>
					)
				) : rankings.length === 0 ? (
					<div className="border-[length:var(--border-width)] border-border rounded-lg bg-card p-8 sm:p-12 text-center shadow-brutal space-y-4">
						<div className="size-16 mx-auto rounded-lg border-[length:var(--border-width)] border-border bg-primary/20 flex items-center justify-center shadow-brutal-xs">
							<Smile className="size-8 text-foreground" />
						</div>
						<div className="space-y-1.5">
							<h3 className="text-xl sm:text-2xl font-black font-title uppercase tracking-tight text-foreground">
								{activeRunId === 'daily'
									? 'No Smiles Recorded Yet Today!'
									: 'No Smiles Recorded This Period'}
							</h3>
							<p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
								{activeRunId === 'daily'
									? "The daily podium is completely open. Be the first to capture a smile, claim the #1 Gold spot, and win today's Gold Scratch Card reward!"
									: 'Start capturing your smiles now to secure a spot on the leaderboard!'}
							</p>
						</div>
						<div className="pt-2">
							<Link
								href="/capture"
								className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-border rounded-lg bg-primary px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-primary-foreground shadow-brutal brutal-lift"
							>
								<Camera className="size-4" />
								Capture Your Smile
							</Link>
						</div>
					</div>
				) : (
					<>
						<LeaderboardPodium
							rankings={podiumRankings}
							unit="pts"
							className="mb-8"
						/>

						<LeaderboardRankings
							rankings={rankings}
							currentUserId={currentUserId}
							currentUserRanking={currentUserRanking}
						/>
					</>
				)}
			</div>
		);
	},
);

LeaderboardCard.displayName = 'LeaderboardCard';

export { LeaderboardCard };
export type { LeaderboardCardProps, LeaderboardRunOption };
