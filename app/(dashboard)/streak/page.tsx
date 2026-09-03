import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { auth } from '@/backend/auth';
import { getUserStreakFullDetails } from '@/backend/db';
import { StreakView } from '@/components/streak/streak-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
	title: 'Streak | Open Smile',
	description: 'Track your daily smile streak, weekly progress, multiplier boosts, and unlock the exclusive Streak Society.',
};

export default async function StreakPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const userId = session?.user?.id;

	if (!userId) {
		return null;
	}

	const streakData = await getUserStreakFullDetails(userId);

	return <StreakView initialData={streakData} />;
}
