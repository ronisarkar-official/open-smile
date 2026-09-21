import type { Metadata } from 'next';
import { AuthLayoutClient } from '@/components/auth/auth-layout-client';

export const metadata: Metadata = {
	title: 'Account Authentication — Open Smile',
	description:
		'Sign in or register for Open Smile to start earning daily smile rewards.',
	robots: {
		index: true,
		follow: true,
	},
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
