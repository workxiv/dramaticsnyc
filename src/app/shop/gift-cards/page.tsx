import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { LOCATIONS, SITE, giftCardUrl, jsonLdString } from "@/lib/content";

const SITE_URL = "https://www.dramaticsnyc.com";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "Buy a Dramatics NYC eGift card for any of our five Manhattan salons. Choose any amount from $25 to $500, personalize it, and it's emailed instantly. Good for cuts, color, extensions, keratin and more.",
  alternates: { canonical: `${SITE_URL}/shop/gift-cards` },
  openGraph: {
    title: "Dramatics NYC Gift Cards",
    description:
      "eGift cards for any of our five NYC salons, emailed instantly. Any amount from $25 to $500.",
    url: `${SITE_URL}/shop/gift-cards`,
    type: "website",
  },
};

const AMOUNTS = ["$25", "$50", "$75", "$100", "$150", "$200", "$250", "$300", "$400", "$500"];

const STEPS = [
  "Pick the salon your recipient loves (or is closest to). Cards are redeemed at that location.",
  "Choose an amount, from $25 to $500, or type in your own.",
  "Add a design and a personal message, then check out securely.",
  "The eGift card is emailed instantly. Send it to them, or to yourself to forward later.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/shop/gift-cards#cards`,
  name: "Dramatics NYC Gift Cards",
  numberOfItems: LOCATIONS.length,
  itemListElement: LOCATIONS.map((loc, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: `Dramatics NYC ${loc.name} eGift Card`,
      description: `eGift card redeemable for services at Dramatics NYC ${loc.street}, ${loc.neighborhood}.`,
      brand: { "@type": "Brand", name: "Dramatics NYC" },
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "25.00",
        highPrice: "500.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: giftCardUrl(loc),
      },
    },
  })),
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Shop", item: `${SITE_URL}/shop` },
    { "@type": "ListItem", position: 2, name: "Gift Cards", item: `${SITE_URL}/shop/gift-cards` },
  ],
};

export default function GiftCardsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString([jsonLd, breadcrumb]) }}
      />
      <Nav />
      <main className="bg-cream pt-24 sm:pt-32">
        <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
          <nav aria-label="Breadcrumb" className="text-xs text-ink-mute">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/shop" className="inline-block py-2 pr-1 hover:text-ink">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="px-1 text-ink-soft">Gift Cards</li>
            </ol>
          </nav>

          <div className="mx-auto mt-6 max-w-3xl text-center">
            <p className="eyebrow text-coral">DNYC Gift Cards</p>
            <h1 className="heading-fluid mt-5 font-display font-medium text-balance">
              Give a great hair day.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-ink-soft sm:text-lg">
              eGift cards for any amount, emailed instantly and good for cuts,
              color, extensions, keratin and everything else we do. Choose the
              salon your recipient will visit: cards are redeemed at that
              location.
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {AMOUNTS.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-ink/15 bg-paper px-3.5 py-1.5 text-sm font-semibold text-ink-soft"
                >
                  {a}
                </li>
              ))}
              <li className="rounded-full border border-dashed border-ink/25 px-3.5 py-1.5 text-sm font-semibold text-ink-mute">
                or any amount
              </li>
            </ul>
          </div>

          {/* Location cards */}
          <div className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {LOCATIONS.map((loc, i) => (
              <Reveal key={loc.id} delay={0.05 * i} y={30} className="h-full">
                <article className="group card-soft flex h-full flex-col border border-ink/8 bg-paper p-3">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-lilac">
                    <Image
                      src={loc.image}
                      alt={`Dramatics NYC ${loc.street} salon`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] backdrop-blur">
                      {loc.neighborhood}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h2 className="font-display text-2xl font-semibold leading-tight">
                      {loc.name}
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">
                      {loc.street}, {loc.cityLine.split("·").pop()?.trim()}
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">
                      Redeemable for any service at this salon.{" "}
                      <Link
                        href={`/locations/${loc.slug}`}
                        className="link-underline text-ink"
                      >
                        Salon details
                      </Link>
                    </p>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <a
                        href={giftCardUrl(loc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill min-h-11 flex-1 px-6 py-3 text-sm"
                      >
                        Buy eGift Card
                      </a>
                      <a
                        href={`tel:${loc.tel}`}
                        className="btn-pill-outline min-h-11 px-5 py-3 text-sm"
                      >
                        {loc.phone}
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}

            {/* How it works card */}
            <Reveal delay={0.25} y={30} className="h-full">
              <section className="card-soft h-full bg-lilac p-7 sm:p-8">
                <p className="eyebrow text-coral !text-xs">How it works</p>
                <h2 className="mt-3 font-display text-2xl font-semibold">
                  Four quick steps
                </h2>
                <ol className="mt-5 space-y-4">
                  {STEPS.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-paper">
                        {i + 1}
                      </span>
                      <span className="pt-1 leading-relaxed text-ink-soft">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>
          </div>

          {/* Note + quote */}
          <div className="card-soft mt-14 flex flex-col items-start justify-between gap-6 border border-ink/10 bg-paper p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                Gift cards for any budget
              </h2>
              <p className="mt-3 max-w-xl text-ink-soft">
                &ldquo;{SITE.giftCardQuote}&rdquo;
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{SITE.giftCardAttribution}</p>
              <p className="mt-3 max-w-xl text-xs text-ink-mute">
                eGift cards are delivered by email and are not redeemable for
                cash. Prefer a physical card? Every salon sells them at the
                front desk. Good for up to one year.
              </p>
            </div>
            <Link href="/shop" className="btn-pill-outline shrink-0 px-7 py-3.5 text-sm">
              Shop DNYC Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
