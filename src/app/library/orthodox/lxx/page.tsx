import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { Suspense } from "react";
import LxxReader from "@/components/lxx-reader";

export const metadata: Metadata = buildMeta({
  title: "Septuagint (LXX) — Greek Old Testament",
  description: "Read the Brenton Septuagint, the Greek Old Testament used by the early church and Eastern Orthodox tradition. Free online LXX Bible reader.",
  keywords: "Septuagint, Brenton LXX, Greek Old Testament, Eastern Orthodox bible, Orthodox bible, early church",
  path: "/library/orthodox/lxx",
});

export default function OrthodoxLxxPage() {
  return (
    <Suspense>
      <LxxReader />
    </Suspense>
  );
}
