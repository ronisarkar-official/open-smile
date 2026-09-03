"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ServerUser } from "@/backend/auth/session";
import {
	Shield,
	ExternalLink,
	LayoutDashboard,
	Users,
	Gift,
	Camera,
	Compass,
	SlidersHorizontal,
	ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const MOBILE_NAV_ITEMS = [
	{ href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
	{ href: "/admin/users", label: "Users", icon: Users },
	{ href: "/admin/vouchers", label: "Vouchers", icon: Gift },
	{ href: "/admin/captures", label: "Captures", icon: Camera },
	{ href: "/admin/explore", label: "Explore", icon: Compass },
	{ href: "/admin/settings", label: "Settings", icon: SlidersHorizontal },
	{ href: "/admin/logs", label: "Logs", icon: ScrollText },
];

export function AdminHeader({ user }: { user: ServerUser }) {
	const pathname = usePathname();

	return (
		<div className="shrink-0 flex flex-col border-b-[length:var(--border-width)] border-black bg-card shadow-brutal-xs z-20">
			<header className="h-16 px-4 sm:px-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-accent px-2.5 py-1 font-mono text-[11px] font-black uppercase text-black shadow-brutal-xs">
						<Shield className="size-3.5" />
						Admin Station
					</span>

					<div className="hidden sm:flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] font-bold">
						<span className="relative flex size-2">
							<span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
							<span className="relative inline-flex size-2 rounded-full bg-success" />
						</span>
						<span className="uppercase tracking-wider text-muted-foreground">Postgres Online</span>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Link
						href="/dashboard"
						className="hidden sm:inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-card hover:bg-muted px-3 py-1 font-mono text-xs font-bold text-foreground shadow-brutal-xs brutal-lift transition-transform"
					>
						<ExternalLink className="size-3" />
						View App
					</Link>

					<div className="flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-lg bg-primary px-2.5 py-1 shadow-brutal-xs">
						<Avatar className="size-7 border border-black shadow-brutal-xs shrink-0">
							<AvatarImage src={user.image || DEFAULT_AVATAR_URL} alt={user.name || user.email} className="object-cover" />
							<AvatarFallback className="text-[10px] font-black bg-black text-white">
								{user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col text-left">
							<span className="font-mono text-xs font-black text-black leading-tight truncate max-w-[120px] sm:max-w-[180px]">
								{user.name || user.email}
							</span>
							<span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-black/70">
								Administrator
							</span>
						</div>
					</div>
				</div>
			</header>

			<ScrollArea className="w-full md:hidden border-t border-black/10 bg-muted/40">
				<nav className="flex items-center gap-1 px-3 py-2 whitespace-nowrap">
					{MOBILE_NAV_ITEMS.map((item) => {
						const Icon = item.icon;
						const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[11px] font-black uppercase tracking-wider select-none",
									isActive
										? "border-black bg-accent text-black shadow-brutal-xs"
										: "border-transparent text-muted-foreground hover:bg-card hover:text-foreground"
								)}
							>
								<Icon className="size-3" />
								{item.label}
							</Link>
						);
					})}
				</nav>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
