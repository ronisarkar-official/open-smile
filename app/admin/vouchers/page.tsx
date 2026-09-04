'use client';

import * as React from 'react';
import {
	Gift,
	Plus,
	RefreshCw,
	FileText,
	Building2,
	IndianRupee,
	Pencil,
	Trash2,
	Upload,
	Search,
	AlertTriangle,
	Loader2,
	Percent,
	Ticket,
	ShieldCheck,
	CheckCircle2,
	Tv,
	Sparkles,
	SlidersHorizontal,
	RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CoinIcon } from '@/components/ui/coin-icon';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { convertToWebP } from '@/lib/convert-to-webp';
import { BrandLogoImage, resolveBrandLogo } from '@/lib/brand-logos';
import ReactMarkdown from 'react-markdown';

type VoucherType = 'discount' | 'subscription' | 'gift_card' | 'perk';

const DEFAULT_G_PAY_MARKDOWN_TEMPLATE = `### Offer Details
- Valid on website and mobile app checkout.
- Cannot be combined with other promotional coupons.
- Applicable once per user during the offer period.

### How to Redeem
1. Copy your secret code & security PIN.
2. Apply the voucher code on the payment or checkout screen.
3. Enjoy your instant savings!`;

interface CatalogVoucher {
	id: string;
	brandName: string;
	title: string;
	description?: string;
	details?: string;
	category: string;
	imageUrl?: string;
	voucherType?: VoucherType;
	valueFormatted?: string;
	numericValue: number;
	coinsCost: number;
	highlightTag?: string;
	isActive?: boolean;
}

const VOUCHER_TYPES: {
	id: VoucherType;
	label: string;
	icon: React.ElementType;
	desc: string;
}[] = [
	{
		id: 'discount',
		label: 'Discount / Coupon',
		icon: Percent,
		desc: '% or ₹ off code',
	},
	{
		id: 'subscription',
		label: 'OTT / Subscription',
		icon: Tv,
		desc: 'Timed plan access',
	},
	{
		id: 'gift_card',
		label: 'Cash / Gift Card',
		icon: IndianRupee,
		desc: 'Fixed ₹ cash value',
	},
	{
		id: 'perk',
		label: 'Freebie / Perk',
		icon: Ticket,
		desc: 'Free item or BOGO',
	},
];

const CATEGORIES = [
	{ value: 'ecommerce', label: 'Ecommerce' },
	{ value: 'food', label: 'Food & Dining' },
	{ value: 'fashion', label: 'Fashion & Lifestyle' },
	{ value: 'audio', label: 'Audio & Electronics' },
	{ value: 'entertainment', label: 'Entertainment' },
];

export default function AdminVouchersPage() {
	const { toast } = useToast();
	const [catalog, setCatalog] = React.useState<CatalogVoucher[]>([]);
	const [summary, setSummary] = React.useState<any[]>([]);
	const [claims, setClaims] = React.useState<any[]>([]);
	const [totalClaims, setTotalClaims] = React.useState(0);
	const [totalCoinsSpent, setTotalCoinsSpent] = React.useState(0);
	const [loading, setLoading] = React.useState(true);
	const [togglingId, setTogglingId] = React.useState<string | null>(null);

	const [searchQuery, setSearchQuery] = React.useState('');
	const [statusFilter, setStatusFilter] = React.useState<
		'all' | 'active' | 'paused'
	>('all');
	const [categoryFilter, setCategoryFilter] = React.useState('all');
	const [typeFilter, setTypeFilter] = React.useState('all');
	const [stockFilter, setStockFilter] = React.useState('all');

	// Create Modal State
	const [createModalOpen, setCreateModalOpen] = React.useState(false);
	const [creating, setCreating] = React.useState(false);
	const [newType, setNewType] = React.useState<VoucherType>('discount');
	const [newBrand, setNewBrand] = React.useState('');
	const [newTitle, setNewTitle] = React.useState('');
	const [newDescription, setNewDescription] = React.useState('');
	const [newDetails, setNewDetails] = React.useState('');
	const [newDetailsTab, setNewDetailsTab] = React.useState<'write' | 'preview'>('write');
	const [newCategory, setNewCategory] = React.useState('food');
	const [newCoins, setNewCoins] = React.useState('250');
	const [newHighlight, setNewHighlight] = React.useState('Hot Coupon');
	const [newImage, setNewImage] = React.useState('');
	const [newCodes, setNewCodes] = React.useState('');
	const [newUploadingLogo, setNewUploadingLogo] = React.useState(false);
	const [newLogoPreview, setNewLogoPreview] = React.useState<string | null>(
		null,
	);
	const newFileInputRef = React.useRef<HTMLInputElement>(null);

	// Benefit states (Create)
	const [newMoney, setNewMoney] = React.useState('500');
	const [newDiscountMode, setNewDiscountMode] = React.useState<
		'percent' | 'flat'
	>('percent');
	const [newDiscountPercent, setNewDiscountPercent] = React.useState('65');
	const [newFlatDiscount, setNewFlatDiscount] = React.useState('150');
	const [newSubDuration, setNewSubDuration] = React.useState('1 Month');
	const [newPerkTitle, setNewPerkTitle] = React.useState('Free Garlic Bread');

	// Edit Modal State
	const [editModalOpen, setEditModalOpen] = React.useState(false);
	const [editing, setEditing] = React.useState(false);
	const [editingVoucherId, setEditingVoucherId] = React.useState('');
	const [editType, setEditType] = React.useState<VoucherType>('discount');
	const [editBrand, setEditBrand] = React.useState('');
	const [editTitle, setEditTitle] = React.useState('');
	const [editDescription, setEditDescription] = React.useState('');
	const [editDetails, setEditDetails] = React.useState('');
	const [editDetailsTab, setEditDetailsTab] = React.useState<'write' | 'preview'>('write');
	const [editCategory, setEditCategory] = React.useState('ecommerce');
	const [editCoins, setEditCoins] = React.useState('1000');
	const [editHighlight, setEditHighlight] = React.useState('');
	const [editImage, setEditImage] = React.useState('');
	const [editIsActive, setEditIsActive] = React.useState(true);
	const [editUploadingLogo, setEditUploadingLogo] = React.useState(false);
	const [editLogoPreview, setEditLogoPreview] = React.useState<string | null>(
		null,
	);
	const editFileInputRef = React.useRef<HTMLInputElement>(null);

	// Benefit states (Edit)
	const [editMoney, setEditMoney] = React.useState('500');
	const [editDiscountMode, setEditDiscountMode] = React.useState<
		'percent' | 'flat'
	>('percent');
	const [editDiscountPercent, setEditDiscountPercent] = React.useState('65');
	const [editFlatDiscount, setEditFlatDiscount] = React.useState('150');
	const [editSubDuration, setEditSubDuration] = React.useState('1 Month');
	const [editPerkTitle, setEditPerkTitle] = React.useState('Free Garlic Bread');

	// Delete Modal State
	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
	const [voucherToDelete, setVoucherToDelete] =
		React.useState<CatalogVoucher | null>(null);
	const [deleting, setDeleting] = React.useState(false);

	// Seed Codes Modal State
	const [seedModalOpen, setSeedModalOpen] = React.useState(false);
	const [selectedVoucherId, setSelectedVoucherId] = React.useState('');
	const [codesInput, setCodesInput] = React.useState('');
	const [seeding, setSeeding] = React.useState(false);

	async function fetchData() {
		setLoading(true);
		try {
			const [vRes, cRes] = await Promise.all([
				fetch('/api/admin/vouchers'),
				fetch('/api/admin/vouchers/claims?limit=30'),
			]);
			const [vJson, cJson] = await Promise.all([vRes.json(), cRes.json()]);

			if (vRes.ok) {
				setSummary(vJson.inventorySummary || []);
				const catalogItems = vJson.catalog || [];
				setCatalog(catalogItems);
				if (vJson.totalCoinsSpent) {
					setTotalCoinsSpent(vJson.totalCoinsSpent);
				}
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
			formData.append('file', webpFile);
			formData.append('fileName', `brand_${Date.now()}.webp`);
			formData.append('folder', '/vouchers');

			const previousUrl = isEdit ? editImage : newImage;
			if (previousUrl && previousUrl.includes('ik.imagekit.io')) {
				formData.append('deleteOldUrl', previousUrl);
			}

			const res = await fetch('/api/imagekit/upload', {
				method: 'POST',
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
					title: 'Logo Saved',
					description: 'Brand logo uploaded successfully.',
					variant: 'success',
				});
			} else {
				throw new Error(data.error || 'Failed to upload logo image');
			}
		} catch (err: any) {
			toast({
				title: 'Upload Failed',
				description: err.message,
				variant: 'error',
			});
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
			setEditImage('');
			setEditLogoPreview(null);
		} else {
			setNewImage('');
			setNewLogoPreview(null);
		}

		if (previousUrl && previousUrl.includes('ik.imagekit.io')) {
			try {
				await fetch(
					`/api/imagekit/upload?imageUrl=${encodeURIComponent(previousUrl)}`,
					{
						method: 'DELETE',
					},
				);
			} catch {}
		}
	}

	function calculateBenefit(
		type: VoucherType,
		money: string,
		dMode: 'percent' | 'flat',
		dPct: string,
		dFlat: string,
		subDur: string,
		perk: string,
	) {
		if (type === 'discount') {
			if (dMode === 'flat') {
				const num = Number(dFlat) || 100;
				return { formatted: `Flat ₹${num} OFF`, numeric: num };
			}
			const pct = Number(dPct) || 50;
			return { formatted: `${pct}% OFF`, numeric: pct };
		}
		if (type === 'subscription') {
			const dur = subDur.trim() || '1 Month';
			const match = dur.match(/\d+/);
			const num = match ? Number(match[0]) : 1;
			return { formatted: dur, numeric: num };
		}
		if (type === 'perk') {
			const text = perk.trim() || 'Free Item';
			return { formatted: text, numeric: 0 };
		}
		const val = Number(money) || 500;
		return { formatted: `₹${val}`, numeric: val };
	}

	async function handleCreateVoucher(e: React.FormEvent) {
		e.preventDefault();
		if (!newBrand.trim() || !newTitle.trim()) {
			toast({
				title: 'Required Fields',
				description: 'Please enter Brand Name and Voucher Title.',
				variant: 'warning',
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
			newPerkTitle,
		);

		setCreating(true);
		const rawCodes = newCodes
			.split('\n')
			.map((c) => c.trim())
			.filter(Boolean);

		const resolvedLogo = newImage.trim() || resolveBrandLogo(newBrand.trim());

		try {
			const res = await fetch('/api/admin/vouchers', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					brand_name: newBrand.trim(),
					title: newTitle.trim(),
					description: newDescription.trim() || undefined,
					details: newDetails.trim() || undefined,
					voucher_type: newType,
					value_formatted: formatted,
					numeric_value: numeric,
					coins_cost: Number(newCoins) || 200,
					category: newCategory,
					image_url: resolvedLogo || undefined,
					highlight_tag: newHighlight.trim() || undefined,
					codes: rawCodes,
				}),
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed to create voucher');

			toast({
				title: 'Voucher Created',
				description: `Added "${newTitle}" [${formatted}] with ${json.insertedCodes || 0} inventory codes.`,
				variant: 'success',
			});

			setCreateModalOpen(false);
			setNewBrand('');
			setNewTitle('');
			setNewDescription('');
			setNewDetails('');
			setNewDetailsTab('write');
			setNewImage('');
			setNewLogoPreview(null);
			setNewCodes('');
			fetchData();
		} catch (err: any) {
			toast({
				title: 'Creation Failed',
				description: err.message,
				variant: 'error',
			});
		} finally {
			setCreating(false);
		}
	}

	function openEditModal(voucher: CatalogVoucher) {
		setEditingVoucherId(voucher.id);
		setEditBrand(voucher.brandName);
		setEditTitle(voucher.title);
		setEditDescription(voucher.description || '');
		setEditDetails(voucher.details || '');
		setEditDetailsTab('write');
		setEditCoins(String(voucher.coinsCost));
		setEditCategory(voucher.category || 'ecommerce');
		setEditHighlight(voucher.highlightTag || '');
		setEditImage(voucher.imageUrl || '');
		setEditLogoPreview(voucher.imageUrl || null);
		setEditIsActive(voucher.isActive ?? true);

		const vType = voucher.voucherType || 'gift_card';
		setEditType(vType);

		if (vType === 'discount') {
			const fmt = voucher.valueFormatted || '';
			if (fmt.includes('Flat') || fmt.includes('₹')) {
				setEditDiscountMode('flat');
				const m = fmt.match(/\d+/);
				setEditFlatDiscount(m ? m[0] : String(voucher.numericValue));
			} else {
				setEditDiscountMode('percent');
				const m = fmt.match(/\d+/);
				setEditDiscountPercent(m ? m[0] : String(voucher.numericValue || 50));
			}
		} else if (vType === 'subscription') {
			setEditSubDuration(
				voucher.valueFormatted || `${voucher.numericValue || 1} Month`,
			);
		} else if (vType === 'perk') {
			setEditPerkTitle(voucher.valueFormatted || 'Free Treat');
		} else {
			setEditMoney(String(voucher.numericValue || 500));
		}

		setEditModalOpen(true);
	}

	async function handleUpdateVoucher(e: React.FormEvent) {
		e.preventDefault();
		if (!editBrand.trim() || !editTitle.trim()) {
			toast({
				title: 'Required Fields',
				description: 'Please enter Brand Name and Voucher Title.',
				variant: 'warning',
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
			editPerkTitle,
		);

		setEditing(true);
		const resolvedLogo = editImage.trim() || resolveBrandLogo(editBrand.trim());

		try {
			const res = await fetch('/api/admin/vouchers', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: editingVoucherId,
					brand_name: editBrand.trim(),
					title: editTitle.trim(),
					description: editDescription.trim(),
					details: editDetails.trim() || null,
					voucher_type: editType,
					value_formatted: formatted,
					numeric_value: numeric,
					coins_cost: Number(editCoins) || 200,
					category: editCategory,
					image_url: resolvedLogo || null,
					highlight_tag: editHighlight.trim() || null,
					is_active: editIsActive,
				}),
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed to update voucher');

			toast({
				title: 'Voucher Updated',
				description: `Saved changes to "${editTitle}".`,
				variant: 'success',
			});

			setEditModalOpen(false);
			fetchData();
		} catch (err: any) {
			toast({
				title: 'Update Failed',
				description: err.message,
				variant: 'error',
			});
		} finally {
			setEditing(false);
		}
	}

	async function handleToggleActive(voucher: CatalogVoucher) {
		const newStatus = !(voucher.isActive ?? true);
		setTogglingId(voucher.id);

		// Optimistic UI update
		setCatalog((prev) =>
			prev.map((v) =>
				v.id === voucher.id ? { ...v, isActive: newStatus } : v,
			),
		);

		try {
			const res = await fetch('/api/admin/vouchers', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: voucher.id,
					brand_name: voucher.brandName,
					title: voucher.title,
					numeric_value: voucher.numericValue,
					coins_cost: voucher.coinsCost,
					is_active: newStatus,
				}),
			});

			if (!res.ok) throw new Error('Failed to toggle status');

			toast({
				title: newStatus ? 'Voucher Live' : 'Voucher Hidden',
				description: `"${voucher.title}" is now ${newStatus ? 'visible in user store' : 'hidden from store'}.`,
				variant: 'success',
			});
		} catch (err: any) {
			// Revert on failure
			setCatalog((prev) =>
				prev.map((v) =>
					v.id === voucher.id ? { ...v, isActive: !newStatus } : v,
				),
			);
			toast({
				title: 'Status Update Failed',
				description: err.message,
				variant: 'error',
			});
		} finally {
			setTogglingId(null);
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
			const res = await fetch(
				`/api/admin/vouchers?id=${encodeURIComponent(voucherToDelete.id)}`,
				{
					method: 'DELETE',
				},
			);
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed to delete voucher');

			toast({
				title: 'Voucher Deleted',
				description: `Removed "${voucherToDelete.title}".`,
				variant: 'success',
			});

			setDeleteModalOpen(false);
			setVoucherToDelete(null);
			fetchData();
		} catch (err: any) {
			toast({
				title: 'Deletion Failed',
				description: err.message,
				variant: 'error',
			});
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
			.split('\n')
			.map((c) => c.trim())
			.filter(Boolean);

		if (rawCodes.length === 0) {
			toast({
				title: 'Codes Required',
				description: 'Please enter at least one voucher code.',
				variant: 'warning',
			});
			return;
		}

		setSeeding(true);
		try {
			const res = await fetch('/api/admin/vouchers/seed', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					voucherId: selectedVoucherId,
					brandName: matched?.brandName || 'Brand',
					title: matched?.title || 'Voucher',
					codes: rawCodes,
				}),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed to seed vouchers');

			toast({
				title: 'Codes Seeded',
				description: `Seeded ${json.inserted} code(s) for ${matched?.brandName}.`,
				variant: 'success',
			});
			setSeedModalOpen(false);
			setCodesInput('');
			fetchData();
		} catch (err: any) {
			toast({
				title: 'Seeding Failed',
				description: err.message,
				variant: 'error',
			});
		} finally {
			setSeeding(false);
		}
	}

	// Filtered Catalog
	const filteredCatalog = catalog.filter((voucher) => {
		const isActive = voucher.isActive ?? true;
		if (statusFilter === 'active' && !isActive) return false;
		if (statusFilter === 'paused' && isActive) return false;

		const matchesSearch =
			!searchQuery.trim() ||
			voucher.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			voucher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(voucher.description &&
				voucher.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase())) ||
			(voucher.valueFormatted &&
				voucher.valueFormatted
					.toLowerCase()
					.includes(searchQuery.toLowerCase()));

		const matchesCategory =
			categoryFilter === 'all' ||
			voucher.category?.toLowerCase() === categoryFilter.toLowerCase();

		const matchesType =
			typeFilter === 'all' ||
			(voucher.voucherType || 'gift_card') === typeFilter;

		const availableItem = summary.find(
			(s) => s.voucher_id === voucher.id && s.status === 'available',
		);
		const stockCount = availableItem?.count || 0;

		let matchesStock = true;
		if (stockFilter === 'in_stock') matchesStock = stockCount > 0;
		else if (stockFilter === 'low_stock')
			matchesStock = stockCount > 0 && stockCount <= 5;
		else if (stockFilter === 'out_of_stock') matchesStock = stockCount === 0;

		return matchesSearch && matchesCategory && matchesType && matchesStock;
	});

	// Metrics Summary
	const totalVouchersCount = catalog.length;
	const activeVouchersCount = catalog.filter((v) => v.isActive ?? true).length;
	const pausedVouchersCount = totalVouchersCount - activeVouchersCount;
	const totalAvailableStock = summary
		.filter((s) => s.status === 'available')
		.reduce((sum, s) => sum + (Number(s.count) || 0), 0);

	return (
		<div className="space-y-6 pb-12">
			{/* Page Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-border/30 pb-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-black font-title tracking-tight text-foreground flex items-center gap-2">
						Vouchers & Economy
						<Sparkles className="size-5 text-primary fill-primary" />
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground mt-0.5">
						Coupons, OTT passes, cash vouchers, inventory restocker & redemption
						audit logs
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button
						onClick={() => setCreateModalOpen(true)}
						className="min-h-0 h-9 px-3.5 border-[length:var(--border-width)] border-black dark:border-outline bg-primary text-primary-foreground font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift rounded-lg active:scale-[0.96] transition-transform">
						<Plus className="size-3.5 mr-1.5" />
						Add Voucher
					</Button>
					<Button
						onClick={() => setSeedModalOpen(true)}
						className="min-h-0 h-9 px-3.5 border-[length:var(--border-width)] border-black dark:border-outline bg-accent text-accent-foreground font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift rounded-lg active:scale-[0.96] transition-transform">
						<Gift className="size-3.5 mr-1.5" />
						Seed Codes
					</Button>
					<Button
						onClick={fetchData}
						disabled={loading}
						className="min-h-0 size-9 p-0 border-[length:var(--border-width)] border-black dark:border-outline bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift rounded-lg active:scale-[0.96] transition-transform"
						title="Refresh data">
						<RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
					</Button>
				</div>
			</div>

			{/* KPI Summary Tiles */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
				<div className="p-3.5 border-[length:var(--border-width)] border-black dark:border-outline bg-card shadow-brutal-xs rounded-xl flex items-center justify-between">
					<div>
						<div className="font-mono text-[10px] font-black uppercase text-muted-foreground">
							Catalog Vouchers
						</div>
						<div className="text-xl sm:text-2xl font-black font-title text-foreground mt-0.5 tabular-nums">
							{totalVouchersCount}
						</div>
						<div className="font-mono text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 font-bold">
							<span className="text-success font-black">
								{activeVouchersCount} live
							</span>
							<span>•</span>
							<span>{pausedVouchersCount} hidden</span>
						</div>
					</div>
					<div className="size-10 rounded-lg border-[length:var(--border-width)] border-black dark:border-outline bg-primary/20 flex items-center justify-center shrink-0">
						<Gift className="size-5 text-primary" />
					</div>
				</div>

				<div className="p-3.5 border-[length:var(--border-width)] border-black dark:border-outline bg-card shadow-brutal-xs rounded-xl flex items-center justify-between">
					<div>
						<div className="font-mono text-[10px] font-black uppercase text-muted-foreground">
							Available Stock
						</div>
						<div className="text-xl sm:text-2xl font-black font-title text-foreground mt-0.5 tabular-nums">
							{totalAvailableStock}
						</div>
						<div className="font-mono text-[10px] text-muted-foreground mt-0.5 font-bold">
							Secret voucher codes
						</div>
					</div>
					<div className="size-10 rounded-lg border-[length:var(--border-width)] border-black dark:border-outline bg-accent/30 flex items-center justify-center shrink-0">
						<Ticket className="size-5 text-accent-foreground" />
					</div>
				</div>

				<div className="p-3.5 border-[length:var(--border-width)] border-black dark:border-outline bg-card shadow-brutal-xs rounded-xl flex items-center justify-between">
					<div>
						<div className="font-mono text-[10px] font-black uppercase text-muted-foreground">
							Total Claims
						</div>
						<div className="text-xl sm:text-2xl font-black font-title text-foreground mt-0.5 tabular-nums">
							{totalClaims}
						</div>
						<div className="font-mono text-[10px] text-muted-foreground mt-0.5 font-bold">
							User redemptions
						</div>
					</div>
					<div className="size-10 rounded-lg border-[length:var(--border-width)] border-black dark:border-outline bg-secondary/25 flex items-center justify-center shrink-0">
						<CheckCircle2 className="size-5 text-secondary" />
					</div>
				</div>

				<div className="p-3.5 border-[length:var(--border-width)] border-black dark:border-outline bg-card shadow-brutal-xs rounded-xl flex items-center justify-between">
					<div>
						<div className="font-mono text-[10px] font-black uppercase text-muted-foreground">
							Coins Circulated
						</div>
						<div className="text-xl sm:text-2xl font-black font-title text-foreground mt-0.5 tabular-nums flex items-center gap-1.5">
							<span>{totalCoinsSpent.toLocaleString()}</span>
							<CoinIcon size={20} />
						</div>
						<div className="font-mono text-[10px] text-muted-foreground mt-0.5 font-bold">
							Claimed by smilers
						</div>
					</div>
					<div className="size-10 rounded-lg border-[length:var(--border-width)] border-black dark:border-outline bg-amber-400/20 flex items-center justify-center shrink-0">
						<CoinIcon size={22} />
					</div>
				</div>
			</div>

			{/* Search & Filters Toolbar */}
			<div className="flex flex-col gap-3 p-3.5 border-[length:var(--border-width)] border-black dark:border-outline bg-card shadow-brutal-xs rounded-xl">
				<div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<Input
							placeholder="Search brand, coupon code, or benefit (e.g. Apple, Domino's, Flat ₹150)..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8 h-9 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline font-mono text-xs bg-background rounded-lg shadow-brutal-xs"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery('')}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground hover:text-foreground cursor-pointer">
								✕
							</button>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{/* Status Filter */}
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value as any)}
							className="h-9 min-h-0 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline bg-background font-mono text-[11px] font-bold uppercase rounded-lg shadow-brutal-xs cursor-pointer">
							<option value="all">All Status</option>
							<option value="active">🟢 Live / Visible Only</option>
							<option value="paused">⏸️ Hidden / Paused Only</option>
						</select>

						{/* Reward Type Filter */}
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className="h-9 min-h-0 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline bg-background font-mono text-[11px] font-bold uppercase rounded-lg shadow-brutal-xs cursor-pointer">
							<option value="all">All Reward Types</option>
							<option value="discount">🏷️ Discount / Coupon</option>
							<option value="subscription">📺 OTT / Subscription</option>
							<option value="gift_card">💳 Cash / Gift Card</option>
							<option value="perk">🎁 Freebie / Perk</option>
						</select>

						{/* Category Filter */}
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="h-9 min-h-0 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline bg-background font-mono text-[11px] font-bold uppercase rounded-lg shadow-brutal-xs cursor-pointer">
							<option value="all">All Categories</option>
							{CATEGORIES.map((c) => (
								<option
									key={c.value}
									value={c.value}>
									{c.label}
								</option>
							))}
						</select>

						{/* Stock Filter */}
						<select
							value={stockFilter}
							onChange={(e) => setStockFilter(e.target.value)}
							className="h-9 min-h-0 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline bg-background font-mono text-[11px] font-bold uppercase rounded-lg shadow-brutal-xs cursor-pointer">
							<option value="all">All Stock Status</option>
							<option value="in_stock">In Stock (&gt; 0)</option>
							<option value="low_stock">Low Stock (1-5)</option>
							<option value="out_of_stock">Out of Stock (0)</option>
						</select>

						{(searchQuery ||
							statusFilter !== 'all' ||
							categoryFilter !== 'all' ||
							typeFilter !== 'all' ||
							stockFilter !== 'all') && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									setSearchQuery('');
									setStatusFilter('all');
									setCategoryFilter('all');
									setTypeFilter('all');
									setStockFilter('all');
								}}
								className="h-9 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline font-mono text-[11px] font-bold text-muted-foreground hover:text-foreground px-2.5 rounded-lg shadow-brutal-xs">
								<RotateCcw className="size-3 mr-1" />
								Reset
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Catalog Grid */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<SlidersHorizontal className="size-3.5 text-foreground" />
						<h3 className="font-mono text-xs font-black uppercase text-foreground">
							Live Marketplace Catalog ({filteredCatalog.length} of{' '}
							{catalog.length})
						</h3>
					</div>
					<span className="font-mono text-[11px] text-muted-foreground">
						Total Claims:{' '}
						<strong className="tabular-nums text-foreground">
							{totalClaims}
						</strong>
					</span>
				</div>

				{filteredCatalog.length === 0 ?
					<div className="p-10 border-[length:var(--border-width)] border-black dark:border-outline bg-card text-center space-y-2 shadow-brutal rounded-xl">
						<AlertTriangle className="size-8 text-secondary mx-auto" />
						<h4 className="font-black font-title text-base text-foreground">
							No Matching Vouchers
						</h4>
						<p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
							No vouchers match your current filters. Try changing your search
							query or reset the filter tags.
						</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSearchQuery('');
								setStatusFilter('all');
								setCategoryFilter('all');
								setTypeFilter('all');
								setStockFilter('all');
							}}
							className="mt-2 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline font-mono text-xs font-bold">
							Clear All Filters
						</Button>
					</div>
				:	<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{filteredCatalog.map((voucher) => {
							const availableItem = summary.find(
								(s) => s.voucher_id === voucher.id && s.status === 'available',
							);
							const stockCount = availableItem?.count || 0;
							const isActive = voucher.isActive ?? true;

							return (
								<div
									key={voucher.id}
									className={cn(
										'border-[length:var(--border-width)] border-black dark:border-outline bg-card p-4 shadow-brutal flex flex-col justify-between gap-3.5 relative transition-all rounded-xl',
										!isActive && 'opacity-80 bg-muted/20 border-dashed',
									)}>
									{/* Top Header Strip */}
									<div className="flex items-center justify-between gap-2 border-b-[length:var(--border-width)] border-border/20 pb-2.5">
										<div className="flex items-center gap-1.5 flex-wrap">
											<span className="font-mono text-[10px] font-black uppercase text-foreground border-[length:var(--border-width)] border-black dark:border-outline bg-primary px-2 py-0.5 rounded-md shadow-brutal-xs">
												{voucher.brandName}
											</span>
											<span className="font-mono text-[9px] font-bold uppercase text-muted-foreground bg-muted/60 border-[length:var(--border-width)] border-border/40 px-1.5 py-0.5 rounded">
												{voucher.category}
											</span>
										</div>

										<div className="flex items-center gap-1.5">
											{voucher.highlightTag && (
												<span className="border-[length:var(--border-width)] border-black dark:border-outline bg-secondary px-2 py-0.5 font-mono text-[9px] font-black uppercase text-secondary-foreground rounded-md shadow-brutal-xs">
													{voucher.highlightTag}
												</span>
											)}
											<span
												className={cn(
													'border-[length:var(--border-width)] border-black dark:border-outline px-2 py-0.5 font-mono text-[9px] font-black uppercase rounded-md shadow-brutal-xs flex items-center gap-1',
													isActive ?
														'bg-success/20 text-success border-success/40'
													:	'bg-muted text-muted-foreground border-border/40',
												)}>
												<span
													className={cn(
														'size-1.5 rounded-full',
														isActive ? 'bg-success' : 'bg-muted-foreground',
													)}
												/>
												{isActive ? 'Live' : 'Paused'}
											</span>
										</div>
									</div>

									{/* Brand Logo & Title */}
									<div className="flex items-start gap-3">
										<BrandLogoImage
											brandName={voucher.brandName}
											imageUrl={voucher.imageUrl}
											size={48}
										/>

										<div className="flex-1 min-w-0">
											<h4 className="font-black font-title text-sm text-foreground leading-snug truncate">
												{voucher.title}
											</h4>
											<p className="font-mono text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
												{voucher.description ||
													'Redeem this voucher with smile coins.'}
											</p>
										</div>
									</div>

									{/* Benefit & Stock Row */}
									<div className="flex items-center justify-between border-t-[length:var(--border-width)] border-border/20 pt-2.5 font-mono bg-muted/20 p-2.5 rounded-lg border-[length:var(--border-width)] border-border/20">
										<div>
											<div className="text-xs font-black text-foreground flex items-center gap-1.5">
												<span className="text-[10px] font-bold uppercase text-muted-foreground">
													Benefit:
												</span>
												<span className="text-primary-foreground font-black px-1.5 py-0.5 bg-primary border-[length:var(--border-width)] border-black dark:border-outline rounded text-[11px]">
													{voucher.valueFormatted ||
														(voucher.numericValue ?
															`₹${voucher.numericValue}`
														:	'Special Offer')}
												</span>
											</div>
											<div className="text-[11px] font-extrabold text-foreground mt-1 flex items-center gap-1">
												<span className="text-muted-foreground">Cost:</span>
												<strong className="text-xs tabular-nums text-foreground">
													{voucher.coinsCost}
												</strong>
												<CoinIcon size={14} />
											</div>
										</div>

										<div className="text-right">
											<div className="flex items-center justify-end gap-1.5">
												<span
													className={cn(
														'size-2 rounded-full',
														stockCount > 5 ? 'bg-success'
														: stockCount > 0 ? 'bg-amber-500 animate-pulse'
														: 'bg-destructive animate-pulse',
													)}
												/>
												<span
													className={cn(
														'text-sm font-black leading-none tabular-nums',
														stockCount > 5 ? 'text-success'
														: stockCount > 0 ? 'text-amber-500'
														: 'text-destructive',
													)}>
													{stockCount}
												</span>
											</div>
											<div className="text-[9px] font-black uppercase text-muted-foreground mt-0.5 tracking-wider">
												{stockCount > 5 ?
													'In Stock'
												: stockCount > 0 ?
													'Low Stock'
												:	'Sold Out'}
											</div>
										</div>
									</div>

									{/* Actions Row: Switch for Hide/Show + Action Buttons */}
									<div className="flex items-center justify-between gap-2 border-t-[length:var(--border-width)] border-border/20 pt-2.5">
										{/* Switch to Hide/Show in Store */}
										<div className="flex items-center gap-2">
											<Switch
												id={`toggle-${voucher.id}`}
												checked={isActive}
												disabled={togglingId === voucher.id}
												onCheckedChange={() => handleToggleActive(voucher)}
												className="data-[state=checked]:bg-success"
											/>
											<label
												htmlFor={`toggle-${voucher.id}`}
												className={cn(
													'font-mono text-[10px] font-black uppercase cursor-pointer select-none tracking-tight',
													isActive ? 'text-success' : 'text-muted-foreground',
												)}>
												{isActive ? 'Visible' : 'Hidden'}
											</label>
										</div>

										{/* Action Buttons */}
										<div className="flex items-center gap-1.5">
											<Button
												size="sm"
												variant="outline"
												onClick={() => openSeedModalFor(voucher.id)}
												className="min-h-0 h-7 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline bg-accent/20 hover:bg-accent font-mono text-[10px] font-bold text-accent-foreground shadow-brutal-xs rounded-md active:scale-[0.96] transition-transform"
												title="Add voucher codes">
												<Plus className="size-2.5 mr-1" />
												Restock
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => openEditModal(voucher)}
												className="min-h-0 h-7 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline bg-card hover:bg-muted font-mono text-[10px] font-bold shadow-brutal-xs rounded-md active:scale-[0.96] transition-transform"
												title="Edit voucher settings">
												<Pencil className="size-2.5 mr-1 text-foreground" />
												Edit
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => openDeleteModal(voucher)}
												title="Delete voucher"
												className="min-h-0 size-7 p-0 border-[length:var(--border-width)] border-black dark:border-outline bg-destructive/10 hover:bg-destructive hover:text-white shadow-brutal-xs text-destructive rounded-md active:scale-[0.96] transition-transform">
												<Trash2 className="size-3" />
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				}
			</div>

			{/* Claims Table */}
			<div className="border-[length:var(--border-width)] border-black dark:border-outline bg-card shadow-brutal overflow-hidden rounded-xl">
				<div className="p-3.5 border-b-[length:var(--border-width)] border-black dark:border-outline bg-muted/40 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="size-4 text-secondary" />
						<h3 className="font-mono text-xs font-black uppercase text-foreground">
							Redemption History (
							<span className="tabular-nums">{totalClaims}</span>)
						</h3>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b-[length:var(--border-width)] border-border/30 bg-muted/20 font-mono text-[10px] font-black uppercase text-foreground">
								<th className="p-3">Smiler</th>
								<th className="p-3">Provider / Tier</th>
								<th className="p-3">Voucher Code</th>
								<th className="p-3">Coins Spent</th>
								<th className="p-3">Redeemed At</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/20 font-mono text-xs">
							{loading && claims.length === 0 ?
								<tr>
									<td
										colSpan={5}
										className="p-6 text-center text-muted-foreground font-bold">
										Loading claims...
									</td>
								</tr>
							: claims.length === 0 ?
								<tr>
									<td
										colSpan={5}
										className="p-6 text-center text-muted-foreground font-bold">
										No voucher redemptions logged yet.
									</td>
								</tr>
							:	claims.map((claim) => (
									<tr
										key={claim.id}
										className="hover:bg-muted/30 transition-colors">
										<td className="p-3">
											<div className="font-bold text-foreground text-xs leading-tight">
												{claim.user_name}
											</div>
											<div className="text-[10px] text-muted-foreground">
												{claim.user_email}
											</div>
										</td>
										<td className="p-3">
											<span className="border-[length:var(--border-width)] border-black dark:border-outline bg-primary px-1.5 py-0.5 text-[9px] font-black uppercase text-primary-foreground rounded-md">
												{claim.provider || claim.tier}
											</span>
										</td>
										<td className="p-3 font-mono font-bold select-all text-foreground text-[11px]">
											{claim.voucher_code}
										</td>
										<td className="p-3 font-bold text-secondary text-xs tabular-nums">
											<div className="flex items-center gap-1">
												<span>{claim.coins_spent}</span>
												<CoinIcon size={13} />
											</div>
										</td>
										<td className="p-3 text-muted-foreground text-[11px] tabular-nums">
											{new Date(claim.claimed_at).toLocaleDateString()}
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</div>
			</div>

			{/* ========================================================= */}
			{/* MODAL 1: Add Voucher                                      */}
			{/* ========================================================= */}
			{createModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleCreateVoucher}
						className="w-full max-w-3xl border-[length:var(--border-width)] border-black dark:border-outline rounded-xl bg-card shadow-brutal-xl overflow-hidden flex flex-col max-h-[92vh]">
						{/* Header Bar */}
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black dark:border-outline p-4 bg-muted/40 shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black dark:border-outline bg-primary flex items-center justify-center shadow-brutal-xs">
									<Building2 className="size-4 text-primary-foreground" />
								</div>
								<div>
									<h3 className="font-black font-title text-base sm:text-lg text-foreground leading-tight">
										Add Brand Voucher
									</h3>
									<p className="font-mono text-[11px] text-muted-foreground">
										Create a reward for the user marketplace and seed initial
										inventory codes
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setCreateModalOpen(false)}
								className="size-8 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg flex items-center justify-center font-bold text-sm bg-card hover:bg-muted shadow-brutal-xs active:scale-[0.96] transition-transform cursor-pointer">
								✕
							</button>
						</div>

						{/* Form Body */}
						<div className="p-5 overflow-y-auto flex-1 space-y-4">
							{/* Voucher Type Selector */}
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
													if (t.id === 'discount' && newCoins === '1000')
														setNewCoins('250');
													if (t.id === 'subscription' && newCoins === '250')
														setNewCoins('600');
												}}
												className={cn(
													'flex flex-col items-center justify-center p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg text-center font-mono text-xs transition-all cursor-pointer active:scale-[0.96] min-h-0',
													isSelected ?
														'bg-primary text-primary-foreground font-black shadow-brutal-xs'
													:	'bg-background hover:bg-muted text-muted-foreground font-bold',
												)}>
												<Icon className="size-4 mb-1" />
												<span className="font-bold text-xs">{t.label}</span>
												<span className="text-[10px] opacity-75">{t.desc}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* 2-Column Section */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
								{/* Left Column: Merchant, Logo & Offer Benefit */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-background shadow-brutal-xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b-[length:var(--border-width)] border-border/20 pb-2 flex items-center gap-1.5">
										<ShieldCheck className="size-3.5 text-primary" />
										Merchant & Brand Logo
									</div>

									{/* Brand Logo & Merchant Name */}
									<div className="flex items-start gap-3">
										<div className="relative group shrink-0">
											<BrandLogoImage
												brandName={newBrand || 'Brand'}
												imageUrl={newLogoPreview || newImage}
												size={52}
											/>
											{newUploadingLogo && (
												<div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
													<Loader2 className="size-3.5 text-white animate-spin" />
												</div>
											)}
											{(newLogoPreview || newImage) && (
												<button
													type="button"
													onClick={() => handleRemoveLogo(false)}
													className="absolute -top-1.5 -right-1.5 size-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center border-[length:var(--border-width)] border-black dark:border-outline hover:scale-110 text-[9px] font-bold cursor-pointer"
													title="Reset logo">
													✕
												</button>
											)}
										</div>

										<div className="flex-1 min-w-0 space-y-1">
											<label className="block font-mono text-[10px] font-black uppercase text-foreground">
												Brand Name *
											</label>
											<Input
												required
												placeholder="e.g. Apple, Domino's, Lenskart, Netflix"
												value={newBrand}
												onChange={(e) => setNewBrand(e.target.value)}
												className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-semibold rounded-md shadow-brutal-xs"
											/>
											<p className="font-mono text-[9px] text-muted-foreground">
												{newBrand ?
													`Detected logo: ${resolveBrandLogo(newBrand) ? 'Available' : 'Initials'}`
												:	'Brand logo auto-detects from name'}
											</p>
										</div>
									</div>

									{/* Custom Logo Options: File Upload or Direct URL */}
									<div className="p-2.5 border-[length:var(--border-width)] border-border/40 bg-muted/20 rounded-md space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-mono text-[10px] font-black uppercase text-foreground">
												Custom Logo (Optional)
											</span>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => newFileInputRef.current?.click()}
												className="h-6 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-card font-mono text-[9px] font-bold px-2 rounded">
												<Upload className="size-2.5 mr-1" />
												Upload WebP
											</Button>
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
										<Input
											placeholder="Or paste direct image URL (https://...)"
											value={newImage}
											onChange={(e) => {
												setNewImage(e.target.value);
												setNewLogoPreview(e.target.value || null);
											}}
											className="h-8 min-h-0 text-[11px] border-[length:var(--border-width)] border-black dark:border-outline font-mono rounded bg-background"
										/>
									</div>

									{/* Category */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Category *
										</label>
										<select
											value={newCategory}
											onChange={(e) => setNewCategory(e.target.value)}
											className="w-full h-9 min-h-0 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs font-semibold shadow-brutal-xs">
											{CATEGORIES.map((c) => (
												<option
													key={c.value}
													value={c.value}>
													{c.label}
												</option>
											))}
										</select>
									</div>

									{/* Voucher Title */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Voucher Title *
										</label>
										<Input
											required
											placeholder="e.g. 500$ Apple Gift Card, 65% OFF Pizza Coupon"
											value={newTitle}
											onChange={(e) => setNewTitle(e.target.value)}
											className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs"
										/>
									</div>

									{/* Dynamic Benefit Field */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Reward Benefit / Value *
										</label>
										{newType === 'discount' ?
											<div className="flex items-center gap-1.5">
												<select
													value={newDiscountMode}
													onChange={(e) =>
														setNewDiscountMode(e.target.value as any)
													}
													className="h-9 min-h-0 w-28 px-2 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs font-bold shrink-0 shadow-brutal-xs">
													<option value="percent">% Off</option>
													<option value="flat">Flat ₹ Off</option>
												</select>
												{newDiscountMode === 'percent' ?
													<div className="relative flex-1">
														<Input
															required
															type="number"
															min="1"
															max="100"
															value={newDiscountPercent}
															onChange={(e) =>
																setNewDiscountPercent(e.target.value)
															}
															placeholder="65"
															className="h-9 min-h-0 pr-7 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
														/>
														<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															%
														</span>
													</div>
												:	<div className="relative flex-1">
														<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															₹
														</span>
														<Input
															required
															type="number"
															min="1"
															value={newFlatDiscount}
															onChange={(e) =>
																setNewFlatDiscount(e.target.value)
															}
															placeholder="150"
															className="h-9 min-h-0 pl-6 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
														/>
													</div>
												}
											</div>
										: newType === 'subscription' ?
											<Input
												required
												placeholder="e.g. 1 Month, 3 Months VIP, 1 Year Plan"
												value={newSubDuration}
												onChange={(e) => setNewSubDuration(e.target.value)}
												className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs"
											/>
										: newType === 'perk' ?
											<Input
												required
												placeholder="e.g. Free Garlic Bread with Cheese"
												value={newPerkTitle}
												onChange={(e) => setNewPerkTitle(e.target.value)}
												className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs"
											/>
										:	<div className="relative">
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
														if (!isNaN(n) && n > 0)
															setNewCoins(String(Math.round(n * 2)));
													}}
													className="h-9 min-h-0 pl-6 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
												/>
											</div>
										}
									</div>
								</div>

								{/* Right Column: Economics, Terms & Codes */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-background shadow-brutal-xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b-[length:var(--border-width)] border-border/20 pb-2 flex items-center gap-1.5">
										<CoinIcon size={15} />
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
													className="h-9 min-h-0 pr-8 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
												/>
												<span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
													<CoinIcon size={16} />
												</span>
											</div>
										</div>

										<div>
											<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
												Highlight Tag
											</label>
											<Input
												placeholder="e.g. Hot Coupon, Top Deal"
												value={newHighlight}
												onChange={(e) => setNewHighlight(e.target.value)}
												className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline rounded-md shadow-brutal-xs"
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
											placeholder="e.g. Valid on all orders above ₹299. Apply code on checkout."
											className="w-full p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs shadow-brutal-xs"
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
											placeholder={`VOUCH-10928\nVOUCH-10929`}
											className="w-full p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs shadow-brutal-xs"
										/>
									</div>
								</div>
							</div>

							{/* Offer Details & Terms (Markdown - Google Pay Style) */}
							<div className="p-4 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-background shadow-brutal-xs space-y-2.5">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b-[length:var(--border-width)] border-border/20 pb-2">
									<div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
										<FileText className="size-3.5 text-primary" />
										Offer Details & Terms (Markdown - GPay Style)
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => setNewDetails(DEFAULT_G_PAY_MARKDOWN_TEMPLATE)}
											className="text-[10px] font-mono font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 min-h-0">
											<Sparkles className="size-3" />
											Insert GPay Template
										</button>
										<div className="flex items-center border-[length:var(--border-width)] border-black dark:border-outline rounded overflow-hidden">
											<button
												type="button"
												onClick={() => setNewDetailsTab('write')}
												className={cn(
													'px-2.5 py-0.5 text-[10px] font-mono font-bold cursor-pointer transition-colors min-h-0',
													newDetailsTab === 'write' ?
														'bg-primary text-primary-foreground font-black'
													:	'bg-card text-muted-foreground hover:bg-muted',
												)}>
												Write
											</button>
											<button
												type="button"
												onClick={() => setNewDetailsTab('preview')}
												className={cn(
													'px-2.5 py-0.5 text-[10px] font-mono font-bold cursor-pointer transition-colors min-h-0',
													newDetailsTab === 'preview' ?
														'bg-primary text-primary-foreground font-black'
													:	'bg-card text-muted-foreground hover:bg-muted',
												)}>
												Preview
											</button>
										</div>
									</div>
								</div>

								{newDetailsTab === 'write' ?
									<div className="space-y-1">
										<textarea
											rows={4}
											value={newDetails}
											onChange={(e) => setNewDetails(e.target.value)}
											placeholder={`### Offer Details\n- Valid on all orders above ₹499\n- Valid once per user\n\n### How to Redeem\n1. Copy secret code\n2. Apply on merchant checkout`}
											className="w-full p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs shadow-brutal-xs leading-relaxed"
										/>
										<p className="font-mono text-[9px] text-muted-foreground">
											Shown in the user voucher claim modal. Supports Markdown headings (###), bullet points (-), numbered lists (1.), and bold (**text**).
										</p>
									</div>
								:	<div className="min-h-[100px] max-h-48 overflow-y-auto p-3 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-muted/30 text-xs">
										{newDetails.trim() ?
											<div className="space-y-1.5">
												<ReactMarkdown
													components={{
														h1: ({ children }) => (
															<h1 className="font-title font-black text-sm uppercase tracking-wide text-foreground mt-2 mb-1">
																{children}
															</h1>
														),
														h2: ({ children }) => (
															<h2 className="font-title font-black text-xs uppercase tracking-wide text-foreground mt-2 mb-1">
																{children}
															</h2>
														),
														h3: ({ children }) => (
															<h3 className="font-title font-bold text-xs uppercase tracking-wide text-primary mt-2 mb-1">
																{children}
															</h3>
														),
														p: ({ children }) => (
															<p className="text-xs text-foreground/90 leading-relaxed mb-1">
																{children}
															</p>
														),
														ul: ({ children }) => (
															<ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground my-1">
																{children}
															</ul>
														),
														ol: ({ children }) => (
															<ol className="list-decimal list-inside space-y-0.5 text-xs text-muted-foreground my-1">
																{children}
															</ol>
														),
														li: ({ children }) => (
															<li className="leading-relaxed">{children}</li>
														),
														strong: ({ children }) => (
															<strong className="font-bold text-foreground">
																{children}
															</strong>
														),
														a: ({ href, children }) => (
															<a
																href={href}
																target="_blank"
																rel="noopener noreferrer"
																className="text-primary underline">
																{children}
															</a>
														),
													}}>
													{newDetails}
												</ReactMarkdown>
											</div>
										:	<p className="font-mono text-xs text-muted-foreground italic">
												No details written yet. Click &apos;Write&apos; or &apos;Insert GPay Template&apos; to add markdown details.
											</p>
										}
									</div>
								}
							</div>
						</div>

						{/* Footer Bar */}
						<div className="flex items-center justify-between border-t-[length:var(--border-width)] border-black dark:border-outline p-4 bg-muted/40 shrink-0">
							<span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
								Voucher will immediately be available in user rewards catalog.
							</span>

							<div className="flex items-center gap-2 ml-auto">
								<Button
									type="button"
									onClick={() => setCreateModalOpen(false)}
									className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-card font-mono text-xs font-bold text-foreground h-9 px-4 rounded-md shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform">
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={creating || newUploadingLogo}
									className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-primary text-primary-foreground font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-5 rounded-md brutal-lift active:scale-[0.96] transition-transform">
									{creating ? 'Saving...' : 'Save Voucher to Catalog'}
								</Button>
							</div>
						</div>
					</form>
				</div>
			)}

			{/* ========================================================= */}
			{/* MODAL 2: Edit Voucher                                     */}
			{/* ========================================================= */}
			{editModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleUpdateVoucher}
						className="w-full max-w-3xl border-[length:var(--border-width)] border-black dark:border-outline rounded-xl bg-card shadow-brutal-xl overflow-hidden flex flex-col max-h-[92vh]">
						{/* Header Bar */}
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black dark:border-outline p-4 bg-muted/40 shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black dark:border-outline bg-primary flex items-center justify-center shadow-brutal-xs">
									<Pencil className="size-4 text-primary-foreground" />
								</div>
								<div>
									<h3 className="font-black font-title text-base sm:text-lg text-foreground leading-tight">
										Edit Voucher Details
									</h3>
									<p className="font-mono text-[11px] text-muted-foreground">
										Modify brand, reward configuration, coin price, and
										visibility status
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setEditModalOpen(false)}
								className="size-8 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg flex items-center justify-center font-bold text-sm bg-card hover:bg-muted shadow-brutal-xs active:scale-[0.96] transition-transform cursor-pointer">
								✕
							</button>
						</div>

						{/* Form Body */}
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
													'flex flex-col items-center justify-center p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg text-center font-mono text-xs transition-all cursor-pointer active:scale-[0.96] min-h-0',
													isSelected ?
														'bg-primary text-primary-foreground font-black shadow-brutal-xs'
													:	'bg-background hover:bg-muted text-muted-foreground font-bold',
												)}>
												<Icon className="size-4 mb-1" />
												<span className="font-bold text-xs">{t.label}</span>
												<span className="text-[10px] opacity-75">{t.desc}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* 2-Column Section */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
								{/* Left Column */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-background shadow-brutal-xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b-[length:var(--border-width)] border-border/20 pb-2 flex items-center gap-1.5">
										<ShieldCheck className="size-3.5 text-primary" />
										Merchant & Brand Logo
									</div>

									{/* Brand Logo & Merchant Name */}
									<div className="flex items-start gap-3">
										<div className="relative group shrink-0">
											<BrandLogoImage
												brandName={editBrand || 'Brand'}
												imageUrl={editLogoPreview || editImage}
												size={52}
											/>
											{editUploadingLogo && (
												<div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
													<Loader2 className="size-3.5 text-white animate-spin" />
												</div>
											)}
											{(editLogoPreview || editImage) && (
												<button
													type="button"
													onClick={() => handleRemoveLogo(true)}
													className="absolute -top-1.5 -right-1.5 size-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center border-[length:var(--border-width)] border-black dark:border-outline hover:scale-110 text-[9px] font-bold cursor-pointer"
													title="Reset logo">
													✕
												</button>
											)}
										</div>

										<div className="flex-1 min-w-0 space-y-1">
											<label className="block font-mono text-[10px] font-black uppercase text-foreground">
												Brand Name *
											</label>
											<Input
												required
												value={editBrand}
												onChange={(e) => setEditBrand(e.target.value)}
												className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-semibold rounded-md shadow-brutal-xs"
											/>
											<p className="font-mono text-[9px] text-muted-foreground">
												{editBrand ?
													`Detected logo: ${resolveBrandLogo(editBrand) ? 'Available' : 'Initials'}`
												:	'Brand logo auto-detects from name'}
											</p>
										</div>
									</div>

									{/* Custom Logo Options */}
									<div className="p-2.5 border-[length:var(--border-width)] border-border/40 bg-muted/20 rounded-md space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-mono text-[10px] font-black uppercase text-foreground">
												Custom Logo (Optional)
											</span>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => editFileInputRef.current?.click()}
												className="h-6 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-card font-mono text-[9px] font-bold px-2 rounded">
												<Upload className="size-2.5 mr-1" />
												Upload WebP
											</Button>
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
										<Input
											placeholder="Or paste direct image URL (https://...)"
											value={editImage}
											onChange={(e) => {
												setEditImage(e.target.value);
												setEditLogoPreview(e.target.value || null);
											}}
											className="h-8 min-h-0 text-[11px] border-[length:var(--border-width)] border-black dark:border-outline font-mono rounded bg-background"
										/>
									</div>

									{/* Category */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Category *
										</label>
										<select
											value={editCategory}
											onChange={(e) => setEditCategory(e.target.value)}
											className="w-full h-9 min-h-0 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs font-semibold shadow-brutal-xs">
											{CATEGORIES.map((c) => (
												<option
													key={c.value}
													value={c.value}>
													{c.label}
												</option>
											))}
										</select>
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
											className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs"
										/>
									</div>

									{/* Dynamic Benefit Field */}
									<div>
										<label className="block font-mono text-[10px] font-black uppercase text-foreground mb-1">
											Reward Benefit / Value *
										</label>
										{editType === 'discount' ?
											<div className="flex items-center gap-1.5">
												<select
													value={editDiscountMode}
													onChange={(e) =>
														setEditDiscountMode(e.target.value as any)
													}
													className="h-9 min-h-0 w-28 px-2 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs font-bold shrink-0 shadow-brutal-xs">
													<option value="percent">% Off</option>
													<option value="flat">₹ Off</option>
												</select>
												{editDiscountMode === 'percent' ?
													<div className="relative flex-1">
														<Input
															required
															type="number"
															min="1"
															max="100"
															value={editDiscountPercent}
															onChange={(e) =>
																setEditDiscountPercent(e.target.value)
															}
															placeholder="65"
															className="h-9 min-h-0 pr-7 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
														/>
														<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															%
														</span>
													</div>
												:	<div className="relative flex-1">
														<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
															₹
														</span>
														<Input
															required
															type="number"
															min="1"
															value={editFlatDiscount}
															onChange={(e) =>
																setEditFlatDiscount(e.target.value)
															}
															placeholder="150"
															className="h-9 min-h-0 pl-6 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
														/>
													</div>
												}
											</div>
										: editType === 'subscription' ?
											<Input
												required
												placeholder="e.g. 1 Month, 3 Months VIP, 1 Year Plan"
												value={editSubDuration}
												onChange={(e) => setEditSubDuration(e.target.value)}
												className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs"
											/>
										: editType === 'perk' ?
											<Input
												required
												placeholder="e.g. Free Garlic Bread with Cheese"
												value={editPerkTitle}
												onChange={(e) => setEditPerkTitle(e.target.value)}
												className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs"
											/>
										:	<div className="relative">
												<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">
													₹
												</span>
												<Input
													required
													type="number"
													min="1"
													value={editMoney}
													onChange={(e) => setEditMoney(e.target.value)}
													className="h-9 min-h-0 pl-6 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
												/>
											</div>
										}
									</div>
								</div>

								{/* Right Column */}
								<div className="space-y-3 p-4 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-background shadow-brutal-xs">
									<div className="font-mono text-xs font-black uppercase text-foreground border-b-[length:var(--border-width)] border-border/20 pb-2 flex items-center gap-1.5">
										<CoinIcon size={15} />
										Pricing & Store Visibility
									</div>

									{/* Coins Cost */}
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
												className="h-9 min-h-0 pr-8 text-xs border-[length:var(--border-width)] border-black dark:border-outline font-bold rounded-md shadow-brutal-xs tabular-nums"
											/>
											<span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
												<CoinIcon size={16} />
											</span>
										</div>
									</div>

									{/* Store Visibility Toggle with Switch */}
									<div className="flex items-center justify-between p-3 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-card shadow-brutal-xs">
										<div>
											<label
												htmlFor="edit-store-visibility"
												className="block font-mono text-xs font-black uppercase text-foreground cursor-pointer">
												Store Visibility
											</label>
											<p className="font-mono text-[10px] text-muted-foreground">
												{editIsActive ?
													'Visible in user marketplace'
												:	'Hidden from marketplace'}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Switch
												id="edit-store-visibility"
												checked={editIsActive}
												onCheckedChange={setEditIsActive}
												className="data-[state=checked]:bg-success"
											/>
											<span
												className={cn(
													'font-mono text-xs font-black uppercase',
													editIsActive ? 'text-success' : (
														'text-muted-foreground'
													),
												)}>
												{editIsActive ? 'Visible' : 'Hidden'}
											</span>
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
											className="h-9 min-h-0 text-xs border-[length:var(--border-width)] border-black dark:border-outline rounded-md shadow-brutal-xs"
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
											className="w-full p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs shadow-brutal-xs"
										/>
									</div>
								</div>
							</div>

							{/* Offer Details & Terms (Markdown - Google Pay Style) */}
							<div className="p-4 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-background shadow-brutal-xs space-y-2.5">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b-[length:var(--border-width)] border-border/20 pb-2">
									<div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
										<FileText className="size-3.5 text-primary" />
										Offer Details & Terms (Markdown - GPay Style)
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => setEditDetails(DEFAULT_G_PAY_MARKDOWN_TEMPLATE)}
											className="text-[10px] font-mono font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 min-h-0">
											<Sparkles className="size-3" />
											Insert GPay Template
										</button>
										<div className="flex items-center border-[length:var(--border-width)] border-black dark:border-outline rounded overflow-hidden">
											<button
												type="button"
												onClick={() => setEditDetailsTab('write')}
												className={cn(
													'px-2.5 py-0.5 text-[10px] font-mono font-bold cursor-pointer transition-colors min-h-0',
													editDetailsTab === 'write' ?
														'bg-primary text-primary-foreground font-black'
													:	'bg-card text-muted-foreground hover:bg-muted',
												)}>
												Write
											</button>
											<button
												type="button"
												onClick={() => setEditDetailsTab('preview')}
												className={cn(
													'px-2.5 py-0.5 text-[10px] font-mono font-bold cursor-pointer transition-colors min-h-0',
													editDetailsTab === 'preview' ?
														'bg-primary text-primary-foreground font-black'
													:	'bg-card text-muted-foreground hover:bg-muted',
												)}>
												Preview
											</button>
										</div>
									</div>
								</div>

								{editDetailsTab === 'write' ?
									<div className="space-y-1">
										<textarea
											rows={4}
											value={editDetails}
											onChange={(e) => setEditDetails(e.target.value)}
											placeholder={`### Offer Details\n- Valid on all orders above ₹499\n- Valid once per user\n\n### How to Redeem\n1. Copy secret code\n2. Apply on merchant checkout`}
											className="w-full p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs shadow-brutal-xs leading-relaxed"
										/>
										<p className="font-mono text-[9px] text-muted-foreground">
											Shown in the user voucher claim modal. Supports Markdown headings (###), bullet points (-), numbered lists (1.), and bold (**text**).
										</p>
									</div>
								:	<div className="min-h-[100px] max-h-48 overflow-y-auto p-3 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-muted/30 text-xs">
										{editDetails.trim() ?
											<div className="space-y-1.5">
												<ReactMarkdown
													components={{
														h1: ({ children }) => (
															<h1 className="font-title font-black text-sm uppercase tracking-wide text-foreground mt-2 mb-1">
																{children}
															</h1>
														),
														h2: ({ children }) => (
															<h2 className="font-title font-black text-xs uppercase tracking-wide text-foreground mt-2 mb-1">
																{children}
															</h2>
														),
														h3: ({ children }) => (
															<h3 className="font-title font-bold text-xs uppercase tracking-wide text-primary mt-2 mb-1">
																{children}
															</h3>
														),
														p: ({ children }) => (
															<p className="text-xs text-foreground/90 leading-relaxed mb-1">
																{children}
															</p>
														),
														ul: ({ children }) => (
															<ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground my-1">
																{children}
															</ul>
														),
														ol: ({ children }) => (
															<ol className="list-decimal list-inside space-y-0.5 text-xs text-muted-foreground my-1">
																{children}
															</ol>
														),
														li: ({ children }) => (
															<li className="leading-relaxed">{children}</li>
														),
														strong: ({ children }) => (
															<strong className="font-bold text-foreground">
																{children}
															</strong>
														),
														a: ({ href, children }) => (
															<a
																href={href}
																target="_blank"
																rel="noopener noreferrer"
																className="text-primary underline">
																{children}
															</a>
														),
													}}>
													{editDetails}
												</ReactMarkdown>
											</div>
										:	<p className="font-mono text-xs text-muted-foreground italic">
												No details written yet. Click &apos;Write&apos; or &apos;Insert GPay Template&apos; to add markdown details.
											</p>
										}
									</div>
								}
							</div>
						</div>

						{/* Footer Bar */}
						<div className="flex items-center justify-between border-t-[length:var(--border-width)] border-black dark:border-outline p-4 bg-muted/40 shrink-0">
							<span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
								Changes will update immediately across catalog.
							</span>

							<div className="flex items-center gap-2 ml-auto">
								<Button
									type="button"
									onClick={() => setEditModalOpen(false)}
									className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-card font-mono text-xs font-bold text-foreground h-9 px-4 rounded-md shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform">
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={editing || editUploadingLogo}
									className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-primary text-primary-foreground font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-5 rounded-md brutal-lift active:scale-[0.96] transition-transform">
									{editing ? 'Saving...' : 'Save Changes'}
								</Button>
							</div>
						</div>
					</form>
				</div>
			)}

			{/* ========================================================= */}
			{/* MODAL 3: Delete Confirmation                              */}
			{/* ========================================================= */}
			{deleteModalOpen && voucherToDelete && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
					<div className="w-full max-w-md border-[length:var(--border-width)] border-black dark:border-outline rounded-xl bg-card p-6 shadow-brutal-xl space-y-4">
						<div className="flex items-center gap-3 text-destructive">
							<div className="p-2 border-[length:var(--border-width)] border-black dark:border-outline rounded-lg bg-destructive/10">
								<AlertTriangle
									className="size-6"
									strokeWidth={2.5}
								/>
							</div>
							<div>
								<h3 className="text-lg font-black font-title text-foreground">
									Delete Voucher?
								</h3>
								<p className="font-mono text-xs text-muted-foreground font-semibold">
									{voucherToDelete.brandName} — {voucherToDelete.title}
								</p>
							</div>
						</div>

						<p className="font-mono text-xs text-muted-foreground leading-relaxed">
							This will permanently remove this voucher from the catalog and
							purge all{' '}
							<span className="font-black text-foreground underline">
								unclaimed codes
							</span>{' '}
							in stock. Past user redemptions and coin balances will remain
							safely recorded.
						</p>

						<div className="flex items-center justify-end gap-2 pt-2 border-t-[length:var(--border-width)] border-border/20">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									setDeleteModalOpen(false);
									setVoucherToDelete(null);
								}}
								className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline font-mono text-xs font-bold h-9 px-3.5 rounded-md shadow-brutal-xs">
								Cancel
							</Button>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={handleConfirmDelete}
								disabled={deleting}
								className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-4 rounded-md brutal-lift active:scale-[0.96] transition-transform">
								{deleting ? 'Deleting...' : 'Permanently Delete'}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* ========================================================= */}
			{/* MODAL 4: Code Seeder                                      */}
			{/* ========================================================= */}
			{seedModalOpen && (
				<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
					<form
						onSubmit={handleSeedVouchers}
						className="w-full max-w-md border-[length:var(--border-width)] border-black dark:border-outline rounded-xl bg-card p-6 shadow-brutal-xl space-y-4">
						<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-border/20 pb-2.5">
							<div className="flex items-center gap-2">
								<Gift className="size-5 text-accent" />
								<h3 className="font-black font-title text-lg text-foreground">
									Batch Seed Voucher Codes
								</h3>
							</div>
							<button
								type="button"
								onClick={() => setSeedModalOpen(false)}
								className="size-7 min-h-0 border-[length:var(--border-width)] border-black dark:border-outline rounded-md flex items-center justify-center font-bold text-xs bg-card hover:bg-muted shadow-brutal-xs active:scale-[0.96] transition-transform cursor-pointer">
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
									className="w-full h-9 min-h-0 px-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs font-bold shadow-brutal-xs">
									{catalog.map((v) => (
										<option
											key={v.id}
											value={v.id}>
											[{v.brandName}] {v.title} (
											{v.valueFormatted || `₹${v.numericValue}`})
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
									className="w-full p-2.5 border-[length:var(--border-width)] border-black dark:border-outline rounded-md bg-background font-mono text-xs shadow-brutal-xs"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-2 border-t-[length:var(--border-width)] border-border/20">
							<Button
								type="button"
								onClick={() => setSeedModalOpen(false)}
								className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-card font-mono text-xs font-bold text-foreground h-9 px-3.5 rounded-md shadow-brutal-xs">
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={seeding}
								className="min-h-0 border-[length:var(--border-width)] border-black dark:border-outline bg-accent text-accent-foreground font-mono text-xs font-black uppercase shadow-brutal-xs h-9 px-4 rounded-md brutal-lift active:scale-[0.96] transition-transform">
								{seeding ? 'Seeding...' : 'Seed into Stock'}
							</Button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
