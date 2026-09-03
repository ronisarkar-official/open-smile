'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	ArrowRight,
	Calendar,
	Check,
	Crown,
	Flame,
	Lock,
	Share2,
	Sparkles,
	Trophy,
	Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoinIcon } from '@/components/ui/coin-icon';
import { USER_STREAK_EVENT } from '@/components/ui/user-streak';
import type { UserStreakFullDetails, StreakDayItem } from '@/backend/db/collections';
import { cn } from '@/lib/utils';

interface StreakViewProps {
	initialData: UserStreakFullDetails;
}

const MILESTONES = [
	{
		days: 3,
		name: '3-Day Spark',
		reward: '1.2x Coins',
		description: 'Ignite your daily smiling habit',
		icon: Flame,
		color: 'bg-warning text-warning-foreground',
	},
	{
		days: 7,
		name: '7-Day Warrior',
		reward: '1.5x Coins + Society Unlock',
		description: 'One full unbroken week of smiles',
		icon: Zap,
		color: 'bg-primary text-primary-foreground',
	},
	{
		days: 14,
		name: '14-Day Habit Master',
		reward: '1.5x Coins + 100 Bonus Coins',
		description: 'Two weeks of consistent positive habit',
		icon: Trophy,
		color: 'bg-accent text-accent-foreground',
	},
	{
		days: 30,
		name: '30-Day Monthly Titan',
		reward: '1.8x Coins + VIP Marketplace',
		description: 'Conquered a full month of daily smiling',
		icon: Crown,
		color: 'bg-secondary text-secondary-foreground',
	},
	{
		days: 60,
		name: '60-Day Grandmaster',
		reward: '2.0x Max Multiplier Active',
		description: 'Legendary smile mastery achieved',
		icon: Sparkles,
		color: 'bg-success text-success-foreground',
	},
];

export function StreakView({ initialData }: StreakViewProps) {
	const [data, setData] = React.useState<UserStreakFullDetails>(initialData);
	const [copied, setCopied] = React.useState(false);
	const [timeLeft, setTimeLeft] = React.useState<string>('--:--:--');
	const isFetchingRef = React.useRef(false);

	const streak = data.streakCount;
	const isTodayCompleted = data.isTodayCompleted;
	const multiplierLabel = data.multiplierLabel;

	const fetchLatest = React.useCallback(async () => {
		if (isFetchingRef.current) return;
		try {
			isFetchingRef.current = true;
			const res = await fetch('/api/user/streak', {
				cache: 'no-store',
				headers: { 'Cache-Control': 'no-cache' },
			});
			if (res.ok) {
				const json = await res.json();
				setData(json);
			}
		} catch {
		} finally {
			isFetchingRef.current = false;
		}
	}, []);

	React.useEffect(() => {
		if (initialData) {
			setData(initialData);
		}
	}, [initialData]);

	React.useEffect(() => {
		const handleSync = () => {
			if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
				fetchLatest();
			}
		};

		window.addEventListener(USER_STREAK_EVENT, handleSync);
		window.addEventListener('visibilitychange', handleSync);
		window.addEventListener('focus', handleSync);

		const syncInterval = setInterval(() => {
			if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
				fetchLatest();
			}
		}, 30000);

		const WinBroadcastChannel = typeof window !== 'undefined'
			? (window as unknown as { BroadcastChannel?: typeof BroadcastChannel }).BroadcastChannel
			: undefined;

		let channel: BroadcastChannel | null = null;
		if (WinBroadcastChannel) {
			try {
				channel = new WinBroadcastChannel('open-smile-streak');
				channel.onmessage = () => {
					fetchLatest();
				};
			} catch {
			}
		}

		return () => {
			window.removeEventListener(USER_STREAK_EVENT, handleSync);
			window.removeEventListener('visibilitychange', handleSync);
			window.removeEventListener('focus', handleSync);
			clearInterval(syncInterval);
			if (channel) {
				channel.close();
			}
		};
	}, [fetchLatest]);

	React.useEffect(() => {
		let dayRolledOver = false;

		function updateCountdown() {
			const now = new Date();
			const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
			const istNow = new Date(now.getTime() + istOffsetMs);
			const nextMidnightUtc = Date.UTC(
				istNow.getUTCFullYear(),
				istNow.getUTCMonth(),
				istNow.getUTCDate() + 1,
				0,
				0,
				0,
				0
			);
			const nextMidnight = new Date(nextMidnightUtc - istOffsetMs);
			const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());

			const hours = Math.floor(diffMs / (1000 * 60 * 60));
			const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

			const pad = (n: number) => n.toString().padStart(2, '0');
			setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

			if (diffMs <= 1000 && !dayRolledOver) {
				dayRolledOver = true;
				fetchLatest();
				setTimeout(() => {
					dayRolledOver = false;
				}, 3000);
			}
		}

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, [fetchLatest]);

	const nextMilestone = MILESTONES.find((m) => m.days > streak) || MILESTONES[MILESTONES.length - 1];
	const prevMilestoneDays = MILESTONES.filter((m) => m.days <= streak).pop()?.days || 0;
	const milestoneProgress = Math.min(
		100,
		Math.max(0, Math.round(((streak - prevMilestoneDays) / Math.max(1, nextMilestone.days - prevMilestoneDays)) * 100))
	);

	const handleShare = async () => {
		const text = `I'm on a ${streak}-day smile streak on Open Smile with a ${multiplierLabel} coin multiplier! 🔥 Can you beat my streak?`;
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'My Open Smile Streak',
					text,
					url: window.location.origin,
				});
				return;
			} catch {
			}
		}

		try {
			await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		} catch {
		}
	};

	const now = new Date();
	const currentMonthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	const daysInMonth = data.stats.totalDaysInMonth;
	const firstDayOfMonthIndex = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).getUTCDay();
	const startPadding = (firstDayOfMonthIndex + 6) % 7;

	const captureDateMap = new Map<string, { count: number; maxScore: number; totalCoins: number }>();
	for (const mc of data.monthlyCaptures) {
		captureDateMap.set(mc.date, mc);
	}

	return (
		<main id="main-content" className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 space-y-6 sm:space-y-8">
			{/* Hero Streak Banner */}
			<section
				className="relative overflow-hidden border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 sm:p-10 shadow-brutal-lg reveal-in"
				aria-label="Streak Hero Banner">
				<div className="absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 pointer-events-none blur-2xl" />
				<div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-warning/10 pointer-events-none blur-2xl" />

				<div className="relative flex flex-col items-center text-center gap-6">
					<span
						className={cn(
							'inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md px-3 py-1 font-mono text-xs font-black uppercase tracking-wider shadow-brutal-xs',
							isTodayCompleted ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'
						)}>
						{isTodayCompleted ? (
							<>
								<Check className="size-4" strokeWidth={3} />
								Streak Active Today
							</>
						) : (
							<>
								<Flame className="size-4 text-white fill-white animate-pulse" />
								Daily Smile Pending
							</>
						)}
					</span>

					{/* Giant Flame Icon with Neubrutalist Aura */}
					<div className="relative flex size-28 sm:size-36 items-center justify-center">
						<div
							className={cn(
								'absolute inset-0 border-[length:var(--border-width)] border-black rounded-2xl shadow-brutal transition-colors',
								isTodayCompleted
									? 'bg-linear-to-tr from-amber-500 via-orange-500 to-primary'
									: 'bg-linear-to-tr from-destructive via-primary to-warning animate-pulse'
							)}
						/>
						<Flame
							className="relative size-16 sm:size-20 text-white fill-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
							strokeWidth={2}
						/>
						<div className="absolute -bottom-3 z-10 border-[length:var(--border-width)] border-black rounded-md bg-card px-3 py-0.5 shadow-brutal-xs">
							<span className="font-mono text-xs font-black uppercase tracking-wider text-card-foreground">
								{multiplierLabel} Boost
							</span>
						</div>
					</div>

					{/* Counter & Headline */}
					<div className="space-y-2">
						<div className="flex items-baseline justify-center gap-2">
							<h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight text-foreground tabular-nums">
								{streak}
							</h1>
							<span className="font-title text-2xl sm:text-4xl font-black uppercase text-foreground">
								{streak === 1 ? 'Day Streak' : 'Days Streak'}
							</span>
						</div>

						<p className="mx-auto max-w-lg font-sans text-sm sm:text-base text-muted-foreground font-medium text-balance">
							{isTodayCompleted
								? "Incredible work! You've secured today's smile streak. Return tomorrow to push the streak higher!"
								: `Smile before midnight to protect your ${streak}-day run and unlock higher coin rewards.`}
						</p>
					</div>

					{/* Urgent countdown indicator if not completed */}
					{!isTodayCompleted && (
						<div className="flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-warning/20 px-4 py-1.5 shadow-brutal-xs">
							<span className="font-mono text-xs font-bold uppercase text-foreground">Resets In:</span>
							<span className="font-mono text-sm font-black text-foreground tabular-nums">{timeLeft}</span>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto pt-2">
						{!isTodayCompleted && (
							<Button
								asChild
								size="lg"
								className="h-12 border-[length:var(--border-width)] border-black rounded-lg bg-primary px-8 font-title text-base font-black uppercase text-primary-foreground shadow-brutal brutal-lift hover:bg-primary/90">
								<Link href="/capture">
									Smile Now (+Coins)
									<ArrowRight className="size-5 ml-1" strokeWidth={2.5} />
								</Link>
							</Button>
						)}

						<Button
							type="button"
							variant="outline"
							onClick={handleShare}
							size="lg"
							className="h-12 border-[length:var(--border-width)] border-black rounded-lg bg-card text-card-foreground px-6 font-title text-sm font-bold uppercase shadow-brutal brutal-lift hover:bg-muted">
							<Share2 className="size-4 mr-2" />
							{copied ? 'Copied Streak Link!' : 'Share Streak'}
						</Button>
					</div>
				</div>
			</section>

			{/* Weekly 7-Day Streak Strip (Duolingo Style) */}
			<section
				className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-3.5 sm:p-6 md:p-7 shadow-brutal-md reveal-in reveal-delay-1"
				aria-label="Weekly Streak Tracker">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2 pb-4 sm:pb-5 border-b-[length:var(--border-width)] border-black">
					<div>
						<h2 className="font-title text-lg sm:text-2xl font-black uppercase tracking-tight text-foreground leading-tight">
							This Week&apos;s Track
						</h2>
						<p className="font-sans text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
							Complete each day to build momentum and maintain your multiplier
						</p>
					</div>

					<span className="inline-flex self-start sm:self-auto shrink-0 items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-muted px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[11px] sm:text-xs font-bold uppercase shadow-brutal-xs">
						<Calendar className="size-3.5" />
						Current Week
					</span>
				</div>

				<div className="pt-4 sm:pt-6 overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
					<div className="grid grid-cols-7 gap-1 sm:gap-2.5 md:gap-3 min-w-[290px] sm:min-w-0">
						{data.weekDays.map((day: StreakDayItem) => {
							const isDone = day.completed;
							const isToday = day.isToday;
							const isUpcoming = day.isFuture;

							return (
								<div
									key={day.date}
									aria-label={`${day.dayLabel}, ${day.dayNumber} - ${isDone ? 'Completed' : isToday ? 'Today, Pending' : isUpcoming ? 'Locked' : 'Missed'}`}
									className={cn(
										'flex flex-col items-center justify-between py-2 px-1 sm:p-2.5 md:p-3 border-[length:var(--border-width)] border-black rounded-md sm:rounded-lg transition-transform text-center select-none',
										isDone && 'bg-warning/15 shadow-brutal-xs',
										isToday && !isDone && 'bg-destructive/10 border-primary ring-2 ring-primary/40 shadow-brutal-xs',
										!isDone && !isToday && !isUpcoming && 'bg-muted/40',
										isUpcoming && 'bg-muted/20 opacity-70'
									)}>
									<span className="font-title text-[10px] sm:text-xs md:text-sm font-black uppercase text-foreground truncate w-full tracking-tight">
										{day.dayLabel}
									</span>

									<div className="my-1.5 sm:my-2.5 md:my-3">
										{isDone ? (
											<div className="flex size-7 sm:size-10 md:size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-md sm:rounded-lg bg-linear-to-tr from-amber-500 to-primary text-white shadow-brutal-xs">
												<Flame className="size-3.5 sm:size-5 md:size-6 fill-white" />
											</div>
										) : isToday ? (
											<div className="flex size-7 sm:size-10 md:size-11 items-center justify-center border-[length:var(--border-width)] border-dashed border-primary rounded-md sm:rounded-lg bg-card animate-pulse">
												<Flame className="size-3.5 sm:size-5 md:size-6 text-primary" />
											</div>
										) : isUpcoming ? (
											<div className="flex size-7 sm:size-10 md:size-11 items-center justify-center border-[length:var(--border-width)] border-dotted border-muted-foreground/50 rounded-md sm:rounded-lg bg-card">
												<Lock className="size-3 sm:size-4 text-muted-foreground" />
											</div>
										) : (
											<div className="flex size-7 sm:size-10 md:size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-md sm:rounded-lg bg-muted/60">
												<div className="size-1.5 sm:size-2 rounded-full bg-muted-foreground" />
											</div>
										)}
									</div>

									<div className="flex flex-col items-center justify-center min-h-[22px] sm:min-h-[28px]">
										<span className="font-mono text-[10px] sm:text-xs font-bold text-muted-foreground tabular-nums leading-none">
											{day.dayNumber}
										</span>
										{isToday ? (
											<span className="font-mono text-[8px] sm:text-[10px] font-black uppercase text-primary leading-none mt-0.5 tracking-tighter sm:tracking-normal">
												Today
											</span>
										) : (
											<span className="h-[8px] sm:h-[10px] select-none opacity-0 leading-none mt-0.5" aria-hidden="true">
												·
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Streak Multiplier & Milestone Roadmap */}
			<section
				className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-7 shadow-brutal-md reveal-in reveal-delay-2"
				aria-label="Milestone Roadmap">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b-[length:var(--border-width)] border-black">
					<div>
						<div className="flex items-center gap-2">
							<h2 className="font-title text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
								Streak Milestones
							</h2>
							<span className="border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-black text-primary-foreground shadow-brutal-xs">
								{multiplierLabel} Active
							</span>
						</div>
						<p className="font-sans text-xs sm:text-sm text-muted-foreground font-medium">
							Unlock higher multiplier boosts and rewards as your streak grows
						</p>
					</div>

					<div className="text-left sm:text-right">
						<span className="font-mono text-xs font-semibold text-muted-foreground">Next Milestone:</span>
						<p className="font-title text-sm sm:text-base font-black text-foreground">
							{nextMilestone.name} ({nextMilestone.days} Days)
						</p>
					</div>
				</div>

				{/* Progress bar towards next milestone */}
				<div className="pt-6 pb-2 space-y-2">
					<div className="flex items-center justify-between font-mono text-xs font-bold text-foreground">
						<span>Progress to {nextMilestone.name}</span>
						<span className="tabular-nums">
							{streak} / {nextMilestone.days} Days ({milestoneProgress}%)
						</span>
					</div>
					<div className="h-4 w-full border-[length:var(--border-width)] border-black rounded-md bg-muted p-0.5 shadow-brutal-xs">
						<div
							className="h-full rounded-xs bg-linear-to-r from-amber-400 via-orange-500 to-primary transition-all duration-500 border-r-[length:var(--border-width)] border-black"
							style={{ width: `${Math.max(2, milestoneProgress)}%` }}
						/>
					</div>
				</div>

				{/* Milestone Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-5">
					{MILESTONES.map((m) => {
						const isUnlocked = streak >= m.days;
						const Icon = m.icon;

						return (
							<div
								key={m.days}
								className={cn(
									'relative p-4 border-[length:var(--border-width)] border-black rounded-lg flex flex-col justify-between gap-3 transition-all',
									isUnlocked ? 'bg-card shadow-brutal-xs' : 'bg-muted/40 opacity-75'
								)}>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												'flex size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-md shadow-brutal-xs',
												isUnlocked ? m.color : 'bg-muted text-muted-foreground'
											)}>
											<Icon className="size-5" />
										</div>
										<div>
											<span className="font-mono text-xs font-bold uppercase text-muted-foreground">
												{m.days} Days
											</span>
											<h3 className="font-title text-base font-black text-foreground">{m.name}</h3>
										</div>
									</div>

									{isUnlocked ? (
										<span className="flex size-6 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-success text-success-foreground shadow-brutal-xs">
											<Check className="size-3.5" strokeWidth={3} />
										</span>
									) : (
										<span className="flex size-6 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-muted text-muted-foreground">
											<Lock className="size-3" />
										</span>
									)}
								</div>

								<div className="border-t-[length:var(--border-width)] border-border/20 pt-2">
									<p className="font-mono text-xs font-bold text-primary">{m.reward}</p>
									<p className="font-sans text-xs text-muted-foreground">{m.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* Duolingo Streak Society VIP Club */}
			<section
				className={cn(
					'border-[length:var(--border-width)] border-black rounded-xl p-6 sm:p-8 shadow-brutal-lg transition-all reveal-in reveal-delay-3',
					data.streakSociety.isMember
						? 'bg-warning/20 border-warning-foreground/40 text-foreground'
						: 'bg-card'
				)}
				aria-label="Streak Society">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span
								className={cn(
									'inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md px-2.5 py-0.5 font-mono text-xs font-black uppercase shadow-brutal-xs',
									data.streakSociety.isMember ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
								)}>
								<Crown className="size-3.5" />
								{data.streakSociety.isMember ? 'VIP Member' : 'Locked Tier'}
							</span>

							<span className="font-mono text-xs font-bold text-muted-foreground">
								Requires 7-Day Streak
							</span>
						</div>

						<h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground">
							The Streak Society
						</h2>

						<p className="font-sans text-sm text-foreground/80 max-w-xl font-medium">
							{data.streakSociety.isMember
								? "You have entered the exclusive Open Smile Streak Society! As a dedicated member, your daily consistency unlocks premium platform perks."
								: `Reach a 7-day streak to unlock membership into the exclusive Streak Society. Only ${data.streakSociety.daysLeft} more ${data.streakSociety.daysLeft === 1 ? 'day' : 'days'} to go!`}
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<div className="border-[length:var(--border-width)] border-black rounded-lg bg-card p-4 shadow-brutal-xs space-y-1">
							<div className="flex items-center gap-2 font-mono text-xs font-bold text-muted-foreground uppercase">
								<Sparkles className="size-3.5 text-warning" />
								Member Perks
							</div>
							<ul className="font-sans text-xs space-y-1 text-foreground font-semibold">
								<li>• Exclusive VIP Flame Flair</li>
								<li>• Highest Multiplier Bracket</li>
								<li>• Priority Voucher Drops</li>
							</ul>
						</div>

						{!isTodayCompleted && (
							<Button
								asChild
								className="border-[length:var(--border-width)] border-black rounded-lg bg-foreground text-background hover:bg-foreground/90 font-title font-black uppercase shadow-brutal brutal-lift">
								<Link href="/capture">Extend Streak</Link>
							</Button>
						)}
					</div>
				</div>
			</section>

			{/* Monthly Activity Heatmap Calendar */}
			<section
				className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-7 shadow-brutal-md"
				aria-label="Monthly Activity Calendar">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b-[length:var(--border-width)] border-black">
					<div>
						<h2 className="font-title text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
							Monthly Calendar
						</h2>
						<p className="font-sans text-xs sm:text-sm text-muted-foreground font-medium">
							Track every day you smiled in {currentMonthName}
						</p>
					</div>

					{/* Metrics Bar */}
					<div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs">
						<div className="border-[length:var(--border-width)] border-black rounded-md bg-muted px-2.5 py-1 shadow-brutal-xs">
							<span className="text-muted-foreground">Active Days: </span>
							<strong className="font-black text-foreground tabular-nums">
								{data.stats.activeDaysThisMonth} / {daysInMonth}
							</strong>
						</div>
						<div className="border-[length:var(--border-width)] border-black rounded-md bg-muted px-2.5 py-1 shadow-brutal-xs">
							<span className="text-muted-foreground">Longest: </span>
							<strong className="font-black text-foreground tabular-nums">
								{data.stats.longestStreak}d
							</strong>
						</div>
						<div className="border-[length:var(--border-width)] border-black rounded-md bg-muted px-2.5 py-1 shadow-brutal-xs">
							<span className="text-muted-foreground">Total Smiles: </span>
							<strong className="font-black text-foreground tabular-nums">
								{data.stats.totalSmiles}
							</strong>
						</div>
					</div>
				</div>

				{/* Calendar Grid */}
				<div className="pt-6">
					<div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center font-mono text-xs font-black uppercase text-muted-foreground">
						<span>Mon</span>
						<span>Tue</span>
						<span>Wed</span>
						<span>Thu</span>
						<span>Fri</span>
						<span>Sat</span>
						<span>Sun</span>
					</div>

					<div className="grid grid-cols-7 gap-1 sm:gap-2">
						{Array.from({ length: startPadding }).map((_, idx) => (
							<div key={`pad-${idx}`} className="h-10 sm:h-14 border border-dashed border-border/30 rounded-md bg-muted/10" />
						))}

						{Array.from({ length: daysInMonth }).map((_, idx) => {
							const dayNum = idx + 1;
							const year = now.getUTCFullYear();
							const month = now.getUTCMonth();
							const dayDate = new Date(Date.UTC(year, month, dayNum));
							const dateStr = dayDate.toISOString().slice(0, 10);
							const todayStr = now.toISOString().slice(0, 10);
							const isToday = dateStr === todayStr;
							const isPast = dateStr < todayStr;
							const capture = captureDateMap.get(dateStr);
							const hasCaptured = Boolean(capture && capture.count > 0);

							return (
								<div
									key={dateStr}
									className={cn(
										'relative h-11 sm:h-16 p-1 sm:p-2 border-[length:var(--border-width)] border-black rounded-md flex flex-col justify-between transition-all',
										hasCaptured && 'bg-warning/20 shadow-brutal-xs',
										isToday && !hasCaptured && 'bg-destructive/10 border-primary ring-2 ring-primary/40',
										!hasCaptured && !isToday && isPast && 'bg-muted/30',
										!hasCaptured && !isToday && !isPast && 'bg-card opacity-60'
									)}>
									<div className="flex items-center justify-between">
										<span
											className={cn(
												'font-mono text-[10px] sm:text-xs font-bold tabular-nums',
												isToday ? 'text-primary font-black' : 'text-foreground'
											)}>
											{dayNum}
										</span>

										{hasCaptured && (
											<Flame className="size-3.5 sm:size-4 text-warning fill-warning" />
										)}
									</div>

									{hasCaptured ? (
										<div className="flex items-center justify-between font-mono text-[9px] sm:text-[11px] font-bold text-muted-foreground">
											<span className="text-foreground font-black">{capture?.maxScore}%</span>
											<span className="hidden sm:inline text-primary font-bold">+{capture?.totalCoins}c</span>
										</div>
									) : isToday ? (
										<span className="font-mono text-[9px] sm:text-[10px] font-black uppercase text-primary leading-tight">
											Today
										</span>
									) : null}
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Recent Smile Captures History */}
			{data.recentSmiles.length > 0 && (
				<section
					className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-7 shadow-brutal-md"
					aria-label="Recent Smile Captures">
					<div className="flex items-center justify-between pb-4 border-b-[length:var(--border-width)] border-black">
						<div>
							<h2 className="font-title text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
								Recent Smile History
							</h2>
							<p className="font-sans text-xs sm:text-sm text-muted-foreground font-medium">
								Latest scored captures recorded on your profile
							</p>
						</div>

						<Button asChild variant="outline" size="sm" className="border-[length:var(--border-width)] border-black rounded-md shadow-brutal-xs brutal-lift">
							<Link href="/capture">New Smile</Link>
						</Button>
					</div>

					<div className="divide-y-[length:var(--border-width)] divide-border/20 pt-2">
						{data.recentSmiles.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between py-3 px-1 hover:bg-muted/40 transition-colors rounded-md">
								<div className="flex items-center gap-3">
									<div className="flex size-9 sm:size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-primary/10 text-primary shadow-brutal-xs">
										<Flame className="size-5 text-primary fill-primary" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-title text-sm sm:text-base font-black text-foreground">
												{item.score}% Score
											</span>
											<span className="border-[length:var(--border-width)] border-black rounded-sm bg-muted px-1.5 py-0.2 text-[10px] font-mono font-bold">
												{item.quality}
											</span>
										</div>
										<span className="font-mono text-xs text-muted-foreground">{item.time}</span>
									</div>
								</div>

								<div className="flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-warning/20 px-3 py-1 shadow-brutal-xs">
									<CoinIcon className="size-4" />
									<span className="font-mono text-xs sm:text-sm font-black text-foreground tabular-nums">
										+{item.coins}
									</span>
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</main>
	);
}
