/**
 * Syncs the product catalog from the existing WooCommerce store
 * (dramaticsnyc.com) into this repo:
 *   - src/lib/products-snapshot.json  (trimmed product data, used as fallback)
 *   - public/img/products/{id}.png    (product images, served first-party)
 *
 * Run whenever products change:  node scripts/sync-shop.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";

const API =
  "https://dramaticsnyc.com/wp-json/wc/store/products?per_page=100";

const decode = (s) =>
  s
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("&#8217;", "\u2019")
    .replaceAll("&#8211;", "\u2013")
    .replaceAll("&ldquo;", "\u201c")
    .replaceAll("&rdquo;", "\u201d")
    .replaceAll("&nbsp;", " ");

const stripHtml = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/[\u2705\u2714\ufe0f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const money = (minor, unit) => `$${(Number(minor) / 10 ** unit).toFixed(2)}`;

const res = await fetch(API);
if (!res.ok) throw new Error(`Store API returned ${res.status}`);
const raw = await res.json();

const products = raw.map((p) => {
  const unit = p.prices.currency_minor_unit;
  const min = p.prices.price_range?.min_amount ?? p.prices.price;
  const max = p.prices.price_range?.max_amount ?? p.prices.price;
  const short = stripHtml(p.short_description || p.description || "");
  return {
    id: p.id,
    name: decode(p.name),
    category: p.categories?.[0]?.name ?? "Hair Care",
    price: money(p.prices.price, unit),
    priceRange:
      min !== max ? `${money(min, unit)} – ${money(max, unit)}` : null,
    rating: Number(p.average_rating) || null,
    reviewCount: p.review_count || 0,
    blurb: short.length > 220 ? `${short.slice(0, 217)}...` : short,
    hasOptions: Boolean(p.has_options),
    inStock: Boolean(p.is_in_stock),
    permalink: p.permalink,
    image: `/img/products/${p.id}.png`,
    remoteImage: p.images?.[0]?.src ?? null,
  };
});

mkdirSync("public/img/products", { recursive: true });
for (const p of products) {
  if (!p.remoteImage) continue;
  const dest = `public/img/products/${p.id}.png`;
  if (existsSync(dest)) continue;
  const img = await fetch(p.remoteImage);
  if (!img.ok) {
    console.warn(`skip image for ${p.id}: HTTP ${img.status}`);
    continue;
  }
  writeFileSync(dest, Buffer.from(await img.arrayBuffer()));
  console.log(`image ${p.id} <- ${p.remoteImage.split("/").pop()}`);
}

writeFileSync(
  "src/lib/products-snapshot.json",
  JSON.stringify(products, null, 2)
);
console.log(`synced ${products.length} products`);
