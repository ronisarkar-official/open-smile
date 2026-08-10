import { headers } from 'next/headers';
import { auth } from '@/auth';

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user;

	return (
		<div className="flex flex-1 flex-col items-start justify-center gap-3 p-6">
			<h1 className="text-2xl font-bold tracking-tight">
				Welcome back, {user?.name ?? 'there'}
			</h1>
			<p className="text-sm text-muted-foreground">
				Signed in as {user?.email}. This dashboard is ready for your feature.
			</p>
		</div>
	);
}