import { sendEmail } from "./send-email";

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
	if (!email) return;
	await sendEmail({
		to: email,
		subject: "Your OTP Verification Code",
		text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
		html: `<div style="font-family: sans-serif; padding: 20px;">
      <h2>Verification Code</h2>
      <p>Your one-time password is:</p>
      <h1 style="font-size: 32px; letter-spacing: 4px; color: #333;">${otp}</h1>
      <p>This code will expire in 5 minutes.</p>
    </div>`,
	});
}
