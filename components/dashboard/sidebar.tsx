'use client';

import * as React from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
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
	ChevronsUpDown,
	LayoutDashboard,
	LogOut,
	Smile,
	Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SettingsDialog } from '@/components/settings/dialog';
import type { SettingsSection } from '@/components/settings/settings-shared';
import { cn } from '@/lib/utils';

const mainNav = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
];

const secondaryNav = [
	{
		title: 'Settings',
		url: '/dashboard/settings',
		icon: Settings,
	},
];

// Bottom tab bar items, in display order. Settings opens the dialog rather
// than navigating, same as the desktop sidebar's Settings entry.
const mobileTabs = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
		kind: 'link' as const,
	},
	{
		title: 'Settings',
		url: '/dashboard/settings',
		icon: Settings,
		kind: 'settings' as const,
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
						'flex items-center gap-2 border-[3px] border-border bg-card px-2 py-1.5 text-left brutal-shadow-sm',
						className,
					)}
					aria-label="Open account menu">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={userAvatar}
							alt={userName}
						/>
						<AvatarFallback>{userInitials}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56"
				side="bottom"
				align="end"
				sideOffset={8}>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={userAvatar}
								alt={userName}
							/>
							<AvatarFallback>{userInitials}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{userName}</span>
							<span className="truncate text-xs">{userEmail}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => openSettings('profile')}>
						<Settings />
						Settings
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Bell />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						signOut({
							fetchOptions: {
								onSuccess: () => {
									window.location.href = '/';
								},
							},
						})
					}>
					<LogOut />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<>
			<SidebarProvider>
				{/* Desktop / tablet sidebar — hidden below md, unchanged above it */}
				<Sidebar
					collapsible="icon"
					className="hidden md:flex">
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<Link href="/dashboard">
									<SidebarMenuButton
										size="lg"
										className="group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center!">
										<div className="flex aspect-square size-8 items-center justify-center border-2 border-black bg-primary text-primary-foreground">
											<Smile className="m-auto size-4" />
										</div>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">Open Smile</span>
										</div>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Main</SidebarGroupLabel>
							<SidebarMenu>
								{mainNav.map((item) => (
									<SidebarMenuItem key={item.title}>
										<Link href={item.url}>
											<SidebarMenuButton
												tooltip={item.title}
												isActive={isActive(item.url)}>
												<item.icon />
												<span>{item.title}</span>
											</SidebarMenuButton>
										</Link>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>

						<SidebarGroup>
							<SidebarGroupLabel>Settings</SidebarGroupLabel>
							<SidebarMenu>
								{secondaryNav.map((item) => (
									<SidebarMenuItem key={item.title}>
										{item.title === 'Settings' ?
											<SidebarMenuButton
												tooltip={item.title}
												isActive={settingsOpen || isActive(item.url)}
												onClick={() => openSettings('profile')}>
												<item.icon />
												<span>{item.title}</span>
											</SidebarMenuButton>
										:	<Link href={item.url}>
												<SidebarMenuButton
													tooltip={item.title}
													isActive={isActive(item.url)}>
													<item.icon />
													<span>{item.title}</span>
												</SidebarMenuButton>
											</Link>
										}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>
					</SidebarContent>

					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton
											size="lg"
											className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarImage
													src={userAvatar}
													alt={userName}
												/>
												<AvatarFallback className="rounded-lg">
													{userInitials}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">
													{userName}
												</span>
												<span className="truncate text-xs">{userEmail}</span>
											</div>
											<ChevronsUpDown className="ml-auto size-4" />
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
										side={'bottom'}
										align="end"
										sideOffset={4}>
										<DropdownMenuLabel className="p-0 font-normal">
											<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
												<Avatar className="h-8 w-8 rounded-lg">
													<AvatarImage
														src={userAvatar}
														alt={userName}
													/>
													<AvatarFallback className="rounded-lg">
														{userInitials}
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight">
													<span className="truncate font-semibold">
														{userName}
													</span>
													<span className="truncate text-xs">{userEmail}</span>
												</div>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem onClick={() => openSettings('profile')}>
												<Settings />
												Settings
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Bell />
												Notifications
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() =>
												signOut({
													fetchOptions: {
														onSuccess: () => {
															window.location.href = '/';
														},
													},
												})
											}>
											<LogOut />
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
					{/* Top header — sidebar trigger only shows on desktop; mobile gets brand + user menu instead */}
					<header className="flex h-14 shrink-0 items-center gap-2 border-b-[3px] border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
						<div className="flex flex-1 items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1 hidden md:flex" />
							<Separator
								orientation="vertical"
								className="hidden h-8 md:block"
							/>

							{/* Mobile brand mark — sidebar trigger doesn't exist on mobile anymore */}
							<Link
								href="/dashboard"
								className="flex items-center gap-2 md:hidden">
								<div className="flex aspect-square size-7 items-center justify-center border-2 border-border bg-primary text-primary-foreground">
									<Smile className="m-auto size-3.5" />
								</div>
								<span className="truncate text-sm font-semibold">
									Open Smile
								</span>
							</Link>

							<Breadcrumb className="hidden md:block">
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
									</BreadcrumbItem>
									{currentPage && !isActive('/dashboard') && (
										<>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
											</BreadcrumbItem>
										</>
									)}
								</BreadcrumbList>
							</Breadcrumb>

							{/* User menu lives here on mobile since there's no sidebar footer to hold it */}
							<UserMenu className="ml-auto md:hidden" />
						</div>
					</header>

					{/* Bottom padding on mobile clears the fixed tab bar so content never sits underneath it */}
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0 pb-20 md:pb-4">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>

			{/* Bottom tab bar — mobile only, fixed to viewport bottom, hidden at md and up */}
			<nav
				className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t-[3px] border-border bg-card md:hidden"
				style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
				aria-label="Primary">
				{mobileTabs.map((tab) => {
					const active =
						tab.kind === 'settings' ?
							settingsOpen || isActive(tab.url)
						:	isActive(tab.url);

					const content = (
						<>
							<tab.icon
								className="size-5"
								strokeWidth={active ? 2.5 : 2}
							/>
							<span
								className={cn(
									'text-[11px]',
									active ? 'font-bold' : 'font-medium',
								)}>
								{tab.title}
							</span>
						</>
					);

					const itemClasses = cn(
						'flex flex-1 flex-col items-center justify-center gap-1 transition-colors',
						active ? 'text-primary-foreground bg-primary' : 'text-foreground',
					);

					if (tab.kind === 'settings') {
						return (
							<button
								key={tab.title}
								type="button"
								onClick={() => openSettings('profile')}
								className={itemClasses}
								aria-current={active ? 'page' : undefined}>
								{content}
							</button>
						);
					}

					return (
						<Link
							key={tab.title}
							href={tab.url}
							className={itemClasses}
							aria-current={active ? 'page' : undefined}>
							{content}
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
