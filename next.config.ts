import type { NextConfig } from "next";

/**
 * Old WooCommerce product slugs → new product pages.
 * Keep in sync with `legacySlugs` in src/lib/product-details.ts.
 */
const LEGACY_PRODUCT_SLUGS: Record<string, string> = {
  "color-protect-p-i-shampoo": "color-protect-shampoo",
  "color-protect-p-i-conditioner": "color-protect-conditioner",
  "just-chill-cbd-shampoo": "just-chill-shampoo",
  "just-chill-cbd-conditioner": "just-chill-conditioner",
  "amnesia-haze-shampoo-moisturizing-cbd-shampoo": "amnesia-haze-shampoo",
  "amnesia-haze-conditioner-moisturizing-cbd-conditioner": "amnesia-haze-conditioner",
  "skywalker-omg-super-smooth-leave-in": "skywalker-omg-leave-in",
  "diamond-reconstruction-extreme-repair-hair-mask": "diamond-reconstruction-hair-mask",
  "diesel-hayes-color-enhancing-hair-mask": "diesel-hayes-color-mask",
  "ocean-beach-sea-salt-texturizing-spray": "ocean-beach-sea-salt-spray",
  "dutch-treat-styling-mousse-for-curly-hair-glycerin-panthenol-styling": "dutch-treat-styling-mousse",
  "high-society-styling-gel-for-any-type-of-hair-bamboo-extract-aloe-leaf-juice-styling": "high-society-styling-gel",
  "northern-lights-radiant-shine-gloss-4oz": "northern-lights-shine-gloss",
  "jasper-moroccan-oil-argan-hair-serum": "jasper-moroccan-oil-serum",
  "forever-young-b-t-x-smoothing-spray": "forever-young-smoothing-spray",
  "big-dreams-r-e-m-volume-spray": "big-dreams-volume-spray",
  // discontinued
  "way-shea-hair-mask-8-oz": "",
  giftcards: "",
};

/**
 * Content Security Policy. Next.js needs inline scripts for hydration, so
 * script-src keeps 'unsafe-inline' but still blocks every third-party origin
 * except Vercel's preview toolbar. Frames are only allowed for the Google Maps
 * embeds on location pages; nobody may frame this site.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.vercel.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://maps.google.com https://www.google.com https://vercel.live",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Static assets: a day with background revalidation; the versioned
      // product cutouts (?v=) can be cached hard. Later rules win on conflict.
      {
        source: "/(img|media)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/img/products/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Product images use a ?v= cache-buster; omitting `search` allows any query.
    localPatterns: [
      { pathname: "/img/**" },
      { pathname: "/media/**", search: "" },
    ],
  },
  async redirects() {
    // Legacy WordPress / WooCommerce URLs → new shop, so old search results
    // and bookmarks keep working after the domain moves to this site.
    return [
      ...Object.entries(LEGACY_PRODUCT_SLUGS).map(([from, to]) => ({
        source: `/shop/${from}`,
        destination: to ? `/shop/${to}` : "/shop",
        permanent: true,
      })),
      { source: "/product-category/:path*", destination: "/shop", permanent: true },
      { source: "/product/:path*", destination: "/shop", permanent: true },
      { source: "/cart", destination: "/shop", permanent: true },
      { source: "/checkout", destination: "/shop", permanent: true },
      { source: "/my-account/:path*", destination: "/shop", permanent: true },
    ];
  },
};

export default nextConfig;
