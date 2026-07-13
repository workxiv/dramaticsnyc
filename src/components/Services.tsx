import Image from "next/image";
import Reveal from "./Reveal";
import { BOOKING_URL, SERVICES, SITE } from "@/lib/content";

const CARD_BG = ["bg-apricot", "bg-pink", "bg-sage"];

export default function Services() {
  return (
    <section id="services" className="relative bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-coral">Hair Salon Services</p>
            <h2 className="heading-fluid mt-5 font-display font-medium text-balance">
              Cutting, color &amp; treatment for every New Yorker.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-ink-soft sm:text-lg">
              {SITE.servicesIntro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={0.08 * i} y={40}>
              <div className={`group card-soft flex h-full flex-col ${CARD_BG[i]}`}>
                <div className="relative m-3 aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={service.image}
                    alt={`${service.title} at Dramatics NYC in Manhattan`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="img-cover object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 pt-3">
                  <h3 className="font-display text-2xl font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {service.description}
                  </p>
                  <a
                    href={BOOKING_URL}
                    className="btn-pill mt-6 self-start px-6 py-3 text-sm"
                  >
                    Book this service
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
