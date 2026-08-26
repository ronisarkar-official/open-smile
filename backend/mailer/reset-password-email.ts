import { sendEmail } from "./send-email";

export async function sendResetPasswordEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  if (!email) return;
  await sendEmail({
    to: email,
    subject: "Reset your password",
    text: `We received a request to reset your password. Open the link below to set a new one (valid for 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `<div style="font-family: sans-serif; padding: 20px;">
      <h2>Reset your password</h2>
      <p>We received a request to reset your password. Click the button below to set a new one.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background: #111; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Reset password</a>
      </p>
      <p style="color: #666; font-size: 13px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
    </div>`,
  });
}
