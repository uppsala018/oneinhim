import StudyWorkspace from "@/components/study-workspace";
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
    <StudyWorkspace
      initialTab="reader"
      initialReference={{
        book: normalizeKjvBookCode(params.book, bookCatalog),
        chapter: params.chapter,
        verse: params.verse,
      }}
    />
  );
}
