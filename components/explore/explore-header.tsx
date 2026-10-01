import * as React from 'react';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ExploreHeader() {
	return (
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
	);
}
