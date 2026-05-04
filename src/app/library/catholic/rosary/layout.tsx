import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "The Holy Rosary â€” Mysteries & Prayers",
  description: "Pray and study the Holy Rosary including the Joyful, Sorrowful, Glorious, and Luminous Mysteries with full prayers and reflections.",
  keywords: "holy rosary, rosary prayers, mysteries of the rosary, Catholic prayer, Catholic devotions",
  path: "/library/catholic/rosary",
});

export default function RosaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

