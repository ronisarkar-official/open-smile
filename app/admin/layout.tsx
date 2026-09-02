import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser, isUserAdmin } from '@/backend/auth/session';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminBootstrapClient } from '@/components/admin/admin-bootstrap-client';

export const metadata: Metadata = {
	title: 'Admin Control Panel | Open Smile',
	description:
		'Administrative control station for Open Smile economy, users, anti-cheat, and platform management.',
};

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getServerUser();

	if (!user) {
		redirect('/login?redirectTo=/admin');
	}

	if (!isUserAdmin(user)) {
		return <AdminBootstrapClient userEmail={user.email} />;
	}

	return (
		<div className="h-screen max-h-screen w-screen max-w-full overflow-hidden bg-background flex flex-col">
			<AdminHeader user={user} />
			<div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
				<AdminSidebar className="hidden md:flex h-full overflow-y-auto" />
				<main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
					<div className="mx-auto w-full max-w-[1600px]">{children}</div>
				</main>
			</div>
		</div>
	);
}
