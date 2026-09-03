'use client';

import * as React from 'react';
import Link from 'next/link';
import {
	Users,
	Camera,
	Coins,
	Gift,
	ShieldAlert,
	Sparkles,
	TrendingUp,
	RefreshCw,
	ArrowRight,
	Clock,
	CheckCircle2,
	AlertTriangle,
	SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from '@/components/ui/avatar';

export default function AdminDashboardPage() {
	const { toast } = useToast();
	const [stats, setStats] = React.useState<any>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	async function fetchStats(isManual = false) {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('/api/admin/stats');
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed to load stats');
			setStats(json.stats);
			if (isManual) {
				toast({
					title: 'Metrics Refreshed',
					description: 'Latest system stats and audit feed loaded.',
					variant: 'info',
				});
			}
		} catch (err: any) {
			setError(err.message || 'Failed to load stats');
			if (isManual) {
				toast({
					title: 'Load Failed',
					description: err.message || 'Could not retrieve statistics',
					variant: 'error',
				});
			}
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		fetchStats();
	}, []);

	return (
		<div className="space-y-8 pb-12">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<div className="flex items-center gap-2">
						<span className="relative flex size-2.5">
							<span className="absolute inline-flex size-full animate-ping bg-success opacity-75" />
							<span className="relative inline-flex size-2.5 bg-success" />
						</span>
						<p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
							Platform Operations
						</p>
					</div>
					<h1 className="mt-1 text-3xl font-black font-title tracking-tight sm:text-4xl text-foreground">
						System Overview
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Real-time metrics, economy velocity, and administrative operations
					</p>
				</div>

				<Button
					onClick={() => fetchStats(true)}
					disabled={loading}
					className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-10 px-4">
					<RefreshCw
						className={cn('size-3.5 mr-2', loading && 'animate-spin')}
					/>
					Refresh Metrics
				</Button>
			</div>

			{error ?
				<div className="border-[length:var(--border-width)] border-destructive rounded-lg bg-destructive/10 p-4 font-mono text-xs font-bold text-destructive">
					{error}
				</div>
			:	null}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-primary p-5 shadow-brutal flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[11px] font-black uppercase tracking-wider text-black/70">
							Total Smilers
						</span>
						<div className="size-8 rounded-md border border-black bg-black text-white flex items-center justify-center">
							<Users className="size-4" />
						</div>
					</div>
					<div className="mt-4">
						<div className="text-3xl font-black font-title text-black">
							{loading ? '...' : (stats?.totalUsers ?? 0).toLocaleString()}
						</div>
						<div className="mt-1 font-mono text-[11px] font-bold text-black/80 flex items-center gap-1.5">
							<span className="size-1.5 rounded-full bg-success inline-block" />
							{stats?.activeUsersToday ?? 0} active today
						</div>
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-accent p-5 shadow-brutal flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[11px] font-black uppercase tracking-wider text-black/70">
							Smile Captures
						</span>
						<div className="size-8 rounded-md border border-black bg-black text-white flex items-center justify-center">
							<Camera className="size-4" />
						</div>
					</div>
					<div className="mt-4">
						<div className="text-3xl font-black font-title text-black">
							{loading ? '...' : (stats?.totalCaptures ?? 0).toLocaleString()}
						</div>
						<div className="mt-1 font-mono text-[11px] font-bold text-black/80">
							Avg Score: {stats?.averageScore ?? 0}%
						</div>
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-secondary p-5 shadow-brutal flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[11px] font-black uppercase tracking-wider text-secondary-foreground/70">
							Coins Minted
						</span>
						<div className="size-8 rounded-md border border-black bg-black text-white flex items-center justify-center">
							<Coins className="size-4" />
						</div>
					</div>
					<div className="mt-4">
						<div className="text-3xl font-black font-title text-secondary-foreground">
							{loading ?
								'...'
							:	(stats?.totalCoinsMinted ?? 0).toLocaleString()}{' '}
							🪙
						</div>
						<div className="mt-1 font-mono text-[11px] font-bold text-secondary-foreground/80">
							{stats?.totalCoinsSpent ?? 0} coins redeemed
						</div>
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[11px] font-black uppercase tracking-wider text-muted-foreground">
							Anti-Cheat Flags
						</span>
						<div className="size-8 rounded-md border border-black bg-destructive/15 text-destructive flex items-center justify-center">
							<ShieldAlert className="size-4" />
						</div>
					</div>
					<div className="mt-4">
						<div className="text-3xl font-black font-title text-foreground">
							{loading ? '...' : (stats?.totalFlaggedCaptures ?? 0)}
						</div>
						<div className="mt-1 font-mono text-[11px] font-bold text-muted-foreground">
							{stats?.totalVoucherClaims ?? 0} vouchers claimed
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Link
					href="/admin/users"
					className="border-[length:var(--border-width)] border-black rounded-xl bg-card hover:bg-primary/20 p-4 shadow-brutal-xs brutal-lift flex items-center justify-between transition-all">
					<div className="flex items-center gap-3">
						<div className="size-10 rounded-lg border border-black bg-primary flex items-center justify-center text-black font-mono">
							<Users className="size-5" />
						</div>
						<div>
							<div className="font-mono font-black text-xs uppercase text-foreground">
								Manage Users
							</div>
							<div className="font-mono text-[11px] text-muted-foreground">
								Balances & Roles
							</div>
						</div>
					</div>
					<ArrowRight className="size-4 text-muted-foreground" />
				</Link>

				<Link
					href="/admin/captures"
					className="border-[length:var(--border-width)] border-black rounded-xl bg-card hover:bg-accent/20 p-4 shadow-brutal-xs brutal-lift flex items-center justify-between transition-all">
					<div className="flex items-center gap-3">
						<div className="size-10 rounded-lg border border-black bg-accent flex items-center justify-center text-black font-mono">
							<Camera className="size-5" />
						</div>
						<div>
							<div className="font-mono font-black text-xs uppercase text-foreground">
								Smile Captures
							</div>
							<div className="font-mono text-[11px] text-muted-foreground">
								Anti-Cheat Review
							</div>
						</div>
					</div>
					<ArrowRight className="size-4 text-muted-foreground" />
				</Link>

				<Link
					href="/admin/vouchers"
					className="border-[length:var(--border-width)] border-black rounded-xl bg-card hover:bg-secondary/20 p-4 shadow-brutal-xs brutal-lift flex items-center justify-between transition-all">
					<div className="flex items-center gap-3">
						<div className="size-10 rounded-lg border border-black bg-secondary flex items-center justify-center text-secondary-foreground font-mono">
							<Gift className="size-5" />
						</div>
						<div>
							<div className="font-mono font-black text-xs uppercase text-foreground">
								Vouchers & Stock
							</div>
							<div className="font-mono text-[11px] text-muted-foreground">
								Code Seeder
							</div>
						</div>
					</div>
					<ArrowRight className="size-4 text-muted-foreground" />
				</Link>

				<Link
					href="/admin/settings"
					className="border-[length:var(--border-width)] border-black rounded-xl bg-card hover:bg-muted p-4 shadow-brutal-xs brutal-lift flex items-center justify-between transition-all">
					<div className="flex items-center gap-3">
						<div className="size-10 rounded-lg border border-black bg-muted flex items-center justify-center text-foreground font-mono">
							<SlidersHorizontal className="size-5" />
						</div>
						<div>
							<div className="font-mono font-black text-xs uppercase text-foreground">
								Settings & Flags
							</div>
							<div className="font-mono text-[11px] text-muted-foreground">
								Maintenance Mode
							</div>
						</div>
					</div>
					<ArrowRight className="size-4 text-muted-foreground" />
				</Link>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-6 shadow-brutal space-y-4">
					<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
						<div className="flex items-center gap-2">
							<Camera className="size-4 text-accent" />
							<h3 className="font-black font-title text-lg text-foreground">
								Recent Captures
							</h3>
						</div>
						<Link
							href="/admin/captures"
							className="font-mono text-xs font-bold text-accent hover:underline inline-flex items-center gap-1">
							View all <ArrowRight className="size-3" />
						</Link>
					</div>

					<div className="space-y-2.5">
						{stats?.recentCaptures?.length ?
							stats.recentCaptures.map((cap: any) => (
								<div
									key={cap.id}
									className="flex items-center justify-between p-3 rounded-lg border border-black/15 bg-muted/30 hover:bg-muted/60 transition-colors">
									<div className="flex items-center gap-3 min-w-0">
										<Avatar className="size-8 border border-black shadow-brutal-xs shrink-0">
											<AvatarImage src={cap.user_image || DEFAULT_AVATAR_URL} alt={cap.user_name} className="object-cover" />
											<AvatarFallback className="text-[10px] font-black bg-primary text-primary-foreground">
												{cap.user_name?.slice(0, 2).toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<div className="font-mono text-xs font-black text-foreground truncate">
												{cap.user_name || 'Anonymous Smiler'}
											</div>
											<div className="font-mono text-[10px] text-muted-foreground truncate">
												{cap.user_email}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										{cap.flagged ?
											<span className="border border-destructive/40 rounded-xs bg-destructive/15 px-1.5 py-0.5 font-mono text-[9px] font-black text-destructive">
												FLAGGED
											</span>
										:	<span className="border border-success/40 rounded-xs bg-success/15 px-1.5 py-0.5 font-mono text-[9px] font-black text-success">
												+{cap.coins_awarded} 🪙
											</span>
										}
										<span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
											{new Date(cap.created_at).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
								</div>
							))
						:	<div className="p-6 text-center font-mono text-xs text-muted-foreground">
								No smile captures recorded yet.
							</div>
						}
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-6 shadow-brutal space-y-4">
					<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
						<div className="flex items-center gap-2">
							<Clock className="size-4 text-primary" />
							<h3 className="font-black font-title text-lg text-foreground">
								Admin Audit Trail
							</h3>
						</div>
						<Link
							href="/admin/logs"
							className="font-mono text-xs font-bold text-accent hover:underline inline-flex items-center gap-1">
							View all <ArrowRight className="size-3" />
						</Link>
					</div>

					<div className="space-y-2.5">
						{stats?.recentAuditLogs?.length ?
							stats.recentAuditLogs.map((log: any) => (
								<div
									key={log.id}
									className="flex items-center justify-between p-3 rounded-lg border border-black/15 bg-muted/30 hover:bg-muted/60 transition-colors">
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<span className="border border-black rounded-xs bg-black text-white px-1.5 py-0.5 font-mono text-[9px] font-black uppercase">
												{log.action}
											</span>
											<span className="font-mono text-xs font-black text-foreground">
												{log.target_type}
											</span>
										</div>
										<span className="font-mono text-[10px] text-muted-foreground mt-0.5">
											By {log.admin_email}
										</span>
									</div>

									<span className="font-mono text-[10px] text-muted-foreground">
										{new Date(log.created_at).toLocaleDateString([], {
											month: 'short',
											day: 'numeric',
										})}
									</span>
								</div>
							))
						:	<div className="p-6 text-center font-mono text-xs text-muted-foreground">
								No audit events recorded yet.
							</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
