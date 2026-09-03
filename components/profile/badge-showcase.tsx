'use client';

import * as React from 'react';
import {
	Award,
	Camera,
	CheckCircle2,
	Crown,
	Flame,
	Gift,
	Heart,
	Lock,
	Share2,
	Sparkles,
	Trophy,
	Users,
	Zap,
} from 'lucide-react';
import type { ProfileBadgeItem } from '@/backend/db/collections';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface BadgeShowcaseProps {
	badges: ProfileBadgeItem[];
}

const iconMap: Record<string, React.ElementType> = {
	Flame,
	Zap,
	Award,
	Trophy,
	Crown,
	Camera,
	Sparkles,
	Heart,
	Share2,
	Gift,
	Users,
};

const categoryLabels: Record<string, { label: string; icon: string }> = {
	all: { label: 'All Trophies', icon: '🏆' },
	streak: { label: 'Streak', icon: '🔥' },
	quality: { label: 'Smile Quality', icon: '✨' },
	social: { label: 'Community', icon: '🌐' },
	economy: { label: 'Rewards', icon: '🎁' },
};

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
	const [selectedBadge, setSelectedBadge] = React.useState<ProfileBadgeItem | null>(null);
	const [filter, setFilter] = React.useState<'all' | 'streak' | 'quality' | 'social' | 'economy'>('all');

	const unlockedCount = badges.filter((b) => b.isUnlocked).length;
	const totalCount = badges.length;
	const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

	const filteredBadges = filter === 'all' ? badges : badges.filter((b) => b.category === filter);

	// Category counts for badges
	const counts = React.useMemo(() => {
		return {
			all: badges.length,
			streak: badges.filter((b) => b.category === 'streak').length,
			quality: badges.filter((b) => b.category === 'quality').length,
			social: badges.filter((b) => b.category === 'social').length,
			economy: badges.filter((b) => b.category === 'economy').length,
		};
	}, [badges]);

	return (
		<div className="space-y-5">
			{/* PROGRESS & HEADER SECTION */}
			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-6 shadow-brutal-sm">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground shadow-brutal-xs">
								<Trophy className="size-4.5" strokeWidth={2.5} />
							</div>
							<h2 className="font-title text-xl sm:text-2xl font-black tracking-tight text-foreground">
								Trophy Cabinet
							</h2>
						</div>
						<p className="font-mono text-xs text-muted-foreground mt-1">
							Unlock exclusive badges by building smile streaks, achieving high AI scores, and sharing joy.
						</p>
					</div>

					<div className="flex items-center gap-3 shrink-0">
						<div className="text-right font-mono">
							<span className="text-sm font-black text-foreground tabular-nums">
								{unlockedCount} / {totalCount}
							</span>
							<p className="text-[10px] font-bold text-muted-foreground uppercase">Trophies Won</p>
						</div>
						<div className="flex size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-accent font-display font-black text-xs shadow-brutal-xs tabular-nums">
							{progressPercent}%
						</div>
					</div>
				</div>

				{/* Progress Track */}
				<div className="mt-4 relative h-3 w-full border-[length:var(--border-width)] border-black rounded-full bg-muted overflow-hidden">
					<div
						className="absolute inset-y-0 left-0 bg-primary border-r-[length:var(--border-width)] border-black rounded-l-full transition-all duration-700 ease-out"
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
			</div>

			{/* CATEGORY FILTER TABS */}
			<div className="flex items-center gap-2 overflow-x-auto pb-1">
				{(['all', 'streak', 'quality', 'social', 'economy'] as const).map((cat) => {
					const active = filter === cat;
					const meta = categoryLabels[cat];
					const count = counts[cat];

					return (
						<button
							key={cat}
							type="button"
							onClick={() => setFilter(cat)}
							className={`flex items-center gap-1.5 border-[length:var(--border-width)] rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all cursor-pointer ${
								active
									? 'border-black bg-primary text-primary-foreground shadow-brutal-xs'
									: 'border-black/20 bg-card text-muted-foreground hover:border-black hover:text-foreground'
							}`}
						>
							<span>{meta.icon}</span>
							<span>{meta.label}</span>
							<span
								className={`ml-1 text-[10px] font-black px-1.5 py-0.2 rounded-md ${
									active ? 'bg-black/20 text-white' : 'bg-muted text-muted-foreground'
								}`}
							>
								{count}
							</span>
						</button>
					);
				})}
			</div>

			{/* TROPHY CARDS GRID */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
				{filteredBadges.map((badge) => {
					const Icon = iconMap[badge.iconName] || Trophy;

					return (
						<div
							key={badge.id}
							onClick={() => setSelectedBadge(badge)}
							className={`group relative flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-xl p-4 transition-all cursor-pointer brutal-lift ${
								badge.isUnlocked
									? 'bg-card shadow-brutal hover:shadow-brutal-md'
									: 'bg-card/60 opacity-80 hover:opacity-100 shadow-brutal-xs'
							}`}
						>
							{/* Card Top: Icon + Badge Status */}
							<div className="flex items-start justify-between gap-3">
								<div
									className={`flex size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg shadow-brutal-xs transition-transform group-hover:scale-105 shrink-0 ${
										badge.isUnlocked
											? `${badge.accentColor} text-black`
											: 'bg-muted text-muted-foreground'
									}`}
								>
									{badge.isUnlocked ? (
										<Icon className="size-5.5" strokeWidth={2.5} />
									) : (
										<Lock className="size-4.5" strokeWidth={2.2} />
									)}
								</div>

								<div className="flex flex-col items-end gap-1">
									<span
										className={`font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border-[length:var(--border-width)] border-black rounded-md ${
											badge.isUnlocked
												? 'bg-success/20 text-success-foreground'
												: 'bg-muted text-muted-foreground'
										}`}
									>
										{badge.isUnlocked ? 'Unlocked' : 'Locked'}
									</span>
									<span className="font-mono text-[10px] font-bold text-muted-foreground">
										{badge.thresholdText}
									</span>
								</div>
							</div>

							{/* Card Middle: Title & Description */}
							<div className="my-3 space-y-1">
								<h3 className="font-title text-sm font-black text-foreground group-hover:text-primary transition-colors">
									{badge.name}
								</h3>
								<p className="font-mono text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
									{badge.description}
								</p>
							</div>

							{/* Card Footer: Progress Pill */}
							<div className="pt-2.5 border-t-[length:var(--border-width)] border-black/10 flex items-center justify-between font-mono text-[10px]">
								<span className="font-bold uppercase tracking-wider text-muted-foreground">
									{categoryLabels[badge.category]?.label || 'Milestone'}
								</span>
								{badge.isUnlocked ? (
									<span className="flex items-center gap-1 font-bold text-emerald-600">
										<CheckCircle2 className="size-3.5" strokeWidth={3} />
										Achieved
									</span>
								) : (
									<span className="font-bold text-muted-foreground">
										Requirement: {badge.thresholdText}
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* BADGE DETAILS DIALOG */}
			<Dialog open={Boolean(selectedBadge)} onOpenChange={(open) => !open && setSelectedBadge(null)}>
				{selectedBadge && (
					<DialogContent className="sm:max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-lg">
						<DialogHeader className="text-center sm:text-center">
							<div className="mx-auto flex size-18 items-center justify-center border-[length:var(--border-width)] border-black rounded-2xl shadow-brutal-md mb-3 bg-card">
								{React.createElement(iconMap[selectedBadge.iconName] || Trophy, {
									className: `size-9 ${selectedBadge.isUnlocked ? 'text-primary' : 'text-muted-foreground'}`,
									strokeWidth: 2.5,
								})}
							</div>
							<DialogTitle className="font-title text-2xl font-black">
								{selectedBadge.name}
							</DialogTitle>
							<p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-1">
								{categoryLabels[selectedBadge.category]?.label || 'Trophy'}
							</p>
						</DialogHeader>

						<div className="space-y-4 pt-2">
							<div className="border-[length:var(--border-width)] border-black rounded-xl bg-muted/30 p-4 text-center">
								<p className="font-mono text-xs text-foreground leading-relaxed">
									{selectedBadge.description}
								</p>
							</div>

							<div className="flex items-center justify-between border-[length:var(--border-width)] border-black rounded-xl p-3 font-mono text-xs">
								<span className="text-muted-foreground font-bold uppercase">Unlock Milestone</span>
								<span className="font-black text-foreground bg-muted px-2.5 py-1 rounded-md border-[length:var(--border-width)] border-black">
									{selectedBadge.thresholdText}
								</span>
							</div>

							<div className="pt-1">
								{selectedBadge.isUnlocked ? (
									<div className="flex items-center justify-center gap-2 border-[length:var(--border-width)] border-black rounded-xl bg-success/20 py-3 font-title font-black text-xs uppercase text-success-foreground shadow-brutal-xs">
										<CheckCircle2 className="size-4 text-success" strokeWidth={3} />
										Trophy Unlocked & Active
									</div>
								) : (
									<div className="flex items-center justify-center gap-2 border-[length:var(--border-width)] border-black rounded-xl bg-muted py-3 font-title font-black text-xs uppercase text-muted-foreground shadow-brutal-xs">
										<Lock className="size-4" strokeWidth={2.5} />
										Locked — Reach requirement to unlock
									</div>
								)}
							</div>
						</div>
					</DialogContent>
				)}
			</Dialog>
		</div>
	);
}
