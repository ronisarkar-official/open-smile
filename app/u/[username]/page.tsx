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
		alternates: {
			canonical: `/u/${encodeURIComponent(profile.username)}`,
		},
		openGraph: {
			title: `${profile.name} — ${profile.stats.streakCount} Day Smile Streak 🔥`,
			description: `Smiled ${profile.stats.totalSmiles} times • ${profile.stats.tierName} • Daily AI Rewards`,
			images: [
				profile.image
					? { url: profile.image, alt: `${profile.name}'s profile avatar` }
					: {
							url: '/open-smile_default-image.webp',
							width: 1424,
							height: 810,
							alt: `${profile.name} on Open Smile`,
							type: 'image/webp',
					  },
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${profile.name} — ${profile.stats.streakCount} Day Smile Streak 🔥`,
			description: `Smiled ${profile.stats.totalSmiles} times • ${profile.stats.tierName} • Daily AI Rewards`,
			images: [
				profile.image || {
					url: '/open-smile_default-image.webp',
					width: 1424,
					height: 810,
					alt: `${profile.name} on Open Smile`,
				},
			],
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

	const rawBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ||
		process.env.BETTER_AUTH_URL ||
		'https://open-smile.vercel.app';
	const baseUrl = rawBaseUrl.replace(/\/+$/, '');
	const profileUrl = `${baseUrl}/u/${encodeURIComponent(profile.username)}`;

	const profileSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		'@id': profileUrl,
		url: profileUrl,
		name: `${profile.name}'s Smile Profile`,
		mainEntity: {
			'@type': 'Person',
			name: profile.name,
			alternateName: `@${profile.username}`,
			identifier: profile.username,
			url: profileUrl,
			image: profile.image || `${baseUrl}/open-smile_default-image.webp`,
			description: `${profile.name} has a ${profile.stats.streakCount}-day smile streak on Open Smile.`,
			interactionStatistic: [
				{
					'@type': 'InteractionCounter',
					interactionType: 'https://schema.org/LikeAction',
					userInteractionCount: profile.stats.streakCount,
					name: 'Day Streak',
				},
				{
					'@type': 'InteractionCounter',
					interactionType: 'https://schema.org/CheckInAction',
					userInteractionCount: profile.stats.totalSmiles,
					name: 'Total Smiles',
				},
			],
		},
	};

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: baseUrl,
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Smilers',
				item: `${baseUrl}/u`,
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: `@${profile.username}`,
				item: profileUrl,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
			<PublicProfileView profile={profile} />
		</>
	);
}
