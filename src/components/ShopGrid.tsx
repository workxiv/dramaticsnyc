"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  categoryHref,
  productPath,
  tintFor,
  toCartProduct,
  type ShopProduct,
} from "@/lib/shop";
import AddToCart from "./cart/AddToCart";

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(rating) ? "text-coral" : "text-ink/15"}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-ink-mute">
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}

function ProductCard({ p, index }: { p: ShopProduct; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.04 * (index % 8) }}
      className="group card-soft flex h-full flex-col border border-ink/8 bg-paper p-3"
    >
      <Link
        href={productPath(p)}
        className={`relative block aspect-square overflow-hidden rounded-[1.25rem] ${tintFor(p.category)}`}
        aria-label={`${p.name} details`}
      >
        <Image
          src={p.image}
          alt={`${p.name} — DNYC hair product`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] backdrop-blur">
          {p.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">
            <Link href={productPath(p)} className="hover:text-coral">
              {p.name}
            </Link>
          </h3>
        </div>
        {p.rating ? (
          <div className="mt-2">
            <Stars rating={p.rating} count={p.reviewCount} />
          </div>
        ) : null}
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {p.detail.tagline}
        </p>
        <div className="mt-4">
          <AddToCart product={toCartProduct(p)} />
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopGrid() {
  const router = useRouter();
  const params = useSearchParams();
  const fromUrl = params.get("category");
  // The URL is the source of truth, so links like /shop?category=Conditioners
  // (breadcrumbs, category badges, back button) land on the right filter.
  const category =
    fromUrl && SHOP_CATEGORIES.includes(fromUrl) ? fromUrl : "All";

  const setCategory = useCallback(
    (c: string) => router.replace(categoryHref(c), { scroll: false }),
    [router]
  );

  const shown =
    category === "All"
      ? SHOP_PRODUCTS
      : SHOP_PRODUCTS.filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {SHOP_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              category === c
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 bg-transparent text-ink-soft hover:border-ink/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        key={category}
        className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      >
        {shown.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </div>
  );
}
