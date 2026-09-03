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
	Users,
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
	Search,
	Layers,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
		key: "max_daily_captures_per_user",
		label: "Daily Capture Cap",
		description: "Maximum rewarded smile captures allowed per smiler per calendar day.",
		defaultValue: 10,
		min: 1,
		max: 50,
		step: 1,
		unit: "captures/day",
		icon: Zap,
	},
	{
		key: "min_smile_score_threshold",
		label: "Min Score Threshold",
		description: "Minimum genuine smile percentage score required to award coins.",
		defaultValue: 11,
		min: 10,
		max: 95,
		step: 1,
		unit: "% score",
		icon: Flame,
	},
];

const ECONOMY_NUMBERS: SettingNumberConfig[] = [
	{
		key: "coin_multiplier",
		label: "Coin Reward Multiplier",
		description: "Global boost applied to all earned capture coins (e.g. 1.5 for weekend event).",
		defaultValue: 1.0,
		min: 0.1,
		max: 10.0,
		step: 0.1,
		unit: "x multiplier",
		icon: Coins,
	},
	{
		key: "daily_streak_coins",
		label: "Daily Streak Bonus",
		description: "Bonus coins awarded per consecutive daily active smile streak milestone.",
		defaultValue: 5,
		min: 0,
		max: 100,
		step: 1,
		unit: "coins/streak",
		icon: Flame,
	},
	{
		key: "max_daily_referral_rewards",
		label: "Max Daily Referral Rewards",
		description: "Anti-farming cap on how many referral scratch cards a single referrer can unlock per day.",
		defaultValue: 5,
		min: 1,
		max: 50,
		step: 1,
		unit: "cards/day",
		icon: Users,
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
	{
		key: "referral_referrer_min_coins",
		label: "Referrer Card Min Coins",
		description: "Guaranteed minimum coins inside the referrer's Mystery Scratch Card.",
		defaultValue: 50,
		min: 5,
		max: 1000,
		step: 5,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "referral_referrer_max_coins",
		label: "Referrer Card Max Coins",
		description: "Maximum coins inside the Mystery Scratch Card awarded to the referrer.",
		defaultValue: 200,
		min: 10,
		max: 2000,
		step: 10,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "referral_referee_min_coins",
		label: "Friend Welcome Min Coins",
		description: "Guaranteed minimum coins inside the newly referred friend's Welcome Scratch Card.",
		defaultValue: 20,
		min: 5,
		max: 200,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "referral_referee_max_coins",
		label: "Friend Welcome Max Coins",
		description: "Maximum coins inside the Welcome Scratch Card awarded to the newly referred friend.",
		defaultValue: 50,
		min: 10,
		max: 500,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
];

const LEADERBOARD_PODIUM_NUMBERS: SettingNumberConfig[] = [
	{
		key: "daily_podium_1_min_coins",
		label: "Daily #1 Min Coins",
		description: "Min coins in 1st place Daily Champion scratch card.",
		defaultValue: 70,
		min: 1,
		max: 500,
		step: 1,
		unit: "coins",
		icon: Trophy,
	},
	{
		key: "daily_podium_1_max_coins",
		label: "Daily #1 Max Coins",
		description: "Max coins in 1st place Daily Champion scratch card.",
		defaultValue: 99,
		min: 1,
		max: 500,
		step: 1,
		unit: "coins",
		icon: Trophy,
	},
	{
		key: "daily_podium_2_min_coins",
		label: "Daily #2 Min Coins",
		description: "Min coins in 2nd place Daily Runner-Up scratch card.",
		defaultValue: 40,
		min: 1,
		max: 500,
		step: 1,
		unit: "coins",
		icon: Trophy,
	},
	{
		key: "daily_podium_2_max_coins",
		label: "Daily #2 Max Coins",
		description: "Max coins in 2nd place Daily Runner-Up scratch card.",
		defaultValue: 69,
		min: 1,
		max: 500,
		step: 1,
		unit: "coins",
		icon: Trophy,
	},
	{
		key: "daily_podium_3_min_coins",
		label: "Daily #3 Min Coins",
		description: "Min coins in 3rd place Daily scratch card.",
		defaultValue: 15,
		min: 1,
		max: 500,
		step: 1,
		unit: "coins",
		icon: Trophy,
	},
	{
		key: "daily_podium_3_max_coins",
		label: "Daily #3 Max Coins",
		description: "Max coins in 3rd place Daily scratch card.",
		defaultValue: 39,
		min: 1,
		max: 500,
		step: 1,
		unit: "coins",
		icon: Trophy,
	},
	{
		key: "weekly_podium_1_min_coins",
		label: "Weekly #1 Min Coins",
		description: "Min coins for 1st place Weekly Mega scratch card.",
		defaultValue: 250,
		min: 20,
		max: 2000,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "weekly_podium_1_max_coins",
		label: "Weekly #1 Max Coins",
		description: "Max coins for 1st place Weekly Mega scratch card.",
		defaultValue: 400,
		min: 20,
		max: 2000,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "weekly_podium_2_min_coins",
		label: "Weekly #2 Min Coins",
		description: "Min coins for 2nd place Weekly scratch card.",
		defaultValue: 120,
		min: 10,
		max: 1000,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "weekly_podium_2_max_coins",
		label: "Weekly #2 Max Coins",
		description: "Max coins for 2nd place Weekly scratch card.",
		defaultValue: 200,
		min: 10,
		max: 1000,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "weekly_podium_3_min_coins",
		label: "Weekly #3 Min Coins",
		description: "Min coins for 3rd place Weekly scratch card.",
		defaultValue: 60,
		min: 5,
		max: 500,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "weekly_podium_3_max_coins",
		label: "Weekly #3 Max Coins",
		description: "Max coins for 3rd place Weekly scratch card.",
		defaultValue: 100,
		min: 5,
		max: 500,
		step: 5,
		unit: "coins",
		icon: Sparkles,
	},
	{
		key: "monthly_podium_1_min_coins",
		label: "Monthly #1 Min Coins",
		description: "Min coins for 1st place Monthly Legend scratch card.",
		defaultValue: 800,
		min: 50,
		max: 5000,
		step: 10,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "monthly_podium_1_max_coins",
		label: "Monthly #1 Max Coins",
		description: "Max coins for 1st place Monthly Legend scratch card.",
		defaultValue: 1200,
		min: 50,
		max: 5000,
		step: 10,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "monthly_podium_2_min_coins",
		label: "Monthly #2 Min Coins",
		description: "Min coins for 2nd place Monthly Grand Master scratch card.",
		defaultValue: 400,
		min: 25,
		max: 3000,
		step: 10,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "monthly_podium_2_max_coins",
		label: "Monthly #2 Max Coins",
		description: "Max coins for 2nd place Monthly Grand Master scratch card.",
		defaultValue: 600,
		min: 25,
		max: 3000,
		step: 10,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "monthly_podium_3_min_coins",
		label: "Monthly #3 Min Coins",
		description: "Min coins for 3rd place Monthly Master scratch card.",
		defaultValue: 200,
		min: 10,
		max: 2000,
		step: 10,
		unit: "coins",
		icon: Gift,
	},
	{
		key: "monthly_podium_3_max_coins",
		label: "Monthly #3 Max Coins",
		description: "Max coins for 3rd place Monthly Master scratch card.",
		defaultValue: 350,
		min: 10,
		max: 2000,
		step: 10,
		unit: "coins",
		icon: Gift,
	},
];

const PODIUM_TIERS = [
	{
		id: "daily",
		title: "Daily Podium Drops",
		subtitle: "Mystery cards awarded every midnight (IST)",
		badge: "Daily",
		icon: Trophy,
		color: "text-amber-500",
		ranks: [
			{
				rankLabel: "1st Champion",
				badge: "🥇 1st",
				minItem: LEADERBOARD_PODIUM_NUMBERS[0],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[1],
			},
			{
				rankLabel: "2nd Runner-Up",
				badge: "🥈 2nd",
				minItem: LEADERBOARD_PODIUM_NUMBERS[2],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[3],
			},
			{
				rankLabel: "3rd Place",
				badge: "🥉 3rd",
				minItem: LEADERBOARD_PODIUM_NUMBERS[4],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[5],
			},
		],
	},
	{
		id: "weekly",
		title: "Weekly Mega Drops",
		subtitle: "Awarded every Monday morning (IST)",
		badge: "Weekly",
		icon: Sparkles,
		color: "text-primary",
		ranks: [
			{
				rankLabel: "1st Champion",
				badge: "🥇 1st",
				minItem: LEADERBOARD_PODIUM_NUMBERS[6],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[7],
			},
			{
				rankLabel: "2nd Runner-Up",
				badge: "🥈 2nd",
				minItem: LEADERBOARD_PODIUM_NUMBERS[8],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[9],
			},
			{
				rankLabel: "3rd Place",
				badge: "🥉 3rd",
				minItem: LEADERBOARD_PODIUM_NUMBERS[10],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[11],
			},
		],
	},
	{
		id: "monthly",
		title: "Monthly Grand Drops",
		subtitle: "High-roller drops awarded on 1st of each month",
		badge: "Monthly",
		icon: Gift,
		color: "text-purple-500",
		ranks: [
			{
				rankLabel: "1st Legend",
				badge: "🥇 1st",
				minItem: LEADERBOARD_PODIUM_NUMBERS[12],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[13],
			},
			{
				rankLabel: "2nd Grand Master",
				badge: "🥈 2nd",
				minItem: LEADERBOARD_PODIUM_NUMBERS[14],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[15],
			},
			{
				rankLabel: "3rd Master",
				badge: "🥉 3rd",
				minItem: LEADERBOARD_PODIUM_NUMBERS[16],
				maxItem: LEADERBOARD_PODIUM_NUMBERS[17],
			},
		],
	},
];

type SettingsTab = "all" | "modules" | "economics" | "podiums" | "danger";

export default function AdminSettingsPage() {
	const { toast } = useToast();
	const [settings, setSettings] = React.useState<Record<string, any>>({});
	const [formValues, setFormValues] = React.useState<Record<string, string>>({});
	const [loading, setLoading] = React.useState(true);
	const [savingKeys, setSavingKeys] = React.useState<Record<string, boolean>>({});

	const [activeTab, setActiveTab] = React.useState<SettingsTab>("all");
	const [searchQuery, setSearchQuery] = React.useState("");

	const [cleanupLoading, setCleanupLoading] = React.useState(false);
	const [cleanupResult, setCleanupResult] = React.useState<any | null>(null);

	const [resetLoadingScope, setResetLoadingScope] = React.useState<string | null>(null);
	const [purgeCapturesChecked, setPurgeCapturesChecked] = React.useState(false);
	const [resetResult, setResetResult] = React.useState<{ scope: string; message: string; recordsModified?: number } | null>(null);

	async function fetchSettings(isManual = false) {
		setLoading(true);
		try {
			const res = await fetch("/api/admin/settings");
			const json = await res.json();
			if (res.ok) {
				const fetched = json.settings || {};
				setSettings(fetched);

				const initialNumbers: Record<string, string> = {};
				for (const item of [
					...ANTI_CHEAT_NUMBERS,
					...ECONOMY_NUMBERS,
					...LEADERBOARD_PODIUM_NUMBERS,
				]) {
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

	async function handlePlatformReset(scope: "coins" | "streaks" | "leaderboard" | "all", purgeCaptures = false) {
		setResetLoadingScope(scope);
		try {
			const res = await fetch("/api/admin/reset", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ scope, purgeCaptures }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Platform reset failed");

			setResetResult({ scope, message: json.message, recordsModified: json.recordsModified });
			toast({
				title: "Platform Reset Completed",
				description: json.message,
				variant: "success",
			});

			fetchSettings(true);
		} catch (err: any) {
			toast({
				title: "Reset Failed",
				description: err.message || "Failed to execute platform reset",
				variant: "error",
			});
		} finally {
			setResetLoadingScope(null);
		}
	}

	function getToggleValue(key: string, fallback: boolean) {
		if (settings[key]?.value !== undefined) {
			return Boolean(settings[key]?.value);
		}
		return fallback;
	}

	const normalizedSearch = searchQuery.trim().toLowerCase();

	const filteredFeatureSwitches = FEATURE_SWITCHES.filter(
		(s) =>
			!normalizedSearch ||
			s.label.toLowerCase().includes(normalizedSearch) ||
			s.description.toLowerCase().includes(normalizedSearch) ||
			s.key.toLowerCase().includes(normalizedSearch)
	);

	const filteredAntiCheatSwitches = ANTI_CHEAT_SWITCHES.filter(
		(s) =>
			!normalizedSearch ||
			s.label.toLowerCase().includes(normalizedSearch) ||
			s.description.toLowerCase().includes(normalizedSearch) ||
			s.key.toLowerCase().includes(normalizedSearch)
	);

	const filteredAntiCheatNumbers = ANTI_CHEAT_NUMBERS.filter(
		(n) =>
			!normalizedSearch ||
			n.label.toLowerCase().includes(normalizedSearch) ||
			n.description.toLowerCase().includes(normalizedSearch) ||
			n.key.toLowerCase().includes(normalizedSearch)
	);

	const filteredEconomyNumbers = ECONOMY_NUMBERS.filter(
		(n) =>
			!normalizedSearch ||
			n.label.toLowerCase().includes(normalizedSearch) ||
			n.description.toLowerCase().includes(normalizedSearch) ||
			n.key.toLowerCase().includes(normalizedSearch)
	);

	const filteredPodiumTiers = PODIUM_TIERS.filter(
		(p) =>
			!normalizedSearch ||
			p.title.toLowerCase().includes(normalizedSearch) ||
			p.ranks.some(
				(r) =>
					r.rankLabel.toLowerCase().includes(normalizedSearch) ||
					r.minItem.label.toLowerCase().includes(normalizedSearch) ||
					r.maxItem.label.toLowerCase().includes(normalizedSearch)
			)
	);

	const activeModulesCount = [...FEATURE_SWITCHES, ...ANTI_CHEAT_SWITCHES].filter((s) =>
		getToggleValue(s.key, s.defaultValue)
	).length;
	const totalModulesCount = FEATURE_SWITCHES.length + ANTI_CHEAT_SWITCHES.length;

	const showModules =
		activeTab === "all" || activeTab === "modules" || (normalizedSearch.length > 0 && (filteredFeatureSwitches.length > 0 || filteredAntiCheatSwitches.length > 0));
	const showEconomics =
		activeTab === "all" || activeTab === "economics" || (normalizedSearch.length > 0 && (filteredAntiCheatNumbers.length > 0 || filteredEconomyNumbers.length > 0));
	const showPodiums =
		activeTab === "all" || activeTab === "podiums" || (normalizedSearch.length > 0 && filteredPodiumTiers.length > 0);
	const showDanger =
		activeTab === "all" || activeTab === "danger" || (normalizedSearch.length > 0 && ("reset".includes(normalizedSearch) || "cleanup".includes(normalizedSearch) || "sweep".includes(normalizedSearch)));

	return (
		<div className="space-y-6 pb-20">
			{/* Top Control Bar: Compact & Professional */}
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b-[length:var(--border-width)] border-black/15 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<SlidersHorizontal className="size-5 text-primary" />
						<h1 className="text-2xl sm:text-3xl font-black font-title tracking-tight text-foreground">
							System Settings
						</h1>
					</div>
					<p className="font-mono text-xs text-muted-foreground mt-0.5">
						Live toggles for platform modules, anti-cheat limits, reward economics, and data maintenance
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-black bg-card font-mono text-[11px] font-bold shadow-brutal-xs">
						<span className="size-2 rounded-full bg-success animate-pulse" />
						<span className="tabular-nums">{activeModulesCount}/{totalModulesCount}</span> Modules Online
					</div>

					<Button
						onClick={() => fetchSettings(true)}
						disabled={loading}
						variant="outline"
						size="sm"
						className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform h-9 px-3"
					>
						<RefreshCw className={cn("size-3.5 mr-1.5", loading && "animate-spin")} />
						Refresh
					</Button>
				</div>
			</div>

			{/* Filter & Segment Navigation */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
				{/* Search Box */}
				<div className="relative flex-1 max-w-md">
					<Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search settings (e.g. referral, streak, liveness)..."
						className="pl-8 h-9 border-[length:var(--border-width)] border-black font-mono text-xs shadow-brutal-xs bg-card rounded-lg"
					/>
				</div>

				{/* Tabs Navigation */}
				<div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
					{(
						[
							{ id: "all", label: "All", icon: Layers },
							{ id: "modules", label: "Modules", icon: Shield },
							{ id: "economics", label: "Economics", icon: Coins },
							{ id: "podiums", label: "Podiums", icon: Trophy },
							{ id: "danger", label: "Danger Zone", icon: AlertTriangle },
						] as const
					).map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => {
									setActiveTab(tab.id);
									setSearchQuery("");
								}}
								className={cn(
									"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all whitespace-nowrap active:scale-[0.96]",
									isActive
										? "bg-primary text-primary-foreground border-[length:var(--border-width)] border-black shadow-brutal-xs font-black"
										: "bg-card hover:bg-muted text-foreground border border-black/20"
								)}
							>
								<Icon className="size-3.5 shrink-0" />
								<span>{tab.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Section 1: Platform & Anti-Cheat Switches */}
			{showModules && (filteredFeatureSwitches.length > 0 || filteredAntiCheatSwitches.length > 0) ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-5 shadow-brutal space-y-4">
					<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-2.5">
						<div className="flex items-center gap-2">
							<Shield className="size-4 text-primary" />
							<h2 className="font-black font-title text-base sm:text-lg text-foreground">
								Platform Modules & Anti-Cheat Controls
							</h2>
						</div>
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Instant Live Toggles
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
						{[...filteredFeatureSwitches, ...filteredAntiCheatSwitches].map((item) => {
							const Icon = item.icon;
							const isEnabled = getToggleValue(item.key, item.defaultValue);
							const isPending = Boolean(savingKeys[item.key]);

							return (
								<div
									key={item.key}
									className={cn(
										"p-3 rounded-lg border border-black transition-all flex flex-col justify-between gap-2.5",
										isEnabled ? "bg-muted/25" : "bg-muted/5 opacity-80",
										item.danger && isEnabled && "border-destructive/60 bg-destructive/5"
									)}
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2 min-w-0">
											<div className={cn(
												"size-7 rounded-md border border-black flex items-center justify-center shrink-0 shadow-brutal-xs",
												item.danger ? "bg-destructive/15 text-destructive" : "bg-card text-foreground"
											)}>
												<Icon className="size-3.5" />
											</div>
											<div className="min-w-0">
												<div className="font-mono text-xs font-black text-foreground truncate">
													{item.label}
												</div>
												<div className="flex items-center gap-1 font-mono text-[10px]">
													{isEnabled ? (
														<span className="inline-flex items-center text-success font-bold">
															<CheckCircle2 className="size-2.5 mr-0.5" /> ACTIVE
														</span>
													) : (
														<span className="inline-flex items-center text-muted-foreground font-bold">
															<XCircle className="size-2.5 mr-0.5" /> DISABLED
														</span>
													)}
												</div>
											</div>
										</div>

										<div className="shrink-0 pt-0.5">
											<Switch
												checked={isEnabled}
												disabled={isPending || loading}
												onCheckedChange={(checked) =>
													handleToggleSwitch(item.key, checked, item.label, item.description)
												}
												aria-label={item.label}
												className="data-[state=checked]:bg-primary"
											/>
										</div>
									</div>

									<p className="font-mono text-[11px] text-muted-foreground leading-snug line-clamp-2">
										{item.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{/* Section 2: Economics, Caps & Anti-Cheat Thresholds */}
			{showEconomics && (filteredAntiCheatNumbers.length > 0 || filteredEconomyNumbers.length > 0) ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-5 shadow-brutal space-y-4">
					<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-2.5">
						<div className="flex items-center gap-2">
							<Coins className="size-4 text-warning" />
							<h2 className="font-black font-title text-base sm:text-lg text-foreground">
								Reward Economics, Caps & Thresholds
							</h2>
						</div>
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Numeric Parameters
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
						{[...filteredAntiCheatNumbers, ...filteredEconomyNumbers].map((item) => {
							const Icon = item.icon;
							const isSaving = Boolean(savingKeys[item.key]);
							const val = formValues[item.key] ?? String(item.defaultValue);

							return (
								<div
									key={item.key}
									className="p-3 rounded-lg border border-black bg-muted/20 flex flex-col justify-between gap-2.5"
								>
									<div>
										<div className="flex items-center justify-between gap-1 mb-1">
											<label className="font-mono text-xs font-black uppercase text-foreground flex items-center gap-1.5 truncate">
												<Icon className="size-3.5 shrink-0 text-muted-foreground" />
												<span className="truncate">{item.label}</span>
											</label>
											{item.unit ? (
												<span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded bg-card border border-black/15 text-muted-foreground uppercase shrink-0">
													{item.unit}
												</span>
											) : null}
										</div>

										<p className="font-mono text-[10px] text-muted-foreground leading-snug line-clamp-2">
											{item.description}
										</p>
									</div>

									<form
										onSubmit={(e) => {
											e.preventDefault();
											handleSaveNumber(item.key, item.label, item.description, item.defaultValue);
										}}
										className="flex items-center gap-1.5 pt-1"
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
											className="border-[length:var(--border-width)] border-black font-mono text-xs tabular-nums shadow-brutal-xs h-8 bg-card rounded-md"
										/>
										<Button
											type="submit"
											disabled={isSaving || loading}
											size="sm"
											className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform h-8 px-2.5 shrink-0"
										>
											{isSaving ? (
												<RefreshCw className="size-3 animate-spin" />
											) : (
												<Check className="size-3" />
											)}
										</Button>
									</form>
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{/* Section 3: Leaderboard Podium Rewards (Organized by Frequency) */}
			{showPodiums && filteredPodiumTiers.length > 0 ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-5 shadow-brutal space-y-4">
					<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-2.5">
						<div className="flex items-center gap-2">
							<Trophy className="size-4 text-primary" />
							<h2 className="font-black font-title text-base sm:text-lg text-foreground">
								Leaderboard Podium Mystery Rewards
							</h2>
						</div>
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Scratch Card Mystery Ranges
						</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						{filteredPodiumTiers.map((tier) => {
							const Icon = tier.icon;
							return (
								<div
									key={tier.id}
									className="border border-black rounded-xl bg-muted/15 p-4 flex flex-col justify-between space-y-3"
								>
									<div className="border-b border-black/15 pb-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Icon className={cn("size-4", tier.color)} />
												<h3 className="font-mono text-xs font-black uppercase text-foreground">
													{tier.title}
												</h3>
											</div>
											<span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-card border border-black/20 text-muted-foreground">
												{tier.badge}
											</span>
										</div>
										<p className="font-mono text-[10px] text-muted-foreground mt-0.5">
											{tier.subtitle}
										</p>
									</div>

									<div className="space-y-2.5">
										{tier.ranks.map((rank) => {
											const minVal = formValues[rank.minItem.key] ?? String(rank.minItem.defaultValue);
											const maxVal = formValues[rank.maxItem.key] ?? String(rank.maxItem.defaultValue);
											const isMinSaving = Boolean(savingKeys[rank.minItem.key]);
											const isMaxSaving = Boolean(savingKeys[rank.maxItem.key]);

											return (
												<div
													key={rank.rankLabel}
													className="p-2.5 rounded-lg border border-black/20 bg-card space-y-1.5"
												>
													<div className="flex items-center justify-between font-mono text-[11px]">
														<span className="font-black text-foreground">
															{rank.badge}
														</span>
														<span className="font-bold text-muted-foreground text-[10px] uppercase">
															Coins Range (Min – Max)
														</span>
													</div>

													<div className="grid grid-cols-2 gap-2">
														{/* Min Input */}
														<form
															onSubmit={(e) => {
																e.preventDefault();
																handleSaveNumber(
																	rank.minItem.key,
																	rank.minItem.label,
																	rank.minItem.description,
																	rank.minItem.defaultValue
																);
															}}
															className="flex items-center gap-1"
														>
															<Input
																type="number"
																min={rank.minItem.min}
																max={rank.minItem.max}
																step={rank.minItem.step}
																value={minVal}
																onChange={(e) => {
																	const nextVal = e.target.value;
																	setFormValues((prev) => ({
																		...prev,
																		[rank.minItem.key]: nextVal,
																	}));
																}}
																className="border border-black font-mono text-[11px] tabular-nums h-7 px-2 bg-card rounded"
																placeholder="Min"
															/>
															<Button
																type="submit"
																disabled={isMinSaving || loading}
																size="sm"
																className="border border-black bg-card hover:bg-muted text-foreground font-mono text-[10px] font-bold h-7 px-1.5 shrink-0"
																title="Save Min"
															>
																{isMinSaving ? (
																	<RefreshCw className="size-2.5 animate-spin" />
																) : (
																	<Check className="size-2.5" />
																)}
															</Button>
														</form>

														{/* Max Input */}
														<form
															onSubmit={(e) => {
																e.preventDefault();
																handleSaveNumber(
																	rank.maxItem.key,
																	rank.maxItem.label,
																	rank.maxItem.description,
																	rank.maxItem.defaultValue
																);
															}}
															className="flex items-center gap-1"
														>
															<Input
																type="number"
																min={rank.maxItem.min}
																max={rank.maxItem.max}
																step={rank.maxItem.step}
																value={maxVal}
																onChange={(e) => {
																	const nextVal = e.target.value;
																	setFormValues((prev) => ({
																		...prev,
																		[rank.maxItem.key]: nextVal,
																	}));
																}}
																className="border border-black font-mono text-[11px] tabular-nums h-7 px-2 bg-card rounded"
																placeholder="Max"
															/>
															<Button
																type="submit"
																disabled={isMaxSaving || loading}
																size="sm"
																className="border border-black bg-card hover:bg-muted text-foreground font-mono text-[10px] font-bold h-7 px-1.5 shrink-0"
																title="Save Max"
															>
																{isMaxSaving ? (
																	<RefreshCw className="size-2.5 animate-spin" />
																) : (
																	<Check className="size-2.5" />
																)}
															</Button>
														</form>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{/* Section 4: Maintenance & Housekeeping Sweep */}
			{showDanger ? (
				<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-5 shadow-brutal space-y-4">
					<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/15 pb-2.5">
						<div className="flex items-center gap-2">
							<Database className="size-4 text-foreground" />
							<h2 className="font-black font-title text-base sm:text-lg text-foreground">
								Database Maintenance & Housekeeping
							</h2>
						</div>
						<span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
							Routine Hygiene
						</span>
					</div>

					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-black bg-muted/20">
						<div className="space-y-0.5">
							<div className="font-mono text-xs font-black uppercase text-foreground">
								Purge Expired Database Rows
							</div>
							<div className="font-mono text-[11px] text-muted-foreground">
								Deletes expired records in <span className="font-bold">otp_codes</span> and <span className="font-bold">rate_limits</span> to optimize index performance.
							</div>
						</div>

						<Button
							onClick={handleRunCleanup}
							disabled={cleanupLoading}
							size="sm"
							className="border-[length:var(--border-width)] border-black bg-card hover:bg-muted text-foreground font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform h-9 px-3.5 shrink-0"
						>
							<Trash2 className={cn("size-3.5 mr-1.5", cleanupLoading && "animate-spin")} />
							{cleanupLoading ? "Cleaning..." : "Run Sweep"}
						</Button>
					</div>

					{cleanupResult ? (
						<div className="p-2.5 border border-success/40 rounded-lg bg-success/15 font-mono text-xs font-bold text-success">
							✓ Sweep complete: {cleanupResult.deletedOtps} expired OTPs purged, {cleanupResult.deletedRateLimits} rate limits purged.
						</div>
					) : null}
				</div>
			) : null}

			{/* Section 5: Danger Zone: Platform & Economy Resets */}
			{showDanger ? (
				<div id="danger-zone" className="border-[length:var(--border-width)] border-destructive rounded-xl bg-destructive/5 p-4 sm:p-5 shadow-brutal space-y-4">
					<div className="border-b-[length:var(--border-width)] border-destructive/20 pb-2.5 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AlertTriangle className="size-5 text-destructive" />
							<h2 className="font-black font-title text-base sm:text-lg text-destructive uppercase tracking-wide">
								Danger Zone: Platform Resets
							</h2>
						</div>
						<span className="font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded bg-destructive text-destructive-foreground">
							Admin Only
						</span>
					</div>

					<p className="font-mono text-xs text-muted-foreground">
						Irreversible wipe operations for all smilers. Each action is verified via confirmation dialog and permanently recorded in the administrative audit logs.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
						{/* 1. Reset Coins */}
						<div className="border border-black rounded-lg bg-card p-3 shadow-brutal-xs flex flex-col justify-between space-y-3">
							<div className="space-y-1">
								<div className="flex items-center gap-1.5">
									<Coins className="size-3.5 text-warning" />
									<h3 className="font-mono text-xs font-black uppercase text-foreground">
										Reset Coins
									</h3>
								</div>
								<p className="font-mono text-[10px] text-muted-foreground leading-snug">
									Zeroes out coin balances for every user via ledger reversals. Purges unscratched cards.
								</p>
							</div>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										disabled={resetLoadingScope !== null}
										size="sm"
										className="border border-black font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform h-8 w-full"
									>
										{resetLoadingScope === "coins" ? (
											<RefreshCw className="size-3 mr-1.5 animate-spin" />
										) : (
											<Coins className="size-3 mr-1.5" />
										)}
										Reset Coins
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="border-[length:var(--border-width)] border-black bg-card shadow-brutal rounded-xl max-w-md">
									<AlertDialogHeader>
										<AlertDialogTitle className="font-black font-title text-lg text-foreground flex items-center gap-2">
											<AlertTriangle className="size-5 text-destructive" />
											Reset All User Coins?
										</AlertDialogTitle>
										<AlertDialogDescription className="font-mono text-xs text-muted-foreground">
											This will calculate reversing offset ledger rows for every user with a non-zero balance and purge any pending scratch cards. Current balances will become 0.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter className="gap-2 sm:gap-0">
										<AlertDialogCancel className="border border-black font-mono text-xs font-bold uppercase">
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => handlePlatformReset("coins")}
											className="border border-black bg-destructive hover:bg-destructive/90 text-destructive-foreground font-mono text-xs font-black uppercase shadow-brutal-xs"
										>
											Confirm Reset Coins
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>

						{/* 2. Reset Streaks */}
						<div className="border border-black rounded-lg bg-card p-3 shadow-brutal-xs flex flex-col justify-between space-y-3">
							<div className="space-y-1">
								<div className="flex items-center gap-1.5">
									<Flame className="size-3.5 text-primary" />
									<h3 className="font-mono text-xs font-black uppercase text-foreground">
										Reset Streaks
									</h3>
								</div>
								<p className="font-mono text-[10px] text-muted-foreground leading-snug">
									Sets streak counters to 0 and applies a streak cutoff timestamp so all smilers start from Day 0.
								</p>
							</div>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										disabled={resetLoadingScope !== null}
										size="sm"
										className="border border-black font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform h-8 w-full"
									>
										{resetLoadingScope === "streaks" ? (
											<RefreshCw className="size-3 mr-1.5 animate-spin" />
										) : (
											<Flame className="size-3 mr-1.5" />
										)}
										Reset Streaks
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="border-[length:var(--border-width)] border-black bg-card shadow-brutal rounded-xl max-w-md">
									<AlertDialogHeader>
										<AlertDialogTitle className="font-black font-title text-lg text-foreground flex items-center gap-2">
											<AlertTriangle className="size-5 text-destructive" />
											Reset All User Streaks?
										</AlertDialogTitle>
										<AlertDialogDescription className="font-mono text-xs text-muted-foreground">
											This will set all user streak counters to 0, clear streak freeze statuses, and set a streak cutoff timestamp so past captures no longer count toward active streaks.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter className="gap-2 sm:gap-0">
										<AlertDialogCancel className="border border-black font-mono text-xs font-bold uppercase">
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => handlePlatformReset("streaks")}
											className="border border-black bg-destructive hover:bg-destructive/90 text-destructive-foreground font-mono text-xs font-black uppercase shadow-brutal-xs"
										>
											Confirm Reset Streaks
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>

						{/* 3. Reset Leaderboard */}
						<div className="border border-black rounded-lg bg-card p-3 shadow-brutal-xs flex flex-col justify-between space-y-3">
							<div className="space-y-1">
								<div className="flex items-center gap-1.5">
									<Trophy className="size-3.5 text-warning" />
									<h3 className="font-mono text-xs font-black uppercase text-foreground">
										Reset Leaderboard
									</h3>
								</div>
								<p className="font-mono text-[10px] text-muted-foreground leading-snug">
									Purges historical settlement logs and sets a cutoff so Daily, Weekly, and Monthly podiums reset to empty.
								</p>
							</div>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										disabled={resetLoadingScope !== null}
										size="sm"
										className="border border-black font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform h-8 w-full"
									>
										{resetLoadingScope === "leaderboard" ? (
											<RefreshCw className="size-3 mr-1.5 animate-spin" />
										) : (
											<Trophy className="size-3 mr-1.5" />
										)}
										Reset Leaderboard
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="border-[length:var(--border-width)] border-black bg-card shadow-brutal rounded-xl max-w-md">
									<AlertDialogHeader>
										<AlertDialogTitle className="font-black font-title text-lg text-foreground flex items-center gap-2">
											<AlertTriangle className="size-5 text-destructive" />
											Reset Platform Leaderboard?
										</AlertDialogTitle>
										<AlertDialogDescription className="font-mono text-xs text-muted-foreground">
											This will clear historical leaderboard settlements and set a reset cutoff timestamp. Live podiums will reset to empty until new captures are completed.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter className="gap-2 sm:gap-0">
										<AlertDialogCancel className="border border-black font-mono text-xs font-bold uppercase">
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => handlePlatformReset("leaderboard")}
											className="border border-black bg-destructive hover:bg-destructive/90 text-destructive-foreground font-mono text-xs font-black uppercase shadow-brutal-xs"
										>
											Confirm Reset Leaderboard
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>

						{/* 4. Reset Everything */}
						<div className="border border-destructive rounded-lg bg-destructive/10 p-3 shadow-brutal-xs flex flex-col justify-between space-y-3">
							<div className="space-y-1">
								<div className="flex items-center gap-1.5">
									<AlertTriangle className="size-3.5 text-destructive" />
									<h3 className="font-mono text-xs font-black uppercase text-destructive">
										Reset All (Full)
									</h3>
								</div>
								<p className="font-mono text-[10px] text-muted-foreground leading-snug">
									Zeroes coins, streaks, and leaderboards simultaneously with optional capture purge.
								</p>
							</div>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										disabled={resetLoadingScope !== null}
										size="sm"
										className="border border-black bg-destructive hover:bg-destructive/90 text-destructive-foreground font-mono text-xs font-black uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] transition-transform h-8 w-full"
									>
										{resetLoadingScope === "all" ? (
											<RefreshCw className="size-3 mr-1.5 animate-spin" />
										) : (
											<Trash2 className="size-3 mr-1.5" />
										)}
										Reset Everything
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="border-[length:var(--border-width)] border-black bg-card shadow-brutal rounded-xl max-w-md">
									<AlertDialogHeader>
										<AlertDialogTitle className="font-black font-title text-lg text-destructive flex items-center gap-2">
											<AlertTriangle className="size-5 text-destructive" />
											Execute Full Platform Reset?
										</AlertDialogTitle>
										<AlertDialogDescription className="font-mono text-xs text-muted-foreground space-y-2.5">
											<p>
												This will reset <span className="font-bold text-foreground">Coins to 0</span>, <span className="font-bold text-foreground">Streaks to 0</span>, and <span className="font-bold text-foreground">Leaderboards to 0</span> for ALL smilers across Open Smile.
											</p>
											<label className="flex items-center gap-2 p-2 border border-black/20 rounded-lg bg-muted/40 cursor-pointer text-foreground font-mono text-[11px]">
												<input
													type="checkbox"
													checked={purgeCapturesChecked}
													onChange={(e) => setPurgeCapturesChecked(e.target.checked)}
													className="size-4 accent-destructive rounded border-black"
												/>
												<span>Also purge past smile captures, explore posts, and image hashes</span>
											</label>
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter className="gap-2 sm:gap-0">
										<AlertDialogCancel className="border border-black font-mono text-xs font-bold uppercase">
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => handlePlatformReset("all", purgeCapturesChecked)}
											className="border border-black bg-destructive hover:bg-destructive/90 text-destructive-foreground font-mono text-xs font-black uppercase shadow-brutal-xs"
										>
											Yes, Reset Everything
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>

					{resetResult ? (
						<div className="p-2.5 border border-success/40 rounded-lg bg-success/15 font-mono text-xs font-bold text-success">
							✓ {resetResult.message} ({resetResult.recordsModified ?? 0} records updated)
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
}
