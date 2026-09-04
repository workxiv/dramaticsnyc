"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { formatMoney, SHIPPING_LABEL, tintFor } from "@/lib/shop";

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close } = cart;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(
          data?.error || "We couldn't start checkout. Please try again."
        );
      }
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={cart.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-2xl font-semibold">
                Your bag{" "}
                {cart.count > 0 && (
                  <span className="text-base font-normal text-ink-mute">
                    ({cart.count})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={cart.close}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-lg"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-ink-soft">Your bag is empty.</p>
                  <Link
                    href="/shop"
                    onClick={cart.close}
                    className="btn-pill px-6 py-3 text-sm"
                  >
                    Shop DNYC Products
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-ink/10">
                  {cart.lines.map((l) => (
                    <li key={l.key} className="flex gap-4 py-4">
                      <div className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ${tintFor(l.product.category)}`}>
                        <Image
                          src={l.product.image}
                          alt={l.product.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-display text-base font-semibold leading-tight">
                              {l.product.name}
                            </p>
                            {l.variant.label && (
                              <p className="mt-0.5 text-xs text-ink-mute">
                                {l.variant.label}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => cart.remove(l.key)}
                            className="text-xs text-ink-mute underline-offset-2 hover:text-coral hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-ink/15">
                            <button
                              type="button"
                              onClick={() =>
                                cart.setQuantity(l.key, l.quantity - 1)
                              }
                              className="h-8 w-8 text-base"
                              aria-label={`Decrease ${l.product.name} quantity`}
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {l.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                cart.setQuantity(l.key, l.quantity + 1)
                              }
                              className="h-8 w-8 text-base"
                              aria-label={`Increase ${l.product.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                          <span className="font-semibold text-coral">
                            {formatMoney(l.lineCents)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.lines.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd>{formatMoney(cart.subtotalCents)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">{SHIPPING_LABEL}</dt>
                    <dd>{formatMoney(cart.shippingCents)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-semibold">
                    <dt>Total</dt>
                    <dd>{formatMoney(cart.totalCents)}</dd>
                  </div>
                </dl>
                {error && (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={checkout}
                  disabled={busy}
                  className="btn-pill mt-4 w-full py-4 text-sm disabled:opacity-60"
                >
                  {busy ? "Opening secure checkout…" : "Checkout"}
                </button>
                <p className="mt-3 text-center text-[0.7rem] text-ink-mute">
                  Secure payment by Square. Ships within the US.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
