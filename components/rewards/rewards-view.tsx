'use client';

import * as React from 'react';
import {
	ShoppingBag,
	Wallet,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import {
	UserCoinBalance,
	useUserCoins,
	emitCoinBalanceUpdate,
	COIN_BALANCE_EVENT,
} from '@/components/ui/user-coin-balance';
import { ScratchCardGallery } from '@/components/rewards/scratch-card-gallery';
import { VoucherMarketplace } from '@/components/rewards/voucher-marketplace';
import { ClaimedVouchersList } from '@/components/rewards/claimed-vouchers-list';
import type { ClaimedVoucher, VoucherItem } from '@/components/rewards/voucher-data';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { cn } from '@/lib/utils';

type VoucherTab = 'marketplace' | 'my-vouchers';

export function RewardsView() {
	const { settings } = useSystemSettings();
	const [activeTab, setActiveTab] = React.useState<VoucherTab>('marketplace');
	const { balance: userCoins, setBalance: setUserCoins } = useUserCoins();
	const [claimedVouchers, setClaimedVouchers] = React.useState<ClaimedVoucher[]>([]);

	const loadClaimedVouchers = React.useCallback(async () => {
		try {
			const res = await fetch('/api/rewards/my-vouchers', {
				cache: 'no-store',
				headers: { 'Cache-Control': 'no-cache' },
			});
			if (res.ok) {
				const json = await res.json();
				if (Array.isArray(json)) {
					setClaimedVouchers(json);
				}
			}
		} catch {}
	}, []);

	React.useEffect(() => {
		loadClaimedVouchers();
	}, [loadClaimedVouchers]);

	React.useEffect(() => {
		const handleBalanceUpdate = () => {
			loadClaimedVouchers();
		};
		window.addEventListener(COIN_BALANCE_EVENT, handleBalanceUpdate);
		return () => {
			window.removeEventListener(COIN_BALANCE_EVENT, handleBalanceUpdate);
		};
	}, [loadClaimedVouchers]);

	const handleClaimSuccess = (voucher: VoucherItem, claim: ClaimedVoucher) => {
		const updatedBalance = Math.max(0, userCoins - voucher.coinsCost);
		setUserCoins(updatedBalance);
		emitCoinBalanceUpdate(updatedBalance);
		setClaimedVouchers((prev) => [claim, ...prev]);
	};

	const handleTabNavigate = (tab: 'my-vouchers' | 'marketplace' | 'scratch' | 'badges') => {
		if (tab === 'scratch') {
			const target = document.getElementById('scratch-cards-section');
			target?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		if (tab === 'my-vouchers' || tab === 'marketplace') {
			setActiveTab(tab);
		}
	};

	return (
		<main id="main-content" className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 space-y-6 sm:space-y-8">
			<section
				className="relative overflow-hidden border-[length:var(--border-width)] border-black rounded-xl bg-card py-8 px-4 sm:py-10 shadow-brutal-md reveal-in flex flex-col items-center justify-center"
				aria-label="Rewards Hero Banner"
			>
				<div className="absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 pointer-events-none blur-2xl" />
				<div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-warning/10 pointer-events-none blur-2xl" />

				<div className="relative flex flex-col items-center justify-center select-none">
					<CoinIcon className="size-24 sm:size-32 drop-shadow-[0_4px_16px_rgba(234,179,8,0.35)]" />
					<div className="-mt-4 sm:-mt-5 z-10 border-2 sm:border-[2.5px] border-amber-500 rounded-full bg-white dark:bg-card px-5 py-0.5 sm:px-6 sm:py-1 shadow-sm flex items-center justify-center min-w-[80px] sm:min-w-[96px]">
						<span className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-black dark:text-foreground tabular-nums tracking-tight">
							<UserCoinBalance />
						</span>
					</div>
				</div>
			</section>

			<section
				id="scratch-cards-section"
				aria-label="Scratch Card & Voucher Vault"
				className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-3.5 sm:p-6 md:p-7 shadow-brutal-sm sm:shadow-brutal-md"
			>
				<ScratchCardGallery />
			</section>

			<section
				id="voucher-section"
				aria-label="Voucher Marketplace & Wallet"
				className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-3.5 sm:p-6 md:p-7 shadow-brutal-sm sm:shadow-brutal-md space-y-4 sm:space-y-6"
			>
				<div className="flex flex-col gap-3 pb-3 sm:pb-5 border-b-[length:var(--border-width)] border-black sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="font-title text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-foreground leading-tight">
							Brand Vouchers &amp; Wallet
						</h2>
						<p className="font-sans text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">
							Redeem accumulated smile coins for genuine brand gift cards or access your digital codes
						</p>
					</div>

					<div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1 bg-muted/60 border-[length:var(--border-width)] border-black rounded-lg w-full sm:w-auto">
						<button
							type="button"
							onClick={() => setActiveTab('marketplace')}
							className={cn(
								'flex items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap',
								activeTab === 'marketplace'
									? 'border border-black bg-primary text-primary-foreground shadow-brutal-xs font-black'
									: 'border-transparent text-muted-foreground hover:text-foreground'
							)}
						>
							<ShoppingBag className="size-3.5" strokeWidth={2.5} />
							<span>Marketplace</span>
						</button>

						<button
							type="button"
							onClick={() => setActiveTab('my-vouchers')}
							className={cn(
								'flex items-center justify-center gap-1.5 rounded-md px-2.5 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap',
								activeTab === 'my-vouchers'
									? 'border border-black bg-primary text-primary-foreground shadow-brutal-xs font-black'
									: 'border-transparent text-muted-foreground hover:text-foreground'
							)}
						>
							<Wallet className="size-3.5" strokeWidth={2.5} />
							<span>My Vouchers ({claimedVouchers.length})</span>
						</button>
					</div>
				</div>

				<div>
					{activeTab === 'marketplace' ? (
						(settings.marketplace_enabled === false || settings.maintenance_mode) ? (
							<div className="mx-auto max-w-xl text-center py-12 sm:py-16 px-4 sm:px-6 border-[length:var(--border-width)] border-black rounded-2xl bg-card shadow-brutal space-y-3 sm:space-y-4">
								<div className="size-14 sm:size-16 mx-auto rounded-xl sm:rounded-2xl border-[length:var(--border-width)] border-black bg-muted flex items-center justify-center shadow-brutal-xs">
									<ShoppingBag className="size-7 sm:size-8 text-muted-foreground" />
								</div>
								<h2 className="text-xl sm:text-2xl font-black font-title tracking-tight">Voucher Marketplace Paused</h2>
								<p className="font-mono text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
									{settings.maintenance_mode
										? 'Platform maintenance is currently active. Gift voucher redemptions are temporarily paused.'
										: 'Gift voucher redemption is temporarily closed by platform administrators.'}{' '}
									Your accumulated coins remain safely stored!
								</p>
							</div>
						) : (
							<VoucherMarketplace
								userCoins={userCoins}
								onClaimSuccess={handleClaimSuccess}
								onNavigateToTab={handleTabNavigate}
							/>
						)
					) : (
						<ClaimedVouchersList
							claimedVouchers={claimedVouchers}
							onOpenMarketplace={() => setActiveTab('marketplace')}
						/>
					)}
				</div>
			</section>
		</main>
	);
}
