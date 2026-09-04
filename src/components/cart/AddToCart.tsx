"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { CartProduct } from "@/lib/shop";

/**
 * Add-to-cart control for a product card. Products with size options
 * show a size picker first; single-size products add straight away.
 */
export default function AddToCart({
  product,
  compact = false,
}: {
  product: CartProduct;
  compact?: boolean;
}) {
  const { add } = useCart();
  const purchasable = product.variants.filter((v) => v.inStock);
  const [variantId, setVariantId] = useState<number>(
    purchasable[0]?.id ?? product.variants[0]?.id
  );
  const [justAdded, setJustAdded] = useState(false);

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  if (!variant || purchasable.length === 0) {
    return (
      <span className="rounded-full border border-ink/15 px-5 py-2.5 text-[0.8rem] font-semibold text-ink-mute">
        Sold out
      </span>
    );
  }

  const onAdd = () => {
    add(product, variant);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      {product.hasOptions && (
        <div
          className="flex flex-wrap gap-1.5"
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
                className={`rounded-full border px-3 py-1 text-[0.72rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink-soft hover:border-ink/40"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      )}
      <div
        className={`flex items-center justify-between gap-3 ${
          compact ? "" : "lg:gap-3"
        }`}
      >
        <span className="whitespace-nowrap font-display text-lg font-semibold text-coral">
          {variant.price}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="btn-pill whitespace-nowrap px-5 py-2.5 text-[0.8rem]"
          aria-live="polite"
        >
          {justAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
