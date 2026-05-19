import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ARIUS_SYSTEM = `You are Arius of Alexandria, debating at the First Council of Nicaea in 325 AD.
You hold that the Son of God is the greatest of all created beings — not eternal, not of the same substance as the Father.
The Father alone is unbegotten and truly eternal. The Son was begotten "before all ages" but had a beginning.
Your famous slogan: "There was a time when He was not."

You are articulate, philosophically trained, and deeply convinced you are protecting the monarchy of the Father.
Respond in 2-3 sentences, in first-person as Arius, defending your position against the bishop who just spoke.
Be historically authentic and theologically sharp — but ultimately arguing the losing side.`;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerArgument, round } = body as { playerArgument: string; round: number };

  if (!playerArgument || typeof round !== "number") {
    return NextResponse.json({ error: "Missing playerArgument or round" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: ARIUS_SYSTEM,
    });

    const result = await model.generateContent(
      `Round ${round} of 5. The bishop argues: "${playerArgument}"\n\nRespond as Arius in 2-3 sentences.`
    );

    const response = result.response.text();
    return NextResponse.json({ response });
  } catch (err) {
    console.error("[nicaea-ai] Gemini API failed:", err);
    return NextResponse.json(
      { response: "I maintain my position: the Son was begotten before all ages, the greatest of all that God has made — but made nonetheless." }
    );
  }
}
