/**
 * Syncs the product catalog from the legacy WooCommerce store
 * (dramaticsnyc.com) into this repo:
 *   - src/lib/products-snapshot.json  (product + size-variant data, incl. cents & SKUs,
 *                                      used by the cart and the Square checkout route)
 *   - public/img/products/{id}.png    (product images, served first-party)
 *
 * Run whenever products change:  node scripts/sync-shop.mjs
 *
 * Once WooCommerce is retired, edit products-snapshot.json directly
 * (or point API at wherever the catalog lives).
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";

const BASE = "https://dramaticsnyc.com/wp-json/wc/store/v1";
const API = `${BASE}/products?per_page=100`;

const decode = (s) =>
  s
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("&#8217;", "’")
    .replaceAll("&#8211;", "–")
    .replaceAll("&ldquo;", "“")
    .replaceAll("&rdquo;", "”")
    .replaceAll("&nbsp;", " ");

const money = (cents) => `$${(Number(cents) / 100).toFixed(2)}`;
const sizeLabel = (l) => l.replace(/-?oz$/i, " oz").replace(/\s+/g, " ").trim();

// Ratings shown on the site are curated in the snapshot; keep them across syncs.
const previous = existsSync("src/lib/products-snapshot.json")
  ? JSON.parse(readFileSync("src/lib/products-snapshot.json", "utf8"))
  : [];
const prevById = new Map(previous.map((p) => [p.id, p]));

const res = await fetch(API);
if (!res.ok) throw new Error(`Store API returned ${res.status}`);
const raw = await res.json();

const products = [];
for (const p of raw) {
  if (p.prices.currency_minor_unit !== 2) throw new Error(`unexpected currency for ${p.id}`);

  let variants;
  if (p.variations?.length) {
    variants = [];
    for (const v of p.variations) {
      const vr = await fetch(`${BASE}/products/${v.id}`);
      if (!vr.ok) {
        console.warn(`skip variation ${v.id}: HTTP ${vr.status}`);
        continue;
      }
      const vj = await vr.json();
      variants.push({
        id: v.id,
        label: sizeLabel(v.attributes.map((a) => a.value).join(" / ")),
        cents: Number(vj.prices.price),
        price: money(vj.prices.price),
        sku: vj.sku || null,
        inStock: Boolean(vj.is_in_stock),
      });
    }
  } else {
    variants = [
      {
        id: p.id,
        label: null,
        cents: Number(p.prices.price),
        price: money(p.prices.price),
        sku: p.sku || null,
        inStock: Boolean(p.is_in_stock),
      },
    ];
  }

  const min = Math.min(...variants.map((v) => v.cents));
  const max = Math.max(...variants.map((v) => v.cents));

  products.push({
    id: p.id,
    name: decode(p.name),
    category: p.categories?.[0]?.name ?? "Hair Care",
    price: money(min),
    priceRange: min !== max ? `${money(min)} – ${money(max)}` : null,
    cents: min,
    sku: p.sku || null,
    rating: prevById.get(p.id)?.rating ?? (Number(p.average_rating) || null),
    reviewCount: prevById.get(p.id)?.reviewCount ?? (p.review_count || 0),
    hasOptions: variants.length > 1,
    inStock: variants.some((v) => v.inStock),
    // Cutout PNGs are generated from the .jpg sources by scripts/cutout-products.py
    image: `/img/products/${p.id}.png`,
    variants,
  });
}

mkdirSync("public/img/products", { recursive: true });
for (const p of products) {
  const remoteImage = raw.find((r) => r.id === p.id)?.images?.[0]?.src;
  if (!remoteImage) continue;
  const dest = `public/img/products/${p.id}.png`;
  // Never overwrite a curated local image (the .jpg files were supplied by the
  // brand and are CBD-free); only fetch when nothing exists for this product.
  if (existsSync(dest) || existsSync(`public/img/products/${p.id}.jpg`)) continue;
  const img = await fetch(remoteImage);
  if (!img.ok) {
    console.warn(`skip image for ${p.id}: HTTP ${img.status}`);
    continue;
  }
  writeFileSync(dest, Buffer.from(await img.arrayBuffer()));
  console.log(`image ${p.id} <- ${remoteImage.split("/").pop()}`);
}

writeFileSync(
  "src/lib/products-snapshot.json",
  JSON.stringify(products, null, 2) + "\n"
);
console.log(`synced ${products.length} products`);
