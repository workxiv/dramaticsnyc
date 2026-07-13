import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { BOOKING_URL, LOCATIONS } from "@/lib/content";

export default function Locations() {
  return (
    <section id="salons" className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-coral">Hair Salon Finder</p>
            <h2 className="heading-fluid mt-5 font-display font-medium text-balance">
              Five salons across Manhattan.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-ink-soft sm:text-lg">
              All of them with a uniquely relaxing atmosphere. Book online at
              your nearest location, or call and we&apos;ll take care of the
              rest.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc, i) => (
            <Reveal key={loc.id} delay={0.06 * i} y={40}>
              <article className="group card-soft flex h-full flex-col border border-ink/8 bg-cream">
                <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={loc.image}
                    alt={`Dramatics NYC ${loc.name} — hair salon at ${loc.street}, ${loc.neighborhood}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="img-cover object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] backdrop-blur">
                    {loc.neighborhood}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-2">
                  <h3 className="font-display text-2xl font-semibold">
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="transition-colors hover:text-coral"
                    >
                      {loc.street}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-ink-mute">{loc.cityLine}</p>

                  <div className="mt-4 space-y-1 text-sm text-ink-soft">
                    {loc.hours.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>

                  <a
                    href={`tel:${loc.tel}`}
                    className="link-underline mt-4 inline-block self-start font-display text-lg font-medium"
                  >
                    {loc.phone}
                  </a>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <a
                      href={loc.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill px-6 py-3 text-sm"
                    >
                      Book Now
                    </a>
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="btn-pill-outline px-6 py-3 text-sm"
                    >
                      Salon Details
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          {/* Filler card to complete the grid */}
          <Reveal delay={0.3} y={40}>
            <div className="card-soft flex h-full flex-col justify-between bg-lilac p-7">
              <p className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
                Not sure which salon is closest?
              </p>
              <div className="mt-6">
                <p className="text-sm leading-relaxed text-ink-soft">
                  We&apos;re in Murray Hill, the Upper East Side, near Columbus
                  Circle, and twice on the Upper West Side. Every salon takes
                  online bookings.
                </p>
                <a href={BOOKING_URL} className="btn-pill mt-6 px-6 py-3 text-sm">
                  Book an Appointment
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
