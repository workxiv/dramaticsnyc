import Image from "next/image";
import Reveal from "./Reveal";
import { Skyline } from "./NycArt";
import { BOOKING_URL, LOCATIONS, NAV_LINKS, SOCIAL } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-paper">
      {/* NYC skyline divider */}
      <div
        className="flex justify-center overflow-hidden bg-paper text-ink"
        aria-hidden
      >
        <Skyline className="w-full min-w-[880px] shrink-0" />
      </div>

      {/* Closing CTA */}
      <div className="mx-auto max-w-[1440px] px-5 py-20 text-center sm:px-8 sm:py-28 lg:px-12">
        <Reveal>
          <p className="eyebrow text-pink">Ready when you are</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="heading-fluid mx-auto mt-6 max-w-4xl text-balance">
            Book your next <em className="text-flow">appointment</em> today.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={BOOKING_URL}
              className="btn-pill-light px-9 py-4 text-[0.95rem]"
            >
              Book an Appointment
            </a>
            <a
              href="#salons"
              className="rounded-full border-[1.5px] border-paper/40 px-9 py-4 text-[0.95rem] font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              Find Your Salon
            </a>
          </div>
        </Reveal>
      </div>

      {/* Footer grid */}
      <div className="border-t border-paper/10">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-4">
            <Image
              src="/img/logo-dramatics-light.png"
              alt="Dramatics NYC"
              width={972}
              height={166}
              className="h-7 w-auto sm:h-8"
            />
            <p className="mt-4 max-w-xs text-sm text-paper/60">
              Hair Cuts &amp; Color for New Yorkers. Five Hair Salon locations
              in Manhattan since 1984.
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-paper"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-paper/50">
              Explore
            </p>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-paper/70 hover:text-paper"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-paper/50">
              Salons
            </p>
            <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {LOCATIONS.map((l) => (
                <div key={l.id} className="text-sm">
                  <p className="text-paper">{l.street}</p>
                  <p className="text-paper/50">{l.cityLine}</p>
                  <a
                    href={`tel:${l.tel}`}
                    className="link-underline text-paper/70 hover:text-paper"
                  >
                    {l.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 border-t border-paper/10 px-5 py-6 text-[0.7rem] uppercase tracking-[0.12em] text-paper/40 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <span>© {year} Dramatics NYC. All rights reserved.</span>
          <span>New York City</span>
        </div>
      </div>
    </footer>
  );
}
