"use client";

import { useEffect, useRef } from "react";

type AutoVideoProps = {
  src: string;
  label: string;
  className?: string;
  /**
   * Defer the download until the video is about to scroll into view.
   * Use for anything below the fold; hero videos should stay eager.
   */
  lazy?: boolean;
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
export default function AutoVideo({ src, label, className, lazy = false }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Lazy videos get their src only when within ~300px of the viewport,
    // so phones don't download several MB of MP4 for sections never reached.
    let srcObserver: IntersectionObserver | null = null;
    if (lazy && !el.getAttribute("src")) {
      srcObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.src = src;
            el.load();
            srcObserver?.disconnect();
            srcObserver = null;
          }
        },
        { rootMargin: "300px 0px" }
      );
      srcObserver.observe(el);
    }

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
      srcObserver?.disconnect();
      el.removeEventListener("loadedmetadata", tryPlay);
      observer.disconnect();
      window.removeEventListener("touchstart", onFirstTouch);
      window.removeEventListener("click", onFirstTouch);
      window.removeEventListener("scroll", onFirstTouch);
    };
  }, [lazy, src]);

  return (
    <video
      ref={ref}
      src={lazy ? undefined : src}
      data-src={lazy ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload={lazy ? "none" : "metadata"}
      aria-label={label}
      className={className}
    />
  );
}
