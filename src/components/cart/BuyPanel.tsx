"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { SHIPPING_CENTS, formatMoney, type CartProduct } from "@/lib/shop";

/**
 * Product-page purchase panel: size picker, quantity, price, add to bag.
 */
export default function BuyPanel({ product }: { product: CartProduct }) {
  const { add, open } = useCart();
  const purchasable = product.variants.filter((v) => v.inStock);
  const [variantId, setVariantId] = useState<number>(
    purchasable[0]?.id ?? product.variants[0]?.id
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  if (!variant || purchasable.length === 0) {
    return (
      <div className="card-soft border border-ink/10 bg-paper p-6">
        <p className="font-display text-xl font-semibold">Currently sold out</p>
        <p className="mt-2 text-sm text-ink-soft">
          Ask at any Dramatics NYC salon, or check back soon.
        </p>
      </div>
    );
  }

  const onAdd = () => {
    add(product, variant, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="card-soft border border-ink/10 bg-paper p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-3xl font-semibold text-coral">
          {variant.price}
        </span>
        {variant.label && (
          <span className="text-sm text-ink-mute">{variant.label}</span>
        )}
      </div>

      {product.hasOptions && (
        <div className="mt-5">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink-mute">
            Size
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label={`${product.name} size`}
          >
            {product.variants.map((v) => {
              const active = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={!v.inStock}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-ink-soft hover:border-ink/40"
                  }`}
                >
                  {v.label}
                  <span className={`ml-2 ${active ? "text-paper/70" : "text-ink-mute"}`}>
                    {v.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-ink/15">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-11 w-11 text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="h-11 w-11 text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="btn-pill flex-1 py-3.5 text-sm"
        >
          {added ? "Added to bag ✓" : "Add to Bag"}
        </button>
      </div>

      {added && (
        <button
          type="button"
          onClick={open}
          className="mt-3 w-full text-center text-sm font-semibold text-coral underline-offset-4 hover:underline"
        >
          View bag & checkout →
        </button>
      )}

      <ul className="mt-5 space-y-1.5 border-t border-ink/10 pt-4 text-xs text-ink-mute">
        <li>Flat-rate US shipping {formatMoney(SHIPPING_CENTS)}, secure checkout by Square.</li>
        <li>Also available at all five Dramatics NYC salons.</li>
        {variant.sku && <li>SKU {variant.sku}</li>}
      </ul>
    </div>
  );
}
