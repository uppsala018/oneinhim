import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/user-panel",
          "/beta-dashboard",
          "/beta-tester",
          "/admin/",
          "/library/settings",
          "/library/notes",
          "/library/prayer-forum/new-thread",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.oneinhimbiblestudy.com/sitemap.xml",
    host: "https://www.oneinhimbiblestudy.com",
  };
}
