import { NextRequest, NextResponse } from "next/server";
import { getLexiconEntry, resolveReference, searchBible } from "@/lib/server/full-kjv";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const exactReference = await resolveReference(q);
  const results = await searchBible(q, 20);
  const upper = q.toUpperCase();
  const mappedResults = results
    .filter((item) => item.id !== exactReference?.id)
    .map((item) => ({
      kind: "kjv-search",
      ...item,
      title: item.reference,
      detail: item.text,
    }));

  const exactReferenceResult = exactReference
    ? [
        {
          kind: "kjv-search" as const,
          ...exactReference,
          title: exactReference.reference,
          detail:
            exactReference.verse === 1 && !q.includes(":")
              ? `Jump to ${exactReference.chapterReference}`
              : exactReference.text,
        },
      ]
    : [];

  if (/^[GH]\d+$/.test(upper)) {
    const entry = await getLexiconEntry(upper);

    if (entry) {
      return NextResponse.json({
        results: [
          {
            kind: "strongs",
            id: entry.id,
            title: `${entry.id} ${entry.transliteration}`,
            detail: entry.definition,
            strongsId: entry.id,
          },
          ...exactReferenceResult,
          ...mappedResults,
        ],
      });
    }
  }

  return NextResponse.json({
    results: [...exactReferenceResult, ...mappedResults],
  });
}
