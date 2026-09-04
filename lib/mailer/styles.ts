export const emailColors = {
	background: "#faf8f5",
	foreground: "#0f0f0f",
	card: "#ffffff",
	primary: "#FF2D78",
	secondary: "#7B61FF",
	accent: "#C6F135",
	warning: "#FFD23F",
	muted: "#f0ece7",
	mutedForeground: "#57534e",
	border: "#0f0f0f",
	destructive: "#EF4444",
	success: "#22C55E",
};

export const emailCss = `
  body {
    margin: 0;
    padding: 0;
    background-color: #faf8f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #0f0f0f;
    -webkit-font-smoothing: antialiased;
  }
  .wrap {
    max-width: 580px;
    margin: 0 auto;
    padding: 36px 16px;
  }
  .card {
    background: #ffffff;
    border: 2px solid #0f0f0f;
    border-radius: 7px;
    box-shadow: 4px 4px 0px #0f0f0f;
    padding: 36px 30px;
  }
  h1 {
    font-size: 24px;
    font-weight: 800;
    color: #0f0f0f;
    margin: 0 0 16px;
    line-height: 1.25;
    letter-spacing: -0.5px;
  }
  p {
    color: #374151;
    font-size: 15px;
    line-height: 1.65;
    margin: 12px 0;
  }
  .btn {
    display: inline-block;
    background: #FF2D78;
    color: #ffffff !important;
    text-decoration: none;
    padding: 13px 28px;
    font-size: 14px;
    font-weight: 800;
    border: 2px solid #0f0f0f;
    border-radius: 7px;
    box-shadow: 3px 3px 0px #0f0f0f;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 18px;
    text-align: center;
  }
  .btn-yellow {
    background: #FFD23F;
    color: #0f0f0f !important;
  }
  .btn-danger {
    background: #EF4444;
    color: #ffffff !important;
  }
  .footer {
    text-align: center;
    color: #57534e;
    font-size: 12px;
    margin-top: 28px;
    line-height: 1.6;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  td {
    padding: 8px 0;
    font-size: 14px;
  }
  .label {
    color: #57534e;
    font-weight: 600;
  }
  .value {
    text-align: right;
    font-weight: 700;
    color: #0f0f0f;
  }
`;

export interface RenderEmailLayoutOptions {
	title?: string;
	badgeText?: string;
	badgeBg?: string;
	badgeColor?: string;
	content: string;
	footerNote?: string;
	unsubscribeUrl?: string;
}

export function renderEmailLayout({
	title,
	badgeText = "AI REWARDS",
	badgeBg = "#C6F135",
	badgeColor = "#0f0f0f",
	content,
	footerNote = "You are receiving this transactional email regarding your Open Smile account.",
	unsubscribeUrl,
}: RenderEmailLayoutOptions): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title ? `${title} — Open Smile` : "Open Smile"}</title>
<style>${emailCss}</style>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f0f0f;">
  <div class="wrap" style="max-width: 580px; margin: 0 auto; padding: 36px 16px;">
    
    <!-- Brand Header -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; border-collapse: collapse; width: 100%;">
      <tr>
        <td style="vertical-align: middle; border: none; padding: 0;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
            <tr>
              <td style="vertical-align: middle; padding-right: 12px; border: none;">
                <!-- Logo Box Icon -->
                <div style="background-color: #FF2D78; border: 2px solid #0f0f0f; border-radius: 6px; box-shadow: 2.5px 2.5px 0px #0f0f0f; width: 34px; height: 34px; text-align: center; line-height: 34px; display: inline-block;">
                  <span style="font-size: 18px; line-height: 34px; display: inline-block;">😄</span>
                </div>
              </td>
              <td style="vertical-align: middle; border: none;">
                <span style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #0f0f0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">OPEN SMILE</span>
              </td>
              <td style="vertical-align: middle; padding-left: 12px; border: none;">
                <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 10px; font-weight: 900; padding: 3px 8px; border: 1.5px solid #0f0f0f; border-radius: 4px; box-shadow: 1.5px 1.5px 0px #0f0f0f; text-transform: uppercase; letter-spacing: 0.5px;">${badgeText}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Main Neubrutalist Card -->
    <div class="card" style="background-color: #ffffff; border: 2px solid #0f0f0f; border-radius: 7px; box-shadow: 4px 4px 0px #0f0f0f; padding: 36px 30px;">
      ${content}
    </div>

    <!-- Footer -->
    <div class="footer" style="text-align: center; color: #57534e; font-size: 12px; margin-top: 28px; line-height: 1.6;">
      <div style="font-weight: 800; color: #0f0f0f; margin-bottom: 4px; font-size: 13px;">Open Smile • Smile More, Win More</div>
      <div style="color: #78716c; margin-bottom: 8px;">Private on-device AI smile recognition & rewards platform.</div>
      <div style="font-size: 11px; color: #a8a29e;">${footerNote}</div>
      ${
				unsubscribeUrl
					? `<div style="font-size: 11px; margin-top: 10px;"><a href="${unsubscribeUrl}" style="color: #78716c; text-decoration: underline;">Unsubscribe from these emails</a></div>`
					: ""
			}
    </div>

  </div>
</body>
</html>`;
}


