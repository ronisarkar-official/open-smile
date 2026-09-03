'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	CalendarDays,
	Camera,
	Crown,
	Flame,
	Heart,
	ScanFace,
	Share2,
	Smile,
	Sparkles,
	Trophy,
	UserPlus,
} from 'lucide-react';
import type { UserPublicProfileDetails } from '@/backend/db/collections';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { BadgeShowcase } from '@/components/profile/badge-showcase';
import { ShareProfileModal } from '@/components/profile/share-profile-modal';

interface PublicProfileViewProps {
	profile: UserPublicProfileDetails;
}

export function PublicProfileView({ profile }: PublicProfileViewProps) {
	const [shareModalOpen, setShareModalOpen] = React.useState(false);

	const joinUrl = profile.referralCode
		? `/join/${encodeURIComponent(profile.referralCode)}`
		: `/signup`;

	const unlockedTrophiesCount = profile.badges.filter((b) => b.isUnlocked).length;

	const statCards = [
		{
			label: 'Daily Streak',
			value: `${profile.stats.streakCount} Days`,
			subtext: `${profile.stats.multiplierLabel} Coins Boost`,
			icon: Flame,
			bg: 'bg-primary text-primary-foreground',
		},
		{
			label: 'Highest Score',
			value: `${profile.stats.bestScore}/100`,
			subtext: profile.stats.bestScore >= 90 ? 'Duchenne Smile' : 'Genuine Expression',
			icon: ScanFace,
			bg: 'bg-accent text-accent-foreground',
		},
		{
			label: 'Total Smiles',
			value: profile.stats.totalSmiles.toLocaleString(),
			subtext: 'Verified AI Captures',
			icon: Smile,
			bg: 'bg-secondary text-secondary-foreground',
		},
		{
			label: 'Trophies Won',
			value: `${unlockedTrophiesCount} / ${profile.badges.length}`,
			subtext: profile.stats.tierName,
			icon: Trophy,
			bg: 'bg-warning text-warning-foreground',
		},
	];

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Navbar />

			<main id="main-content" className="flex-1 pb-24">
				{/* HERO SECTION */}
				<section className="border-b-[length:var(--border-width)] border-black bg-card">
					<div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
						{/* Avatar Frame */}
						<div className="flex flex-col items-center md:items-start">
							<div className="relative">
								<Avatar className="size-28 border-[length:var(--border-width)] border-black shadow-brutal-lg sm:size-32">
									<AvatarImage src={profile.image || DEFAULT_AVATAR_URL} alt={profile.name} />
									<AvatarFallback className="bg-primary text-primary-foreground font-title font-black text-3xl sm:text-4xl">
										{profile.avatarLetters}
									</AvatarFallback>
								</Avatar>
								<div
									title={`${profile.stats.streakCount} Day Streak`}
									className="absolute -bottom-2 -right-2 flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 font-mono text-xs font-black shadow-brutal-xs"
								>
									<Flame className="size-3.5 fill-white" />
									<span>{profile.stats.streakCount}</span>
								</div>
							</div>
						</div>

						{/* Identity & Actions */}
						<div className="text-center md:text-left space-y-3">
							<div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
								<h1 className="font-title text-3xl sm:text-4xl font-black tracking-tight text-foreground">
									{profile.name}
								</h1>
								{/* Tier Pill */}
								<span className="border-[length:var(--border-width)] border-black rounded-md bg-accent text-accent-foreground px-2.5 py-0.5 font-mono text-xs font-black uppercase shadow-brutal-xs flex items-center gap-1">
									<span>{profile.stats.tierIcon}</span>
									<span>{profile.stats.tierName}</span>
								</span>
								{/* Streak Society */}
								{profile.streakSociety.isMember && (
									<span className="border-[length:var(--border-width)] border-black rounded-md bg-[#FBBF24] text-black px-2 py-0.5 font-title font-black text-[10px] uppercase shadow-brutal-xs flex items-center gap-1">
										<Crown className="size-3" />
										Streak Society
									</span>
								)}
							</div>

							<p className="font-mono text-sm font-bold text-muted-foreground">
								@{profile.username}
							</p>

							<div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-mono text-xs text-muted-foreground">
								<span className="flex items-center gap-1.5">
									<CalendarDays className="size-4" />
									Joined {profile.joinDate}
								</span>
								{profile.stats.dailyRank && (
									<span className="flex items-center gap-1.5 text-foreground font-bold">
										<Trophy className="size-4 text-secondary" />
										#{profile.stats.dailyRank} Daily Rank
									</span>
								)}
								<span className="flex items-center gap-1.5">
									<Smile className="size-4" />
									{profile.stats.totalSmiles} Smiles
								</span>
							</div>

							{/* Action buttons */}
							<div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
								<Button
									type="button"
									onClick={() => setShareModalOpen(true)}
									className="border-[length:var(--border-width)] border-black rounded-lg bg-card text-foreground font-title font-black text-xs uppercase px-4 py-2 shadow-brutal-xs brutal-lift hover:bg-muted/40"
								>
									<Share2 className="size-3.5 mr-1.5" strokeWidth={2.5} />
									Share Profile
								</Button>

								<Button
									asChild
									className="border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-xs uppercase px-5 py-2 shadow-brutal-sm brutal-lift hover:bg-primary/90"
								>
									<Link href={joinUrl}>
										<Sparkles className="size-3.5 mr-1.5" strokeWidth={2.5} />
										Smile with {profile.name}
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* STATS BENTO GRID */}
				<section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
						{statCards.map((card) => {
							const Icon = card.icon;
							return (
								<div
									key={card.label}
									className={`border-[length:var(--border-width)] border-black rounded-xl p-4 sm:p-5 shadow-brutal ${card.bg} flex flex-col justify-between`}
								>
									<div className="flex items-center justify-between">
										<span className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider opacity-90">
											{card.label}
										</span>
										<Icon className="size-5" strokeWidth={2.5} />
									</div>
									<div className="mt-4">
										<div className="font-display text-2xl sm:text-3xl font-black tracking-tight tabular-nums">
											{card.value}
										</div>
										<p className="font-mono text-[10px] sm:text-[11px] font-bold opacity-80 mt-1 truncate">
											{card.subtext}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				{/* TROPHY ROOM */}
				<section className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
					<BadgeShowcase badges={profile.badges} />
				</section>

				{/* PUBLIC SMILES GALLERY */}
				<section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 space-y-4">
					<div className="flex items-end justify-between gap-4">
						<div>
							<p className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">
								Shared Moments
							</p>
							<h2 className="mt-1 text-2xl font-black tracking-[-0.04em] sm:text-3xl font-title">
								Public Smile Feed
							</h2>
						</div>
						<span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
							{profile.publicPosts.length} posts active
						</span>
					</div>

					{profile.publicPosts.length === 0 ? (
						<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-8 text-center shadow-brutal">
							<Smile className="mx-auto size-12 opacity-30" strokeWidth={1.5} />
							<p className="mt-3 font-title text-lg font-black">No active public smiles</p>
							<p className="mt-1 font-mono text-xs text-muted-foreground">
								Captures on Open Smile are private by default and auto-expire after 24 hours.
							</p>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{profile.publicPosts.map((post) => (
								<article
									key={post.id}
									className="border-[length:var(--border-width)] border-black rounded-xl bg-card overflow-hidden shadow-brutal brutal-lift"
								>
									<div className={`${post.bg} relative flex aspect-square items-center justify-center`}>
										<div className="absolute left-3 top-3 flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-xs bg-card px-2 py-1">
											<ScanFace className="size-3" strokeWidth={2.5} />
											<span className="font-mono text-[10px] font-bold tabular-nums">{post.smileScore}</span>
										</div>
										<Smile className="size-16 opacity-30" strokeWidth={1.5} />
									</div>
									<div className="flex items-center justify-between border-t-[length:var(--border-width)] border-black p-3 font-mono text-xs">
										<span className="text-[10px] text-muted-foreground">{post.timeAgo}</span>
										<div className="flex items-center gap-1 text-primary font-bold">
											<Heart className="size-3.5 fill-primary" />
											<span className="tabular-nums">{post.likesCount}</span>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</section>
			</main>

			{/* VIRAL STICKY FOOTER CONVERSION BAR */}
			<aside className="sticky bottom-0 z-40 border-t-[length:var(--border-width)] border-black bg-card/95 backdrop-blur-sm p-3.5 sm:p-4 shadow-[0_calc(-1*var(--shadow-offset))_0_var(--outline)]">
				<div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
					<div className="flex items-center gap-2.5">
						<span className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-accent text-accent-foreground font-black text-sm shadow-brutal-xs shrink-0">
							😄
						</span>
						<div>
							<p className="font-title text-sm font-black">
								Inspired by {profile.name}&apos;s {profile.stats.streakCount}-day smile streak?
							</p>
							<p className="font-mono text-xs text-muted-foreground">
								Smile once a day, boost your happiness, and claim Amazon gift cards.
							</p>
						</div>
					</div>

					<Button
						asChild
						className="border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-xs uppercase px-6 py-2.5 shadow-brutal-sm brutal-lift hover:bg-primary/90 shrink-0 w-full sm:w-auto"
					>
						<Link href={joinUrl} className="flex items-center gap-1.5">
							<Sparkles className="size-3.5" strokeWidth={2.5} />
							Join Open Smile Free
						</Link>
					</Button>
				</div>
			</aside>

			<footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 font-mono text-xs text-muted-foreground">
				<p className="font-bold text-foreground">© 2026 Open Smile</p>
				<p>A brighter habit, built with on-device facial AI and zero permanent face storage.</p>
			</footer>

			{/* SHARE PROFILE MODAL */}
			<ShareProfileModal
				isOpen={shareModalOpen}
				onClose={() => setShareModalOpen(false)}
				name={profile.name}
				username={profile.username}
				streakCount={profile.stats.streakCount}
				tierName={profile.stats.tierName}
				referralCode={profile.referralCode}
			/>
		</div>
	);
}
