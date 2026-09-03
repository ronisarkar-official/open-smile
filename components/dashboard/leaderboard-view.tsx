'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeaderboardCard } from '@/components/ui/leaderboard-card';
import type { LeaderboardRanking as LeaderboardPodiumRanking } from '@/components/ui/leaderboard-podium';
import type { LeaderboardRankingItem } from '@/components/ui/leaderboard-rankings';
import { useSession } from '@/lib/auth-client';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabaseClient } from '@/lib/supabase-client';

interface PeriodData {
	title: string;
	fromDate: string;
	toDate: string;
	resetAt?: string;
	podium: LeaderboardPodiumRanking[];
	rankings: LeaderboardRankingItem[];
	currentUserRanking?: LeaderboardRankingItem | null;
	yesterdayPodium?: any[];
}

const runOptions = [
	{ id: 'daily', label: 'Daily' },
	{ id: 'weekly', label: 'Weekly' },
	{ id: 'monthly', label: 'Monthly' },
];

function ShimmerLine({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-md bg-muted/60',
				className
			)}>
			<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
		</div>
	);
}

function LeaderboardSkeleton() {
	return (
		<div className="brutal-surface bg-card p-4 sm:p-6 shadow-brutal">
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<ShimmerLine className="h-5 w-28" />
						<ShimmerLine className="h-5 w-24" />
					</div>
					<ShimmerLine className="h-8 w-56 sm:w-72" />
					<ShimmerLine className="h-3.5 w-40" />
				</div>
				<ShimmerLine className="h-10 w-[140px]" />
			</div>

			<div className="mb-8 flex w-full items-end justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-10">
				<div className="flex flex-col items-center gap-2">
					<ShimmerLine className="size-12 sm:size-16 rounded-full" />
					<ShimmerLine className="h-4 w-16" />
					<ShimmerLine className="h-24 sm:h-32 w-20 sm:w-28 rounded-lg" />
				</div>

				<div className="flex flex-col items-center gap-2">
					<ShimmerLine className="size-14 sm:size-20 rounded-full" />
					<ShimmerLine className="h-4 w-20" />
					<ShimmerLine className="h-32 sm:h-44 w-24 sm:w-32 rounded-lg" />
				</div>

				<div className="flex flex-col items-center gap-2">
					<ShimmerLine className="size-10 sm:size-14 rounded-full" />
					<ShimmerLine className="h-4 w-14" />
					<ShimmerLine className="h-20 sm:h-24 w-18 sm:w-24 rounded-lg" />
				</div>
			</div>

			<div className="space-y-2.5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-3 rounded-lg border border-black/10 p-3"
					>
						<ShimmerLine className="size-5 w-8 shrink-0" />
						<ShimmerLine className="size-9 rounded-full shrink-0" />
						<div className="flex flex-1 flex-col gap-1.5">
							<ShimmerLine className="h-4 w-28" />
							<ShimmerLine className="h-3 w-20" />
						</div>
						<ShimmerLine className="h-5 w-12 shrink-0" />
					</div>
				))}
			</div>
		</div>
	);
}

export function LeaderboardView() {
	const { settings } = useSystemSettings();
	const { data: session } = useSession();
	const [selectedRunId, setSelectedRunId] = React.useState('daily');
	const [liveData, setLiveData] = React.useState<Record<string, PeriodData>>({});
	const [loading, setLoading] = React.useState(true);
	const cacheRef = React.useRef<Record<string, PeriodData>>({});

	React.useEffect(() => {
		if (settings.maintenance_mode || settings.leaderboard_enabled === false) {
			setLoading(false);
			return;
		}
		let cancelled = false;

		async function fetchLeaderboard(period: string, force = false) {
			if (!force && cacheRef.current[period]) {
				setLoading(false);
				return;
			}

			setLoading(true);
			try {
				let res = await fetch(`/api/v1/leaderboard?period=${period}&metric=score`);
				if (!res.ok) {
					res = await fetch(`/api/leaderboard?period=${period}&metric=score`);
				}
				if (res.ok && !cancelled) {
					const json = await res.json();
					const periodData: PeriodData = {
						title: json.title,
						fromDate: json.fromDate,
						toDate: json.toDate,
						resetAt: json.resetAt,
						podium: json.podium || [],
						yesterdayPodium: json.yesterdayPodium || [],
						rankings: json.rankings || [],
						currentUserRanking: json.currentUserRanking || null,
					};
					cacheRef.current[period] = periodData;
					setLiveData((prev) => ({
						...prev,
						[period]: periodData,
					}));
				}
			} catch {
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchLeaderboard(selectedRunId);

		// Realtime live subscription to new smile captures
		let channel: any = null;
		if (supabaseClient) {
			try {
				channel = supabaseClient
					.channel(`leaderboard-realtime-${selectedRunId}`)
					.on(
						'postgres_changes',
						{
							event: 'INSERT',
							schema: 'public',
							table: 'smile_captures',
						},
						() => {
							if (!cancelled) {
								fetchLeaderboard(selectedRunId, true);
							}
						}
					)
					.subscribe();
			} catch {}
		}

		return () => {
			cancelled = true;
			if (channel && supabaseClient) {
				supabaseClient.removeChannel(channel);
			}
		};
	}, [selectedRunId, settings.maintenance_mode, settings.leaderboard_enabled]);

	const currentData = liveData[selectedRunId];

	if (settings.maintenance_mode || settings.leaderboard_enabled === false) {
		return (
			<div className="mx-auto max-w-xl text-center py-16 px-6 border-[length:var(--border-width)] border-black rounded-2xl bg-card shadow-brutal space-y-4">
				<div className="size-16 mx-auto rounded-2xl border-[length:var(--border-width)] border-black bg-muted flex items-center justify-center shadow-brutal-xs">
					<Trophy className="size-8 text-muted-foreground" />
				</div>
				<h2 className="text-2xl font-black font-title tracking-tight">Leaderboard Currently Paused</h2>
				<p className="font-mono text-xs text-muted-foreground leading-relaxed">
					{settings.maintenance_mode
						? "Platform maintenance is currently active. Live leaderboard rankings are temporarily paused."
						: "Rankings and podium calculations are temporarily paused by platform administrators. All past smile captures and streaks are preserved!"}
				</p>
			</div>
		);
	}

	return (
		<AnimatePresence mode="wait">
			{loading && !currentData ? (
				<motion.div
					key="skeleton"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.25 }}
				>
					<LeaderboardSkeleton />
				</motion.div>
			) : currentData ? (
				<motion.div
					key={`content-${selectedRunId}`}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
				>
					<LeaderboardCard
						title={currentData.title}
						fromDate={currentData.fromDate}
						toDate={currentData.toDate}
						resetAt={currentData.resetAt}
						currentUserId={session?.user?.id}
						podiumRankings={currentData.podium}
						yesterdayPodium={currentData.yesterdayPodium}
						rankings={currentData.rankings}
						currentUserRanking={currentData.currentUserRanking}
						runOptions={runOptions}
						selectedRunId={selectedRunId}
						onRunChange={setSelectedRunId}
					/>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
