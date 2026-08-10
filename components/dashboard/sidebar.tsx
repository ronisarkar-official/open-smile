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
	Settings,
	Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SettingsDialog } from '@/components/settings/dialog';
import type { SettingsSection } from '@/components/settings/settings-shared';

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
	const [avatarOverride, setAvatarOverride] = React.useState<string | null>(null);

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

	return (
		<>
			<SidebarProvider>
				<Sidebar collapsible="icon">
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<Link href="/dashboard">
									<SidebarMenuButton
										size="lg"
										className="group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center">
										<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground ">
											<Zap className="size-4 m-auto" />
										</div>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												Boilerplate
											</span>
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
										{item.title === 'Settings' ? (
											<SidebarMenuButton
												tooltip={item.title}
												isActive={settingsOpen || isActive(item.url)}
												onClick={() => openSettings('profile')}>
												<item.icon />
												<span>{item.title}</span>
											</SidebarMenuButton>
										) : (
											<Link href={item.url}>
												<SidebarMenuButton
													tooltip={item.title}
													isActive={isActive(item.url)}>
													<item.icon />
													<span>{item.title}</span>
												</SidebarMenuButton>
											</Link>
										)}
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
											onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/'; } } })}>
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
					<header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
						<div className="flex flex-1 items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="h-8"
							/>
							<Breadcrumb>
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
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
				</SidebarInset>
			</SidebarProvider>

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
