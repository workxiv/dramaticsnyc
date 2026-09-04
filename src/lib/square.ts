/**
 * Minimal Square REST client (server only). Uses the Checkout API's
 * Payment Links so card entry happens on Square's PCI-compliant hosted
 * page; we never touch card data.
 *
 * Env:
 *   SQUARE_ACCESS_TOKEN   production or sandbox access token
 *   SQUARE_LOCATION_ID    the Square location that receives the sale
 *   SQUARE_ENVIRONMENT    "production" (default) | "sandbox"
 *   SQUARE_SUPPORT_EMAIL  shown on the checkout page (optional)
 */

const SQUARE_VERSION = "2025-01-23";

export function squareConfig() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const env = process.env.SQUARE_ENVIRONMENT === "sandbox" ? "sandbox" : "production";
  if (!token || !locationId) return null;
  return {
    token,
    locationId,
    env,
    baseUrl:
      env === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com",
    supportEmail: process.env.SQUARE_SUPPORT_EMAIL || undefined,
  };
}

export type SquareMoney = { amount: number; currency: "USD" };

export type PaymentLinkRequest = {
  idempotency_key: string;
  order: {
    location_id: string;
    reference_id?: string;
    line_items: Array<{
      name: string;
      quantity: string;
      base_price_money: SquareMoney;
      variation_name?: string;
      note?: string;
    }>;
  };
  checkout_options?: {
    ask_for_shipping_address?: boolean;
    shipping_fee?: { name: string; charge: SquareMoney };
    redirect_url?: string;
    merchant_support_email?: string;
    allow_tipping?: boolean;
    enable_coupon?: boolean;
    enable_loyalty?: boolean;
  };
  pre_populated_data?: { buyer_email?: string };
};

export async function createPaymentLink(body: PaymentLinkRequest) {
  const cfg = squareConfig();
  if (!cfg) throw new Error("Square is not configured");
  const res = await fetch(`${cfg.baseUrl}/v2/online-checkout/payment-links`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_VERSION,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    payment_link?: { id: string; url: string; long_url?: string; order_id?: string };
    errors?: Array<{ category: string; code: string; detail?: string; field?: string }>;
  };
  if (!res.ok || !data.payment_link) {
    const detail = data.errors?.map((e) => `${e.code}${e.detail ? `: ${e.detail}` : ""}`).join("; ");
    throw new Error(detail || `Square responded ${res.status}`);
  }
  return data.payment_link;
}

/** Fetch an order (used by the thank-you page to show a receipt summary). */
export async function retrieveOrder(orderId: string) {
  const cfg = squareConfig();
  if (!cfg) return null;
  const res = await fetch(`${cfg.baseUrl}/v2/orders/${encodeURIComponent(orderId)}`, {
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Square-Version": SQUARE_VERSION,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    order?: {
      id: string;
      state: string;
      total_money?: SquareMoney;
      line_items?: Array<{ name: string; quantity: string; variation_name?: string; total_money?: SquareMoney }>;
      tenders?: Array<{ id: string }>;
    };
  };
  return data.order ?? null;
}
