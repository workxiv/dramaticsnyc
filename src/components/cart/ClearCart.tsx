"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

/** Empties the bag once the shopper lands on the order confirmation page. */
export default function ClearCart() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);
  return null;
}
