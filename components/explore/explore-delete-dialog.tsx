import * as React from 'react';
import { RefreshCw, ScanFace, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ExplorePost, getImageKitTransformUrl } from './types';

interface ExploreDeleteDialogProps {
	post: ExplorePost | null;
	isDeleting: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function ExploreDeleteDialog({
	post,
	isDeleting,
	onClose,
	onConfirm,
}: ExploreDeleteDialogProps) {
	return (
		<Dialog
			open={Boolean(post)}
			onOpenChange={(open) => !open && !isDeleting && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="mx-auto flex size-12 items-center justify-center rounded-xl border-[length:var(--border-width)] border-black bg-destructive/10 text-destructive shadow-brutal-xs mb-2">
						<Trash2 className="size-6" strokeWidth={2.5} />
					</div>
					<DialogTitle className="text-xl font-black font-title text-center">
						Delete Your Smile Photo?
					</DialogTitle>
					<DialogDescription className="font-mono text-xs text-center text-muted-foreground pt-1">
						This will permanently remove your picture and score from the public Explore feed and delete the uploaded image file.
					</DialogDescription>
				</DialogHeader>

				{post?.imageUrl && (
					<div className="relative mx-auto aspect-[4/3] w-48 overflow-hidden rounded-lg border-[length:var(--border-width)] border-black bg-muted shadow-brutal-xs my-2">
						<img
							src={getImageKitTransformUrl(post.imageUrl, 'w-300,h-225,fo-face,q-80') || post.imageUrl}
							alt="Preview of smile to delete"
							className="size-full object-cover"
							decoding="async"
						/>
						<div className="absolute left-2 top-2 flex items-center gap-1 border border-black rounded bg-card px-1.5 py-0.5 font-mono text-[10px] font-black shadow-brutal-xs">
							<ScanFace className="size-3" strokeWidth={2.5} />
							<span>{post.score} / 100</span>
						</div>
					</div>
				)}

				<DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2">
					<Button
						type="button"
						variant="outline"
						disabled={isDeleting}
						onClick={onClose}
						className="font-mono text-xs font-bold uppercase border-[length:var(--border-width)] border-black shadow-brutal-xs">
						Keep Photo
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={isDeleting}
						onClick={onConfirm}
						className="gap-2 font-mono text-xs font-black uppercase border-[length:var(--border-width)] border-black shadow-brutal-xs">
						{isDeleting ? (
							<>
								<RefreshCw className="size-3.5 animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="size-3.5" strokeWidth={2.5} />
								Delete Forever
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
