import Reveal from "./Reveal";
import AutoVideo from "./AutoVideo";
import { SOCIAL } from "@/lib/content";

const INSTAGRAM_URL =
  SOCIAL.find((s) => s.label === "Instagram")?.href ??
  "https://instagram.com/dramaticsnycsalons";

const REELS = [
  {
    src: "/media/insta-storefront.mp4",
    label: "The Dramatics NYC storefront in Manhattan",
  },
  {
    src: "/media/insta-red-curls.mp4",
    label: "Rich red curls colored and styled at Dramatics NYC",
  },
  {
    src: "/media/insta-foiling.mp4",
    label: "A colorist foiling highlights at Dramatics NYC",
  },
  {
    src: "/media/insta-75th-broadway.mp4",
    label: "The corner of W 75th St and Broadway near our salon",
  },
];

export default function InstaFeed() {
  return (
    <section className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="eyebrow text-coral">Fresh from the salon floor</p>
            <h2 className="heading-fluid mt-5 font-display font-medium">
              @dramaticsnycsalons
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-outline px-7 py-3.5 text-sm"
            >
              Follow on Instagram
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {REELS.map((reel, i) => (
            <Reveal key={reel.src} y={36} delay={0.06 * i}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${reel.label} — watch more on Instagram`}
                className="group card-soft relative block aspect-[3/4] overflow-hidden bg-tan"
              >
                <AutoVideo
                  src={reel.src}
                  label={reel.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-paper/90 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  View on Instagram ↗
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
