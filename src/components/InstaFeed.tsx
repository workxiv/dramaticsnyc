import Image from "next/image";
import Reveal from "./Reveal";
import { IMG, SOCIAL } from "@/lib/content";

const INSTAGRAM_URL =
  SOCIAL.find((s) => s.label === "Instagram")?.href ??
  "https://instagram.com/dramaticsnycsalons";

function ReelVideo({ src, label }: { src: string; label: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="h-full w-full object-cover"
    />
  );
}

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
          <Reveal y={36}>
            <div className="card-soft relative aspect-[3/4] bg-tan">
              <ReelVideo
                src="/media/salon-reel-1.mp4"
                label="Inside a Dramatics NYC salon"
              />
            </div>
          </Reveal>
          <Reveal y={36} delay={0.06}>
            <div className="group card-soft relative aspect-[3/4] bg-tan">
              <Image
                src={IMG.colorVivid}
                alt="Vivid hair color by Dramatics NYC colorists"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="img-cover object-cover"
              />
            </div>
          </Reveal>
          <Reveal y={36} delay={0.12}>
            <div className="card-soft relative aspect-[3/4] bg-tan">
              <ReelVideo
                src="/media/salon-reel-2.mp4"
                label="Styling at Dramatics NYC"
              />
            </div>
          </Reveal>
          <Reveal y={36} delay={0.18}>
            <div className="group card-soft relative aspect-[3/4] bg-tan">
              <Image
                src={IMG.treatment}
                alt="Hair treatment service at Dramatics NYC"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="img-cover object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
