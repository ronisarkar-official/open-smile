'use client';

import * as React from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/animate-ui/components/radix/sidebar';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
	Bell,
	Camera,
	ChevronsUpDown,
	Coins,
	Compass,
	Flame,
	Gift,
	LayoutDashboard,
	LogOut,
	Smile,
	Settings,
	Sparkles,
	Trophy,
	UserPlus,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SettingsDialog } from '@/components/settings/dialog';
import type { SettingsSection } from '@/components/settings/settings-shared';
import { cn } from '@/lib/utils';
import { CoinIcon } from '@/components/ui/coin-icon';

const mainNav = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Capture',
		url: '/capture',
		icon: Camera,
	},
	{
		title: 'Leaderboard',
		url: '/leaderboard',
		icon: Trophy,
	},
	{
		title: 'Explore',
		url: '/explore',
		icon: Compass,
	},
	{
		title: 'Rewards',
		url: '/rewards',
		icon: Gift,
	},
	{
		title: 'Refer',
		url: '/refer',
		icon: UserPlus,
	},
];

const secondaryNav = [
	{
		title: 'Settings',
		url: '/dashboard/settings',
		icon: Settings,
	},
];

const mobileTabs = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
		kind: 'link' as const,
	},
	{
		title: 'Capture',
		url: '/capture',
		icon: Camera,
		kind: 'link' as const,
	},
	{
		title: 'Board',
		url: '/leaderboard',
		icon: Trophy,
		kind: 'link' as const,
	},
	{
		title: 'Explore',
		url: '/explore',
		icon: Compass,
		kind: 'link' as const,
	},
	{
		title: 'Settings',
		url: '/dashboard/settings',
		icon: Settings,
		kind: 'link' as const,
	},
];

export const DashboardSidebar = ({
	children,
}: {
	children?: React.ReactNode;
}) => {
	const { data: session } = useSession();
	const pathname = usePathname();
	const [settingsOpen, setSettingsOpen] = React.useState(false);
	const [settingsSection, setSettingsSection] =
		React.useState<SettingsSection>('profile');
	const [avatarOverride, setAvatarOverride] = React.useState<string | null>(
		null,
	);

	const openSettings = (section: SettingsSection = 'profile') => {
		setSettingsSection(section);
		setSettingsOpen(true);
	};

	const user = session?.user;
	const userName = user?.name ?? 'User';
	const userEmail = user?.email ?? '';
	const userAvatar = avatarOverride ?? user?.image ?? '';
	const userInitials =
		userName
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'U';

	const isActive = (url: string) => pathname === url;

	const navItems = [...mainNav, ...secondaryNav];
	const currentPage = navItems.find((item) => isActive(item.url));

	const UserMenu = ({ className }: { className?: string }) => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={cn(
						'flex items-center gap-2 border-[2px] border-black bg-card px-2 py-1.5 text-left shadow-[2px_2px_0_#000] brutal-lift cursor-pointer outline-none focus-visible:outline-3 focus-visible:outline-ring',
						className,
					)}
					aria-label="Open account menu">
					<Avatar className="h-7 w-7 border border-black">
						<AvatarImage
							src={userAvatar}
							alt={userName}
						/>
						<AvatarFallback className="bg-primary text-black font-bold text-xs">
							{userInitials}
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-60 border-[3px] border-black bg-card shadow-[5px_5px_0_#000] p-1"
				side="bottom"
				align="end"
				sideOffset={8}>
				<DropdownMenuLabel className="p-2 font-normal border-b-[2px] border-black bg-muted/40">
					<div className="flex items-center gap-2.5 text-left">
						<Avatar className="h-8 w-8 border-[2px] border-black shrink-0">
							<AvatarImage
								src={userAvatar}
								alt={userName}
							/>
							<AvatarFallback className="bg-primary font-black text-xs">
								{userInitials}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left leading-tight min-w-0">
							<span className="truncate font-black text-sm">{userName}</span>
							<span className="truncate text-xs font-mono text-muted-foreground">{userEmail}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuGroup className="p-1">
					<DropdownMenuItem
						onClick={() => openSettings('profile')}
						className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20 focus:bg-primary/20">
						<Settings className="size-4" strokeWidth={2.5} />
						Settings
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => openSettings('notifications')}
						className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-accent/20 focus:bg-accent/20">
						<Bell className="size-4" strokeWidth={2.5} />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="bg-black h-[2px]" />
				<DropdownMenuItem
					className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
					onClick={() =>
						signOut({
							fetchOptions: {
								onSuccess: () => {
									window.location.href = '/';
								},
							},
						})
					}>
					<LogOut className="size-4" strokeWidth={2.5} />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<>
			<SidebarProvider>
				<Sidebar
					collapsible="icon"
					className="hidden md:flex border-r-[3px] border-black bg-sidebar">
					<SidebarHeader className="border-b-[3px] border-black p-3">
						<SidebarMenu>
							<SidebarMenuItem>
								<Link href="/dashboard">
									<SidebarMenuButton
										size="lg"
										className="group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! hover:bg-primary/10">
										<div className="flex aspect-square size-9 items-center justify-center border-[3px] border-black bg-primary text-black shadow-[2px_2px_0_#000] shrink-0">
											<Smile className="m-auto size-5" strokeWidth={2.5} />
										</div>
										<div className="grid flex-1 text-left leading-tight ml-1">
											<span className="truncate font-black tracking-tight text-base font-title">
												OPEN SMILE
											</span>
											<span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
												Daily AI Rewards
											</span>
										</div>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>

					<SidebarContent className="p-2 gap-4">
						<div className="px-1 pt-1 group-data-[collapsible=icon]:hidden">
							<Link
								href="/capture"
								className="flex items-center justify-center gap-2 border-[3px] border-black bg-primary px-3 py-2.5 font-title font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0_#000] brutal-lift hover:bg-primary/90">
								<Camera className="size-4" strokeWidth={2.5} />
								<span>Capture Smile</span>
							</Link>
						</div>

						<SidebarGroup>
							<SidebarGroupLabel className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-foreground/70 px-2">
								Menu
							</SidebarGroupLabel>
							<SidebarMenu className="gap-1.5">
								{mainNav.map((item) => {
									const active = isActive(item.url);
									return (
										<SidebarMenuItem key={item.title}>
											<Link href={item.url}>
												<SidebarMenuButton
													tooltip={item.title}
													isActive={active}
													className={cn(
														'border-[2px] transition-all font-title font-bold text-sm tracking-tight',
														active
															? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
															: 'border-transparent text-foreground hover:border-black hover:bg-muted/70 hover:shadow-[2px_2px_0_#000]',
													)}>
													<item.icon className="size-4" strokeWidth={active ? 2.5 : 2} />
													<span className="font-bold">{item.title}</span>
												</SidebarMenuButton>
											</Link>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroup>

						<SidebarGroup>
							<SidebarGroupLabel className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-foreground/70 px-2">
								Account
							</SidebarGroupLabel>
							<SidebarMenu className="gap-1.5">
								{secondaryNav.map((item) => {
									const active = settingsOpen || isActive(item.url);
									return (
										<SidebarMenuItem key={item.title}>
											{item.title === 'Settings' ? (
												<SidebarMenuButton
													tooltip={item.title}
													isActive={active}
													onClick={() => openSettings('profile')}
													className={cn(
														'border-[2px] transition-all font-title font-bold text-sm tracking-tight',
														active
															? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
															: 'border-transparent text-foreground hover:border-black hover:bg-muted/70 hover:shadow-[2px_2px_0_#000]',
													)}>
													<item.icon className="size-4" strokeWidth={active ? 2.5 : 2} />
													<span className="font-bold">{item.title}</span>
												</SidebarMenuButton>
											) : (
												<Link href={item.url}>
													<SidebarMenuButton
														tooltip={item.title}
														isActive={active}
														className={cn(
															'border-[2px] transition-all font-title font-bold text-sm tracking-tight',
															active
																? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
																: 'border-transparent text-foreground hover:border-black hover:bg-muted/70 hover:shadow-[2px_2px_0_#000]',
														)}>
														<item.icon className="size-4" strokeWidth={active ? 2.5 : 2} />
														<span className="font-bold">{item.title}</span>
													</SidebarMenuButton>
												</Link>
											)}
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroup>
					</SidebarContent>

					<SidebarFooter className="border-t-[3px] border-black p-2">
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton
											size="lg"
											className="border-[2px] border-black bg-card shadow-[2px_2px_0_#000] hover:bg-muted brutal-lift">
											<Avatar className="h-8 w-8 border border-black shrink-0">
												<AvatarImage
													src={userAvatar}
													alt={userName}
												/>
												<AvatarFallback className="bg-primary text-black font-black text-xs">
													{userInitials}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left leading-tight min-w-0">
												<span className="truncate font-black text-sm font-title">
													{userName}
												</span>
												<span className="truncate font-mono text-[10px] text-muted-foreground">{userEmail}</span>
											</div>
											<ChevronsUpDown className="ml-auto size-4" strokeWidth={2.5} />
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-[--radix-dropdown-menu-trigger-width] min-w-56 border-[3px] border-black bg-card shadow-[5px_5px_0_#000] p-1"
										side="bottom"
										align="end"
										sideOffset={4}>
										<DropdownMenuLabel className="p-2 font-normal border-b-[2px] border-black bg-muted/40">
											<div className="flex items-center gap-2 px-1 text-left text-sm">
												<Avatar className="h-8 w-8 border-[2px] border-black">
													<AvatarImage
														src={userAvatar}
														alt={userName}
													/>
													<AvatarFallback className="bg-primary font-black text-xs">
														{userInitials}
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight min-w-0">
													<span className="truncate font-black">{userName}</span>
													<span className="truncate font-mono text-xs text-muted-foreground">{userEmail}</span>
												</div>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuGroup className="p-1">
											<DropdownMenuItem
												onClick={() => openSettings('profile')}
												className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20 focus:bg-primary/20">
												<Settings className="size-4" strokeWidth={2.5} />
												Settings
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => openSettings('notifications')}
												className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-accent/20 focus:bg-accent/20">
												<Bell className="size-4" strokeWidth={2.5} />
												Notifications
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator className="bg-black h-[2px]" />
										<DropdownMenuItem
											className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
											onClick={() =>
												signOut({
													fetchOptions: {
														onSuccess: () => {
															window.location.href = '/';
														},
													},
												})
											}>
											<LogOut className="size-4" strokeWidth={2.5} />
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
					<SidebarRail />
				</Sidebar>

				<SidebarInset>
					<header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b-[3px] border-black bg-background transition-[width,height] ease-linear">
						<div className="flex flex-1 items-center justify-between gap-3 px-4 sm:px-6">
							<div className="flex items-center gap-3">
								<SidebarTrigger className="-ml-1 hidden md:flex border-[2px] border-black bg-card shadow-[2px_2px_0_#000] hover:bg-muted size-9" />
								

								
							</div>

							<div className="flex items-center gap-2 sm:gap-3">
								<Link
									href="/rewards"
									title="View Coin Rewards"
									className="flex items-center gap-1.5 border-[2px] border-black bg-primary px-2.5 py-1 text-black shadow-[2px_2px_0_#000] brutal-lift">
									<CoinIcon className="size-4" strokeWidth={2.5} />
									<span className="font-mono text-xs font-black tabular-nums">247</span>
								</Link>

								<Link
									href="/dashboard"
									title="Active Smile Streak"
									className="flex items-center gap-1.5 border-[2px] border-black bg-secondary px-2.5 py-1 text-black shadow-[2px_2px_0_#000] brutal-lift">
									<Flame className="size-4" strokeWidth={2.5} />
									<span className="font-mono text-xs font-black tabular-nums">3d</span>
								</Link>

								<Link
									href="/capture"
									className="hidden sm:inline-flex items-center gap-1.5 border-[2px] border-black bg-accent px-3 py-1 font-title font-bold text-xs uppercase tracking-wider text-black shadow-[2px_2px_0_#000] brutal-lift">
									<Camera className="size-3.5" strokeWidth={2.5} />
									<span>Smile</span>
								</Link>

								<UserMenu className="md:hidden ml-1" />
							</div>
						</div>
					</header>

					<div className="flex flex-1 flex-col gap-4 p-4 pt-4 pb-24 md:pb-8">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>

			<nav
				className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t-[3px] border-black bg-card md:hidden shadow-[0_-3px_0_#000]"
				style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
				aria-label="Primary">
				{mobileTabs.map((tab) => {
					const active = isActive(tab.url);

					return (
						<Link
							key={tab.title}
							href={tab.url}
							className={cn(
								'flex flex-1 flex-col items-center justify-center gap-1 transition-all',
								active
									? 'bg-primary text-black font-bold border-t-[3px] border-black -mt-[3px]'
									: 'text-foreground hover:bg-muted/50',
							)}
							aria-current={active ? 'page' : undefined}>
							<tab.icon
								className="size-5"
								strokeWidth={active ? 2.5 : 2}
							/>
							<span
								className={cn(
									'font-mono text-[10px] tracking-wider uppercase',
									active ? 'font-black' : 'font-semibold text-muted-foreground',
								)}>
								{tab.title}
							</span>
						</Link>
					);
				})}
			</nav>

			<SettingsDialog
				key={settingsSection}
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
				defaultSection={settingsSection}
				userName={userName}
				userEmail={userEmail}
				userAvatar={userAvatar}
				userInitials={userInitials}
				onAvatarChange={setAvatarOverride}
			/>
		</>
	);
};

