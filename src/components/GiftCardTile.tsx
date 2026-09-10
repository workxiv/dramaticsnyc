import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { giftCardUrl, type Location } from "@/lib/content";

/**
 * A gift card rendered as a shop item. eGift cards are sold and redeemed
 * through each salon's own booking system, so the buy button opens that
 * salon's eGift checkout in a new tab instead of adding to the bag.
 */
export default function GiftCardTile({
  loc,
  compact = false,
}: {
  loc: Location;
  compact?: boolean;
}) {
  const href = giftCardUrl(loc);
  return (
    <>
      <Link
        href="/shop/gift-cards"
        className="relative block aspect-square overflow-hidden rounded-[1.25rem] bg-cream"
        aria-label={`Gift card details for ${loc.name}`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-7">
          <div className="relative aspect-[1.6] w-full overflow-hidden rounded-xl bg-ink p-4 text-paper shadow-[0_18px_30px_rgba(23,21,14,0.22)] transition-transform duration-700 group-hover:-rotate-2 group-hover:scale-105 sm:rounded-2xl sm:p-5">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-coral/80 blur-2xl" />
            <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-lilac/40 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between">
              <BrandLogo variant="onDark" className="h-3 w-auto sm:h-4" />
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-paper/60 sm:text-[0.62rem]">
                  eGift Card
                </p>
                <p className="mt-0.5 font-display text-sm font-semibold leading-tight sm:text-lg">
                  {loc.name}
                </p>
              </div>
            </div>
          </div>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] backdrop-blur">
          Gift Cards
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-display text-lg font-semibold leading-tight">
          <Link href="/shop/gift-cards" className="hover:text-coral">
            {loc.name} Gift Card
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">
          Any amount from $25 to $500. Redeemable for services at {loc.street}.
        </p>
        <div
          className={`mt-4 flex min-w-0 flex-col gap-2.5 ${
            compact ? "" : "xl:flex-row xl:items-center xl:justify-between xl:gap-3"
          }`}
        >
          <span className="whitespace-nowrap font-display text-lg font-semibold text-coral">
            From $25
          </span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-pill w-full min-h-11 whitespace-nowrap px-4 py-2.5 text-center text-[0.8rem] ${
              compact ? "" : "xl:w-auto"
            }`}
          >
            Buy eGift Card
          </a>
        </div>
      </div>
    </>
  );
}
