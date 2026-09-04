'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	Bell,
	CheckCheck,
	Flame,
	Gift,
	Trophy,
	Sparkles,
	Camera,
	Trash2,
	ArrowRight,
	UserPlus,
	ShieldCheck,
	Clock,
	Inbox,
	ArrowLeft,
	RefreshCw,
	AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { MarkdownView } from '@/components/ui/markdown-view';

export type NotificationCategory = 'all' | 'unread' | 'rewards' | 'streaks' | 'leaderboard';

export interface UiNotification {
	id: string;
	title: string;
	description: string;
	category: 'rewards' | 'streaks' | 'leaderboard' | 'social' | 'system';
	icon_type: string;
	action_label: string | null;
	action_url: string | null;
	read: boolean;
	read_at: string | null;
	created_at: string;
}

function formatRelativeTime(dateString: string): string {
	try {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);

		if (diffMin < 1) return 'just now';
		if (diffMin < 60) return `${diffMin}m ago`;
		if (diffHour < 24) return `${diffHour}h ago`;
		if (diffDay < 7) return `${diffDay}d ago`;
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	} catch {
		return 'recently';
	}
}

function getNotificationIcon(iconType: string, category: string) {
	switch (iconType) {
		case 'flame':
			return { icon: Flame, bg: 'bg-secondary text-secondary-foreground' };
		case 'gift':
			return { icon: Gift, bg: 'bg-primary text-primary-foreground' };
		case 'trophy':
			return { icon: Trophy, bg: 'bg-accent text-accent-foreground' };
		case 'user_plus':
			return { icon: UserPlus, bg: 'bg-primary text-primary-foreground' };
		case 'shield':
			return { icon: ShieldCheck, bg: 'bg-muted text-muted-foreground' };
		case 'sparkles':
			return { icon: Sparkles, bg: 'bg-primary text-primary-foreground' };
		case 'camera':
			return { icon: Camera, bg: 'bg-accent text-accent-foreground' };
		case 'alert':
			return { icon: AlertCircle, bg: 'bg-destructive text-destructive-foreground' };
		default:
			if (category === 'streaks') return { icon: Flame, bg: 'bg-secondary text-secondary-foreground' };
			if (category === 'rewards') return { icon: Gift, bg: 'bg-primary text-primary-foreground' };
			if (category === 'leaderboard') return { icon: Trophy, bg: 'bg-accent text-accent-foreground' };
			if (category === 'social') return { icon: UserPlus, bg: 'bg-primary text-primary-foreground' };
			return { icon: Bell, bg: 'bg-muted text-muted-foreground' };
	}
}

export default function NotificationsPage() {
	const [notifications, setNotifications] = React.useState<UiNotification[]>([]);
	const [unreadCount, setUnreadCount] = React.useState<number>(0);
	const [totalCount, setTotalCount] = React.useState<number>(0);
	const [categoryCounts, setCategoryCounts] = React.useState<Record<string, number>>({});
	const [activeCategory, setActiveCategory] = React.useState<NotificationCategory>('all');
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
	const { toast } = useToast();

	const fetchNotifications = React.useCallback(async () => {
		try {
			setIsLoading(true);
			const params = new URLSearchParams();
			if (activeCategory === 'unread') {
				params.set('unread', 'true');
			} else if (activeCategory !== 'all') {
				params.set('category', activeCategory);
			}

			const res = await fetch(`/api/notifications?${params.toString()}`);
			if (!res.ok) throw new Error('Failed to load notifications');

			const data = await res.json();
			setNotifications(data.notifications || []);
			setUnreadCount(data.unreadCount || 0);
			setTotalCount(data.total || 0);
			if (data.categoryCounts) {
				setCategoryCounts(data.categoryCounts);
			}
		} catch (err: any) {
			toast({
				title: 'Notification sync failed',
				description: err?.message || 'Could not fetch your recent notifications',
				variant: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	}, [activeCategory, toast]);

	React.useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const markAsRead = async (id: string) => {
		const target = notifications.find((n) => n.id === id);
		if (!target || target.read) return;

		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n)),
		);
		setUnreadCount((prev) => Math.max(0, prev - 1));

		try {
			const res = await fetch('/api/notifications', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, action: 'mark_read' }),
			});
			if (res.ok) {
				window.dispatchEvent(new CustomEvent('notifications-updated'));
			}
		} catch {
		}
	};

	const markAllAsRead = async () => {
		if (unreadCount === 0 || isUpdating) return;

		setIsUpdating(true);
		setNotifications((prev) =>
			prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() })),
		);
		setUnreadCount(0);

		try {
			const res = await fetch('/api/notifications', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'mark_all_read' }),
			});
			if (res.ok) {
				toast({
					title: 'All caught up!',
					description: 'All notifications marked as read.',
				});
				window.dispatchEvent(new CustomEvent('notifications-updated'));
			}
		} catch {
			toast({
				title: 'Action failed',
				description: 'Failed to mark all as read.',
				variant: 'error',
			});
			fetchNotifications();
		} finally {
			setIsUpdating(false);
		}
	};

	const deleteItem = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();

		const target = notifications.find((n) => n.id === id);
		setNotifications((prev) => prev.filter((n) => n.id !== id));
		if (target && !target.read) {
			setUnreadCount((prev) => Math.max(0, prev - 1));
		}
		setTotalCount((prev) => Math.max(0, prev - 1));

		try {
			const res = await fetch(`/api/notifications?id=${id}`, {
				method: 'DELETE',
			});
			if (res.ok) {
				window.dispatchEvent(new CustomEvent('notifications-updated'));
			}
		} catch {
			fetchNotifications();
		}
	};

	const clearAllRead = async () => {
		if (isUpdating) return;
		setIsUpdating(true);

		setNotifications((prev) => prev.filter((n) => !n.read));

		try {
			const res = await fetch('/api/notifications?filter=read', {
				method: 'DELETE',
			});
			if (res.ok) {
				toast({
					title: 'Notifications cleared',
					description: 'Read notifications have been removed.',
				});
				window.dispatchEvent(new CustomEvent('notifications-updated'));
			}
		} catch {
			toast({
				title: 'Clear failed',
				description: 'Could not clear read notifications.',
				variant: 'error',
			});
			fetchNotifications();
		} finally {
			setIsUpdating(false);
		}
	};

	const categories: { id: NotificationCategory; label: string; count?: number }[] = [
		{ id: 'all', label: 'All', count: totalCount },
		{ id: 'unread', label: 'Unread', count: unreadCount },
		{ id: 'rewards', label: 'Rewards & Coins', count: categoryCounts.rewards },
		{ id: 'streaks', label: 'Streaks', count: categoryCounts.streaks },
		{ id: 'leaderboard', label: 'Leaderboard', count: categoryCounts.leaderboard },
	];

	return (
		<main id="main-content" className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
			{/* Header */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<Button
						asChild
						variant="outline"
						size="sm"
						className="h-9 border-[length:var(--border-width)] border-black rounded-md bg-card px-2.5 font-mono text-xs font-bold shadow-brutal-sm brutal-lift"
					>
						<Link href="/dashboard" className="gap-1.5">
							<ArrowLeft className="size-4" strokeWidth={2.5} />
							<span className="hidden sm:inline">Dashboard</span>
						</Link>
					</Button>

					<div>
						<div className="flex items-center gap-2.5">
							<h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
								Notifications
							</h1>
							{unreadCount > 0 && (
								<span className="inline-flex items-center border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-black text-primary-foreground shadow-brutal-xs">
									{unreadCount} New
								</span>
							)}
						</div>
						<p className="font-mono text-xs text-muted-foreground">
							Live rewards, streak alerts, vouchers & community activity
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 self-start sm:self-auto">
					<Button
						variant="outline"
						size="sm"
						onClick={() => fetchNotifications()}
						disabled={isLoading}
						className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase shadow-brutal-sm brutal-lift hover:bg-muted"
					>
						<RefreshCw className={cn('size-3.5 mr-1', isLoading && 'animate-spin')} strokeWidth={2.5} />
						Refresh
					</Button>

					{unreadCount > 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={markAllAsRead}
							disabled={isUpdating}
							className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase shadow-brutal-sm brutal-lift hover:bg-muted"
						>
							<CheckCheck className="size-3.5 mr-1" strokeWidth={2.5} />
							Mark all read
						</Button>
					)}

					{notifications.some((n) => n.read) && (
						<Button
							variant="outline"
							size="sm"
							onClick={clearAllRead}
							disabled={isUpdating}
							className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase text-muted-foreground shadow-brutal-sm brutal-lift hover:text-destructive hover:bg-destructive/10"
						>
							<Trash2 className="size-3.5 mr-1" strokeWidth={2.5} />
							Clear read
						</Button>
					)}
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-[length:var(--border-width)] border-black/15">
				{categories.map((tab) => {
					const active = activeCategory === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveCategory(tab.id)}
							className={cn(
								'flex items-center gap-2 border-[length:var(--border-width)] rounded-md px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all',
								active
									? 'border-black bg-primary text-primary-foreground shadow-brutal-sm'
									: 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground',
							)}
						>
							<span>{tab.label}</span>
							{typeof tab.count === 'number' && tab.count > 0 && (
								<span
									className={cn(
										'rounded px-1.5 py-0.2 font-mono text-[10px] font-black',
										active ? 'bg-black text-primary' : 'bg-muted text-foreground',
									)}
								>
									{tab.count}
								</span>
							)}
						</button>
					);
				})}
			</div>

			{/* Notifications List */}
			<div className="mt-6 space-y-3">
				{isLoading ? (
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="flex items-start gap-4 border-[length:var(--border-width)] border-black rounded-xl p-5 bg-card shadow-brutal animate-pulse"
							>
								<div className="size-10 rounded-lg bg-muted border border-black/20 shrink-0" />
								<div className="space-y-2 flex-1">
									<div className="h-4 bg-muted rounded w-1/3" />
									<div className="h-3 bg-muted rounded w-3/4" />
									<div className="h-3 bg-muted rounded w-1/4" />
								</div>
							</div>
						))}
					</div>
				) : notifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-card p-10 text-center shadow-brutal-lg">
						<div className="flex size-14 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary/20 text-primary shadow-brutal-sm mb-4">
							<Inbox className="size-7" strokeWidth={2.5} />
						</div>
						<h3 className="font-display text-lg font-black tracking-tight">
							No notifications in this view
						</h3>
						<p className="font-mono text-xs text-muted-foreground max-w-sm mt-1 mb-6">
							You’re completely up to date! Capture smiles daily to keep earning streaks and leaderboard prizes.
						</p>
						<Button
							asChild
							className="border-[length:var(--border-width)] border-black rounded-md bg-primary font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal brutal-lift hover:bg-primary/90"
						>
							<Link href="/capture" className="gap-2">
								<Camera className="size-4" strokeWidth={2.5} />
								<span>Capture Today&apos;s Smile</span>
							</Link>
						</Button>
					</div>
				) : (
					notifications.map((notif) => {
						const { icon: Icon, bg: iconBg } = getNotificationIcon(notif.icon_type, notif.category);
						const formattedTime = formatRelativeTime(notif.created_at);

						return (
							<div
								key={notif.id}
								onClick={() => markAsRead(notif.id)}
								className={cn(
									'group relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-[length:var(--border-width)] border-black rounded-xl p-4 sm:p-5 shadow-brutal transition-all cursor-pointer',
									notif.read
										? 'bg-card hover:bg-muted/40'
										: 'bg-card ring-2 ring-primary/60 hover:bg-primary/5',
								)}
							>
								<div className="flex items-start gap-3.5 sm:gap-4">
									{/* Category Icon */}
									<div
										className={cn(
											'flex size-10 shrink-0 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg shadow-brutal-xs',
											iconBg,
										)}
									>
										<Icon className="size-5" strokeWidth={2.5} />
									</div>

									{/* Content */}
									<div className="space-y-1 min-w-0 flex-1">
										<div className="flex items-center gap-2 flex-wrap">
											<h4 className="font-title font-black text-sm tracking-tight text-foreground">
												{notif.title}
											</h4>
											{!notif.read && (
												<span className="inline-flex items-center px-1.5 py-0.2 font-mono text-[9px] font-black uppercase tracking-wider bg-destructive text-destructive-foreground border border-black rounded">
													Unread
												</span>
											)}
										</div>
										<MarkdownView content={notif.description} className="text-muted-foreground" />
										<div className="flex items-center gap-3 pt-1">
											<span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-muted-foreground">
												<Clock className="size-3" />
												{formattedTime}
											</span>
											<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground/70">
												• {notif.category}
											</span>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
									{notif.action_label && notif.action_url && (
										<Button
											asChild
											size="sm"
											className="h-8 border-[length:var(--border-width)] border-black rounded-md bg-primary px-3 font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-xs brutal-lift hover:bg-primary/90"
											onClick={(e) => e.stopPropagation()}
										>
											<Link href={notif.action_url} className="gap-1.5">
												<span>{notif.action_label}</span>
												<ArrowRight className="size-3.5" strokeWidth={2.5} />
											</Link>
										</Button>
									)}

									<button
										type="button"
										onClick={(e) => deleteItem(notif.id, e)}
										title="Delete notification"
										className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
									>
										<Trash2 className="size-4" />
									</button>
								</div>
							</div>
						);
					})
				)}
			</div>
		</main>
	);
}
