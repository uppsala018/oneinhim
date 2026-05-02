import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import CatholicReader from "@/components/catholic-reader";

export const metadata: Metadata = buildMeta({
  title: "Catholic Bible — Douay-Rheims & RSV-CE",
  description: "Read the Douay-Rheims and RSV-CE Catholic Bible with full deuterocanonical books. Free online Catholic scripture study with notes and bookmarks.",
  keywords: "Douay-Rheims bible, Catholic bible, RSV-CE, deuterocanonical books, Catholic scripture, bible study",
  path: "/library/catholic",
});

export default async function CatholicPage({
  searchParams,
}: {
  searchParams: Promise<{
    book?: string;
    chapter?: string;
    verse?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <CatholicReader
      initialReference={{
        book: params.book,
        chapter: params.chapter,
        verse: params.verse,
      }}
    />
  );
}
