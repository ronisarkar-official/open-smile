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
	const cursorRef = React.useRef<string | null>(null);
	const hasMoreRef = React.useRef(false);
	const loadingMoreRef = React.useRef(false);

	cursorRef.current = nextCursor;
	hasMoreRef.current = hasMore;

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
			let res = await fetch('/api/explore/feed?limit=20');
			if (!res.ok) {
				res = await fetch('/api/v1/explore/feed?limit=20');
			}
			if (res.ok) {
				const json = await res.json();
				const feedPosts: ExplorePost[] = Array.isArray(json.posts) ? json.posts : [];
				const imagePosts = feedPosts.filter((p) => Boolean(p.imageUrl));
				const postsToShow = imagePosts.length > 0 ? imagePosts : feedPosts;
				setPosts(shuffleWithMathRandom(postsToShow));
				const nextC = json.nextCursor || null;
				const more = Boolean(json.hasMore) && Boolean(nextC);
				setNextCursor(nextC);
				cursorRef.current = nextC;
				setHasMore(more);
				hasMoreRef.current = more;
			} else {
				setPosts([]);
				setNextCursor(null);
				cursorRef.current = null;
				setHasMore(false);
				hasMoreRef.current = false;
			}
		} catch {
			setPosts([]);
			setNextCursor(null);
			cursorRef.current = null;
			setHasMore(false);
			hasMoreRef.current = false;
		} finally {
			setLoading(false);
		}
	}, [settings.maintenance_mode, settings.explore_feed_enabled, shuffleWithMathRandom]);

	const loadMore = React.useCallback(async () => {
		const cursor = cursorRef.current;
		if (!hasMoreRef.current || !cursor || loadingMoreRef.current || loading) return;

		loadingMoreRef.current = true;
		setLoadingMore(true);

		try {
			const endpoint = `/api/explore/feed?limit=20&cursor=${encodeURIComponent(cursor)}`;
			let res = await fetch(endpoint);
			if (!res.ok) {
				res = await fetch(`/api/v1/explore/feed?limit=20&cursor=${encodeURIComponent(cursor)}`);
			}
			if (res.ok) {
				const json = await res.json();
				const feedPosts: ExplorePost[] = Array.isArray(json.posts) ? json.posts : [];
				const imagePosts = feedPosts.filter((p) => Boolean(p.imageUrl));
				const newPosts = imagePosts.length > 0 ? imagePosts : feedPosts;

				if (newPosts.length === 0) {
					setHasMore(false);
					hasMoreRef.current = false;
					setNextCursor(null);
					cursorRef.current = null;
					return;
				}

				const shuffledNew = shuffleWithMathRandom(newPosts);
				let addedCount = 0;

				setPosts((prev) => {
					const existingIds = new Set(prev.map((p) => p.id));
					const uniqueIncoming = shuffledNew.filter((p) => !existingIds.has(p.id));
					addedCount = uniqueIncoming.length;
					if (addedCount === 0) return prev;
					return [...prev, ...uniqueIncoming];
				});

				const nextC = json.nextCursor || null;
				if (!nextC || nextC === cursor || addedCount === 0 || !json.hasMore) {
					setHasMore(false);
					hasMoreRef.current = false;
					setNextCursor(null);
					cursorRef.current = null;
				} else {
					setNextCursor(nextC);
					cursorRef.current = nextC;
					setHasMore(Boolean(json.hasMore));
					hasMoreRef.current = Boolean(json.hasMore);
				}
			} else {
				setHasMore(false);
				hasMoreRef.current = false;
			}
		} catch {
			setHasMore(false);
			hasMoreRef.current = false;
		} finally {
			loadingMoreRef.current = false;
			setLoadingMore(false);
		}
	}, [loading, shuffleWithMathRandom]);

	React.useEffect(() => {
		fetchFeed();
	}, [fetchFeed]);

	React.useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasMoreRef.current && !loadingMoreRef.current && !loading) {
					loadMore();
				}
			},
			{ rootMargin: '200px' }
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [loadMore, loading]);

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

					<div ref={sentinelRef} className="w-full py-4 flex flex-col items-center justify-center min-h-[64px]">
						{loadingMore ? (
							<div className="flex justify-center items-center gap-2 font-mono text-xs font-bold text-muted-foreground">
								<RefreshCw className="size-4 animate-spin text-primary" />
								<span>Loading more community smiles...</span>
							</div>
						) : !hasMore && posts.length > 0 ? (
							<p className="font-mono text-xs font-bold text-muted-foreground">
								✨ You&apos;ve reached the end of the feed!
							</p>
						) : null}
					</div>
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
