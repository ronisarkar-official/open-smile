"use client";

import * as React from "react";

export interface SystemSettingsState {
	maintenance_mode: boolean;
	signup_enabled: boolean;
	beta_waitlist_mode: boolean;
	marketplace_enabled: boolean;
	explore_feed_enabled: boolean;
	explore_posting_enabled: boolean;
	leaderboard_enabled: boolean;
	scratch_cards_enabled: boolean;
	email_otp_required: boolean;
	liveness_detection_enabled: boolean;
	image_hash_check_enabled: boolean;
	auto_flag_anomalies_enabled: boolean;
	max_daily_captures_per_user: number;
	min_smile_score_threshold: number;
	coin_multiplier: number;
	referral_reward_coins: number;
	referee_bonus_coins: number;
	daily_streak_coins: number;
	scratch_min_coins: number;
	scratch_max_coins: number;
	[key: string]: any;
}

const DEFAULT_SETTINGS: SystemSettingsState = {
	maintenance_mode: false,
	signup_enabled: true,
	beta_waitlist_mode: false,
	marketplace_enabled: true,
	explore_feed_enabled: true,
	explore_posting_enabled: true,
	leaderboard_enabled: true,
	scratch_cards_enabled: true,
	email_otp_required: true,
	liveness_detection_enabled: true,
	image_hash_check_enabled: true,
	auto_flag_anomalies_enabled: true,
	max_daily_captures_per_user: 10,
	min_smile_score_threshold: 11,
	coin_multiplier: 1.0,
	referral_reward_coins: 50,
	referee_bonus_coins: 25,
	daily_streak_coins: 5,
	scratch_min_coins: 5,
	scratch_max_coins: 100,
};

interface SystemSettingsContextValue {
	settings: SystemSettingsState;
	loading: boolean;
	refetchSettings: () => Promise<void>;
}

const SystemSettingsContext = React.createContext<SystemSettingsContextValue>({
	settings: DEFAULT_SETTINGS,
	loading: false,
	refetchSettings: async () => {},
});

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = React.useState<SystemSettingsState>(DEFAULT_SETTINGS);
	const [loading, setLoading] = React.useState(true);

	const fetchSettings = React.useCallback(async () => {
		try {
			const res = await fetch("/api/settings/public", { cache: "no-store" });
			const json = await res.json();
			if (json?.settings) {
				setSettings((prev) => ({
					...prev,
					...json.settings,
				}));
			}
		} catch {
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchSettings();
		const handleSettingsUpdate = () => {
			fetchSettings();
		};
		window.addEventListener("system-settings-changed", handleSettingsUpdate);
		return () => {
			window.removeEventListener("system-settings-changed", handleSettingsUpdate);
		};
	}, [fetchSettings]);

	const value = React.useMemo(
		() => ({
			settings,
			loading,
			refetchSettings: fetchSettings,
		}),
		[settings, loading, fetchSettings]
	);

	return (
		<SystemSettingsContext.Provider value={value}>
			{children}
		</SystemSettingsContext.Provider>
	);
}

export function useSystemSettings() {
	return React.useContext(SystemSettingsContext);
}
