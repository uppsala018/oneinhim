import { NextResponse } from "next/server";
import { getCatholicBookCatalog } from "@/lib/server/full-catholic";

export const runtime = "nodejs";

export async function GET() {
  const books = await getCatholicBookCatalog();
  return NextResponse.json({ books });
}
