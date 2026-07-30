/**
 * Service price list — data pulled from dramaticsnyc.com/services/.
 * All prices are determined by the length and texture of hair.
 */

export type PricedService = {
  id: string;
  name: string;
  price: string;
  note?: string;
  description: string;
  /** extra search terms beyond the name */
  keywords: string[];
};

export type ServiceCategory = {
  id: string;
  title: string;
  blurb: string;
  items: PricedService[];
};

export const SERVICE_POLICIES = [
  "All prices are determined by the length and texture of hair.",
  "Work is guaranteed for 7 days.",
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
        id: "blow-dry",
        name: "Blow Dry",
        price: "$50 – $70",
        description:
          "Shampoo and condition at the sink, then a smooth professional blowout styled the way you like it.",
        keywords: ["blowout", "blow out", "styling", "wash"],
      },
      {
        id: "shampoo-cut",
        name: "Shampoo & Cut (Only)",
        price: "$44",
        note: "First available stylist — no booking needed",
        description:
          "A fresh, precise cut with the first available stylist. Walk right in.",
        keywords: ["haircut", "walk in", "quick", "cheap", "budget"],
      },
      {
        id: "shampoo-cut-style",
        name: "Shampoo, Cut & Style",
        price: "$70 – $90",
        note: "By appointment",
        description:
          "The full service — shampoo, precision cut, and a finished style to walk out with.",
        keywords: ["haircut", "trim", "restyle", "new look", "appointment"],
      },
      {
        id: "updos",
        name: "Updos",
        price: "$70 – $140",
        description:
          "Polished updos for weddings, galas, and nights out — pinned to last all evening.",
        keywords: ["wedding", "bridal", "event", "prom", "special occasion"],
      },
    ],
  },
  {
    id: "color",
    title: "Hair Coloring",
    blurb:
      "From subtle gray coverage to a full transformation, our color experts and educators are among the top in the field.",
    items: [
      {
        id: "single-process",
        name: "Single Process",
        price: "$85 – $95",
        note: "No PPD, no PTD",
        description:
          "All-over color in one application — ideal for gray coverage or a rich new shade.",
        keywords: ["cover my grays", "grays", "gray coverage", "root touch up", "roots"],
      },
      {
        id: "color-gloss",
        name: "Color Gloss",
        price: "$70 – $80",
        description:
          "Adds mirror shine and refreshes your tone between color appointments.",
        keywords: ["shine", "toner", "glaze"],
      },
      {
        id: "partial-highlights",
        name: "Partial Highlights",
        price: "$100 – $160",
        description:
          "Brightness where it counts — foils placed around your part and hairline.",
        keywords: ["foils", "face frame", "brighten"],
      },
      {
        id: "full-highlights",
        name: "Full Highlights",
        price: "$175 – $350",
        description:
          "Foils placed throughout the head for all-over dimension and brightness.",
        keywords: ["foils", "blonde", "blonding"],
      },
      {
        id: "double-process",
        name: "Double Process",
        price: "$125 – $250",
        description:
          "Lightening plus toning in a single visit for a complete color change.",
        keywords: ["bleach", "platinum", "color change", "blonde"],
      },
      {
        id: "balayage",
        name: "Balayage",
        price: "$195 – $325",
        description:
          "Hand-painted highlights for a soft, natural, sun-kissed look with an easy grow-out.",
        keywords: ["sun kissed", "ombre", "hand painted", "natural highlights"],
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
        name: "Conditioning Treatments",
        price: "$25 – $50",
        description:
          "Deep conditioning to restore moisture, softness, and manageability.",
        keywords: ["dry hair", "moisture", "hydration", "deep condition"],
      },
      {
        id: "dramaplex",
        name: "Dramaplex",
        price: "$35 – $60",
        description:
          "Bond-building treatment that repairs and strengthens chemically treated hair.",
        keywords: ["repair", "damaged hair", "bond builder", "strengthen", "dramoplex"],
      },
      {
        id: "botox",
        name: "Botox",
        price: "$90 – $150",
        description:
          "A reconstructing treatment that fills the hair fiber, smoothing frizz and adding body.",
        keywords: ["frizz", "smoothing", "reconstruct"],
      },
      {
        id: "keratin",
        name: "Keratin Treatment",
        price: "$175 – $375",
        note: "Formaldehyde-free option available",
        description:
          "Smooths and de-frizzes hair for months while keeping movement and shine.",
        keywords: ["straightening", "smoothing", "frizz", "brazilian"],
      },
      {
        id: "relaxer",
        name: "Relaxer Treatments",
        price: "$175 – $300",
        description:
          "Chemically relaxes tight curl patterns for easier, faster styling.",
        keywords: ["straighten", "curls", "curl pattern"],
      },
      {
        id: "volumizing",
        name: "Volumizing Treatments",
        price: "$175 – $275",
        description:
          "Adds lasting body and lift to fine or flat hair.",
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
