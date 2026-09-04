import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser, isUserAdmin } from '@/lib/auth/session';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminBootstrapClient } from '@/components/admin/admin-bootstrap-client';
import { ScrollArea } from '@/components/ui/scroll-area';

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
				<AdminSidebar className="hidden md:flex h-full" />
				<main className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
					<ScrollArea className="h-full w-full">
						<div className="p-4 sm:p-6 lg:p-8 mx-auto w-full max-w-[1600px]">{children}</div>
					</ScrollArea>
				</main>
			</div>
		</div>
	);
}
