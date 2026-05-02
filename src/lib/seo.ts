import type { Metadata } from "next";

const SITE = "One In Him Bible Study";
const BASE = "https://www.oneinhimbiblestudy.com";

export function buildMeta({
  title,
  description,
  keywords,
  path = "",
}: {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
}): Metadata {
  const full = `${title} | ${SITE}`;
  return {
    title: full,
    description,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title: full,
      description,
      url: `${BASE}${path}`,
      siteName: SITE,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: full, description },
    alternates: { canonical: `${BASE}${path}` },
  };
}
