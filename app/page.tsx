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
			<main className="flex flex-1 flex-col px-6 pt-20 pb-28 sm:px-8">
				<div className="mx-auto w-full max-w-7xl">
					<div className="max-w-2xl">
						<h1 className="max-w-[18ch] text-4xl font-bold tracking-tighter leading-[1.05] sm:text-5xl md:text-6xl">
							Ship your hackathon idea on a foundation that works.
						</h1>
						<p className="mt-6 max-w-[55ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
							Auth, OTP email verification, file uploads, and a dashboard are
							already wired and running. You focus on the problem statement.
						</p>
						<div className="mt-10">
							<label
								htmlFor="waitlist-email"
								className="mb-2 block text-sm font-medium">
								Join the beta waitlist
							</label>
							<WaitlistForm />
							<p className="mt-2 text-xs text-muted-foreground">
								No spam — one email when the beta opens.
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}