import Image from "next/image";
import Reveal from "./Reveal";
import AutoVideo from "./AutoVideo";
import { ABOUT, IMG } from "@/lib/content";

const STATS = [
  { value: "1984", label: "Established" },
  { value: "5", label: "Manhattan salons" },
  { value: "Top", label: "Haircut & color experts" },
];

export default function About() {
  return (
    <section id="house" className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-stretch gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-coral">About Us</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="heading-fluid mt-5">
                The most <em className="text-flow">successful</em> hair salon
                chain in New York.
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

          <div className="lg:col-span-6 lg:flex lg:flex-col">
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:flex-1 lg:grid-rows-[auto_minmax(280px,1fr)]">
              <Reveal className="col-span-2" y={40}>
                <div className="group card-soft relative aspect-[16/10]">
                  <Image
                    src={IMG.salon57th}
                    alt="Inside a Dramatics NYC hair salon in Manhattan"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="img-cover object-cover grayscale"
                  />
                </div>
              </Reveal>
              <Reveal y={40} delay={0.08} className="lg:h-full">
                <div className="group card-soft relative aspect-[3/4] overflow-hidden lg:aspect-auto lg:h-full">
                  <AutoVideo
                    src="/media/about-styling.mp4"
                    label="A Dramatics NYC colorist applying treatment at the salon"
                    lazy
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal y={40} delay={0.16} className="lg:h-full">
                <div className="card-soft relative flex aspect-[3/4] flex-col justify-between bg-tan p-6 lg:aspect-auto lg:h-full">
                  <span className="font-display text-5xl leading-none">
                    &ldquo;
                  </span>
                  <p className="font-display text-lg font-medium leading-snug sm:text-xl">
                    I couldn&rsquo;t be happier with the results. The color is
                    absolutely stunning, and the haircut is not just a simple
                    trim, it&rsquo;s a work of art. I&rsquo;ve received so
                    many compliments and I feel more confident than ever.
                  </p>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Vialka G. · Verified client review
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
