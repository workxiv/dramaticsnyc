import { redirect } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { adminConfig, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  wrong: "That password isn't right.",
  slow: "Too many attempts. Wait 15 minutes and try again.",
  unconfigured: "The staff area isn't set up yet (ADMIN_PASSWORD / ARCHIVE_KEY missing).",
};

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (await isAdmin()) redirect("/admin/orders");
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? ERRORS[sp.error] : null;
  const next = typeof sp.next === "string" ? sp.next : "";
  const configured = Boolean(adminConfig());

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="card-soft w-full max-w-sm border border-ink/10 bg-paper p-8 sm:p-10">
        <BrandLogo className="h-6 w-auto" />
        <p className="eyebrow mt-8 text-coral">Staff only</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">Online orders</h1>
        <p className="mt-2 text-sm text-ink-soft">
          New shop orders as they come in, plus every order and customer from
          the old website (2019 to 2026). Search by order number, name, email
          or phone.
        </p>
        <form method="post" action="/api/admin/login" className="mt-6 space-y-3">
          {next && <input type="hidden" name="next" value={next} />}
          <label className="block">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-mute">
              Password
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              autoFocus
              className="mt-1.5 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-base outline-none focus:border-ink"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!configured}
            className="btn-pill w-full py-3.5 text-sm disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
