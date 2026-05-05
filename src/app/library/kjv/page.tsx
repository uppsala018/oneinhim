import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import StudyWorkspace from "@/components/study-workspace";

export const metadata: Metadata = buildMeta({
  title: "KJV Bible with Strong's Concordance",
  description: "Read the King James Version Bible with full Strong's concordance. Click any word for original Hebrew and Greek definitions and biblical study tools.",
  keywords: "KJV bible, King James Version, Strong's concordance, biblical Greek, biblical Hebrew, bible study",
  path: "/library/kjv",
});
import { getBookCatalog } from "@/lib/server/full-kjv";

type BookMeta = Awaited<ReturnType<typeof getBookCatalog>>[number];

function normalizeKjvBookCode(bookCode: string | undefined, catalog: BookMeta[]) {
  const normalized = (bookCode ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (!normalized) {
    return "Gen";
  }

  const match = catalog.find((book) => {
    const bookCodeNormalized = book.code.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const bookNameNormalized = book.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return normalized === bookCodeNormalized || normalized === bookNameNormalized;
  });

  if (match) {
    return match.code;
  }

  if (normalized === "psalm" || normalized === "psalms" || normalized === "psa" || normalized === "ps") {
    return "Psa";
  }

  if (
    normalized === "song" ||
    normalized === "sos" ||
    normalized === "songofsongs" ||
    normalized === "songofsolomon"
  ) {
    return "Sng";
  }

  if (normalized === "rev" || normalized === "revelation" || normalized === "revelations") {
    return "Rev";
  }

  return "Gen";
}

export default async function KJVPage({
  searchParams,
}: {
  searchParams: Promise<{
    book?: string;
    chapter?: string;
    verse?: string;
  }>;
}) {
  const params = await searchParams;
  const bookCatalog = await getBookCatalog();

  return (
    <>
      <div className="sr-only">
        <h1>KJV Bible with Strong&apos;s Concordance — Free Online Bible Study</h1>
        <p>
          Read the complete King James Version Bible with integrated Strong&apos;s concordance numbers.
          Click any word to see the original Hebrew or Greek definition, cross-references, and study
          notes. Covers the full Old and New Testament with 66 books. Free to use for Bible study,
          research, and personal devotion.
        </p>
        <h2>Frequently asked questions</h2>
        <p>
          <strong>What is Strong&apos;s concordance?</strong>{" "}
          Strong&apos;s Exhaustive Concordance, compiled by James Strong in 1890, assigns a unique
          number to every original Hebrew and Greek word in the King James Bible. Clicking any word
          in this reader opens its Strong&apos;s entry showing the number, transliteration, definition,
          and all other places that word appears in Scripture.
        </p>
        <p>
          <strong>What translation is used here?</strong>{" "}
          The King James Version (KJV) is the primary translation. The Catholic reader offers the
          Douay-Rheims and RSV-CE editions. The Orthodox study path includes the Brenton English
          Septuagint.
        </p>
        <p>
          <strong>Is this Bible reader free?</strong>{" "}
          Yes, completely free. No account is required to read. Creating a free account lets you save
          bookmarks, personal notes, and highlights that sync across devices.
        </p>
        <p>
          <strong>How many books are in the King James Bible?</strong>{" "}
          The Protestant KJV contains 66 books — 39 in the Old Testament and 27 in the New Testament.
          The Catholic Douay-Rheims contains 73 books, adding the deuterocanonical books. Both are
          available in this library.
        </p>
      </div>
      <StudyWorkspace
        initialTab="reader"
        initialReference={{
          book: normalizeKjvBookCode(params.book, bookCatalog),
          chapter: params.chapter,
          verse: params.verse,
        }}
      />
    </>
  );
}

