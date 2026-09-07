"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  SERVICE_CATEGORIES,
  SERVICE_SUGGESTIONS,
  type AddOn,
  type PricedService,
} from "@/lib/services";
import { BOOKING_URL } from "@/lib/content";

function matchesWords(hay: string, q: string) {
  const h = hay.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => h.includes(word));
}

function matches(item: PricedService, q: string) {
  const hay = [
    item.name,
    item.description,
    item.note ?? "",
    ...(item.tiers ?? []).map((t) => t.label),
    ...item.keywords,
  ].join(" ");
  return matchesWords(hay, q);
}

function matchesAddOn(addOn: AddOn, q: string) {
  return matchesWords(`${addOn.name} ${addOn.description}`, q);
}

const CATEGORY_BG = ["bg-apricot", "bg-pink", "bg-sage"];

export default function ServicesExplorer() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return SERVICE_CATEGORIES;
    return SERVICE_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => matches(item, q)),
      addOns: cat.addOns?.filter((a) => matchesAddOn(a, q)),
      // Only carry the footnote through when the full category is showing
      footnote: undefined,
    })).filter((cat) => cat.items.length > 0 || (cat.addOns?.length ?? 0) > 0);
  }, [query]);

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <div className="card-soft border border-ink/10 bg-paper p-2 pl-6">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-ink-mute">
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a cut, color, or treatment…"
              aria-label="Search services"
              className="w-full bg-transparent py-3 text-base outline-none placeholder:text-ink-mute"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="btn-pill-outline shrink-0 px-4 py-2 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SERVICE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className={`rounded-full border px-4 py-2 text-[0.8rem] font-semibold transition-colors ${
                query === s
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Category jump tabs (hidden while searching) */}
        {!query && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {SERVICE_CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="btn-pill-outline px-6 py-3 text-sm"
              >
                {cat.title}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Price lists */}
      {filtered.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="font-display text-2xl font-semibold">
            No services match &ldquo;{query}&rdquo;
          </p>
          <p className="mt-3 text-ink-soft">
            Try &ldquo;balayage&rdquo;, &ldquo;keratin&rdquo;, or clear the
            search to browse the full price list. You can also call us —
            we&apos;re happy to help you pick.
          </p>
        </div>
      ) : (
        filtered.map((cat) => {
          const catIndex = SERVICE_CATEGORIES.findIndex(
            (c) => c.id === cat.id
          );
          return (
            <section
              key={cat.id}
              id={cat.id}
              className="mx-auto mt-16 max-w-[1000px] scroll-mt-28 sm:mt-20"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-coral">Price List</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                    {cat.title}
                  </h2>
                </div>
                <p className="max-w-md text-sm text-ink-soft sm:text-right">
                  {cat.blurb}
                </p>
              </div>

              <div className="mt-7 space-y-3">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: 0.04 * i }}
                    className={`card-soft flex flex-col gap-3 border border-ink/8 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 ${
                      CATEGORY_BG[catIndex % CATEGORY_BG.length]
                    }`}
                  >
                    <div className="max-w-xl">
                      <h3 className="font-display text-xl font-semibold sm:text-2xl">
                        {item.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {item.description}
                      </p>
                      {item.note && (
                        <p className="mt-2 inline-block rounded-full bg-paper/70 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
                          {item.note}
                        </p>
                      )}
                      {item.tiers && (
                        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-3">
                          {item.tiers.map((tier) => (
                            <div key={tier.label} className="flex items-baseline gap-2">
                              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-mute">
                                {tier.label}
                              </dt>
                              <dd className="font-display text-[0.95rem] font-semibold tabular-nums">
                                {tier.price}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {item.footnote && (
                        <p className="mt-2 text-xs text-ink-mute">{item.footnote}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-5 sm:flex-col sm:items-end sm:gap-3">
                      <span className="font-display text-xl font-semibold sm:text-2xl">
                        {item.price}
                      </span>
                      <a
                        href={BOOKING_URL}
                        className="link-underline text-sm font-semibold"
                      >
                        Book →
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {cat.addOns && cat.addOns.length > 0 && (
                <div className="card-soft mt-4 border border-ink/8 bg-paper p-6 sm:p-7">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink-mute">
                    Add-ons
                  </p>
                  <ul className="mt-3 divide-y divide-ink/8">
                    {cat.addOns.map((addOn) => (
                      <li
                        key={addOn.id}
                        className="flex items-baseline justify-between gap-6 py-3"
                      >
                        <div>
                          <p className="font-display text-lg font-semibold">
                            {addOn.name}
                          </p>
                          <p className="mt-0.5 text-sm text-ink-soft">
                            {addOn.description}
                          </p>
                        </div>
                        <span className="shrink-0 font-display text-lg font-semibold tabular-nums">
                          {addOn.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {cat.footnote && (
                    <p className="mt-3 text-xs text-ink-mute">{cat.footnote}</p>
                  )}
                </div>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
