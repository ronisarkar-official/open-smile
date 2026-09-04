import { sendEmailSafe } from "./send-email";
import { getRewardUnlockedEmailHtml } from "./templates";

export { getRewardUnlockedEmailHtml };

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
