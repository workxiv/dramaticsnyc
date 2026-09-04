import snapshot from "./products-snapshot.json";
import { PRODUCT_DETAILS, type ProductDetail } from "./product-details";

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
  /** Short description shown on cards (= detail.summary) */
  blurb: string;
  hasOptions: boolean;
  inStock: boolean;
  image: string;
  variants: ShopVariant[];
  /** URL segment under /shop/ */
  slug: string;
  /** Editorial content (tagline, how to use, ingredients…) */
  detail: ProductDetail;
};

type SnapshotProduct = Omit<ShopProduct, "slug" | "detail" | "blurb">;

/**
 * Bump whenever files in public/img/products change. Product image URLs carry
 * this as a query string so browsers and the image CDN fetch fresh copies
 * instead of serving a cached version under the same file name.
 */
export const PRODUCT_IMAGE_VERSION = "4";

/**
 * Catalog = pricing/stock/images from the WooCommerce snapshot, merged with
 * hand-written, CBD-free copy from product-details.ts (which wins for name
 * and blurb). Products without editorial content are hidden from the shop.
 */
export const SHOP_PRODUCTS: ShopProduct[] = (snapshot as SnapshotProduct[])
  .filter((p) => Boolean(PRODUCT_DETAILS[p.id]))
  .map((p) => {
    const detail = PRODUCT_DETAILS[p.id];
    return {
      ...p,
      name: detail.name,
      blurb: detail.summary,
      slug: detail.slug,
      image: `${p.image}?v=${PRODUCT_IMAGE_VERSION}`,
      detail,
    };
  });

export function productBySlug(slug: string) {
  return SHOP_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export const productPath = (p: Pick<ShopProduct, "slug">) => `/shop/${p.slug}`;

/** /shop filtered to a category ("All" → plain /shop). */
export const categoryHref = (category: string) =>
  category === "All"
    ? "/shop"
    : `/shop?category=${encodeURIComponent(category)}`;

/** Pastel backdrop per category, used behind product cutouts. */
export const CATEGORY_TINT: Record<string, string> = {
  Shampoos: "bg-sage",
  Conditioners: "bg-apricot",
  Treatments: "bg-lilac",
  "Styling Products": "bg-pink",
};
export const tintFor = (category: string) => CATEGORY_TINT[category] ?? "bg-cream";

/** The slice of a product that cart UI (client components) needs. */
export type CartProduct = Pick<
  ShopProduct,
  "id" | "name" | "slug" | "image" | "hasOptions" | "variants"
>;

export const toCartProduct = (p: ShopProduct): CartProduct => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  image: p.image,
  hasOptions: p.hasOptions,
  variants: p.variants,
});


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
