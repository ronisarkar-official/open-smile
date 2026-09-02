"use client";

import * as React from "react";
import {
	Gift,
	Plus,
	RefreshCw,
	CheckCircle2,
	AlertTriangle,
	Sparkles,
	Coins,
	FileText,
	Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PRESET_VOUCHERS = [
	{ id: "amz-250", brand: "Amazon", title: "₹250 Amazon Shopping Voucher" },
	{ id: "amz-500", brand: "Amazon", title: "₹500 Amazon Gift Card" },
	{ id: "amz-1000", brand: "Amazon", title: "₹1,000 Amazon Prime / Pay Voucher" },
	{ id: "flp-250", brand: "Flipkart", title: "₹250 Flipkart E-Gift Card" },
	{ id: "flp-500", brand: "Flipkart", title: "₹500 Flipkart Shopping Voucher" },
	{ id: "swg-150", brand: "Swiggy", title: "₹150 Swiggy Money Voucher" },
	{ id: "swg-300", brand: "Swiggy", title: "₹300 Swiggy Gourmet Card" },
	{ id: "zmt-200", brand: "Zomato", title: "₹200 Zomato Pro Voucher" },
	{ id: "myn-500", brand: "Myntra", title: "₹500 Myntra Fashion Card" },
	{ id: "boat-500", brand: "boAt", title: "₹500 boAt Audio Gear Voucher" },
];

export default function AdminVouchersPage() {
	const { toast } = useToast();
	const [summary, setSummary] = React.useState<any[]>([]);
	const [claims, setClaims] = React.useState<any[]>([]);
	const [totalClaims, setTotalClaims] = React.useState(0);
	const [loading, setLoading] = React.useState(true);

	const [seedModalOpen, setSeedModalOpen] = React.useState(false);
	const [selectedVoucherId, setSelectedVoucherId] = React.useState("amz-250");
	const [codesInput, setCodesInput] = React.useState("");
	const [seeding, setSeeding] = React.useState(false);

	async function fetchData() {
		setLoading(true);
		try {
			const [vRes, cRes] = await Promise.all([
				fetch("/api/admin/vouchers"),
				fetch("/api/admin/vouchers/claims?limit=30"),
			]);
			const [vJson, cJson] = await Promise.all([vRes.json(), cRes.json()]);

			if (vRes.ok) setSummary(vJson.inventorySummary || []);
			if (cRes.ok) {
				setClaims(cJson.claims || []);
				setTotalClaims(cJson.total || 0);
			}
		} catch {
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		fetchData();
	}, []);

	async function handleSeedVouchers(e: React.FormEvent) {
		e.preventDefault();
		const matchedPreset = PRESET_VOUCHERS.find((p) => p.id === selectedVoucherId);
		const rawCodes = codesInput
			.split("\n")
			.map((c) => c.trim())
			.filter(Boolean);

		if (rawCodes.length === 0) {
			toast({ title: "Codes Required", description: "Please enter at least one voucher code.", variant: "warning" });
			return;
		}

		setSeeding(true);
		try {
			const res = await fetch("/api/admin/vouchers/seed", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					voucherId: selectedVoucherId,
					brandName: matchedPreset?.brand || "Brand",
					title: matchedPreset?.title || "Voucher",
					codes: rawCodes,
				}),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to seed vouchers");

			toast({
				title: "Vouchers Seeded",
				description: `Successfully seeded ${json.inserted} new code(s) for ${matchedPreset?.brand}.`,
				variant: "success",
			});
			setSeedModalOpen(false);
			setCodesInput("");
			fetchData();
		} catch (err: any) {
			toast({ title: "Seeding Failed", description: err.message, variant: "error" });
		} finally {
			setSeeding(false);
		}
	}

	return (
		<div className="space-y-8 pb-12">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						Vouchers & Economy
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Reward stock management, batch code seeder, and redemption fulfillment logs
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						onClick={() => setSeedModalOpen(true)}
						className="border-[length:var(--border-width)] border-black bg-accent text-black font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift h-10 px-4"
					>
						<Plus className="size-4 mr-1.5" />
						Seed Codes
					</Button>
					<Button
						onClick={fetchData}
						disabled={loading}
						className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-10 px-4"
					>
						<RefreshCw className={cn("size-3.5 mr-2", loading && "animate-spin")} />
						Refresh
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="font-mono text-xs font-black uppercase text-foreground">
					Catalog Stock Inventory
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{PRESET_VOUCHERS.map((voucher) => {
						const availableItem = summary.find(
							(s) => s.voucher_id === voucher.id && s.status === "available"
						);
						const stockCount = availableItem?.count || 0;

						return (
							<div
								key={voucher.id}
								className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 shadow-brutal-xs flex items-center justify-between"
							>
								<div className="space-y-0.5">
									<span className="font-mono text-[10px] font-black uppercase tracking-wider text-accent">
										{voucher.brand}
									</span>
									<div className="font-black font-title text-sm text-foreground leading-snug truncate max-w-[200px]">
										{voucher.title}
									</div>
								</div>
								<div className="text-right">
									<div
										className={cn(
											"font-mono text-lg font-black",
											stockCount > 0 ? "text-success" : "text-destructive"
										)}
									>
										{stockCount}
									</div>
									<div className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
										In Stock
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Redemption Claims Table */}
			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal overflow-hidden">
				<div className="p-4 border-b-[length:var(--border-width)] border-black bg-muted/40 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="size-4 text-secondary-foreground" />
						<h3 className="font-mono text-xs font-black uppercase text-foreground">
							Voucher Redemption History ({totalClaims})
						</h3>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b-[length:var(--border-width)] border-black/20 bg-muted/20 font-mono text-[11px] font-black uppercase text-foreground">
								<th className="p-3.5">Smiler</th>
								<th className="p-3.5">Provider / Tier</th>
								<th className="p-3.5">Voucher Code</th>
								<th className="p-3.5">Coins Spent</th>
								<th className="p-3.5">Redeemed At</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/10 font-mono text-xs">
							{loading && claims.length === 0 ? (
								<tr>
									<td colSpan={5} className="p-8 text-center text-muted-foreground font-bold">
										Loading claims...
									</td>
								</tr>
							) : claims.length === 0 ? (
								<tr>
									<td colSpan={5} className="p-8 text-center text-muted-foreground font-bold">
										No voucher redemptions logged yet.
									</td>
								</tr>
							) : (
								claims.map((claim) => (
									<tr key={claim.id} className="hover:bg-muted/30 transition-colors">
										<td className="p-3.5">
											<div className="font-bold text-foreground text-sm leading-tight">{claim.user_name}</div>
											<div className="text-[11px] text-muted-foreground">{claim.user_email}</div>
										</td>
										<td className="p-3.5">
											<span className="border border-black rounded-xs bg-primary px-1.5 py-0.5 text-[10px] font-black uppercase text-black">
												{claim.provider || claim.tier}
											</span>
										</td>
										<td className="p-3.5 font-mono font-bold select-all text-foreground">
											{claim.voucher_code}
										</td>
										<td className="p-3.5 font-bold text-secondary-foreground">
											{claim.coins_spent} 🪙
										</td>
										<td className="p-3.5 text-muted-foreground">
											{new Date(claim.claimed_at).toLocaleString()}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Batch Code Seeder Modal */}
			{seedModalOpen ? (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleSeedVouchers}
						className="w-full max-w-lg border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4"
					>
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
							<div className="flex items-center gap-2">
								<Gift className="size-5 text-accent" />
								<h3 className="font-black font-title text-lg text-foreground">Batch Seed Voucher Codes</h3>
							</div>
							<Button
								type="button"
								onClick={() => setSeedModalOpen(false)}
								className="size-7 p-0 border border-black rounded-md bg-card text-foreground"
							>
								✕
							</Button>
						</div>

						<div className="space-y-3">
							<div>
								<label className="block font-mono text-[11px] font-black uppercase text-foreground mb-1">
									Select Voucher Item
								</label>
								<select
									value={selectedVoucherId}
									onChange={(e) => setSelectedVoucherId(e.target.value)}
									className="w-full h-10 px-3 border-[length:var(--border-width)] border-black rounded-lg bg-card font-mono text-xs font-bold"
								>
									{PRESET_VOUCHERS.map((v) => (
										<option key={v.id} value={v.id}>
											[{v.brand}] {v.title}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block font-mono text-[11px] font-black uppercase text-foreground mb-1">
									Voucher Codes (One per line)
								</label>
								<textarea
									required
									rows={6}
									value={codesInput}
									onChange={(e) => setCodesInput(e.target.value)}
									placeholder={`AMZ-X92F-891K-2201\nAMZ-Q81L-441P-9923\nAMZ-K11P-002M-7712`}
									className="w-full p-3 border-[length:var(--border-width)] border-black rounded-lg bg-background font-mono text-xs shadow-brutal-xs"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								onClick={() => setSeedModalOpen(false)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={seeding}
								className="border-[length:var(--border-width)] border-black bg-accent text-black font-mono text-xs font-black uppercase shadow-brutal-xs"
							>
								{seeding ? "Seeding..." : "Seed Codes into Stock"}
							</Button>
						</div>
					</form>
				</div>
			) : null}
		</div>
	);
}
