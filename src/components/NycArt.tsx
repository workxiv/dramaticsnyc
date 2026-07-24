/**
 * Hand-drawn-style NYC accents used to spice up section corners.
 * Inline SVG so they stay crisp and inherit the design palette.
 */

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none">
      <path
        d="M20 2c1.5 8.5 4 14.5 18 18-14 3.5-16.5 9.5-18 18-1.5-8.5-4-14.5-18-18 14-3.5 16.5-9.5 18-18Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Taxi({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 56" className={className} aria-hidden fill="none">
      <rect x="6" y="26" width="84" height="20" rx="7" fill="#f7c948" />
      <path
        d="M22 27c3-8 7-12 14-12h22c7 0 11 4 14 12"
        fill="#f7c948"
        stroke="#17150e"
        strokeWidth="2.5"
      />
      <rect
        x="6"
        y="26"
        width="84"
        height="20"
        rx="7"
        stroke="#17150e"
        strokeWidth="2.5"
      />
      <path d="M40 16v10M56 16v10" stroke="#17150e" strokeWidth="2.5" />
      <rect x="40" y="8" width="16" height="8" rx="2" fill="#17150e" />
      <text
        x="48"
        y="15"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="bold"
        fill="#f7c948"
        fontFamily="sans-serif"
      >
        TAXI
      </text>
      <circle cx="26" cy="46" r="7" fill="#17150e" />
      <circle cx="26" cy="46" r="3" fill="#fbf8f1" />
      <circle cx="70" cy="46" r="7" fill="#17150e" />
      <circle cx="70" cy="46" r="3" fill="#fbf8f1" />
      <rect x="12" y="31" width="8" height="5" rx="1.5" fill="#fbf8f1" />
      <rect x="76" y="31" width="8" height="5" rx="1.5" fill="#d14424" />
    </svg>
  );
}

export function Scissors({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {/* blades point right, handles left, pivot at (28,32) */}
      <g className="scissors-blade-a">
        <path
          d="M28 32 L56 22c2.5-1 4 0.5 3 2.5L32 34Z"
          fill="#b9b4a6"
          stroke="#17150e"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="14" cy="41" rx="8" ry="6" transform="rotate(24 14 41)" fill="none" stroke="#17150e" strokeWidth="2.6" />
      </g>
      <g className="scissors-blade-b">
        <path
          d="M28 32 L56 42c2.5 1 4-0.5 3-2.5L32 30Z"
          fill="#d7d2c4"
          stroke="#17150e"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="14" cy="23" rx="8" ry="6" transform="rotate(-24 14 23)" fill="none" stroke="#17150e" strokeWidth="2.6" />
      </g>
      <circle cx="28" cy="32" r="3" fill="#17150e" />
    </svg>
  );
}

export function BlowDryer({ className = "" }: { className?: string }) {
  // Classic dryer silhouette pointing right: barrel, tapered nozzle,
  // angled handle, rear intake vent.
  return (
    <svg viewBox="0 0 88 72" className={className} aria-hidden fill="none">
      {/* handle (behind barrel) */}
      <g transform="rotate(16 30 36)">
        <rect x="22" y="34" width="15" height="28" rx="7" fill="#ffc6e1" stroke="#17150e" strokeWidth="2.4" />
        <rect x="26" y="40" width="7" height="5" rx="2" fill="#17150e" />
      </g>
      {/* cord */}
      <path d="M32 64c3 4 8 4 10 0s7-4 9 0" stroke="#17150e" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* barrel */}
      <rect x="6" y="10" width="44" height="28" rx="14" fill="#cba2ff" stroke="#17150e" strokeWidth="2.4" />
      {/* nozzle */}
      <path d="M50 17 L66 20 V28 L50 31 Z" fill="#cba2ff" stroke="#17150e" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="64" y="19" width="4" height="10" rx="1.5" fill="#17150e" />
      {/* rear intake vent */}
      <circle cx="16" cy="24" r="7" fill="#fbf8f1" stroke="#17150e" strokeWidth="2" />
      <path d="M13 21l6 6M13 27l6-6" stroke="#17150e" strokeWidth="1.6" strokeLinecap="round" />
      {/* barrel highlight */}
      <path d="M14 15c8-2.5 22-2.5 30 0" stroke="#fbf8f1" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      {/* air lines */}
      <g className="dryer-air" stroke="#d14424" strokeWidth="2.6" strokeLinecap="round" opacity="0.9">
        <path d="M72 19h9" />
        <path d="M72 24h14" />
        <path d="M72 29h9" />
      </g>
    </svg>
  );
}

export function SubwayTrain({ className = "" }: { className?: string }) {
  // Three-car NYC subway, front car on the right (travels left -> right)
  const car = (x: number, front = false) => (
    <g key={x} transform={`translate(${x} 0)`}>
      <rect x="0" y="6" width="92" height="32" rx={front ? 9 : 6} fill="#d7d2c4" stroke="#17150e" strokeWidth="2.2" />
      {/* windows */}
      <rect x="8" y="12" width="20" height="11" rx="3" fill="#fbf8f1" stroke="#17150e" strokeWidth="1.6" />
      <rect x="36" y="12" width="20" height="11" rx="3" fill="#fbf8f1" stroke="#17150e" strokeWidth="1.6" />
      <rect x="64" y="12" width="20" height="11" rx="3" fill="#fbf8f1" stroke="#17150e" strokeWidth="1.6" />
      {/* doors line */}
      <path d="M32 27h28" stroke="#17150e" strokeWidth="1.4" opacity="0.5" />
      {/* undercarriage + wheels */}
      <rect x="4" y="36" width="84" height="4" rx="2" fill="#17150e" opacity="0.85" />
      <rect x="12" y="40" width="14" height="5" rx="2.5" fill="#17150e" />
      <rect x="66" y="40" width="14" height="5" rx="2.5" fill="#17150e" />
      {front && (
        <>
          {/* headlight + route badge on the lead car */}
          <circle cx="86" cy="30" r="2.6" fill="#f7c948" stroke="#17150e" strokeWidth="1.4" />
          <circle cx="46" cy="30.5" r="5.5" fill="#d14424" />
          <text x="46" y="34" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fbf8f1" fontFamily="sans-serif">
            D
          </text>
        </>
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 300 46" className={className} aria-hidden fill="none">
      {car(0)}
      {car(102)}
      {car(204, true)}
      {/* couplers */}
      <rect x="92" y="20" width="10" height="5" rx="2" fill="#17150e" />
      <rect x="194" y="20" width="10" height="5" rx="2" fill="#17150e" />
    </svg>
  );
}

/* ----- Animated NYC skyline with lit windows, driving cars, beacon ----- */

const SKY_W = 1440;
const SKY_H = 140;

type Building = { x: number; w: number; h: number };

// Deterministic layout (same on server & client — no hydration mismatch)
const BUILDINGS: Building[] = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const list: Building[] = [];
  let x = -12;
  while (x < SKY_W + 12) {
    const w = 38 + Math.round(rand() * 58);
    const h = 34 + Math.round(rand() * 78);
    list.push({ x, w, h });
    x += w + 4 + Math.round(rand() * 8);
  }
  return list;
})();

function windowsFor(b: Building, bi: number) {
  const cells: { x: number; y: number; delay: number; lit: boolean }[] = [];
  const cols = Math.floor((b.w - 14) / 15);
  const rows = Math.floor((b.h - 18) / 17);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const k = bi * 97 + c * 13 + r * 31;
      cells.push({
        x: b.x + 9 + c * 15,
        y: SKY_H - b.h + 9 + r * 17,
        delay: (k % 47) / 10,
        lit: k % 3 !== 0, // 1/3 of windows twinkle, rest stay lit
      });
    }
  }
  return cells;
}

function MiniCar({
  body,
  taxi = false,
}: {
  body: string;
  taxi?: boolean;
}) {
  return (
    <>
      <rect x="0" y="-11" width="34" height="8" rx="3" fill={body} />
      <path d="M7 -11c1.5-4 3-5.5 7-5.5h7c4 0 5.5 1.5 7 5.5Z" fill={body} />
      {taxi && <rect x="13" y="-19" width="8" height="3.5" rx="1" fill="#17150e" />}
      <rect x="9" y="-15" width="6" height="3.5" rx="1" fill="#fbf8f1" opacity="0.85" />
      <rect x="18" y="-15" width="6" height="3.5" rx="1" fill="#fbf8f1" opacity="0.85" />
      <circle cx="8" cy="-2.5" r="3" fill="#17150e" />
      <circle cx="8" cy="-2.5" r="1.2" fill="#fbf8f1" />
      <circle cx="26" cy="-2.5" r="3" fill="#17150e" />
      <circle cx="26" cy="-2.5" r="1.2" fill="#fbf8f1" />
    </>
  );
}

export function Skyline({ className = "" }: { className?: string }) {
  // Stepped "Empire State" tower near the center
  const tower = { x: 686, w: 74 };
  return (
    <svg
      viewBox={`0 0 ${SKY_W} ${SKY_H}`}
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
      style={{ aspectRatio: `${SKY_W} / ${SKY_H}` }}
    >
      {/* buildings */}
      <g fill="currentColor">
        {BUILDINGS.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={SKY_H - b.h}
            width={b.w}
            height={b.h}
          />
        ))}
        {/* stepped tower */}
        <rect x={tower.x} y={SKY_H - 96} width={tower.w} height={96} />
        <rect x={tower.x + 13} y={SKY_H - 116} width={tower.w - 26} height={24} />
        <rect x={tower.x + 25} y={SKY_H - 130} width={tower.w - 50} height={18} />
        <rect x={tower.x + tower.w / 2 - 1.5} y={SKY_H - 139} width={3} height={12} />
      </g>

      {/* beacon on the spire */}
      <circle
        className="skyline-beacon"
        cx={tower.x + tower.w / 2}
        cy={SKY_H - 139}
        r="3.5"
        fill="var(--color-coral)"
      />

      {/* lit windows */}
      <g fill="var(--skyline-window, #f7c948)">
        {BUILDINGS.map((b, bi) =>
          windowsFor(b, bi).map((w, wi) =>
            w.lit ? (
              <rect
                key={`${bi}-${wi}`}
                className="skyline-window"
                x={w.x}
                y={w.y}
                width="6"
                height="8"
                rx="0.5"
                style={{ animationDelay: `${w.delay}s` }}
              />
            ) : (
              <rect
                key={`${bi}-${wi}`}
                x={w.x}
                y={w.y}
                width="6"
                height="8"
                rx="0.5"
                opacity="0.35"
              />
            )
          )
        )}
      </g>

      {/* traffic along the street */}
      <g transform={`translate(0 ${SKY_H})`}>
        <g className="skyline-car">
          <MiniCar body="#f7c948" taxi />
        </g>
        <g className="skyline-car-2">
          <MiniCar body="var(--color-coral)" />
        </g>
      </g>
    </svg>
  );
}

export function SubwayToken({
  letter = "D",
  className = "",
}: {
  letter?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#d14424" />
      <circle
        cx="32"
        cy="32"
        r="25"
        fill="none"
        stroke="#fbf8f1"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fontSize="30"
        fontWeight="bold"
        fill="#fbf8f1"
        fontFamily="sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}

export function SwipeUnderline() {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      aria-hidden
      fill="none"
    >
      <path
        d="M4 10C40 4 120 3 196 7"
        stroke="var(--color-coral)"
        strokeWidth="6"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}
