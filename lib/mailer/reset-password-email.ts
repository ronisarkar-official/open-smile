import { sendEmail } from "./send-email";
import { getResetPasswordEmailHtml } from "./templates";

export { getResetPasswordEmailHtml };

export async function sendResetPasswordEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  if (!email) return;
  await sendEmail({
    to: email,
    subject: "[Open Smile] Reset your password",
    text: `Reset your Open Smile password\n\nWe received a request to reset the password for your Open Smile account.\n\nOpen the link below to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request a password reset, you can safely ignore this email.\n\n— The Open Smile Team`,
    html: getResetPasswordEmailHtml(resetUrl),
  });
}



