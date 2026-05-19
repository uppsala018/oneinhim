import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AriusArgument, DebateResponse, ResponseStrength } from "@/app/library/councils/nicaea/hooks/useNicaeaGame";
import { FALLBACK_ARGUMENTS } from "@/app/library/councils/nicaea/data/fallbackArguments";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Server-process-level cache — survives across re-renders within one server instance.
// Key: `${sessionId}:${roundNumber}`
const argumentCache = new Map<string, AriusArgument>();

// ─── Prompts ──────────────────────────────────────────────────────────────────

const ARIUS_SYSTEM = `You are Arius of Alexandria (c. 256–336 AD), a presbyter making heretical theological arguments at the Council of Nicaea in 325 AD. You argue that the Son (Jesus Christ) is a created being — the first and greatest of God's creations — but not co-equal or co-eternal with the Father.

Your arguments must be drawn ONLY from historically documented Arian positions, including:
- Arius's own Thalia (c. 320 AD)
- Letters of Arius to Eusebius of Nicomedia
- Letters of Arius to Alexander of Alexandria
- Common Arian proof texts: Proverbs 8:22, John 14:28, Mark 13:32, Colossians 1:15

Speak in first person as Arius. Be theologically precise, historically plausible, and rhetorically persuasive. You believe you are correct. Do not caricature your position — make the strongest possible case from your own sources.

Return ONLY valid JSON. No markdown, no preamble.`;

function buildUserPrompt(roundNumber: number): string {
  return `Generate a debate argument for round ${roundNumber} of 5. This should be argument #${roundNumber} in an escalating series — round 1 is your opening position, round 5 is your most sophisticated and difficult argument.

Return this exact JSON structure:
{
  "id": "round_${roundNumber}",
  "text": "Arius's argument in 2-3 sentences, spoken in first person, historically grounded",
  "historicalSource": "The primary source this draws from",
  "responses": [
    {
      "id": "response_a",
      "text": "A strong orthodox rebuttal (what Alexander or Athanasius would say)",
      "strength": "strong",
      "explanation": "Why this rebuttal works — the theological point it makes",
      "scriptureRef": "The scripture passage that supports this"
    },
    {
      "id": "response_b",
      "text": "A partially correct but incomplete rebuttal",
      "strength": "partial",
      "explanation": "What this gets right and what it misses",
      "scriptureRef": "Optional scripture"
    },
    {
      "id": "response_c",
      "text": "A weak or confused response that concedes too much",
      "strength": "weak",
      "explanation": "Why this response fails and plays into Arian logic"
    }
  ]
}`;
}

// ─── JSON parsing ─────────────────────────────────────────────────────────────

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return raw.slice(start, end + 1);
  }

  return raw.trim();
}

const VALID_STRENGTHS = new Set<ResponseStrength>(["strong", "partial", "weak"]);
const STRENGTH_ORDER: ResponseStrength[] = ["strong", "partial", "weak"];

function parseAndValidate(raw: string, roundNumber: number): AriusArgument {
  const jsonStr = extractJson(raw);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = JSON.parse(jsonStr) as Record<string, any>;

  if (!parsed || typeof parsed !== "object") throw new Error("Response is not an object");
  if (typeof parsed.text !== "string" || !parsed.text.trim()) throw new Error("Missing text");
  if (typeof parsed.historicalSource !== "string") throw new Error("Missing historicalSource");
  if (!Array.isArray(parsed.responses) || parsed.responses.length < 3) {
    throw new Error("responses must be an array of at least 3 items");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responses: DebateResponse[] = parsed.responses.slice(0, 3).map((r: any, i: number) => {
    const strength = VALID_STRENGTHS.has(r.strength as ResponseStrength)
      ? (r.strength as ResponseStrength)
      : STRENGTH_ORDER[i];

    const response: DebateResponse = {
      id: `r${roundNumber}-${["a", "b", "c"][i]}`,
      text: String(r.text ?? "").trim(),
      strength,
      explanation: String(r.explanation ?? "").trim(),
    };
    if (r.scriptureRef && typeof r.scriptureRef === "string" && r.scriptureRef.trim()) {
      response.scriptureRef = r.scriptureRef.trim();
    }
    return response;
  });

  return {
    id: `r${roundNumber}`,
    text: parsed.text.trim(),
    historicalSource: parsed.historicalSource.trim(),
    responses,
  };
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let roundNumber: number;
  let sessionId: string;

  try {
    const body = await request.json() as { roundNumber?: unknown; sessionId?: unknown };
    roundNumber = Number(body.roundNumber);
    sessionId = String(body.sessionId ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > 5) {
    return NextResponse.json({ error: "roundNumber must be an integer 1–5" }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const key = `${sessionId}:${roundNumber}`;

  const cached = argumentCache.get(key);
  if (cached) {
    return NextResponse.json(cached);
  }

  // ── Gemini API call ────────────────────────────────────────────────────────
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: ARIUS_SYSTEM,
    });

    const result = await model.generateContent(buildUserPrompt(roundNumber));
    const rawText = result.response.text();

    const argument = parseAndValidate(rawText, roundNumber);
    argumentCache.set(key, argument);
    return NextResponse.json(argument);
  } catch (err) {
    console.error(`[nicaea-arius] Gemini API failed for round ${roundNumber}:`, err);

    // ── Fallback ─────────────────────────────────────────────────────────────
    const fallback = FALLBACK_ARGUMENTS[roundNumber - 1];
    if (fallback) {
      argumentCache.set(key, fallback);
      return NextResponse.json(fallback);
    }

    return NextResponse.json(
      { error: "Could not generate argument and no fallback available" },
      { status: 500 }
    );
  }
}
