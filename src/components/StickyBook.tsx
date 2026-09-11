"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/content";

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
          className="btn-flow flex-1 py-3.5 text-sm"
        >
          Book an Appointment
        </a>
        <Link
          href="/book"
          className="btn-pill-outline basis-[42%] py-3.5 text-base"
          aria-label="Call a Dramatics NYC salon"
        >
          Call
        </Link>
      </div>
    </div>
  );
}
