"use client";

import Image from "next/image";
import { motion } from "motion/react";
import AutoVideo from "./AutoVideo";
import { Sparkle, SwipeUnderline } from "./NycArt";
import { IMG, BOOKING_URL, SITE } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

const TRUST_CHIPS = [
  "Since 1984",
  "5 Manhattan locations",
  "Open Mon–Sat 9am–7pm",
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div className="mx-auto w-full max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto mb-7 flex flex-wrap items-center justify-center gap-2"
        >
          {TRUST_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-ink/15 bg-paper px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-soft"
            >
              {chip}
            </span>
          ))}
        </motion.div>

        <h1 className="display-fluid relative mx-auto max-w-5xl text-balance">
          {["Hair Cuts & Color", "for New Yorkers."].map((line, i) => (
            <span key={line} className="block overflow-visible">
              <motion.span
                className="block"
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.12 }}
              >
                {i === 0 ? (
                  <>
                    Hair Cuts &amp;{" "}
                    <span className="relative inline-block">
                      <em className="text-flow">Color</em>

                      {/* Sparkle burst popping out of "Color" */}
                      <span
                        className="pointer-events-none absolute -right-[0.3em] -top-[0.26em] block h-[0.32em] w-[0.32em]"
                        aria-hidden
                      >
                        {/* main sparkle: pops with overshoot, then lingers */}
                        <motion.span
                          className="absolute inset-0 text-coral"
                          initial={{ scale: 0, rotate: -40 }}
                          animate={{ scale: [0, 1.6, 0.85, 1], rotate: [-40, 15, 0, 0] }}
                          transition={{
                            duration: 0.7,
                            delay: 0.9,
                            times: [0, 0.45, 0.75, 1],
                            ease: "easeOut",
                          }}
                        >
                          <Sparkle className="animate-bob h-full w-full" />
                        </motion.span>
                        {/* mini pops that flash outward and vanish */}
                        <motion.span
                          className="absolute -left-[0.5em] top-[0.05em] h-[0.14em] w-[0.14em] text-[#f0439b]"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: [0, 1.2, 0],
                            opacity: [0, 1, 0],
                            x: ["0em", "-0.18em"],
                            y: ["0em", "-0.22em"],
                          }}
                          transition={{ duration: 0.6, delay: 1.02, ease: "easeOut" }}
                        >
                          <Sparkle className="h-full w-full" />
                        </motion.span>
                        <motion.span
                          className="absolute left-[0.28em] top-[0.3em] h-[0.1em] w-[0.1em] text-[#a34dff]"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: [0, 1.2, 0],
                            opacity: [0, 1, 0],
                            x: ["0em", "0.24em"],
                            y: ["0em", "0.1em"],
                          }}
                          transition={{ duration: 0.6, delay: 1.12, ease: "easeOut" }}
                        >
                          <Sparkle className="h-full w-full" />
                        </motion.span>
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="headline-swipe">
                    for New Yorkers.
                    <SwipeUnderline />
                  </span>
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink-soft sm:text-lg"
        >
          &ldquo;{SITE.heroQuote}&rdquo;{" "}
          <span className="text-ink-mute">— {SITE.heroQuoteAttribution}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.45 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={BOOKING_URL}
            className="btn-pill px-9 py-4 text-[0.95rem]"
          >
            Book an Appointment
          </a>
          <a href="#salons" className="btn-pill-outline px-9 py-4 text-[0.95rem]">
            Find Your Salon
          </a>
        </motion.div>

        {/* Rounded collage: real salon videos flanking the color portrait */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.55 }}
          className="mt-14 grid grid-cols-3 gap-3 sm:mt-16 sm:gap-5"
        >
          <div className="card-soft relative aspect-[3/4] overflow-hidden bg-apricot sm:mt-12">
            <AutoVideo
              src="/media/hero-cutting.mp4"
              label="A stylist cutting hair inside a Dramatics NYC salon"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="card-soft relative aspect-[3/4] bg-pink">
            <Image
              src={IMG.heroPortrait}
              alt="Hair coloring results by Dramatics NYC colorists"
              fill
              priority
              sizes="(max-width: 640px) 33vw, 30vw"
              className="object-cover"
            />
          </div>
          <div className="card-soft relative aspect-[3/4] overflow-hidden bg-lilac sm:mt-12">
            <AutoVideo
              src="/media/hero-flip.mp4"
              label="A client showing off a fresh style at Dramatics NYC"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
