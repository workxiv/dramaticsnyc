import { NextResponse } from "next/server";
import { emailConfig, sendEmail } from "@/lib/email";
import { buildNewOrderEmail } from "@/lib/order-email";
import { retrieveOrder, verifyWebhookSignature } from "@/lib/square";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024;

/**
 * Square → site webhook. Subscribed to `payment.created` and
 * `payment.updated`; once a shop order's payment is COMPLETED we email the
 * salon a "new order" summary. Both events can carry the completed status
 * (and Square may retry), so the email send is idempotent per order.
 *
 * Env:
 *   SQUARE_WEBHOOK_SIGNATURE_KEY  from Developer Console → Webhooks → subscription
 *   SQUARE_WEBHOOK_URL            the exact notification URL registered with Square
 *                                 (defaults to https://<host>/api/square/webhook)
 */
export async function POST(req: Request) {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Too large." }, { status: 413 });
  }

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const url = process.env.SQUARE_WEBHOOK_URL || `https://${host}/api/square/webhook`;
  const ok = await verifyWebhookSignature(
    raw,
    req.headers.get("x-square-hmacsha256-signature"),
    url,
    key
  );
  if (!ok) {
    return NextResponse.json({ error: "Bad signature." }, { status: 401 });
  }

  let event: {
    event_id?: string;
    type?: string;
    data?: { object?: { payment?: Record<string, unknown> & { id: string; order_id?: string; status?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Acknowledge everything we don't act on so Square stops retrying.
  if (event.type !== "payment.updated" && event.type !== "payment.created") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }
  const payment = event.data?.object?.payment;
  if (!payment?.order_id || payment.status !== "COMPLETED") {
    return NextResponse.json({ ok: true, ignored: "no order" });
  }

  if (!emailConfig()) {
    console.warn("[webhook] payment completed but RESEND_API_KEY is not set");
    return NextResponse.json({ ok: true, emailed: false });
  }

  try {
    const order = await retrieveOrder(payment.order_id);
    if (!order) throw new Error(`order ${payment.order_id} not found`);
    // Only shop orders carry our numeric reference_id; POS sales don't.
    if (!/^\d+$/.test(order.reference_id ?? "")) {
      return NextResponse.json({ ok: true, ignored: "not a web order" });
    }
    const msg = buildNewOrderEmail(order, payment as Parameters<typeof buildNewOrderEmail>[1]);
    const id = await sendEmail({
      to: emailConfig()!.to,
      ...msg,
      idempotencyKey: `order-${order.id}`,
    });
    return NextResponse.json({ ok: true, emailed: true, id });
  } catch (e) {
    console.error("[webhook] failed to send order email:", e);
    // 500 makes Square retry later (up to 24h), which is what we want.
    return NextResponse.json({ error: "Email failed." }, { status: 500 });
  }
}
