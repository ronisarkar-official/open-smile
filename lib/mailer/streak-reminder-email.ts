import { sendEmailSafe } from "./send-email";
import { getStreakReminderEmailHtml } from "./templates";

export { getStreakReminderEmailHtml };

export async function sendStreakReminderEmail(
	to: string,
	name: string,
	streak: number,
	hoursLeft: number = 4
): Promise<void> {
	if (!to) return;
	const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");
	const unsubscribeUrl = `${appUrl}/api/mailer/unsubscribe?email=${encodeURIComponent(to)}&category=streaks`;

	await sendEmailSafe({
		to,
		subject: `🔥 Don't lose your ${streak}-day smile streak!`,
		text: `Hi ${name || "there"},\n\nYou have approximately ${hoursLeft} hours left before midnight IST to record today's smile.\n\nKeep your streak going to maintain your coin multiplier bonuses:\n${appUrl}/capture\n\n— The Open Smile Team`,
		html: getStreakReminderEmailHtml(name, streak, hoursLeft, appUrl, unsubscribeUrl),
		template: "streak-reminder",
		category: "streaks",
	});
}
