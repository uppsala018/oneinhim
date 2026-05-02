import { NextResponse } from "next/server";
import { getBookCatalog } from "@/lib/server/full-kjv";

export const runtime = "nodejs";

export async function GET() {
  const books = await getBookCatalog();
  return NextResponse.json({ books });
}
