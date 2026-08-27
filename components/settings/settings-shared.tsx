// Shared types, constants, and reusable primitives for the settings dialog

import * as React from 'react';
import { cn } from '@/lib/utils';
import { User, SlidersHorizontal, Bell } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SettingsSection = 'profile' | 'preferences' | 'notifications';

export interface NavItem {
	id: SettingsSection;
	label: string;
	icon: React.ElementType;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------

export const NAV_GROUPS: NavGroup[] = [
	{
		title: 'Account',
		items: [
			{ id: 'profile', label: 'Profile & Security', icon: User },
			{ id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
			{ id: 'notifications', label: 'Notifications', icon: Bell },
		],
	},
];

// ---------------------------------------------------------------------------
// Section metadata
// ---------------------------------------------------------------------------

export const SECTION_META: Record<
	SettingsSection,
	{ title: string; description: string }
> = {
	profile: {
		title: 'Profile & Security',
		description: 'Manage your profile, login information, and active sessions',
	},
	preferences: {
		title: 'Preferences',
		description: 'Customize your theme and display appearance',
	},
	notifications: {
		title: 'Notifications',
		description: 'Configure security and email notification preferences',
	},
};

// ---------------------------------------------------------------------------
// Reusable primitives
// ---------------------------------------------------------------------------

export function SettingsRow({
	label,
	description,
	action,
	className,
}: {
	label: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'flex items-center justify-between py-3.5',
				className,
			)}>
			<div className="flex-1 min-w-0 mr-4">
				<p className="text-sm font-bold text-foreground font-title">{label}</p>
				{description && (
					<p className="text-xs text-muted-foreground mt-0.5">
						{description}
					</p>
				)}
			</div>
			{action && <div className="flex-shrink-0">{action}</div>}
		</div>
	);
}

export function ActionButton({
	children,
	variant = 'default',
	onClick,
	className,
}: {
	children: React.ReactNode;
	variant?: 'default' | 'primary' | 'destructive';
	onClick?: () => void;
	className?: string;
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				'px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border-[length:var(--border-width)] rounded-md transition-all whitespace-nowrap cursor-pointer brutal-lift',
				variant === 'default' &&
					'border-black bg-card text-foreground shadow-brutal-sm hover:bg-muted',
				variant === 'primary' &&
					'border-black bg-primary text-primary-foreground shadow-brutal-sm hover:bg-primary/90',
				variant === 'destructive' &&
					'border-black bg-destructive/10 text-destructive shadow-brutal-sm hover:bg-destructive/20',
				className
			)}>
			{children}
		</button>
	);
}

export function Toggle({
	checked = false,
	onChange,
}: {
	checked?: boolean;
	onChange?: (val: boolean) => void;
	className?: string;
}) {
	return (
		<button
			role="switch"
			aria-checked={checked}
			onClick={() => onChange?.(!checked)}
			className={cn(
				'relative inline-flex h-5 w-9 items-center border-[length:var(--border-width)] border-black rounded-md transition-colors cursor-pointer',
				checked ? 'bg-primary' : 'bg-muted',
			)}>
			<span
				className={cn(
					'inline-block h-3 w-3 bg-black rounded-sm transition-transform',
					checked ? 'translate-x-4' : 'translate-x-0.5',
				)}
			/>
		</button>
	);
}
