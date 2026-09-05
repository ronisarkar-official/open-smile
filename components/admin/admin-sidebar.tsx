"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Users,
	Gift,
	Camera,
	Compass,
	SlidersHorizontal,
	ScrollText,
	ArrowLeft,
	Shield,
	Bell,
	Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{ href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
	{ href: "/admin/users", label: "Users & Roles", icon: Users },
	{ href: "/admin/notifications", label: "Notifications", icon: Bell },
	{ href: "/admin/mailer", label: "Mail Service", icon: Mail },
	{ href: "/admin/vouchers", label: "Vouchers & Stock", icon: Gift },
	{ href: "/admin/captures", label: "Captures & Anti-Cheat", icon: Camera },
	{ href: "/admin/explore", label: "Explore Feed", icon: Compass },
	{ href: "/admin/settings", label: "System Settings", icon: SlidersHorizontal },
	{ href: "/admin/logs", label: "Audit Logs", icon: ScrollText },
];

export function AdminSidebar({ className }: { className?: string }) {
	const pathname = usePathname();

	return (
		<aside
			className={cn(
				"w-64 shrink-0 border-r-[length:var(--border-width)] border-black bg-card flex flex-col justify-between p-4 h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
				className
			)}
		>
			<div className="space-y-6">
				<div className="flex items-center gap-2.5 px-3 py-2 border-[length:var(--border-width)] border-black rounded-lg bg-primary shadow-brutal-xs">
					<div className="size-8 rounded-md border border-black bg-black text-white flex items-center justify-center font-mono font-black text-sm shrink-0">
						<Shield className="size-4 text-accent" />
					</div>
					<div className="min-w-0">
						<div className="font-mono text-[10px] font-black uppercase tracking-wider text-black/70 leading-none">
							Control Panel
						</div>
						<div className="font-black font-title text-base leading-tight text-black truncate">
							Open Smile Admin
						</div>
					</div>
				</div>

				<nav className="space-y-1.5">
					{NAV_ITEMS.map((item) => {
						const Icon = item.icon;
						const isActive = item.exact
							? pathname === item.href
							: pathname.startsWith(item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-3 px-3 py-2.5 rounded-lg border-[length:var(--border-width)] font-mono text-xs font-black uppercase tracking-wider transition-all duration-150 select-none",
									isActive
										? "border-black bg-accent text-black shadow-brutal-xs translate-x-1"
										: "border-transparent text-muted-foreground hover:border-black/30 hover:bg-muted/60 hover:text-foreground"
								)}
							>
								<Icon className={cn("size-4 shrink-0", isActive ? "text-black" : "text-muted-foreground")} />
								<span className="truncate">{item.label}</span>
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="pt-4 border-t-[length:var(--border-width)] border-black/15">
				<Link
					href="/dashboard"
					className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg border-[length:var(--border-width)] border-black bg-secondary text-secondary-foreground font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift"
				>
					<ArrowLeft className="size-3.5" />
					<span>Back to App</span>
				</Link>
			</div>
		</aside>
	);
}
