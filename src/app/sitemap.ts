import type { MetadataRoute } from "next";

import { getAllBlogPosts, getAllTripSlugs } from "@/lib/api";
import { getSiteUrl } from "@/lib/seo";

/**
 * Mapa strony: strona główna, lista pielgrzymek, poradnik, blog
 * + podstrony wyjazdów i wpisów generowane z danych.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [slugs, posts] = await Promise.all([getAllTripSlugs(), getAllBlogPosts()]);

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/pielgrzymki`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/poradnik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/o-nas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...slugs.map((slug) => ({
      url: `${base}/pielgrzymki/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
