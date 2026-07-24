"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Sparkle,
  Taxi,
  Scissors,
  BlowDryer,
  SubwayTrain,
  SwipeUnderline,
} from "./NycArt";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Hero headline choreography (all loops are CSS-driven so they stay in sync):
 * - Subway train + taxi cross BEHIND the letters; a red car crosses in front.
 * - A stationary blow dryer parks next to "HAIR" and only those letters flutter.
 * - Scissors dive onto the period of "New Yorkers.", snip it off, it falls,
 *   then grows back.
 * - Stars pop out of "Color" in a tidy staggered burst; one lingers, twinkling.
 */

function HairWord() {
  return (
    <span className="relative inline-block">
      {/* stationary dryer aimed at the letters */}
      <span
        className="hero-actor hero-dryer absolute -left-[1em] top-[0.16em] hidden w-[0.78em] sm:block"
        aria-hidden
      >
        <BlowDryer className="animate-dryer-blow w-full" />
      </span>
      {["H", "a", "i", "r"].map((c, i) => (
        <span
          key={i}
          className="hair-blow inline-block"
          style={{ animationDelay: `${1 + i * 0.09}s` }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

const STAR_MINIS = [
  { px: "-0.34em", py: "-0.3em", delay: 0, color: "text-[#f0439b]", size: "h-[0.14em] w-[0.14em]", left: "-15%", top: "10%" },
  { px: "0.3em", py: "-0.34em", delay: 0.4, color: "text-[#a34dff]", size: "h-[0.11em] w-[0.11em]", left: "70%", top: "0%" },
  { px: "0.34em", py: "0.2em", delay: 0.8, color: "text-coral", size: "h-[0.12em] w-[0.12em]", left: "80%", top: "60%" },
];

function ColorWord() {
  return (
    <span className="relative inline-block">
      <span className="text-flow">Color</span>
      <span
        className="pointer-events-none absolute -right-[0.14em] -top-[0.2em] block h-[0.3em] w-[0.3em]"
        aria-hidden
      >
        {/* main star: one-time pop-in, then a gentle twinkle */}
        <motion.span
          className="absolute inset-0 text-coral"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: [0, 1.5, 0.9, 1], rotate: [-40, 12, 0, 0] }}
          transition={{ duration: 0.7, delay: 0.9, times: [0, 0.5, 0.8, 1], ease: "easeOut" }}
        >
          <span className="star-main block h-full w-full">
            <Sparkle className="h-full w-full" />
          </span>
        </motion.span>
        {/* mini pops on a clean stagger */}
        {STAR_MINIS.map((s, i) => (
          <span
            key={i}
            className={`star-pop absolute ${s.size} ${s.color}`}
            style={
              {
                left: s.left,
                top: s.top,
                "--px": s.px,
                "--py": s.py,
                animationDelay: `${1.6 + s.delay}s`,
              } as React.CSSProperties
            }
          >
            <Sparkle className="h-full w-full" />
          </span>
        ))}
      </span>
    </span>
  );
}

function PeriodWithScissors() {
  return (
    <span className="relative inline-block">
      <span className="hero-period inline-block">.</span>
      {/* scissors dive in from above, snip, and retreat */}
      <span
        className="hero-actor hero-scissors absolute -top-[0.72em] right-[-0.12em] hidden w-[0.52em] sm:block"
        aria-hidden
      >
        <Scissors className="w-full" />
      </span>
    </span>
  );
}

export default function HeroHeadline() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h1 className="display-fluid relative mx-auto max-w-5xl text-balance">
        <span className="block">
          Hair Cuts &amp; <em className="text-flow">Color</em>
        </span>
        <span className="headline-swipe block">
          for New Yorkers.
          <SwipeUnderline />
        </span>
      </h1>
    );
  }

  return (
    <h1 className="display-fluid relative mx-auto max-w-5xl">
      {/* ----- behind the letters: subway + taxi ----- */}
      <span className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="hero-actor hero-train absolute top-[56%] hidden w-[15em] max-w-[340px] sm:block">
          <span className="hero-train-rumble block">
            <SubwayTrain className="w-full" />
          </span>
        </span>
        <span className="hero-actor hero-taxi-behind absolute top-[24%] hidden w-[0.62em] sm:block">
          {/* taxi svg faces left; flip to face its left->right direction */}
          <Taxi className="w-full -scale-x-100" />
        </span>
      </span>

      <span className="relative z-[1] block">
        <motion.span
          className="block"
          initial={{ y: "40%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          <HairWord /> Cuts &amp; <ColorWord />
        </motion.span>
      </span>

      <span className="relative z-[1] block">
        <motion.span
          className="block"
          initial={{ y: "40%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.22 }}
        >
          <span className="headline-swipe">
            for New Yorkers
            <PeriodWithScissors />
            <SwipeUnderline />
          </span>
        </motion.span>
      </span>

      {/* ----- in front of the letters: red car, opposite direction ----- */}
      <span className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
        <span className="hero-actor hero-car-front absolute top-[76%] hidden w-[0.5em] sm:block">
          {/* faces left by default; driving right->left, so no flip */}
          <svg viewBox="0 0 72 40" className="w-full" aria-hidden>
            <rect x="4" y="16" width="60" height="14" rx="5" fill="#d14424" stroke="#17150e" strokeWidth="2" />
            <path d="M16 16c2-6 5-9 10-9h16c5 0 8 3 10 9" fill="#d14424" stroke="#17150e" strokeWidth="2" />
            <circle cx="18" cy="30" r="5" fill="#17150e" />
            <circle cx="18" cy="30" r="2" fill="#fbf8f1" />
            <circle cx="50" cy="30" r="5" fill="#17150e" />
            <circle cx="50" cy="30" r="2" fill="#fbf8f1" />
            <rect x="6" y="19" width="6" height="4" rx="1" fill="#fbf8f1" />
            <rect x="58" y="19" width="5" height="4" rx="1" fill="#8a1f08" />
          </svg>
        </span>
      </span>
    </h1>
  );
}
