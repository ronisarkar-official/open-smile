'use client';

import * as React from 'react';
import { LeaderboardCard } from '@/components/ui/leaderboard-card';
import type { LeaderboardRanking as LeaderboardPodiumRanking } from '@/components/ui/leaderboard-podium';
import type { LeaderboardRankingItem } from '@/components/ui/leaderboard-rankings';
import { useSession } from '@/lib/auth-client';

interface PeriodData {
	title: string;
	fromDate: string;
	toDate: string;
	podium: LeaderboardPodiumRanking[];
	rankings: LeaderboardRankingItem[];
}

const runOptions = [
	{ id: 'daily', label: 'Daily' },
	{ id: 'weekly', label: 'Weekly' },
	{ id: 'monthly', label: 'Monthly' },
];

export function LeaderboardView() {
	const { data: session } = useSession();
	const [selectedRunId, setSelectedRunId] = React.useState('weekly');
	const [selectedMetric, setSelectedMetric] = React.useState<'coins' | 'score'>('coins');
	const [liveData, setLiveData] = React.useState<Record<string, PeriodData>>({});
	const [loading, setLoading] = React.useState(false);

	const cacheKey = `${selectedRunId}_${selectedMetric}`;

	React.useEffect(() => {
		async function fetchLeaderboard(period: string, metric: string) {
			setLoading(true);
			try {
				let res = await fetch(`/api/v1/leaderboard?period=${period}&metric=${metric}`);
				if (!res.ok) {
					res = await fetch(`/api/leaderboard?period=${period}&metric=${metric}`);
				}
				if (res.ok) {
					const json = await res.json();
					const key = `${period}_${metric}`;
					setLiveData((prev) => ({
						...prev,
						[key]: {
							title: json.title,
							fromDate: json.fromDate,
							toDate: json.toDate,
							podium: json.podium || [],
							rankings: json.rankings || [],
						},
					}));
				}
			} catch {
			} finally {
				setLoading(false);
			}
		}

		fetchLeaderboard(selectedRunId, selectedMetric);
	}, [selectedRunId, selectedMetric]);

	const defaultEmptyData: PeriodData = {
		title:
			selectedMetric === 'score'
				? selectedRunId === 'daily'
					? 'Daily Top Smile Scores'
					: selectedRunId === 'weekly'
					? 'Weekly Top Smile Scores'
					: 'Monthly Smile Champions'
				: selectedRunId === 'daily'
				? 'Daily Smile Sprint'
				: selectedRunId === 'weekly'
				? 'Weekly Smile Challenge'
				: 'Monthly Hall of Fame',
		fromDate: new Date(
			Date.now() - (selectedRunId === 'daily' ? 1 : selectedRunId === 'weekly' ? 7 : 30) * 86400000
		)
			.toISOString()
			.split('T')[0],
		toDate: new Date().toISOString().split('T')[0],
		podium: [],
		rankings: [],
	};

	const currentData = liveData[cacheKey] ?? defaultEmptyData;

	return (
		<LeaderboardCard
			title={currentData.title}
			fromDate={currentData.fromDate}
			toDate={currentData.toDate}
			currentUserId={session?.user?.id}
			podiumRankings={currentData.podium}
			rankings={currentData.rankings}
			runOptions={runOptions}
			selectedRunId={selectedRunId}
			onRunChange={setSelectedRunId}
			metric={selectedMetric}
			onMetricChange={setSelectedMetric}
		/>
	);
}
