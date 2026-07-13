import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.dramaticsnyc.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Dramatics NYC | Hair Salon in Manhattan — Cuts, Color & Treatments at 5 Locations",
    template: "%s · Dramatics NYC",
  },
  description:
    "Dramatics NYC is a hair salon chain with 5 Manhattan locations offering Cutting & Styling, Hair Coloring, and Hair Treatment services since 1984. Book online or call your nearest salon — open Mon–Sat 9am–7pm.",
  keywords: [
    "Dramatics NYC",
    "hair salon NYC",
    "hair salon Manhattan",
    "haircut Manhattan",
    "hair color NYC",
    "hair salon Upper East Side",
    "hair salon Upper West Side",
    "hair salon Murray Hill",
    "hair salon 57th Street",
    "book hair appointment NYC",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Dramatics NYC | Hair Cuts & Color for New Yorkers",
    description:
      "5 Hair Salon locations in Manhattan since 1984. Cutting & Styling, Hair Coloring, and Hair Treatment services. Book your appointment online.",
    url: SITE_URL,
    siteName: "Dramatics NYC",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dramatics NYC | Hair Cuts & Color for New Yorkers",
    description:
      "5 Hair Salon locations in Manhattan since 1984. Book your appointment online.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
