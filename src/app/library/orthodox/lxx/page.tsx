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
    <>
      <div className="sr-only">
        <h1>Septuagint (LXX) — Greek Old Testament Online Reader</h1>
        <p>
          Read the Septuagint online — the Greek translation of the Hebrew Old Testament
          completed by Jewish scholars in Alexandria between the 3rd and 1st centuries BC.
          The Septuagint (abbreviated LXX, from the Latin for seventy, referring to the
          seventy-two translators of tradition) was the primary Bible of the early church,
          quoted extensively by the New Testament authors and the Church Fathers. It remains
          the canonical Old Testament of the Eastern Orthodox Church today. This reader uses
          the Brenton English Translation (1851) of the Septuagint — the standard English
          edition of the LXX used for study, comparison, and research. The Septuagint differs
          from the Hebrew Masoretic Text in several books, includes the deuterocanonical books
          accepted by Catholic and Orthodox traditions, and reflects ancient textual traditions
          predating the Masoretic standardization. Essential for patristic study, Orthodox
          theology, and New Testament textual scholarship.
        </p>
      </div>
      <Suspense>
        <LxxReader />
      </Suspense>
    </>
  );
}

