import { escapeHtml } from "./email";
import { formatMoney } from "./shop";
import type { SquareAddress, SquareOrder } from "./square";

type Payment = {
  id: string;
  order_id?: string;
  amount_money?: { amount: number; currency: string };
  buyer_email_address?: string;
  shipping_address?: SquareAddress & { first_name?: string; last_name?: string };
  billing_address?: SquareAddress & { first_name?: string; last_name?: string };
  card_details?: { card?: { card_brand?: string; last_4?: string } };
  source_type?: string;
  created_at?: string;
};

const DASHBOARD_ORDER = (id: string) =>
  `https://app.squareup.com/dashboard/orders/overview/${encodeURIComponent(id)}`;

function addressLines(a?: SquareAddress & { first_name?: string; last_name?: string }) {
  if (!a) return [];
  const name = [a.first_name, a.last_name].filter(Boolean).join(" ");
  const cityLine = [a.locality, a.administrative_district_level_1].filter(Boolean).join(", ");
  return [
    name,
    a.address_line_1,
    a.address_line_2,
    [cityLine, a.postal_code].filter(Boolean).join(" "),
    a.country && a.country !== "US" ? a.country : undefined,
  ].filter((l): l is string => Boolean(l && l.trim()));
}

function longDate(iso?: string) {
  return new Date(iso ?? Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

/**
 * Build the "You've got a new order" email in the style the salon got from
 * WooCommerce: order number, items with SKU, totals, addresses, contact.
 */
export function buildNewOrderEmail(order: SquareOrder, payment: Payment) {
  const recipient = order.fulfillments?.find((f) => f.shipment_details?.recipient)
    ?.shipment_details?.recipient;
  const shipAddr = recipient?.address ?? payment.shipping_address;
  const shipName =
    recipient?.display_name ||
    [payment.shipping_address?.first_name, payment.shipping_address?.last_name]
      .filter(Boolean)
      .join(" ") ||
    [payment.billing_address?.first_name, payment.billing_address?.last_name]
      .filter(Boolean)
      .join(" ");
  const email = recipient?.email_address || payment.buyer_email_address || "";
  const phone = recipient?.phone_number || "";
  const orderNo = order.reference_id || order.id.slice(0, 8).toUpperCase();
  const customer = shipName || email || "a customer";

  const items = (order.line_items ?? []).map((li) => {
    const sku = li.note?.replace(/^SKU\s+/i, "");
    return {
      name: li.variation_name ? `${li.name} - ${li.variation_name}` : li.name,
      sku: sku && sku !== li.note ? sku : undefined,
      qty: li.quantity,
      total: li.total_money ? formatMoney(li.total_money.amount) : "",
    };
  });

  const subtotalCents = (order.line_items ?? []).reduce(
    (s, li) => s + (li.total_money?.amount ?? 0),
    0
  );
  const shipping = (order.service_charges ?? []).map((c) => ({
    name: c.name || "Shipping",
    total: c.total_money ? formatMoney(c.total_money.amount) : "",
  }));
  const rows: Array<[string, string]> = [["Subtotal:", formatMoney(subtotalCents)]];
  for (const s of shipping) rows.push([`${s.name}:`, s.total]);
  if (order.total_discount_money?.amount) rows.push(["Discount:", `-${formatMoney(order.total_discount_money.amount)}`]);
  if (order.total_tax_money?.amount) rows.push(["Tax:", formatMoney(order.total_tax_money.amount)]);
  const card = payment.card_details?.card;
  rows.push([
    "Payment method:",
    card ? `${card.card_brand ?? "Card"} ending ${card.last_4 ?? ""}`.trim() : payment.source_type || "Square",
  ]);
  const total = order.total_money ? formatMoney(order.total_money.amount) : payment.amount_money ? formatMoney(payment.amount_money.amount) : "";
  rows.push(["Total:", total]);

  const ship = addressLines({ ...shipAddr, first_name: undefined, last_name: undefined });
  if (shipName) ship.unshift(shipName);
  const bill = addressLines(payment.billing_address);

  const subject = `[Dramatics NYC]: You've got a new order: #${orderNo}`;

  const text = [
    `New order: #${orderNo}`,
    `You've received a new order from ${customer}:`,
    "",
    `Order #${orderNo} (${longDate(order.created_at ?? payment.created_at)})`,
    ...items.map((i) => `${i.qty} x ${i.name}${i.sku ? ` (#${i.sku})` : ""}  ${i.total}`),
    "",
    ...rows.map(([k, v]) => `${k} ${v}`),
    "",
    ship.length ? `Ship to:\n${ship.join("\n")}` : "",
    email ? `Email: ${email}` : "",
    phone ? `Phone: ${phone}` : "",
    "",
    `View in Square: ${DASHBOARD_ORDER(order.id)}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  const td = 'style="padding:10px 12px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#3c3c3c;vertical-align:top"';
  const tdTotal = 'style="padding:12px;font-size:16px;font-weight:700;color:#3c3c3c"';
  const html = `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#3c3c3c">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;padding:32px">
<tr><td>
<p style="margin:0 0 20px;font-size:22px;color:#56c9c1">Dramatics NYC</p>
<h1 style="margin:0 0 12px;font-size:26px;color:#3c3c3c">New order: #${escapeHtml(orderNo)}</h1>
<p style="margin:0 0 28px;font-size:15px;color:#666">You&rsquo;ve received a new order from ${escapeHtml(customer)}:</p>
<h2 style="margin:0 0 4px;font-size:18px">Order summary</h2>
<p style="margin:0 0 16px;font-size:14px"><a href="${DASHBOARD_ORDER(order.id)}" style="color:#56c9c1;text-decoration:none">Order #${escapeHtml(orderNo)}</a> (${escapeHtml(longDate(order.created_at ?? payment.created_at))})</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
<tr><th align="left" ${td.replace("color:#3c3c3c", "color:#666;font-weight:600")}>Product</th><th align="right" ${td.replace("color:#3c3c3c", "color:#666;font-weight:600")}>Quantity</th><th align="right" ${td.replace("color:#3c3c3c", "color:#666;font-weight:600")}>Price</th></tr>
${items
  .map(
    (i) => `<tr><td ${td}>${escapeHtml(i.name)}${i.sku ? `<br><span style="color:#888;font-size:13px">(#${escapeHtml(i.sku)})</span>` : ""}</td><td align="right" ${td}>&times;${escapeHtml(i.qty)}</td><td align="right" ${td}>${escapeHtml(i.total)}</td></tr>`
  )
  .join("")}
${rows
  .map(([k, v], idx) => {
    const cell = idx === rows.length - 1 ? tdTotal : td;
    return `<tr><td colspan="2" align="right" ${cell}>${escapeHtml(k)}</td><td align="right" ${cell}>${escapeHtml(v)}</td></tr>`;
  })
  .join("")}
</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px"><tr>
<td width="50%" valign="top" style="font-size:14px;line-height:1.5">
<h3 style="margin:0 0 8px;font-size:16px">Shipping address</h3>
${ship.length ? ship.map(escapeHtml).join("<br>") : '<span style="color:#888">No shipping address on the order</span>'}
</td>
<td width="50%" valign="top" style="font-size:14px;line-height:1.5">
<h3 style="margin:0 0 8px;font-size:16px">Customer</h3>
${bill.length ? bill.map(escapeHtml).join("<br>") + "<br>" : ""}
${email ? `<a href="mailto:${escapeHtml(email)}" style="color:#56c9c1">${escapeHtml(email)}</a><br>` : ""}
${phone ? `<a href="tel:${escapeHtml(phone)}" style="color:#56c9c1">${escapeHtml(phone)}</a>` : ""}
</td></tr></table>
<p style="margin:28px 0 0;font-size:13px;color:#888">Paid via Square. <a href="${DASHBOARD_ORDER(order.id)}" style="color:#56c9c1">Open this order in the Square Dashboard</a> to print a packing slip or mark it shipped.</p>
</td></tr></table>
</td></tr></table></body></html>`;

  return { subject, html, text, replyTo: email || undefined };
}
