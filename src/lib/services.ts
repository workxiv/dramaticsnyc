/**
 * Service price list — Fall 2026 pricing.
 * All prices are determined by the length and texture of hair.
 */

/** One row of the Short / Medium / Long breakdown. */
export type PriceTier = {
  label: string;
  price: string;
};

export type PricedService = {
  id: string;
  name: string;
  /** Headline range shown large on the card. */
  price: string;
  note?: string;
  description: string;
  /** Price by hair length / thickness (or another axis, e.g. touch-up vs. full head). */
  tiers?: PriceTier[];
  /** Small print under the tiers, e.g. "Hot tools additional". */
  footnote?: string;
  /** extra search terms beyond the name */
  keywords: string[];
};

export type AddOn = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  blurb: string;
  items: PricedService[];
  /** Compact add-ons strip shown after the price cards. */
  addOns?: AddOn[];
  /** One-line note shown after the add-ons, e.g. extensions by consultation. */
  footnote?: string;
};

/** The three standard length / thickness tiers. */
const SHORT = "Short / Fine";
const MEDIUM = "Medium";
const LONG = "Long / Thick";

const HOT_TOOLS_NOTE = "Hot tools (curling or flat iron) are additional.";

export const SERVICE_POLICIES = [
  "All prices are determined by the length and texture of hair.",
  "Work is guaranteed for 7 days.",
  "A 3% fee applies to all credit card transactions.",
  "MasterCard, Visa, and American Express accepted. Checks are not accepted.",
  "Taxes not included.",
] as const;

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "cut",
    title: "Cutting & Styling",
    blurb:
      "Are you looking for a whole new style, or a beautifully finished classic cut? Our stylists are here to take care of your hair.",
    items: [
      {
        id: "haircut-blowdry",
        name: "Haircut & Blowdry",
        price: "$70 – $90",
        description:
          "The full service — shampoo, precision haircut, and a finished blowdry to walk out with.",
        tiers: [
          { label: SHORT, price: "$70" },
          { label: MEDIUM, price: "$75 – $80" },
          { label: LONG, price: "$85 – $90" },
        ],
        footnote: HOT_TOOLS_NOTE,
        keywords: [
          "haircut",
          "trim",
          "restyle",
          "new look",
          "cut and style",
          "shampoo cut style",
          "blowout",
        ],
      },
      {
        id: "haircut",
        name: "Haircut",
        price: "$70",
        note: "By appointment & request",
        description:
          "Shampoo and a precise haircut, without the blowdry. Booked by appointment and by request.",
        keywords: ["haircut", "shampoo and cut", "cut only", "trim", "appointment"],
      },
      {
        id: "blow-dry",
        name: "Blowdry",
        price: "$50 – $70",
        description:
          "Shampoo and condition at the sink, then a smooth professional blowout styled the way you like it.",
        tiers: [
          { label: SHORT, price: "$50 – $55" },
          { label: MEDIUM, price: "$60 – $65" },
          { label: LONG, price: "$70" },
        ],
        footnote: HOT_TOOLS_NOTE,
        keywords: ["blowout", "blow out", "blow dry", "styling", "wash"],
      },
      {
        id: "updos",
        name: "Updo",
        price: "$70 – $150",
        note: "Consultation encouraged",
        description:
          "Polished updos for weddings, galas, and nights out — pinned to last all evening. Priced by consultation with your specialist.",
        keywords: ["wedding", "bridal", "event", "prom", "special occasion", "updos"],
      },
    ],
    addOns: [
      {
        id: "hot-tools",
        name: "Hot Tools",
        price: "$10 – $20",
        description: "Curling or flat iron finish. Varies by length and thickness.",
      },
      {
        id: "extra-length",
        name: "Extensions / Length",
        price: "+$15",
        description: "For excess length or texture.",
      },
    ],
    footnote: "Hair extensions: consultation required.",
  },
  {
    id: "color",
    title: "Hair Coloring",
    blurb:
      "From subtle gray coverage to a full transformation, our color experts and educators are among the top in the field.",
    items: [
      {
        id: "balayage",
        name: "Balayage",
        price: "$225 – $325",
        note: "Foiling only",
        description:
          "All-over hand-painted highlights for a soft, natural, sun-kissed look with an easy grow-out.",
        tiers: [
          { label: SHORT, price: "$225 – $250" },
          { label: MEDIUM, price: "$275 – $295" },
          { label: LONG, price: "$325" },
        ],
        keywords: ["sun kissed", "ombre", "hand painted", "natural highlights", "blonde"],
      },
      {
        id: "full-highlights",
        name: "Full Highlights",
        price: "$200 – $295",
        note: "Foiling only",
        description:
          "Foils placed throughout the head for all-over dimension and brightness.",
        tiers: [
          { label: SHORT, price: "$200" },
          { label: MEDIUM, price: "$275" },
          { label: LONG, price: "$295" },
        ],
        keywords: ["foils", "blonde", "blonding", "all over"],
      },
      {
        id: "half-highlights",
        name: "Half Highlights",
        price: "$160 – $200",
        note: "Foiling only",
        description:
          "Brightness where it counts — foils placed through the crown and hairline only.",
        tiers: [
          { label: SHORT, price: "$160" },
          { label: MEDIUM, price: "$185" },
          { label: LONG, price: "$200" },
        ],
        keywords: ["foils", "partial highlights", "partial", "crown", "brighten"],
      },
      {
        id: "face-frame",
        name: "Face Frame & Special FX",
        price: "$100 – $140",
        note: "Foiling only",
        description:
          "Foils around the hairline and sides, or a few placed foils for a special effect — money piece, streaks, or a pop of color.",
        tiers: [
          { label: "Special FX & per foil", price: "$100" },
          { label: "Hairline & sides", price: "$140" },
        ],
        keywords: [
          "money piece",
          "face framing",
          "streaks",
          "peekaboo",
          "special effects",
          "per foil",
        ],
      },
      {
        id: "double-process",
        name: "Double Process",
        price: "$125 – $300",
        note: "Consultation encouraged",
        description:
          "Bleach and tone in a single visit for a complete color change. Price varies by length and thickness.",
        tiers: [
          { label: "Touch up", price: "$125 – $195" },
          { label: "First time / full head", price: "$225 – $300" },
        ],
        keywords: ["bleach", "platinum", "color change", "blonde", "bleach and tone"],
      },
      {
        id: "single-process",
        name: "Single Process — Roots",
        price: "$85 – $95",
        note: "No PPD, no PTD",
        description:
          "Roots-only color for gray coverage — ideal between full applications.",
        tiers: [
          { label: SHORT, price: "$85" },
          { label: MEDIUM, price: "$90" },
          { label: LONG, price: "$95" },
        ],
        keywords: ["cover my grays", "grays", "gray coverage", "root touch up", "roots", "regrowth"],
      },
      {
        id: "single-process-full",
        name: "Single Process — Full Head",
        price: "$110 – $120",
        note: "No PPD, no PTD",
        description:
          "All-over color pulled through from roots to ends for gray coverage or a rich new shade.",
        tiers: [
          { label: SHORT, price: "$110" },
          { label: MEDIUM, price: "$115" },
          { label: LONG, price: "$120" },
        ],
        keywords: ["cover my grays", "grays", "gray coverage", "all over color", "pull through", "roots to ends"],
      },
      {
        id: "color-gloss",
        name: "Toner / Color Gloss",
        price: "$70 – $85",
        description:
          "Adds mirror shine and refreshes your tone between color appointments.",
        tiers: [
          { label: SHORT, price: "$70" },
          { label: MEDIUM, price: "$75 – $80" },
          { label: LONG, price: "$85" },
        ],
        keywords: ["shine", "toner", "glaze", "gloss"],
      },
      {
        id: "clear-gloss",
        name: "Clear Gloss",
        price: "$45 – $55",
        description: "A clear gloss for pure shine, with no change to your color.",
        tiers: [
          { label: SHORT, price: "$45" },
          { label: MEDIUM, price: "$50" },
          { label: LONG, price: "$55" },
        ],
        keywords: ["shine", "glaze", "gloss", "clear"],
      },
    ],
    addOns: [
      {
        id: "dramaplex",
        name: "Dramaplex",
        price: "$45",
        description: "Bond-building protection. Recommended with every foiling service.",
      },
      {
        id: "root-shadow",
        name: "Root Shadow",
        price: "$85",
        description: "Softens the grow-out on balayage and highlight services.",
      },
    ],
  },
  {
    id: "treatment",
    title: "Hair Treatments",
    blurb:
      "Reparative, smoothing, and strengthening treatments for healthier hair.",
    items: [
      {
        id: "conditioning",
        name: "Deep Conditioning",
        price: "$25 – $45",
        description:
          "Deep conditioning to restore moisture, softness, and manageability.",
        tiers: [
          { label: "Basic treatment", price: "$25" },
          { label: "Conditioning mask", price: "$45" },
        ],
        keywords: ["dry hair", "moisture", "hydration", "deep condition", "mask"],
      },
      {
        id: "keratin",
        name: "Keratin",
        price: "$175 – $350",
        description:
          "Smooths and de-frizzes hair for months while keeping movement and shine.",
        tiers: [
          { label: SHORT, price: "$175 – $200" },
          { label: MEDIUM, price: "$225 – $275" },
          { label: LONG, price: "$300 – $350" },
        ],
        keywords: ["straightening", "smoothing", "frizz", "brazilian"],
      },
      {
        id: "keratin-ff",
        name: "Formaldehyde-Free Keratin",
        price: "$225 – $375",
        description:
          "The same smoothing results with a formaldehyde-free formula.",
        tiers: [
          { label: SHORT, price: "$225 – $250" },
          { label: MEDIUM, price: "$300 – $325" },
          { label: LONG, price: "$350 – $375" },
        ],
        keywords: ["straightening", "smoothing", "frizz", "brazilian", "formaldehyde free", "keratin"],
      },
      {
        id: "botox",
        name: "Hair Botox",
        price: "$100 – $175",
        description:
          "A reconstructing treatment that fills the hair fiber, smoothing frizz and adding body.",
        tiers: [
          { label: SHORT, price: "$100" },
          { label: MEDIUM, price: "$150" },
          { label: LONG, price: "$175" },
        ],
        keywords: ["frizz", "smoothing", "reconstruct", "botox"],
      },
      {
        id: "relaxer",
        name: "Relaxers",
        price: "$175 – $300",
        description:
          "Chemically relaxes tight curl patterns for easier, faster styling.",
        tiers: [
          { label: SHORT, price: "$175 – $200" },
          { label: MEDIUM, price: "$225 – $250" },
          { label: LONG, price: "$275 – $300" },
        ],
        keywords: ["straighten", "curls", "curl pattern", "relaxer"],
      },
      {
        id: "volumizing",
        name: "Volumizing",
        price: "$175 – $300",
        description: "Adds lasting body and lift to fine or flat hair.",
        tiers: [
          { label: SHORT, price: "$175 – $200" },
          { label: MEDIUM, price: "$225 – $250" },
          { label: LONG, price: "$275 – $300" },
        ],
        keywords: ["volume", "fine hair", "flat hair", "body", "perm"],
      },
    ],
  },
];

/** Quick-search suggestion chips shown under the search box. */
export const SERVICE_SUGGESTIONS = [
  "Balayage",
  "Cover my grays",
  "Keratin",
  "Blowout",
  "Updo",
  "Highlights",
] as const;
