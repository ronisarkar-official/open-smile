'use client';

import * as React from 'react';

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
				className={cn('brutal-surface bg-card p-4 sm:p-6', className)}
				{...props}>
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-1">
						<h3 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
						<p className="font-mono text-xs font-medium text-muted-foreground sm:text-sm">
							{fromLabel} - {toLabel}
						</p>
					</div>

					{runOptions && runOptions.length > 0 ?
						<div className="w-full shrink-0 sm:w-[160px]">
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
									className="h-10 font-mono text-xs font-bold uppercase tracking-wider">
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
					:	null}
				</div>

				<LeaderboardPodium
					rankings={podiumRankings}
					className="mb-6"
				/>

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
