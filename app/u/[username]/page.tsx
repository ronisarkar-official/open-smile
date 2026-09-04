import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Smile, ArrowLeft } from 'lucide-react';
import { getUserPublicProfileByUsername } from '@/lib/db';
import { PublicProfileView } from '@/components/profile/public-profile-view';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
	params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { username } = await params;
	const profile = await getUserPublicProfileByUsername(username);

	if (!profile) {
		return {
			title: 'Smiler Not Found | Open Smile',
			description: 'This smile profile could not be found on Open Smile.',
		};
	}

	const unlockedTrophiesCount = profile.badges.filter((b) => b.isUnlocked).length;

	return {
		title: `${profile.name} (@${profile.username}) — Open Smile`,
		description: `Check out ${profile.name}'s ${profile.stats.streakCount}-day smile streak, ${unlockedTrophiesCount} unlocked trophies, and ${profile.stats.tierName} status on Open Smile.`,
		openGraph: {
			title: `${profile.name} — ${profile.stats.streakCount} Day Smile Streak 🔥`,
			description: `Smiled ${profile.stats.totalSmiles} times • ${profile.stats.tierName} • Daily AI Rewards`,
			images: [profile.image || '/icons/icon-512x512.png'],
		},
	};
}

export default async function PublicProfilePage({ params }: PageProps) {
	const { username } = await params;
	const profile = await getUserPublicProfileByUsername(username);

	if (!profile) {
		return (
			<div className="min-h-screen flex flex-col bg-background">
				<Navbar />
				<main className="flex-1 flex items-center justify-center p-4">
					<div className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-2xl bg-card p-8 text-center shadow-brutal-lg space-y-4">
						<div className="mx-auto flex size-16 items-center justify-center border-[length:var(--border-width)] border-black rounded-full bg-muted shadow-brutal-sm">
							<Smile className="size-8 text-muted-foreground" />
						</div>
						<div>
							<h1 className="font-title text-2xl font-black">Smiler Not Found</h1>
							<p className="font-mono text-xs text-muted-foreground mt-1">
								The user &quot;{username}&quot; hasn&apos;t joined Open Smile yet or has an alternate handle.
							</p>
						</div>
						<div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
							<Button asChild variant="outline" className="w-full sm:w-auto border-[length:var(--border-width)] border-black">
								<Link href="/">
									<ArrowLeft className="size-3.5 mr-1" />
									Home
								</Link>
							</Button>
							<Button asChild className="w-full sm:w-auto border-[length:var(--border-width)] border-black bg-primary text-primary-foreground">
								<Link href="/signup">Create Free Account</Link>
							</Button>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return <PublicProfileView profile={profile} />;
}
