"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartButton({ className = "" }: { className?: string }) {
  const { count, open, hydrated } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-ink/40 ${className}`}
      aria-label={`Open cart${count ? `, ${count} items` : ""}`}
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
      {hydrated && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[0.65rem] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
