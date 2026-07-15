import Image from "next/image";
import Reveal from "./Reveal";
import { ABOUT, IMG } from "@/lib/content";

const STATS = [
  { value: "1984", label: "Established" },
  { value: "5", label: "Manhattan salons" },
  { value: "96%", label: "Natural ingredients" },
];

export default function About() {
  return (
    <section id="house" className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-coral">About Us</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="heading-fluid mt-5 font-display font-medium">
                The most successful hair salon chain in New York.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-7 space-y-5 text-ink-soft sm:text-lg">
                {ABOUT.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className={`card-soft p-4 sm:p-6 ${
                      ["bg-apricot", "bg-pink", "bg-sage"][i]
                    }`}
                  >
                    <div className="font-display text-3xl font-semibold sm:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-ink-soft sm:text-[0.72rem] sm:tracking-[0.12em]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <Reveal className="col-span-2" y={40}>
                <div className="group card-soft relative aspect-[16/10]">
                  <Image
                    src={IMG.salonBW}
                    alt="Inside a Dramatics NYC hair salon in Manhattan"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="img-cover object-cover"
                  />
                </div>
              </Reveal>
              <Reveal y={40} delay={0.08}>
                <div className="group card-soft relative aspect-[3/4]">
                  <Image
                    src={IMG.aboutStyle}
                    alt="A client with a fresh blowout at Dramatics NYC"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="img-cover object-cover"
                  />
                </div>
              </Reveal>
              <Reveal y={40} delay={0.16}>
                <div className="card-soft relative flex aspect-[3/4] flex-col justify-between bg-tan p-6">
                  <span className="font-display text-5xl leading-none">
                    &ldquo;
                  </span>
                  <p className="font-display text-lg font-medium leading-snug sm:text-xl">
                    Our clients get haircuts before first dates, job
                    interviews, and nights out — we help install confidence.
                  </p>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Dramatics NYC
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
