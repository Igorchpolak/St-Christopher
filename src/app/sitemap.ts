import type { MetadataRoute } from "next";

import { getAllTripSlugs } from "@/lib/api";
import { getSiteUrl } from "@/lib/seo";

/**
 * Mapa strony: strona główna + podstrony wyjazdów generowane z CMS-a.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const slugs = await getAllTripSlugs();

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: `${base}/pielgrzymki/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
