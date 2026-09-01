'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	ArrowRight,
	Camera,
	Flame,
	RefreshCw,
	Smile,
	Sparkles,
	Trophy,
	UserPlus,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { Button } from '@/components/ui/button';
import { COIN_BALANCE_EVENT } from '@/components/ui/user-coin-balance';
import { USER_STREAK_EVENT } from '@/components/ui/user-streak';
import { cn } from '@/lib/utils';

export interface RecentSmile {
	id: string;
	score: number;
	coins: number;
	time: string;
	quality: string;
}

export interface DashboardStats {
	balance: number;
	streak: number;
	streakMultiplier: string;
	dailyRank: number | null;
	totalUsers: number;
	recentSmiles: RecentSmile[];
}

interface DashboardViewProps {
	firstName: string;
	initialStats: DashboardStats;
}

export function DashboardView({ firstName, initialStats }: DashboardViewProps) {
	const [stats, setStats] = React.useState<DashboardStats>(initialStats);
	const [loading, setLoading] = React.useState(false);

	const fetchLatestStats = React.useCallback(async () => {
		try {
			setLoading(true);
			let res = await fetch('/api/v1/user/dashboard-stats');
			if (!res.ok) {
				res = await fetch('/api/user/dashboard-stats');
			}
			if (res.ok) {
				const data = await res.json();
				setStats((prev) => ({
					...prev,
					balance: typeof data.balance === 'number' ? data.balance : prev.balance,
					streak: typeof data.streak === 'number' ? data.streak : prev.streak,
					streakMultiplier: data.streakMultiplier || prev.streakMultiplier,
					dailyRank: data.dailyRank !== undefined ? data.dailyRank : prev.dailyRank,
					totalUsers: data.totalUsers || prev.totalUsers,
					recentSmiles: Array.isArray(data.recentSmiles) ? data.recentSmiles : prev.recentSmiles,
				}));
			}
		} catch {
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		const handleEventUpdate = () => {
			fetchLatestStats();
		};

		window.addEventListener(COIN_BALANCE_EVENT, handleEventUpdate);
		window.addEventListener(USER_STREAK_EVENT, handleEventUpdate);

		return () => {
			window.removeEventListener(COIN_BALANCE_EVENT, handleEventUpdate);
			window.removeEventListener(USER_STREAK_EVENT, handleEventUpdate);
		};
	}, [fetchLatestStats]);

	const { balance, streak, streakMultiplier, dailyRank, totalUsers, recentSmiles } = stats;

	return (
		<main id="main-content" className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6">
			{/* Daily Check-in Hero */}
			<section
				className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-lg sm:p-8"
				aria-label="Daily Check-in Hero">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span className="inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-primary px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-primary-foreground shadow-brutal-xs">
								<Sparkles className="size-3.5" strokeWidth={2.5} />
								Daily Streak: {streak} {streak === 1 ? 'Day' : 'Days'}
							</span>
							<span className="font-mono text-xs text-muted-foreground font-semibold">
								{streak > 0 ? `${streakMultiplier} Multiplier active` : 'Grace period active'}
							</span>
						</div>

						<h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							Hi, {firstName}!
						</h1>
						<p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
							Take today&apos;s smile check to maintain your streak, earn bonus coins, and unlock brand gift vouchers in the marketplace.
						</p>
					</div>

					<div className="shrink-0 flex flex-col sm:flex-row gap-2">
						<Button
							asChild
							size="lg"
							className="h-13 w-full sm:w-auto px-6 font-title font-black text-sm uppercase tracking-wider gap-2 shadow-brutal brutal-lift">
							<Link href="/capture">
								<Camera className="size-5" strokeWidth={2.5} />
								<span>Capture Today&apos;s Smile</span>
								<ArrowRight className="size-4" strokeWidth={2.5} />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Key Stats Grid */}
			<section
				className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
				aria-label="Key Stats">
				{/* Coin Balance */}
				<article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground">
							Coin Balance
						</span>
						<div className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary shadow-brutal-xs">
							<CoinIcon className="size-5.5 text-black" />
						</div>
					</div>
					<div className="mt-3">
						<p className="font-mono text-4xl font-black tabular-nums tracking-tight text-foreground">
							{balance}
						</p>
						<p className="font-mono text-xs text-muted-foreground mt-1 font-semibold flex items-center gap-1">
							<CoinIcon className="size-3.5" />
							<span>Earned through smile checks</span>
						</p>
					</div>
				</article>

				{/* Current Streak */}
				<article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground">
							Current Streak
						</span>
						<div className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-secondary shadow-brutal-xs">
							<Flame className="size-4.5 text-black" strokeWidth={2.5} />
						</div>
					</div>
					<div className="mt-3">
						<p className="font-mono text-4xl font-black tabular-nums tracking-tight text-foreground">
							{streak} {streak === 1 ? 'Day' : 'Days'}
						</p>
						<p className="font-mono text-xs text-muted-foreground mt-1 font-semibold">
							🔥 {streakMultiplier} coin multiplier active
						</p>
					</div>
				</article>

				{/* Daily Rank */}
				<article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground">
							Daily Rank
						</span>
						<div className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-accent shadow-brutal-xs">
							<Trophy className="size-4.5 text-black" strokeWidth={2.5} />
						</div>
					</div>
					<div className="mt-3">
						<p className="font-mono text-4xl font-black tabular-nums tracking-tight text-foreground">
							{dailyRank !== null ? `#${dailyRank}` : '#--'}
						</p>
						<div className="flex items-center justify-between mt-1">
							<Link
								href="/leaderboard"
								className="inline-flex items-center gap-1 font-mono text-xs font-bold text-accent-foreground hover:underline">
								<span>{dailyRank !== null ? `Top ${dailyRank} of ${totalUsers}` : 'View Leaderboard'}</span>
								<ArrowRight className="size-3" />
							</Link>
							{loading && <RefreshCw className="size-3 animate-spin text-muted-foreground" />}
						</div>
					</div>
				</article>
			</section>

			{/* Recent Smiles & Referral Bonus Section */}
			<section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Recent Smiles */}
				<article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-base font-black font-title tracking-tight flex items-center gap-2">
							<Smile className="size-4.5 text-primary" strokeWidth={2.5} />
							Recent Smiles
						</h2>
						<Link
							href="/capture"
							className="inline-flex items-center border-[length:var(--border-width)] border-black rounded-md bg-primary/10 text-primary px-2.5 py-0.5 font-mono text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors shadow-brutal-xs">
							+ New check
						</Link>
					</div>

					{recentSmiles.length === 0 ? (
						<div className="py-8 text-center border-[length:var(--border-width)] border-dashed border-black/20 rounded-lg p-4 bg-muted/20">
							<div className="mx-auto flex size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary/30 shadow-brutal-xs">
								<Smile className="size-5 text-foreground" />
							</div>
							<p className="mt-2.5 font-title text-sm font-black uppercase text-foreground">
								No smile checks recorded yet
							</p>
							<p className="mt-1 font-mono text-xs text-muted-foreground max-w-xs mx-auto">
								Capture your first smile check to start your daily streak and earn coins!
							</p>
							<Button
								asChild
								size="sm"
								className="mt-3.5 font-mono text-xs font-bold shadow-brutal-xs brutal-lift">
								<Link href="/capture">Capture Smile Now →</Link>
							</Button>
						</div>
					) : (
						<div className="divide-y-[length:var(--border-width)] divide-black/20">
							{recentSmiles.map((item) => (
								<div key={item.id} className="py-3 flex items-center justify-between">
									<div>
										<div className="flex items-center gap-2">
											<span className="font-mono text-sm font-black text-foreground">
												Score: {item.score}/100
											</span>
											<span className="border border-black rounded-xs bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase">
												{item.quality}
											</span>
										</div>
										<p className="font-mono text-[11px] text-muted-foreground mt-0.5 font-medium">
											{item.time}
										</p>
									</div>
									<span className="border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground px-2.5 py-1 font-mono text-xs font-black tabular-nums flex items-center gap-1 shadow-brutal-xs">
										<span>+{item.coins}</span>
										<CoinIcon className="size-3.5 text-primary-foreground" />
									</span>
								</div>
							))}
						</div>
					)}
				</article>

				{/* Referral Promo */}
				<article className="border-[length:var(--border-width)] border-black rounded-xl bg-primary/20 p-5 shadow-brutal flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between">
							<span className="border-[length:var(--border-width)] border-black rounded-md bg-card px-2 py-0.5 font-mono text-[10px] font-black uppercase shadow-brutal-xs">
								Referral Bonus
							</span>
							<UserPlus className="size-5 text-black" strokeWidth={2.5} />
						</div>

						<h3 className="mt-3 text-lg font-black font-title tracking-tight">
							Invite Friends, Earn +200 Coins
						</h3>
						<p className="mt-1 text-xs text-muted-foreground font-medium leading-relaxed">
							Share your personal invite link. You get +200 coins and your friend gets +50 coins on their first smile check.
						</p>
					</div>

					<div className="mt-4 pt-3 border-t-[length:var(--border-width)] border-black/20">
						<Button
							asChild
							variant="outline"
							size="sm"
							className="w-full bg-card font-mono text-xs font-black uppercase tracking-wider border-[length:var(--border-width)] border-black rounded-lg shadow-brutal-sm brutal-lift">
							<Link href="/refer" className="gap-2">
								<span>Get Referral Link</span>
								<ArrowRight className="size-3.5" />
							</Link>
						</Button>
					</div>
				</article>
			</section>
		</main>
	);
}
