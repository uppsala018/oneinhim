import { NextRequest, NextResponse } from "next/server";
import { getLexiconEntry } from "@/lib/server/full-kjv";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const entry = await getLexiconEntry(id.toUpperCase());

  if (!entry) {
    return NextResponse.json({ error: "Lexicon entry not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}
