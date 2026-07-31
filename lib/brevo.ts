/**
 * Brevo (Sendinblue) transactional email via the HTTP API.
 * No SDK — a single fetch to https://api.brevo.com/v3/smtp/email.
 */

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

type Recipient = { email: string; name?: string };

type SendArgs = {
  to: Recipient[];
  subject: string;
  html: string;
  replyTo?: Recipient;
};

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  engagement?: string;
  message: string;
};

/** Low-level send. Throws on non-2xx so callers can decide how to react. */
export async function sendTransactional({ to, subject, html, replyTo }: SendArgs): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Digital Pearls";

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo is not configured (BREVO_API_KEY / BREVO_SENDER_EMAIL).");
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to,
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo send failed (${res.status}): ${detail}`);
  }
}

/* ---------- Branded templates (inline styles for email-client safety) ---------- */

const NAVY = "#0D234A";
const ROYAL = "#294F87";
const GOLD = "#D6B25E";
const PEARL = "#F5F7FA";
const SILVER = "#C9CDD3";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${PEARL};font-family:Helvetica,Arial,sans-serif;color:${NAVY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PEARL};padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px -30px rgba(13,35,74,0.4);">
        <tr><td style="background:${NAVY};padding:24px 32px;">
          <span style="color:#ffffff;font-size:20px;font-weight:600;letter-spacing:0.3px;">Digital Pearls</span>
          <span style="color:${GOLD};font-size:10px;letter-spacing:3px;display:block;margin-top:4px;">TECHNOLOGY ADVISORY</span>
        </td></tr>
        <tr><td style="padding:32px;">${inner}</td></tr>
        <tr><td style="padding:20px 32px;background:${PEARL};border-top:1px solid ${SILVER};">
          <span style="font-size:12px;color:${ROYAL};">Digital Pearls — Precision Architecture for High-Stakes Technology</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Email sent to the site owner when a new enquiry arrives. */
export function ownerNotificationEmail(p: ContactPayload): { subject: string; html: string } {
  const rows: [string, string][] = [
    ["Name", p.name],
    ["Email", p.email],
    ["Organization", p.company || "—"],
    ["Engagement", p.engagement || "—"],
  ];
  const detail = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:${ROYAL};font-size:13px;width:130px;vertical-align:top;">${k}</td><td style="padding:6px 0;font-size:14px;">${esc(v)}</td></tr>`
    )
    .join("");
  const inner = `
    <h1 style="margin:0 0 8px;font-size:22px;color:${NAVY};">New audit request</h1>
    <p style="margin:0 0 20px;font-size:14px;color:${ROYAL};">A new enquiry has been submitted through the website.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${detail}</table>
    <div style="margin-top:20px;padding:16px;background:${PEARL};border-radius:12px;border-left:3px solid ${GOLD};">
      <div style="font-size:12px;color:${ROYAL};margin-bottom:6px;">MESSAGE</div>
      <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(p.message)}</div>
    </div>`;
  return { subject: `New audit request — ${p.name}`, html: shell(inner) };
}

/** Confirmation email sent to the client who submitted the form. */
export function clientConfirmationEmail(p: ContactPayload): { subject: string; html: string } {
  const inner = `
    <h1 style="margin:0 0 12px;font-size:22px;color:${NAVY};">Thank you, ${esc(p.name.split(" ")[0] || p.name)}</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;">
      We've received your request and a member of our advisory team will be in touch within one business day to arrange the next steps.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;">
      For reference, here's what you told us:
    </p>
    <div style="padding:16px;background:${PEARL};border-radius:12px;border-left:3px solid ${GOLD};font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(p.message)}</div>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.65;color:${ROYAL};">
      In the meantime, feel free to book a time directly if you'd prefer.
    </p>
    <p style="margin:24px 0 0;font-size:14px;">Warm regards,<br/><strong style="color:${NAVY};">The Digital Pearls Advisory Team</strong></p>`;
  return { subject: "We've received your request — Digital Pearls", html: shell(inner) };
}
