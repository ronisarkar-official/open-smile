// Shared types, constants, and reusable primitives for the settings dialog

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
	User,
	SlidersHorizontal,
	Bell,
	Mail,
	Settings,
	Users,
	Import,
	Sparkles,
	Link2,
	Globe,
	Smile,
	WifiOff,
	Building2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SettingsSection =
	| 'profile'
	| 'preferences'
	| 'notifications'
	| 'mail'
	| 'general'
	| 'people'
	| 'import'
	| 'ai'
	| 'connections'
	| 'public-pages'
	| 'emoji'
	| 'offline'
	| 'teamspaces';

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
			{ id: 'profile', label: 'Profile', icon: User },
			{ id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
			{ id: 'notifications', label: 'Notifications', icon: Bell },
			{ id: 'mail', label: 'Mail & Calendar', icon: Mail },
		],
	},
	{
		title: 'Workspace',
		items: [
			{ id: 'general', label: 'General', icon: Settings },
			{ id: 'people', label: 'People', icon: Users },
			{ id: 'import', label: 'Import', icon: Import },
		],
	},
	{
		title: 'Features',
		items: [
			{ id: 'ai', label: 'AI', icon: Sparkles },
			{ id: 'connections', label: 'Connections', icon: Link2 },
			{ id: 'public-pages', label: 'Public pages', icon: Globe },
			{ id: 'emoji', label: 'Emoji', icon: Smile },
			{ id: 'offline', label: 'Offline', icon: WifiOff },
		],
	},
	{
		title: 'Admin',
		items: [{ id: 'teamspaces', label: 'Teamspaces', icon: Building2 }],
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
		title: 'Profile',
		description: 'Manage your profile, login information, and devices',
	},
	preferences: {
		title: 'Preferences',
		description: 'Customize your app experience',
	},
	notifications: {
		title: 'Notifications',
		description: 'Manage how you receive notifications',
	},
	mail: {
		title: 'Mail & Calendar',
		description: 'Configure mail and calendar integrations',
	},
	general: {
		title: 'General',
		description: 'Manage workspace settings',
	},
	people: {
		title: 'People',
		description: 'Manage members and permissions',
	},
	import: {
		title: 'Import',
		description: 'Import data from other tools',
	},
	ai: {
		title: 'AI',
		description: 'Configure AI features and usage',
	},
	connections: {
		title: 'Connections',
		description: 'Manage connected apps and integrations',
	},
	'public-pages': {
		title: 'Public pages',
		description: 'Manage publicly shared pages',
	},
	emoji: {
		title: 'Emoji',
		description: 'Customize emoji preferences',
	},
	offline: {
		title: 'Offline',
		description: 'Configure offline access settings',
	},
	teamspaces: {
		title: 'Teamspaces',
		description: 'Manage team spaces and permissions',
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
				'px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border-[2px] transition-all whitespace-nowrap cursor-pointer brutal-lift',
				variant === 'default' &&
					'border-black bg-card text-foreground shadow-[2px_2px_0_#000] hover:bg-muted',
				variant === 'primary' &&
					'border-black bg-primary text-black shadow-[2px_2px_0_#000] hover:bg-primary/90',
				variant === 'destructive' &&
					'border-black bg-destructive/10 text-destructive shadow-[2px_2px_0_#000] hover:bg-destructive/20',
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
}) {
	return (
		<button
			role="switch"
			aria-checked={checked}
			onClick={() => onChange?.(!checked)}
			className={cn(
				'relative inline-flex h-5 w-9 items-center border-[2px] border-black transition-colors cursor-pointer',
				checked ? 'bg-primary' : 'bg-muted',
			)}>
			<span
				className={cn(
					'inline-block h-3 w-3 bg-black transition-transform',
					checked ? 'translate-x-4' : 'translate-x-0.5',
				)}
			/>
		</button>
	);
}
