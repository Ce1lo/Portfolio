import type { MetadataRoute } from "next";
import { site } from "@/content/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url.startsWith("http") ? site.url : "https://portfolio.local";
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
