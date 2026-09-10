#!/usr/bin/env node
/**
 * Build the encrypted order archive used by /admin.
 *
 *   ARCHIVE_KEY=<64 hex> node scripts/build-archive.mjs path/to/dramaticsnyc-woocommerce-backup.json
 *
 * Reads the raw WooCommerce backup (orders, customers, notes, refunds),
 * compacts it, encrypts with AES-256-GCM and writes src/data/archive.enc.ts.
 * ARCHIVE_KEY falls back to .env.local. Generate one with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
import { createCipheriv, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
if (!src) {
  console.error("usage: build-archive.mjs <backup.json>");
  process.exit(1);
}

let key = process.env.ARCHIVE_KEY;
if (!key && existsSync(join(root, ".env.local"))) {
  const m = readFileSync(join(root, ".env.local"), "utf8").match(/^ARCHIVE_KEY=([0-9a-f]{64})/mi);
  if (m) key = m[1];
}
if (!key || !/^[0-9a-f]{64}$/i.test(key)) {
  console.error("ARCHIVE_KEY (64 hex chars) missing");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(src, "utf8"));
const money = (v) => (v == null || v === "" ? "0.00" : Number(v).toFixed(2));
const addr = (a = {}) => ({
  name: [a.first_name, a.last_name].filter(Boolean).join(" ").trim(),
  ...(a.company ? { company: a.company } : {}),
  line1: a.address_1 || "",
  ...(a.address_2 ? { line2: a.address_2 } : {}),
  city: a.city || "",
  state: a.state || "",
  zip: a.postcode || "",
  country: a.country || "",
  ...(a.phone ? { phone: a.phone } : {}),
  ...(a.email ? { email: a.email } : {}),
});

const notesByOrder = new Map();
for (const n of raw.notes ?? []) {
  const list = notesByOrder.get(n.order_id) ?? [];
  list.push({
    date: n.date_created,
    note: String(n.note ?? "").replace(/<[^>]+>/g, "").trim(),
    ...(n.author && n.author !== "WooCommerce" && n.author !== "system" ? { author: n.author } : {}),
    ...(n.customer_note ? { customer: true } : {}),
  });
  notesByOrder.set(n.order_id, list);
}
const refundsByOrder = new Map();
for (const r of raw.refunds ?? []) {
  const list = refundsByOrder.get(r.order_id) ?? [];
  list.push({ date: r.date_created, amount: money(r.amount), ...(r.reason ? { reason: r.reason } : {}) });
  refundsByOrder.set(r.order_id, list);
}

const orders = (raw.orders ?? [])
  .map((o) => {
    const billing = addr(o.billing);
    const ship = addr(o.shipping);
    const subtotal = (o.line_items ?? []).reduce((s, li) => s + Number(li.subtotal || 0), 0);
    return {
      id: o.id,
      number: String(o.number ?? o.id),
      status: o.status,
      date: o.date_created,
      ...(o.date_paid ? { paid: o.date_paid } : {}),
      total: money(o.total),
      subtotal: money(subtotal),
      shipping: money(o.shipping_total),
      discount: money(o.discount_total),
      tax: money(o.total_tax),
      payment: o.payment_method_title || o.payment_method || "",
      ...(o.transaction_id ? { transaction: o.transaction_id } : {}),
      ...(o.created_via ? { via: o.created_via } : {}),
      name: billing.name || ship.name,
      email: (o.billing?.email || "").trim(),
      phone: (o.billing?.phone || o.shipping?.phone || "").trim(),
      billing,
      ship: ship.line1 || ship.name ? ship : billing,
      items: (o.line_items ?? []).map((li) => ({
        name: li.name,
        ...(li.sku ? { sku: li.sku } : {}),
        qty: Number(li.quantity || 0),
        total: money(li.total),
        ...(li.meta_data?.length
          ? {
              variation: li.meta_data
                .filter((m) => !String(m.key).startsWith("_"))
                .map((m) => `${m.display_key ?? m.key}: ${m.display_value ?? m.value}`)
                .join(", "),
            }
          : {}),
      })),
      coupons: (o.coupon_lines ?? []).map((c) => c.code),
      ...(o.customer_note ? { customerNote: o.customer_note } : {}),
      notes: (notesByOrder.get(o.id) ?? []).sort((a, b) => a.date.localeCompare(b.date)),
      refunds: refundsByOrder.get(o.id) ?? [],
      _customerId: o.customer_id || 0,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

// Customers = everyone who placed an order, keyed by email, enriched with the
// WordPress account when one exists. Registered users with no orders are kept
// only in the raw backup / spreadsheet (most are bot sign-ups).
const usersById = new Map((raw.customers ?? []).map((u) => [u.id, u]));
const usersByEmail = new Map((raw.customers ?? []).map((u) => [String(u.email || "").toLowerCase(), u]));
const customers = new Map();
for (const o of orders) {
  const key = o.email ? o.email.toLowerCase() : `order-${o.id}`;
  let c = customers.get(key);
  const user = (o._customerId && usersById.get(o._customerId)) || usersByEmail.get(key);
  if (!c) {
    c = {
      key,
      name: o.name || (user ? [user.first_name, user.last_name].filter(Boolean).join(" ") : ""),
      email: o.email,
      phone: o.phone,
      address: o.billing.line1 ? o.billing : o.ship.line1 ? o.ship : undefined,
      ...(user ? { userId: user.id, username: user.username, registered: user.date_created } : {}),
      orderIds: [],
      orderCount: 0,
      spent: 0,
      first: o.date,
      last: o.date,
    };
    customers.set(key, c);
  }
  c.orderIds.push(o.id);
  if (!["cancelled", "failed", "pending"].includes(o.status)) {
    c.orderCount += 1;
    c.spent += Number(o.total) - (o.refunds ?? []).reduce((s, r) => s + Number(r.amount), 0);
  }
  if (o.date < c.first) c.first = o.date;
  if (o.date > c.last) c.last = o.date;
  if (!c.phone && o.phone) c.phone = o.phone;
  if (!c.name && o.name) c.name = o.name;
}
for (const c of customers.values()) c.spent = Number(c.spent.toFixed(2));
for (const o of orders) delete o._customerId;

const archive = {
  generatedAt: new Date().toISOString(),
  source: "dramaticsnyc.com WooCommerce export",
  orders,
  customers: [...customers.values()].sort((a, b) => b.last.localeCompare(a.last)),
};

const plain = Buffer.from(JSON.stringify(archive), "utf8");
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
const tag = cipher.getAuthTag();
const out = Buffer.concat([iv, tag, enc]).toString("base64");

mkdirSync(join(root, "src/data"), { recursive: true });
writeFileSync(
  join(root, "src/data/archive.enc.ts"),
  `// Generated by scripts/build-archive.mjs on ${archive.generatedAt}. AES-256-GCM; key in ARCHIVE_KEY.\n// ${orders.length} orders, ${archive.customers.length} customers.\nexport const ARCHIVE_ENC =\n  "${out}";\n`
);
console.log(`archive: ${orders.length} orders, ${archive.customers.length} customers, ${(plain.length / 1e6).toFixed(2)} MB plain → src/data/archive.enc.ts`);
