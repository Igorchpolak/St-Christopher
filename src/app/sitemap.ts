import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

// TODO: dodać przyszłe podstrony (/pielgrzymki/[slug], /blog/[slug], /poradnik,
// /o-nas), gdy powstaną – najlepiej generując wpisy z danych (getTripsByContinent,
// getBlogPosts), a nie z listy ręcznej.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
