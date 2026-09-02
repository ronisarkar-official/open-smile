"use client";

import * as React from "react";
import {
	Gift,
	Plus,
	RefreshCw,
	Sparkles,
	Coins,
	FileText,
	Building2,
	IndianRupee,
	Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CatalogVoucher {
	id: string;
	brandName: string;
	title: string;
	description?: string;
	category: string;
	imageUrl?: string;
	numericValue: number;
	coinsCost: number;
	highlightTag?: string;
	isActive?: boolean;
}

export default function AdminVouchersPage() {
	const { toast } = useToast();
	const [catalog, setCatalog] = React.useState<CatalogVoucher[]>([]);
	const [summary, setSummary] = React.useState<any[]>([]);
	const [claims, setClaims] = React.useState<any[]>([]);
	const [totalClaims, setTotalClaims] = React.useState(0);
	const [loading, setLoading] = React.useState(true);

	// Create New Voucher Modal
	const [createModalOpen, setCreateModalOpen] = React.useState(false);
	const [creating, setCreating] = React.useState(false);
	const [newBrand, setNewBrand] = React.useState("");
	const [newTitle, setNewTitle] = React.useState("");
	const [newMoney, setNewMoney] = React.useState("500");
	const [newCoins, setNewCoins] = React.useState("1000");
	const [newCategory, setNewCategory] = React.useState("ecommerce");
	const [newImage, setNewImage] = React.useState("");
	const [newHighlight, setNewHighlight] = React.useState("Featured");
	const [newCodes, setNewCodes] = React.useState("");

	// Seed Codes Modal
	const [seedModalOpen, setSeedModalOpen] = React.useState(false);
	const [selectedVoucherId, setSelectedVoucherId] = React.useState("");
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

			if (vRes.ok) {
				setSummary(vJson.inventorySummary || []);
				const catalogItems = vJson.catalog || [];
				setCatalog(catalogItems);
				if (catalogItems.length > 0 && !selectedVoucherId) {
					setSelectedVoucherId(catalogItems[0].id);
				}
			}
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

	async function handleCreateVoucher(e: React.FormEvent) {
		e.preventDefault();
		if (!newBrand.trim() || !newTitle.trim()) {
			toast({ title: "Required Fields", description: "Please provide both Company name and Voucher title.", variant: "warning" });
			return;
		}

		setCreating(true);
		const rawCodes = newCodes
			.split("\n")
			.map((c) => c.trim())
			.filter(Boolean);

		try {
			const res = await fetch("/api/admin/vouchers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					brand_name: newBrand.trim(),
					title: newTitle.trim(),
					numeric_value: Number(newMoney) || 100,
					coins_cost: Number(newCoins) || 200,
					category: newCategory,
					image_url: newImage.trim() || undefined,
					highlight_tag: newHighlight.trim() || undefined,
					codes: rawCodes,
				}),
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to create voucher");

			toast({
				title: "Voucher Created!",
				description: `Added "${newTitle}" for ${newBrand} with ${json.insertedCodes || 0} secret codes seeded.`,
				variant: "success",
			});

			setCreateModalOpen(false);
			setNewBrand("");
			setNewTitle("");
			setNewImage("");
			setNewCodes("");
			fetchData();
		} catch (err: any) {
			toast({ title: "Creation Failed", description: err.message, variant: "error" });
		} finally {
			setCreating(false);
		}
	}

	async function handleSeedVouchers(e: React.FormEvent) {
		e.preventDefault();
		const matched = catalog.find((p) => p.id === selectedVoucherId);
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
					brandName: matched?.brandName || "Brand",
					title: matched?.title || "Voucher",
					codes: rawCodes,
				}),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to seed vouchers");

			toast({
				title: "Vouchers Seeded",
				description: `Successfully seeded ${json.inserted} new code(s) for ${matched?.brandName}.`,
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
						Dynamic voucher catalog, custom brand creator, and secret code inventory
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button
						onClick={() => setCreateModalOpen(true)}
						className="border-[length:var(--border-width)] border-black bg-primary text-black font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift h-10 px-4"
					>
						<Plus className="size-4 mr-1.5" />
						Add Brand Voucher
					</Button>
					<Button
						onClick={() => setSeedModalOpen(true)}
						className="border-[length:var(--border-width)] border-black bg-accent text-black font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift h-10 px-4"
					>
						<Gift className="size-4 mr-1.5" />
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

			{/* Dynamic Catalog Grid */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="font-mono text-xs font-black uppercase text-foreground">
						Live Catalog Vouchers ({catalog.length})
					</h3>
					<span className="font-mono text-[11px] text-muted-foreground">
						Total Claims: <strong>{totalClaims}</strong>
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{catalog.map((voucher) => {
						const availableItem = summary.find(
							(s) => s.voucher_id === voucher.id && s.status === "available"
						);
						const stockCount = availableItem?.count || 0;

						return (
							<div
								key={voucher.id}
								className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 shadow-brutal-xs flex flex-col justify-between gap-3 relative overflow-hidden"
							>
								{voucher.highlightTag && (
									<div className="absolute top-2 right-2 border border-black rounded-xs bg-secondary px-1.5 py-0.5 font-mono text-[9px] font-black uppercase text-secondary-foreground shadow-brutal-2xs">
										{voucher.highlightTag}
									</div>
								)}

								<div className="space-y-1">
									<div className="flex items-center gap-1.5">
										<span className="font-mono text-[10px] font-black uppercase tracking-wider text-accent border border-black/20 rounded-xs px-1.5 py-0.5 bg-muted">
											{voucher.brandName}
										</span>
										<span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
											{voucher.category}
										</span>
									</div>
									<div className="font-black font-title text-sm text-foreground leading-snug truncate pr-14">
										{voucher.title}
									</div>
								</div>

								<div className="flex items-end justify-between border-t border-black/10 pt-2 font-mono">
									<div>
										<div className="text-[11px] font-bold text-foreground">
											Value: ₹{voucher.numericValue}
										</div>
										<div className="text-[11px] font-extrabold text-secondary-foreground">
											Cost: {voucher.coinsCost} 🪙
										</div>
									</div>

									<div className="text-right">
										<div
											className={cn(
												"text-lg font-black leading-none",
												stockCount > 0 ? "text-success" : "text-destructive"
											)}
										>
											{stockCount}
										</div>
										<div className="text-[9px] font-bold uppercase text-muted-foreground mt-0.5">
											In Stock
										</div>
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

			{/* Create New Custom Voucher Modal */}
			{createModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleCreateVoucher}
						className="w-full max-w-lg border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4 max-h-[90vh] overflow-y-auto"
					>
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-3">
							<div className="flex items-center gap-2">
								<Building2 className="size-5 text-primary" />
								<h3 className="font-black font-title text-lg text-foreground">Add New Brand Voucher</h3>
							</div>
							<Button
								type="button"
								onClick={() => setCreateModalOpen(false)}
								className="size-7 p-0 border border-black rounded-md bg-card text-foreground"
							>
								✕
							</Button>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
							<div>
								<label className="block font-black uppercase text-foreground mb-1">
									Company / Brand Name *
								</label>
								<Input
									required
									placeholder="e.g. Starbucks, Nike, Swiggy"
									value={newBrand}
									onChange={(e) => setNewBrand(e.target.value)}
									className="border-[length:var(--border-width)] border-black rounded-lg"
								/>
							</div>

							<div>
								<label className="block font-black uppercase text-foreground mb-1">
									Category
								</label>
								<select
									value={newCategory}
									onChange={(e) => setNewCategory(e.target.value)}
									className="w-full h-10 px-3 border-[length:var(--border-width)] border-black rounded-lg bg-card font-bold"
								>
									<option value="ecommerce">Ecommerce</option>
									<option value="food">Food & Dining</option>
									<option value="fashion">Fashion & Lifestyle</option>
									<option value="audio">Audio & Electronics</option>
									<option value="entertainment">Entertainment</option>
								</select>
							</div>

							<div className="sm:col-span-2">
								<label className="block font-black uppercase text-foreground mb-1">
									Voucher Title / Name *
								</label>
								<Input
									required
									placeholder="e.g. ₹500 Starbucks Coffee Gift Card"
									value={newTitle}
									onChange={(e) => setNewTitle(e.target.value)}
									className="border-[length:var(--border-width)] border-black rounded-lg"
								/>
							</div>

							<div>
								<label className="block font-black uppercase text-foreground mb-1">
									Money Value in ₹ *
								</label>
								<Input
									required
									type="number"
									min="1"
									placeholder="500"
									value={newMoney}
									onChange={(e) => setNewMoney(e.target.value)}
									className="border-[length:var(--border-width)] border-black rounded-lg"
								/>
							</div>

							<div>
								<label className="block font-black uppercase text-foreground mb-1">
									Cost in Smile Coins *
								</label>
								<Input
									required
									type="number"
									min="1"
									placeholder="1000"
									value={newCoins}
									onChange={(e) => setNewCoins(e.target.value)}
									className="border-[length:var(--border-width)] border-black rounded-lg"
								/>
							</div>

							<div className="sm:col-span-2">
								<label className="block font-black uppercase text-foreground mb-1">
									Image / Logo URL (Optional)
								</label>
								<Input
									placeholder="https://ik.imagekit.io/... or https://..."
									value={newImage}
									onChange={(e) => setNewImage(e.target.value)}
									className="border-[length:var(--border-width)] border-black rounded-lg"
								/>
							</div>

							<div className="sm:col-span-2">
								<label className="block font-black uppercase text-foreground mb-1">
									Initial Secret Codes (One per line)
								</label>
								<textarea
									rows={4}
									value={newCodes}
									onChange={(e) => setNewCodes(e.target.value)}
									placeholder={`SBX-9912-3341\nSBX-8812-7719`}
									className="w-full p-3 border-[length:var(--border-width)] border-black rounded-lg bg-background font-mono text-xs shadow-brutal-xs"
								/>
								<p className="text-[10px] text-muted-foreground mt-1">
									Codes are securely saved in stock and dispensed one-by-one to users upon redemption.
								</p>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-3 border-t border-black/10">
							<Button
								type="button"
								onClick={() => setCreateModalOpen(false)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={creating}
								className="border-[length:var(--border-width)] border-black bg-primary text-black font-mono text-xs font-black uppercase shadow-brutal-xs"
							>
								{creating ? "Creating..." : "Save Voucher to Catalog"}
							</Button>
						</div>
					</form>
				</div>
			)}

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
									{catalog.map((v) => (
										<option key={v.id} value={v.id}>
											[{v.brandName}] {v.title} (₹{v.numericValue})
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
									placeholder={`CODE-X92F-891K-2201\nCODE-Q81L-441P-9923`}
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
