import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/backend/auth';
import { getUserProfileFullDetails } from '@/backend/db';
import { ProfileView } from '@/components/profile/profile-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
	title: 'My Profile | Open Smile',
	description: 'Track your smile milestones, streak achievements, unlocked badges, and coin ledger.',
};

export default async function ProfilePage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const userId = session?.user?.id;

	if (!userId) {
		redirect('/login?redirectTo=/profile');
	}

	const profileData = await getUserProfileFullDetails(userId);

	return <ProfileView initialData={profileData} />;
}
