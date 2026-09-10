import { createDecipheriv } from "node:crypto";
import { ARCHIVE_ENC } from "@/data/archive.enc";

/**
 * Read-only archive of the old WooCommerce shop (orders 2019-2026 and the
 * people who placed them). Stored AES-256-GCM encrypted in src/data so
 * customer details never sit readable in the repo; decrypted here with
 * ARCHIVE_KEY. Rebuild with `node scripts/build-archive.mjs <backup.json>`.
 */

export type ArchiveAddress = {
  name: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
};

export type ArchiveItem = {
  name: string;
  sku?: string;
  qty: number;
  total: string;
  variation?: string;
};

export type ArchiveOrder = {
  id: number;
  number: string;
  status: string;
  date: string;
  paid?: string;
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  tax: string;
  payment: string;
  transaction?: string;
  via?: string;
  name: string;
  email: string;
  phone: string;
  billing: ArchiveAddress;
  ship: ArchiveAddress;
  items: ArchiveItem[];
  coupons: string[];
  customerNote?: string;
  notes: Array<{ date: string; note: string; author?: string; customer?: boolean }>;
  refunds: Array<{ date: string; amount: string; reason?: string }>;
};

export type ArchiveCustomer = {
  /** lower-cased email (or `order-<id>` when the order had no email) */
  key: string;
  name: string;
  email: string;
  phone: string;
  address?: ArchiveAddress;
  userId?: number;
  username?: string;
  registered?: string;
  orderIds: number[];
  orderCount: number;
  spent: number;
  first: string;
  last: string;
};

export type Archive = {
  generatedAt: string;
  source: string;
  orders: ArchiveOrder[];
  customers: ArchiveCustomer[];
};

let cache: Archive | null = null;

export function loadArchive(): Archive {
  if (cache) return cache;
  const key = process.env.ARCHIVE_KEY;
  if (!key || !/^[0-9a-f]{64}$/i.test(key)) throw new Error("ARCHIVE_KEY is not set");
  const buf = Buffer.from(ARCHIVE_ENC, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const d = createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
  d.setAuthTag(tag);
  const json = Buffer.concat([d.update(data), d.final()]).toString("utf8");
  cache = JSON.parse(json) as Archive;
  return cache;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9@.]+/g, " ").trim();
const digits = (s: string) => s.replace(/\D+/g, "");

/** Search orders by number, name, email, phone, item, SKU, city or zip. */
export function searchOrders(archive: Archive, q: string, status?: string) {
  const query = norm(q);
  const qDigits = digits(q);
  const terms = query.split(" ").filter(Boolean);
  return archive.orders.filter((o) => {
    if (status && status !== "all" && o.status !== status) return false;
    if (!terms.length) return true;
    if (qDigits.length >= 4 && (o.number === qDigits || String(o.id) === qDigits)) return true;
    const hay = norm(
      [
        o.number,
        o.name,
        o.email,
        o.billing.name,
        o.ship.name,
        o.billing.city,
        o.ship.city,
        o.billing.zip,
        o.ship.zip,
        o.transaction ?? "",
        ...o.items.map((i) => `${i.name} ${i.sku ?? ""}`),
      ].join(" ")
    );
    const phoneHay = digits(`${o.phone} ${o.billing.phone ?? ""} ${o.ship.phone ?? ""}`);
    return terms.every((t) => hay.includes(t) || (digits(t).length >= 4 && phoneHay.includes(digits(t))));
  });
}

export function searchCustomers(archive: Archive, q: string) {
  const query = norm(q);
  const terms = query.split(" ").filter(Boolean);
  if (!terms.length) return archive.customers;
  return archive.customers.filter((c) => {
    const hay = norm(
      [c.name, c.email, c.username ?? "", c.address?.city ?? "", c.address?.zip ?? "", c.address?.line1 ?? ""].join(" ")
    );
    const phoneHay = digits(`${c.phone} ${c.address?.phone ?? ""}`);
    return terms.every((t) => hay.includes(t) || (digits(t).length >= 4 && phoneHay.includes(digits(t))));
  });
}

export const orderById = (archive: Archive, id: number) =>
  archive.orders.find((o) => o.id === id) ?? null;

export const customerByKey = (archive: Archive, key: string) =>
  archive.customers.find((c) => c.key === key) ?? null;

export const STATUS_LABEL: Record<string, string> = {
  processing: "Paid",
  completed: "Completed",
  refunded: "Refunded",
  cancelled: "Cancelled",
  pending: "Pending payment",
  failed: "Failed",
  "on-hold": "On hold",
};
