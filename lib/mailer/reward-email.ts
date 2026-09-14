import { sendEmailSafe } from "./send-email";
import { getRewardUnlockedEmailHtml, getVoucherClaimedEmailHtml } from "./templates";

export { getRewardUnlockedEmailHtml, getVoucherClaimedEmailHtml };

export async function sendRewardUnlockedEmail(
	to: string,
	name: string,
	rewardTitle: string,
	coinsValue: number,
	voucherCode?: string
): Promise<void> {
	if (!to) return;
	const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");
	const unsubscribeUrl = `${appUrl}/api/mailer/unsubscribe?email=${encodeURIComponent(to)}&category=rewards`;

	await sendEmailSafe({
		to,
		subject: `🎁 You unlocked a new reward: ${rewardTitle}!`,
		text: `Congratulations ${name || "Smiler"}!\n\nYou unlocked ${rewardTitle} valued at ${coinsValue} coins!\n${voucherCode ? `Voucher Code: ${voucherCode}\n` : ""}Check your rewards vault: ${appUrl}/rewards\n\n— The Open Smile Team`,
		html: getRewardUnlockedEmailHtml(name, rewardTitle, coinsValue, voucherCode, appUrl, unsubscribeUrl),
		template: "reward-unlocked",
		category: "rewards",
	});
}

export async function sendVoucherClaimedEmail(params: {
	to: string;
	name: string;
	userId?: string;
	brandName: string;
	voucherTitle: string;
	voucherCode: string;
	pin?: string | null;
	valueFormatted?: string;
	coinsSpent?: number;
	expiresAt?: string;
	websiteUrl?: string;
}): Promise<void> {
	if (!params.to) return;
	const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");
	const unsubscribeUrl = `${appUrl}/api/mailer/unsubscribe?email=${encodeURIComponent(params.to)}&category=rewards`;

	const brand = params.brandName || "Brand";
	const subject = `🎟️ Your ${brand} Voucher Code: ${params.voucherCode}`;

	const text = [
		`Congratulations ${params.name || "Smiler"}!`,
		``,
		`You successfully redeemed ${params.voucherTitle || `${brand} Voucher`}${params.coinsSpent ? ` for ${params.coinsSpent} coins` : ""}.`,
		``,
		`VOUCHER CODE: ${params.voucherCode}`,
		params.pin ? `PIN: ${params.pin}` : null,
		params.expiresAt ? `Valid till: ${params.expiresAt}` : null,
		params.websiteUrl ? `Redeem link: ${params.websiteUrl}` : `Open Smile Rewards: ${appUrl}/rewards`,
		``,
		`— The Open Smile Team`,
	]
		.filter((line) => line !== null)
		.join("\n");

	await sendEmailSafe({
		to: params.to,
		userId: params.userId,
		subject,
		text,
		html: getVoucherClaimedEmailHtml({
			...params,
			appUrl,
			unsubscribeUrl,
		}),
		template: "voucher-claimed",
		category: "rewards",
	});
}

