import * as React from 'react';
import { Clock, Heart, ScanFace, Smile, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ExplorePost, getImageKitTransformUrl, getImageKitSrcSet } from './types';

interface ExploreCardProps {
	post: ExplorePost;
	priority?: boolean;
	isOwner: boolean;
	isLiking?: boolean;
	onLike: (postId: string) => void;
	onDelete: (post: ExplorePost) => void;
}

export const ExploreCard = React.memo(function ExploreCard({
	post,
	priority = false,
	isOwner,
	isLiking = false,
	onLike,
	onDelete,
}: ExploreCardProps) {
	const optimizedImageUrl = post.imageUrl
		? getImageKitTransformUrl(post.imageUrl, 'w-600,h-450,fo-face,q-75')
		: '';
	const srcSet = post.imageUrl ? getImageKitSrcSet(post.imageUrl) : undefined;

	return (
		<article className="brutal-surface brutal-lift mb-5 break-inside-avoid bg-card border-[length:var(--border-width)] border-black rounded-xl overflow-hidden shadow-brutal">
			<div
				className={`${post.bg} relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted`}>
				{post.imageUrl ? (
					<img
						src={optimizedImageUrl || post.imageUrl}
						srcSet={srcSet}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						alt={`Real smile by ${post.user}`}
						className="size-full object-cover"
						loading={priority ? 'eager' : 'lazy'}
						fetchPriority={priority ? 'high' : 'auto'}
						decoding="async"
					/>
				) : (
					<div className="flex flex-col items-center justify-center p-6 text-center">
						<Smile className="size-20 opacity-30" strokeWidth={1.5} />
					</div>
				)}
				<div className="absolute left-3 top-3 flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-card px-2.5 py-1 shadow-brutal-xs">
					<ScanFace className="size-3.5" strokeWidth={2.5} />
					<span className="font-mono text-xs font-black tabular-nums">
						{post.score}
					</span>
					<span className="font-mono text-[10px] text-muted-foreground">
						/ 100
					</span>
				</div>
				{isOwner && (
					<button
						type="button"
						onClick={() => onDelete(post)}
						title="Delete your smile photo"
						aria-label="Delete your smile photo"
						className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-md border-[length:var(--border-width)] border-black bg-card/90 text-destructive shadow-brutal-xs backdrop-blur-xs transition-all hover:bg-destructive hover:text-destructive-foreground hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer">
						<Trash2 className="size-4" strokeWidth={2.5} />
					</button>
				)}
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
							<div className="flex items-center gap-1.5">
								<p className="text-sm font-black">{post.user}</p>
								{isOwner && (
									<span className="border border-black bg-primary text-primary-foreground px-1.5 py-0.2 font-mono text-[9px] font-black uppercase rounded shadow-brutal-xs">
										You
									</span>
								)}
							</div>
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
						disabled={isLiking}
						onClick={() => onLike(post.id)}
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
	);
});
