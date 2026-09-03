"use client";

import * as React from "react";
import {
	ScrollText,
	RefreshCw,
	ChevronDown,
	ChevronRight,
	Shield,
	Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AdminLogsPage() {
	const { toast } = useToast();
	const [logs, setLogs] = React.useState<any[]>([]);
	const [total, setTotal] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [page, setPage] = React.useState(0);
	const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
	const pageSize = 25;

	async function fetchLogs(isManual = false) {
		setLoading(true);
		try {
			const res = await fetch(`/api/admin/logs?limit=${pageSize}&offset=${page * pageSize}`);
			const json = await res.json();
			if (res.ok) {
				setLogs(json.logs || []);
				setTotal(json.total || 0);
				if (isManual) {
					toast({ title: "Audit Trail Updated", description: "Latest admin actions loaded.", variant: "info" });
				}
			}
		} catch (err: any) {
			if (isManual) {
				toast({ title: "Failed to load logs", description: err.message, variant: "error" });
			}
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		fetchLogs();
	}, [page]);

	function toggleRow(id: string) {
		setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	}

	function getActionBadge(action: string) {
		switch (action) {
			case "adjust_coins":
				return "bg-primary text-black";
			case "set_role":
				return "bg-accent text-black";
			case "ban_user":
				return "bg-destructive text-destructive-foreground";
			case "flag_capture":
				return "bg-destructive/20 text-destructive";
			case "seed_vouchers":
				return "bg-secondary text-secondary-foreground";
			case "delete_explore_post":
				return "bg-destructive/15 text-destructive";
			case "update_setting":
				return "bg-muted text-foreground";
			default:
				return "bg-black text-white";
		}
	}

	return (
		<div className="space-y-6 pb-12">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						Administrative Audit Trail
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Immutable record of all administrator interventions, coin adjustments, role changes, and system updates
					</p>
				</div>

				<Button
					onClick={() => fetchLogs(true)}
					disabled={loading}
					className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-10 px-4"
				>
					<RefreshCw className={cn("size-3.5 mr-2", loading && "animate-spin")} />
					Refresh Trail
				</Button>
			</div>

			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal overflow-hidden">
				<ScrollArea className="w-full">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b-[length:var(--border-width)] border-black bg-muted/60 font-mono text-[11px] font-black uppercase text-foreground">
								<th className="p-3.5 w-10"></th>
								<th className="p-3.5">Action</th>
								<th className="p-3.5">Admin Email</th>
								<th className="p-3.5">Target</th>
								<th className="p-3.5">Details Preview</th>
								<th className="p-3.5 text-right">Timestamp</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/10 font-mono text-xs">
							{loading && logs.length === 0 ? (
								<tr>
									<td colSpan={6} className="p-8 text-center text-muted-foreground font-bold">
										Loading audit trail...
									</td>
								</tr>
							) : logs.length === 0 ? (
								<tr>
									<td colSpan={6} className="p-8 text-center text-muted-foreground font-bold">
										No audit events recorded yet.
									</td>
								</tr>
							) : (
								logs.map((log) => {
									const isExpanded = Boolean(expandedRows[log.id]);
									return (
										<React.Fragment key={log.id}>
											<tr
												onClick={() => toggleRow(log.id)}
												className="hover:bg-muted/30 transition-colors cursor-pointer select-none"
											>
												<td className="p-3.5 text-center text-muted-foreground">
													{isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
												</td>

												<td className="p-3.5">
													<span
														className={cn(
															"border border-black rounded-xs px-2 py-0.5 text-[10px] font-black uppercase shadow-brutal-xs",
															getActionBadge(log.action)
														)}
													>
														{log.action}
													</span>
												</td>

												<td className="p-3.5 font-bold text-foreground truncate max-w-[200px]">
													{log.admin_email}
												</td>

												<td className="p-3.5 font-semibold text-foreground">
													<span className="uppercase text-[10px] text-muted-foreground mr-1">
														[{log.target_type}]
													</span>
													{log.target_id ? (
														<span className="select-all text-[11px]">{log.target_id.slice(0, 10)}...</span>
													) : (
														"-"
													)}
												</td>

												<td className="p-3.5 text-muted-foreground font-mono text-[11px] truncate max-w-[240px]">
													{JSON.stringify(log.details || {})}
												</td>

												<td className="p-3.5 text-right text-muted-foreground">
													{new Date(log.created_at).toLocaleString()}
												</td>
											</tr>

											{isExpanded ? (
												<tr className="bg-muted/20">
													<td colSpan={6} className="p-4 border-b border-black/10">
														<div className="border border-black rounded-lg bg-black text-green-400 p-3 font-mono text-xs overflow-x-auto">
															<div className="text-white/60 mb-1 text-[10px] uppercase font-bold">
																Full Event Payload (ID: {log.id})
															</div>
															<pre>{JSON.stringify(log, null, 2)}</pre>
														</div>
													</td>
												</tr>
											) : null}
										</React.Fragment>
									);
								})
							)}
						</tbody>
					</table>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>

				<div className="p-3.5 border-t-[length:var(--border-width)] border-black/15 bg-muted/20 flex items-center justify-between font-mono text-xs font-bold text-muted-foreground">
					<span>
						Showing {logs.length > 0 ? page * pageSize + 1 : 0} – {Math.min((page + 1) * pageSize, total)} of {total} events
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
		</div>
	);
}
