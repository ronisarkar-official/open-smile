'use client';

import * as React from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
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
	podiumRankings: LeaderboardPodiumRanking[];
	rankings: LeaderboardRankingItem[];
	currentUserId?: string;
	runOptions?: LeaderboardRunOption[];
	selectedRunId?: string;
	onRunChange?: (runId: string) => void;
	metric?: 'coins' | 'score';
	onMetricChange?: (metric: 'coins' | 'score') => void;
}

function formatRangeDate(date: string | Date) {
	const parsed = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(parsed.getTime())) return '';

	return parsed.toLocaleDateString(undefined, {
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
			podiumRankings,
			rankings,
			currentUserId,
			runOptions,
			selectedRunId,
			onRunChange,
			metric = 'coins',
			onMetricChange,
			...props
		},
		ref,
	) => {
		const fromLabel = formatRangeDate(fromDate);
		const toLabel = formatRangeDate(toDate);
		const resolvedRunId = selectedRunId ?? runOptions?.[0]?.id ?? '';
		const hasOnRunChange = Boolean(onRunChange);
		const [localRunId, setLocalRunId] = React.useState(resolvedRunId);

		React.useEffect(() => {
			if (hasOnRunChange) return;
			setLocalRunId(resolvedRunId);
		}, [hasOnRunChange, resolvedRunId]);

		const activeRunId = hasOnRunChange ? resolvedRunId : localRunId;

		return (
			<div
				ref={ref}
				className={cn('brutal-surface bg-card p-4 sm:p-6 shadow-brutal', className)}
				{...props}>
				{/* Top Controls: Metric Toggle + Timeframe Selector */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-accent px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-xs">
								<Trophy className="size-3" />
								Official Rankings
							</span>
						</div>
						<h2 className="text-2xl font-black font-title tracking-tight sm:text-3xl text-foreground">
							{title}
						</h2>
						<p className="font-mono text-xs font-semibold text-muted-foreground">
							{fromLabel} - {toLabel}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2.5">
						{/* Metric Switcher Tab */}
						{onMetricChange && (
							<div className="flex items-center border-[length:var(--border-width)] border-black rounded-lg bg-muted p-0.5 shadow-brutal-xs">
								<button
									type="button"
									onClick={() => onMetricChange('coins')}
									className={cn(
										'flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-black uppercase tracking-wider rounded-md transition-all cursor-pointer',
										metric === 'coins'
											? 'bg-primary text-primary-foreground shadow-brutal-xs'
											: 'text-muted-foreground hover:text-foreground'
									)}>
									<CoinIcon className="size-3.5" />
									<span>Coins</span>
								</button>

								<button
									type="button"
									onClick={() => onMetricChange('score')}
									className={cn(
										'flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-black uppercase tracking-wider rounded-md transition-all cursor-pointer',
										metric === 'score'
											? 'bg-secondary text-secondary-foreground shadow-brutal-xs'
											: 'text-muted-foreground hover:text-foreground'
									)}>
									<Sparkles className="size-3.5" />
									<span>Smile Score</span>
								</button>
							</div>
						)}

						{/* Period Dropdown */}
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

				{/* Podium Display (Top 3) */}
				<LeaderboardPodium
					rankings={podiumRankings}
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
