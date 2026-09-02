"use client";

import * as React from "react";
import {
	SlidersHorizontal,
	Shield,
	Coins,
	Database,
	Trash2,
	RefreshCw,
	Check,
	Lock,
	UserPlus,
	Gift,
	Compass,
	Trophy,
	Eye,
	Hash,
	Sparkles,
	Flame,
	Zap,
	AlertTriangle,
	UserCheck,
	Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SettingToggleConfig {
	key: string;
	label: string;
	description: string;
	defaultValue: boolean;
	icon: React.ElementType;
	badgeText?: string;
	danger?: boolean;
}

interface SettingNumberConfig {
	key: string;
	label: string;
	description: string;
	defaultValue: number;
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	icon: React.ElementType;
}

const FEATURE_SWITCHES: SettingToggleConfig[] = [
	{
		key: "maintenance_mode",
		label: "Maintenance Mode",
		description: "Temporarily lock smile capture and voucher redemption for platform upgrades.",
		defaultValue: false,
		icon: Lock,
		danger: true,
	},
	{
		key: "signup_enabled",
		label: "User Signups",
		description: "Allow new users to register. When disabled, redirects prospective smilers to waitlist.",
		defaultValue: true,
		icon: UserPlus,
	},
	{
		key: "beta_waitlist_mode",
		label: "Beta Waitlist Mode",
		description: "Direct landing hero buttons to join the early access waitlist.",
		defaultValue: false,
		icon: UserCheck,
	},
	{
		key: "marketplace_enabled",
		label: "Voucher Marketplace",
		description: "Enable coin redemption for Amazon and digital shopping vouchers.",
		defaultValue: true,
		icon: Gift,
	},
	{
		key: "explore_feed_enabled",
		label: "Explore Social Feed",
		description: "Public community photo feed displaying verified smilers and smiles.",
		defaultValue: true,
		icon: Compass,
	},
	{
		key: "explore_posting_enabled",
		label: "Public Post Submissions",
		description: "Allow users to optionally publish their captures to the public Explore feed.",
		defaultValue: true,
		icon: Sparkles,
	},
	{
		key: "leaderboard_enabled",
		label: "Live Leaderboards",
		description: "Display daily, weekly, and monthly competitive smile rankings.",
		defaultValue: true,
		icon: Trophy,
	},
	{
		key: "scratch_cards_enabled",
		label: "Mystery Scratch Cards",
		description: "Award interactive scratch cards with mystery bonus rewards on successful capture.",
		defaultValue: true,
		icon: Ticket,
	},
	{
		key: "email_otp_required",
		label: "Mandatory Email OTP",
		description: "Enforce 6-digit email OTP verification before creating authenticated sessions.",
		defaultValue: true,
		icon: Shield,
	},
];

const ANTI_CHEAT_SWITCHES: SettingToggleConfig[] = [
	{
		key: "liveness_detection_enabled",
		label: "Liveness Blink Verification",
		description: "Prompt user for facial blink / head motion verification before capturing smile.",
		defaultValue: true,
		icon: Eye,
	},
	{
		key: "image_hash_check_enabled",
		label: "Perceptual Hash Deduplication",
		description: "Reject duplicate or re-photographed smile uploads using pHash matching.",
		defaultValue: true,
		icon: Hash,
	},
	{
		key: "auto_flag_anomalies_enabled",
		label: "Auto-Flag Score Anomalies",
		description: "Automatically flag captures with suspicious instant 100% scores for audit review.",
		defaultValue: true,
		icon: AlertTriangle,
	},
];

const ANTI_CHEAT_NUMBERS: SettingNumberConfig[] = [
	{
		key: "min_capture_cooldown_minutes",
		label: "Capture Cooldown",
		description: "Minimum minutes a user must wait between verified reward captures.",
		defaultValue: 60,
		min: 1,
		max: 1440,
		step: 1,
		unit: "min",
		icon: Shield,
	},
	{
		key: "max_daily_captures_per_user",
		label: "Daily Capture Cap",
		description: "Maximum rewarded smile captures allowed per smiler per calendar day.",
		defaultValue: 10,
		min: 1,
		max: 50,
		step: 1,
		unit: "captures",
		icon: Zap,
	},
	{
		key: "min_smile_score_threshold",
		label: "Min Score Threshold",
		description: "Minimum genuine smile percentage score required to award coins.",
		defaultValue: 50,
		min: 10,
		max: 95,
		step: 1,
		unit: "%",
		icon: Flame,
	},
];

const ECONOMY_NUMBERS: SettingNumberConfig[] = [
	{
		key: "coin_multiplier",
		label: "Coin Reward Multiplier",
		description: "Global boost applied to all earned capture coins (e.g. 1.5 for weekend boost).",
		defaultValue: 1.0,
		min: 0.1,
		max: 10.0,
		step: 0.1,
		unit: "x",
		icon: Coins,
	},
	{
		key: "referral_reward_coins",
		label: "Referrer Coin Reward",
		description: "Coins credited to referrer upon their friend's first verified smile capture.",
		defaultValue: 50,
		min: 0,
		max: 2000,
		step: 5,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "referee_bonus_coins",
		label: "New User Referral Bonus",
		description: "Welcome coins granted to newly referred user upon signing up with a code.",
		defaultValue: 25,
		min: 0,
		max: 1000,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "daily_streak_coins",
		label: "Daily Streak Bonus",
		description: "Bonus coins awarded per consecutive daily active smile streak milestone.",
		defaultValue: 5,
		min: 0,
		max: 100,
		step: 1,
		unit: "coins",
		icon: Flame,
	},
	{
		key: "scratch_min_coins",
		label: "Scratch Card Min Coins",
		description: "Minimum mystery coin prize awarded inside post-capture scratch cards.",
		defaultValue: 5,
		min: 1,
		max: 50,
		step: 1,
		unit: "coins",
		icon: Ticket,
	},
	{
		key: "scratch_max_coins",
		label: "Scratch Card Max Coins",
		description: "Maximum mystery coin prize awarded inside post-capture scratch cards.",
		defaultValue: 100,
		min: 10,
		max: 1000,
		step: 5,
		unit: "coins",
		icon: Ticket,
	},
];

export default function AdminSettingsPage() {
	const { toast } = useToast();
	const [settings, setSettings] = React.useState<Record<string, any>>({});
	const [formValues, setFormValues] = React.useState<Record<string, string>>({});
	const [loading, setLoading] = React.useState(true);
	const [savingKeys, setSavingKeys] = React.useState<Record<string, boolean>>({});

	const [cleanupLoading, setCleanupLoading] = React.useState(false);
	const [cleanupResult, setCleanupResult] = React.useState<any | null>(null);

	async function fetchSettings(isManual = false) {
		setLoading(true);
		try {
			const res = await fetch("/api/admin/settings");
			const json = await res.json();
			if (res.ok) {
				const fetched = json.settings || {};
				setSettings(fetched);

				const initialNumbers: Record<string, string> = {};
				for (const item of [...ANTI_CHEAT_NUMBERS, ...ECONOMY_NUMBERS]) {
					const val = fetched[item.key]?.value !== undefined
						? fetched[item.key]?.value
						: item.defaultValue;
					initialNumbers[item.key] = String(val);
				}
				setFormValues(initialNumbers);

				if (isManual) {
					toast({
						title: "Settings Refreshed",
						description: "Loaded latest platform parameters from database.",
						variant: "info",
					});
				}
			} else {
				toast({
					title: "Failed to load settings",
					description: json.error || "Unable to fetch system configuration",
					variant: "error",
				});
			}
		} catch (err: any) {
			toast({
				title: "Network Error",
				description: err.message || "Failed to contact admin settings API",
				variant: "error",
			});
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		fetchSettings();
	}, []);

	async function handleToggleSwitch(key: string, nextValue: boolean, label: string, description: string) {
		setSavingKeys((prev) => ({ ...prev, [key]: true }));
		setSettings((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				value: nextValue,
			},
		}));

		try {
			const res = await fetch("/api/admin/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key, value: nextValue, description }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to update toggle");

			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("system-settings-changed"));
			}

			toast({
				title: `${label} Updated`,
				description: `${label} is now ${nextValue ? "ENABLED" : "DISABLED"}.`,
				variant: "success",
			});
		} catch (err: any) {
			setSettings((prev) => ({
				...prev,
				[key]: {
					...prev[key],
					value: !nextValue,
				},
			}));
			toast({
				title: "Update Failed",
				description: err.message || `Could not update ${label}`,
				variant: "error",
			});
		} finally {
			setSavingKeys((prev) => ({ ...prev, [key]: false }));
		}
	}

	async function handleSaveNumber(key: string, label: string, description: string, fallbackDefault: number) {
		const rawInput = formValues[key];
		const parsed = parseFloat(rawInput);
		if (isNaN(parsed)) {
			toast({
				title: "Invalid Input",
				description: `Please enter a valid numeric value for ${label}.`,
				variant: "warning",
			});
			return;
		}

		setSavingKeys((prev) => ({ ...prev, [key]: true }));
		try {
			const res = await fetch("/api/admin/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ key, value: parsed, description }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to save parameter");

			setSettings((prev) => ({
				...prev,
				[key]: {
					...prev[key],
					value: parsed,
				},
			}));

			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("system-settings-changed"));
			}

			toast({
				title: `${label} Saved`,
				description: `Updated ${label} to ${parsed}.`,
				variant: "success",
			});
		} catch (err: any) {
			toast({
				title: "Save Failed",
				description: err.message || `Failed to update ${label}`,
				variant: "error",
			});
		} finally {
			setSavingKeys((prev) => ({ ...prev, [key]: false }));
		}
	}

	async function handleRunCleanup() {
		setCleanupLoading(true);
		try {
			const res = await fetch("/api/admin/cleanup", { method: "POST" });
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Cleanup failed");

			setCleanupResult(json);
			toast({
				title: "Maintenance Completed",
				description: `Purged ${json.deletedOtps} expired OTPs and ${json.deletedRateLimits} rate limit records.`,
				variant: "success",
			});
		} catch (err: any) {
			toast({
				title: "Cleanup Failed",
				description: err.message || "Failed to execute database sweep",
				variant: "error",
			});
		} finally {
			setCleanupLoading(false);
		}
	}

	function getToggleValue(key: string, fallback: boolean) {
		if (settings[key]?.value !== undefined) {
			return Boolean(settings[key]?.value);
		}
		return fallback;
	}

	return (
		<div className="space-y-8 pb-16">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-[length:var(--border-width)] border-black/15 pb-5">
				<div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						System Settings & Controls
					</h1>
					<p className="font-mono text-xs font-semibold text-muted-foreground">
						Live toggles for platform modules, anti-cheat thresholds, coin reward economics, and maintenance
					</p>
				</div>

				<Button
					onClick={() => fetchSettings(true)}
					disabled={loading}
					className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-10 px-4"
				>
					<RefreshCw className={cn("size-3.5 mr-2", loading && "animate-spin")} />
					Refresh Settings
				</Button>
			</div>

			{/* Section 1: Platform Feature Toggles */}
			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-6">
				<div className="border-b-[length:var(--border-width)] border-black/15 pb-3">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-black font-title text-xl text-foreground flex items-center gap-2">
								<SlidersHorizontal className="size-5 text-accent" />
								Platform Feature Toggles
							</h2>
							<p className="font-mono text-xs text-muted-foreground mt-0.5">
								Instant shadcn switches to enable or disable public site features in real time
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{FEATURE_SWITCHES.map((item) => {
						const Icon = item.icon;
						const isChecked = getToggleValue(item.key, item.defaultValue);
						const isSaving = Boolean(savingKeys[item.key]);

						return (
							<div
								key={item.key}
								className={cn(
									"border-[length:var(--border-width)] border-black rounded-xl p-4 shadow-brutal-xs transition-all flex flex-col justify-between gap-4",
									isChecked
										? item.danger
											? "bg-destructive/10 border-destructive"
											: "bg-card"
										: "bg-muted/30 opacity-80"
								)}
							>
								<div className="space-y-2">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2">
											<div className={cn(
												"size-8 rounded-lg border border-black flex items-center justify-center shrink-0 shadow-xs",
												isChecked
													? item.danger
														? "bg-destructive text-destructive-foreground"
														: "bg-accent text-black"
													: "bg-muted text-muted-foreground"
											)}>
												<Icon className="size-4" />
											</div>
											<span className="font-mono font-black text-xs uppercase text-foreground leading-tight">
												{item.label}
											</span>
										</div>

										<span className={cn(
											"font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-black shrink-0",
											isChecked
												? item.danger
													? "bg-destructive text-destructive-foreground"
													: "bg-success text-white"
												: "bg-muted text-muted-foreground"
										)}>
											{isChecked ? "ACTIVE" : "OFF"}
										</span>
									</div>

									<p className="font-mono text-[11px] text-muted-foreground leading-snug">
										{item.description}
									</p>
								</div>

								<div className="flex items-center justify-between pt-2 border-t border-black/10">
									<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
										{isSaving ? "Saving..." : isChecked ? "Status: Enabled" : "Status: Disabled"}
									</span>

									<Switch
										checked={isChecked}
										onCheckedChange={(checked) =>
											handleToggleSwitch(item.key, checked, item.label, item.description)
										}
										disabled={isSaving || loading}
										aria-label={item.label}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Section 2: Anti-Cheat & Liveness Security */}
			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-6">
				<div className="border-b-[length:var(--border-width)] border-black/15 pb-3">
					<h2 className="font-black font-title text-xl text-foreground flex items-center gap-2">
						<Shield className="size-5 text-secondary-foreground" />
						Anti-Cheat & Verification Controls
					</h2>
					<p className="font-mono text-xs text-muted-foreground mt-0.5">
						Facial biometric liveness verification, perceptual duplicate hashing, cooldown intervals, and caps
					</p>
				</div>

				<div className="space-y-4">
					<h3 className="font-mono text-xs font-black uppercase text-foreground">
						Security Enforcement Switches
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{ANTI_CHEAT_SWITCHES.map((item) => {
							const Icon = item.icon;
							const isChecked = getToggleValue(item.key, item.defaultValue);
							const isSaving = Boolean(savingKeys[item.key]);

							return (
								<div
									key={item.key}
									className={cn(
										"border-[length:var(--border-width)] border-black rounded-xl p-4 shadow-brutal-xs flex flex-col justify-between gap-4",
										isChecked ? "bg-card" : "bg-muted/30 opacity-80"
									)}
								>
									<div className="space-y-2">
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-center gap-2">
												<div className={cn(
													"size-8 rounded-lg border border-black flex items-center justify-center shrink-0 shadow-xs",
													isChecked ? "bg-primary text-black" : "bg-muted text-muted-foreground"
												)}>
													<Icon className="size-4" />
												</div>
												<span className="font-mono font-black text-xs uppercase text-foreground leading-tight">
													{item.label}
												</span>
											</div>

											<span className={cn(
												"font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-black shrink-0",
												isChecked ? "bg-success text-white" : "bg-muted text-muted-foreground"
											)}>
												{isChecked ? "ON" : "OFF"}
											</span>
										</div>

										<p className="font-mono text-[11px] text-muted-foreground leading-snug">
											{item.description}
										</p>
									</div>

									<div className="flex items-center justify-between pt-2 border-t border-black/10">
										<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
											{isSaving ? "Saving..." : isChecked ? "Enforced" : "Bypassed"}
										</span>

										<Switch
											checked={isChecked}
											onCheckedChange={(checked) =>
												handleToggleSwitch(item.key, checked, item.label, item.description)
											}
											disabled={isSaving || loading}
											aria-label={item.label}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="space-y-4 pt-4 border-t border-black/15">
					<h3 className="font-mono text-xs font-black uppercase text-foreground">
						Capture Thresholds & Limits
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{ANTI_CHEAT_NUMBERS.map((item) => {
							const Icon = item.icon;
							const isSaving = Boolean(savingKeys[item.key]);
							const val = formValues[item.key] ?? String(item.defaultValue);

							return (
								<div key={item.key} className="space-y-2 p-4 border border-black rounded-xl bg-muted/20">
									<div className="flex items-center justify-between">
										<label className="font-mono text-xs font-black uppercase text-foreground flex items-center gap-1.5">
											<Icon className="size-3.5" />
											{item.label}
										</label>
										{item.unit ? (
											<span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
												{item.unit}
											</span>
										) : null}
									</div>

									<form
										onSubmit={(e) => {
											e.preventDefault();
											handleSaveNumber(item.key, item.label, item.description, item.defaultValue);
										}}
										className="flex gap-2"
									>
										<Input
											type="number"
											min={item.min}
											max={item.max}
											step={item.step}
											value={val}
											onChange={(e) => {
												const nextVal = e.target.value;
												setFormValues((prev) => ({ ...prev, [item.key]: nextVal }));
											}}
											className="border-[length:var(--border-width)] border-black font-mono text-xs shadow-brutal-xs h-9 bg-card"
										/>
										<Button
											type="submit"
											disabled={isSaving || loading}
											className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-9 px-3 shrink-0"
										>
											{isSaving ? (
												<RefreshCw className="size-3.5 animate-spin" />
											) : (
												<Check className="size-3.5" />
											)}
										</Button>
									</form>

									<p className="font-mono text-[10px] text-muted-foreground leading-snug">
										{item.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Section 3: Economy & Coin Velocity */}
			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-6">
				<div className="border-b-[length:var(--border-width)] border-black/15 pb-3">
					<h2 className="font-black font-title text-xl text-foreground flex items-center gap-2">
						<Coins className="size-5 text-primary" />
						Reward Economy Parameters
					</h2>
					<p className="font-mono text-xs text-muted-foreground mt-0.5">
						Configure viral referral rewards, multiplier boosts, streak milestones, and scratch card coin prize ranges
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{ECONOMY_NUMBERS.map((item) => {
						const Icon = item.icon;
						const isSaving = Boolean(savingKeys[item.key]);
						const val = formValues[item.key] ?? String(item.defaultValue);

						return (
							<div key={item.key} className="space-y-2 p-4 border border-black rounded-xl bg-muted/20 flex flex-col justify-between">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<label className="font-mono text-xs font-black uppercase text-foreground flex items-center gap-1.5">
											<Icon className="size-3.5" />
											{item.label}
										</label>
										{item.unit ? (
											<span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
												{item.unit}
											</span>
										) : null}
									</div>

									<p className="font-mono text-[10px] text-muted-foreground leading-snug min-h-[28px]">
										{item.description}
									</p>
								</div>

								<form
									onSubmit={(e) => {
										e.preventDefault();
										handleSaveNumber(item.key, item.label, item.description, item.defaultValue);
									}}
									className="flex gap-2 pt-2"
								>
									<Input
										type="number"
										min={item.min}
										max={item.max}
										step={item.step}
										value={val}
										onChange={(e) => {
											const nextVal = e.target.value;
											setFormValues((prev) => ({ ...prev, [item.key]: nextVal }));
										}}
										className="border-[length:var(--border-width)] border-black font-mono text-xs shadow-brutal-xs h-9 bg-card"
									/>
									<Button
										type="submit"
										disabled={isSaving || loading}
										className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift h-9 px-3 shrink-0"
									>
										{isSaving ? (
											<RefreshCw className="size-3.5 animate-spin" />
										) : (
											<Check className="size-3.5" />
										)}
									</Button>
								</form>
							</div>
						);
					})}
				</div>
			</div>

			{/* Section 4: Database Vacuum & Housekeeping */}
			<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal space-y-4">
				<div className="border-b-[length:var(--border-width)] border-black/15 pb-3">
					<h2 className="font-black font-title text-xl text-foreground flex items-center gap-2">
						<Database className="size-5 text-secondary-foreground" />
						Database Maintenance & Housekeeping
					</h2>
					<p className="font-mono text-xs text-muted-foreground mt-0.5">
						Prune expired verification OTP codes and rate limit buckets to optimize PostgreSQL index efficiency
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-black bg-muted/20">
					<div className="space-y-1">
						<div className="font-mono text-xs font-black uppercase text-foreground">
							Execute Housekeeping Sweep
						</div>
						<div className="font-mono text-xs text-muted-foreground">
							Runs scheduled cleanup query to delete expired rows in <span className="font-bold">otp_codes</span> and <span className="font-bold">rate_limits</span>.
						</div>
					</div>

					<Button
						onClick={handleRunCleanup}
						disabled={cleanupLoading}
						className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift h-10 px-4"
					>
						<Trash2 className={cn("size-3.5 mr-2", cleanupLoading && "animate-spin")} />
						{cleanupLoading ? "Cleaning..." : "Run Database Sweep"}
					</Button>
				</div>

				{cleanupResult ? (
					<div className="p-3 border border-success/40 rounded-lg bg-success/15 font-mono text-xs font-bold text-success">
						✓ Sweep complete: {cleanupResult.deletedOtps} expired OTPs purged, {cleanupResult.deletedRateLimits} rate limits purged.
					</div>
				) : null}
			</div>
		</div>
	);
}
