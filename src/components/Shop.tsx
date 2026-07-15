import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { SITE } from "@/lib/content";
import { FEATURED_PRODUCTS, buyUrl } from "@/lib/shop";

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(rating) ? "text-coral" : "text-ink/15"}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-ink-mute">
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}

export default function Shop() {
  return (
    <section id="shop" className="relative bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="eyebrow text-coral">DNYC Professional Products</p>
            <h2 className="heading-fluid mt-5 font-display font-medium">
              Take the salon home.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-ink-soft">{SITE.productsBlurb}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={0.05 * i} y={40}>
              <div className="group card-soft flex h-full flex-col border border-ink/8 bg-paper p-3">
                <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-white">
                  <Image
                    src={p.image}
                    alt={`${p.name} — DNYC hair product`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em]">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="font-display text-lg font-semibold leading-tight">
                    {p.name}
                  </h3>
                  {p.rating ? (
                    <div className="mt-2">
                      <Stars rating={p.rating} count={p.reviewCount} />
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-1 flex-col justify-end gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
                    <span className="whitespace-nowrap font-display text-lg font-semibold text-coral">
                      {p.priceRange ?? p.price}
                    </span>
                    <a
                      href={buyUrl(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill w-full whitespace-nowrap px-5 py-2.5 text-[0.8rem] lg:w-auto"
                    >
                      {p.hasOptions ? "Choose Size" : "Add to Cart"}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="card-soft mt-12 flex flex-col items-start justify-between gap-6 bg-apricot p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h3 className="font-display text-2xl font-semibold sm:text-3xl">
                The full DNYC line
              </h3>
              <p className="mt-3 max-w-xl text-ink-soft">
                Shampoos, conditioners, treatments, and styling products —
                plus gift cards for any budget. Also available in every
                salon.
              </p>
            </div>
            <Link href="/shop" className="btn-pill shrink-0 px-7 py-3.5 text-sm">
              Shop All Products
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
