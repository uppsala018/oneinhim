import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/library/settings", "/api/"],
      },
    ],
    sitemap: "https://www.oneinhimbiblestudy.com/sitemap.xml",
    host: "https://www.oneinhimbiblestudy.com",
  };
}
