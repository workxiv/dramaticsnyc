import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { STATUS_TONE, fmtDate, usd } from "@/components/admin/format";
import { isAdmin } from "@/lib/admin-auth";
import { STATUS_LABEL, loadArchive, searchOrders } from "@/lib/archive";
import { loadCombined } from "@/lib/square-orders";

export const dynamic = "force-dynamic";

const PAGE = 50;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isAdmin())) redirect("/admin?next=/admin/orders");
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : "";
  const status = typeof sp.status === "string" ? sp.status : "all";
  const page = Math.max(1, Number(sp.page) || 1);

  const archive = await loadCombined(loadArchive());
  const liveCount = archive.orders.filter((o) => o.source === "square").length;
  const results = searchOrders(archive, q, status);
  const shown = results.slice((page - 1) * PAGE, page * PAGE);
  const pages = Math.max(1, Math.ceil(results.length / PAGE));
  const href = (p: number) =>
    `/admin/orders?${new URLSearchParams({ ...(q ? { q } : {}), ...(status !== "all" ? { status } : {}), page: String(p) })}`;

  const statuses = Object.entries(
    archive.orders.reduce<Record<string, number>>((a, o) => ((a[o.status] = (a[o.status] ?? 0) + 1), a), {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <AdminShell active="orders">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Orders</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {archive.orders.length.toLocaleString()} orders, {fmtDate(archive.orders.at(-1)!.date)} to{" "}
            {fmtDate(archive.orders[0].date)}. {liveCount} new order{liveCount === 1 ? "" : "s"} from the new
            shop (Square), the rest from the old website.
          </p>
        </div>
      </div>

      <form method="get" className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Order #, name, email, phone, product, SKU, zip…"
          className="min-h-11 flex-1 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-base outline-none focus:border-ink"
        />
        <select
          name="status"
          defaultValue={status}
          className="min-h-11 rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-sm"
        >
          <option value="all">All statuses</option>
          {statuses.map(([s, n]) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s] ?? s} ({n})
            </option>
          ))}
        </select>
        <button type="submit" className="btn-pill min-h-11 px-6 py-2.5 text-sm">
          Search
        </button>
      </form>

      <p className="mt-4 text-sm text-ink-mute">
        {results.length.toLocaleString()} result{results.length === 1 ? "" : "s"}
        {q ? ` for “${q}”` : ""}
      </p>

      <div className="card-soft mt-3 overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {shown.map((o) => (
              <tr key={o.id} className="hover:bg-cream/70">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-coral">
                    #{o.number}
                  </Link>
                  {o.source === "square" && (
                    <span className="ml-2 rounded-full bg-coral px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-paper">
                      New
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{fmtDate(o.date)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-coral">
                    {o.name || "(no name)"}
                  </Link>
                  <div className="text-xs text-ink-mute">{o.email}</div>
                </td>
                <td className="max-w-[320px] px-4 py-3 text-ink-soft">
                  {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] ${STATUS_TONE[o.status] ?? "bg-ink/10"}`}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">{usd(o.total)}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-mute">
                  Nothing matches. Try part of a name, the email, or the last 4 digits of the phone.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink-mute">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={href(page - 1)} className="btn-pill-outline px-4 py-2 text-xs">
                ← Newer
              </Link>
            )}
            {page < pages && (
              <Link href={href(page + 1)} className="btn-pill-outline px-4 py-2 text-xs">
                Older →
              </Link>
            )}
          </div>
        </nav>
      )}
    </AdminShell>
  );
}
