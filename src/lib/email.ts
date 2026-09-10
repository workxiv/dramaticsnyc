/**
 * Transactional email via Resend's REST API (server only, no SDK needed).
 *
 * Env:
 *   RESEND_API_KEY      from resend.com → API Keys
 *   ORDER_NOTIFY_TO     comma-separated recipients for new-order emails
 *   ORDER_NOTIFY_FROM   sender; must be a verified Resend domain/sender
 */

export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  const to = (process.env.ORDER_NOTIFY_TO || "dramaticsnycs@gmail.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from =
    process.env.ORDER_NOTIFY_FROM || "Dramatics NYC <onboarding@resend.dev>";
  return { apiKey, to, from };
}

export type EmailMessage = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Idempotency key so retries don't send duplicates. */
  idempotencyKey?: string;
};

export async function sendEmail(msg: EmailMessage) {
  const cfg = emailConfig();
  if (!cfg) throw new Error("Email is not configured (RESEND_API_KEY missing)");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
      ...(msg.idempotencyKey ? { "Idempotency-Key": msg.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: cfg.from,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok) throw new Error(data.message || `Resend responded ${res.status}`);
  return data.id ?? null;
}

export const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
