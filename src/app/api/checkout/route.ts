import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createPaymentLink, squareConfig } from "@/lib/square";
import { SHIPPING_CENTS, SHIPPING_LABEL, findVariant } from "@/lib/shop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LINES = 30;
const MAX_QTY = 20;
const MAX_BODY_BYTES = 8 * 1024;

// Best-effort per-instance rate limit (Vercel's WAF is the real backstop):
// 20 checkout sessions per IP per 10 minutes is far above any real shopper.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 20;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

type IncomingItem = { productId: number; variantId: number; quantity: number };

/** Only our own pages may start a checkout (blocks cross-site order spam). */
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return true; // non-browser or same-origin fetch without Origin
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function siteOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return host ? `${proto}://${host}` : "https://www.dramaticsnyc.com";
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }
  if (!squareConfig()) {
    return NextResponse.json(
      { error: "Online checkout is temporarily unavailable. Please call your salon to order." },
      { status: 503 }
    );
  }

  let items: IncomingItem[];
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    const body = JSON.parse(raw);
    items = Array.isArray(body?.items) ? body.items : [];
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (items.length === 0 || items.length > MAX_LINES) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  // Prices are resolved server-side from the catalog; the client only sends ids.
  const lineItems = [];
  for (const it of items) {
    const qty = Math.floor(Number(it.quantity));
    if (!Number.isInteger(it.productId) || !Number.isInteger(it.variantId) || !(qty >= 1 && qty <= MAX_QTY)) {
      return NextResponse.json({ error: "Invalid item in bag." }, { status: 400 });
    }
    const hit = findVariant(it.productId, it.variantId);
    if (!hit || !hit.variant.inStock) {
      return NextResponse.json(
        { error: "One of the items in your bag is no longer available." },
        { status: 409 }
      );
    }
    lineItems.push({
      name: hit.product.name,
      quantity: String(qty),
      base_price_money: { amount: hit.variant.cents, currency: "USD" as const },
      ...(hit.variant.label ? { variation_name: hit.variant.label } : {}),
      ...(hit.variant.sku ? { note: `SKU ${hit.variant.sku}` } : {}),
    });
  }

  const origin = siteOrigin(req);
  const cfg = squareConfig()!;

  try {
    const link = await createPaymentLink({
      idempotency_key: randomUUID(),
      order: {
        location_id: cfg.locationId,
        reference_id: `web-${Date.now().toString(36)}`,
        line_items: lineItems,
      },
      checkout_options: {
        ask_for_shipping_address: true,
        shipping_fee: {
          name: SHIPPING_LABEL,
          charge: { amount: SHIPPING_CENTS, currency: "USD" },
        },
        redirect_url: `${origin}/shop/thank-you`,
        allow_tipping: false,
        enable_coupon: true,
        ...(cfg.supportEmail ? { merchant_support_email: cfg.supportEmail } : {}),
      },
    });
    // Prefer the full checkout.square.site URL: the short square.link domain
    // is a redirector that some content blockers and network filters stop.
    return NextResponse.json({ url: link.long_url || link.url, orderId: link.order_id ?? null });
  } catch (e) {
    console.error("[checkout] Square error:", e);
    return NextResponse.json(
      { error: "We couldn't start checkout right now. Please try again in a moment." },
      { status: 502 }
    );
  }
}
