import { renderEmailLayout } from './styles';

export interface LoginDetails {
	time?: string;
	ip?: string;
	userAgent?: string;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function getOTPEmailHtml(otp: string): string {
	return renderEmailLayout({
		title: 'Verification Code',
		badgeText: 'SECURITY',
		badgeBg: '#FBBF24',
		badgeColor: '#0f0f0f',
		content: `
			<h1 style="font-size: 24px; font-weight: 800; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">Verification Code</h1>
			<p style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 0 0 18px;">Enter the 6-digit verification code below to verify your identity on <strong>Open Smile</strong>:</p>
			
			<div style="background-color: #FBBF24; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 24px 16px; margin: 26px 0; text-align: center;">
				<div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #0f0f0f; margin-bottom: 8px;">ONE-TIME VERIFICATION CODE</div>
				<div style="font-family: 'Space Mono', 'SFMono-Regular', Consolas, Menlo, Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #0f0f0f; margin: 0; padding-left: 10px;">${escapeHtml(otp)}</div>
			</div>

			<div style="background-color: #faf8f5; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 14px 16px; margin: 20px 0;">
				<p style="color: #57534e; font-size: 13px; line-height: 1.5; margin: 0;">⏱️ This verification code is valid for <strong>5 minutes</strong>. For your security, never share this code with anyone.</p>
			</div>

			<p style="color: #57534e; font-size: 13px; line-height: 1.5; margin: 16px 0 0;">If you didn't request this verification code, please ignore this email or contact support if you suspect unauthorized access.</p>
		`,
		footerNote:
			'You are receiving this verification code to secure your Open Smile account.',
	});
}

export function getWelcomeEmailHtml(name: string, appUrl?: string): string {
	const displayName = name ? escapeHtml(name) : 'Smiler';
	const url = (
		appUrl ||
		process.env.BETTER_AUTH_URL ||
		'http://localhost:3000'
	).replace(/\/+$/, '');

	return renderEmailLayout({
		title: 'Welcome to Open Smile',
		badgeText: 'ONBOARDING',
		badgeBg: '#C6F135',
		badgeColor: '#0f0f0f',
		content: `
			<div style="display: inline-block; background-color: #FBBF24; color: #0f0f0f; font-size: 11px; font-weight: 900; padding: 4px 10px; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 1.5px 1.5px 0px 0px #0f0f0f; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
				Level 1 Unlocked 🚀
			</div>
			
			<h1 style="font-size: 24px; font-weight: 900; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">Welcome aboard, ${displayName}! 🎉</h1>
			<p style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 12px 0;">Your <strong>Open Smile</strong> account is officially live. Get ready to turn your daily smiles into real coins, badges, and Amazon gift vouchers!</p>
			
			<div style="background-color: #faf8f5; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 20px; margin: 24px 0;">
				<div style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #0f0f0f; margin-bottom: 12px;">⚡ HOW TO START EARNING:</div>
				<table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; border-bottom: 1px dashed #0f0f0f;">
							📸 <strong>1. Snap a Smile</strong> — Instant client-side AI analyzes genuine smile intensity (0-100).
						</td>
					</tr>
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; border-bottom: 1px dashed #0f0f0f;">
							🪙 <strong>2. Collect Coins</strong> — Higher smile scores earn higher coin drops.
						</td>
					</tr>
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; border-bottom: none;">
							🎁 <strong>3. Redeem Rewards</strong> — Swap your accumulated coins for real vouchers!
						</td>
					</tr>
				</table>
			</div>

			<div style="margin: 28px 0 16px;">
				<a href="${url}/capture" class="btn" style="display: inline-block; background-color: #FF2D78; color: #ffffff !important; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 900; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">Take Your First Smile 📸</a>
			</div>

			<p style="color: #57534e; font-size: 13px; line-height: 1.5; margin: 16px 0 0;">💡 <em>Pro-tip: Keep your daily streak going to unlock 2x coin multiplier scratch cards!</em></p>
		`,
		footerNote:
			'You are receiving this welcome email because you created an Open Smile account.',
	});
}

export function getResetPasswordEmailHtml(resetUrl: string): string {
	return renderEmailLayout({
		title: 'Reset Your Password',
		badgeText: 'ACCOUNT SECURITY',
		badgeBg: '#FF2D78',
		badgeColor: '#ffffff',
		content: `
			<h1 style="font-size: 24px; font-weight: 900; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">Reset Your Password 🔑</h1>
			<p style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 12px 0;">We received a request to reset the password for your <strong>Open Smile</strong> account. Click the secure button below to set a new password:</p>

			<div style="margin: 28px 0;">
				<a href="${resetUrl}" class="btn" style="display: inline-block; background-color: #FF2D78; color: #ffffff !important; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 900; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">Reset My Password 🔑</a>
			</div>

			<div style="background-color: #faf8f5; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 16px; margin: 24px 0;">
				<p style="color: #57534e; font-size: 13px; margin: 0; line-height: 1.5;">🔒 <strong>Security Notice:</strong> This password reset link expires in <strong>1 hour</strong>. If you didn't initiate this request, you can safely ignore this email — your account remains secure.</p>
			</div>

			<p style="color: #57534e; font-size: 12px; margin-top: 18px; word-break: break-all; line-height: 1.5;">
				If the button doesn't work, copy and paste this link into your browser:<br />
				<a href="${resetUrl}" style="color: #7B61FF; font-weight: 700; text-decoration: underline;">${resetUrl}</a>
			</p>
		`,
		footerNote:
			'You received this password reset link because a password reset was requested for your Open Smile account.',
	});
}

export function getLoginNotificationEmailHtml(
	details?: LoginDetails,
	appUrl?: string,
): string {
	const loginTime = escapeHtml(details?.time || new Date().toUTCString());
	const ipAddress = escapeHtml(details?.ip || 'Unknown IP');
	const userAgent = escapeHtml(details?.userAgent || 'Standard Browser');
	const url = (
		appUrl ||
		process.env.BETTER_AUTH_URL ||
		'http://localhost:3000'
	).replace(/\/+$/, '');

	return renderEmailLayout({
		title: 'Security Alert: New Sign-in',
		badgeText: 'SECURITY ALERT',
		badgeBg: '#EF4444',
		badgeColor: '#ffffff',
		content: `
			<h1 style="font-size: 24px; font-weight: 900; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">New Sign-In Detected 🔒</h1>
			<p style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 0 0 18px;">We noticed a new sign-in to your <strong>Open Smile</strong> account with the following session details:</p>

			<div style="background-color: #faf8f5; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 18px 20px; margin: 24px 0;">
				<table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; font-weight: 700; border-bottom: 1px dashed #0f0f0f;">Date & Time</td>
						<td style="padding: 10px 0; font-size: 14px; color: #0f0f0f; font-weight: 700; text-align: right; border-bottom: 1px dashed #0f0f0f;">${loginTime}</td>
					</tr>
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; font-weight: 700; border-bottom: 1px dashed #0f0f0f;">IP Address</td>
						<td style="padding: 10px 0; font-size: 14px; color: #0f0f0f; font-weight: 700; text-align: right; border-bottom: 1px dashed #0f0f0f; font-family: monospace;">${ipAddress}</td>
					</tr>
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; font-weight: 700; border-bottom: none;">Device / Client</td>
						<td style="padding: 10px 0; font-size: 14px; color: #0f0f0f; font-weight: 700; text-align: right; border-bottom: none;">${userAgent}</td>
					</tr>
				</table>
			</div>

			<p style="color: #57534e; font-size: 13.5px; line-height: 1.5; margin: 16px 0;">If this was you, you can safely disregard this message. If you do not recognize this activity, please secure your account immediately:</p>

			<div style="margin-top: 22px;">
				<a href="${url}/forgot-password" class="btn" style="display: inline-block; background-color: #EF4444; color: #ffffff !important; text-decoration: none; padding: 13px 26px; font-size: 14px; font-weight: 900; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">Secure My Account 🛡️</a>
			</div>
		`,
		footerNote:
			'You are receiving this security notification to protect your Open Smile account.',
	});
}

export function getBetaWaitlistEmailHtml(): string {
	return renderEmailLayout({
		title: "You're on the Beta List!",
		badgeText: 'EARLY ACCESS',
		badgeBg: '#7B61FF',
		badgeColor: '#ffffff',
		content: `
			<div style="display: inline-block; background-color: #C6F135; color: #0f0f0f; font-size: 11px; font-weight: 900; padding: 4px 10px; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 1.5px 1.5px 0px 0px #0f0f0f; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
				Early Access Priority 🌟
			</div>
			
			<h1 style="font-size: 24px; font-weight: 900; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">You're on the Beta List! 🚀</h1>
			<p style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 12px 0;">Thanks for signing up! You have secured priority early access to <strong>Open Smile</strong> — the gamified rewards app where your genuine smiles earn coins and Amazon vouchers.</p>

			<div style="background-color: #faf8f5; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 20px; margin: 24px 0;">
				<div style="font-size: 12px; font-weight: 900; color: #0f0f0f; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">🎁 WHAT YOU GET IN THE BETA:</div>
				<table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; border-bottom: 1px dashed #0f0f0f;">
							🔒 <strong>100% Private On-Device AI</strong> — Face landmarks are processed in your browser; images never leave your device.
						</td>
					</tr>
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; border-bottom: 1px dashed #0f0f0f;">
							🔥 <strong>Daily Streaks & Multipliers</strong> — Maintain your daily smile streak to earn double rewards.
						</td>
					</tr>
					<tr>
						<td style="padding: 10px 0; font-size: 14px; color: #57534e; border-bottom: none;">
							🏆 <strong>Leaderboard Prize Pools</strong> — Compete against creators and friends for real vouchers.
						</td>
					</tr>
				</table>
			</div>

			<p style="color: #57534e; font-size: 13.5px; line-height: 1.5; margin: 16px 0 0;">We'll email you the moment your invite code is ready. Keep smiling!</p>
		`,
		footerNote:
			'You are receiving this confirmation because you signed up for the Open Smile beta waitlist.',
	});
}

export function getStreakReminderEmailHtml(
	name: string,
	currentStreak: number,
	hoursLeft: number = 4,
	appUrl?: string,
	unsubscribeUrl?: string,
): string {
	const displayName = name ? escapeHtml(name) : 'Smiler';
	const url = (
		appUrl ||
		process.env.BETTER_AUTH_URL ||
		'http://localhost:3000'
	).replace(/\/+$/, '');

	return renderEmailLayout({
		title: 'Keep Your Smile Streak Alive! 🔥',
		badgeText: 'STREAK ALERT',
		badgeBg: '#FF2D78',
		badgeColor: '#ffffff',
		unsubscribeUrl,
		content: `
			<div style="display: inline-block; background-color: #FFD23F; color: #0f0f0f; font-size: 11px; font-weight: 900; padding: 4px 10px; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 1.5px 1.5px 0px 0px #0f0f0f; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
				${currentStreak}-Day Streak Active 🔥
			</div>

			<h1 style="font-size: 24px; font-weight: 900; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">Don't lose your streak, ${displayName}! ⏳</h1>
			<p style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 12px 0;">You have approximately <strong>${hoursLeft} hours left</strong> before midnight IST to record today's smile. Keep your streak going to maintain your coin multipliers and leaderboard standing!</p>

			<div style="background-color: #faf8f5; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 20px; margin: 24px 0; text-align: center;">
				<div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #57534e; margin-bottom: 6px;">CURRENT STREAK MULTIPLIER</div>
				<div style="font-family: 'Space Mono', monospace; font-size: 32px; font-weight: 900; color: #FF2D78; margin: 0;">
					${currentStreak >= 7 ? '2.0x' : currentStreak >= 3 ? '1.5x' : '1.2x'} Drop Bonus
				</div>
			</div>

			<div style="margin: 28px 0 16px;">
				<a href="${url}/capture" class="btn" style="display: inline-block; background-color: #FF2D78; color: #ffffff !important; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 900; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">Smile Now & Save Streak 📸</a>
			</div>

			<p style="color: #57534e; font-size: 13px; line-height: 1.5; margin: 16px 0 0;">Taking a smile takes less than 5 seconds with on-device private AI.</p>
		`,
		footerNote:
			'You are receiving this daily reminder based on your streak notification preferences.',
	});
}

export function getRewardUnlockedEmailHtml(
	name: string,
	rewardTitle: string,
	coinsValue: number,
	voucherCode?: string,
	appUrl?: string,
	unsubscribeUrl?: string,
): string {
	const displayName = name ? escapeHtml(name) : 'Smiler';
	const url = (
		appUrl ||
		process.env.BETTER_AUTH_URL ||
		'http://localhost:3000'
	).replace(/\/+$/, '');

	return renderEmailLayout({
		title: 'New Reward Unlocked! 🎁',
		badgeText: 'REWARD DROP',
		badgeBg: '#C6F135',
		badgeColor: '#0f0f0f',
		unsubscribeUrl,
		content: `
			<div style="display: inline-block; background-color: #C6F135; color: #0f0f0f; font-size: 11px; font-weight: 900; padding: 4px 10px; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 1.5px 1.5px 0px 0px #0f0f0f; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
				Prize Claim Ready 🪙
			</div>

			<h1 style="font-size: 24px; font-weight: 900; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">Congratulations, ${displayName}! 🎉</h1>
			<p style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 12px 0;">You unlocked a new prize: <strong>${escapeHtml(rewardTitle)}</strong> valued at <strong>${coinsValue} coins</strong>!</p>

			${
				voucherCode
					? `
				<div style="background-color: #faf8f5; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; padding: 20px; margin: 24px 0; text-align: center;">
					<div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #57534e; margin-bottom: 6px;">YOUR VOUCHER CODE</div>
					<div style="font-family: 'Space Mono', monospace; font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #0f0f0f; margin: 0; word-break: break-all;">
						${escapeHtml(voucherCode)}
					</div>
				</div>
				`
					: ''
			}

			<div style="margin: 28px 0 16px;">
				<a href="${url}/rewards" class="btn" style="display: inline-block; background-color: #7B61FF; color: #ffffff !important; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 900; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">View In Rewards Vault 🎁</a>
			</div>
		`,
		footerNote:
			'You received this notification because of an achievement or claim on Open Smile.',
	});
}

export function getAdminBroadcastEmailHtml(
	subject: string,
	headline: string,
	bodyHtml: string,
	ctaText?: string,
	ctaUrl?: string,
	appUrl?: string,
	unsubscribeUrl?: string,
): string {
	const url = (
		appUrl ||
		process.env.BETTER_AUTH_URL ||
		'http://localhost:3000'
	).replace(/\/+$/, '');

	return renderEmailLayout({
		title: subject,
		badgeText: 'ANNOUNCEMENT',
		badgeBg: '#7B61FF',
		badgeColor: '#ffffff',
		unsubscribeUrl,
		content: `
			<h1 style="font-size: 24px; font-weight: 900; color: #0f0f0f; margin: 0 0 12px; letter-spacing: -0.5px;">${escapeHtml(headline || subject)}</h1>
			<div style="color: #57534e; font-size: 15px; line-height: 1.65; margin: 16px 0;">
				${bodyHtml}
			</div>

			${
				ctaText && ctaUrl
					? `
				<div style="margin: 28px 0 16px;">
					<a href="${ctaUrl.startsWith('http') ? ctaUrl : `${url}${ctaUrl.startsWith('/') ? '' : '/'}${ctaUrl}`}" class="btn" style="display: inline-block; background-color: #FF2D78; color: #ffffff !important; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 900; border: 1px solid #0f0f0f; border-radius: 7px; box-shadow: 2px 2px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(ctaText)}</a>
				</div>
				`
					: ''
			}
		`,
		footerNote:
			'You are receiving this official announcement as an Open Smile community member.',
	});
}
