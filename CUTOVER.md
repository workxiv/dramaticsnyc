# Cutover plan: www.dramaticsnyc.com → Vercel

Current state (checked 2026-09-03):

| Thing | Where |
| --- | --- |
| Domain registrar | Liquid Web (expires 9/29/2027, autorenew on) |
| DNS | Liquid Web nameservers (`ns.liquidweb.com`, `ns1.liquidweb.com`), zone editable at portal.liquidweb.com → Domains → DNS |
| Old site | WordPress + WooCommerce on Liquid Web VPS `host.dramaticsnyc.com` (67.225.241.28) |
| New site | Vercel project `workxiv/dramaticsnyc`, preview at dramaticsnyc.vercel.app, deploys on push to `main` |
| Email | MX for dramaticsnyc.com points at the VPS itself (`0 dramaticsnyc.com`). `mail.` and `webmail.` are CNAMEs to the apex. SPF also references an old HostGator IP. |

## Open question before DNS changes

**Is anyone using an @dramaticsnyc.com mailbox?** The MX record says mail is delivered to the VPS. Status on 2026-09-03: **not sure**, so treat mail as in use: keep the VPS running and apply the mail-preserving records in step 2. To find out for certain, log into the VPS control panel (Liquid Web → My servers → host.dramaticsnyc.com → manage) and look for mailboxes under the domain, or ask the salon managers whether they receive anything at an @dramaticsnyc.com address. The registrar contact is dramaticsnycs@gmail.com, which suggests day-to-day mail is Gmail.

## Pre-cutover checklist

- [x] `SQUARE_LOCATION_ID=L3A1TA4C6BBCK` and `SQUARE_ENVIRONMENT=production` set in Vercel (Production) on 2026-09-03
- [ ] `SQUARE_ACCESS_TOKEN` set in Vercel as a **Secret** (Production). Source: developer.squareup.com → "The Healthy Color website integration" → Credentials → Production → Access token. Redeploy after adding it (env changes need a new deployment).
- [ ] Leave `NEXT_PUBLIC_SITE_URL` unset: the checkout route derives the post-payment redirect from the request host, so it works on dramaticsnyc.vercel.app before cutover and on www.dramaticsnyc.com after, with no change.
- [ ] Latest `main` deployed and green on dramaticsnyc.vercel.app
- [ ] Real test order placed on dramaticsnyc.vercel.app (use a real card for $1 item or Square sandbox), refund it from Square Dashboard
- [ ] Square Dashboard → Orders shows the order with shipping address
- [ ] Gift cards: create a Square eGift ordering page (Square Dashboard → Gift Cards → eGift Cards → Online) and set `NEXT_PUBLIC_GIFT_CARDS_URL` in Vercel. Until then the button links to the old WooCommerce gift card page.
- [ ] Export WooCommerce orders/customers as CSV from WP Admin (WooCommerce → Orders, Customers) for records
- [ ] Note any old URLs that get traffic (WP Admin → analytics) so they can be redirected

## Cutover steps (do in order, ~20 minutes plus propagation)

1. **Vercel → Project → Settings → Domains → Add Existing**: add `www.dramaticsnyc.com` and `dramaticsnyc.com`. Set `www` as primary, apex redirects to `www` (the code's canonical URLs already use `www`). Vercel will show the exact records it wants; they will be:
   - `A` `dramaticsnyc.com` → `76.76.21.21`
   - `CNAME` `www.dramaticsnyc.com` → `cname.vercel-dns.com`
   (If Vercel shows different values on that screen, use what it shows.)
2. **Liquid Web → Domains → DNS → dramaticsnyc.com**, edit records:
   - Change `A dramaticsnyc.com` from `67.225.241.28` → Vercel's A value. Lower TTL is already 300s, good.
   - Change `CNAME www.dramaticsnyc.com` from `dramaticsnyc.com` → `cname.vercel-dns.com`.
   - Change `CNAME *.dramaticsnyc.com` → delete it, or leave it (wildcard would now point at Vercel via the apex, which is harmless but pointless). Recommended: delete.
   - **Only if mail is in use:** add `A mail.dramaticsnyc.com` → `67.225.241.28` (replace the current CNAME), change `MX dramaticsnyc.com` to `0 mail.dramaticsnyc.com`, and change the SPF TXT to `v=spf1 +a:mail.dramaticsnyc.com +mx ~all`. Leave `webmail` CNAME → `mail`.
   - Leave `ftp`, `shop` A records pointing at the VPS for now (useful for pulling anything else off WordPress). Delete later.
   - Save Records.
3. Back in Vercel, wait for the domain to show **Valid Configuration** and the SSL certificate to be issued (usually a few minutes, up to an hour).
4. Verify: open https://www.dramaticsnyc.com and https://dramaticsnyc.com (should redirect to www) in an incognito window. Check `/shop`, add to bag, Checkout → lands on Square. Check `/locations/...` pages, `/sitemap.xml`, `/robots.txt`.
5. Google Search Console: add the property if not already there, submit `https://www.dramaticsnyc.com/sitemap.xml`. Google Business Profile: confirm website links still resolve (they do, same domain).

## Redirects for old WooCommerce URLs

Old product pages lived at `https://dramaticsnyc.com/shop/<slug>/`, categories at `/product-category/...`, cart/checkout at `/cart/`, `/checkout/`, `/my-account/`. Add these to `next.config.ts` before cutover so old Google results and any bookmarks land on the new shop:

```ts
async redirects() {
  return [
    { source: "/shop/:slug+", destination: "/shop", permanent: true },
    { source: "/product-category/:path*", destination: "/shop", permanent: true },
    { source: "/product/:path*", destination: "/shop", permanent: true },
    { source: "/cart", destination: "/shop", permanent: true },
    { source: "/checkout", destination: "/shop", permanent: true },
    { source: "/my-account", destination: "/shop", permanent: true },
    { source: "/salons/:path*", destination: "/#salons", permanent: true },
  ];
}
```

(The `/shop/:slug+` rule does not affect `/shop` itself or `/shop/thank-you`, which is a real page and matches first.)

## Rollback

Change the two records back (`A` apex → `67.225.241.28`, `CNAME www` → `dramaticsnyc.com`) in Liquid Web. The WordPress server is untouched by all of the above, so rollback is DNS-only and takes effect within 5 minutes for most visitors.

## After a clean week on Vercel

- Cancel or downsize the Liquid Web VPS (unless it hosts mail or thehealthycolor.com / whatisthebuzz.com; those DNS zones also live in this Liquid Web account, so keep the account itself).
- Remove `ftp`, `shop`, wildcard records.
- Remove the WooCommerce sync script dependency (`scripts/sync-shop.mjs`) and manage `products-snapshot.json` directly.
