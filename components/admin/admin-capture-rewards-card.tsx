'use client';

import * as React from 'react';
import {
	Coins,
	Sparkles,
	RotateCcw,
	Check,
	RefreshCw,
	Sliders,
	Flame,
	Ticket,
	Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
	SMILE_TIERS,
	DEFAULT_LUCKY_DROP_CHANCE,
	DEFAULT_LUCKY_BONUS_MIN,
	DEFAULT_LUCKY_BONUS_MAX,
	type SmileTier,
	type CaptureRewardConfig,
} from '@/lib/reward-calculator';

interface AdminCaptureRewardsCardProps {
	currentSettings?: Record<string, any>;
	onSettingsUpdated?: () => void;
}

const TIER_BADGES: Record<string, { bg: string; text: string; border: string; desc: string }> = {
	RADIANT: { bg: 'bg-[#C6F135]/25', text: 'text-foreground', border: 'border-[#C6F135]', desc: 'Ecstatic / Peak smile' },
	GLOWING: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/60', desc: 'Big authentic smile' },
	WARM: { bg: 'bg-warning/20', text: 'text-warning-foreground', border: 'border-warning/60', desc: 'Warm open smile' },
	GENTLE: { bg: 'bg-accent/20', text: 'text-accent-foreground', border: 'border-accent/60', desc: 'Pleasant gentle smile' },
	SUBTLE: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', desc: 'Slight grin / smirk' },
	FAINT: { bg: 'bg-muted/60', text: 'text-muted-foreground/70', border: 'border-border/60', desc: 'Minimal smile' },
	NONE: { bg: 'bg-destructive/15', text: 'text-destructive', border: 'border-destructive/40', desc: 'Neutral or frown' },
};

export function AdminCaptureRewardsCard({
	currentSettings = {},
	onSettingsUpdated,
}: AdminCaptureRewardsCardProps) {
	const { toast } = useToast();
	const [isSaving, setIsSaving] = React.useState(false);

	const initialConfig = React.useMemo<CaptureRewardConfig>(() => {
		const raw = currentSettings.capture_reward_config?.value ?? currentSettings.capture_reward_config;
		const cfg: CaptureRewardConfig = typeof raw === 'object' && raw !== null ? raw : {};

		return {
			coin_multiplier: Number(currentSettings.coin_multiplier?.value ?? currentSettings.coin_multiplier ?? cfg.coin_multiplier ?? 1.0),
			min_smile_score_threshold: Number(currentSettings.min_smile_score_threshold?.value ?? currentSettings.min_smile_score_threshold ?? cfg.min_smile_score_threshold ?? 11),
			scratch_min_coins: Number(currentSettings.scratch_min_coins?.value ?? currentSettings.scratch_min_coins ?? cfg.scratch_min_coins ?? 5),
			scratch_max_coins: Number(currentSettings.scratch_max_coins?.value ?? currentSettings.scratch_max_coins ?? cfg.scratch_max_coins ?? 100),
			lucky_drop_enabled: cfg.lucky_drop_enabled !== false,
			lucky_drop_chance: Number(cfg.lucky_drop_chance ?? DEFAULT_LUCKY_DROP_CHANCE),
			lucky_bonus_min: Number(cfg.lucky_bonus_min ?? DEFAULT_LUCKY_BONUS_MIN),
			lucky_bonus_max: Number(cfg.lucky_bonus_max ?? DEFAULT_LUCKY_BONUS_MAX),
			tiers: Array.isArray(cfg.tiers) && cfg.tiers.length > 0 ? cfg.tiers : SMILE_TIERS,
		};
	}, [currentSettings]);

	const [config, setConfig] = React.useState<CaptureRewardConfig>(initialConfig);

	React.useEffect(() => {
		setConfig(initialConfig);
	}, [initialConfig]);

	const handleTierChange = (index: number, field: keyof SmileTier, value: string) => {
		const num = Math.max(0, parseInt(value, 10) || 0);
		setConfig((prev) => {
			const currentTiers = prev.tiers ? [...prev.tiers] : [...SMILE_TIERS];
			currentTiers[index] = {
				...currentTiers[index],
				[field]: field === 'name' ? value : num,
			};
			return { ...prev, tiers: currentTiers };
		});
	};

	const handleResetDefaults = () => {
		setConfig({
			coin_multiplier: 1.0,
			min_smile_score_threshold: 11,
			scratch_min_coins: 5,
			scratch_max_coins: 100,
			lucky_drop_enabled: true,
			lucky_drop_chance: DEFAULT_LUCKY_DROP_CHANCE,
			lucky_bonus_min: DEFAULT_LUCKY_BONUS_MIN,
			lucky_bonus_max: DEFAULT_LUCKY_BONUS_MAX,
			tiers: SMILE_TIERS,
		});
		toast({
			title: 'Reset to Defaults',
			description: 'Default capture reward settings restored. Click Save to apply.',
			variant: 'info',
		});
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const sanitizedConfig: CaptureRewardConfig = {
				...config,
				coin_multiplier: Math.max(0.1, Number(config.coin_multiplier) || 1.0),
				min_smile_score_threshold: Math.max(0, Math.min(100, Number(config.min_smile_score_threshold) || 11)),
				scratch_min_coins: Math.max(1, Number(config.scratch_min_coins) || 5),
				scratch_max_coins: Math.max(1, Number(config.scratch_max_coins) || 100),
				lucky_drop_enabled: Boolean(config.lucky_drop_enabled),
				lucky_drop_chance: Math.max(0, Math.min(1, Number(config.lucky_drop_chance) || 0.1)),
				lucky_bonus_min: Math.max(1, Number(config.lucky_bonus_min) || 2),
				lucky_bonus_max: Math.max(1, Number(config.lucky_bonus_max) || 5),
				tiers: (config.tiers || SMILE_TIERS).map((t) => ({
					name: t.name,
					minScore: Math.max(0, Math.min(100, Number(t.minScore) || 0)),
					minCoins: Math.max(0, Number(t.minCoins) || 0),
					maxCoins: Math.max(0, Number(t.maxCoins) || 0),
				})),
			};

			const savePayloads = [
				{
					key: 'capture_reward_config',
					value: sanitizedConfig,
					description: 'Capture reward tiers, multipliers, and drop chances',
				},
				{
					key: 'coin_multiplier',
					value: sanitizedConfig.coin_multiplier,
					description: 'Global boost applied to all earned capture coins',
				},
				{
					key: 'min_smile_score_threshold',
					value: sanitizedConfig.min_smile_score_threshold,
					description: 'Minimum genuine smile percentage score required to award coins',
				},
				{
					key: 'scratch_min_coins',
					value: sanitizedConfig.scratch_min_coins,
					description: 'Minimum mystery coin prize awarded inside post-capture scratch cards',
				},
				{
					key: 'scratch_max_coins',
					value: sanitizedConfig.scratch_max_coins,
					description: 'Maximum mystery coin prize awarded inside post-capture scratch cards',
				},
			];

			for (const p of savePayloads) {
				const res = await fetch('/api/admin/settings', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(p),
				});
				if (!res.ok) {
					const json = await res.json().catch(() => ({}));
					throw new Error(json.error || `Failed saving ${p.key}`);
				}
			}

			if (typeof window !== 'undefined') {
				window.dispatchEvent(new Event('system-settings-changed'));
			}

			toast({
				title: 'Settings Saved',
				description: 'Capture rewards configuration updated successfully.',
				variant: 'success',
			});

			onSettingsUpdated?.();
		} catch (err: any) {
			toast({
				title: 'Save Failed',
				description: err.message || 'Could not update reward configuration',
				variant: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const activeTiers = config.tiers && config.tiers.length > 0 ? config.tiers : SMILE_TIERS;
	const multiplier = Number(config.coin_multiplier) || 1.0;

	return (
		<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-5 shadow-brutal space-y-5">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[length:var(--border-width)] border-black/15 pb-3.5">
				<div className="flex items-center gap-2.5">
					<div className="size-9 rounded-lg border-[length:var(--border-width)] border-black bg-warning flex items-center justify-center shadow-brutal-xs shrink-0">
						<Coins className="size-4 text-warning-foreground" />
					</div>
					<div>
						<h2 className="font-black font-title text-base sm:text-lg text-foreground">
							Capture Rewards & Economy
						</h2>
						<p className="font-mono text-xs text-muted-foreground">
							Full control over smile tiers, base coins, multiplier boosts, and scratch bounds.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 self-end sm:self-auto">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleResetDefaults}
						disabled={isSaving}
						className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-8 px-2.5">
						<RotateCcw className="size-3 mr-1" />
						Reset
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleSave}
						disabled={isSaving}
						className="border-[length:var(--border-width)] border-black bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift h-8 px-3.5">
						{isSaving ? (
							<>
								<RefreshCw className="size-3 mr-1 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Check className="size-3 mr-1" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Section 1: Core Bounds & Multipliers */}
			<div className="space-y-2.5">
				<div className="flex items-center gap-1.5">
					<Sliders className="size-3.5 text-primary" />
					<h3 className="font-mono text-xs font-black uppercase text-foreground tracking-wide">
						Core Settings & Multipliers
					</h3>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
					{/* Multiplier */}
					<div className="p-3 rounded-lg border border-black bg-muted/20 flex flex-col justify-between gap-2 shadow-brutal-xs">
						<div>
							<div className="flex items-center justify-between mb-0.5">
								<label className="font-mono text-xs font-black uppercase text-foreground">
									Coin Multiplier
								</label>
								<span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-card border border-black/15 text-muted-foreground">
									x Boost
								</span>
							</div>
							<p className="font-mono text-[10px] text-muted-foreground">
								Global payout multiplier for all captures.
							</p>
						</div>
						<Input
							type="number"
							step={0.1}
							min={0.1}
							max={10.0}
							value={config.coin_multiplier ?? 1.0}
							onChange={(e) => setConfig((prev) => ({ ...prev, coin_multiplier: parseFloat(e.target.value) || 1.0 }))}
							className="border-[length:var(--border-width)] border-black font-mono text-xs tabular-nums h-8 bg-card rounded-md shadow-brutal-xs"
						/>
					</div>

					{/* Min Score Threshold */}
					<div className="p-3 rounded-lg border border-black bg-muted/20 flex flex-col justify-between gap-2 shadow-brutal-xs">
						<div>
							<div className="flex items-center justify-between mb-0.5">
								<label className="font-mono text-xs font-black uppercase text-foreground flex items-center gap-1">
									<Flame className="size-3 text-primary" />
									Min Score
								</label>
								<span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-card border border-black/15 text-muted-foreground">
									% Floor
								</span>
							</div>
							<p className="font-mono text-[10px] text-muted-foreground">
								Cutoff score to earn coins. Below = 0.
							</p>
						</div>
						<Input
							type="number"
							step={1}
							min={0}
							max={100}
							value={config.min_smile_score_threshold ?? 11}
							onChange={(e) => setConfig((prev) => ({ ...prev, min_smile_score_threshold: parseInt(e.target.value, 10) || 0 }))}
							className="border-[length:var(--border-width)] border-black font-mono text-xs tabular-nums h-8 bg-card rounded-md shadow-brutal-xs"
						/>
					</div>

					{/* Scratch Min */}
					<div className="p-3 rounded-lg border border-black bg-muted/20 flex flex-col justify-between gap-2 shadow-brutal-xs">
						<div>
							<div className="flex items-center justify-between mb-0.5">
								<label className="font-mono text-xs font-black uppercase text-foreground flex items-center gap-1">
									<Ticket className="size-3 text-accent-foreground" />
									Scratch Min
								</label>
								<span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-card border border-black/15 text-muted-foreground">
									Coins
								</span>
							</div>
							<p className="font-mono text-[10px] text-muted-foreground">
								Minimum mystery scratch card coins.
							</p>
						</div>
						<Input
							type="number"
							step={1}
							min={1}
							max={500}
							value={config.scratch_min_coins ?? 5}
							onChange={(e) => setConfig((prev) => ({ ...prev, scratch_min_coins: parseInt(e.target.value, 10) || 1 }))}
							className="border-[length:var(--border-width)] border-black font-mono text-xs tabular-nums h-8 bg-card rounded-md shadow-brutal-xs"
						/>
					</div>

					{/* Scratch Max */}
					<div className="p-3 rounded-lg border border-black bg-muted/20 flex flex-col justify-between gap-2 shadow-brutal-xs">
						<div>
							<div className="flex items-center justify-between mb-0.5">
								<label className="font-mono text-xs font-black uppercase text-foreground flex items-center gap-1">
									<Ticket className="size-3 text-accent-foreground" />
									Scratch Max
								</label>
								<span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-card border border-black/15 text-muted-foreground">
									Coins
								</span>
							</div>
							<p className="font-mono text-[10px] text-muted-foreground">
								Maximum mystery scratch card coins.
							</p>
						</div>
						<Input
							type="number"
							step={5}
							min={10}
							max={2000}
							value={config.scratch_max_coins ?? 100}
							onChange={(e) => setConfig((prev) => ({ ...prev, scratch_max_coins: parseInt(e.target.value, 10) || 100 }))}
							className="border-[length:var(--border-width)] border-black font-mono text-xs tabular-nums h-8 bg-card rounded-md shadow-brutal-xs"
						/>
					</div>
				</div>
			</div>

			{/* Section 2: Full Control Smile Quality Tiers Table */}
			<div className="space-y-2.5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5">
						<Sparkles className="size-3.5 text-warning" />
						<h3 className="font-mono text-xs font-black uppercase text-foreground tracking-wide">
							Smile Quality Tiers & Coin Matrix
						</h3>
					</div>
					<span className="font-mono text-[10px] text-muted-foreground">
						Full live control over all tier thresholds and coin ranges
					</span>
				</div>

				<div className="overflow-x-auto rounded-lg border border-black bg-card shadow-brutal-xs">
					<table className="w-full text-left font-mono text-xs border-collapse">
						<thead>
							<tr className="border-b border-black/20 bg-muted/40 text-[11px] font-black uppercase text-muted-foreground">
								<th className="py-2.5 px-3">Tier</th>
								<th className="py-2.5 px-3">Description</th>
								<th className="py-2.5 px-3">Min Score (%)</th>
								<th className="py-2.5 px-3">Min Coins</th>
								<th className="py-2.5 px-3">Max Coins</th>
								<th className="py-2.5 px-3 text-right">Effective Payout</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/15">
							{activeTiers.map((tier, idx) => {
								const badge = TIER_BADGES[tier.name] || TIER_BADGES.NONE;
								const effectiveMin = Math.round(tier.minCoins * multiplier);
								const effectiveMax = Math.round(tier.maxCoins * multiplier);

								return (
									<tr key={tier.name} className="hover:bg-muted/15 transition-colors">
										<td className="py-2 px-3 whitespace-nowrap">
											<span className={cn('inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-black uppercase', badge.bg, badge.text, badge.border)}>
												{tier.name}
											</span>
										</td>
										<td className="py-2 px-3 text-muted-foreground text-[11px] whitespace-nowrap">
											{badge.desc}
										</td>
										<td className="py-2 px-3">
											<div className="flex items-center gap-1">
												<Input
													type="number"
													min={0}
													max={100}
													value={tier.minScore}
													onChange={(e) => handleTierChange(idx, 'minScore', e.target.value)}
													className="w-20 h-7 border border-black font-mono text-xs tabular-nums bg-card rounded shadow-brutal-xs"
												/>
												<span className="text-[10px] text-muted-foreground">%</span>
											</div>
										</td>
										<td className="py-2 px-3">
											<Input
												type="number"
												min={0}
												max={1000}
												value={tier.minCoins}
												onChange={(e) => handleTierChange(idx, 'minCoins', e.target.value)}
												className="w-20 h-7 border border-black font-mono text-xs tabular-nums bg-card rounded shadow-brutal-xs"
											/>
										</td>
										<td className="py-2 px-3">
											<Input
												type="number"
												min={0}
												max={1000}
												value={tier.maxCoins}
												onChange={(e) => handleTierChange(idx, 'maxCoins', e.target.value)}
												className="w-20 h-7 border border-black font-mono text-xs tabular-nums bg-card rounded shadow-brutal-xs"
											/>
										</td>
										<td className="py-2 px-3 text-right font-black text-foreground tabular-nums whitespace-nowrap">
											{effectiveMin === 0 && effectiveMax === 0 ? (
												<span className="text-muted-foreground/60 text-[10px]">0 coins</span>
											) : (
												<span className="text-xs">
													{effectiveMin} – {effectiveMax} coins
												</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* Section 3: Lucky Drop Bonus */}
			<div className="p-3.5 rounded-lg border border-black bg-muted/15 space-y-3 shadow-brutal-xs">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Gift className="size-3.5 text-primary" />
						<div>
							<h4 className="font-mono text-xs font-black uppercase text-foreground">
								Surprise Lucky Drop Bonus
							</h4>
							<p className="font-mono text-[10px] text-muted-foreground">
								Random chance to reward smilers with extra bonus coins.
							</p>
						</div>
					</div>
					<Switch
						checked={config.lucky_drop_enabled}
						onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, lucky_drop_enabled: checked }))}
						className="data-[state=checked]:bg-primary"
					/>
				</div>

				{config.lucky_drop_enabled && (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-black/10">
						<div>
							<span className="font-mono text-[10px] text-muted-foreground block mb-1">
								Drop Chance (%)
							</span>
							<Input
								type="number"
								min={1}
								max={100}
								value={Math.round((config.lucky_drop_chance ?? 0.1) * 100)}
								onChange={(e) => setConfig((prev) => ({ ...prev, lucky_drop_chance: Math.max(0, Math.min(100, Number(e.target.value) || 0)) / 100 }))}
								className="h-8 border border-black font-mono text-xs tabular-nums bg-card rounded shadow-brutal-xs"
							/>
						</div>
						<div>
							<span className="font-mono text-[10px] text-muted-foreground block mb-1">
								Min Bonus Coins
							</span>
							<Input
								type="number"
								min={1}
								max={100}
								value={config.lucky_bonus_min ?? 2}
								onChange={(e) => setConfig((prev) => ({ ...prev, lucky_bonus_min: parseInt(e.target.value, 10) || 1 }))}
								className="h-8 border border-black font-mono text-xs tabular-nums bg-card rounded shadow-brutal-xs"
							/>
						</div>
						<div>
							<span className="font-mono text-[10px] text-muted-foreground block mb-1">
								Max Bonus Coins
							</span>
							<Input
								type="number"
								min={1}
								max={500}
								value={config.lucky_bonus_max ?? 5}
								onChange={(e) => setConfig((prev) => ({ ...prev, lucky_bonus_max: parseInt(e.target.value, 10) || 1 }))}
								className="h-8 border border-black font-mono text-xs tabular-nums bg-card rounded shadow-brutal-xs"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
