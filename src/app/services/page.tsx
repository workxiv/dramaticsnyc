import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyBook from "@/components/StickyBook";
import ServicesExplorer from "@/components/ServicesExplorer";
import { SERVICE_CATEGORIES, SERVICE_POLICIES } from "@/lib/services";
import { BOOKING_URL } from "@/lib/content";

const SITE_URL = "https://www.dramaticsnyc.com";
const ORG_ID = `${SITE_URL}/#organization`;

export const metadata: Metadata = {
  title: "Services & Prices — Haircuts, Color & Treatments",
  description:
    "Dramatics NYC service price list: haircuts from $42, blowouts $45–$65, single process color $80–$90, balayage $175–$300, keratin $150–$350, and more. All prices determined by hair length and texture.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
};

function parsePriceRange(price: string) {
  const nums = price.match(/\d+/g)?.map(Number) ?? [];
  return {
    min: nums[0] ?? 0,
    max: nums[nums.length - 1] ?? nums[0] ?? 0,
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${SITE_URL}/services#catalog`,
  name: "Dramatics NYC Services & Prices",
  url: `${SITE_URL}/services`,
  provider: { "@id": ORG_ID },
  itemListElement: SERVICE_CATEGORIES.map((cat) => ({
    "@type": "OfferCatalog",
    name: cat.title,
    itemListElement: cat.items.map((item) => {
      const { min, max } = parsePriceRange(item.price);
      return {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: min,
          maxPrice: max,
          priceCurrency: "USD",
        },
      };
    }),
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="bg-cream pt-28 sm:pt-36">
        <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-coral">Services &amp; Price List</p>
            <h1 className="display-fluid mt-5">
              <em className="text-flow">Great hair,</em>
              <span className="block whitespace-nowrap pt-[0.12em]">
                honest prices.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-ink-soft sm:text-lg">
              All prices are determined by the length and texture of your hair
              — and every service is guaranteed for 7 days.
            </p>
          </div>

          {/* Search + price lists */}
          <div className="mt-12">
            <ServicesExplorer />
          </div>

          {/* Policies */}
          <div className="mx-auto mt-16 max-w-[1000px] sm:mt-20">
            <div className="card-soft border border-ink/8 bg-paper p-8 sm:p-10">
              <h2 className="font-display text-2xl font-semibold">
                Good to know
              </h2>
              <ul className="mt-5 grid gap-3 text-sm text-ink-soft sm:grid-cols-2">
                {SERVICE_POLICIES.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden className="text-coral">
                      ✦
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Closing CTA */}
          <div className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
            <h2 className="heading-fluid font-display font-medium text-balance">
              Found your service?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-soft sm:text-lg">
              Reserve your chair at whichever of our five Manhattan salons is
              easiest for you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={BOOKING_URL} className="btn-pill px-9 py-4 text-[0.95rem]">
                Book an Appointment
              </a>
              <a
                href="/#salons"
                className="btn-pill-outline px-9 py-4 text-[0.95rem]"
              >
                Find Your Salon
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <StickyBook />
    </>
  );
}
