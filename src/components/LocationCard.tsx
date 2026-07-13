"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Location } from "@/lib/content";
import { mapsEmbedUrl } from "@/lib/content";

export default function LocationCard({ loc }: { loc: Location }) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
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

        <button
          type="button"
          onClick={() => setMapOpen((v) => !v)}
          aria-expanded={mapOpen}
          className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-ink/15 text-[0.7rem] transition-transform duration-300 ${
              mapOpen ? "rotate-45 bg-ink text-paper" : ""
            }`}
            aria-hidden
          >
            +
          </span>
          {mapOpen ? "Hide map" : "Show map"}
        </button>

        <AnimatePresence initial={false}>
          {mapOpen && (
            <motion.div
              key="map"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10 bg-tan">
                <iframe
                  title={`Map of Dramatics NYC at ${loc.street}`}
                  src={mapsEmbedUrl(loc.maps)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              </div>
              <a
                href={loc.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-3 inline-block text-sm font-semibold"
              >
                Open in Google Maps →
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
