import { NextRequest, NextResponse } from "next/server";
import { resolveLxxReference, searchLxx } from "@/lib/server/full-lxx";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const reference = await resolveLxxReference(query);
  const hits = await searchLxx(query, reference ? 19 : 20);
  const results = [
    ...(reference
      ? [
          {
            kind: "lxx-reference" as const,
            id: reference.id,
            title: reference.reference,
            detail: reference.text,
            reference: reference.reference,
            bookCode: reference.bookCode,
            book: reference.book,
            chapter: reference.chapter,
            verse: reference.verse,
            text: reference.text,
          },
        ]
      : []),
    ...hits.map((hit) => ({
      kind: "lxx-search" as const,
      id: hit.id,
      title: hit.reference,
      detail: hit.text,
      reference: hit.reference,
      bookCode: hit.bookCode,
      book: hit.book,
      chapter: hit.chapter,
      verse: hit.verse,
      text: hit.text,
      canonGroup: hit.canonGroup,
      canonStatus: hit.canonStatus,
    })),
  ];

  return NextResponse.json({ results });
}
