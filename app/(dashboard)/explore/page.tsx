'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	Camera,
	Clock,
	Heart,
	RefreshCw,
	ScanFace,
	Smile,
	Sparkles,
	Compass,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { cn } from '@/lib/utils';

const filters = [
	{ id: 'latest', label: 'Latest' },
	{ id: 'top_scored', label: 'Top scored' },
	{ id: 'most_liked', label: 'Most liked' },
];

interface ExplorePost {
	id: string;
	user: string;
	avatar: string;
	userAvatar?: string;
	score: number;
	likes: number;
	timeAgo: string;
	expiresIn?: string;
	bg: string;
	caption?: string;
	imageUrl?: string;
	isLikedByMe?: boolean;
}

export default function ExplorePage() {
	const { settings } = useSystemSettings();
	const [selectedFilter, setSelectedFilter] = React.useState('latest');
	const [posts, setPosts] = React.useState<ExplorePost[]>([]);
	const [loading, setLoading] = React.useState(true);

	const fetchFeed = React.useCallback(async (filterName: string) => {
		if (settings.maintenance_mode || settings.explore_feed_enabled === false) {
			setPosts([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			let res = await fetch(`/api/v1/explore/feed?filter=${filterName}`);
			if (!res.ok) {
				res = await fetch(`/api/explore/feed?filter=${filterName}`);
			}
			if (res.ok) {
				const json = await res.json();
				setPosts(Array.isArray(json.posts) ? json.posts : []);
			} else {
				setPosts([]);
			}
		} catch {
			setPosts([]);
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchFeed(selectedFilter);
	}, [selectedFilter, fetchFeed]);

	const handleLike = async (postId: string) => {
		setPosts((prev) =>
			prev.map((p) => {
				if (p.id === postId) {
					const wasLiked = p.isLikedByMe;
					return {
						...p,
						isLikedByMe: !wasLiked,
						likes: wasLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
					};
				}
				return p;
			})
		);

		try {
			let res = await fetch(`/api/v1/explore/${postId}/like`, {
				method: 'POST',
			});
			if (!res.ok) {
				res = await fetch(`/api/explore/${postId}/like`, {
					method: 'POST',
				});
			}
			if (res.ok) {
				const data = await res.json();
				setPosts((prev) =>
					prev.map((p) =>
						p.id === postId
							? { ...p, likes: data.likes_count, isLikedByMe: data.liked }
							: p
					)
				);
			}
		} catch {}
	};

	if (settings.maintenance_mode || settings.explore_feed_enabled === false) {
		return (
			<main
				id="main-content"
				className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
				<div className="mx-auto max-w-xl text-center py-16 px-6 border-[length:var(--border-width)] border-black rounded-2xl bg-card shadow-brutal space-y-4">
					<div className="size-16 mx-auto rounded-2xl border-[length:var(--border-width)] border-black bg-muted flex items-center justify-center shadow-brutal-xs">
						<Compass className="size-8 text-muted-foreground" />
					</div>
					<h1 className="text-3xl font-black font-title tracking-tight">Explore Feed Offline</h1>
					<p className="font-mono text-xs text-muted-foreground leading-relaxed">
						{settings.maintenance_mode
							? "Platform maintenance is currently underway. The community explore feed is temporarily offline."
							: "The public community explore feed is currently paused by platform administrators for updates. Please check back later!"}
					</p>
					<div className="pt-2">
						<Link href="/dashboard">
							<Button className="font-mono text-xs font-black uppercase border-[length:var(--border-width)] border-black shadow-brutal-xs">
								Back to Dashboard
							</Button>
						</Link>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main
			id="main-content"
			className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">
						Community
					</p>
					<h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
						Explore
					</h1>
					<p className="mt-3 max-w-[50ch] text-base leading-7 text-muted-foreground">
						See what&apos;s making real people smile. Every post is opt-in, ephemeral (automatically deleted after 24 hours), and features genuine smiles.
					</p>
				</div>
				<Link href="/capture">
					<Button className="gap-2 font-mono text-xs font-black tracking-wider uppercase shadow-brutal brutal-lift">
						<Camera className="size-4" />
						Share Your Smile
					</Button>
				</Link>
			</div>

			<div className="mt-6 flex flex-wrap gap-2">
				{filters.map((filter) => (
					<button
						key={filter.id}
						type="button"
						onClick={() => setSelectedFilter(filter.id)}
						className={cn(
							'border-[length:var(--border-width)] border-black rounded-md px-4 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-all brutal-lift cursor-pointer',
							selectedFilter === filter.id
								? 'bg-primary shadow-brutal-sm text-primary-foreground'
								: 'bg-card shadow-brutal-sm hover:bg-muted text-foreground'
						)}>
						{filter.label}
					</button>
				))}
			</div>

			{loading && posts.length === 0 ? (
				<div className="mt-12 flex flex-col items-center justify-center p-12 border-[length:var(--border-width)] border-black rounded-2xl bg-card shadow-brutal">
					<RefreshCw className="size-8 animate-spin text-primary" />
					<p className="mt-4 font-mono text-sm font-bold text-muted-foreground">
						Loading real community smiles...
					</p>
				</div>
			) : posts.length === 0 ? (
				<div className="mt-12 flex flex-col items-center justify-center p-12 text-center border-[length:var(--border-width)] border-black rounded-2xl bg-card shadow-brutal">
					<div className="flex size-16 items-center justify-center border-[length:var(--border-width)] border-black rounded-2xl bg-primary shadow-brutal-sm">
						<Smile className="size-9 text-primary-foreground" />
					</div>
					<h2 className="mt-5 font-title text-2xl font-black tracking-tight sm:text-3xl">
						No community smiles shared yet
					</h2>
					<p className="mt-2 max-w-md font-mono text-xs font-bold text-muted-foreground leading-relaxed">
						Be the first real smiler on the Explore feed! Take a smile check and click &ldquo;Share to Explore&rdquo; to showcase your real photo.
					</p>
					<Link href="/capture" className="mt-6">
						<Button size="lg" className="gap-2 font-mono text-xs font-black uppercase tracking-wider shadow-brutal brutal-lift">
							<Camera className="size-4" />
							Capture Your First Smile
						</Button>
					</Link>
				</div>
			) : (
				<section
					className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3"
					aria-label="Smile feed">
					{posts.map((post) => (
						<article
							key={post.id}
							className="brutal-surface brutal-lift mb-5 break-inside-avoid bg-card border-[length:var(--border-width)] border-black rounded-xl overflow-hidden shadow-brutal">
							<div
								className={`${post.bg} relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted`}>
								{post.imageUrl ? (
									<img
										src={post.imageUrl}
										alt={`Real smile by ${post.user}`}
										className="size-full object-cover"
										loading="lazy"
									/>
								) : (
									<div className="flex flex-col items-center justify-center p-6 text-center">
										<Smile
											className="size-20 opacity-30"
											strokeWidth={1.5}
										/>
									</div>
								)}
								<div className="absolute left-3 top-3 flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-card px-2.5 py-1 shadow-brutal-xs">
									<ScanFace
										className="size-3.5"
										strokeWidth={2.5}
									/>
									<span className="font-mono text-xs font-black tabular-nums">
										{post.score}
									</span>
									<span className="font-mono text-[10px] text-muted-foreground">
										/ 100
									</span>
								</div>
							</div>
							<div className="border-t-[length:var(--border-width)] border-black p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										<Avatar className="size-8 border-[length:var(--border-width)] border-black shadow-brutal-xs">
											<AvatarImage
												src={post.userAvatar || DEFAULT_AVATAR_URL}
												alt={post.user}
												className="object-cover"
											/>
											<AvatarFallback className="text-xs font-black bg-primary text-primary-foreground">
												{post.avatar}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm font-black">{post.user}</p>
											<div className="flex items-center gap-1.5 mt-0.5">
												<span className="font-mono text-[10px] text-muted-foreground font-semibold">
													{post.timeAgo}
												</span>
												{post.expiresIn && (
													<span className="inline-flex items-center gap-1 border border-black/20 rounded px-1.5 py-0.5 bg-muted font-mono text-[9px] font-bold text-muted-foreground">
														<Clock className="size-2.5 text-amber-500" />
														<span>{post.expiresIn}</span>
													</span>
												)}
											</div>
										</div>
									</div>
									<button
										type="button"
										onClick={() => handleLike(post.id)}
										className={cn(
											'flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md px-2.5 py-1.5 font-mono text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-brutal-xs active:translate-y-0.5 active:shadow-none cursor-pointer',
											post.isLikedByMe
												? 'bg-red-400 text-black shadow-brutal-xs'
												: 'bg-card text-foreground hover:bg-secondary'
										)}>
										<Heart
											className={cn('size-3.5', post.isLikedByMe ? 'fill-current' : '')}
											strokeWidth={2.5}
										/>
										<span className="tabular-nums font-black">{post.likes}</span>
									</button>
								</div>
								{post.caption && (
									<p className="mt-2 text-xs font-medium text-muted-foreground leading-relaxed">
										{post.caption}
									</p>
								)}
							</div>
						</article>
					))}
				</section>
			)}

			<div className="mt-10 mb-6 flex justify-center">
				<Button
					variant="outline"
					size="lg"
					disabled={loading}
					onClick={() => fetchFeed(selectedFilter)}
					className="gap-2 shadow-brutal cursor-pointer font-mono text-xs font-bold uppercase">
					<RefreshCw className={cn('size-4', loading ? 'animate-spin' : '')} />
					{loading ? 'Refreshing...' : 'Refresh feed'}
				</Button>
			</div>
		</main>
	);
}
