import snapshot from "./products-snapshot.json";

export type ShopVariant = {
  /** WooCommerce variation id (or product id for single-size products). */
  id: number;
  /** Size label like "8 oz", or null for single-size products. */
  label: string | null;
  /** Price in US cents. */
  cents: number;
  /** Display price like "$16.95". */
  price: string;
  sku: string | null;
  inStock: boolean;
};

export type ShopProduct = {
  id: number;
  name: string;
  category: string;
  price: string;
  priceRange: string | null;
  /** Lowest price in cents. */
  cents: number;
  sku: string | null;
  rating: number | null;
  reviewCount: number;
  blurb: string;
  hasOptions: boolean;
  inStock: boolean;
  permalink: string;
  image: string;
  remoteImage: string | null;
  variants: ShopVariant[];
};

export const SHOP_PRODUCTS = snapshot as ShopProduct[];

export const SHOP_CATEGORIES = [
  "All",
  ...Array.from(new Set(SHOP_PRODUCTS.map((p) => p.category))).sort(),
];

/**
 * Gift cards. Square eGift cards are sold from a Square-hosted page;
 * set NEXT_PUBLIC_GIFT_CARDS_URL to that link once it's created in the
 * Square Dashboard (Gift Cards → eGift Cards → Online).
 */
export const GIFT_CARDS_URL =
  process.env.NEXT_PUBLIC_GIFT_CARDS_URL ||
  "https://dramaticsnyc.com/shop/giftcards/";

/** Flat-rate shipping, in cents, applied to every order. */
export const SHIPPING_CENTS = 795;
export const SHIPPING_LABEL = "Flat rate shipping";

export const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** Stable key for a product+variant pair, used as the cart line id. */
export const lineKey = (productId: number, variantId: number) =>
  `${productId}:${variantId}`;

export function findVariant(productId: number, variantId: number) {
  const product = SHOP_PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return null;
  return { product, variant };
}

/** Best sellers shown on the homepage. */
const FEATURED_IDS = [38403, 21989, 21984, 42263];

export const FEATURED_PRODUCTS = FEATURED_IDS.map(
  (id) => SHOP_PRODUCTS.find((p) => p.id === id)
).filter((p): p is ShopProduct => Boolean(p));
