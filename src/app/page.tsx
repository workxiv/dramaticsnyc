import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Trust from "@/components/Trust";
import Locations from "@/components/Locations";
import Shop from "@/components/Shop";
import InstaFeed from "@/components/InstaFeed";
import Faq from "@/components/Faq";
import StickyBook from "@/components/StickyBook";
import Footer from "@/components/Footer";
import { BOOKING_URL, FAQS, LOCATIONS, SITE, SOCIAL } from "@/lib/content";

const SITE_URL = "https://www.dramaticsnyc.com";
const ORG_ID = `${SITE_URL}/#organization`;

/**
 * Entity graph: parent Organization + one HairSalon per physical location
 * (linked via parentOrganization) + FAQPage mirroring the visible FAQ.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Dramatics NYC",
      url: SITE_URL,
      description: SITE.productsBlurb,
      foundingDate: "1984",
      sameAs: SOCIAL.map((s) => s.href),
    },
    ...LOCATIONS.map((l) => ({
      "@type": "HairSalon",
      "@id": `${SITE_URL}/locations/${l.slug}#salon`,
      name: `Dramatics NYC ${l.street}`,
      parentOrganization: { "@id": ORG_ID },
      url: `${SITE_URL}/locations/${l.slug}`,
      telephone: l.phone,
      email: l.email,
      priceRange: "$$",
      image: `${SITE_URL}${l.image}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: l.street,
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: l.postalCode,
        addressCountry: "US",
      },
      openingHours: l.openingHours,
      hasMap: l.maps,
      potentialAction: {
        "@type": "ReserveAction",
        target: l.bookingUrl,
        name: "Book an appointment",
      },
    })),
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Dramatics NYC",
      publisher: { "@id": ORG_ID },
      potentialAction: {
        "@type": "ReserveAction",
        target: `${SITE_URL}${BOOKING_URL}`,
        name: "Book an appointment at Dramatics NYC",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Trust />
        <Locations />
        <InstaFeed />
        <Shop />
        <Faq />
      </main>
      <Footer />
      <StickyBook />
    </>
  );
}
