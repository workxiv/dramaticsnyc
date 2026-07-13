import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ShopGrid from "@/components/ShopGrid";
import { GIFT_CARDS_URL, SHOP_PRODUCTS } from "@/lib/shop";
import { SITE } from "@/lib/content";

const SITE_URL = "https://www.dramaticsnyc.com";

export const metadata: Metadata = {
  title: "Shop DNYC Hair Products",
  description:
    "Shop DNYC professional hair care — shampoos, conditioners, treatments, and styling products made of up to 96% natural ingredients, paraben and sulfate free. Gift cards available.",
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/shop#products`,
  name: "DNYC Professional Hair Products",
  numberOfItems: SHOP_PRODUCTS.length,
  itemListElement: SHOP_PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: p.name,
      image: `${SITE_URL}${p.image}`,
      category: p.category,
      brand: { "@type": "Brand", name: "DNYC" },
      ...(p.rating && p.reviewCount > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: p.rating,
              reviewCount: p.reviewCount,
            },
          }
        : {}),
      offers: {
        "@type": "Offer",
        price: p.price.replace("$", ""),
        priceCurrency: "USD",
        availability: p.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: p.permalink,
      },
    },
  })),
};

export default function ShopPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="bg-cream pt-28 sm:pt-36">
        <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-coral">DNYC Professional Products</p>
            <h1 className="heading-fluid mt-5 font-display font-medium text-balance">
              Take the salon home.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-ink-soft sm:text-lg">
              {SITE.productsBlurb}
            </p>
          </div>

          <div className="mt-12">
            <ShopGrid />
          </div>

          <div className="card-soft mt-14 flex flex-col items-start justify-between gap-6 bg-lilac p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                Gift cards for any budget
              </h2>
              <p className="mt-3 max-w-xl text-ink-soft">
                &ldquo;{SITE.giftCardQuote}&rdquo; —{" "}
                {SITE.giftCardAttribution}
              </p>
            </div>
            <a
              href={GIFT_CARDS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill shrink-0 px-7 py-3.5 text-sm"
            >
              Shop Gift Cards
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
