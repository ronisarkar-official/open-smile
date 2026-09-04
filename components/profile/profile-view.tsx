'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	Award,
	CalendarDays,
	Camera,
	CheckCircle2,
	Coins,
	Copy,
	Crown,
	ExternalLink,
	Eye,
	Flame,
	Gift,
	Heart,
	QrCode,
	ScanFace,
	Settings,
	Share2,
	Smile,
	Sparkles,
	Trophy,
	UserCheck,
	Users,
	Zap,
} from 'lucide-react';
import type { UserProfileFullDetails } from '@/lib/db/collections';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CoinIcon } from '@/components/ui/coin-icon';
import { BadgeShowcase } from '@/components/profile/badge-showcase';
import { ConsistencyCalendar } from '@/components/profile/consistency-calendar';
import { ShareProfileModal } from '@/components/profile/share-profile-modal';

interface ProfileViewProps {
	initialData: UserProfileFullDetails;
}

export function ProfileView({ initialData }: ProfileViewProps) {
	const [data, setData] = React.useState<UserProfileFullDetails>(initialData);
	const [shareModalOpen, setShareModalOpen] = React.useState(false);
	const [activeTab, setActiveTab] = React.useState<'overview' | 'trophies' | 'calendar' | 'moments'>('overview');
	const [referralCopied, setReferralCopied] = React.useState(false);

	const origin = typeof window !== 'undefined' ? window.location.origin : 'https://opensmile.app';
	const referralUrl = `${origin}/join/${data.referral.code}`;

	const handleCopyReferral = async () => {
		try {
			await navigator.clipboard.writeText(referralUrl);
			setReferralCopied(true);
			setTimeout(() => setReferralCopied(false), 2000);
		} catch {}
	};

	const userInitials =
		data.name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'OS';

	const statCards = [
		{
			id: 'streak',
			label: 'Daily Streak',
			value: `${data.stats.streakCount} Days`,
			subtext: `${data.stats.multiplierLabel} Coin Multiplier Active`,
			icon: Flame,
			bg: 'bg-primary text-primary-foreground',
			link: '/streak',
		},
		{
			id: 'best-score',
			label: 'Personal Record',
			value: `${data.stats.bestScore}/100`,
			subtext: data.stats.bestScore >= 90 ? 'Duchenne Grade Smile' : 'Genuine Facial Expression',
			icon: ScanFace,
			bg: 'bg-accent text-accent-foreground',
			link: '/capture',
		},
		{
			id: 'total-smiles',
			label: 'Verified Smiles',
			value: data.stats.totalSmiles.toLocaleString(),
			subtext: `Avg Score: ${data.stats.avgScore}/100`,
			icon: Smile,
			bg: 'bg-secondary text-secondary-foreground',
			link: '/capture',
		},
		{
			id: 'coins',
			label: 'Total Earned',
			value: data.stats.lifetimeCoinsEarned.toLocaleString(),
			subtext: `${data.stats.currentCoinsBalance} spendable coins`,
			icon: Coins,
			bg: 'bg-warning text-warning-foreground',
			link: '/rewards',
		},
	];

	return (
		<main id="main-content" className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 space-y-6 reveal-in">
			{/* HERO IDENTITY CARD */}
			<section className="border-[length:var(--border-width)] border-black rounded-2xl bg-card p-5 sm:p-8 shadow-brutal-lg relative overflow-hidden">
				<div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
					{/* Left: Avatar + Title info */}
					<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
						{/* Avatar with Streak Flame Badge */}
						<div className="relative shrink-0">
							<Avatar className="size-24 sm:size-28 border-[length:var(--border-width)] border-black shadow-brutal">
								<AvatarImage src={data.image || DEFAULT_AVATAR_URL} alt={data.name} />
								<AvatarFallback className="bg-primary text-primary-foreground font-title font-black text-3xl">
									{userInitials}
								</AvatarFallback>
							</Avatar>
							<div
								title={`${data.stats.streakCount} Day Streak`}
								className="absolute -bottom-2 -right-2 flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 font-mono text-xs font-black shadow-brutal-xs"
							>
								<Flame className="size-3.5 fill-white" />
								<span>{data.stats.streakCount}</span>
							</div>
						</div>

						{/* Identity Info */}
						<div className="space-y-1.5 min-w-0">
							<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
								<h1 className="font-title text-2xl sm:text-3xl font-black tracking-tight text-foreground">
									{data.name}
								</h1>
								{/* Smiler Tier Badge */}
								<span className="border-[length:var(--border-width)] border-black rounded-md bg-accent text-accent-foreground px-2.5 py-0.5 font-mono text-[11px] font-black uppercase shadow-brutal-xs flex items-center gap-1">
									<span>{data.stats.tierIcon}</span>
									<span>{data.stats.tierName}</span>
								</span>
								{/* Streak Society Badge */}
								{data.streakSociety.isMember && (
									<span className="border-[length:var(--border-width)] border-black rounded-md bg-[#FBBF24] text-black px-2 py-0.5 font-title font-black text-[10px] uppercase shadow-brutal-xs flex items-center gap-1">
										<Crown className="size-3" />
										Streak Society
									</span>
								)}
							</div>

							<p className="font-mono text-xs font-bold text-muted-foreground">
								@{data.username}
							</p>

							<div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 font-mono text-xs text-muted-foreground">
								<span className="flex items-center gap-1">
									<CalendarDays className="size-3.5" />
									Joined {data.joinDate}
								</span>
								{data.stats.dailyRank && (
									<span className="flex items-center gap-1 text-foreground font-bold">
										<Trophy className="size-3.5 text-secondary" />
										#{data.stats.dailyRank} Daily Rank
									</span>
								)}
								<span className="flex items-center gap-1">
									<Users className="size-3.5" />
									{data.referral.totalReferred} Referrals
								</span>
							</div>
						</div>
					</div>

					{/* Right: Quick Action Buttons */}
					<div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
						<Button
							type="button"
							onClick={() => setShareModalOpen(true)}
							className="border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-xs uppercase px-4 py-2 shadow-brutal-xs brutal-lift hover:bg-primary/90 flex items-center gap-1.5"
						>
							<Share2 className="size-3.5" strokeWidth={2.5} />
							Share Profile
						</Button>

						<Button
							asChild
							variant="outline"
							className="border-[length:var(--border-width)] border-black rounded-lg bg-card text-foreground font-title font-bold text-xs uppercase px-3.5 py-2 shadow-brutal-xs brutal-lift hover:bg-muted/50 flex items-center gap-1.5"
						>
							<Link href={`/u/${encodeURIComponent(data.username)}`}>
								<Eye className="size-3.5" strokeWidth={2.5} />
								Public Card
							</Link>
						</Button>

						<Button
							asChild
							variant="outline"
							className="border-[length:var(--border-width)] border-black rounded-lg bg-card text-foreground font-title font-bold text-xs uppercase px-3 py-2 shadow-brutal-xs brutal-lift hover:bg-muted/50"
						>
							<Link href="/dashboard/settings" title="Account Settings">
								<Settings className="size-4" strokeWidth={2.2} />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* BENTO STATS GRID */}
			<section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
				{statCards.map((card) => {
					const Icon = card.icon;
					return (
						<Link
							key={card.id}
							href={card.link}
							className={`border-[length:var(--border-width)] border-black rounded-xl p-4 sm:p-5 shadow-brutal brutal-lift ${card.bg} flex flex-col justify-between transition-all`}
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
						</Link>
					);
				})}
			</section>

			{/* NAVIGATION TABS */}
			<nav className="flex items-center gap-2 overflow-x-auto border-b-[length:var(--border-width)] border-black/15 pb-2">
				{[
					{ id: 'overview', label: 'Trophies & Stats', icon: Trophy },
					{ id: 'calendar', label: 'Habit Matrix', icon: CalendarDays },
					{ id: 'moments', label: `Shared Moments (${data.publicPosts.length})`, icon: Smile },
					{ id: 'trophies', label: 'Trophy Room', icon: Award },
				].map((tab) => {
					const Icon = tab.icon;
					const active = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id as any)}
							className={`flex items-center gap-2 border-[length:var(--border-width)] rounded-lg px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
								active
									? 'border-black bg-primary text-primary-foreground shadow-brutal-xs'
									: 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground'
							}`}
						>
							<Icon className="size-4" strokeWidth={2.2} />
							<span>{tab.label}</span>
						</button>
					);
				})}
			</nav>

			{/* TAB CONTENT PANELS */}
			{activeTab === 'overview' && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left 2 Cols: Badges + Consistency */}
					<div className="lg:col-span-2 space-y-6">
						<BadgeShowcase badges={data.badges} />
						<ConsistencyCalendar
							monthlyCaptures={data.monthlyCaptures}
							isTodayCompleted={data.stats.isTodayCompleted}
							streakCount={data.stats.streakCount}
						/>
					</div>

					{/* Right 1 Col: Viral Referral & Recent Smiles */}
					<div className="space-y-6">
						{/* Referral Card */}
						<div className="border-[length:var(--border-width)] border-black rounded-xl bg-secondary/15 p-5 shadow-brutal-md space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Gift className="size-5 text-secondary" strokeWidth={2.5} />
									<h2 className="font-title text-base font-black">Invite & Earn Coins</h2>
								</div>
								<span className="font-mono text-[10px] font-black uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-md border-[length:var(--border-width)] border-black">
									+50 🪙 Per Friend
								</span>
							</div>

							<p className="font-mono text-xs text-muted-foreground leading-relaxed">
								Give friends your referral link. When they capture their first smile, you both get bonus coins!
							</p>

							<div className="flex items-center gap-2 pt-1">
								<input
									readOnly
									value={referralUrl}
									className="flex-1 border-[length:var(--border-width)] border-black rounded-lg bg-card px-2.5 py-1.5 font-mono text-xs text-foreground select-all focus:outline-none"
								/>
								<Button
									type="button"
									size="sm"
									onClick={handleCopyReferral}
									className="border-[length:var(--border-width)] border-black rounded-lg bg-accent text-accent-foreground font-title font-black text-xs uppercase px-3 shadow-brutal-xs brutal-lift hover:bg-accent/90 shrink-0"
								>
									{referralCopied ? 'Copied' : 'Copy'}
								</Button>
							</div>

							<div className="grid grid-cols-2 gap-2 pt-2 border-t-[length:var(--border-width)] border-black/15 font-mono text-xs">
								<div className="border-[length:var(--border-width)] border-black rounded-lg bg-card p-2 text-center">
									<div className="font-display font-black text-lg tabular-nums">
										{data.referral.totalReferred}
									</div>
									<div className="text-[10px] font-bold text-muted-foreground uppercase">Friends Joined</div>
								</div>
								<div className="border-[length:var(--border-width)] border-black rounded-lg bg-card p-2 text-center">
									<div className="font-display font-black text-lg tabular-nums text-primary">
										{data.referral.coinsEarned} 🪙
									</div>
									<div className="text-[10px] font-bold text-muted-foreground uppercase">Bonus Coins</div>
								</div>
							</div>
						</div>

						{/* Recent Captures Log */}
						<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal-md space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Camera className="size-4.5 text-primary" strokeWidth={2.5} />
									<h2 className="font-title text-base font-black">Recent Smiles</h2>
								</div>
								<Link
									href="/capture"
									className="font-mono text-[10px] font-bold uppercase text-primary hover:underline"
								>
									+ Capture
								</Link>
							</div>

							{data.recentCaptures.length === 0 ? (
								<p className="font-mono text-xs text-muted-foreground py-4 text-center">
									No smiles logged yet today.
								</p>
							) : (
								<div className="divide-y divide-border">
									{data.recentCaptures.map((cap) => (
										<div key={cap.id} className="flex items-center justify-between py-2.5">
											<div className="flex items-center gap-2.5">
												<div className="flex size-8 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-accent text-accent-foreground font-display font-black text-xs">
													{cap.score}
												</div>
												<div>
													<p className="font-title text-xs font-bold text-foreground">
														{cap.quality}
													</p>
													<p className="font-mono text-[10px] text-muted-foreground">
														{cap.time}
													</p>
												</div>
											</div>
											<div className="font-mono text-xs font-black text-success">
												+{cap.coins} 🪙
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{activeTab === 'trophies' && (
				<BadgeShowcase badges={data.badges} />
			)}

			{activeTab === 'calendar' && (
				<ConsistencyCalendar
					monthlyCaptures={data.monthlyCaptures}
					isTodayCompleted={data.stats.isTodayCompleted}
					streakCount={data.stats.streakCount}
				/>
			)}

			{activeTab === 'moments' && (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-lg space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-title text-xl font-black">Public Shared Smiles</h2>
							<p className="font-mono text-xs text-muted-foreground">
								Live posts visible on the community Explore feed (auto-expires after 24h)
							</p>
						</div>
						<Button
							asChild
							size="sm"
							className="border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground font-title font-black text-xs uppercase shadow-brutal-xs"
						>
							<Link href="/explore">View Explore Feed</Link>
						</Button>
					</div>

					{data.publicPosts.length === 0 ? (
						<div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-2">
							<Smile className="mx-auto size-12 opacity-30" strokeWidth={1.5} />
							<p className="font-title text-base font-black">No shared moments active</p>
							<p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
								Your captures are 100% private by default. When you capture a great smile, you can opt in to share it with the community for 24 hours.
							</p>
							<div className="pt-2">
								<Button
									asChild
									size="sm"
									className="border-[length:var(--border-width)] border-black rounded-md bg-accent text-accent-foreground font-title font-black text-xs uppercase shadow-brutal-xs brutal-lift hover:bg-accent/90"
								>
									<Link href="/capture">Capture & Share</Link>
								</Button>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
							{data.publicPosts.map((post) => (
								<div
									key={post.id}
									className="border-[length:var(--border-width)] border-black rounded-xl bg-muted/20 p-3 shadow-brutal-sm flex flex-col justify-between space-y-2"
								>
									<div className="flex items-center justify-between">
										<span className="border-[length:var(--border-width)] border-black rounded-md bg-accent text-accent-foreground px-2 py-0.5 font-mono text-[10px] font-black">
											{post.smileScore} Score
										</span>
										<span className="font-mono text-[10px] font-bold text-muted-foreground">
											{post.timeRemainingHours}h left
										</span>
									</div>

									<div className="flex items-center justify-between pt-2 border-t-[length:var(--border-width)] border-black/10">
										<span className="flex items-center gap-1 font-mono text-xs font-bold text-primary">
											<Heart className="size-3.5 fill-primary" />
											{post.likesCount}
										</span>
										<span className="font-mono text-[10px] font-bold text-muted-foreground">
											Live on feed
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* SHARE PROFILE MODAL */}
			<ShareProfileModal
				isOpen={shareModalOpen}
				onClose={() => setShareModalOpen(false)}
				name={data.name}
				username={data.username}
				streakCount={data.stats.streakCount}
				tierName={data.stats.tierName}
				referralCode={data.referral.code}
			/>
		</main>
	);
}
