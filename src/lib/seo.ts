import type { Metadata } from "next";

const SITE = "One In Him Bible Study";
const BASE = "https://www.oneinhimbiblestudy.com";

const DEFAULT_OG_IMAGE = {
  url: `${BASE}/assets/art/hero-banner.png`,
  width: 1200,
  height: 630,
  alt: "One In Him Bible Study — KJV, Church Fathers & Church History",
};

export function buildMeta({
  title,
  description,
  keywords,
  path = "",
  image,
}: {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
}): Metadata {
  const full = `${title} | ${SITE}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;
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
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [ogImage.url],
    },
    alternates: { canonical: `${BASE}${path}` },
  };
}
