import "server-only";

// Email sending. Uses Resend when RESEND_API_KEY is set; otherwise runs in dev
// mode (logs to the console) so verification/reset flows work without a provider.
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Kringle <hello@kriskringlemail.com>";

export const emailIsLive = Boolean(apiKey);

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!apiKey) {
    console.log(`\n[email:dev] To: ${opts.to}\n[email:dev] Subject: ${opts.subject}\n${opts.html}\n`);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
    });
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

export function brandedEmail(heading: string, body: string, cta?: { label: string; url: string }): string {
  return `
  <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#1b211d">
    <h1 style="font-size:20px;color:#18432b">${heading}</h1>
    <p style="line-height:1.6;color:#2c6b45">${body}</p>
    ${
      cta
        ? `<p><a href="${cta.url}" style="display:inline-block;background:#18432b;color:#faf6ef;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">${cta.label}</a></p>
           <p style="font-size:12px;color:#7a8a80">Or paste this link: ${cta.url}</p>`
        : ""
    }
    <p style="font-size:12px;color:#7a8a80;margin-top:24px">— Kringle · kriskringlemail.com</p>
  </div>`;
}
