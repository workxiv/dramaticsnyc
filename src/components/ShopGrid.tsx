"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  buyUrl,
  type ShopProduct,
} from "@/lib/shop";

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
      <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-white">
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
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {p.name}
          </h3>
        </div>
        {p.rating ? (
          <div className="mt-2">
            <Stars rating={p.rating} count={p.reviewCount} />
          </div>
        ) : null}
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
          {p.blurb}
        </p>
        <div className="mt-4 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
          <span className="whitespace-nowrap font-display text-lg font-semibold text-coral">
            {p.priceRange ?? p.price}
          </span>
          <a
            href={buyUrl(p)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill w-full whitespace-nowrap px-5 py-2.5 text-[0.8rem] lg:w-auto"
          >
            {p.hasOptions ? "Choose Size" : "Add to Cart"}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopGrid() {
  const [category, setCategory] = useState("All");
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
