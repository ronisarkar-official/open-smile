"use client";

import * as React from "react";
import {
	Users,
	Search,
	Filter,
	Coins,
	Shield,
	Ban,
	CheckCircle2,
	RefreshCw,
	ChevronRight,
	X,
	AlertTriangle,
	Eye,
	History,
	ArrowUpRight,
	ArrowDownRight,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AdminUsersPage() {
	const { toast } = useToast();
	const [users, setUsers] = React.useState<any[]>([]);
	const [total, setTotal] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [search, setSearch] = React.useState("");
	const [roleFilter, setRoleFilter] = React.useState("all");
	const [bannedFilter, setBannedFilter] = React.useState("all");
	const [page, setPage] = React.useState(0);
	const pageSize = 15;

	const [selectedUser, setSelectedUser] = React.useState<any | null>(null);
	const [userDetail, setUserDetail] = React.useState<any | null>(null);
	const [detailLoading, setDetailLoading] = React.useState(false);

	const [coinModalUser, setCoinModalUser] = React.useState<any | null>(null);
	const [coinAmount, setCoinAmount] = React.useState("");
	const [coinReason, setCoinReason] = React.useState("");
	const [coinActionLoading, setCoinActionLoading] = React.useState(false);

	const [roleModalUser, setRoleModalUser] = React.useState<any | null>(null);
	const [selectedRole, setSelectedRole] = React.useState("admin");
	const [roleActionLoading, setRoleActionLoading] = React.useState(false);

	const [banModalUser, setBanModalUser] = React.useState<any | null>(null);
	const [banReason, setBanReason] = React.useState("");
	const [banActionLoading, setBanActionLoading] = React.useState(false);

	const [deleteModalUser, setDeleteModalUser] = React.useState<any | null>(null);
	const [deleteConfirmationInput, setDeleteConfirmationInput] = React.useState("");
	const [deleteActionLoading, setDeleteActionLoading] = React.useState(false);

	async function fetchUsers() {
		setLoading(true);
		try {
			const query = new URLSearchParams({
				limit: String(pageSize),
				offset: String(page * pageSize),
			});
			if (search) query.set("search", search);
			if (roleFilter !== "all") query.set("role", roleFilter);
			if (bannedFilter !== "all") query.set("banned", bannedFilter);

			const res = await fetch(`/api/admin/users?${query.toString()}`);
			const json = await res.json();
			if (res.ok) {
				setUsers(json.users || []);
				setTotal(json.total || 0);
			} else {
				toast({ title: "Failed to load users", description: json.error || "Could not retrieve user directory", variant: "error" });
			}
		} catch (err: any) {
			toast({ title: "Network Error", description: err.message || "Failed to contact admin API", variant: "error" });
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		fetchUsers();
	}, [page, roleFilter, bannedFilter]);

	async function openUserDetail(u: any) {
		setSelectedUser(u);
		setDetailLoading(true);
		try {
			const res = await fetch(`/api/admin/users/${u.id}`);
			const json = await res.json();
			if (res.ok) {
				setUserDetail(json);
			}
		} catch {
		} finally {
			setDetailLoading(false);
		}
	}

	async function handleAdjustCoins(e: React.FormEvent) {
		e.preventDefault();
		if (!coinModalUser) return;
		const amt = Number(coinAmount);
		if (isNaN(amt) || amt === 0) {
			toast({ title: "Invalid Amount", description: "Please enter a valid non-zero coin amount.", variant: "warning" });
			return;
		}

		setCoinActionLoading(true);
		try {
			const res = await fetch(`/api/admin/users/${coinModalUser.id}/adjust-coins`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ amount: amt, reason: coinReason }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to adjust coins");

			toast({
				title: "Coins Adjusted",
				description: `Adjusted ${amt > 0 ? `+${amt}` : amt} coins for ${coinModalUser.name}.`,
				variant: "success",
			});
			setCoinModalUser(null);
			setCoinAmount("");
			setCoinReason("");
			fetchUsers();
			if (selectedUser?.id === coinModalUser.id) {
				openUserDetail(coinModalUser);
			}
		} catch (err: any) {
			toast({ title: "Adjustment Failed", description: err.message, variant: "error" });
		} finally {
			setCoinActionLoading(false);
		}
	}

	async function handleRoleChange(e: React.FormEvent) {
		e.preventDefault();
		if (!roleModalUser) return;

		setRoleActionLoading(true);
		try {
			const res = await fetch(`/api/admin/users/${roleModalUser.id}/role`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role: selectedRole }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to update role");

			toast({
				title: "Role Updated",
				description: `Updated role for ${roleModalUser.name} to ${selectedRole.toUpperCase()}.`,
				variant: "success",
			});
			setRoleModalUser(null);
			fetchUsers();
			if (selectedUser?.id === roleModalUser.id) {
				openUserDetail(roleModalUser);
			}
		} catch (err: any) {
			toast({ title: "Role Update Failed", description: err.message, variant: "error" });
		} finally {
			setRoleActionLoading(false);
		}
	}

	async function handleBanToggle() {
		if (!banModalUser) return;
		const nextBanned = !banModalUser.banned;

		setBanActionLoading(true);
		try {
			const res = await fetch(`/api/admin/users/${banModalUser.id}/ban`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ banned: nextBanned, banReason }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to update ban status");

			toast({
				title: nextBanned ? "User Banned" : "User Unbanned",
				description: nextBanned
					? `Platform access revoked for ${banModalUser.name}.`
					: `Platform access restored for ${banModalUser.name}.`,
				variant: "success",
			});
			setBanModalUser(null);
			setBanReason("");
			fetchUsers();
			if (selectedUser?.id === banModalUser.id) {
				openUserDetail(banModalUser);
			}
		} catch (err: any) {
			toast({ title: "Ban Toggle Failed", description: err.message, variant: "error" });
		} finally {
			setBanActionLoading(false);
		}
	}

	async function handleDeleteUser() {
		if (!deleteModalUser) return;

		setDeleteActionLoading(true);
		try {
			const res = await fetch(`/api/admin/users/${deleteModalUser.id}`, {
				method: "DELETE",
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to delete user");

			toast({
				title: "User Permanently Deleted",
				description: `Purged account and data for ${deleteModalUser.name} (${deleteModalUser.email}).`,
				variant: "success",
			});
			setDeleteModalUser(null);
			setDeleteConfirmationInput("");
			if (selectedUser?.id === deleteModalUser.id) {
				setSelectedUser(null);
				setUserDetail(null);
			}
			fetchUsers();
		} catch (err: any) {
			toast({ title: "Delete User Failed", description: err.message, variant: "error" });
		} finally {
			setDeleteActionLoading(false);
		}
	}

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						Users & Roles
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Directory of registered smilers, roles assignment, wallet adjustments, and anti-cheat bans
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						onClick={() => fetchUsers()}
						disabled={loading}
						className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-10 px-4"
					>
						<RefreshCw className={cn("size-3.5 mr-2", loading && "animate-spin")} />
						Refresh
					</Button>
				</div>
			</div>

			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 shadow-brutal-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setPage(0);
						fetchUsers();
					}}
					className="flex-1 flex items-center gap-2"
				>
					<div className="relative flex-1">
						<Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name, email, or user ID..."
							className="pl-9 h-10 border-[length:var(--border-width)] border-black bg-background font-mono text-xs shadow-brutal-xs"
						/>
					</div>
					<Button
						type="submit"
						className="border-[length:var(--border-width)] border-black bg-primary text-black font-mono text-xs font-black uppercase shadow-brutal-xs h-10 px-4"
					>
						Search
					</Button>
				</form>

				<div className="flex items-center gap-2">
					<select
						value={roleFilter}
						onChange={(e) => {
							setRoleFilter(e.target.value);
							setPage(0);
						}}
						className="h-10 px-3 border-[length:var(--border-width)] border-black rounded-lg bg-card font-mono text-xs font-bold uppercase shadow-brutal-xs"
					>
						<option value="all">All Roles</option>
						<option value="admin">Admins</option>
						<option value="user">Users</option>
					</select>

					<select
						value={bannedFilter}
						onChange={(e) => {
							setBannedFilter(e.target.value);
							setPage(0);
						}}
						className="h-10 px-3 border-[length:var(--border-width)] border-black rounded-lg bg-card font-mono text-xs font-bold uppercase shadow-brutal-xs"
					>
						<option value="all">All Status</option>
						<option value="false">Active</option>
						<option value="true">Banned</option>
					</select>
				</div>
			</div>

			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal overflow-hidden">
				<ScrollArea className="w-full">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b-[length:var(--border-width)] border-black bg-muted/60 font-mono text-[11px] font-black uppercase text-foreground">
								<th className="p-3.5">User</th>
								<th className="p-3.5">Role</th>
								<th className="p-3.5">Wallet Balance</th>
								<th className="p-3.5">Streak</th>
								<th className="p-3.5">Captures</th>
								<th className="p-3.5">Status</th>
								<th className="p-3.5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/10 font-mono text-xs">
							{loading && users.length === 0 ? (
								<tr>
									<td colSpan={7} className="p-8 text-center text-muted-foreground font-bold">
										Loading user directory...
									</td>
								</tr>
							) : users.length === 0 ? (
								<tr>
									<td colSpan={7} className="p-8 text-center text-muted-foreground font-bold">
										No users matched the criteria.
									</td>
								</tr>
							) : (
								users.map((u) => (
									<tr key={u.id} className="hover:bg-muted/30 transition-colors">
										<td className="p-3.5">
											<div className="flex items-center gap-3">
												<Avatar className="size-9 border-[length:var(--border-width)] border-black shadow-brutal-xs shrink-0">
													<AvatarImage src={u.image || DEFAULT_AVATAR_URL} alt={u.name} className="object-cover" />
													<AvatarFallback className="text-xs font-black bg-primary text-primary-foreground">
														{u.name?.slice(0, 2).toUpperCase() || 'U'}
													</AvatarFallback>
												</Avatar>
												<div className="min-w-0">
													<div className="font-bold text-foreground text-sm leading-tight truncate">{u.name}</div>
													<div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
												</div>
											</div>
										</td>

										<td className="p-3.5">
											{u.role === "admin" ? (
												<span className="border border-black rounded-xs bg-accent px-1.5 py-0.5 text-[10px] font-black uppercase text-black">
													Admin
												</span>
											) : (
												<span className="border border-black/30 rounded-xs bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
													User
												</span>
											)}
										</td>

										<td className="p-3.5 font-bold text-foreground">
											{Number(u.coin_balance || 0).toLocaleString()} 🪙
										</td>

										<td className="p-3.5">
											<span className="inline-flex items-center gap-1 font-bold">
												🔥 {u.streak_count || 0}
											</span>
										</td>

										<td className="p-3.5 text-muted-foreground font-semibold">
											{u.captures_count || 0}
										</td>

										<td className="p-3.5">
											{u.banned ? (
												<span className="border border-destructive rounded-xs bg-destructive/15 px-1.5 py-0.5 text-[10px] font-black text-destructive uppercase">
													Banned
												</span>
											) : (
												<span className="border border-success rounded-xs bg-success/15 px-1.5 py-0.5 text-[10px] font-black text-success uppercase">
													Active
												</span>
											)}
										</td>

										<td className="p-3.5 text-right">
											<div className="flex items-center justify-end gap-1.5">
												<Button
													onClick={() => openUserDetail(u)}
													className="size-8 p-0 border border-black rounded-md bg-card hover:bg-muted text-foreground shadow-brutal-xs"
													title="View details"
												>
													<Eye className="size-3.5" />
												</Button>

												<Button
													onClick={() => {
														setCoinModalUser(u);
														setCoinAmount("");
														setCoinReason("");
													}}
													className="size-8 p-0 border border-black rounded-md bg-primary hover:bg-primary/80 text-black shadow-brutal-xs"
													title="Adjust coins"
												>
													<Coins className="size-3.5" />
												</Button>

												<Button
													onClick={() => {
														setRoleModalUser(u);
														setSelectedRole(u.role === "admin" ? "user" : "admin");
													}}
													className="size-8 p-0 border border-black rounded-md bg-accent hover:bg-accent/80 text-black shadow-brutal-xs"
													title="Change role"
												>
													<Shield className="size-3.5" />
												</Button>

												<Button
													onClick={() => {
														setBanModalUser(u);
														setBanReason(u.banReason || "");
													}}
													className={cn(
														"size-8 p-0 border border-black rounded-md shadow-brutal-xs",
														u.banned
															? "bg-success/20 text-success hover:bg-success/30"
															: "bg-destructive/20 text-destructive hover:bg-destructive/30"
													)}
													title={u.banned ? "Unban user" : "Ban user"}
												>
													<Ban className="size-3.5" />
												</Button>

												<Button
													onClick={() => {
														setDeleteModalUser(u);
														setDeleteConfirmationInput("");
													}}
													className="size-8 p-0 border border-black rounded-md bg-destructive/15 text-destructive hover:bg-destructive hover:text-white shadow-brutal-xs"
													title="Delete user permanently"
												>
													<Trash2 className="size-3.5" />
												</Button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>

				<div className="p-3.5 border-t-[length:var(--border-width)] border-black/15 bg-muted/20 flex items-center justify-between font-mono text-xs font-bold text-muted-foreground">
					<span>
						Showing {users.length > 0 ? page * pageSize + 1 : 0} – {Math.min((page + 1) * pageSize, total)} of {total} users
					</span>
					<div className="flex items-center gap-2">
						<Button
							onClick={() => setPage((p) => Math.max(0, p - 1))}
							disabled={page === 0}
							className="h-8 px-3 border border-black rounded-md bg-card text-foreground font-mono text-xs font-bold shadow-brutal-xs"
						>
							Prev
						</Button>
						<Button
							onClick={() => setPage((p) => p + 1)}
							disabled={(page + 1) * pageSize >= total}
							className="h-8 px-3 border border-black rounded-md bg-card text-foreground font-mono text-xs font-bold shadow-brutal-xs"
						>
							Next
						</Button>
					</div>
				</div>
			</div>

			{/* User Detail Drawer */}
			{selectedUser ? (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
					<div className="w-full max-w-xl bg-card border-l-[length:var(--border-width)] border-black h-full flex flex-col shadow-brutal overflow-hidden">
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 p-6 shrink-0">
							<div className="flex items-center gap-3 min-w-0">
								<Avatar className="size-12 border-[length:var(--border-width)] border-black shadow-brutal-xs shrink-0">
									<AvatarImage src={userDetail?.user?.image || selectedUser.image || DEFAULT_AVATAR_URL} alt={selectedUser.name} className="object-cover" />
									<AvatarFallback className="text-sm font-black bg-primary text-primary-foreground">
										{selectedUser.name?.slice(0, 2).toUpperCase() || 'U'}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0">
									<span className="font-mono text-[10px] font-black uppercase text-accent tracking-wider">
										User Dossier
									</span>
									<h2 className="text-2xl font-black font-title text-foreground truncate">
										{selectedUser.name}
									</h2>
								</div>
							</div>
							<Button
								onClick={() => setSelectedUser(null)}
								className="size-8 p-0 border border-black rounded-md bg-card text-foreground shrink-0 ml-3"
							>
								<X className="size-4" />
							</Button>
						</div>

						<ScrollArea className="flex-1 p-6">
							{detailLoading ? (
							<div className="py-12 text-center font-mono text-xs font-bold text-muted-foreground">
								Loading user dossier...
							</div>
						) : userDetail ? (
							<div className="space-y-6">
								<div className="grid grid-cols-2 gap-3">
									<div className="border border-black rounded-lg p-3 bg-muted/40 font-mono text-xs">
										<div className="text-[10px] font-black uppercase text-muted-foreground">Coin Balance</div>
										<div className="text-xl font-black text-foreground mt-0.5">
											{Number(userDetail.balance || 0).toLocaleString()} 🪙
										</div>
									</div>
									<div className="border border-black rounded-lg p-3 bg-muted/40 font-mono text-xs">
										<div className="text-[10px] font-black uppercase text-muted-foreground">Smile Streak</div>
										<div className="text-xl font-black text-foreground mt-0.5">
											🔥 {userDetail.user.streak_count || 0} Days
										</div>
									</div>
								</div>

								<div className="border border-black rounded-lg p-4 bg-card font-mono text-xs space-y-2">
									<div className="flex justify-between border-b border-black/10 pb-1.5">
										<span className="text-muted-foreground font-bold">User ID:</span>
										<span className="font-bold select-all">{userDetail.user.id}</span>
									</div>
									<div className="flex justify-between border-b border-black/10 pb-1.5">
										<span className="text-muted-foreground font-bold">Email:</span>
										<span className="font-bold">{userDetail.user.email}</span>
									</div>
									<div className="flex justify-between border-b border-black/10 pb-1.5">
										<span className="text-muted-foreground font-bold">Role:</span>
										<span className="font-black uppercase">{userDetail.user.role}</span>
									</div>
									<div className="flex justify-between border-b border-black/10 pb-1.5">
										<span className="text-muted-foreground font-bold">Status:</span>
										<span className="font-black uppercase text-destructive">
											{userDetail.user.banned ? "BANNED" : "ACTIVE"}
										</span>
									</div>
									{userDetail.user.banned && userDetail.user.banReason ? (
										<div className="flex justify-between border-b border-black/10 pb-1.5">
											<span className="text-muted-foreground font-bold">Ban Reason:</span>
											<span className="font-bold text-destructive">{userDetail.user.banReason}</span>
										</div>
									) : null}
									<div className="flex justify-between">
										<span className="text-muted-foreground font-bold">Registered:</span>
										<span className="font-bold">
											{new Date(userDetail.user.created_at).toLocaleDateString()}
										</span>
									</div>
								</div>

								{/* Recent Coin Ledger Movements */}
								<div className="space-y-2">
									<h4 className="font-mono text-xs font-black uppercase text-foreground flex items-center gap-1.5">
										<History className="size-3.5" /> Recent Coin Movements
									</h4>
									<ScrollArea className="max-h-48 w-full border border-black/10 rounded-md p-1.5 bg-muted/10">
										<div className="space-y-1.5 pr-3">
											{userDetail.ledger?.map((l: any) => (
												<div
													key={l.id}
													className="flex items-center justify-between p-2.5 rounded-md border border-black/10 bg-card font-mono text-[11px]"
												>
													<span className="truncate max-w-[240px]">{l.reason}</span>
													<span
														className={cn(
															"font-black",
															l.coins >= 0 ? "text-success" : "text-destructive"
														)}
													>
														{l.coins >= 0 ? `+${l.coins}` : l.coins} 🪙
													</span>
												</div>
											))}
										</div>
									</ScrollArea>
								</div>

								<div className="pt-4 border-t border-black/15">
									<Button
										onClick={() => {
											setDeleteModalUser(userDetail.user);
											setDeleteConfirmationInput("");
										}}
										className="w-full border-[length:var(--border-width)] border-black bg-destructive/15 hover:bg-destructive text-destructive hover:text-white font-mono text-xs font-black uppercase shadow-brutal-xs"
									>
										<Trash2 className="size-4 mr-2" />
										Permanently Delete User Account
									</Button>
								</div>
							</div>
						) : null}
						</ScrollArea>
					</div>
				</div>
			) : null}

			{/* Coin Adjustment Modal */}
			{coinModalUser ? (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleAdjustCoins}
						className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4"
					>
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
							<div className="flex items-center gap-2">
								<Coins className="size-5 text-primary" />
								<h3 className="font-black font-title text-lg text-foreground">Adjust Coins</h3>
							</div>
							<Button
								type="button"
								onClick={() => setCoinModalUser(null)}
								className="size-7 p-0 border border-black rounded-md bg-card text-foreground"
							>
								<X className="size-3.5" />
							</Button>
						</div>

						<p className="font-mono text-xs text-muted-foreground">
							Manually grant or deduct coins for <strong className="text-foreground">{coinModalUser.name}</strong>. All adjustments are permanently audited.
						</p>

						<div className="space-y-3">
							<div>
								<label className="block font-mono text-[11px] font-black uppercase text-foreground mb-1">
									Amount (positive to add, negative to deduct)
								</label>
								<Input
									type="number"
									required
									placeholder="e.g. 50 or -25"
									value={coinAmount}
									onChange={(e) => setCoinAmount(e.target.value)}
									className="border-[length:var(--border-width)] border-black font-mono text-sm shadow-brutal-xs"
								/>
							</div>

							<div>
								<label className="block font-mono text-[11px] font-black uppercase text-foreground mb-1">
									Reason / Audit Note
								</label>
								<Input
									required
									placeholder="e.g. Contest bonus or Manual refund"
									value={coinReason}
									onChange={(e) => setCoinReason(e.target.value)}
									className="border-[length:var(--border-width)] border-black font-mono text-xs shadow-brutal-xs"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								onClick={() => setCoinModalUser(null)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={coinActionLoading}
								className="border-[length:var(--border-width)] border-black bg-primary text-black font-mono text-xs font-black uppercase shadow-brutal-xs"
							>
								{coinActionLoading ? "Adjusting..." : "Confirm Adjustment"}
							</Button>
						</div>
					</form>
				</div>
			) : null}

			{/* Role Switcher Modal */}
			{roleModalUser ? (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleRoleChange}
						className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4"
					>
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
							<div className="flex items-center gap-2">
								<Shield className="size-5 text-accent" />
								<h3 className="font-black font-title text-lg text-foreground">Change User Role</h3>
							</div>
							<Button
								type="button"
								onClick={() => setRoleModalUser(null)}
								className="size-7 p-0 border border-black rounded-md bg-card text-foreground"
							>
								<X className="size-3.5" />
							</Button>
						</div>

						<p className="font-mono text-xs text-muted-foreground">
							Update permissions for <strong className="text-foreground">{roleModalUser.name}</strong>. Admins have complete access to the Control Panel.
						</p>

						<div className="space-y-2">
							<label
								onClick={() => setSelectedRole("admin")}
								className={cn(
									"flex items-center justify-between p-3.5 rounded-lg border-[length:var(--border-width)] cursor-pointer font-mono text-xs select-none transition-all",
									selectedRole === "admin"
										? "border-black bg-accent text-black shadow-brutal-xs"
										: "border-black/20 hover:border-black/50"
								)}
							>
								<div>
									<div className="font-black uppercase">Administrator</div>
									<div className="text-[10px] text-muted-foreground">Full platform access</div>
								</div>
								<input
									type="radio"
									checked={selectedRole === "admin"}
									onChange={() => setSelectedRole("admin")}
									className="accent-black"
								/>
							</label>

							<label
								onClick={() => setSelectedRole("user")}
								className={cn(
									"flex items-center justify-between p-3.5 rounded-lg border-[length:var(--border-width)] cursor-pointer font-mono text-xs select-none transition-all",
									selectedRole === "user"
										? "border-black bg-primary text-black shadow-brutal-xs"
										: "border-black/20 hover:border-black/50"
								)}
							>
								<div>
									<div className="font-black uppercase">Standard User</div>
									<div className="text-[10px] text-muted-foreground">Normal app capabilities</div>
								</div>
								<input
									type="radio"
									checked={selectedRole === "user"}
									onChange={() => setSelectedRole("user")}
									className="accent-black"
								/>
							</label>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								onClick={() => setRoleModalUser(null)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={roleActionLoading}
								className="border-[length:var(--border-width)] border-black bg-accent text-black font-mono text-xs font-black uppercase shadow-brutal-xs"
							>
								{roleActionLoading ? "Updating..." : "Save Role"}
							</Button>
						</div>
					</form>
				</div>
			) : null}

			{/* Ban / Unban Modal */}
			{banModalUser ? (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4">
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
							<div className="flex items-center gap-2">
								<Ban className="size-5 text-destructive" />
								<h3 className="font-black font-title text-lg text-foreground">
									{banModalUser.banned ? "Unban Smiler" : "Ban Smiler"}
								</h3>
							</div>
							<Button
								type="button"
								onClick={() => setBanModalUser(null)}
								className="size-7 p-0 border border-black rounded-md bg-card text-foreground"
							>
								<X className="size-3.5" />
							</Button>
						</div>

						<p className="font-mono text-xs text-muted-foreground">
							{banModalUser.banned
								? `Restore platform access for ${banModalUser.name}?`
								: `Revoke platform access for ${banModalUser.name}. This will invalidate all active sessions.`}
						</p>

						{!banModalUser.banned ? (
							<div>
								<label className="block font-mono text-[11px] font-black uppercase text-foreground mb-1">
									Ban Reason
								</label>
								<Input
									placeholder="e.g. Anti-cheat bypass attempt"
									value={banReason}
									onChange={(e) => setBanReason(e.target.value)}
									className="border-[length:var(--border-width)] border-black font-mono text-xs shadow-brutal-xs"
								/>
							</div>
						) : null}

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								onClick={() => setBanModalUser(null)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground"
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleBanToggle}
								disabled={banActionLoading}
								className={cn(
									"border-[length:var(--border-width)] border-black font-mono text-xs font-black uppercase shadow-brutal-xs",
									banModalUser.banned
										? "bg-success text-white hover:bg-success/90"
										: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
								)}
							>
								{banActionLoading ? "Processing..." : banModalUser.banned ? "Confirm Unban" : "Confirm Ban"}
							</Button>
						</div>
					</div>
				</div>
			) : null}

			{/* Delete User Modal */}
			{deleteModalUser ? (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4">
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
							<div className="flex items-center gap-2">
								<div className="size-8 rounded-md border border-black bg-destructive text-white flex items-center justify-center">
									<Trash2 className="size-4" />
								</div>
								<h3 className="font-black font-title text-lg text-foreground">
									Delete Smiler Permanently
								</h3>
							</div>
							<Button
								type="button"
								onClick={() => setDeleteModalUser(null)}
								className="size-7 p-0 border border-black rounded-md bg-card text-foreground"
							>
								<X className="size-3.5" />
							</Button>
						</div>

						<div className="border border-destructive/30 rounded-lg bg-destructive/10 p-3 space-y-1">
							<p className="font-mono text-xs font-bold text-destructive">
								Warning: This action is permanent and cannot be undone!
							</p>
							<p className="font-mono text-[11px] text-muted-foreground">
								This will permanently purge all smile captures, ledger records, scratch cards, reward claims, referrals, and active sessions for <strong className="text-foreground">{deleteModalUser.name}</strong> ({deleteModalUser.email}).
							</p>
						</div>

						<div className="space-y-2">
							<label className="block font-mono text-[11px] font-black uppercase text-foreground">
								Type <span className="text-destructive font-black">DELETE</span> to confirm:
							</label>
							<Input
								value={deleteConfirmationInput}
								onChange={(e) => setDeleteConfirmationInput(e.target.value)}
								placeholder="Type DELETE"
								className="border-[length:var(--border-width)] border-black font-mono text-xs shadow-brutal-xs"
							/>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								onClick={() => setDeleteModalUser(null)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground"
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleDeleteUser}
								disabled={deleteActionLoading || deleteConfirmationInput.trim() !== "DELETE"}
								className="border-[length:var(--border-width)] border-black bg-destructive text-white hover:bg-destructive/90 font-mono text-xs font-black uppercase shadow-brutal-xs disabled:opacity-50"
							>
								{deleteActionLoading ? "Deleting..." : "Permanently Delete"}
							</Button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
