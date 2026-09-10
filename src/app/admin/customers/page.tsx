import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { fmtDate, usd } from "@/components/admin/format";
import { isAdmin } from "@/lib/admin-auth";
import { loadArchive, searchCustomers } from "@/lib/archive";
import { loadCombined } from "@/lib/square-orders";

export const dynamic = "force-dynamic";

const PAGE = 50;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isAdmin())) redirect("/admin?next=/admin/customers");
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : "";
  const sort = sp.sort === "spent" ? "spent" : sp.sort === "name" ? "name" : "last";
  const page = Math.max(1, Number(sp.page) || 1);

  const archive = await loadCombined(loadArchive());
  const results = [...searchCustomers(archive, q)].sort((a, b) =>
    sort === "spent" ? b.spent - a.spent : sort === "name" ? a.name.localeCompare(b.name) : b.last.localeCompare(a.last)
  );
  const shown = results.slice((page - 1) * PAGE, page * PAGE);
  const pages = Math.max(1, Math.ceil(results.length / PAGE));
  const href = (p: number) =>
    `/admin/customers?${new URLSearchParams({ ...(q ? { q } : {}), sort, page: String(p) })}`;

  return (
    <AdminShell active="customers">
      <h1 className="font-display text-3xl font-semibold">Customers</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {archive.customers.length.toLocaleString()} people who ordered online, old shop and new. Contact
        details come from their most recent order.
      </p>

      <form method="get" className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Name, email, phone, zip…"
          className="min-h-11 flex-1 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-base outline-none focus:border-ink"
        />
        <select name="sort" defaultValue={sort} className="min-h-11 rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-sm">
          <option value="last">Most recent order</option>
          <option value="spent">Lifetime spend</option>
          <option value="name">Name A to Z</option>
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
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink-mute">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Spent</th>
              <th className="px-4 py-3">Last order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {shown.map((c) => (
              <tr key={c.key} className="hover:bg-cream/70">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${encodeURIComponent(c.key)}`} className="font-medium hover:text-coral">
                    {c.name || "(no name)"}
                  </Link>
                  <div className="text-xs text-ink-mute">{c.email}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{c.phone}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {c.address ? [c.address.city, c.address.state].filter(Boolean).join(", ") : ""}
                </td>
                <td className="px-4 py-3 text-right">{c.orderCount}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">{usd(c.spent)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{fmtDate(c.last)}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-mute">
                  No customer matches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink-mute">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={href(page - 1)} className="btn-pill-outline px-4 py-2 text-xs">← Prev</Link>}
            {page < pages && <Link href={href(page + 1)} className="btn-pill-outline px-4 py-2 text-xs">Next →</Link>}
          </div>
        </nav>
      )}
    </AdminShell>
  );
}
