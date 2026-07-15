import Reveal from "./Reveal";
import LocationCard from "./LocationCard";
import { SubwayToken } from "./NycArt";
import { BOOKING_URL, LOCATIONS } from "@/lib/content";

export default function Locations() {
  return (
    <section id="salons" className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-coral">Hair Salon Finder</p>
            <h2 className="heading-fluid mt-5 text-balance">
              Five salons across{" "}
              <em className="text-flow">Manhattan.</em>
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
              <LocationCard loc={loc} />
            </Reveal>
          ))}

          <Reveal delay={0.3} y={40}>
            <div className="card-soft relative flex h-full flex-col justify-between bg-lilac p-7">
              <SubwayToken
                letter="D"
                className="animate-bob absolute right-6 top-6 h-12 w-12"
              />
              <p className="max-w-[80%] font-display text-2xl font-semibold leading-snug sm:text-3xl">
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
