import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ClearCart from "@/components/cart/ClearCart";
import { retrieveOrder } from "@/lib/square";
import { formatMoney } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const rawOrderId = typeof sp.orderId === "string" ? sp.orderId : "";
  // Square order ids are URL-safe tokens; ignore anything else before it
  // reaches the Square API or the page.
  const orderId = /^[A-Za-z0-9_-]{8,64}$/.test(rawOrderId) ? rawOrderId : null;
  const order = orderId ? await retrieveOrder(orderId) : null;
  const paid = order ? order.state === "COMPLETED" || (order.tenders?.length ?? 0) > 0 : false;

  return (
    <>
      <ClearCart />
      <Nav />
      <main className="bg-cream pt-28 sm:pt-36">
        <div className="mx-auto max-w-2xl px-5 pb-24 sm:px-8">
          <div className="card-soft bg-sage p-8 text-center sm:p-12">
            <p className="eyebrow text-coral">DNYC Shop</p>
            <h1 className="heading-fluid mt-5 font-display font-medium text-balance">
              Thank you!
            </h1>
            <p className="mx-auto mt-5 max-w-md text-ink-soft sm:text-lg">
              {paid
                ? "Your order is confirmed. A receipt from Square is on its way to your inbox."
                : "Your payment is being processed. You'll get a receipt from Square by email."}
            </p>
            {order?.line_items?.length ? (
              <ul className="mx-auto mt-8 max-w-md divide-y divide-ink/10 rounded-2xl bg-paper px-5 text-left text-sm">
                {order.line_items.map((li, i) => (
                  <li key={i} className="flex justify-between gap-4 py-3">
                    <span>
                      {li.quantity} × {li.name}
                      {li.variation_name ? (
                        <span className="text-ink-mute"> · {li.variation_name}</span>
                      ) : null}
                    </span>
                    {li.total_money ? (
                      <span className="whitespace-nowrap">{formatMoney(li.total_money.amount)}</span>
                    ) : null}
                  </li>
                ))}
                {order.total_money ? (
                  <li className="flex justify-between py-3 font-semibold">
                    <span>Total</span>
                    <span>{formatMoney(order.total_money.amount)}</span>
                  </li>
                ) : null}
              </ul>
            ) : null}
            {orderId ? (
              <p className="mt-6 text-xs text-ink-mute">Order reference: {orderId}</p>
            ) : null}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/shop" className="btn-pill px-7 py-3.5 text-sm">
                Keep Shopping
              </Link>
              <Link href="/book" className="btn-pill-outline px-7 py-3.5 text-sm">
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
