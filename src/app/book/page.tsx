import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { LOCATIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book a hair appointment online at any of Dramatics NYC's five Manhattan salons — Murray Hill, Upper East Side, 57th Street, and the Upper West Side. Open Mon–Sat 9am–7pm.",
  alternates: {
    canonical: "https://www.dramaticsnyc.com/book",
  },
};

export default function BookPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper pt-28 sm:pt-36">
        <div className="mx-auto max-w-[1100px] px-5 pb-20 sm:px-8 sm:pb-28">
          <p className="eyebrow text-center text-coral">Appointment Booking</p>
          <h1 className="heading-fluid mt-5 text-center font-display font-medium text-balance">
            Choose your salon to book.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-ink-soft sm:text-lg">
            Every Dramatics NYC location takes online bookings. Pick the salon
            that&apos;s most convenient for you — we&apos;ll show you the map,
            hours, and a direct book button.
          </p>

          <div className="mt-12 space-y-4">
            {LOCATIONS.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.slug}`}
                className="card-soft flex flex-col gap-5 border border-ink/8 bg-cream p-5 transition-colors hover:border-ink/20 hover:bg-paper sm:flex-row sm:items-center"
              >
                <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-2xl sm:block">
                  <Image
                    src={loc.image}
                    alt={`Dramatics NYC ${loc.street} salon`}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-semibold sm:text-2xl">
                    {loc.street}
                    <span className="ml-2 text-sm font-sans font-semibold uppercase tracking-[0.1em] text-ink-mute">
                      {loc.neighborhood}
                    </span>
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {loc.hours.join(" · ")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="btn-pill-outline pointer-events-none px-5 py-3 text-sm">
                    {loc.phone}
                  </span>
                  <span className="btn-pill pointer-events-none px-6 py-3 text-sm">
                    Choose Salon
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
