import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { STATUS_TONE, fmtDate, usd } from "@/components/admin/format";
import { isAdmin } from "@/lib/admin-auth";
import { STATUS_LABEL, customerByKey, loadArchive } from "@/lib/archive";
import { loadCombined } from "@/lib/square-orders";

export const dynamic = "force-dynamic";

export default async function CustomerDetail({ params }: { params: Promise<{ key: string }> }) {
  const { key: rawKey } = await params;
  const key = decodeURIComponent(rawKey);
  if (!(await isAdmin())) redirect(`/admin?next=/admin/customers/${encodeURIComponent(key)}`);
  const archive = await loadCombined(loadArchive());
  const c = customerByKey(archive, key);
  if (!c) notFound();
  const ids = new Set(c.orderIds.map(String));
  const orders = archive.orders.filter((o) => ids.has(String(o.id)));
  const a = c.address;

  return (
    <AdminShell active="customers">
      <Link href="/admin/customers" className="text-sm text-ink-mute hover:text-ink">
        ← All customers
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">{c.name || "(no name)"}</h1>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {c.email && <a href={`mailto:${c.email}`} className="text-coral hover:underline">{c.email}</a>}
        {c.phone && <a href={`tel:${c.phone}`} className="text-coral hover:underline">{c.phone}</a>}
        {c.username && <span className="text-ink-mute">account “{c.username}”{c.registered ? `, since ${fmtDate(c.registered)}` : ""}</span>}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card-soft border border-ink/10 bg-paper p-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">Orders</p>
          <p className="mt-1 font-display text-2xl font-semibold">{c.orderCount}</p>
        </div>
        <div className="card-soft border border-ink/10 bg-paper p-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">Lifetime spend</p>
          <p className="mt-1 font-display text-2xl font-semibold">{usd(c.spent)}</p>
        </div>
        <div className="card-soft border border-ink/10 bg-paper p-5">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">Customer since</p>
          <p className="mt-1 font-display text-2xl font-semibold">{fmtDate(c.first)}</p>
        </div>
      </div>

      {a && (
        <section className="card-soft mt-6 border border-ink/10 bg-paper p-6 text-sm">
          <h2 className="font-display text-xl font-semibold">Address</h2>
          <p className="mt-3 leading-relaxed">
            {[a.line1, a.line2, [a.city, a.state].filter(Boolean).join(", ") + (a.zip ? ` ${a.zip}` : "")]
              .filter((l) => l && l.trim())
              .map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
          </p>
        </section>
      )}

      <section className="card-soft mt-6 overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-cream/70">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-coral">#{o.number}</Link>
                  {o.source === "square" && (
                    <span className="ml-2 rounded-full bg-coral px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-paper">New</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{fmtDate(o.date)}</td>
                <td className="px-4 py-3 text-ink-soft">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] ${STATUS_TONE[o.status] ?? "bg-ink/10"}`}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">{usd(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
