'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

export const DEFAULT_AVATAR_URL = '/icons/default-icon.webp';

function Avatar({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			className={cn(
				'relative flex size-8 shrink-0 overflow-hidden rounded-full',
				className,
			)}
			{...props}
		/>
	);
}

function AvatarImage({
	className,
	src,
	alt,
	onError,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	const [imageSrc, setImageSrc] = React.useState<string | Blob | undefined>(
		src || DEFAULT_AVATAR_URL,
	);

	React.useEffect(() => {
		setImageSrc(src || DEFAULT_AVATAR_URL);
	}, [src]);

	const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		if (imageSrc !== DEFAULT_AVATAR_URL) {
			setImageSrc(DEFAULT_AVATAR_URL);
		}
		onError?.(e);
	};

	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			src={imageSrc}
			alt={alt}
			referrerPolicy="no-referrer"
			onError={handleError}
			className={cn('aspect-square size-full object-cover', className)}
			{...props}
		/>
	);
}

function AvatarFallback({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				'bg-primary text-primary-foreground flex size-full items-center justify-center font-bold uppercase select-none',
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
