type MarqueeProps = {
  items: string[];
  duration?: number;
  className?: string;
  separator?: string;
};

export default function Marquee({
  items,
  duration = 32,
  className = "",
  separator = "✦",
}: MarqueeProps) {
  const sequence = [...items, ...items];
  return (
    <div className={`marquee-paused overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max items-center whitespace-nowrap"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {sequence.map((item, i) => (
          <span key={i} className="flex items-center">
            <span>{item}</span>
            <span className="mx-6 opacity-50 sm:mx-10" aria-hidden>
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
