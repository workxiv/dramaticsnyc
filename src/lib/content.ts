export const IMG = {
  heroPortrait: "/img/1492106087820-71f1a00d2b11.jpg",
  salonChairs: "/img/1600948836101-f9ffda59d250.jpg",
  colorVivid: "/img/1554519515-242161756769.jpg",
  styling: "/img/1562322140-8baeececf3df.jpg",
  /** real client results shot in our salons */
  cut: "/img/real-cut-style.jpg",
  treatment: "/img/real-treatment.jpg",
  salonPink: "/img/1521590832167-7bcbfaa6381f.jpg",
  salonBW: "/img/1560066984-138dadb4c035.jpg",
  salonModern: "/img/1633681926022-84c23e8cb2d6.jpg",
} as const;

/** First-party booking page — lists every salon's own online booking. */
export const BOOKING_URL = "/book";
export const PHONE_PRIMARY = "(212) 535-0073";

export const SITE = {
  tagline: "Hair Cuts & Color for New Yorkers",
  heroQuote:
    "We have 5 Hair Salon locations in Manhattan, all of them with a uniquely relaxing atmosphere.",
  heroQuoteAttribution: "Larry Kolber",
  servicesIntro:
    "Are you looking for a whole new style, or a beautifully finished classic cut? Our stylists are here to take care of your hair.",
  servicesDetail:
    "We have a price range and hair professionals for everyone. Feel free to discuss your expectations with our receptionist and they will do their best to make sure you are elated with the end result.",
  productsBlurb:
    "Our DNYC products are High quality and sumptuous, our products are made of up to 96% natural ingredients and are free from harsh chemicals which are bad for you, your hair and the environment.",
  giftCardQuote:
    "We offer a variety of wonderful GIFT CARD options to fit any budget. Just ask to buy a gift card online or when you come into the salon. You can define if the amount is worth it. They are good for up to one year. If you have any questions, please give us a call.",
  giftCardAttribution: "Larry Kolber",
  locationsQuote:
    "Dramatics NYC is a chain of hair salons in New York City. We have top haircut and color experts and educators in the field.",
  locationsAttribution: "Larry Kolber",
} as const;

export const ABOUT = {
  paragraphs: [
    "Dramatics NYC (DNYC) hair salons throughout New York City are helping to create the whole individual. Our clients get haircuts for many reasons like before a first date, before job interviews, and a night out on the town, so we help install confidence by making you look good and feel good.",
    "We inspire professional creativity and team building within our staff, clients, and everyone who enters. The atmosphere in every DNYC salon is relaxed and holistic; on occasion, our clients sometimes stop in on their coffee breaks just to get away from their everyday dread.",
    "Since 1984, Dramatics NYC is the most successful hair salon chain in New York.",
    "We are specialists in cutting & coloring techniques to give you an expert cut & color. Because we believe in education through innovation, frequent professional development, and training, we stay up to date on the latest trends and techniques to provide an uncompromising quality across all of our salons.",
  ],
} as const;

export const SOCIAL = [
  {
    label: "Instagram",
    href: "https://instagram.com/dramaticsnycsalons",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/DramaticsNYC",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/user/DramaticsNYCvideos",
  },
] as const;

export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
};

export const SERVICES: Service[] = [
  {
    id: "cut",
    index: "01",
    title: "Cutting & Styling Services",
    description: SITE.servicesDetail,
    image: IMG.cut,
  },
  {
    id: "color",
    index: "02",
    title: "Hair Coloring Services",
    description: SITE.servicesDetail,
    image: IMG.colorVivid,
  },
  {
    id: "treatment",
    index: "03",
    title: "Hair Treatment Services",
    description: SITE.servicesDetail,
    image: IMG.treatment,
  },
];

export const REVIEWS_URL =
  "https://www.google.com/maps/search/Dramatics+NYC+hair+salon+Manhattan";

export type Location = {
  id: string;
  /** URL slug — matches the original dramaticsnyc.com location URLs to preserve SEO equity */
  slug: string;
  name: string;
  neighborhood: string;
  street: string;
  cityLine: string;
  postalCode: string;
  phone: string;
  tel: string;
  email?: string;
  hours: string[];
  /** schema.org openingHours format for structured data */
  openingHours: string[];
  image: string;
  maps: string;
  bookingUrl: string;
  quote?: string;
};

/** Convert a Google Maps search link into an embeddable iframe URL. */
export function mapsEmbedUrl(maps: string) {
  try {
    const u = new URL(maps);
    const q = u.searchParams.get("q");
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
    }
  } catch {
    /* fall through */
  }
  return `${maps}${maps.includes("?") ? "&" : "?"}output=embed`;
}

export const LOCATIONS: Location[] = [
  {
    id: "34th",
    slug: "34th-street-salon",
    name: "34th St. Salon",
    neighborhood: "Murray Hill",
    street: "120 E. 34th St.",
    cityLine: "New York, NY 10016",
    postalCode: "10016",
    phone: "(212) 686-8430",
    tel: "+12126868430",
    hours: [
      "Mon–Sat 9:00 am – 7:00 pm",
      "Sunday Closed",
    ],
    openingHours: ["Mo-Sa 09:00-19:00"],
    image: IMG.salonModern,
    maps: "https://maps.google.com/?q=120+E+34th+St+New+York+NY+10016",
    bookingUrl: "https://dramatics34th.salontarget.com/",
    quote:
      "Our Dramatics NYC salon provides the perfect pitstop after a bustling day. Pop in to be pampered with one of our stylists or color experts.",
  },
  {
    id: "3rd",
    slug: "3rd-avenue-salon",
    name: "3rd Ave. Salon",
    neighborhood: "Upper East Side",
    street: "1488 3rd Ave.",
    cityLine: "New York, NY 10028",
    postalCode: "10028",
    phone: "(212) 535-0073",
    tel: "+12125350073",
    email: "3rdave@dramaticsnyc.com",
    hours: [
      "Mon–Sat 9:00 am – 7:00 pm",
      "Sun 9:00 am – 6:00 pm",
    ],
    openingHours: ["Mo-Sa 09:00-19:00", "Su 09:00-18:00"],
    image: IMG.salonPink,
    maps: "https://maps.google.com/?q=1488+3rd+Avenue+New+York+NY+10028",
    bookingUrl: "https://dramatics3rdave.salontarget.com/",
    quote:
      "With Dramatics NYC 3rd Ave. we created the best salon experience for our clients in New York City.",
  },
  {
    id: "57th",
    slug: "57th-street-salon",
    name: "57th St. Salon",
    neighborhood: "Parc Vendome",
    street: "352 W. 57th St.",
    cityLine: "In Parc Vendome Condominiums · New York, NY 10019",
    postalCode: "10019",
    phone: "(212) 586-1035",
    tel: "+12125861035",
    email: "57thst@dramaticsnyc.com",
    hours: [
      "Mon–Sat 9:00 am – 7:00 pm",
      "Sun 9:00 am – 6:00 pm",
    ],
    openingHours: ["Mo-Sa 09:00-19:00", "Su 09:00-18:00"],
    image: IMG.salonBW,
    maps: "https://maps.google.com/?q=352+W+57th+St+New+York+NY+10019",
    bookingUrl: "https://dramatics57th.salontarget.com/",
  },
  {
    id: "75th",
    slug: "dramatics-nyc-2146-broadway-hair-salon",
    name: "75th St. Salon",
    neighborhood: "Upper West Side",
    street: "2146 Broadway",
    cityLine: "New York, NY 10023",
    postalCode: "10023",
    phone: "(212) 496-6430",
    tel: "+12124966430",
    email: "info@dramaticsnyc.com",
    hours: [
      "Mon–Sat 9:00 am – 7:00 pm",
      "Sun 9:00 am – 6:00 pm",
    ],
    openingHours: ["Mo-Sa 09:00-19:00", "Su 09:00-18:00"],
    image: IMG.styling,
    maps: "https://maps.google.com/?q=2146+Broadway+New+York+NY+10023",
    bookingUrl: "https://dramaticsspa.salontarget.com/",
    quote:
      "Relax in an intimate salon space that is full of natural light and its triple aspect windows boast views",
  },
  {
    id: "91st",
    slug: "2468-broadway-salon",
    name: "91st St. Salon",
    neighborhood: "Upper West Side",
    street: "2468 Broadway",
    cityLine: "New York, NY 10025",
    postalCode: "10025",
    phone: "(212) 595-2830",
    tel: "+12125952830",
    hours: [
      "Mon–Sat 9:00 am – 7:00 pm",
      "Sun 9:00 am – 6:00 pm",
    ],
    openingHours: ["Mo-Sa 09:00-19:00", "Su 09:00-18:00"],
    image: IMG.salonChairs,
    maps: "https://maps.google.com/?q=2468+Broadway+New+York+NY+10025",
    bookingUrl: "https://dramatics2468broadway.salontarget.com/",
  },
];

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/#house" },
  { label: "Salons", href: "/#salons" },
  { label: "Shop", href: "/shop" },
  { label: "FAQ", href: "/#faq" },
];

export type Faq = {
  question: string;
  answer: string;
};

/** Visible FAQ content — mirrored 1:1 in FAQPage structured data (AEO). */
export const FAQS: Faq[] = [
  {
    question: "How do I book an appointment at Dramatics NYC?",
    answer:
      "Book online at dramaticsnyc.com/book, where you can choose your preferred salon and time. Each of our five Manhattan locations has its own online booking page, or you can call the salon directly — for example, (212) 535-0073 for our 1488 3rd Ave. salon.",
  },
  {
    question: "Where are Dramatics NYC hair salons located?",
    answer:
      "Dramatics NYC has 5 hair salon locations in Manhattan: 120 E. 34th St. (Murray Hill), 1488 3rd Ave. (Upper East Side), 352 W. 57th St. (in the Parc Vendome Condominiums), 2146 Broadway at 75th St., and 2468 Broadway at 91st St.",
  },
  {
    question: "What are Dramatics NYC's hours?",
    answer:
      "All Dramatics NYC salons are open Monday through Saturday from 9:00 am to 7:00 pm. On Sundays, most locations are open 9:00 am to 6:00 pm; the 120 E. 34th St. salon is closed on Sundays.",
  },
  {
    question: "What services does Dramatics NYC offer?",
    answer:
      "Dramatics NYC offers Cutting & Styling Services, Hair Coloring Services, and Hair Treatment Services. We have a price range and hair professionals for everyone — discuss your expectations with our receptionist and they will match you with the right stylist.",
  },
  {
    question: "Does Dramatics NYC sell gift cards?",
    answer:
      "Yes. Dramatics NYC offers gift card options to fit any budget, available online or in any salon. Gift cards are redeemable at your preferred DNYC location and are good for up to one year.",
  },
  {
    question: "Are DNYC hair products natural?",
    answer:
      "DNYC hair care products are made of up to 96% natural ingredients and are free from harsh chemicals. They are paraben and sulfate free, rich in Omega-3, Omega-6, and Omega-9, cruelty-free, and come in recyclable containers.",
  },
  {
    question: "How long has Dramatics NYC been in business?",
    answer:
      "Dramatics NYC has been in business since 1984 and is the most successful hair salon chain in New York, specializing in expert cutting and coloring techniques.",
  },
];
