'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { SettingsRow, ActionButton } from '@/components/settings/settings-shared';

export function PreferencesContent() {
	const { theme, setTheme } = useTheme();

	return (
		<div>
			<h2 className="text-2xl font-black font-title text-foreground">Preferences</h2>
			<p className="text-sm text-muted-foreground mt-1">
				Customize your app experience and user interface
			</p>

			<div className="mt-8">
				<h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
					Appearance
				</h3>
				<div className="border-t border-border mt-3" />

				<div className="flex items-center justify-between py-4">
					<div className="flex-1 min-w-0 mr-4">
						<p className="text-sm font-bold text-foreground font-title">Theme</p>
						<p className="text-xs text-muted-foreground mt-0.5">
							Choose a theme for this device
						</p>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="flex w-40 items-center justify-between border-[2px] border-black bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_#000] brutal-lift cursor-pointer select-none">
								<span className="font-mono text-xs">
									{theme === 'light'
										? 'Light'
										: theme === 'dark'
										? 'Dark'
										: 'Use system setting'}
								</span>
								<ChevronDown className="h-3.5 w-3.5 text-foreground" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-40 border-[2px] border-black bg-card shadow-[4px_4px_0_#000] p-1">
							<DropdownMenuItem
								className="font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20"
								onClick={() => setTheme('light')}>
								Light
							</DropdownMenuItem>
							<DropdownMenuItem
								className="font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20"
								onClick={() => setTheme('dark')}>
								Dark
							</DropdownMenuItem>
							<DropdownMenuItem
								className="font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20"
								onClick={() => setTheme('system')}>
								System
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
