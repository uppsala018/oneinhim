import { NextRequest, NextResponse } from "next/server";
import {
  resolveCatholicReference,
  searchCatholicBible,
} from "@/lib/server/full-catholic";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const exactReference = await resolveCatholicReference(q);
  const results = await searchCatholicBible(q, 20);
  const mappedResults = results
    .filter((item) => item.id !== exactReference?.id)
    .map((item) => ({
      kind: "catholic-search",
      ...item,
      title: item.reference,
      detail: item.text,
    }));

  const exactReferenceResult = exactReference
    ? [
        {
          kind: "catholic-search" as const,
          ...exactReference,
          title: exactReference.reference,
          detail:
            exactReference.verse === 1 && !q.includes(":")
              ? `Jump to ${exactReference.chapterReference}`
              : exactReference.text,
        },
      ]
    : [];

  return NextResponse.json({
    results: [...exactReferenceResult, ...mappedResults],
  });
}
