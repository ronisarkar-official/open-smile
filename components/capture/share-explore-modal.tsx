'use client';

import * as React from 'react';
import { Share2, Sparkles, Coins, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShareExploreModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageSrc: string | null;
	score: number;
	isSharing: boolean;
	onShare: (title?: string) => void | Promise<void>;
}

export function ShareExploreModal({
	isOpen,
	onClose,
	imageSrc,
	score,
	isSharing,
	onShare,
}: ShareExploreModalProps) {
	const [title, setTitle] = React.useState('');

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSharing) return;
		await onShare(title.trim() || undefined);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isSharing && onClose()}>
			<DialogContent className="w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 border-[length:var(--border-width)] border-border rounded-xl bg-card shadow-brutal-lg">
				<DialogHeader className="text-left space-y-1">
					<div className="flex items-center gap-2.5">
						<div className="flex size-8 shrink-0 items-center justify-center rounded-md border-[length:var(--border-width)] border-border bg-accent text-accent-foreground shadow-brutal-xs">
							<Share2 className="size-4" strokeWidth={2.5} />
						</div>
						<DialogTitle className="font-title text-lg sm:text-xl font-black tracking-tight text-foreground">
							Share to Explore Feed
						</DialogTitle>
					</div>
					<p className="font-mono text-xs text-muted-foreground">
						Post your smile to the public 24-hour community feed.
					</p>
				</DialogHeader>

				<form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
					<div className="relative w-full aspect-[4/3] max-h-52 sm:max-h-60 overflow-hidden rounded-lg border-[length:var(--border-width)] border-border bg-muted shadow-brutal-xs">
						{imageSrc ? (
							<>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={imageSrc}
									alt="Your smile capture"
									className="size-full object-cover"
								/>
								<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
								<div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md border-[length:var(--border-width-sm)] border-border bg-accent px-2 py-0.5 font-mono text-[10px] font-black uppercase shadow-brutal-xs">
									<ShieldCheck className="size-3" strokeWidth={3} />
									VERIFIED
								</div>
								<div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-md border-[length:var(--border-width-sm)] border-border bg-card/95 px-2.5 py-1 font-mono text-xs font-black shadow-brutal-xs">
									<Sparkles className="size-3 text-primary" />
									<span>{score}/100</span>
								</div>
							</>
						) : (
							<div className="flex size-full items-center justify-center font-mono text-xs text-muted-foreground">
								No image captured
							</div>
						)}
					</div>

					<div className="space-y-1.5 text-left">
						<div className="flex items-center justify-between">
							<label
								htmlFor="post-title"
								className="font-mono text-[11px] font-black uppercase tracking-wider text-foreground">
								Post Title / Caption (Optional)
							</label>
							<span className="font-mono text-[10px] text-muted-foreground">
								{title.length}/100
							</span>
						</div>
						<Input
							id="post-title"
							type="text"
							value={title}
							maxLength={100}
							onChange={(e) => setTitle(e.target.value)}
							disabled={isSharing}
							placeholder="e.g. Sunshine and big smiles today! 😄"
							className="font-mono text-xs"
						/>
					</div>

					<div className="space-y-2 rounded-lg border-[length:var(--border-width-sm)] border-border bg-warning/15 p-3 shadow-brutal-xs">
						<div className="flex items-start gap-2">
							<Coins className="size-4 shrink-0 text-warning mt-0.5" strokeWidth={2.5} />
							<div className="space-y-0.5 text-left">
								<p className="font-mono text-xs font-black text-foreground">
									+5 Bonus Coins Reward
								</p>
								<p className="font-mono text-[11px] text-muted-foreground leading-tight">
									First community share of the day earns 5 bonus coins directly into your ledger.
								</p>
							</div>
						</div>
						<div className="flex items-center gap-1.5 border-t border-border/20 pt-2 font-mono text-[10px] font-bold text-muted-foreground">
							<Clock className="size-3 text-muted-foreground" />
							<span>Auto-deletes from feed & storage after 24 hours.</span>
						</div>
					</div>

					<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSharing}
							className="border-[length:var(--border-width)] border-border font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-xs brutal-lift">
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSharing}
							className="gap-2 border-[length:var(--border-width)] border-border bg-primary text-primary-foreground font-mono text-xs font-black uppercase tracking-wider shadow-brutal brutal-lift hover:bg-primary/90">
							{isSharing ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Sharing...
								</>
							) : (
								<>
									<Share2 className="size-4" />
									Share to Feed
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
