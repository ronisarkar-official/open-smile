'use client';

import * as React from 'react';
import { SettingsRow, Toggle } from '@/components/settings/settings-shared';

export function NotificationsContent() {
	const [securityEmails, setSecurityEmails] = React.useState(true);
	const [streakReminders, setStreakReminders] = React.useState(true);
	const [leaderboardAlerts, setLeaderboardAlerts] = React.useState(false);
	const [rewardAlerts, setRewardAlerts] = React.useState(true);

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
							onChange={setSecurityEmails}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Daily Smile Streak Reminders"
					description="Get notified if your daily smile streak is about to expire."
					action={
						<Toggle
							checked={streakReminders}
							onChange={setStreakReminders}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Leaderboard & Rank Updates"
					description="Weekly summary of your leaderboard rank and coin standings."
					action={
						<Toggle
							checked={leaderboardAlerts}
							onChange={setLeaderboardAlerts}
						/>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Rewards & Voucher Drops"
					description="Get updates when new reward vouchers and milestone badges become available."
					action={
						<Toggle
							checked={rewardAlerts}
							onChange={setRewardAlerts}
						/>
					}
				/>
			</div>
		</div>
	);
}
