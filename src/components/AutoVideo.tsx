"use client";

import { useEffect, useRef } from "react";

type AutoVideoProps = {
  src: string;
  label: string;
  className?: string;
};

/**
 * Autoplaying background video that works in Safari.
 *
 * React does not render the `muted` attribute into HTML (react#10389),
 * and Safari's autoplay policy requires the attribute to be present at
 * parse time — so JSX `muted` alone silently fails there. This component
 * sets muted/playsInline imperatively and calls play() itself, retrying
 * on visibility and first interaction (covers Safari Low Power Mode).
 */
export default function AutoVideo({ src, label, className }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("muted", "");

    const tryPlay = () => {
      if (el.paused) {
        el.play().catch(() => {
          /* blocked — retried below on visibility/interaction */
        });
      }
    };

    tryPlay();
    el.addEventListener("loadedmetadata", tryPlay);

    // Play only while on screen; also acts as a retry point for Safari.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    // Low Power Mode blocks all autoplay until the user interacts.
    const onFirstTouch = () => {
      tryPlay();
      window.removeEventListener("touchstart", onFirstTouch);
      window.removeEventListener("click", onFirstTouch);
      window.removeEventListener("scroll", onFirstTouch);
    };
    window.addEventListener("touchstart", onFirstTouch, { passive: true });
    window.addEventListener("click", onFirstTouch, { passive: true });
    window.addEventListener("scroll", onFirstTouch, { passive: true });

    return () => {
      el.removeEventListener("loadedmetadata", tryPlay);
      observer.disconnect();
      window.removeEventListener("touchstart", onFirstTouch);
      window.removeEventListener("click", onFirstTouch);
      window.removeEventListener("scroll", onFirstTouch);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
    />
  );
}
