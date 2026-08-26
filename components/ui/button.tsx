import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	"group/button relative inline-flex shrink-0 items-center justify-center border-[length:var(--border-width)] border-border bg-clip-padding rounded-lg text-sm font-bold whitespace-nowrap uppercase tracking-wide outline-none select-none brutal-lift disabled:pointer-events-none disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground brutal-shadow',
				secondary: 'bg-secondary text-secondary-foreground brutal-shadow',
				accent: 'bg-accent text-accent-foreground brutal-shadow',
				destructive: 'bg-destructive text-destructive-foreground brutal-shadow',
				success: 'bg-success text-success-foreground brutal-shadow',
				outline: 'bg-card text-card-foreground brutal-shadow hover:bg-muted',
				ghost:
					'border-transparent shadow-none hover:border-border hover:bg-muted',
				link: 'border-transparent shadow-none text-primary-foreground underline underline-offset-4 decoration-2 hover:no-underline normal-case font-medium hover:translate-x-0 hover:translate-y-0',
			},
			size: {
				default:
					'h-11 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
				xs: "h-8 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-9 gap-1 px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				lg: 'h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
				icon: 'size-11',
				'icon-xs': "size-8 [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': 'size-9',
				'icon-lg': 'size-12',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
