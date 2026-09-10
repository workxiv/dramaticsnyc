export const fmtDate = (iso: string, withTime = false) =>
  new Date(iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}-04:00`).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "America/New_York",
  });

export const usd = (v: string | number) =>
  `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const STATUS_TONE: Record<string, string> = {
  processing: "bg-sage text-ink",
  completed: "bg-sage text-ink",
  refunded: "bg-lilac text-ink",
  cancelled: "bg-ink/10 text-ink-soft",
  pending: "bg-apricot text-ink",
  failed: "bg-coral/15 text-coral",
  "on-hold": "bg-apricot text-ink",
};
