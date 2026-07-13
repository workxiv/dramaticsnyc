import Reveal from "./Reveal";
import Marquee from "./Marquee";
import { BOOKING_URL, REVIEWS_URL, SITE } from "@/lib/content";

const POINTS = [
  {
    title: "Book online in minutes",
    body: "Choose your salon and time online — no phone call needed. Each of our five locations has its own booking page.",
  },
  {
    title: "A stylist for everyone",
    body: SITE.servicesDetail,
  },
  {
    title: "Rated by New Yorkers",
    body: "Read real Google reviews from clients at every Dramatics NYC location before you book.",
  },
];

export default function Trust() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="border-b border-paper/10 py-4">
        <Marquee
          items={[
            "Cutting & Styling",
            "Hair Coloring",
            "Hair Treatments",
            "Five Manhattan Salons",
            "Book Online",
          ]}
          duration={30}
          separator="✦"
          className="font-display text-xl font-medium text-cream sm:text-2xl"
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-pink">Why book with us</p>
              <h2 className="heading-fluid mt-5 font-display font-medium text-balance">
                Top haircut &amp; color experts in the field.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <blockquote className="mt-6 max-w-md text-paper/70 sm:text-lg">
                &ldquo;{SITE.locationsQuote}&rdquo;
                <footer className="mt-3 text-sm text-paper/50">
                  — {SITE.locationsAttribution}
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href={BOOKING_URL}
                  className="btn-pill-light px-8 py-4 text-[0.9rem]"
                >
                  Book an Appointment
                </a>
                <a
                  href={REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline self-center text-sm font-medium text-paper/80 hover:text-paper"
                >
                  Read our Google reviews →
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-3">
              {POINTS.map((point, i) => (
                <Reveal key={point.title} delay={0.08 * i} y={36}>
                  <div className="card-soft h-full border border-paper/12 bg-paper/[0.04] p-6">
                    <span className="font-display text-3xl text-pink">
                      0{i + 1}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper/65">
                      {point.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
