"use client";

import * as React from "react";
import {
	Camera,
	Search,
	ShieldAlert,
	RefreshCw,
	CheckCircle2,
	AlertTriangle,
	Flag,
	Filter,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CoinIcon } from "@/components/ui/coin-icon";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AdminCapturesPage() {
	const { toast } = useToast();
	const [captures, setCaptures] = React.useState<any[]>([]);
	const [total, setTotal] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [search, setSearch] = React.useState("");
	const [flaggedFilter, setFlaggedFilter] = React.useState("all");
	const [page, setPage] = React.useState(0);
	const pageSize = 20;

	const [flagModalCapture, setFlagModalCapture] = React.useState<any | null>(null);
	const [flagReason, setFlagReason] = React.useState("");
	const [deductCoins, setDeductCoins] = React.useState(true);
	const [flagActionLoading, setFlagActionLoading] = React.useState(false);

	async function fetchCaptures() {
		setLoading(true);
		try {
			const query = new URLSearchParams({
				limit: String(pageSize),
				offset: String(page * pageSize),
			});
			if (search) query.set("search", search);
			if (flaggedFilter === "flagged") query.set("flagged", "true");

			const res = await fetch(`/api/admin/captures?${query.toString()}`);
			const json = await res.json();
			if (res.ok) {
				setCaptures(json.captures || []);
				setTotal(json.total || 0);
			}
		} catch {
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		fetchCaptures();
	}, [page, flaggedFilter]);

	async function handleFlagCapture(e: React.FormEvent) {
		e.preventDefault();
		if (!flagModalCapture) return;

		setFlagActionLoading(true);
		try {
			const res = await fetch(`/api/admin/captures/${flagModalCapture.id}/flag`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ reason: flagReason, deductCoins }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to flag capture");

			toast({
				title: "Capture Flagged",
				description:
					json.clawedBackCoins > 0
						? `Capture flagged and ${json.clawedBackCoins} coins clawed back.`
						: "Capture marked as flagged.",
				variant: "success",
			});
			setFlagModalCapture(null);
			setFlagReason("");
			fetchCaptures();
		} catch (err: any) {
			toast({ title: "Flagging Failed", description: err.message, variant: "error" });
		} finally {
			setFlagActionLoading(false);
		}
	}

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						Smile Captures & Anti-Cheat
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Live recognition audits, score anomalies, duplicate verification, and coin clawbacks
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						onClick={fetchCaptures}
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
						fetchCaptures();
					}}
					className="flex-1 flex items-center gap-2"
				>
					<div className="relative flex-1">
						<Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by user name, email, or capture ID..."
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

				<select
					value={flaggedFilter}
					onChange={(e) => {
						setFlaggedFilter(e.target.value);
						setPage(0);
					}}
					className="h-10 px-3 border-[length:var(--border-width)] border-black rounded-lg bg-card font-mono text-xs font-bold uppercase shadow-brutal-xs"
				>
					<option value="all">All Captures</option>
					<option value="flagged">Flagged Anomaly Only</option>
				</select>
			</div>

			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal overflow-hidden">
				<ScrollArea className="w-full">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b-[length:var(--border-width)] border-black bg-muted/60 font-mono text-[11px] font-black uppercase text-foreground">
								<th className="p-3.5">Capture ID</th>
								<th className="p-3.5">Smiler</th>
								<th className="p-3.5">Score</th>
								<th className="p-3.5">Coins</th>
								<th className="p-3.5">Timestamp</th>
								<th className="p-3.5">Anti-Cheat Status</th>
								<th className="p-3.5 text-right">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/10 font-mono text-xs">
							{loading && captures.length === 0 ? (
								<tr>
									<td colSpan={7} className="p-8 text-center text-muted-foreground font-bold">
										Loading capture logs...
									</td>
								</tr>
							) : captures.length === 0 ? (
								<tr>
									<td colSpan={7} className="p-8 text-center text-muted-foreground font-bold">
										No smile captures found.
									</td>
								</tr>
							) : (
								captures.map((c) => (
									<tr key={c.id} className="hover:bg-muted/30 transition-colors">
										<td className="p-3.5 font-mono text-[11px] font-bold text-muted-foreground select-all">
											{c.id.slice(0, 8)}...
										</td>

										<td className="p-3.5">
											<div className="flex items-center gap-3">
												<Avatar className="size-8 border-[length:var(--border-width)] border-black shadow-brutal-xs shrink-0">
													<AvatarImage src={c.user_image || DEFAULT_AVATAR_URL} alt={c.user_name} className="object-cover" />
													<AvatarFallback className="text-[10px] font-black bg-primary text-primary-foreground">
														{c.user_name?.slice(0, 2).toUpperCase() || 'U'}
													</AvatarFallback>
												</Avatar>
												<div className="min-w-0">
													<div className="font-bold text-foreground text-sm leading-tight truncate">{c.user_name}</div>
													<div className="text-[11px] text-muted-foreground truncate">{c.user_email}</div>
												</div>
											</div>
										</td>

										<td className="p-3.5 font-black">
											<span className="border border-black rounded-xs bg-primary px-2 py-0.5 text-black">
												{c.smile_score}%
											</span>
										</td>

										<td className="p-3.5 font-bold text-foreground">
											<div className="flex items-center gap-1">
												<span>+{c.coins_awarded}</span>
												<CoinIcon size={14} />
											</div>
										</td>

										<td className="p-3.5 text-muted-foreground">
											{new Date(c.created_at).toLocaleString()}
										</td>

										<td className="p-3.5">
											{c.flagged ? (
												<div className="space-y-0.5">
													<span className="border border-destructive rounded-xs bg-destructive/15 px-1.5 py-0.5 text-[10px] font-black text-destructive uppercase">
														FLAGGED
													</span>
													<div className="text-[10px] text-destructive truncate max-w-[160px]">
														{c.flag_reason}
													</div>
												</div>
											) : (
												<span className="border border-success rounded-xs bg-success/15 px-1.5 py-0.5 text-[10px] font-black text-success uppercase">
													VERIFIED
												</span>
											)}
										</td>

										<td className="p-3.5 text-right">
											{!c.flagged ? (
												<Button
													onClick={() => {
														setFlagModalCapture(c);
														setFlagReason("");
														setDeductCoins(true);
													}}
													className="border border-black bg-destructive/15 hover:bg-destructive/30 text-destructive font-mono text-[11px] font-bold shadow-brutal-xs h-8 px-2.5"
												>
													<Flag className="size-3 mr-1" />
													Flag
												</Button>
											) : (
												<span className="text-muted-foreground text-[11px] font-bold">
													Flagged
												</span>
											)}
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
						Showing {captures.length > 0 ? page * pageSize + 1 : 0} – {Math.min((page + 1) * pageSize, total)} of {total} captures
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

			{/* Flag Capture Modal */}
			{flagModalCapture ? (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleFlagCapture}
						className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4"
					>
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
							<div className="flex items-center gap-2">
								<ShieldAlert className="size-5 text-destructive" />
								<h3 className="font-black font-title text-lg text-foreground">Flag Capture as Anomaly</h3>
							</div>
							<Button
								type="button"
								onClick={() => setFlagModalCapture(null)}
								className="size-7 p-0 border border-black rounded-md bg-card text-foreground"
							>
								<X className="size-3.5" />
							</Button>
						</div>

						<p className="font-mono text-xs text-muted-foreground">
							Flag this capture for smiler <strong className="text-foreground">{flagModalCapture.user_name}</strong> (Score: {flagModalCapture.smile_score}%).
						</p>

						<div className="space-y-3">
							<div>
								<label className="block font-mono text-[11px] font-black uppercase text-foreground mb-1">
									Reason for flag
								</label>
								<Input
									required
									placeholder="e.g. Photo submission of static screen / Spoof detected"
									value={flagReason}
									onChange={(e) => setFlagReason(e.target.value)}
									className="border-[length:var(--border-width)] border-black font-mono text-xs shadow-brutal-xs"
								/>
							</div>

							<label className="flex items-center gap-2 cursor-pointer font-mono text-xs select-none">
								<input
									type="checkbox"
									checked={deductCoins}
									onChange={(e) => setDeductCoins(e.target.checked)}
									className="size-4 accent-destructive"
								/>
								<span>Claw back {flagModalCapture.coins_awarded} awarded coins from user balance</span>
							</label>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								onClick={() => setFlagModalCapture(null)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={flagActionLoading}
								className="border-[length:var(--border-width)] border-black bg-destructive text-destructive-foreground font-mono text-xs font-black uppercase shadow-brutal-xs"
							>
								{flagActionLoading ? "Flagging..." : "Confirm Flag & Deduct"}
							</Button>
						</div>
					</form>
				</div>
			) : null}
		</div>
	);
}
