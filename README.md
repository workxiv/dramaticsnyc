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
- `/shop` — full DNYC product catalog (22 products) with category filters; checkout hands off to the existing WooCommerce store
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

Or push to GitHub and import at [vercel.com/new](https://vercel.com/new). No environment variables required.

## Notes

- `scripts/` contains Playwright screenshot helpers used during development.
- `node scripts/sync-shop.mjs` re-syncs the product catalog (names, prices, ratings, images) from the WooCommerce store API into `src/lib/products-snapshot.json` and `public/img/products/`. Run it whenever products change.
- **Shop checkout:** browsing happens on this site; "Add to Cart" hands off to the existing WooCommerce cart at dramaticsnyc.com. When this site replaces that domain, the old store must be kept alive on a subdomain (e.g. `store.dramaticsnyc.com`) or replaced with a headless commerce backend (Shopify/Stripe), and `buyUrl()` in `src/lib/shop.ts` updated accordingly.
- Photography is licensed via Unsplash; swap in official salon photography in `public/img` when available (real photos out-convert stock by 30–50%).
- Real salon videos live in `public/media` (converted from uploads in `downloads/` via macOS `avconvert`). Drop new photos/videos in `downloads/` and they can be converted and rotated into the Instagram section.
