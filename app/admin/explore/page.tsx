"use client";

import * as React from "react";
import Image from "next/image";
import {
	Compass,
	Trash2,
	RefreshCw,
	CheckCircle2,
	AlertTriangle,
	Heart,
	Sparkles,
	ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminExplorePage() {
	const { toast } = useToast();
	const [posts, setPosts] = React.useState<any[]>([]);
	const [total, setTotal] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [page, setPage] = React.useState(0);
	const pageSize = 12;

	const [deletingId, setDeletingId] = React.useState<string | null>(null);

	async function fetchPosts() {
		setLoading(true);
		try {
			const res = await fetch(`/api/admin/explore?limit=${pageSize}&offset=${page * pageSize}`);
			const json = await res.json();
			if (res.ok) {
				setPosts(json.posts || []);
				setTotal(json.total || 0);
			}
		} catch {
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		fetchPosts();
	}, [page]);

	async function handleDeletePost(postId: string) {
		if (!confirm("Are you sure you want to delete this public post? This cannot be undone.")) return;

		setDeletingId(postId);
		try {
			const res = await fetch(`/api/admin/explore/${postId}`, {
				method: "DELETE",
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to delete post");

			toast({
				title: "Post Purged",
				description: "Post was removed from public explore feed.",
				variant: "success",
			});
			fetchPosts();
		} catch (err: any) {
			toast({ title: "Delete Failed", description: err.message, variant: "error" });
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						Explore Feed Moderation
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Moderate public community smile posts, remove inappropriate uploads, and monitor feed health
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						onClick={fetchPosts}
						disabled={loading}
						className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-10 px-4"
					>
						<RefreshCw className={cn("size-3.5 mr-2", loading && "animate-spin")} />
						Refresh
					</Button>
				</div>
			</div>

			{loading && posts.length === 0 ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-12 text-center font-mono text-xs font-bold text-muted-foreground shadow-brutal">
					Loading explore posts...
				</div>
			) : posts.length === 0 ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-12 text-center font-mono text-xs font-bold text-muted-foreground shadow-brutal">
					No public explore posts available.
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
					{posts.map((post) => (
						<div
							key={post.id}
							className="border-[length:var(--border-width)] border-black rounded-xl bg-card overflow-hidden shadow-brutal flex flex-col justify-between"
						>
							<div className="relative aspect-square w-full bg-muted border-b-[length:var(--border-width)] border-black">
								<img
									src={post.image_url}
									alt="Explore post"
									className="object-cover w-full h-full"
									loading="lazy"
								/>
								<div className="absolute top-2 left-2 border border-black rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] font-black text-black shadow-brutal-xs">
									{post.smile_score}% Smile
								</div>
								<div className="absolute bottom-2 right-2 border border-black rounded-md bg-card/90 px-2 py-0.5 font-mono text-[10px] font-bold text-foreground flex items-center gap-1 shadow-brutal-xs">
									<Heart className="size-3 text-destructive fill-destructive" />
									{post.likes_count || 0}
								</div>
							</div>

							<div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
								<div className="space-y-1">
									<div className="font-mono text-xs font-bold text-foreground truncate">
										{post.user_name || "Smiler"}
									</div>
									<div className="font-mono text-[10px] text-muted-foreground truncate">
										{post.user_email}
									</div>
									{post.caption ? (
										<p className="text-xs text-foreground font-medium line-clamp-2 pt-1 italic">
											"{post.caption}"
										</p>
									) : null}
								</div>

								<div className="pt-2 border-t border-black/10 flex items-center justify-between">
									<span className="font-mono text-[10px] text-muted-foreground">
										{new Date(post.created_at).toLocaleDateString()}
									</span>

									<Button
										onClick={() => handleDeletePost(post.id)}
										disabled={deletingId === post.id}
										className="border border-black bg-destructive/15 hover:bg-destructive/30 text-destructive font-mono text-[11px] font-bold h-8 px-2.5 shadow-brutal-xs"
										title="Delete post"
									>
										<Trash2 className="size-3 mr-1" />
										{deletingId === post.id ? "Purging..." : "Purge"}
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="p-4 border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal flex items-center justify-between font-mono text-xs font-bold text-muted-foreground">
				<span>
					Showing {posts.length > 0 ? page * pageSize + 1 : 0} – {Math.min((page + 1) * pageSize, total)} of {total} posts
				</span>
				<div className="flex items-center gap-2">
					<Button
						onClick={() => setPage((p) => Math.max(0, p - 1))}
						disabled={page === 0}
						className="h-8 px-3 border border-black rounded-md bg-card text-foreground font-mono text-xs font-bold shadow-brutal-xs"
					>
						Prev
					</Button>
					<Button
						onClick={() => setPage((p) => p + 1)}
						disabled={(page + 1) * pageSize >= total}
						className="h-8 px-3 border border-black rounded-md bg-card text-foreground font-mono text-xs font-bold shadow-brutal-xs"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
