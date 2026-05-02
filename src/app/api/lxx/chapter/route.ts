import { NextRequest, NextResponse } from "next/server";
import { getLxxChapterData } from "@/lib/server/full-lxx";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const book = request.nextUrl.searchParams.get("book");
  const chapter = Number(request.nextUrl.searchParams.get("chapter"));

  if (!book || !Number.isFinite(chapter)) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }

  const chapterData = await getLxxChapterData(book, chapter);

  if (!chapterData) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json(chapterData);
}
