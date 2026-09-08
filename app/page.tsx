import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { Navbar } from '@/components/navbar';
import { WaitlistForm } from '@/components/waitlist-form';

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session?.user) {
		redirect('/dashboard');
	}

	return (
		<>
			<Navbar />
			
		</>
	);
}