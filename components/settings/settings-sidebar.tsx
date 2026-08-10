'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	NAV_GROUPS,
	type SettingsSection,
} from '@/components/settings/settings-shared';

interface SettingsSidebarProps {
	activeSection: SettingsSection;
	onSectionChange: (section: SettingsSection) => void;
	userName: string;
	userAvatar: string;
	userInitials: string;
}

export function SettingsSidebar({
	activeSection,
	onSectionChange,
	userName,
	userAvatar,
	userInitials,
}: SettingsSidebarProps) {
	return (
		<nav className="w-[220px] shrink-0 border-r border-border bg-muted/30 overflow-y-auto py-3 hidden sm:block">
			{/* Nav groups */}
			{NAV_GROUPS.map((group, gi) => (
				<div key={group.title} className={cn(gi > 0 && 'mt-3')}>
					<p className="px-5 mb-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
						{group.title}
					</p>
					{group.items.map((item) => {
						const Icon = item.icon;
						const isActive = activeSection === item.id;

						if (item.id === 'profile') {
							return (
								<button
									key={item.id}
									onClick={() => onSectionChange('profile')}
									className={cn(
										'flex items-center gap-2.5 rounded-md mx-3 px-2.5 py-1.5 text-sm transition-colors',
										'w-[calc(100%-24px)]',
										isActive
											? 'bg-primary/10 text-foreground font-medium'
											: 'text-foreground hover:bg-muted',
									)}>
									<Avatar className="h-5 w-5 rounded-md">
										<AvatarImage src={userAvatar} alt={userName} />
										<AvatarFallback className="rounded-md text-[10px] bg-primary text-primary-foreground">
											{userInitials}
										</AvatarFallback>
									</Avatar>
									<span className="truncate font-medium">
										{userName.toUpperCase()}
									</span>
								</button>
							);
						}

						return (
							<button
								key={item.id}
								onClick={() => onSectionChange(item.id)}
								className={cn(
									'flex items-center gap-2.5 rounded-md mx-3 px-2.5 py-1.5 text-sm transition-colors',
									'w-[calc(100%-24px)]',
									isActive
										? 'bg-primary/10 text-foreground font-medium'
										: 'text-muted-foreground hover:bg-muted hover:text-foreground',
								)}>
								<Icon className="h-4 w-4 shrink-0" />
								<span className="truncate">{item.label}</span>
							</button>
						);
					})}
				</div>
			))}
		</nav>
	);
}

/** Dropdown fallback for mobile screens */
export function SettingsMobileNav({
	activeSection,
	onSectionChange,
}: {
	activeSection: SettingsSection;
	onSectionChange: (section: SettingsSection) => void;
}) {
	return (
		<div className="sm:hidden border-b border-border p-3">
			<select
				value={activeSection}
				onChange={(e) =>
					onSectionChange(e.target.value as SettingsSection)
				}
				className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
				{NAV_GROUPS.flatMap((g) =>
					g.items.map((item) => (
						<option key={item.id} value={item.id}>
							{item.label}
						</option>
					)),
				)}
			</select>
		</div>
	);
}
