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
	Flame,
	Gift,
	LayoutDashboard,
	LogOut,
	Smile,
	Settings,
	Trophy,
	UserPlus,
	Compass,
	Download,
	Lock,
	User,
} from 'lucide-react';
import { usePwaContext } from '@/components/pwa/pwa-provider';
import { IosInstallGuide } from '@/components/pwa/ios-install-guide';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';
import { SettingsDialog } from '@/components/settings/dialog';
import type { SettingsSection } from '@/components/settings/settings-shared';
import { cn } from '@/lib/utils';
import { CoinIcon } from '@/components/ui/coin-icon';
import { UserCoinBalance, UserStreak } from '@/components/icons';
import { useSystemSettings } from '@/hooks/use-system-settings';

function ExploreNaviIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 44 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={cn('h-7.5 w-10 shrink-0 select-none overflow-visible sm:h-8 sm:w-11', className)}>
			<g transform="translate(18, 4)">
				<rect
					x="0"
					y="3"
					width="18"
					height="20"
					rx="3"
					fill="#4C1D95"
					transform="rotate(6 9 13)"
				/>
				<rect
					x="0"
					y="4"
					width="18"
					height="18"
					rx="2.5"
					fill="#6D28D9"
				/>
				<rect
					x="0"
					y="7"
					width="18"
					height="4"
					fill="#8B5CF6"
					opacity="0.8"
				/>
				<rect
					x="0"
					y="13"
					width="18"
					height="4"
					fill="#4C1D95"
					opacity="0.5"
				/>
			</g>

			<g transform="rotate(-6 12 16)">
				<rect
					x="1"
					y="2"
					width="20"
					height="26"
					rx="4"
					fill="url(#navi-card-grad)"
					stroke="#C084FC"
					strokeWidth="0.8"
				/>
				<path
					d="M2 6L19 4"
					stroke="#F3E8FF"
					strokeWidth="0.8"
					strokeLinecap="round"
					opacity="0.8"
				/>
				<circle
					cx="11"
					cy="12"
					r="5.5"
					fill="white"
					stroke="#E9D5FF"
					strokeWidth="0.5"
				/>
				<path
					d="M8.5 12.5C9.2 14.2 10.8 14.8 11 14.8C11.2 14.8 12.8 14.2 13.5 12.5"
					stroke="#7C3AED"
					strokeWidth="1.2"
					strokeLinecap="round"
				/>
				<circle
					cx="9.5"
					cy="10.5"
					r="0.75"
					fill="#7C3AED"
				/>
				<circle
					cx="12.5"
					cy="10.5"
					r="0.75"
					fill="#7C3AED"
				/>
			</g>

			<defs>
				<linearGradient
					id="navi-card-grad"
					x1="1"
					y1="2"
					x2="21"
					y2="28"
					gradientUnits="userSpaceOnUse">
					<stop stopColor="#A855F7" />
					<stop
						offset="0.5"
						stopColor="#9333EA"
					/>
					<stop
						offset="1"
						stopColor="#6D28D9"
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}

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

const mobileTabs: {
	title: string;
	url: string;
	icon?: React.ElementType;
	isAvatar?: boolean;
}[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Explore',
		url: '/explore',
		icon: Compass,
	},
	{
		title: 'Capture',
		url: '/capture',
		icon: Camera,
	},
	{
		title: 'Board',
		url: '/leaderboard',
		icon: Trophy,
	},
	{
		title: 'Profile',
		url: '/profile',
		isAvatar: true,
	},
];

export const DashboardSidebar = ({
	children,
}: {
	children?: React.ReactNode;
}) => {
	const { data: session } = useSession();
	const pathname = usePathname();
	const { isInstalled, isInstallable, promptInstall, isIOS } = usePwaContext();
	const [showIosGuide, setShowIosGuide] = React.useState(false);
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
	const userAvatar = avatarOverride ?? user?.image ?? DEFAULT_AVATAR_URL;
	const userInitials =
		userName
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'U';

	const { settings } = useSystemSettings();

	const isActive = (url: string) => pathname === url;

	return (
		<>
			<SidebarProvider>
				<Sidebar
					collapsible="icon"
					animateOnHover={false}
					className="hidden md:flex border-r-[length:var(--border-width)] border-black bg-sidebar">
					<SidebarHeader className="p-3 group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center">
						<SidebarMenu className="group-data-[collapsible=icon]:items-center">
							<SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
								<Link
									href="/dashboard"
									className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
									<SidebarMenuButton
										size="lg"
										className="min-h-0 group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:!min-h-0 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center hover:bg-primary/10">
										<div className="flex aspect-square size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground shadow-brutal-xs shrink-0">
											<Smile
												className="m-auto size-5"
												strokeWidth={2.5}
											/>
										</div>
										<div className="grid flex-1 text-left leading-tight ml-1 group-data-[collapsible=icon]:hidden">
											<span className="truncate font-black tracking-tight text-base font-title text-black">
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

					<SidebarContent className="p-2 gap-4 group-data-[collapsible=icon]:p-1.5 group-data-[collapsible=icon]:gap-2">
						<div className="px-1 pt-1 group-data-[collapsible=icon]:hidden">
							<Link
								href="/capture"
								className="flex items-center justify-center gap-2 border-[length:var(--border-width)] border-black rounded-lg bg-primary px-3 py-2.5 font-title font-black text-xs uppercase tracking-wider text-primary-foreground shadow-brutal brutal-lift hover:bg-primary/90">
								<Camera
									className="size-4"
									strokeWidth={2.5}
								/>
								<span>Capture Smile</span>
							</Link>
						</div>

						<SidebarGroup className="group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center">
							<SidebarGroupLabel className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-foreground/70 px-2 group-data-[collapsible=icon]:hidden">
								Menu
							</SidebarGroupLabel>
							<SidebarMenu className="gap-1.5 group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:items-center">
								{mainNav.map((item) => {
									const active = isActive(item.url);
									return (
										<SidebarMenuItem
											key={item.title}
											className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
											<Link
												href={item.url}
												className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
												<SidebarMenuButton
													tooltip={item.title}
													isActive={active}
													className={cn(
														'border-[length:var(--border-width)] rounded-md transition-all font-title font-bold text-sm tracking-tight',
														'group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:!min-h-0 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center',
														active ?
															'!border-black !bg-primary !text-primary-foreground shadow-brutal-sm'
														:	'border-transparent text-foreground hover:border-black hover:bg-card/80 hover:shadow-brutal-xs',
													)}>
													<item.icon
														className="size-4.5 group-data-[collapsible=icon]:size-5 shrink-0"
														strokeWidth={active ? 2.5 : 2}
													/>
													<span className="font-bold group-data-[collapsible=icon]:hidden">
														{item.title}
													</span>
												</SidebarMenuButton>
											</Link>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>

				<SidebarInset>
					<header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b-[length:var(--border-width)] border-black bg-background transition-[width,height] ease-linear">
						<div className="flex flex-1 items-center justify-between gap-2 px-3 sm:px-6">
							<div className="flex items-center gap-2.5 min-w-0">
								<SidebarTrigger className="-ml-1 hidden md:flex border-[length:var(--border-width)] border-black rounded-md bg-card shadow-brutal-sm hover:bg-muted size-9 min-h-0" />
								<Link
									href="/dashboard"
									className="flex md:hidden items-center gap-2 min-w-0">
									<div className="flex aspect-square size-8 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground shadow-brutal-xs shrink-0">
										<Smile
											className="m-auto size-4.5"
											strokeWidth={2.5}
										/>
									</div>
									<span className="truncate font-black tracking-tight text-base font-title text-black">
										OPEN SMILE
									</span>
								</Link>
							</div>

							<div className="flex items-center gap-2 sm:gap-3.5">
								{/* <Link
									href="/explore"
									title="Explore Feed"
									className="group relative flex flex-col items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 shrink-0">
									<div className="relative flex items-center justify-center">
										<ExploreNaviIcon />
									</div>
									<div className="relative -mt-2 z-10 flex items-center justify-center rounded-full bg-white px-2.5 py-0.5 border-[1.5px] border-black shadow-xs">
										<span className="font-title text-[10px] sm:text-[11px] font-black text-black leading-none tracking-tight">
											Explore
										</span>
									</div>
								</Link> */}

								<Link
									href="/streak"
									title="Active Streak"
									className="group relative flex flex-col items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 shrink-0">
									<div className="relative flex size-8 sm:size-9 items-center justify-center">
										<div className="flex size-7.5 sm:size-8.5 items-center justify-center rounded-full bg-linear-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-xs border border-amber-300">
											<Flame
												className="size-4.5 sm:size-5 text-white fill-white drop-shadow-xs"
												strokeWidth={2.5}
											/>
										</div>
									</div>
									<div className="relative -mt-2 z-10 flex h-4.5 sm:h-5 min-w-8 sm:min-w-8.5 items-center justify-center rounded-full bg-white px-2 border-[1.5px] border-[#FF6B6B] shadow-xs">
										<UserStreak className="font-title text-[10px] sm:text-[11px] font-black text-black tabular-nums leading-none tracking-tight" />
									</div>
								</Link>

								<Link
									href="/rewards"
									title="View Coin Rewards"
									className="group relative flex flex-col items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 shrink-0">
									<div className="relative flex size-8 sm:size-9 items-center justify-center">
										<CoinIcon
											className="size-9 sm:size-10 drop-shadow-xs"
											strokeWidth={2.5}
										/>
									</div>
									<div className="relative -mt-2 z-10 flex h-4.5 sm:h-5 min-w-8 sm:min-w-8.5 items-center justify-center rounded-full bg-white px-2 border-[1.5px] border-[#F59E0B] shadow-xs">
										<UserCoinBalance className="font-title text-[10px] sm:text-[11px] font-black text-black tabular-nums leading-none tracking-tight" />
									</div>
								</Link>

								<Link
									href="/notifications"
									title="Notifications"
									aria-label="View notifications"
									className="relative flex items-center justify-center size-8.5 sm:size-9.5 rounded-full bg-white shadow-xs border border-neutral-200/80 transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0">
									<Bell
										className="size-4.5 sm:size-5 text-black"
										strokeWidth={2.2}
									/>
									<span className="absolute -top-1 -right-1 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#E11D48] border-2 border-white text-[9px] sm:text-[10px] font-black text-white shadow-xs">
										3
									</span>
								</Link>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="hidden md:flex items-center size-9 sm:size-9.5 rounded-full border border-black/15 bg-white p-0.5 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring ml-1 shrink-0"
											aria-label="Open account menu">
											<Avatar className="size-full border border-black">
												<AvatarImage
													src={userAvatar}
													alt={userName}
												/>
												<AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
													{userInitials}
												</AvatarFallback>
											</Avatar>
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-60 border-[length:var(--border-width)] border-black rounded-lg bg-card shadow-brutal-lg p-1"
										side="bottom"
										align="end"
										sideOffset={8}>
										<DropdownMenuLabel className="p-2 font-normal border-b-[length:var(--border-width)] border-black bg-muted/40">
											<div className="flex items-center gap-2.5 text-left">
												<Avatar className="h-8 w-8 border-[length:var(--border-width)] border-black shrink-0">
													<AvatarImage
														src={userAvatar}
														alt={userName}
													/>
													<AvatarFallback className="bg-primary font-black text-xs">
														{userInitials}
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left leading-tight min-w-0">
													<span className="truncate font-black text-sm">
														{userName}
													</span>
													<span className="truncate text-xs font-mono text-muted-foreground">
														{userEmail}
													</span>
												</div>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuGroup className="p-1">
											<DropdownMenuItem asChild>
												<Link
													href="/profile"
													className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20 focus:bg-primary/20">
													<User
														className="size-4"
														strokeWidth={2.5}
													/>
													My Profile
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => openSettings('profile')}
												className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20 focus:bg-primary/20">
												<Settings
													className="size-4"
													strokeWidth={2.5}
												/>
												Settings
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link
													href="/notifications"
													className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-accent/20 focus:bg-accent/20">
													<Bell
														className="size-4"
														strokeWidth={2.5}
													/>
													Notifications
												</Link>
											</DropdownMenuItem>
											{!isInstalled && (isInstallable || isIOS) && (
												<DropdownMenuItem
													onClick={() => {
														if (isIOS) {
															setShowIosGuide(true);
														} else {
															promptInstall();
														}
													}}
													className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/20 focus:bg-primary/20 text-primary">
													<Download
														className="size-4"
														strokeWidth={2.5}
													/>
													Install App
												</DropdownMenuItem>
											)}
										</DropdownMenuGroup>
										<DropdownMenuSeparator className="bg-black h-[length:var(--border-width)]" />
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
											<LogOut
												className="size-4"
												strokeWidth={2.5}
											/>
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</header>

					{settings.maintenance_mode ? (
						<div className="bg-destructive text-destructive-foreground font-mono text-xs font-black uppercase px-4 py-2 text-center border-b-[length:var(--border-width)] border-black flex items-center justify-center gap-2">
							<span>⚠️ Maintenance Mode Active — Camera captures and voucher claims are temporarily paused</span>
						</div>
					) : null}

					<div className="flex flex-1 flex-col gap-4 p-4 pt-4 pb-24 md:pb-8">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>

			{/* Mobile Bottom Tab Bar */}
			<nav
				className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t-[length:var(--border-width)] border-black bg-card md:hidden shadow-[0_calc(-1*var(--shadow-offset))_0_var(--outline)]"
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
								active ?
									'bg-primary text-primary-foreground font-bold border-t-[length:var(--border-width)] border-black -mt-[length:var(--border-width)]'
								:	'text-foreground hover:bg-muted/50',
							)}
							aria-current={active ? 'page' : undefined}>
							{tab.isAvatar ?
								<Avatar className="size-5.5 border border-black">
									<AvatarImage
										src={userAvatar}
										alt={userName}
									/>
									<AvatarFallback
										className={cn(
											'font-bold text-[9px]',
											active ?
												'bg-primary-foreground text-primary'
											:	'bg-primary text-primary-foreground',
										)}>
										{userInitials}
									</AvatarFallback>
								</Avatar>
							: tab.icon ?
								<tab.icon
									className="size-5"
									strokeWidth={active ? 2.5 : 2}
								/>
							: null}
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

			<IosInstallGuide
				open={showIosGuide}
				onOpenChange={setShowIosGuide}
				isIOS={isIOS}
			/>
		</>
	);
};
