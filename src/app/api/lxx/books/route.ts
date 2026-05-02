import { NextResponse } from "next/server";
import { getLxxBookCatalog } from "@/lib/server/full-lxx";

export const runtime = "nodejs";

export async function GET() {
  const books = await getLxxBookCatalog();

  return NextResponse.json({ books });
}
