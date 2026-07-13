import snapshot from "./products-snapshot.json";

export type ShopProduct = {
  id: number;
  name: string;
  category: string;
  price: string;
  priceRange: string | null;
  rating: number | null;
  reviewCount: number;
  blurb: string;
  hasOptions: boolean;
  inStock: boolean;
  permalink: string;
  image: string;
  remoteImage: string | null;
};

export const SHOP_PRODUCTS = snapshot as ShopProduct[];

export const SHOP_CATEGORIES = [
  "All",
  ...Array.from(new Set(SHOP_PRODUCTS.map((p) => p.category))).sort(),
];

export const GIFT_CARDS_URL = "https://dramaticsnyc.com/shop/giftcards/";

/**
 * Purchases run through the existing WooCommerce checkout.
 * Simple products go straight to the cart; products with size
 * options go to their product page to pick a size.
 */
export function buyUrl(p: ShopProduct): string {
  return p.hasOptions
    ? p.permalink
    : `https://dramaticsnyc.com/cart/?add-to-cart=${p.id}`;
}

/** Best sellers shown on the homepage. */
const FEATURED_IDS = [22682, 21989, 21984, 38403];

export const FEATURED_PRODUCTS = FEATURED_IDS.map(
  (id) => SHOP_PRODUCTS.find((p) => p.id === id)
).filter((p): p is ShopProduct => Boolean(p));
