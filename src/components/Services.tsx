import Image from "next/image";
import Link from "next/link";
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
            <h2 className="heading-fluid mt-5 text-balance">
              Cutting, <em className="text-flow">color</em>
              {" & "}treatment for every New Yorker.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-ink-soft sm:text-lg">
              {SITE.servicesIntro}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={0.08 * i} y={40}>
              <div className={`group card-soft flex h-full flex-col ${CARD_BG[i]}`}>
                <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[1rem] sm:m-3 sm:rounded-[1.25rem]">
                  <Image
                    src={service.image}
                    alt={`${service.title} at Dramatics NYC in Manhattan`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="img-cover object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3 pt-1 sm:p-6 sm:pt-3">
                  <h3 className="font-display text-base font-semibold leading-tight sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-2 hidden flex-1 text-sm leading-relaxed text-ink-soft sm:mt-3 sm:block">
                    {service.description}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
                    <a
                      href={BOOKING_URL}
                      className="btn-flow px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm"
                    >
                      <span className="sm:hidden">Book</span>
                      <span className="hidden sm:inline">Book this service</span>
                    </a>
                    <Link
                      href={`/services#${service.id}`}
                      className="btn-pill-outline px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm"
                    >
                      <span className="sm:hidden">Prices</span>
                      <span className="hidden sm:inline">See prices</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="btn-pill-outline px-8 py-4 text-[0.9rem]"
            >
              View the full price list
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
