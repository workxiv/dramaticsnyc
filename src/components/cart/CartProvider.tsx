"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  SHIPPING_CENTS,
  findVariant,
  lineKey,
  type CartProduct,
  type ShopProduct,
  type ShopVariant,
} from "@/lib/shop";

export type CartLine = {
  productId: number;
  variantId: number;
  quantity: number;
};

export type ResolvedLine = CartLine & {
  key: string;
  product: ShopProduct;
  variant: ShopVariant;
  lineCents: number;
};

type CartState = {
  lines: ResolvedLine[];
  count: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  isOpen: boolean;
  hydrated: boolean;
  add: (product: CartProduct, variant: ShopVariant, qty?: number) => void;
  setQuantity: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "dnyc-cart-v1";
const MAX_QTY = 20;
const EMPTY: CartLine[] = [];

/* ---------- tiny localStorage-backed external store ---------- */

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): CartLine[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (l): l is CartLine =>
        l &&
        Number.isInteger(l.productId) &&
        Number.isInteger(l.variantId) &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0
    );
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  if (cache === null) {
    try {
      cache = parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = parse(e.newValue);
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: CartLine[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable; cart lives in memory for this page */
  }
  listeners.forEach((l) => l());
}

/* ------------------------------------------------------------- */

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const [isOpen, setIsOpen] = useState(false);

  const lines = useMemo<ResolvedLine[]>(
    () =>
      raw.flatMap((l) => {
        const hit = findVariant(l.productId, l.variantId);
        if (!hit) return [];
        return [
          {
            ...l,
            key: lineKey(l.productId, l.variantId),
            product: hit.product,
            variant: hit.variant,
            lineCents: hit.variant.cents * l.quantity,
          },
        ];
      }),
    [raw]
  );

  const add = useCallback(
    (product: CartProduct, variant: ShopVariant, qty = 1) => {
      const key = lineKey(product.id, variant.id);
      const prev = getSnapshot();
      const existing = prev.find((l) => lineKey(l.productId, l.variantId) === key);
      write(
        existing
          ? prev.map((l) =>
              lineKey(l.productId, l.variantId) === key
                ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) }
                : l
            )
          : [
              ...prev,
              { productId: product.id, variantId: variant.id, quantity: Math.min(MAX_QTY, qty) },
            ]
      );
      setIsOpen(true);
    },
    []
  );

  const setQuantity = useCallback((key: string, qty: number) => {
    const prev = getSnapshot();
    write(
      qty <= 0
        ? prev.filter((l) => lineKey(l.productId, l.variantId) !== key)
        : prev.map((l) =>
            lineKey(l.productId, l.variantId) === key
              ? { ...l, quantity: Math.min(MAX_QTY, qty) }
              : l
          )
    );
  }, []);

  const remove = useCallback((key: string) => setQuantity(key, 0), [setQuantity]);
  const clear = useCallback(() => write(EMPTY), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const subtotalCents = lines.reduce((s, l) => s + l.lineCents, 0);
  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const shippingCents = lines.length ? SHIPPING_CENTS : 0;

  const value: CartState = {
    lines,
    count,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    isOpen,
    hydrated,
    add,
    setQuantity,
    remove,
    clear,
    open,
    close,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
