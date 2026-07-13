"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS, BOOKING_URL, PHONE_PRIMARY } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink/10 bg-paper/90 backdrop-blur-xl"
            : "border-b border-transparent bg-paper/60 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a
            href="/"
            className="font-display text-xl font-semibold tracking-tight"
            aria-label="Dramatics NYC home"
          >
            Dramatics NYC
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline text-[0.85rem] font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={BOOKING_URL}
              className="btn-pill hidden px-6 py-3 text-[0.82rem] sm:inline-flex"
            >
              Book Now
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 md:hidden"
              aria-label="Open menu"
            >
              <div className="space-y-[5px]">
                <span className="block h-px w-5 bg-ink" />
                <span className="block h-px w-5 bg-ink" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 py-6 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-semibold">
                Dramatics NYC
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-xl"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 * i + 0.1 }}
                  className="font-display text-4xl font-medium tracking-tight"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <div className="space-y-3">
              <a
                href={BOOKING_URL}
                className="btn-pill w-full py-4 text-sm"
              >
                Book an Appointment
              </a>
              <a
                href="/#salons"
                onClick={() => setOpen(false)}
                className="btn-pill-outline w-full py-4 text-sm"
              >
                Find Your Salon · {PHONE_PRIMARY}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
