import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    // Legacy WordPress / WooCommerce URLs → new shop, so old search results
    // and bookmarks keep working after the domain moves to this site.
    return [
      {
        source: "/shop/:slug((?!thank-you$).+)",
        destination: "/shop",
        permanent: true,
      },
      { source: "/product-category/:path*", destination: "/shop", permanent: true },
      { source: "/product/:path*", destination: "/shop", permanent: true },
      { source: "/cart", destination: "/shop", permanent: true },
      { source: "/checkout", destination: "/shop", permanent: true },
      { source: "/my-account/:path*", destination: "/shop", permanent: true },
    ];
  },
};

export default nextConfig;
