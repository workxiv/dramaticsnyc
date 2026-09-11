"use client";

import { useEffect, useRef } from "react";
import { Skyline } from "./NycArt";

/**
 * Footer skyline whose cars only drive while the divider is on screen,
 * restarting from the left each time it scrolls into view.
 */
export default function SkylineDivider() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Re-adding the class restarts the CSS animations from 0.
          el.classList.remove("skyline-live");
          void el.offsetWidth;
          el.classList.add("skyline-live");
        } else {
          el.classList.remove("skyline-live");
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex justify-center overflow-hidden bg-paper text-ink"
      aria-hidden
    >
      <Skyline className="w-full min-w-[880px] shrink-0" />
    </div>
  );
}
