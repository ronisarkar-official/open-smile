'use client';

import * as React from 'react';
import {
	Bell,
	Send,
	Flame,
	Gift,
	Trophy,
	Sparkles,
	Camera,
	AlertCircle,
	Search,
	Trash2,
	RefreshCw,
	CheckCircle2,
	Users,
	Radio,
	Eye,
	Clock,
	Layers,
	ExternalLink,
	UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AdminUserCombobox } from '@/components/admin/admin-user-combobox';
import { AdminAiGeneratorDialog } from '@/components/admin/admin-ai-generator-dialog';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { MarkdownView } from '@/components/ui/markdown-view';

interface AdminNotificationItem {
	id: string;
	user_id: string;
	user_name?: string;
	user_email?: string;
	title: string;
	description: string;
	category: string;
	icon_type: string;
	action_label: string | null;
	action_url: string | null;
	read: boolean;
	read_at: string | null;
	created_at: string;
}

interface NotificationStats {
	total: number;
	unread: number;
	activeUsers: number;
	readRate: number;
}

const CATEGORIES = [
	{ id: 'system', label: 'System & Announcement' },
	{ id: 'rewards', label: 'Rewards & Coins' },
	{ id: 'streaks', label: 'Streaks & Multipliers' },
	{ id: 'leaderboard', label: 'Leaderboard Updates' },
	{ id: 'social', label: 'Social & Referrals' },
];

const ICONS = [
	{ id: 'bell', label: 'Bell', icon: Bell },
	{ id: 'flame', label: 'Flame (Streak)', icon: Flame },
	{ id: 'gift', label: 'Gift (Prize)', icon: Gift },
	{ id: 'trophy', label: 'Trophy (Podium)', icon: Trophy },
	{ id: 'sparkles', label: 'Sparkles', icon: Sparkles },
	{ id: 'camera', label: 'Camera', icon: Camera },
	{ id: 'alert', label: 'Alert Warning', icon: AlertCircle },
];

export default function AdminNotificationsPage() {
	const [activeTab, setActiveTab] = React.useState<'broadcast' | 'records'>('broadcast');
	const [stats, setStats] = React.useState<NotificationStats>({
		total: 0,
		unread: 0,
		activeUsers: 0,
		readRate: 100,
	});

	const [target, setTarget] = React.useState<'all' | 'active_7d' | 'specific'>('all');
	const [targetUserId, setTargetUserId] = React.useState('');
	const [selectedUserObj, setSelectedUserObj] = React.useState<any>(null);
	const [category, setCategory] = React.useState('system');
	const [iconType, setIconType] = React.useState('bell');
	const [title, setTitle] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [actionLabel, setActionLabel] = React.useState('');
	const [actionUrl, setActionUrl] = React.useState('');
	const [isSending, setIsSending] = React.useState(false);

	const [records, setRecords] = React.useState<AdminNotificationItem[]>([]);
	const [recordsPage, setRecordsPage] = React.useState(1);
	const [recordsTotalPages, setRecordsTotalPages] = React.useState(1);
	const [recordsSearch, setRecordsSearch] = React.useState('');
	const [recordsCategory, setRecordsCategory] = React.useState('all');
	const [isLoadingRecords, setIsLoadingRecords] = React.useState(false);
	const [deletingId, setDeletingId] = React.useState<string | null>(null);

	const { toast } = useToast();

	const fetchRecords = React.useCallback(async () => {
		try {
			setIsLoadingRecords(true);
			const params = new URLSearchParams({
				page: String(recordsPage),
				limit: '20',
			});
			if (recordsSearch) params.set('search', recordsSearch);
			if (recordsCategory !== 'all') params.set('category', recordsCategory);

			const res = await fetch(`/api/admin/notifications?${params.toString()}`);
			if (!res.ok) throw new Error('Failed to load notifications');

			const data = await res.json();
			setRecords(data.notifications || []);
			setRecordsTotalPages(data.totalPages || 1);
			if (data.stats) setStats(data.stats);
		} catch (err: any) {
			toast({
				title: 'Load failed',
				description: err?.message || 'Could not fetch notification records',
				variant: 'error',
			});
		} finally {
			setIsLoadingRecords(false);
		}
	}, [recordsPage, recordsSearch, recordsCategory, toast]);

	React.useEffect(() => {
		fetchRecords();
	}, [fetchRecords]);

	const handleBroadcast = async () => {
		if (!title.trim() || !description.trim()) {
			toast({
				title: 'Validation error',
				description: 'Title and description are required.',
				variant: 'error',
			});
			return;
		}

		if (target === 'specific' && !targetUserId.trim()) {
			toast({
				title: 'Validation error',
				description: 'Target email or user ID is required.',
				variant: 'error',
			});
			return;
		}

		setIsSending(true);
		try {
			const res = await fetch('/api/admin/notifications', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					target,
					target_user_id: target === 'specific' ? targetUserId.trim() : undefined,
					category,
					icon_type: iconType,
					title: title.trim(),
					description: description.trim(),
					action_label: actionLabel.trim() || undefined,
					action_url: actionUrl.trim() || undefined,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Broadcast failed');

			toast({
				title: 'Broadcast dispatched! 🚀',
				description: `Successfully created notification for ${data.count} smilers.`,
			});

			setTitle('');
			setDescription('');
			setActionLabel('');
			setActionUrl('');
			setTargetUserId('');
			fetchRecords();
		} catch (err: any) {
			toast({
				title: 'Broadcast failed',
				description: err?.message || 'Could not dispatch notifications',
				variant: 'error',
			});
		} finally {
			setIsSending(false);
		}
	};

	const handleDeleteRecord = async (id: string) => {
		setDeletingId(id);
		try {
			const res = await fetch(`/api/admin/notifications?id=${id}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Delete failed');

			toast({
				title: 'Notification removed',
				description: 'Notification has been deleted.',
			});
			fetchRecords();
		} catch (err: any) {
			toast({
				title: 'Delete failed',
				description: err?.message || 'Could not delete notification',
				variant: 'error',
			});
		} finally {
			setDeletingId(null);
		}
	};

	const SelectedIconComponent = ICONS.find((i) => i.id === iconType)?.icon || Bell;

	return (
		<div className="space-y-6 pb-12">
			{/* Station Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black bg-primary text-primary-foreground flex items-center justify-center shadow-brutal-xs">
							<Bell className="size-5" strokeWidth={2.5} />
						</div>
						<h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
							Notifications Station
						</h1>
					</div>
					<p className="font-mono text-xs text-muted-foreground mt-1">
						Compose in-app announcements, targeted notices, and audit platform delivery
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => fetchRecords()}
						className="border-[length:var(--border-width)] border-black rounded-md bg-card font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift hover:bg-muted"
					>
						<RefreshCw className={cn('size-3.5 mr-1', isLoadingRecords && 'animate-spin')} />
						Sync Stats
					</Button>
				</div>
			</div>

			{/* Metrics Ribbon */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Total Sent
						</span>
						<Layers className="size-4 text-primary" />
					</div>
					<div className="font-title font-black text-2xl text-foreground tabular-nums">
						{stats.total.toLocaleString()}
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Unread Count
						</span>
						<Radio className="size-4 text-destructive" />
					</div>
					<div className="font-title font-black text-2xl text-destructive tabular-nums">
						{stats.unread.toLocaleString()}
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Active Recipients
						</span>
						<Users className="size-4 text-secondary" />
					</div>
					<div className="font-title font-black text-2xl text-foreground tabular-nums">
						{stats.activeUsers.toLocaleString()}
					</div>
				</div>

				<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal-xs space-y-1">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Read Rate
						</span>
						<CheckCircle2 className="size-4 text-accent" />
					</div>
					<div className="font-title font-black text-2xl text-foreground tabular-nums">
						{stats.readRate}%
					</div>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex items-center gap-2 border-b-[length:var(--border-width)] border-black/15 pb-2">
				<button
					type="button"
					onClick={() => setActiveTab('broadcast')}
					className={cn(
						'flex items-center gap-2 border-[length:var(--border-width)] rounded-md px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider cursor-pointer transition-all',
						activeTab === 'broadcast'
							? 'border-black bg-accent text-black shadow-brutal-xs'
							: 'border-transparent bg-card text-muted-foreground hover:border-black/40 hover:text-foreground',
					)}
				>
					<Send className="size-3.5" />
					<span>Broadcast Center</span>
				</button>
				<button
					type="button"
					onClick={() => setActiveTab('records')}
					className={cn(
						'flex items-center gap-2 border-[length:var(--border-width)] rounded-md px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider cursor-pointer transition-all',
						activeTab === 'records'
							? 'border-black bg-accent text-black shadow-brutal-xs'
							: 'border-transparent bg-card text-muted-foreground hover:border-black/40 hover:text-foreground',
					)}
				>
					<Clock className="size-3.5" />
					<span>Notification Logs ({stats.total})</span>
				</button>
			</div>

			{/* Tab 1: Broadcast Center */}
			{activeTab === 'broadcast' && (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Composer Form */}
					<div className="lg:col-span-7 border-[length:var(--border-width)] border-black rounded-xl p-5 sm:p-6 bg-card shadow-brutal space-y-5">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[length:var(--border-width)] border-black/15 pb-4">
							<div>
								<h3 className="font-title font-black text-lg">Compose Notification</h3>
								<p className="font-mono text-xs text-muted-foreground">
									Target all registered users, active smilers, or an individual account
								</p>
							</div>
							<AdminAiGeneratorDialog
								mode="notification"
								audience={target === 'specific' ? 'specific' : 'all'}
								user={selectedUserObj}
								category={category}
								onApplyNotification={(draft) => {
									setTitle(draft.title);
									setDescription(draft.description);
									setCategory(draft.category);
									setIconType(draft.icon_type);
									if (draft.action_label) setActionLabel(draft.action_label);
									if (draft.action_url) setActionUrl(draft.action_url);
								}}
							/>
						</div>

						{/* Target Audience */}
						<div className="space-y-2">
							<Label className="font-mono text-xs font-bold uppercase tracking-wider">
								Audience Target
							</Label>
							<div className="grid grid-cols-3 gap-2">
								{[
									{ id: 'all', label: 'All Smilers' },
									{ id: 'active_7d', label: 'Active (7D)' },
									{ id: 'specific', label: 'Specific User' },
								].map((t) => (
									<button
										key={t.id}
										type="button"
										onClick={() => setTarget(t.id as any)}
										className={cn(
											'border-[length:var(--border-width)] rounded-md p-2.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer text-center',
											target === t.id
												? 'border-black bg-primary text-primary-foreground shadow-brutal-xs'
												: 'border-black/20 bg-background text-muted-foreground hover:border-black hover:text-foreground',
										)}
									>
										{t.label}
									</button>
								))}
							</div>

							{target === 'specific' && (
								<div className="pt-2">
									<AdminUserCombobox
										value={targetUserId}
										onChange={(val, user) => {
											setTargetUserId(val);
											setSelectedUserObj(user);
										}}
										label="Specific User Recipient"
										placeholder="Search smilers by name, email, or user ID..."
									/>
								</div>
							)}
						</div>

						{/* Category & Icon Picker */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									Category
								</Label>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="w-full h-10 border-[length:var(--border-width)] border-black rounded-md bg-background px-3 font-mono text-xs font-bold cursor-pointer"
								>
									{CATEGORIES.map((c) => (
										<option key={c.id} value={c.id}>
											{c.label}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									Badge Icon
								</Label>
								<select
									value={iconType}
									onChange={(e) => setIconType(e.target.value)}
									className="w-full h-10 border-[length:var(--border-width)] border-black rounded-md bg-background px-3 font-mono text-xs font-bold cursor-pointer"
								>
									{ICONS.map((i) => (
										<option key={i.id} value={i.id}>
											{i.label}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Title */}
						<div className="space-y-2">
							<Label className="font-mono text-xs font-bold uppercase tracking-wider">
								Notification Title
							</Label>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="e.g. Weekend Double Coin Frenzy Live! 🔥"
								className="border-[length:var(--border-width)] border-black font-title font-bold text-sm"
							/>
						</div>

						{/* Description */}
						<MarkdownEditor
							value={description}
							onChange={setDescription}
							label="Description / Message"
							rows={4}
							placeholder="e.g. Smile today before midnight to earn **2x bonus drops** on all genuine detections..."
						/>

						{/* Action Button (Optional) */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									Action Label (Optional)
								</Label>
								<Input
									value={actionLabel}
									onChange={(e) => setActionLabel(e.target.value)}
									placeholder="e.g. Capture Now"
									className="border-[length:var(--border-width)] border-black font-mono text-xs"
								/>
							</div>

							<div className="space-y-2">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									Action URL (Optional)
								</Label>
								<Input
									value={actionUrl}
									onChange={(e) => setActionUrl(e.target.value)}
									placeholder="e.g. /capture or /rewards"
									className="border-[length:var(--border-width)] border-black font-mono text-xs"
								/>
							</div>
						</div>

						{/* Send Confirmation */}
						<div className="pt-2 border-t border-black/15 flex justify-end">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										disabled={isSending || !title.trim() || !description.trim()}
										className="border-[length:var(--border-width)] border-black rounded-md bg-primary font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-sm brutal-lift hover:bg-primary/90"
									>
										<Send className="size-3.5 mr-2" />
										<span>Dispatch Broadcast</span>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="border-2 border-black rounded-xl bg-card shadow-brutal-lg">
									<AlertDialogHeader>
										<AlertDialogTitle className="font-title font-black text-xl">
											Confirm Notification Broadcast
										</AlertDialogTitle>
										<AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
											You are about to dispatch this notification to{' '}
											<strong>
												{target === 'all'
													? 'All Registered Smilers'
													: target === 'active_7d'
													? 'Active Smilers in the last 7 days'
													: selectedUserObj
													? `${selectedUserObj.name} (${selectedUserObj.email})`
													: targetUserId}
											</strong>
											. This action will immediately appear in their notification feed.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel className="border border-black font-mono text-xs uppercase font-bold">
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleBroadcast}
											className="border border-black bg-primary text-primary-foreground font-mono text-xs uppercase font-black shadow-brutal-xs"
										>
											Yes, Dispatch Now
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>

					{/* Live Card Preview */}
					<div className="lg:col-span-5 space-y-4">
						<div className="border-[length:var(--border-width)] border-black rounded-xl p-5 bg-muted/50 shadow-brutal-xs space-y-3">
							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
									<Eye className="size-3.5" />
									Smiler Tray Preview
								</span>
								<span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-accent text-black border border-black rounded">
									Live Preview
								</span>
							</div>
							<p className="font-mono text-[11px] text-muted-foreground leading-tight">
								This is exactly how this notification card will render inside the smiler&apos;s{' '}
								<code>/notifications</code> tray:
							</p>

							{/* Preview Card */}
							<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-card shadow-brutal space-y-3 ring-2 ring-primary/60">
								<div className="flex items-start gap-3">
									<div className="flex size-10 shrink-0 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground shadow-brutal-xs">
										<SelectedIconComponent className="size-5" strokeWidth={2.5} />
									</div>
									<div className="space-y-1 flex-1 min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											<h4 className="font-title font-black text-sm tracking-tight text-foreground truncate">
												{title.trim() || 'Notification Title Preview'}
											</h4>
											<span className="inline-flex items-center px-1.5 py-0.2 font-mono text-[9px] font-black uppercase tracking-wider bg-destructive text-destructive-foreground border border-black rounded">
												Unread
											</span>
										</div>
										<div className="text-xs text-muted-foreground leading-relaxed">
											{description.trim() ? (
												<MarkdownView content={description} />
											) : (
												<p>Your notification message body will appear right here with full contrast and bold formatting.</p>
											)}
										</div>
										<div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-muted-foreground font-bold">
											<Clock className="size-3" />
											<span>Just now • {category}</span>
										</div>
									</div>
								</div>

								{actionLabel.trim() && (
									<div className="pt-2 border-t border-black/10 flex justify-end">
										<div className="inline-flex items-center gap-1.5 h-8 px-3 border-[length:var(--border-width)] border-black rounded-md bg-primary font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-xs">
											<span>{actionLabel}</span>
											<ExternalLink className="size-3" />
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Tab 2: Notification Records & Audit */}
			{activeTab === 'records' && (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal overflow-hidden">
					{/* Search & Filter bar */}
					<div className="p-4 border-b-[length:var(--border-width)] border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								value={recordsSearch}
								onChange={(e) => setRecordsSearch(e.target.value)}
								placeholder="Search by title, body, user email..."
								className="pl-9 border-[length:var(--border-width)] border-black font-mono text-xs"
							/>
						</div>

						<div className="flex items-center gap-2">
							<select
								value={recordsCategory}
								onChange={(e) => setRecordsCategory(e.target.value)}
								className="h-9 border-[length:var(--border-width)] border-black rounded-md bg-background px-3 font-mono text-xs font-bold cursor-pointer"
							>
								<option value="all">All Categories</option>
								{CATEGORIES.map((c) => (
									<option key={c.id} value={c.id}>
										{c.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs font-mono border-collapse">
							<thead>
								<tr className="border-b-[length:var(--border-width)] border-black/15 bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
									<th className="p-3.5">Recipient</th>
									<th className="p-3.5">Category</th>
									<th className="p-3.5">Notification</th>
									<th className="p-3.5">Status</th>
									<th className="p-3.5">Created</th>
									<th className="p-3.5 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y-[length:var(--border-width)] divide-black/10">
								{isLoadingRecords ? (
									<tr>
										<td colSpan={6} className="p-8 text-center text-muted-foreground">
											<RefreshCw className="size-5 animate-spin mx-auto mb-2" />
											Loading notifications...
										</td>
									</tr>
								) : records.length === 0 ? (
									<tr>
										<td colSpan={6} className="p-8 text-center text-muted-foreground">
											No notification records match this query.
										</td>
									</tr>
								) : (
									records.map((r) => (
										<tr key={r.id} className="hover:bg-muted/20 transition-colors">
											<td className="p-3.5 max-w-[180px]">
												<div className="font-bold text-foreground truncate">
													{r.user_name || 'Smiler'}
												</div>
												<div className="text-[11px] text-muted-foreground truncate">
													{r.user_email || r.user_id}
												</div>
											</td>
											<td className="p-3.5">
												<span className="inline-block px-2 py-0.5 border border-black rounded bg-muted text-[10px] uppercase font-bold">
													{r.category}
												</span>
											</td>
											<td className="p-3.5 max-w-[280px]">
												<div className="font-title font-bold text-sm text-foreground truncate">
													{r.title}
												</div>
												<div className="text-[11px] text-muted-foreground truncate line-clamp-1">
													{r.description}
												</div>
											</td>
											<td className="p-3.5">
												{r.read ? (
													<span className="inline-flex items-center gap-1 text-success font-bold">
														<CheckCircle2 className="size-3.5" />
														Read
													</span>
												) : (
													<span className="inline-flex items-center gap-1 text-destructive font-bold">
														<Radio className="size-3.5" />
														Unread
													</span>
												)}
											</td>
											<td className="p-3.5 whitespace-nowrap text-muted-foreground">
												{new Date(r.created_at).toLocaleString(undefined, {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												})}
											</td>
											<td className="p-3.5 text-right">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDeleteRecord(r.id)}
													disabled={deletingId === r.id}
													className="h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
												>
													<Trash2 className="size-3.5" />
												</Button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{recordsTotalPages > 1 && (
						<div className="p-3 border-t-[length:var(--border-width)] border-black/15 flex items-center justify-between bg-muted/20 font-mono text-xs">
							<span className="text-muted-foreground">
								Page {recordsPage} of {recordsTotalPages}
							</span>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={recordsPage <= 1}
									onClick={() => setRecordsPage((p) => Math.max(1, p - 1))}
									className="h-8 border border-black font-mono text-xs font-bold"
								>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={recordsPage >= recordsTotalPages}
									onClick={() => setRecordsPage((p) => Math.min(recordsTotalPages, p + 1))}
									className="h-8 border border-black font-mono text-xs font-bold"
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
