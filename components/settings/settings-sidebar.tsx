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
		<nav className="w-[230px] shrink-0 border-r-[3px] border-black bg-muted/30 overflow-y-auto py-3 hidden sm:block">
			{/* Nav groups */}
			{NAV_GROUPS.map((group, gi) => (
				<div key={group.title} className={cn(gi > 0 && 'mt-4')}>
					<p className="px-5 mb-1.5 font-mono text-[10px] font-black text-muted-foreground uppercase tracking-widest">
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
										'flex items-center gap-2.5 mx-3 px-2.5 py-1.5 text-xs uppercase tracking-wider font-bold transition-all',
										'w-[calc(100%-24px)] border-[2px]',
										isActive
											? 'border-black bg-primary text-black shadow-[2px_2px_0_#000]'
											: 'border-transparent text-foreground hover:border-black hover:bg-muted hover:shadow-[1px_1px_0_#000]',
									)}>
									<Avatar className="h-5 w-5 border border-black shrink-0">
										<AvatarImage src={userAvatar} alt={userName} />
										<AvatarFallback className="text-[9px] font-black bg-card text-black">
											{userInitials}
										</AvatarFallback>
									</Avatar>
									<span className="truncate font-black">
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
									'flex items-center gap-2.5 mx-3 px-2.5 py-1.5 text-xs uppercase tracking-wider font-bold transition-all',
									'w-[calc(100%-24px)] border-[2px]',
									isActive
										? 'border-black bg-primary text-black shadow-[2px_2px_0_#000]'
										: 'border-transparent text-foreground hover:border-black hover:bg-muted hover:shadow-[1px_1px_0_#000]',
								)}>
								<Icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
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
		<div className="sm:hidden border-b-[3px] border-black p-3 bg-muted/20">
			<select
				value={activeSection}
				onChange={(e) =>
					onSectionChange(e.target.value as SettingsSection)
				}
				className="w-full border-[2px] border-black bg-card px-3 py-2 font-mono text-xs font-bold uppercase shadow-[2px_2px_0_#000] focus:outline-none">
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
