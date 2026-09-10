import { squareConfig, type SquareAddress, type SquareOrder } from "./square";
import type { Archive, ArchiveAddress, ArchiveCustomer, ArchiveOrder } from "./archive";

/**
 * Live orders from the Square account, shaped like the archive so /admin can
 * show old and new orders in one list. Only web-shop orders are included
 * (their reference_id is the numeric order number we assign at checkout);
 * in-salon POS sales stay in the Square Dashboard.
 */

const SQUARE_VERSION = "2025-01-23";
const CACHE_MS = 60 * 1000;
const MAX_ORDERS = 2000;

type OrderWithMeta = Omit<SquareOrder, "fulfillments" | "tenders"> & {
  updated_at?: string;
  closed_at?: string;
  source?: { name?: string };
  discounts?: Array<{ name?: string; applied_money?: { amount: number } }>;
  fulfillments?: Array<{
    type?: string;
    state?: string;
    shipment_details?: {
      recipient?: {
        display_name?: string;
        email_address?: string;
        phone_number?: string;
        address?: SquareAddress & { first_name?: string; last_name?: string };
      };
      carrier?: string;
      tracking_number?: string;
      shipped_at?: string;
    };
  }>;
  tenders?: Array<{
    id: string;
    type?: string;
    created_at?: string;
    amount_money?: { amount: number };
    card_details?: { status?: string; card?: { card_brand?: string; last_4?: string } };
    payment_id?: string;
  }>;
  returns?: unknown[];
  net_amounts?: { total_money?: { amount: number } };
  return_amounts?: { total_money?: { amount: number } };
};

const money = (cents?: number) => ((cents ?? 0) / 100).toFixed(2);

function toAddress(
  a?: SquareAddress & { first_name?: string; last_name?: string },
  name = "",
  extra: { phone?: string; email?: string } = {}
): ArchiveAddress {
  return {
    name: name || [a?.first_name, a?.last_name].filter(Boolean).join(" "),
    line1: a?.address_line_1 ?? "",
    ...(a?.address_line_2 ? { line2: a.address_line_2 } : {}),
    city: a?.locality ?? "",
    state: a?.administrative_district_level_1 ?? "",
    zip: a?.postal_code ?? "",
    country: a?.country ?? "",
    ...(extra.phone ? { phone: extra.phone } : {}),
    ...(extra.email ? { email: extra.email } : {}),
  };
}

export const isWebOrder = (o: OrderWithMeta) =>
  /^\d+$/.test(o.reference_id ?? "") || (o.reference_id ?? "").startsWith("web-");

export function toArchiveOrder(o: OrderWithMeta): ArchiveOrder {
  const f = o.fulfillments?.find((x) => x.shipment_details) ?? o.fulfillments?.[0];
  const r = f?.shipment_details?.recipient;
  const tender = o.tenders?.[0];
  const card = tender?.card_details?.card;
  const paid = (o.tenders?.length ?? 0) > 0 || o.state === "COMPLETED";
  const returned = o.return_amounts?.total_money?.amount ?? 0;
  const status =
    o.state === "CANCELED"
      ? "cancelled"
      : returned > 0 && returned >= (o.total_money?.amount ?? 0)
        ? "refunded"
        : f?.state === "COMPLETED"
          ? "completed"
          : paid
            ? "processing"
            : "pending";
  const ship = toAddress(r?.address, r?.display_name ?? "", { phone: r?.phone_number, email: r?.email_address });
  const subtotal = (o.line_items ?? []).reduce((s, li) => s + (li.total_money?.amount ?? 0), 0);
  const shipping = (o.service_charges ?? []).reduce((s, c) => s + (c.total_money?.amount ?? 0), 0);
  const notes: ArchiveOrder["notes"] = [];
  if (tender?.created_at) {
    notes.push({
      date: tender.created_at,
      note: `Square payment ${card ? `${card.card_brand ?? "card"} ending ${card.last_4 ?? ""}` : tender.type ?? ""} for $${money(tender.amount_money?.amount)} (payment ${tender.payment_id ?? tender.id})`,
    });
  }
  if (f?.shipment_details?.shipped_at) {
    notes.push({
      date: f.shipment_details.shipped_at,
      note: `Shipped${f.shipment_details.carrier ? ` via ${f.shipment_details.carrier}` : ""}${f.shipment_details.tracking_number ? `, tracking ${f.shipment_details.tracking_number}` : ""}`,
    });
  }
  return {
    id: o.id,
    source: "square",
    fulfillment: f?.state,
    number: /^\d+$/.test(o.reference_id ?? "") ? o.reference_id! : (o.reference_id ?? o.id).slice(0, 12),
    status,
    date: o.created_at ?? "",
    ...(tender?.created_at ? { paid: tender.created_at } : {}),
    total: money(o.total_money?.amount),
    subtotal: money(subtotal),
    shipping: money(shipping),
    discount: money(o.total_discount_money?.amount),
    tax: money(o.total_tax_money?.amount),
    payment: card ? `${card.card_brand ?? "Card"} ending ${card.last_4 ?? ""}`.trim() : tender?.type ?? "Square",
    ...(tender?.payment_id ? { transaction: tender.payment_id } : {}),
    via: "square",
    name: ship.name,
    email: r?.email_address ?? "",
    phone: r?.phone_number ?? "",
    billing: ship,
    ship,
    items: (o.line_items ?? []).map((li) => ({
      name: li.name,
      ...(li.note?.startsWith("SKU ") ? { sku: li.note.slice(4) } : {}),
      qty: Number(li.quantity ?? 0),
      total: money(li.total_money?.amount),
      ...(li.variation_name ? { variation: li.variation_name } : {}),
    })),
    coupons: (o.discounts ?? []).map((d) => d.name ?? "discount"),
    notes,
    refunds: returned > 0 ? [{ date: o.updated_at ?? o.created_at ?? "", amount: money(returned) }] : [],
  };
}

let cache: { at: number; orders: ArchiveOrder[] } | null = null;

/** All web orders from Square, newest first. Cached for a minute. */
export async function fetchSquareWebOrders(): Promise<ArchiveOrder[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.orders;
  const cfg = squareConfig();
  if (!cfg) return [];
  const out: ArchiveOrder[] = [];
  let cursor: string | undefined;
  try {
    do {
      const res = await fetch(`${cfg.baseUrl}/v2/orders/search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          "Content-Type": "application/json",
          "Square-Version": SQUARE_VERSION,
        },
        body: JSON.stringify({
          location_ids: [cfg.locationId],
          limit: 500,
          ...(cursor ? { cursor } : {}),
          query: {
            filter: { state_filter: { states: ["OPEN", "COMPLETED", "CANCELED"] } },
            sort: { sort_field: "CREATED_AT", sort_order: "DESC" },
          },
        }),
        cache: "no-store",
      });
      if (!res.ok) break;
      const data = (await res.json()) as { orders?: OrderWithMeta[]; cursor?: string };
      for (const o of data.orders ?? []) if (isWebOrder(o)) out.push(toArchiveOrder(o));
      cursor = data.cursor;
    } while (cursor && out.length < MAX_ORDERS);
  } catch (e) {
    console.error("[admin] Square orders fetch failed:", e);
  }
  cache = { at: Date.now(), orders: out };
  return out;
}

export async function fetchSquareOrder(id: string): Promise<ArchiveOrder | null> {
  const cfg = squareConfig();
  if (!cfg || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) return null;
  const res = await fetch(`${cfg.baseUrl}/v2/orders/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${cfg.token}`, "Square-Version": SQUARE_VERSION },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { order?: OrderWithMeta };
  return data.order ? toArchiveOrder(data.order) : null;
}

/**
 * Archive + live Square orders in one list, with customer profiles updated
 * to include their new orders.
 */
export async function loadCombined(archive: Archive): Promise<Archive> {
  const live = await fetchSquareWebOrders();
  if (!live.length) return archive;
  const customers: ArchiveCustomer[] = archive.customers.map((c) => ({ ...c, orderIds: [...c.orderIds] }));
  const byKey = new Map(customers.map((c) => [c.key, c]));
  for (const o of live) {
    const key = o.email ? o.email.toLowerCase() : `order-${o.id}`;
    let c = byKey.get(key);
    if (!c) {
      c = {
        key,
        name: o.name,
        email: o.email,
        phone: o.phone,
        address: o.ship.line1 ? o.ship : undefined,
        orderIds: [],
        orderCount: 0,
        spent: 0,
        first: o.date,
        last: o.date,
      };
      byKey.set(key, c);
      customers.push(c);
    }
    c.orderIds.push(o.id);
    if (!["cancelled", "pending"].includes(o.status)) {
      c.orderCount += 1;
      c.spent = Number((c.spent + Number(o.total) - o.refunds.reduce((s, r) => s + Number(r.amount), 0)).toFixed(2));
    }
    if (o.date > c.last) {
      c.last = o.date;
      if (o.phone) c.phone = o.phone;
      if (o.ship.line1) c.address = o.ship;
    }
    if (o.date < c.first) c.first = o.date;
  }
  return {
    ...archive,
    orders: [...live, ...archive.orders].sort((a, b) => b.date.localeCompare(a.date)),
    customers: customers.sort((a, b) => b.last.localeCompare(a.last)),
  };
}
