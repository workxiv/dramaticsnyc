import type { MetadataRoute } from "next";
import { LOCATIONS } from "@/lib/content";

const SITE_URL = "https://www.dramaticsnyc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/book`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...LOCATIONS.map((l) => ({
      url: `${SITE_URL}/locations/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
