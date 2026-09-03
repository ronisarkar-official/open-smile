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
	Pencil,
	Trash2,
	Upload,
	X,
	Search,
	AlertTriangle,
	Loader2,
	Eye,
	EyeOff,
	Tag,
	Tv,
	Percent,
	Ticket,
	ShieldCheck,
	Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { convertToWebP } from "@/lib/convert-to-webp";

type VoucherType = "discount" | "subscription" | "gift_card" | "perk";

interface CatalogVoucher {
	id: string;
	brandName: string;
	title: string;
	description?: string;
	category: string;
	imageUrl?: string;
	voucherType?: VoucherType;
	valueFormatted?: string;
	numericValue: number;
	coinsCost: number;
	highlightTag?: string;
	isActive?: boolean;
}

const VOUCHER_TYPES: { id: VoucherType; label: string; icon: React.ElementType; desc: string }[] = [
	{ id: "discount", label: "Discount / Coupon", icon: Percent, desc: "% or ₹ off code" },
	{ id: "subscription", label: "OTT / Subscription", icon: Tv, desc: "Timed plan access" },
	{ id: "gift_card", label: "Cash / Gift Card", icon: IndianRupee, desc: "Fixed ₹ cash value" },
	{ id: "perk", label: "Freebie / Perk", icon: Ticket, desc: "Free item or BOGO" },
];

const CATEGORIES = [
	{ value: "ecommerce", label: "Ecommerce" },
	{ value: "food", label: "Food & Dining" },
	{ value: "fashion", label: "Fashion & Lifestyle" },
	{ value: "audio", label: "Audio & Electronics" },
	{ value: "entertainment", label: "Entertainment" },
];

export default function AdminVouchersPage() {
	const { toast } = useToast();
	const [catalog, setCatalog] = React.useState<CatalogVoucher[]>([]);
	const [summary, setSummary] = React.useState<any[]>([]);
	const [claims, setClaims] = React.useState<any[]>([]);
	const [totalClaims, setTotalClaims] = React.useState(0);
	const [loading, setLoading] = React.useState(true);

	const [searchQuery, setSearchQuery] = React.useState("");
	const [categoryFilter, setCategoryFilter] = React.useState("all");
	const [typeFilter, setTypeFilter] = React.useState("all");
	const [stockFilter, setStockFilter] = React.useState("all");

	// Create Modal State
	const [createModalOpen, setCreateModalOpen] = React.useState(false);
	const [creating, setCreating] = React.useState(false);
	const [newType, setNewType] = React.useState<VoucherType>("discount");
	const [newBrand, setNewBrand] = React.useState("");
	const [newTitle, setNewTitle] = React.useState("");
	const [newDescription, setNewDescription] = React.useState("");
	const [newCategory, setNewCategory] = React.useState("food");
	const [newCoins, setNewCoins] = React.useState("250");
	const [newHighlight, setNewHighlight] = React.useState("Hot Coupon");
	const [newImage, setNewImage] = React.useState("");
	const [newCodes, setNewCodes] = React.useState("");
	const [newUploadingLogo, setNewUploadingLogo] = React.useState(false);
	const [newLogoPreview, setNewLogoPreview] = React.useState<string | null>(null);
	const [showNewDirectUrl, setShowNewDirectUrl] = React.useState(false);
	const newFileInputRef = React.useRef<HTMLInputElement>(null);

	// Benefit states (Create)
	const [newMoney, setNewMoney] = React.useState("500");
	const [newDiscountMode, setNewDiscountMode] = React.useState<"percent" | "flat">("percent");
	const [newDiscountPercent, setNewDiscountPercent] = React.useState("65");
	const [newFlatDiscount, setNewFlatDiscount] = React.useState("150");
	const [newSubDuration, setNewSubDuration] = React.useState("1 Month");
	const [newPerkTitle, setNewPerkTitle] = React.useState("Free Garlic Bread");

	// Edit Modal State
	const [editModalOpen, setEditModalOpen] = React.useState(false);
	const [editing, setEditing] = React.useState(false);
	const [editingVoucherId, setEditingVoucherId] = React.useState("");
	const [editType, setEditType] = React.useState<VoucherType>("discount");
	const [editBrand, setEditBrand] = React.useState("");
	const [editTitle, setEditTitle] = React.useState("");
	const [editDescription, setEditDescription] = React.useState("");
	const [editCategory, setEditCategory] = React.useState("ecommerce");
	const [editCoins, setEditCoins] = React.useState("1000");
	const [editHighlight, setEditHighlight] = React.useState("");
	const [editImage, setEditImage] = React.useState("");
	const [editIsActive, setEditIsActive] = React.useState(true);
	const [editUploadingLogo, setEditUploadingLogo] = React.useState(false);
	const [editLogoPreview, setEditLogoPreview] = React.useState<string | null>(null);
	const [showEditDirectUrl, setShowEditDirectUrl] = React.useState(false);
	const editFileInputRef = React.useRef<HTMLInputElement>(null);

	// Benefit states (Edit)
	const [editMoney, setEditMoney] = React.useState("500");
	const [editDiscountMode, setEditDiscountMode] = React.useState<"percent" | "flat">("percent");
	const [editDiscountPercent, setEditDiscountPercent] = React.useState("65");
	const [editFlatDiscount, setEditFlatDiscount] = React.useState("150");
	const [editSubDuration, setEditSubDuration] = React.useState("1 Month");
	const [editPerkTitle, setEditPerkTitle] = React.useState("Free Garlic Bread");

	// Delete Modal State
	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
	const [voucherToDelete, setVoucherToDelete] = React.useState<CatalogVoucher | null>(null);
	const [deleting, setDeleting] = React.useState(false);

	// Seed Codes Modal State
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

	async function handleLogoUpload(file: File, isEdit: boolean) {
		const localUrl = URL.createObjectURL(file);
		if (isEdit) {
			setEditLogoPreview(localUrl);
			setEditUploadingLogo(true);
		} else {
			setNewLogoPreview(localUrl);
			setNewUploadingLogo(true);
		}

		try {
			const webpFile = await convertToWebP(file, 0.85, 512);
			const formData = new FormData();
			formData.append("file", webpFile);
			formData.append("fileName", `brand_${Date.now()}.webp`);
			formData.append("folder", "/vouchers");

			const previousUrl = isEdit ? editImage : newImage;
			if (previousUrl && previousUrl.includes("ik.imagekit.io")) {
				formData.append("deleteOldUrl", previousUrl);
			}

			const res = await fetch("/api/imagekit/upload", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();

			if (res.ok && data.file?.url) {
				if (isEdit) {
					setEditImage(data.file.url);
					setEditLogoPreview(data.file.url);
				} else {
					setNewImage(data.file.url);
					setNewLogoPreview(data.file.url);
				}
				toast({
					title: "Logo Saved",
					description: "Optimized WebP brand logo uploaded.",
					variant: "success",
				});
			} else {
				throw new Error(data.error || "Failed to upload logo image");
			}
		} catch (err: any) {
			toast({ title: "Upload Failed", description: err.message, variant: "error" });
		} finally {
			if (isEdit) {
				setEditUploadingLogo(false);
			} else {
				setNewUploadingLogo(false);
			}
		}
	}

	async function handleRemoveLogo(isEdit: boolean) {
		const previousUrl = isEdit ? editImage : newImage;
		if (isEdit) {
			setEditImage("");
			setEditLogoPreview(null);
		} else {
			setNewImage("");
			setNewLogoPreview(null);
		}

		if (previousUrl && previousUrl.includes("ik.imagekit.io")) {
			try {
				await fetch(`/api/imagekit/upload?imageUrl=${encodeURIComponent(previousUrl)}`, {
					method: "DELETE",
				});
			} catch {}
		}
	}

	function calculateBenefit(
		type: VoucherType,
		money: string,
		dMode: "percent" | "flat",
		dPct: string,
		dFlat: string,
		subDur: string,
		perk: string
	) {
		if (type === "discount") {
			if (dMode === "flat") {
				const num = Number(dFlat) || 100;
				return { formatted: `Flat ₹${num} OFF`, numeric: num };
			}
			const pct = Number(dPct) || 50;
			return { formatted: `${pct}% OFF`, numeric: pct };
		}
		if (type === "subscription") {
			const dur = subDur.trim() || "1 Month";
			const match = dur.match(/\d+/);
			const num = match ? Number(match[0]) : 1;
			return { formatted: dur, numeric: num };
		}
		if (type === "perk") {
			const text = perk.trim() || "Free Item";
			return { formatted: text, numeric: 0 };
		}
		const val = Number(money) || 500;
		return { formatted: `₹${val}`, numeric: val };
	}

	async function handleCreateVoucher(e: React.FormEvent) {
		e.preventDefault();
		if (!newBrand.trim() || !newTitle.trim()) {
			toast({
				title: "Required Fields",
				description: "Please enter Brand Name and Voucher Title.",
				variant: "warning",
			});
			return;
		}

		const { formatted, numeric } = calculateBenefit(
			newType,
			newMoney,
			newDiscountMode,
			newDiscountPercent,
			newFlatDiscount,
			newSubDuration,
			newPerkTitle
		);

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
					description: newDescription.trim() || undefined,
					voucher_type: newType,
					value_formatted: formatted,
					numeric_value: numeric,
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
				title: "Voucher Created",
				description: `Added "${newTitle}" [${formatted}] with ${json.insertedCodes || 0} inventory codes.`,
				variant: "success",
			});

			setCreateModalOpen(false);
			setNewBrand("");
			setNewTitle("");
			setNewDescription("");
			setNewImage("");
			setNewLogoPreview(null);
			setNewCodes("");
			fetchData();
		} catch (err: any) {
			toast({ title: "Creation Failed", description: err.message, variant: "error" });
		} finally {
			setCreating(false);
		}
	}

	function openEditModal(voucher: CatalogVoucher) {
		setEditingVoucherId(voucher.id);
		setEditBrand(voucher.brandName);
		setEditTitle(voucher.title);
		setEditDescription(voucher.description || "");
		setEditCoins(String(voucher.coinsCost));
		setEditCategory(voucher.category || "ecommerce");
		setEditHighlight(voucher.highlightTag || "");
		setEditImage(voucher.imageUrl || "");
		setEditLogoPreview(voucher.imageUrl || null);
		setEditIsActive(voucher.isActive ?? true);

		const vType = voucher.voucherType || "gift_card";
		setEditType(vType);

		if (vType === "discount") {
			const fmt = voucher.valueFormatted || "";
			if (fmt.includes("Flat") || fmt.includes("₹")) {
				setEditDiscountMode("flat");
				const m = fmt.match(/\d+/);
				setEditFlatDiscount(m ? m[0] : String(voucher.numericValue));
			} else {
				setEditDiscountMode("percent");
				const m = fmt.match(/\d+/);
				setEditDiscountPercent(m ? m[0] : String(voucher.numericValue || 50));
			}
		} else if (vType === "subscription") {
			setEditSubDuration(voucher.valueFormatted || `${voucher.numericValue || 1} Month`);
		} else if (vType === "perk") {
			setEditPerkTitle(voucher.valueFormatted || "Free Treat");
		} else {
			setEditMoney(String(voucher.numericValue || 500));
		}

		setEditModalOpen(true);
	}

	async function handleUpdateVoucher(e: React.FormEvent) {
		e.preventDefault();
		if (!editBrand.trim() || !editTitle.trim()) {
			toast({
				title: "Required Fields",
				description: "Please enter Brand Name and Voucher Title.",
				variant: "warning",
			});
			return;
		}

		const { formatted, numeric } = calculateBenefit(
			editType,
			editMoney,
			editDiscountMode,
			editDiscountPercent,
			editFlatDiscount,
			editSubDuration,
			editPerkTitle
		);

		setEditing(true);
		try {
			const res = await fetch("/api/admin/vouchers", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: editingVoucherId,
					brand_name: editBrand.trim(),
					title: editTitle.trim(),
					description: editDescription.trim(),
					voucher_type: editType,
					value_formatted: formatted,
					numeric_value: numeric,
					coins_cost: Number(editCoins) || 200,
					category: editCategory,
					image_url: editImage.trim() || null,
					highlight_tag: editHighlight.trim() || null,
					is_active: editIsActive,
				}),
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to update voucher");

			toast({
				title: "Voucher Updated",
				description: `Saved changes to "${editTitle}".`,
				variant: "success",
			});

			setEditModalOpen(false);
			fetchData();
		} catch (err: any) {
			toast({ title: "Update Failed", description: err.message, variant: "error" });
		} finally {
			setEditing(false);
		}
	}

	async function handleToggleActive(voucher: CatalogVoucher) {
		const newStatus = !(voucher.isActive ?? true);
		try {
			const res = await fetch("/api/admin/vouchers", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: voucher.id,
					brand_name: voucher.brandName,
					title: voucher.title,
					numeric_value: voucher.numericValue,
					coins_cost: voucher.coinsCost,
					is_active: newStatus,
				}),
			});

			if (!res.ok) throw new Error("Failed to toggle status");

			toast({
				title: newStatus ? "Voucher Live" : "Voucher Paused",
				description: `"${voucher.title}" is now ${newStatus ? "active in store" : "paused and hidden"}.`,
				variant: "success",
			});

			fetchData();
		} catch (err: any) {
			toast({ title: "Status Update Failed", description: err.message, variant: "error" });
		}
	}

	function openDeleteModal(voucher: CatalogVoucher) {
		setVoucherToDelete(voucher);
		setDeleteModalOpen(true);
	}

	async function handleConfirmDelete() {
		if (!voucherToDelete) return;
		setDeleting(true);

		try {
			const res = await fetch(`/api/admin/vouchers?id=${encodeURIComponent(voucherToDelete.id)}`, {
				method: "DELETE",
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to delete voucher");

			toast({
				title: "Voucher Deleted",
				description: `Removed "${voucherToDelete.title}".`,
				variant: "success",
			});

			setDeleteModalOpen(false);
			setVoucherToDelete(null);
			fetchData();
		} catch (err: any) {
			toast({ title: "Deletion Failed", description: err.message, variant: "error" });
		} finally {
			setDeleting(false);
		}
	}

	function openSeedModalFor(voucherId: string) {
		setSelectedVoucherId(voucherId);
		setSeedModalOpen(true);
	}

	async function handleSeedVouchers(e: React.FormEvent) {
		e.preventDefault();
		const matched = catalog.find((p) => p.id === selectedVoucherId);
		const rawCodes = codesInput
			.split("\n")
			.map((c) => c.trim())
			.filter(Boolean);

		if (rawCodes.length === 0) {
			toast({
				title: "Codes Required",
				description: "Please enter at least one voucher code.",
				variant: "warning",
			});
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
				title: "Codes Seeded",
				description: `Seeded ${json.inserted} code(s) for ${matched?.brandName}.`,
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

	const filteredCatalog = catalog.filter((voucher) => {
		const matchesSearch =
			!searchQuery.trim() ||
			voucher.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			voucher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(voucher.description && voucher.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(voucher.valueFormatted && voucher.valueFormatted.toLowerCase().includes(searchQuery.toLowerCase()));

		const matchesCategory =
			categoryFilter === "all" ||
			voucher.category?.toLowerCase() === categoryFilter.toLowerCase();

		const matchesType =
			typeFilter === "all" ||
			(voucher.voucherType || "gift_card") === typeFilter;

		const availableItem = summary.find(
			(s) => s.voucher_id === voucher.id && s.status === "available"
		);
		const stockCount = availableItem?.count || 0;

		let matchesStock = true;
		if (stockFilter === "in_stock") matchesStock = stockCount > 0;
		else if (stockFilter === "low_stock") matchesStock = stockCount > 0 && stockCount <= 5;
		else if (stockFilter === "out_of_stock") matchesStock = stockCount === 0;

		return matchesSearch && matchesCategory && matchesType && matchesStock;
	});

	return (
		<div className="space-y-6 pb-12">
			{/* Page Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-black font-title tracking-tight text-foreground">
						Vouchers & Economy
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Coupons, OTT subscriptions, cash vouchers, inventory restocker & redemption audit logs
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button
						onClick={() => setCreateModalOpen(true)}
						className="border-[length:var(--border-width)] border-black bg-primary text-black font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift h-9 px-3.5 rounded-lg active:scale-[0.96] transition-transform"
					>
						<Plus className="size-3.5 mr-1.5" />
						Add Voucher
					</Button>
					<Button
						onClick={() => setSeedModalOpen(true)}
						className="border-[length:var(--border-width)] border-black bg-accent text-black font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift h-9 px-3.5 rounded-lg active:scale-[0.96] transition-transform"
					>
						<Gift className="size-3.5 mr-1.5" />
						Seed Codes
					</Button>
					<Button
						onClick={fetchData}
						disabled={loading}
						className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift size-9 p-0 rounded-lg active:scale-[0.96] transition-transform"
						title="Refresh data"
					>
						<RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
					</Button>
				</div>
			</div>

			{/* Search & Filters */}
			<div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-3 border-[length:var(--border-width)] border-black bg-card shadow-brutal-xs rounded-xl">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
					<Input
						placeholder="Search brand, coupon, or pass (e.g. Domino's, 65% OFF, Netflix)..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8 h-9 border-[length:var(--border-width)] border-black font-mono text-xs bg-background rounded-lg shadow-brutal-2xs"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<select
						value={typeFilter}
						onChange={(e) => setTypeFilter(e.target.value)}
						className="h-9 px-2.5 border-[length:var(--border-width)] border-black bg-background font-mono text-[11px] font-bold uppercase rounded-lg shadow-brutal-2xs"
					>
						<option value="all">All Reward Types</option>
						<option value="discount">🏷️ Discount / Coupon</option>
						<option value="subscription">📺 OTT / Subscription</option>
						<option value="gift_card">💳 Cash / Gift Card</option>
						<option value="perk">🎁 Freebie / Perk</option>
					</select>

					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="h-9 px-2.5 border-[length:var(--border-width)] border-black bg-background font-mono text-[11px] font-bold uppercase rounded-lg shadow-brutal-2xs"
					>
						<option value="all">All Categories</option>
						{CATEGORIES.map((c) => (
							<option key={c.value} value={c.value}>
								{c.label}
							</option>
						))}
					</select>

					<select
						value={stockFilter}
						onChange={(e) => setStockFilter(e.target.value)}
						className="h-9 px-2.5 border-[length:var(--border-width)] border-black bg-background font-mono text-[11px] font-bold uppercase rounded-lg shadow-brutal-2xs"
					>
						<option value="all">All Stock Status</option>
						<option value="in_stock">In Stock (&gt; 0)</option>
						<option value="low_stock">Low Stock (1-5)</option>
						<option value="out_of_stock">Out of Stock (0)</option>
					</select>

					{(searchQuery || categoryFilter !== "all" || typeFilter !== "all" || stockFilter !== "all") && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								setSearchQuery("");
								setCategoryFilter("all");
								setTypeFilter("all");
								setStockFilter("all");
							}}
							className="h-9 border border-black font-mono text-[11px] font-bold text-muted-foreground hover:text-foreground px-2.5 rounded-lg"
						>
							<X className="size-3 mr-1" />
							Reset
						</Button>
					)}
				</div>
			</div>

			{/* Dynamic Catalog Grid */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="font-mono text-xs font-black uppercase text-foreground">
						Live Catalog ({filteredCatalog.length} of {catalog.length})
					</h3>
					<span className="font-mono text-[11px] text-muted-foreground">
						Total Claims: <strong className="tabular-nums">{totalClaims}</strong>
					</span>
				</div>

				{filteredCatalog.length === 0 ? (
					<div className="p-8 border-[length:var(--border-width)] border-black bg-card text-center space-y-1.5 shadow-brutal-xs rounded-xl">
						<AlertTriangle className="size-6 text-secondary-foreground mx-auto" />
						<h4 className="font-black font-title text-sm text-foreground">No Vouchers Found</h4>
						<p className="font-mono text-xs text-muted-foreground">
							Try adjusting your search query or filter tags.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{filteredCatalog.map((voucher) => {
							const availableItem = summary.find(
								(s) => s.voucher_id === voucher.id && s.status === "available"
							);
							const stockCount = availableItem?.count || 0;
							const isActive = voucher.isActive ?? true;
							const vType = voucher.voucherType || "gift_card";

							return (
								<div
									key={voucher.id}
									className={cn(
										"border-[length:var(--border-width)] border-black bg-card p-4 shadow-brutal-xs flex flex-col justify-between gap-3 relative transition-all rounded-xl",
										!isActive && "opacity-75 bg-muted/25"
									)}
								>
									{/* Top Strip */}
									<div className="flex items-center justify-between gap-1.5">
										<div className="flex items-center gap-1.5 flex-wrap">
											<span className="font-mono text-[9px] font-black uppercase text-accent border border-black/20 px-2 py-0.5 bg-muted rounded-md">
												{voucher.brandName}
											</span>
											<span className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
												{voucher.category}
											</span>
										</div>

										<div className="flex items-center gap-1">
											{!isActive && (
												<span className="border border-black bg-muted px-1.5 py-0.5 font-mono text-[9px] font-black uppercase text-muted-foreground flex items-center gap-0.5 rounded-md">
													<EyeOff className="size-2.5" />
													Paused
												</span>
											)}
											{voucher.highlightTag && (
												<span className="border border-black bg-secondary px-1.5 py-0.5 font-mono text-[9px] font-black uppercase text-secondary-foreground rounded-md">
													{voucher.highlightTag}
												</span>
											)}
										</div>
									</div>

									{/* Brand Logo & Title */}
									<div className="flex items-start gap-3">
										<div className="size-11 border-[length:var(--border-width)] border-black bg-white flex items-center justify-center overflow-hidden shadow-brutal-2xs shrink-0 rounded-lg">
											{voucher.imageUrl ? (
												<img
													src={voucher.imageUrl}
													alt={voucher.brandName}
													className="w-full h-full object-contain p-0.5"
												/>
											) : (
												<div className="size-full bg-primary flex items-center justify-center font-black font-title text-sm text-black uppercase">
													{voucher.brandName.slice(0, 2)}
												</div>
											)}
										</div>

										<div className="flex-1 min-w-0">
											<h4 className="font-black font-title text-xs text-foreground leading-snug truncate">
												{voucher.title}
											</h4>
											<p className="font-mono text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
												{voucher.description || "Redeem this voucher with smile coins."}
											</p>
										</div>
									</div>

									{/* Benefit & Stock Row */}
									<div className="flex items-end justify-between border-t border-black/10 pt-2.5 font-mono">
										<div>
											<div className="text-[11px] font-bold text-foreground">
												{vType === "discount" ? (
													<>
														Discount:{" "}
														<span className="text-rose-600 font-extrabold">
															{voucher.valueFormatted || `${voucher.numericValue}% OFF`}
														</span>
													</>
												) : vType === "subscription" ? (
													<>
														Plan:{" "}
														<span className="text-violet-600 font-extrabold">
															{voucher.valueFormatted || `${voucher.numericValue} Mo`}
														</span>
													</>
												) : vType === "perk" ? (
													<>
														Perk:{" "}
														<span className="text-amber-600 font-extrabold">
															{voucher.valueFormatted || "Free Item"}
														</span>
													</>
												) : (
													<>
														Value:{" "}
														<span className="font-extrabold">
															{voucher.valueFormatted || `₹${voucher.numericValue}`}
														</span>
													</>
												)}
											</div>
											<div className="text-[11px] font-extrabold text-secondary-foreground">
												Cost: <span className="tabular-nums">{voucher.coinsCost}</span> 🪙
											</div>
										</div>

										<div className="text-right">
											<div className="flex items-center justify-end gap-1">
												<span
													className={cn(
														"size-2 rounded-full",
														stockCount > 5
															? "bg-success"
															: stockCount > 0
															? "bg-amber-500"
															: "bg-destructive animate-pulse"
													)}
												/>
												<span
													className={cn(
														"text-sm font-black leading-none tabular-nums",
														stockCount > 5
															? "text-success"
															: stockCount > 0
															? "text-amber-500"
															: "text-destructive"
													)}
												>
													{stockCount}
												</span>
											</div>
											<div className="text-[9px] font-bold uppercase text-muted-foreground mt-0.5">
												{stockCount > 5 ? "In Stock" : stockCount > 0 ? "Low Stock" : "Empty"}
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center justify-between gap-1 border-t border-black/10 pt-2.5">
										<div className="flex items-center gap-1.5">
											<Button
												size="sm"
												variant="outline"
												onClick={() => openEditModal(voucher)}
												className="border border-black bg-card hover:bg-muted font-mono text-[10px] font-bold h-7 px-2.5 shadow-brutal-2xs rounded-md active:scale-[0.96] transition-transform"
											>
												<Pencil className="size-2.5 mr-1 text-primary" />
												Edit
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => openSeedModalFor(voucher.id)}
												className="border border-black bg-accent/20 hover:bg-accent font-mono text-[10px] font-bold text-black h-7 px-2.5 shadow-brutal-2xs rounded-md active:scale-[0.96] transition-transform"
											>
												<Plus className="size-2.5 mr-1" />
												Restock
											</Button>
										</div>

										<div className="flex items-center gap-1.5">
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleToggleActive(voucher)}
												title={isActive ? "Pause voucher" : "Activate voucher"}
												className="border border-black bg-card hover:bg-muted size-7 p-0 shadow-brutal-2xs rounded-md active:scale-[0.96] transition-transform"
											>
												{isActive ? (
													<Eye className="size-3 text-foreground" />
												) : (
													<EyeOff className="size-3 text-muted-foreground" />
												)}
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => openDeleteModal(voucher)}
												title="Delete voucher"
												className="border border-black bg-destructive/10 hover:bg-destructive hover:text-white size-7 p-0 shadow-brutal-2xs text-destructive rounded-md active:scale-[0.96] transition-transform"
											>
												<Trash2 className="size-3" />
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Claims Table */}
			<div className="border-[length:var(--border-width)] border-black bg-card shadow-brutal overflow-hidden rounded-xl">
				<div className="p-3.5 border-b-[length:var(--border-width)] border-black bg-muted/40 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="size-4 text-secondary-foreground" />
						<h3 className="font-mono text-xs font-black uppercase text-foreground">
							Redemption History (<span className="tabular-nums">{totalClaims}</span>)
						</h3>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b-[length:var(--border-width)] border-black/20 bg-muted/20 font-mono text-[10px] font-black uppercase text-foreground">
								<th className="p-3">Smiler</th>
								<th className="p-3">Provider / Tier</th>
								<th className="p-3">Voucher Code</th>
								<th className="p-3">Coins Spent</th>
								<th className="p-3">Redeemed At</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/10 font-mono text-xs">
							{loading && claims.length === 0 ? (
								<tr>
									<td colSpan={5} className="p-6 text-center text-muted-foreground font-bold">
										Loading claims...
									</td>
								</tr>
							) : claims.length === 0 ? (
								<tr>
									<td colSpan={5} className="p-6 text-center text-muted-foreground font-bold">
										No voucher redemptions logged yet.
									</td>
								</tr>
							) : (
								claims.map((claim) => (
									<tr key={claim.id} className="hover:bg-muted/30 transition-colors">
										<td className="p-3">
											<div className="font-bold text-foreground text-xs leading-tight">
												{claim.user_name}
											</div>
											<div className="text-[10px] text-muted-foreground">{claim.user_email}</div>
										</td>
										<td className="p-3">
											<span className="border border-black bg-primary px-1.5 py-0.5 text-[9px] font-black uppercase text-black rounded-md">
												{claim.provider || claim.tier}
											</span>
										</td>
										<td className="p-3 font-mono font-bold select-all text-foreground text-[11px]">
											{claim.voucher_code}
										</td>
										<td className="p-3 font-bold text-secondary-foreground text-xs tabular-nums">
											{claim.coins_spent} 🪙
										</td>
										<td className="p-3 text-muted-foreground text-[11px] tabular-nums">
											{new Date(claim.claimed_at).toLocaleDateString()}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* ========================================================= */}
			{/* MODAL 1: Add Voucher (Rectangular Dialog adhering to CSS)  */}
			{/* ========================================================= */}
			{createModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleCreateVoucher}
						className="w-full max-w-3xl border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal-xl overflow-hidden flex flex-col max-h-[92vh]"
					>
						{/* Header Bar */}
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black p-4 bg-muted/40 shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black bg-primary flex items-center justify-center shadow-brutal-2xs">
									<Building2 className="size-4 text-primary-foreground" />
								</div>
								<div>
									<h3 className="font-black font-title text-base sm:text-lg text-foreground leading-tight">
										Add Brand Voucher
									</h3>
									<p className="font-mono text-[11px] text-muted-foreground">
										Create a reward for the user marketplace and seed initial inventory codes
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setCreateModalOpen(false)}
								className="size-8 border-[length:var(--border-width)] border-black rounded-lg flex items-center justify-center font-bold text-sm bg-card hover:bg-muted shadow-brutal-2xs active:scale-[0.96] transition-transform"
							>
								✕
							</button>
						</div>

						{/* Form Body: Rectangular 2-Column Grid */}
						<div className="p-5 overflow-y-auto flex-1 space-y-4">
							{/* Voucher Type Selector Tabs */}
							<div className="space-y-1.5">
								<label className="block font-mono text-xs font-black uppercase text-foreground">
									1. Reward Type *
								</label>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
									{VOUCHER_TYPES.map((t) => {
										const Icon = t.icon;
										const isSelected = newType === t.id;
										return (
											<button
												key={t.id}
												type="button"
												onClick={() => {
													setNewType(t.id);
													if (t.id === "discount" && newCoins === "1000") setNewCoins("250");
													if (t.id === "subscription" && newCoins === "250") setNewCoins("600");
												}}
												className={cn(
													"flex flex-col items-center justify-center p-2.5 border-[length:var(--border-width)] border-black rounded-lg text-center font-mono text-xs transition-all cursor-pointer active:scale-[0.96]",
													isSelected
														? "bg-primary text-black font-black shadow-brutal-xs"
														: "bg-background hover:bg-muted text-muted-foreground font-bold"
												)}
											>
												<Icon className="size-4 mb-1" />
												<span className="font-bold text-xs">{t.label}</span>
												<span className="text-[10px] opacity-75">{t.desc}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* 2-Column Balanced Section */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
								{/* Left Column: Merchant, Logo & Offer Benefit */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black rounded-lg bg-background shadow-brutal-2xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b border-black/15 pb-2 flex items-center gap-1.5">
										<ShieldCheck className="size-3.5 text-primary" />
										Merchant & Benefit
									</div>

									{/* Brand Logo & Merchant Name */}
									<div className="flex items-center gap-3">
										<div className="relative group shrink-0">
											<div
												onClick={() => newFileInputRef.current?.click()}
												className="size-12 border-[length:var(--border-width)] border-black rounded-lg bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted shadow-brutal-2xs relative active:scale-[0.96] transition-transform"
												title="Upload Brand Logo (WebP)"
											>
												{newLogoPreview || newImage ? (
													<img
														src={newLogoPreview || newImage}
														alt="Logo"
														className="w-full h-full object-contain p-1"
													/>
												) : (
													<div className="flex flex-col items-center justify-center text-muted-foreground">
														<Upload className="size-4" />
														<span className="text-[8px] font-bold uppercase mt-0.5">Logo</span>
													</div>
												)}
												{newUploadingLogo && (
													<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
														<Loader2 className="size-3.5 text-white animate-spin" />
													</div>
												)}
											</div>
											{(newLogoPreview || newImage) && (
												<button
													type="button"
													onClick={() => handleRemoveLogo(false)}
													className="absolute -top-1.5 -right-1.5 size-4 bg-destructive text-white rounded-full flex items-center justify-center border border-black hover:scale-110 text-[9px] font-bold"
													title="Remove logo"
												>
													✕
												</button>
											)}
											<input
												ref={newFileInputRef}
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) handleLogoUpload(file, false);
												}}
											/>
										</div>

										<div className="flex-1 min-w-0 space-y-1">
											<label className="block font-mono text-[10px] font-black uppercase text-foreground">
												Brand / Company *
											</label>
											<Input
												required
												placeholder="e.g. Domino's Pizza"
												value={newBrand}
												onChange={(e) => setNewBrand(e.target.value)}
												className="h-9 text-xs border-[length:var(--border-width)] border-black font-semibold rounded-md shadow-brutal-2xs"
											/>
										</div>
									</div>

									{/* Category & Direct Image URL */}
									<div className="grid grid-cols-2 gap-2">
										<div>
											<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
												Category *
											</label>
											<select
												value={newCategory}
												onChange={(e) => setNewCategory(e.target.value)}
												className="w-full h-9 px-2.5 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs font-semibold shadow-brutal-2xs"
											>
												{CATEGORIES.map((c) => (
													<option key={c.value} value={c.value}>
														{c.label}
													</option>
												))}
											</select>
										</div>

										<div>
											<div className="flex items-center justify-between mb-1">
												<label className="font-mono text-[10px] font-black uppercase text-foreground">
													Logo URL
												</label>
												<button
													type="button"
													onClick={() => setShowNewDirectUrl(!showNewDirectUrl)}
													className="text-[9px] font-mono underline text-muted-foreground hover:text-foreground cursor-pointer"
												>
													{showNewDirectUrl ? "Hide" : "Paste"}
												</button>
											</div>
											{showNewDirectUrl ? (
												<Input
													placeholder="https://..."
													value={newImage}
													onChange={(e) => {
														setNewImage(e.target.value);
														setNewLogoPreview(e.target.value || null);
													}}
													className="h-9 text-[11px] border-[length:var(--border-width)] border-black font-mono rounded-md shadow-brutal-2xs"
												/>
											) : (
												<div
													onClick={() => newFileInputRef.current?.click()}
													className="h-9 border border-dashed border-black/40 rounded-md bg-muted/20 flex items-center justify-center text-[10px] font-mono text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors"
												>
													{newImage ? "Logo Configured" : "Upload File via Box"}
												</div>
											)}
										</div>
									</div>

									{/* Voucher Title */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Voucher Title *
										</label>
										<Input
											required
											placeholder="e.g. Domino's 65% OFF Pizza Coupon Code"
											value={newTitle}
											onChange={(e) => setNewTitle(e.target.value)}
											className="h-9 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs"
										/>
									</div>

									{/* Dynamic Benefit Field */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Reward Benefit / Value *
										</label>
										{newType === "discount" ? (
											<div className="flex items-center gap-1.5">
												<select
													value={newDiscountMode}
													onChange={(e) => setNewDiscountMode(e.target.value as any)}
													className="h-9 w-28 px-2 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs font-bold shrink-0 shadow-brutal-2xs"
												>
													<option value="percent">% Off</option>
													<option value="flat">Flat ₹ Off</option>
												</select>
												{newDiscountMode === "percent" ? (
													<div className="relative flex-1">
														<Input
															required
															type="number"
															min="1"
															max="100"
															value={newDiscountPercent}
															onChange={(e) => setNewDiscountPercent(e.target.value)}
															placeholder="65"
															className="h-9 pr-7 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
														/>
														<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															%
														</span>
													</div>
												) : (
													<div className="relative flex-1">
														<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															₹
														</span>
														<Input
															required
															type="number"
															min="1"
															value={newFlatDiscount}
															onChange={(e) => setNewFlatDiscount(e.target.value)}
															placeholder="150"
															className="h-9 pl-6 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
														/>
													</div>
												)}
											</div>
										) : newType === "subscription" ? (
											<Input
												required
												placeholder="e.g. 1 Month, 3 Months VIP, 1 Year Plan"
												value={newSubDuration}
												onChange={(e) => setNewSubDuration(e.target.value)}
												className="h-9 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs"
											/>
										) : newType === "perk" ? (
											<Input
												required
												placeholder="e.g. Free Garlic Bread with Cheese"
												value={newPerkTitle}
												onChange={(e) => setNewPerkTitle(e.target.value)}
												className="h-9 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs"
											/>
										) : (
											<div className="relative">
												<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
													₹
												</span>
												<Input
													required
													type="number"
													min="1"
													placeholder="500"
													value={newMoney}
													onChange={(e) => {
														setNewMoney(e.target.value);
														const n = Number(e.target.value);
														if (!isNaN(n) && n > 0) setNewCoins(String(Math.round(n * 2)));
													}}
													className="h-9 pl-6 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
												/>
											</div>
										)}
									</div>
								</div>

								{/* Right Column: Economics, Terms & Codes */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black rounded-lg bg-background shadow-brutal-2xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b border-black/15 pb-2 flex items-center gap-1.5">
										<Coins className="size-3.5 text-secondary-foreground" />
										Pricing & Inventory
									</div>

									{/* Coins Cost & Highlight Tag */}
									<div className="grid grid-cols-2 gap-2">
										<div>
											<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
												Cost in Coins *
											</label>
											<div className="relative">
												<Input
													required
													type="number"
													min="1"
													placeholder="250"
													value={newCoins}
													onChange={(e) => setNewCoins(e.target.value)}
													className="h-9 pr-8 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
												/>
												<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">🪙</span>
											</div>
										</div>

										<div>
											<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
												Highlight Tag
											</label>
											<Input
												placeholder="e.g. Hot Coupon"
												value={newHighlight}
												onChange={(e) => setNewHighlight(e.target.value)}
												className="h-9 text-xs border-[length:var(--border-width)] border-black rounded-md shadow-brutal-2xs"
											/>
										</div>
									</div>

									{/* Description & Terms */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Description & Terms of Use
										</label>
										<textarea
											rows={3}
											value={newDescription}
											onChange={(e) => setNewDescription(e.target.value)}
											placeholder="e.g. Valid on all pizza orders above ₹299. Copy and apply code on Domino's checkout."
											className="w-full p-2.5 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs shadow-brutal-2xs"
										/>
									</div>

									{/* Initial Secret Codes */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Initial Codes (One per line)
										</label>
										<textarea
											rows={3}
											value={newCodes}
											onChange={(e) => setNewCodes(e.target.value)}
											placeholder={`DOM-65OFF-9912\nDOM-65OFF-8812`}
											className="w-full p-2.5 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs shadow-brutal-2xs"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Footer Bar */}
						<div className="flex items-center justify-between border-t-[length:var(--border-width)] border-black p-4 bg-muted/40 shrink-0">
							<span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
								Voucher will be live in marketplace upon save.
							</span>

							<div className="flex items-center gap-2 ml-auto">
								<Button
									type="button"
									onClick={() => setCreateModalOpen(false)}
									className="border-[length:var(--border-width)] border-black bg-card font-mono text-xs font-bold text-foreground h-9 px-4 rounded-md shadow-brutal-2xs brutal-lift active:scale-[0.96] transition-transform"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={creating || newUploadingLogo}
									className="border-[length:var(--border-width)] border-black bg-primary text-black font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-5 rounded-md brutal-lift active:scale-[0.96] transition-transform"
								>
									{creating ? "Saving..." : "Save Voucher to Catalog"}
								</Button>
							</div>
						</div>
					</form>
				</div>
			)}

			{/* ========================================================= */}
			{/* MODAL 2: Edit Voucher (Rectangular Dialog adhering to CSS) */}
			{/* ========================================================= */}
			{editModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleUpdateVoucher}
						className="w-full max-w-3xl border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal-xl overflow-hidden flex flex-col max-h-[92vh]"
					>
						{/* Header Bar */}
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black p-4 bg-muted/40 shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black bg-primary flex items-center justify-center shadow-brutal-2xs">
									<Pencil className="size-4 text-primary-foreground" />
								</div>
								<div>
									<h3 className="font-black font-title text-base sm:text-lg text-foreground leading-tight">
										Edit Voucher Details
									</h3>
									<p className="font-mono text-[11px] text-muted-foreground">
										Modify brand, reward configuration, coin price, and visibility status
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setEditModalOpen(false)}
								className="size-8 border-[length:var(--border-width)] border-black rounded-lg flex items-center justify-center font-bold text-sm bg-card hover:bg-muted shadow-brutal-2xs active:scale-[0.96] transition-transform"
							>
								✕
							</button>
						</div>

						{/* Form Body: Rectangular 2-Column Grid */}
						<div className="p-5 overflow-y-auto flex-1 space-y-4">
							{/* Reward Type */}
							<div className="space-y-1.5">
								<label className="block font-mono text-xs font-black uppercase text-foreground">
									1. Reward Type *
								</label>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
									{VOUCHER_TYPES.map((t) => {
										const Icon = t.icon;
										const isSelected = editType === t.id;
										return (
											<button
												key={t.id}
												type="button"
												onClick={() => setEditType(t.id)}
												className={cn(
													"flex flex-col items-center justify-center p-2.5 border-[length:var(--border-width)] border-black rounded-lg text-center font-mono text-xs transition-all cursor-pointer active:scale-[0.96]",
													isSelected
														? "bg-primary text-black font-black shadow-brutal-xs"
														: "bg-background hover:bg-muted text-muted-foreground font-bold"
												)}
											>
												<Icon className="size-4 mb-1" />
												<span className="font-bold text-xs">{t.label}</span>
												<span className="text-[10px] opacity-75">{t.desc}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* 2-Column Balanced Section */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
								{/* Left Column */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black rounded-lg bg-background shadow-brutal-2xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b border-black/15 pb-2 flex items-center gap-1.5">
										<ShieldCheck className="size-3.5 text-primary" />
										Merchant & Benefit
									</div>

									{/* Brand Logo & Merchant Name */}
									<div className="flex items-center gap-3">
										<div className="relative group shrink-0">
											<div
												onClick={() => editFileInputRef.current?.click()}
												className="size-12 border-[length:var(--border-width)] border-black rounded-lg bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted shadow-brutal-2xs relative active:scale-[0.96] transition-transform"
												title="Upload Brand Logo (WebP)"
											>
												{editLogoPreview || editImage ? (
													<img
														src={editLogoPreview || editImage}
														alt="Logo"
														className="w-full h-full object-contain p-1"
													/>
												) : (
													<div className="flex flex-col items-center justify-center text-muted-foreground">
														<Upload className="size-4" />
														<span className="text-[8px] font-bold uppercase mt-0.5">Logo</span>
													</div>
												)}
												{editUploadingLogo && (
													<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
														<Loader2 className="size-3.5 text-white animate-spin" />
													</div>
												)}
											</div>
											{(editLogoPreview || editImage) && (
												<button
													type="button"
													onClick={() => handleRemoveLogo(true)}
													className="absolute -top-1.5 -right-1.5 size-4 bg-destructive text-white rounded-full flex items-center justify-center border border-black hover:scale-110 text-[9px] font-bold"
													title="Remove logo"
												>
													✕
												</button>
											)}
											<input
												ref={editFileInputRef}
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) handleLogoUpload(file, true);
												}}
											/>
										</div>

										<div className="flex-1 min-w-0 space-y-1">
											<label className="block font-mono text-[10px] font-black uppercase text-foreground">
												Brand / Company *
											</label>
											<Input
												required
												value={editBrand}
												onChange={(e) => setEditBrand(e.target.value)}
												className="h-9 text-xs border-[length:var(--border-width)] border-black font-semibold rounded-md shadow-brutal-2xs"
											/>
										</div>
									</div>

									{/* Category & Direct URL */}
									<div className="grid grid-cols-2 gap-2">
										<div>
											<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
												Category *
											</label>
											<select
												value={editCategory}
												onChange={(e) => setNewCategory(e.target.value)}
												className="w-full h-9 px-2.5 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs font-semibold shadow-brutal-2xs"
											>
												{CATEGORIES.map((c) => (
													<option key={c.value} value={c.value}>
														{c.label}
													</option>
												))}
											</select>
										</div>

										<div>
											<div className="flex items-center justify-between mb-1">
												<label className="font-mono text-[10px] font-black uppercase text-foreground">
													Logo URL
												</label>
												<button
													type="button"
													onClick={() => setShowEditDirectUrl(!showEditDirectUrl)}
													className="text-[9px] font-mono underline text-muted-foreground hover:text-foreground cursor-pointer"
												>
													{showEditDirectUrl ? "Hide" : "Paste"}
												</button>
											</div>
											{showEditDirectUrl ? (
												<Input
													placeholder="https://..."
													value={editImage}
													onChange={(e) => {
														setEditImage(e.target.value);
														setEditLogoPreview(e.target.value || null);
													}}
													className="h-9 text-[11px] border-[length:var(--border-width)] border-black font-mono rounded-md shadow-brutal-2xs"
												/>
											) : (
												<div
													onClick={() => editFileInputRef.current?.click()}
													className="h-9 border border-dashed border-black/40 rounded-md bg-muted/20 flex items-center justify-center text-[10px] font-mono text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors"
												>
													{editImage ? "Logo Configured" : "Upload File via Box"}
												</div>
											)}
										</div>
									</div>

									{/* Title */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Voucher Title *
										</label>
										<Input
											required
											value={editTitle}
											onChange={(e) => setEditTitle(e.target.value)}
											className="h-9 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs"
										/>
									</div>

									{/* Dynamic Benefit Field */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Reward Benefit / Value *
										</label>
										{editType === "discount" ? (
											<div className="flex items-center gap-1.5">
												<select
													value={editDiscountMode}
													onChange={(e) => setEditDiscountMode(e.target.value as any)}
													className="h-9 w-28 px-2 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs font-bold shrink-0 shadow-brutal-2xs"
												>
													<option value="percent">% Off</option>
													<option value="flat">₹ Off</option>
												</select>
												{editDiscountMode === "percent" ? (
													<div className="relative flex-1">
														<Input
															required
															type="number"
															min="1"
															max="100"
															value={editDiscountPercent}
															onChange={(e) => setEditDiscountPercent(e.target.value)}
															placeholder="65"
															className="h-9 pr-7 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
														/>
														<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															%
														</span>
													</div>
												) : (
													<div className="relative flex-1">
														<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															₹
														</span>
														<Input
															required
															type="number"
															min="1"
															value={editFlatDiscount}
															onChange={(e) => setEditFlatDiscount(e.target.value)}
															placeholder="150"
															className="h-9 pl-6 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
														/>
													</div>
												)}
											</div>
										) : editType === "subscription" ? (
											<Input
												required
												placeholder="e.g. 1 Month, 3 Months VIP, 1 Year Plan"
												value={editSubDuration}
												onChange={(e) => setEditSubDuration(e.target.value)}
												className="h-9 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs"
											/>
										) : editType === "perk" ? (
											<Input
												required
												placeholder="e.g. Free Garlic Bread with Cheese"
												value={editPerkTitle}
												onChange={(e) => setEditPerkTitle(e.target.value)}
												className="h-9 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs"
											/>
										) : (
											<div className="relative">
												<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
													₹
												</span>
												<Input
													required
													type="number"
													min="1"
													value={editMoney}
													onChange={(e) => setEditMoney(e.target.value)}
													className="h-9 pl-6 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
												/>
											</div>
										)}
									</div>
								</div>

								{/* Right Column */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black rounded-lg bg-background shadow-brutal-2xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b border-black/15 pb-2 flex items-center gap-1.5">
										<Coins className="size-3.5 text-secondary-foreground" />
										Pricing & Status
									</div>

									{/* Coins & Status */}
									<div className="grid grid-cols-2 gap-2">
										<div>
											<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
												Cost in Coins *
											</label>
											<div className="relative">
												<Input
													required
													type="number"
													min="1"
													value={editCoins}
													onChange={(e) => setEditCoins(e.target.value)}
													className="h-9 pr-8 text-xs border-[length:var(--border-width)] border-black font-bold rounded-md shadow-brutal-2xs tabular-nums"
												/>
												<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">🪙</span>
											</div>
										</div>

										<div>
											<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
												Store Visibility
											</label>
											<button
												type="button"
												onClick={() => setEditIsActive(!editIsActive)}
												className={cn(
													"w-full h-9 px-2 border-[length:var(--border-width)] border-black rounded-md font-mono text-xs font-black uppercase shadow-brutal-2xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 active:scale-[0.96]",
													editIsActive ? "bg-success text-black" : "bg-muted text-muted-foreground"
												)}
											>
												{editIsActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
												{editIsActive ? "Active" : "Paused"}
											</button>
										</div>
									</div>

									{/* Highlight Tag */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Highlight Tag
										</label>
										<Input
											placeholder="e.g. Hot Coupon, Best Seller"
											value={editHighlight}
											onChange={(e) => setEditHighlight(e.target.value)}
											className="h-9 text-xs border-[length:var(--border-width)] border-black rounded-md shadow-brutal-2xs"
										/>
									</div>

									{/* Description & Terms */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Description & Terms of Use
										</label>
										<textarea
											rows={4}
											value={editDescription}
											onChange={(e) => setEditDescription(e.target.value)}
											placeholder="Describe terms, minimum order amount, or checkout steps..."
											className="w-full p-2.5 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs shadow-brutal-2xs"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Footer Bar */}
						<div className="flex items-center justify-between border-t-[length:var(--border-width)] border-black p-4 bg-muted/40 shrink-0">
							<span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
								Changes will update immediately across catalog.
							</span>

							<div className="flex items-center gap-2 ml-auto">
								<Button
									type="button"
									onClick={() => setEditModalOpen(false)}
									className="border-[length:var(--border-width)] border-black bg-card font-mono text-xs font-bold text-foreground h-9 px-4 rounded-md shadow-brutal-2xs brutal-lift active:scale-[0.96] transition-transform"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={editing || editUploadingLogo}
									className="border-[length:var(--border-width)] border-black bg-primary text-black font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-5 rounded-md brutal-lift active:scale-[0.96] transition-transform"
								>
									{editing ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</div>
					</form>
				</div>
			)}

			{/* ========================================================= */}
			{/* MODAL 3: Delete Confirmation (Concentric Radius Dialog)   */}
			{/* ========================================================= */}
			{deleteModalOpen && voucherToDelete && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-xl space-y-4">
						<div className="flex items-center gap-3 text-destructive">
							<div className="p-2 border-[length:var(--border-width)] border-black rounded-lg bg-destructive/10">
								<AlertTriangle className="size-6" strokeWidth={2.5} />
							</div>
							<div>
								<h3 className="text-lg font-black font-title text-foreground">Delete Voucher?</h3>
								<p className="font-mono text-xs text-muted-foreground font-semibold">
									{voucherToDelete.brandName} — {voucherToDelete.title}
								</p>
							</div>
						</div>

						<p className="font-mono text-xs text-muted-foreground leading-relaxed">
							This will permanently remove this voucher from the catalog and purge all{" "}
							<span className="font-black text-foreground underline">unclaimed codes</span> in stock.
							Past user redemptions and coin balances will remain safely recorded.
						</p>

						<div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									setDeleteModalOpen(false);
									setVoucherToDelete(null);
								}}
								className="border border-black font-mono text-xs font-bold h-9 px-3.5 rounded-md shadow-brutal-2xs"
							>
								Cancel
							</Button>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={handleConfirmDelete}
								disabled={deleting}
								className="border-[length:var(--border-width)] border-black font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-4 rounded-md brutal-lift active:scale-[0.96] transition-transform"
							>
								{deleting ? "Deleting..." : "Permanently Delete"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* ========================================================= */}
			{/* MODAL 4: Code Seeder (Concentric Radius Dialog)           */}
			{/* ========================================================= */}
			{seedModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleSeedVouchers}
						className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-xl space-y-4"
					>
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-2.5">
							<div className="flex items-center gap-2">
								<Gift className="size-5 text-accent" />
								<h3 className="font-black font-title text-lg text-foreground">Batch Seed Voucher Codes</h3>
							</div>
							<button
								type="button"
								onClick={() => setSeedModalOpen(false)}
								className="size-7 border border-black rounded-md flex items-center justify-center font-bold text-xs bg-card hover:bg-muted shadow-brutal-2xs active:scale-[0.96] transition-transform"
							>
								✕
							</button>
						</div>

						<div className="space-y-3">
							<div>
								<label className="block font-mono text-[11px] font-black uppercase text-foreground mb-1">
									Target Voucher Item
								</label>
								<select
									value={selectedVoucherId}
									onChange={(e) => setSelectedVoucherId(e.target.value)}
									className="w-full h-9 px-2.5 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs font-bold shadow-brutal-2xs"
								>
									{catalog.map((v) => (
										<option key={v.id} value={v.id}>
											[{v.brandName}] {v.title} ({v.valueFormatted || `₹${v.numericValue}`})
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
									placeholder={`DOM-65OFF-9912\nDOM-65OFF-8812`}
									className="w-full p-2.5 border-[length:var(--border-width)] border-black rounded-md bg-background font-mono text-xs shadow-brutal-2xs"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-2 border-t border-black/10">
							<Button
								type="button"
								onClick={() => setSeedModalOpen(false)}
								className="border border-black bg-card font-mono text-xs font-bold text-foreground h-9 px-3.5 rounded-md shadow-brutal-2xs"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={seeding}
								className="border-[length:var(--border-width)] border-black bg-accent text-black font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-4 rounded-md brutal-lift active:scale-[0.96] transition-transform"
							>
								{seeding ? "Seeding..." : "Seed into Stock"}
							</Button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
