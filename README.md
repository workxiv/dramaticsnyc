# Dramatics NYC

A complete redesign of [dramaticsnyc.com](https://www.dramaticsnyc.com) — a warm, modern, conversion-focused site for New York's most enduring hair salon chain (est. 1984, five Manhattan locations).

Built to deploy on **Vercel** with zero configuration.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — warm editorial design system in `src/app/globals.css`
- **Motion** (Framer Motion) — scroll reveals and entrance animations
- **Lenis** — smooth scrolling
- **next/font** — Fraunces (display serif) + Inter (UI), self-hosted & optimized

## Routes

- `/` — homepage (all sections)
- `/book` — first-party booking page listing every salon's own online booking
- `/shop` — full DNYC product catalog (21 products) with category filters, size variants, and a first-party cart; checkout runs on Square's hosted payment page
- `/shop/[slug]` — one page per product: benefits, how to use, key ingredients, size picker, related products, Product JSON-LD. Copy lives in `src/lib/product-details.ts` (CBD-free by policy); prices/sizes in `src/lib/products-snapshot.json`; images in `public/img/products/{id}.jpg`
- `/shop/thank-you` — order confirmation (Square redirects here after payment)
- `/api/checkout` — creates a Square Payment Link from the cart (server-side price lookup)
- `/locations/[slug]` — one page per salon, reusing the original site's URL slugs so existing indexed links keep working after migration

## Design language

Cream paper backgrounds, gloss-black ink, pastel accent cards (apricot, pink, lilac, sage), fully rounded pill buttons, and a high-contrast serif display face. Light, airy, premium.

## Booking conversion features

- **Two-click rule:** Book CTA in the first viewport, sticky in the nav, and a mobile sticky bottom bar
- **Per-location booking:** each salon card links to its own online booking page
- Click-to-call phone numbers and visible hours on every location card
- Social proof band with Google reviews link before the booking CTA

## SEO & AEO

- **Entity graph JSON-LD:** parent `Organization` + one `HairSalon` per location (`parentOrganization`-linked) with NAP, hours, and `ReserveAction`
- **FAQPage schema** mirroring the visible FAQ accordion (answer-first content)
- `sitemap.xml`, `robots.txt`, and `public/llms.txt` with structured business facts
- Canonical URL, Open Graph/Twitter metadata, descriptive alt text throughout

## Content accuracy

All business facts (addresses, phones, hours, booking URLs, products, quotes) were pulled from the live dramaticsnyc.com and centralized in `src/lib/content.ts`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or push to GitHub and import at [vercel.com/new](https://vercel.com/new).

### Environment variables (Square checkout)

Copy `.env.example` to `.env.local` and set the same values in Vercel → Project → Settings → Environment Variables:

| Variable | Where to find it |
| --- | --- |
| `SQUARE_ACCESS_TOKEN` | developer.squareup.com → Applications → your app → Credentials (Production) |
| `SQUARE_LOCATION_ID` | Same page → Locations tab, or Square Dashboard → Account & Settings → Business → Locations |
| `SQUARE_ENVIRONMENT` | `production` (or `sandbox` with a sandbox token for testing) |
| `SQUARE_SUPPORT_EMAIL` | Optional, shown on the checkout page |
| `NEXT_PUBLIC_SITE_URL` | `https://www.dramaticsnyc.com` (post-payment redirect base) |
| `NEXT_PUBLIC_GIFT_CARDS_URL` | Optional Square eGift card page |

Without the Square variables the shop still renders; the checkout button returns a friendly "temporarily unavailable" message.

### How checkout works

1. Shopper adds items (with size) to the bag. The bag lives in `localStorage` (`dnyc-cart-v1`).
2. "Checkout" POSTs product/variant ids and quantities to `/api/checkout`.
3. The route re-prices every line from `products-snapshot.json`, adds the $7.95 flat-rate shipping fee, and calls Square's Checkout API to create a Payment Link. Card entry happens on Square's PCI-compliant page; this site never sees card data.
4. Square redirects to `/shop/thank-you?orderId=…`, which shows the order summary and empties the bag.

Orders appear in the Square Dashboard under Orders, with the shipping address the buyer entered.

## Notes

- `scripts/` contains Playwright screenshot helpers used during development.
- `node scripts/sync-shop.mjs` re-syncs the product catalog (names, prices, sizes, SKUs, ratings, images) from the WooCommerce store API into `src/lib/products-snapshot.json` and `public/img/products/`. Run it whenever products change while WooCommerce is still up; after it's retired, edit the JSON directly.
- **Shop checkout** no longer depends on WooCommerce. Once DNS moves to this site, the old WordPress server can be shut down.
- Photography is licensed via Unsplash; swap in official salon photography in `public/img` when available (real photos out-convert stock by 30–50%).
- Real salon videos live in `public/media` (converted from uploads in `downloads/` via macOS `avconvert`). Drop new photos/videos in `downloads/` and they can be converted and rotated into the Instagram section.
