import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Info, XOctagon, X } from 'lucide-react';

const alertToastVariants = cva(
	'brutal-surface relative flex w-full max-w-sm items-start gap-4 overflow-hidden p-4 text-black',
	{
		variants: {
			variant: {
				success: '',
				warning: '',
				info: '',
				error: '',
			},
			styleVariant: {
				default: '',
				filled: '',
			},
		},
		compoundVariants: [
			{
				variant: 'success',
				styleVariant: 'default',
				className: 'bg-success text-success-foreground',
			},
			{
				variant: 'warning',
				styleVariant: 'default',
				className: 'bg-warning text-warning-foreground',
			},
			{
				variant: 'info',
				styleVariant: 'default',
				className: 'bg-info text-info-foreground',
			},
			{
				variant: 'error',
				styleVariant: 'default',
				className: 'bg-destructive text-destructive-foreground',
			},
			{
				variant: 'success',
				styleVariant: 'filled',
				className: 'bg-success text-success-foreground',
			},
			{
				variant: 'warning',
				styleVariant: 'filled',
				className: 'bg-warning text-warning-foreground',
			},
			{
				variant: 'info',
				styleVariant: 'filled',
				className: 'bg-info text-info-foreground',
			},
			{
				variant: 'error',
				styleVariant: 'filled',
				className: 'bg-destructive text-destructive-foreground',
			},
		],
		defaultVariants: {
			variant: 'info',
			styleVariant: 'default',
		},
	},
);

const iconMap = {
	success: CheckCircle2,
	warning: AlertTriangle,
	info: Info,
	error: XOctagon,
};

const iconColorClasses: Record<string, Record<string, string>> = {
	default: {
		success: 'text-black',
		warning: 'text-black',
		info: 'text-black',
		error: 'text-black',
	},
	filled: {
		success: 'text-black',
		warning: 'text-black',
		info: 'text-black',
		error: 'text-black',
	},
};

export interface AlertToastProps
	extends
		Omit<HTMLMotionProps<'div'>, 'title'>,
		VariantProps<typeof alertToastVariants> {
	title: string;
	description: string;
	onClose: () => void;
}

const AlertToast = React.forwardRef<HTMLDivElement, AlertToastProps>(
	(
		{
			className,
			variant = 'info',
			styleVariant = 'default',
			title,
			description,
			onClose,
			...props
		},
		ref,
	) => {
		const Icon = iconMap[variant!];
		const reducedMotion = useReducedMotion();

		return (
			<motion.div
				ref={ref}
				role="alert"
				layout
				initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.25, filter: 'blur(4px)' }}
				animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
				exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
				transition={{
					type: 'spring',
					duration: 0.3,
					bounce: 0,
				}}
				className={cn(alertToastVariants({ variant, styleVariant }), className)}
				{...props}>
				<div className="flex-shrink-0">
					<Icon
						className={cn('h-6 w-6', iconColorClasses[styleVariant!][variant!])}
						aria-hidden="true"
					/>
				</div>

				<div className="flex-1">
					<p className="text-sm font-semibold">{title}</p>
					<p className="text-sm opacity-90">{description}</p>
				</div>

				<div className="flex-shrink-0">
					<button
						onClick={onClose}
						aria-label="Close"
						className={cn(
							'flex size-11 items-center justify-center border-[length:var(--border-width)] border-current rounded-md opacity-100 transition-[background-color,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 focus:outline-none focus:ring-[3px] focus:ring-black focus:ring-offset-2',
							styleVariant === 'default' ?
								'text-black hover:bg-black/10'
							:	'hover:bg-black/20',
						)}>
						<X className="h-5 w-5" />
					</button>
				</div>
			</motion.div>
		);
	},
);

AlertToast.displayName = 'AlertToast';

export { AlertToast, alertToastVariants };
