import type { MetadataRoute } from "next";
import { site } from "@/content/portfolio";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = site.url.startsWith("http") ? site.url : "https://portfolio.local";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
