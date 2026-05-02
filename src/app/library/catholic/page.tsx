import CatholicReader from "@/components/catholic-reader";

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
