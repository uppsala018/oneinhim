// Client-side only — import this only from client components or hooks.
// Fetches Arius's debate arguments from the Claude API route and caches them
// in memory so component re-renders do not trigger duplicate API calls.

import type { AriusArgument } from "../hooks/useNicaeaGame";
import { FALLBACK_ARGUMENTS } from "../data/fallbackArguments";

// In-browser cache keyed by `${sessionId}:${roundNumber}`.
// Survives re-renders and StrictMode double-invocations within one page load.
const clientCache = new Map<string, AriusArgument>();

function cacheKey(sessionId: string, round: number): string {
  return `${sessionId}:${round}`;
}

/**
 * Fetch a unique Arius argument for `roundNumber` (1–5) from the Claude API.
 *
 * Call order:
 *   1. Return from in-memory cache if already fetched for this session + round.
 *   2. POST to /api/councils/nicaea/arius (which calls Claude and caches server-side).
 *   3. On any network or API failure, fall back to FALLBACK_ARGUMENTS.
 *
 * The `sessionId` should be stable for the duration of one game session.
 * Use `crypto.randomUUID()` at game start and pass it through for all 5 rounds.
 */
export async function fetchAriusArgument(
  roundNumber: number,
  sessionId: string
): Promise<AriusArgument> {
  if (roundNumber < 1 || roundNumber > 5) {
    return FALLBACK_ARGUMENTS[0];
  }

  const key = cacheKey(sessionId, roundNumber);
  const cached = clientCache.get(key);
  if (cached) return cached;

  try {
    const res = await fetch("/api/councils/nicaea/arius", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundNumber, sessionId }),
    });

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }

    const argument = (await res.json()) as AriusArgument;

    // Basic shape guard before caching — the API should always return valid
    // data, but guard against malformed responses from unexpected failures.
    if (
      !argument.id ||
      !argument.text ||
      !Array.isArray(argument.responses) ||
      argument.responses.length < 3
    ) {
      throw new Error("Response missing required fields");
    }

    clientCache.set(key, argument);
    return argument;
  } catch (err) {
    console.warn(
      `[ariusAI] Could not fetch round ${roundNumber} from API, using local fallback:`,
      err
    );

    const fallback = FALLBACK_ARGUMENTS[roundNumber - 1] ?? FALLBACK_ARGUMENTS[0];
    // Cache the fallback so subsequent calls don't retry the failing API
    clientCache.set(key, fallback);
    return fallback;
  }
}

/**
 * Pre-fetch all five rounds for a session in parallel.
 * Call this at game start to warm the cache before each round begins,
 * so players experience no loading delay when a round opens.
 */
export async function prefetchAllRounds(sessionId: string): Promise<void> {
  await Promise.allSettled(
    [1, 2, 3, 4, 5].map((round) => fetchAriusArgument(round, sessionId))
  );
}

/**
 * Clear the client-side cache for a specific session.
 * Call this on game reset so the next session gets fresh AI-generated arguments.
 */
export function clearSessionCache(sessionId: string): void {
  for (const round of [1, 2, 3, 4, 5]) {
    clientCache.delete(cacheKey(sessionId, round));
  }
}
