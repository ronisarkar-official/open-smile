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
			<h2 className="text-2xl font-bold text-foreground">Preferences</h2>
			<p className="text-sm text-muted-foreground mt-1">
				Customize your app experience and user interface
			</p>

			{/* Appearance Group */}
			<div className="mt-8">
				<h3 className="text-sm font-semibold text-foreground tracking-wide">
					Appearance
				</h3>
				<div className="border-t border-border mt-3" />

				<div className="flex items-center justify-between py-4">
					<div className="flex-1 min-w-0 mr-4">
						<p className="text-sm font-medium text-foreground">Theme</p>
						<p className="text-xs text-muted-foreground mt-0.5">
							Choose a theme for this device
						</p>
					</div>

					{/* Notion-styled theme selector dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="flex w-36 items-center justify-between rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 focus:outline-none transition-colors cursor-pointer select-none">
								<span>
									{theme === 'light'
										? 'Light'
										: theme === 'dark'
										? 'Dark'
										: 'Use system setting'}
								</span>
								<ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-fit rounded-md min-w-[9rem]">
							<DropdownMenuItem onClick={() => setTheme('light')}>
								Light
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>
								Dark
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('system')}>
								Use system setting
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
