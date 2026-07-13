import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyBook from "@/components/StickyBook";
import { LOCATIONS, SERVICES, SITE } from "@/lib/content";

const SITE_URL = "https://www.dramaticsnyc.com";
const ORG_ID = `${SITE_URL}/#organization`;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = LOCATIONS.find((l) => l.slug === slug);
  if (!loc) return {};
  return {
    title: `${loc.street} Hair Salon — ${loc.neighborhood}`,
    description: `Dramatics NYC hair salon at ${loc.street}, ${loc.neighborhood}, New York. Cutting & Styling, Hair Coloring, and Hair Treatments. ${loc.hours.join(", ")}. Call ${loc.phone} or book online.`,
    alternates: {
      canonical: `${SITE_URL}/locations/${loc.slug}`,
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loc = LOCATIONS.find((l) => l.slug === slug);
  if (!loc) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${SITE_URL}/locations/${loc.slug}#salon`,
    name: `Dramatics NYC ${loc.street}`,
    parentOrganization: { "@id": ORG_ID },
    url: `${SITE_URL}/locations/${loc.slug}`,
    telephone: loc.phone,
    email: loc.email,
    priceRange: "$$",
    image: `${SITE_URL}${loc.image}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.street,
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: loc.postalCode,
      addressCountry: "US",
    },
    openingHours: loc.openingHours,
    hasMap: loc.maps,
    potentialAction: {
      "@type": "ReserveAction",
      target: loc.bookingUrl,
      name: `Book an appointment at Dramatics NYC ${loc.street}`,
    },
  };

  const others = LOCATIONS.filter((l) => l.slug !== loc.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="bg-paper pt-28 sm:pt-36">
        <div className="mx-auto max-w-[1100px] px-5 pb-20 sm:px-8 sm:pb-28">
          <p className="eyebrow text-coral">
            Dramatics NYC · {loc.neighborhood}
          </p>
          <h1 className="heading-fluid mt-4 font-display font-medium">
            {loc.street}
          </h1>
          <p className="mt-3 text-lg text-ink-soft">{loc.cityLine}</p>

          <div className="card-soft relative mt-8 aspect-[16/8] w-full">
            <Image
              src={loc.image}
              alt={`Inside the Dramatics NYC hair salon at ${loc.street}, ${loc.neighborhood}`}
              fill
              priority
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="object-cover"
            />
          </div>

          {loc.quote && (
            <blockquote className="mt-8 max-w-2xl font-display text-xl font-medium leading-snug sm:text-2xl">
              &ldquo;{loc.quote}&rdquo;
              <footer className="mt-2 font-sans text-sm font-normal text-ink-mute">
                — Larry Kolber
              </footer>
            </blockquote>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="card-soft bg-apricot p-6">
              <p className="eyebrow text-ink-soft">Hours</p>
              <div className="mt-3 space-y-1 text-sm">
                {loc.hours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <div className="card-soft bg-pink p-6">
              <p className="eyebrow text-ink-soft">Contact</p>
              <a
                href={`tel:${loc.tel}`}
                className="mt-3 block font-display text-xl font-semibold"
              >
                {loc.phone}
              </a>
              {loc.email && (
                <a
                  href={`mailto:${loc.email}`}
                  className="mt-1 block break-all text-sm text-ink-soft"
                >
                  {loc.email}
                </a>
              )}
            </div>
            <div className="card-soft bg-sage p-6">
              <p className="eyebrow text-ink-soft">Visit</p>
              <p className="mt-3 text-sm">
                {loc.street}
                <br />
                New York, NY {loc.postalCode}
              </p>
              <a
                href={loc.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-2 inline-block text-sm font-semibold"
              >
                Get directions →
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={loc.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill px-9 py-4 text-[0.95rem]"
            >
              Book at this salon
            </a>
            <a href={`tel:${loc.tel}`} className="btn-pill-outline px-9 py-4 text-[0.95rem]">
              Call {loc.phone}
            </a>
          </div>

          {/* Services at this location */}
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Services at this salon
            </h2>
            <p className="mt-3 max-w-2xl text-ink-soft">{SITE.servicesDetail}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {SERVICES.map((s) => (
                <div key={s.id} className="card-soft border border-ink/8 bg-cream p-6">
                  <h3 className="font-display text-lg font-semibold">
                    {s.title}
                  </h3>
                  <a
                    href={loc.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-3 inline-block text-sm font-semibold"
                  >
                    Book now →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Other locations */}
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Other Dramatics NYC salons
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {others.map((l) => (
                <Link
                  key={l.id}
                  href={`/locations/${l.slug}`}
                  className="rounded-full border border-ink/15 bg-cream px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper"
                >
                  {l.street} · {l.neighborhood}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <StickyBook />
    </>
  );
}
