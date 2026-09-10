import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const TABS = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminShell({
  active,
  children,
}: {
  active: "orders" | "customers";
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-5">
            <Link href="/admin/orders" aria-label="Staff home">
              <BrandLogo className="h-5 w-auto" />
            </Link>
            <span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-mute sm:inline">
              Staff · Online orders
            </span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-full px-4 py-2 font-semibold transition-colors ${
                  active === t.label.toLowerCase()
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-ink/5"
                }`}
              >
                {t.label}
              </Link>
            ))}
            <a
              href="https://app.squareup.com/dashboard/orders"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-4 py-2 font-semibold text-ink-soft hover:bg-ink/5"
            >
              Square (new orders) ↗
            </a>
            <form method="post" action="/api/admin/logout">
              <button
                type="submit"
                className="rounded-full border border-ink/15 px-4 py-2 font-semibold text-ink-soft hover:border-ink/40"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8">{children}</main>
    </>
  );
}
