'use client';

import * as React from 'react';
import { Clock, Gift, Sparkles, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	LeaderboardPodium,
	type LeaderboardRanking as LeaderboardPodiumRanking,
} from '@/components/ui/leaderboard-podium';
import {
	LeaderboardRankings,
	type LeaderboardRankingItem,
} from '@/components/ui/leaderboard-rankings';
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
	rankings: LeaderboardRankingItem[];
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

const LeaderboardCard = React.forwardRef<HTMLDivElement, LeaderboardCardProps>(
	(
		{
			className,
			title = 'Leaderboard',
			fromDate,
			toDate,
			resetAt,
			podiumRankings,
			rankings,
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
		const resolvedRunId = selectedRunId ?? runOptions?.[0]?.id ?? '';
		const hasOnRunChange = Boolean(onRunChange);
		const [localRunId, setLocalRunId] = React.useState(resolvedRunId);
		const [countdownText, setCountdownText] = React.useState<string>('');

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

		return (
			<div
				ref={ref}
				className={cn('brutal-surface bg-card p-4 sm:p-6 shadow-brutal', className)}
				{...props}>
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
					<div className="space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-accent px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-xs">
								<Trophy className="size-3" />
								Official Rankings
							</span>
							<span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] font-black uppercase text-secondary-foreground shadow-brutal-xs">
								<Sparkles className="size-3" />
								Smile Points
							</span>
							{activeRunId === 'daily' && countdownText ? (
								<span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-brutal-xs">
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
										className="h-10 font-mono text-xs font-black uppercase tracking-wider border-[length:var(--border-width)] border-black shadow-brutal-xs bg-card">
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

				{activeRunId === 'daily' ? (
					<div className="mb-6 border-[length:var(--border-width)] border-black rounded-xl bg-accent p-4 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-lg border-[length:var(--border-width)] border-black bg-primary flex items-center justify-center shadow-brutal-xs shrink-0">
								<Gift className="size-5 text-primary-foreground" />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded-xs">
										Daily Podium Rewards
									</span>
									<span className="font-mono text-xs font-bold text-black/70">
										Ends at 12:00 AM UTC
									</span>
								</div>
								<p className="text-sm font-black text-black mt-0.5">
									Top 3 win surprise Gold, Silver & Bronze Scratch Cards! Scratch to reveal your coins.
								</p>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-1.5 self-stretch sm:self-auto justify-end">
							<span className="inline-flex items-center gap-1 border border-black rounded-md bg-[#FFD700] px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-brutal-xs">
								🥇 1st: Gold Card
							</span>
							<span className="inline-flex items-center gap-1 border border-black rounded-md bg-[#E0E0E0] px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-brutal-xs">
								🥈 2nd: Silver Card
							</span>
							<span className="inline-flex items-center gap-1 border border-black rounded-md bg-[#CD7F32] px-2 py-0.5 font-mono text-[10px] font-black text-white shadow-brutal-xs">
								🥉 3rd: Bronze Card
							</span>
						</div>
					</div>
				) : null}

				{/* Podium Display (Top 3) */}
				<LeaderboardPodium
					rankings={podiumRankings}
					unit="pts"
					className="mb-8"
				/>

				{/* Full Rankings Table */}
				<LeaderboardRankings
					rankings={rankings}
					currentUserId={currentUserId}
					showPagination
					defaultPageSize={10}
				/>
			</div>
		);
	},
);

LeaderboardCard.displayName = 'LeaderboardCard';

export { LeaderboardCard };
export type { LeaderboardCardProps, LeaderboardRunOption };
