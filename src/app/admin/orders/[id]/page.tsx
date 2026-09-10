import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { STATUS_TONE, fmtDate, usd } from "@/components/admin/format";
import { isAdmin } from "@/lib/admin-auth";
import { STATUS_LABEL, loadArchive, orderById, type ArchiveAddress } from "@/lib/archive";

export const dynamic = "force-dynamic";

function Address({ a }: { a: ArchiveAddress }) {
  const lines = [
    a.name,
    a.company,
    a.line1,
    a.line2,
    [a.city, a.state].filter(Boolean).join(", ") + (a.zip ? ` ${a.zip}` : ""),
    a.country && a.country !== "US" ? a.country : undefined,
  ].filter((l) => l && l.trim());
  if (!lines.length) return <p className="text-ink-mute">None on file</p>;
  return (
    <p className="leading-relaxed">
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </p>
  );
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isAdmin())) redirect(`/admin?next=/admin/orders/${encodeURIComponent(id)}`);
  const archive = loadArchive();
  const o = orderById(archive, Number(id));
  if (!o) notFound();
  const customerKey = o.email ? o.email.toLowerCase() : `order-${o.id}`;
  const customer = archive.customers.find((c) => c.key === customerKey);
  const refunded = o.refunds.reduce((s, r) => s + Number(r.amount), 0);

  return (
    <AdminShell active="orders">
      <Link href="/admin/orders" className="text-sm text-ink-mute hover:text-ink">
        ← All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold">Order #{o.number}</h1>
        <span className={`rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] ${STATUS_TONE[o.status] ?? "bg-ink/10"}`}>
          {STATUS_LABEL[o.status] ?? o.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Placed {fmtDate(o.date, true)}
        {o.paid ? ` · paid ${fmtDate(o.paid, true)}` : ""}
        {o.payment ? ` · ${o.payment}` : ""}
        {o.transaction ? ` · txn ${o.transaction}` : ""}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card-soft border border-ink/10 bg-paper p-6 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">Items</h2>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">
              <tr>
                <th className="py-2">Product</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {o.items.map((i, idx) => (
                <tr key={idx}>
                  <td className="py-3">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-ink-mute">
                      {[i.variation, i.sku ? `SKU ${i.sku}` : ""].filter(Boolean).join(" · ")}
                    </div>
                  </td>
                  <td className="py-3 text-right">{i.qty}</td>
                  <td className="py-3 text-right">{usd(i.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="mt-4 ml-auto max-w-xs space-y-1.5 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{usd(o.subtotal)}</dd></div>
            {Number(o.discount) > 0 && (
              <div className="flex justify-between"><dt className="text-ink-soft">Discount{o.coupons.length ? ` (${o.coupons.join(", ")})` : ""}</dt><dd>-{usd(o.discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd>{usd(o.shipping)}</dd></div>
            {Number(o.tax) > 0 && (
              <div className="flex justify-between"><dt className="text-ink-soft">Tax</dt><dd>{usd(o.tax)}</dd></div>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-semibold"><dt>Total</dt><dd>{usd(o.total)}</dd></div>
            {refunded > 0 && (
              <div className="flex justify-between text-coral"><dt>Refunded</dt><dd>-{usd(refunded)}</dd></div>
            )}
          </dl>
          {o.customerNote && (
            <div className="mt-5 rounded-xl bg-apricot/60 px-4 py-3 text-sm">
              <span className="font-semibold">Customer note:</span> {o.customerNote}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="card-soft border border-ink/10 bg-paper p-6 text-sm">
            <h2 className="font-display text-xl font-semibold">Customer</h2>
            <p className="mt-3 font-medium">{o.name || "(no name)"}</p>
            {o.email && <a href={`mailto:${o.email}`} className="block text-coral hover:underline">{o.email}</a>}
            {o.phone && <a href={`tel:${o.phone}`} className="block text-coral hover:underline">{o.phone}</a>}
            {customer && (
              <Link href={`/admin/customers/${encodeURIComponent(customer.key)}`} className="mt-3 inline-block text-xs font-semibold text-ink-soft underline-offset-2 hover:underline">
                {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"} · {usd(customer.spent)} lifetime →
              </Link>
            )}
          </section>
          <section className="card-soft border border-ink/10 bg-paper p-6 text-sm">
            <h2 className="font-display text-xl font-semibold">Ship to</h2>
            <div className="mt-3"><Address a={o.ship} /></div>
            {(o.billing.line1 !== o.ship.line1 || o.billing.name !== o.ship.name) && (
              <>
                <h3 className="mt-5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">Billing</h3>
                <div className="mt-2"><Address a={o.billing} /></div>
              </>
            )}
          </section>
        </div>
      </div>

      {(o.notes.length > 0 || o.refunds.length > 0) && (
        <section className="card-soft mt-6 border border-ink/10 bg-paper p-6 text-sm">
          <h2 className="font-display text-xl font-semibold">History</h2>
          <ul className="mt-4 space-y-3">
            {o.refunds.map((r, i) => (
              <li key={`r${i}`} className="flex gap-4">
                <span className="w-40 shrink-0 text-xs text-ink-mute">{fmtDate(r.date, true)}</span>
                <span className="text-coral">Refund {usd(r.amount)}{r.reason ? ` · ${r.reason}` : ""}</span>
              </li>
            ))}
            {o.notes.map((n, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-40 shrink-0 text-xs text-ink-mute">{fmtDate(n.date, true)}</span>
                <span className={n.customer ? "text-ink" : "text-ink-soft"}>
                  {n.customer && <span className="mr-2 rounded-full bg-apricot px-2 py-0.5 text-[0.6rem] font-bold uppercase">Sent to customer</span>}
                  {n.note}
                  {n.author && <span className="text-ink-mute"> · {n.author}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AdminShell>
  );
}
