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

const nextConfig: NextConfig = {
  devIndicators: false,
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
