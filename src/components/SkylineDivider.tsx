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
    // The skyline is 880px wide and centered, so on narrow screens its left
    // part is clipped. Start the cars just left of the visible edge so they
    // roll into view right away instead of crossing the hidden part first.
    const setStart = () => {
      const hidden = Math.max(0, (880 - el.clientWidth) / 2);
      el.style.setProperty("--car-start", `${Math.round(hidden - 60)}px`);
    };
    setStart();
    window.addEventListener("resize", setStart);
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
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setStart);
    };
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
