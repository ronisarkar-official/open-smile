import * as React from 'react';
import Link from 'next/link';
import { Camera, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ExploreEmpty() {
	return (
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
	);
}
