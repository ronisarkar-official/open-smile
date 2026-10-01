import * as React from 'react';

interface ExploreSkeletonProps {
	count?: number;
}

export function ExploreSkeleton({ count = 6 }: ExploreSkeletonProps) {
	const items = Array.from({ length: count });

	return (
		<div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3" aria-label="Loading feed skeleton">
			{items.map((_, idx) => (
				<div
					key={idx}
					className="brutal-surface mb-5 break-inside-avoid bg-card border-[length:var(--border-width)] border-black rounded-xl overflow-hidden shadow-brutal animate-pulse">
					<div className="relative aspect-[4/3] bg-muted">
						<div className="absolute left-3 top-3 h-6 w-16 rounded-md bg-muted-foreground/20 border-[length:var(--border-width)] border-black/20" />
					</div>
					<div className="border-t-[length:var(--border-width)] border-black p-4 space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<div className="size-8 rounded-full bg-muted-foreground/20 border-[length:var(--border-width)] border-black/20" />
								<div className="space-y-1.5">
									<div className="h-3 w-20 bg-muted-foreground/20 rounded" />
									<div className="h-2 w-14 bg-muted-foreground/20 rounded" />
								</div>
							</div>
							<div className="h-7 w-12 rounded-md bg-muted-foreground/20 border-[length:var(--border-width)] border-black/20" />
						</div>
						<div className="h-3 w-3/4 bg-muted-foreground/20 rounded" />
					</div>
				</div>
			))}
		</div>
	);
}
