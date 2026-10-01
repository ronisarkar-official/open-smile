'use client';

import * as React from 'react';
import Link from 'next/link';
import { Compass, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { useToast } from '@/hooks/use-toast';
import {
	ExplorePost,
	ExploreHeader,
	ExploreCard,
	ExploreSkeleton,
	ExploreEmpty,
	ExploreDeleteDialog,
} from '@/components/explore';

export default function ExplorePage() {
	const { settings } = useSystemSettings();
	const { data: session } = useSession();
	const { toast } = useToast();

	const [posts, setPosts] = React.useState<ExplorePost[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [loadingMore, setLoadingMore] = React.useState(false);
	const [nextCursor, setNextCursor] = React.useState<string | null>(null);
	const [hasMore, setHasMore] = React.useState(false);
	const [postToDelete, setPostToDelete] = React.useState<ExplorePost | null>(null);
	const [isDeleting, setIsDeleting] = React.useState(false);

	const likingRef = React.useRef<Set<string>>(new Set());
	const sentinelRef = React.useRef<HTMLDivElement>(null);

	const shuffleWithMathRandom = React.useCallback((items: ExplorePost[]) => {
		const array = [...items];
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}, []);

	const fetchFeed = React.useCallback(async () => {
		if (settings.maintenance_mode || settings.explore_feed_enabled === false) {
			setPosts([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			let res = await fetch('/api/v1/explore/feed?limit=20');
			if (!res.ok) {
				res = await fetch('/api/explore/feed?limit=20');
			}
			if (res.ok) {
				const json = await res.json();
				const feedPosts: ExplorePost[] = Array.isArray(json.posts) ? json.posts : [];
				const imagePosts = feedPosts.filter((p) => Boolean(p.imageUrl));
				const postsToShow = imagePosts.length > 0 ? imagePosts : feedPosts;
				setPosts(shuffleWithMathRandom(postsToShow));
				setNextCursor(json.nextCursor || null);
				setHasMore(Boolean(json.hasMore));
			} else {
				setPosts([]);
				setNextCursor(null);
				setHasMore(false);
			}
		} catch {
			setPosts([]);
			setNextCursor(null);
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	}, [settings.maintenance_mode, settings.explore_feed_enabled, shuffleWithMathRandom]);

	const loadMore = React.useCallback(async () => {
		if (!hasMore || !nextCursor || loadingMore || loading) return;
		setLoadingMore(true);
		try {
			const endpoint = `/api/v1/explore/feed?limit=20&cursor=${encodeURIComponent(nextCursor)}`;
			let res = await fetch(endpoint);
			if (!res.ok) {
				res = await fetch(`/api/explore/feed?limit=20&cursor=${encodeURIComponent(nextCursor)}`);
			}
			if (res.ok) {
				const json = await res.json();
				const feedPosts: ExplorePost[] = Array.isArray(json.posts) ? json.posts : [];
				const imagePosts = feedPosts.filter((p) => Boolean(p.imageUrl));
				const newPosts = imagePosts.length > 0 ? imagePosts : feedPosts;
				const shuffledNew = shuffleWithMathRandom(newPosts);

				setPosts((prev) => {
					const existingIds = new Set(prev.map((p) => p.id));
					const uniqueIncoming = shuffledNew.filter((p) => !existingIds.has(p.id));
					return [...prev, ...uniqueIncoming];
				});
				setNextCursor(json.nextCursor || null);
				setHasMore(Boolean(json.hasMore));
			}
		} catch {
			// keep current state
		} finally {
			setLoadingMore(false);
		}
	}, [hasMore, nextCursor, loadingMore, loading, shuffleWithMathRandom]);

	React.useEffect(() => {
		fetchFeed();
	}, [fetchFeed]);

	React.useEffect(() => {
		if (!sentinelRef.current || !hasMore || loading) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					loadMore();
				}
			},
			{ rootMargin: '300px' }
		);
		observer.observe(sentinelRef.current);
		return () => observer.disconnect();
	}, [hasMore, loading, loadMore]);

	const handleLike = React.useCallback(async (postId: string) => {
		if (likingRef.current.has(postId)) return;
		likingRef.current.add(postId);

		let previousPost: ExplorePost | undefined;
		setPosts((prev) => {
			previousPost = prev.find((p) => p.id === postId);
			if (!previousPost) return prev;
			const wasLiked = previousPost.isLikedByMe;
			return prev.map((p) =>
				p.id === postId
					? {
							...p,
							isLikedByMe: !wasLiked,
							likes: wasLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
						}
					: p
			);
		});

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
			} else {
				throw new Error('Like request failed');
			}
		} catch {
			if (previousPost) {
				const rollback = previousPost;
				setPosts((prev) =>
					prev.map((p) =>
						p.id === postId
							? { ...p, likes: rollback.likes, isLikedByMe: rollback.isLikedByMe }
							: p
					)
				);
			}
		} finally {
			likingRef.current.delete(postId);
		}
	}, []);

	const handleDeleteConfirm = async () => {
		if (!postToDelete) return;
		setIsDeleting(true);
		try {
			const res = await fetch(`/api/explore/${postToDelete.id}`, {
				method: 'DELETE',
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || 'Failed to delete photo');
			}

			setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
			toast({
				title: 'Photo Deleted',
				description: 'Your smile photo was removed from the Explore feed.',
				variant: 'success',
			});
			setPostToDelete(null);
		} catch (err: any) {
			toast({
				title: 'Delete Failed',
				description: err?.message || 'Could not delete photo. Please try again.',
				variant: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
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
			<ExploreHeader />

			{loading && posts.length === 0 ? (
				<ExploreSkeleton count={6} />
			) : posts.length === 0 ? (
				<ExploreEmpty />
			) : (
				<>
					<section
						className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3"
						aria-label="Smile feed">
						{posts.map((post, idx) => {
							const isOwner = Boolean(
								post.isMine || (session?.user?.id && post.userId && post.userId === session.user.id)
							);
							return (
								<ExploreCard
									key={post.id}
									post={post}
									priority={idx < 3}
									isOwner={isOwner}
									onLike={handleLike}
									onDelete={setPostToDelete}
								/>
							);
						})}
					</section>

					<div ref={sentinelRef} className="h-6 w-full" />

					{loadingMore && (
						<div className="py-6 flex justify-center items-center gap-2 font-mono text-xs font-bold text-muted-foreground">
							<RefreshCw className="size-4 animate-spin text-primary" />
							<span>Loading more community smiles...</span>
						</div>
					)}
				</>
			)}

			<div className="mt-8 mb-6 flex justify-center">
				<Button
					variant="outline"
					size="lg"
					disabled={loading}
					onClick={() => fetchFeed()}
					className="gap-2 shadow-brutal cursor-pointer font-mono text-xs font-bold uppercase">
					<RefreshCw className={loading ? 'animate-spin' : ''} />
					{loading ? 'Refreshing...' : 'Refresh feed'}
				</Button>
			</div>

			<ExploreDeleteDialog
				post={postToDelete}
				isDeleting={isDeleting}
				onClose={() => setPostToDelete(null)}
				onConfirm={handleDeleteConfirm}
			/>
		</main>
	);
}
