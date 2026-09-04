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
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	const imageSrc = src || DEFAULT_AVATAR_URL;

	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			src={imageSrc}
			alt={alt}
			referrerPolicy="no-referrer"
			crossOrigin="anonymous"
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
