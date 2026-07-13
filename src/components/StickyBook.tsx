"use client";

import { useEffect, useState } from "react";
import { BOOKING_URL, PHONE_PRIMARY } from "@/lib/content";

/**
 * Mobile-only sticky booking bar: keeps the primary conversion action
 * in the viewport at all times (the "two-click rule").
 */
export default function StickyBook() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur-lg transition-transform duration-500 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <a
          href={BOOKING_URL}
          className="btn-pill flex-1 py-3.5 text-sm"
        >
          Book an Appointment
        </a>
        <a
          href={`tel:${PHONE_PRIMARY.replace(/[^0-9]/g, "").replace(/^/, "+1")}`}
          className="btn-pill-outline px-5 py-3.5 text-sm"
          aria-label={`Call Dramatics NYC at ${PHONE_PRIMARY}`}
        >
          Call
        </a>
      </div>
    </div>
  );
}
