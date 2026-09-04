'use client';

import * as React from 'react';
import { SettingsRow, Toggle } from '@/components/settings/settings-shared';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function NotificationsContent() {
	const [securityEmails, setSecurityEmails] = React.useState(true);
	const [streakReminders, setStreakReminders] = React.useState(true);
	const [leaderboardAlerts, setLeaderboardAlerts] = React.useState(true);
	const [rewardAlerts, setRewardAlerts] = React.useState(true);
	const [inAppStreaks, setInAppStreaks] = React.useState(true);
	const [inAppRewards, setInAppRewards] = React.useState(true);
	const [inAppLeaderboard, setInAppLeaderboard] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(true);
	const { toast } = useToast();

	React.useEffect(() => {
		async function loadPreferences() {
			try {
				const res = await fetch('/api/user/notification-preferences');
				if (res.ok) {
					const data = await res.json();
					if (data.preferences) {
						setSecurityEmails(Boolean(data.preferences.security_emails));
						setStreakReminders(Boolean(data.preferences.streak_reminders));
						setLeaderboardAlerts(Boolean(data.preferences.leaderboard_alerts));
						setRewardAlerts(Boolean(data.preferences.reward_alerts));
						setInAppStreaks(Boolean(data.preferences.in_app_streaks));
						setInAppRewards(Boolean(data.preferences.in_app_rewards));
						setInAppLeaderboard(Boolean(data.preferences.in_app_leaderboard));
					}
				}
			} catch {
			} finally {
				setIsLoading(false);
			}
		}
		loadPreferences();
	}, []);

	const updatePreference = async (key: string, value: boolean) => {
		try {
			const res = await fetch('/api/user/notification-preferences', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ [key]: value }),
			});
			if (res.ok) {
				toast({
					title: 'Preference saved',
					description: 'Your notification preferences have been updated.',
				});
			} else {
				throw new Error('Failed to update');
			}
		} catch {
			toast({
				title: 'Update failed',
				description: 'Could not save notification setting.',
				variant: 'error',
			});
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center p-8 space-y-3">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
				<span className="font-mono text-xs text-muted-foreground uppercase font-bold">
					Loading notification preferences...
				</span>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-4">
			<div>
				<h2 className="text-2xl font-black font-title text-foreground">Notifications</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Configure which emails and activity notifications you receive
				</p>
			</div>

			<div>
				<h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground mb-3">
					Email Notifications
				</h3>
				<div className="border-t border-border" />

				<SettingsRow
					label="Security Alerts"
					description="Receive immediate email alerts when a new device or browser logs into your account."
					action={
						<Toggle
							checked={securityEmails}
							onChange={(checked) => {
								setSecurityEmails(checked);
								updatePreference('security_emails', checked);
							}}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Daily Smile Streak Reminders"
					description="Get notified via email if your daily smile streak is about to expire."
					action={
						<Toggle
							checked={streakReminders}
							onChange={(checked) => {
								setStreakReminders(checked);
								updatePreference('streak_reminders', checked);
							}}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Leaderboard & Rank Updates"
					description="Email notifications when daily/weekly podium prizes settle."
					action={
						<Toggle
							checked={leaderboardAlerts}
							onChange={(checked) => {
								setLeaderboardAlerts(checked);
								updatePreference('leaderboard_alerts', checked);
							}}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Rewards & Voucher Drops"
					description="Get updates when new reward vouchers and milestone badges are unlocked."
					action={
						<Toggle
							checked={rewardAlerts}
							onChange={(checked) => {
								setRewardAlerts(checked);
								updatePreference('reward_alerts', checked);
							}}
						/>
					}
				/>
			</div>

			<div className="pt-4">
				<h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground mb-3">
					In-App Activity Notifications
				</h3>
				<div className="border-t border-border" />

				<SettingsRow
					label="Streak Milestones & Multipliers"
					description="Show in-app celebrations when you achieve streak multiplier milestones."
					action={
						<Toggle
							checked={inAppStreaks}
							onChange={(checked) => {
								setInAppStreaks(checked);
								updatePreference('in_app_streaks', checked);
							}}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Reward & Scratch Card Drops"
					description="Receive in-app alerts whenever coins or mystery scratch cards are added."
					action={
						<Toggle
							checked={inAppRewards}
							onChange={(checked) => {
								setInAppRewards(checked);
								updatePreference('in_app_rewards', checked);
							}}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Leaderboard Movements"
					description="In-app alerts when you enter top 10 on the global leaderboard."
					action={
						<Toggle
							checked={inAppLeaderboard}
							onChange={(checked) => {
								setInAppLeaderboard(checked);
								updatePreference('in_app_leaderboard', checked);
							}}
						/>
					}
				/>
			</div>
		</div>
	);
}
