import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import BuyPanel from "@/components/cart/BuyPanel";
import AddToCart from "@/components/cart/AddToCart";
import {
  SHOP_PRODUCTS,
  categoryHref,
  productBySlug,
  productPath,
  tintFor,
  toCartProduct,
} from "@/lib/shop";

const SITE_URL = "https://www.dramaticsnyc.com";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SHOP_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  const title = `${p.name} · ${p.detail.tagline}`;
  return {
    title,
    description: p.detail.summary,
    alternates: { canonical: `${SITE_URL}${productPath(p)}` },
    openGraph: {
      title: `${p.name} | Dramatics NYC`,
      description: p.detail.summary,
      url: `${SITE_URL}${productPath(p)}`,
      type: "website",
      images: [{ url: `${SITE_URL}${p.image}`, alt: p.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const d = p.detail;

  const pairs = d.pairsWith
    .map((id) => SHOP_PRODUCTS.find((x) => x.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const more = SHOP_PRODUCTS.filter(
    (x) => x.category === p.category && x.id !== p.id && !d.pairsWith.includes(x.id)
  ).slice(0, Math.max(0, 4 - pairs.length));
  const related = [...pairs, ...more].slice(0, 4);

  const lowest = Math.min(...p.variants.map((v) => v.cents));
  const highest = Math.max(...p.variants.map((v) => v.cents));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}${productPath(p)}#product`,
    name: p.name,
    description: d.summary,
    image: `${SITE_URL}${p.image}`,
    category: p.category,
    brand: { "@type": "Brand", name: "DNYC" },
    ...(p.sku ? { sku: p.sku } : {}),
    offers:
      p.variants.length > 1
        ? {
            "@type": "AggregateOffer",
            lowPrice: (lowest / 100).toFixed(2),
            highPrice: (highest / 100).toFixed(2),
            priceCurrency: "USD",
            offerCount: p.variants.length,
            availability: p.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${SITE_URL}${productPath(p)}`,
          }
        : {
            "@type": "Offer",
            price: (lowest / 100).toFixed(2),
            priceCurrency: "USD",
            availability: p.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${SITE_URL}${productPath(p)}`,
            seller: { "@type": "Organization", name: "Dramatics NYC" },
          },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 2, name: p.category, item: `${SITE_URL}${categoryHref(p.category)}` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}${productPath(p)}` },
    ],
  };

  const tint = tintFor(p.category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb]) }}
      />
      <Nav />
      <main className="bg-cream pt-24 sm:pt-32">
        <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-ink-mute">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/shop" className="hover:text-ink">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={categoryHref(p.category)} className="hover:text-ink">
                  {p.category}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-soft">{p.name}</li>
            </ol>
          </nav>

          {/* Hero: image + buy */}
          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div
                className={`card-soft relative aspect-square overflow-hidden ${tint}`}
              >
                <Image
                  src={p.image}
                  alt={`${p.name} by DNYC`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-10 drop-shadow-[0_24px_40px_rgba(23,21,14,0.18)] sm:p-14"
                />
                <Link
                  href={categoryHref(p.category)}
                  className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] backdrop-blur transition-colors hover:bg-ink hover:text-paper"
                >
                  {p.category}
                </Link>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {d.badges.map((b) => (
                  <li
                    key={b}
                    className="rounded-full border border-ink/15 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-soft"
                  >
                    {b}
                  </li>
                ))}
                <li className="rounded-full border border-ink/15 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                  Up to 96% natural
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 lg:pt-2">
              <p className="eyebrow text-coral">DNYC Professional</p>
              <h1 className="heading-fluid keep-case mt-4 font-display text-balance">
                {p.name}
              </h1>
              <p className="mt-3 text-lg text-ink-soft sm:text-xl">{d.tagline}</p>
              <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">{d.summary}</p>

              <dl className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-ink/10 bg-paper px-4 py-3">
                  <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-mute">
                    Hair type
                  </dt>
                  <dd className="mt-1 text-ink-soft">{d.hairType}</dd>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-paper px-4 py-3">
                  <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-mute">
                    Sizes
                  </dt>
                  <dd className="mt-1 text-ink-soft">
                    {p.variants.map((v) => v.label ?? "One size").join(" · ")}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <BuyPanel product={toCartProduct(p)} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
            <Reveal className="h-full">
              <section className="card-soft h-full border border-ink/10 bg-paper p-7 sm:p-8">
                <p className="eyebrow text-coral !text-xs">Why you&apos;ll love it</p>
                <h2 className="mt-3 font-display text-2xl font-semibold">Benefits</h2>
                <ul className="mt-5 space-y-3">
                  {d.benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-ink-soft">
                      <span className="mt-[0.35rem] h-2 w-2 shrink-0 rounded-full bg-coral" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal delay={0.08} className="h-full">
              <section className={`card-soft h-full ${tint} p-7 sm:p-8`}>
                <p className="eyebrow text-coral !text-xs">Directions</p>
                <h2 className="mt-3 font-display text-2xl font-semibold">How to use</h2>
                <ol className="mt-5 space-y-4">
                  {d.howToUse.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-paper">
                        {i + 1}
                      </span>
                      <span className="pt-1 leading-relaxed text-ink-soft">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>

            <Reveal delay={0.16} className="h-full">
              <section className="card-soft h-full border border-ink/10 bg-paper p-7 sm:p-8">
                <p className="eyebrow text-coral !text-xs">What&apos;s inside</p>
                <h2 className="mt-3 font-display text-2xl font-semibold">Key ingredients</h2>
                <ul className="mt-5 divide-y divide-ink/10">
                  {d.keyIngredients.map((k) => (
                    <li key={k.name} className="py-3 first:pt-0 last:pb-0">
                      <p className="font-semibold">{k.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{k.why}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-ink-mute">
                  Made in the USA. Free of parabens and sulfates, up to 96% natural
                  ingredients. Full ingredient list on pack.
                </p>
              </section>
            </Reveal>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-20">
              <Reveal>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow text-coral">Complete the routine</p>
                    <h2 className="heading-fluid mt-4 font-display">Goes well with</h2>
                  </div>
                  <Link
                    href="/shop"
                    className="btn-pill-outline shrink-0 px-6 py-3 text-sm"
                  >
                    Shop all products
                  </Link>
                </div>
              </Reveal>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {related.map((r, i) => (
                  <Reveal key={r.id} delay={0.05 * i} y={30} className="h-full">
                    <div className="group card-soft flex h-full flex-col border border-ink/8 bg-paper p-3">
                      <Link
                        href={productPath(r)}
                        className={`relative block aspect-square overflow-hidden rounded-[1.25rem] ${tintFor(r.category)}`}
                      >
                        <Image
                          src={r.image}
                          alt={`${r.name} by DNYC`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col p-3">
                        <Link href={productPath(r)}>
                          <h3 className="font-display text-lg font-semibold leading-tight hover:text-coral">
                            {r.name}
                          </h3>
                        </Link>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                          {r.detail.tagline}
                        </p>
                        <div className="mt-4">
                          <AddToCart product={toCartProduct(r)} compact />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
