// Client-side only — import this only from client components or hooks.
// All functions guard against unconfigured Firebase and return safe fallbacks.

import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
  where,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "@/lib/firebase-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CouncilVerdict = "victory" | "defeat" | "draw";
export type CouncilDifficulty = "scholar" | "bishop" | "confessor";

export interface CouncilScoreData {
  displayName: string;
  council: string;
  score: number;
  verdict: CouncilVerdict;
  difficulty?: CouncilDifficulty;
  roundsWon: number;
  roundsLost: number;
}

export interface CouncilScore extends CouncilScoreData {
  id: string;
  userId: string;
  shareToken: string;
  difficulty: CouncilDifficulty;
  createdAt: Timestamp;
}

// council_sessions — for future multiplayer
export type SessionStatus = "waiting" | "active" | "complete";

export interface CouncilSession {
  id: string;
  sessionId: string;
  players: string[]; // array of userId
  status: SessionStatus;
  council: string;
  createdAt: Timestamp;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function generateShareToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// Ensures there is an authenticated Firebase user.
// Uses the existing signed-in user if present; otherwise signs in anonymously.
// This does not interfere with the project's Google/email auth — anonymous
// sessions are upgraded automatically when the user signs in properly.
async function ensureAuthUser() {
  if (!auth) throw new Error("Firebase Auth is not configured.");
  if (auth.currentUser) return auth.currentUser;
  const { user } = await signInAnonymously(auth);
  return user;
}

function toCouncilScore(id: string, data: Record<string, unknown>): CouncilScore {
  return {
    id,
    userId: String(data.userId ?? ""),
    displayName: String(data.displayName ?? "Pilgrim"),
    council: String(data.council ?? ""),
    score: Number(data.score ?? 0),
    verdict: (data.verdict as CouncilVerdict) ?? "defeat",
    difficulty: (data.difficulty as CouncilDifficulty) ?? "bishop",
    roundsWon: Number(data.roundsWon ?? 0),
    roundsLost: Number(data.roundsLost ?? 0),
    shareToken: String(data.shareToken ?? ""),
    createdAt: data.createdAt as Timestamp,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Saves a game score to `council_scores`.
 * Signs the user in anonymously if they have no Firebase session.
 * Returns the 8-character shareToken for the saved record.
 *
 * Requires a Firestore composite index: council ASC, score DESC.
 * Create it at: Firebase Console → Firestore → Indexes → Composite.
 */
export async function saveScore(data: CouncilScoreData): Promise<string> {
  if (!db) throw new Error("Firebase is not configured.");

  const user = await ensureAuthUser();
  const shareToken = generateShareToken();

  const resolvedDisplayName =
    data.displayName.trim() ||
    (user.isAnonymous ? "Anonymous Pilgrim" : (user.displayName ?? "Pilgrim"));

  await addDoc(collection(db, "council_scores"), {
    userId: user.uid,
    displayName: resolvedDisplayName,
    council: data.council,
    score: data.score,
    verdict: data.verdict,
    difficulty: data.difficulty ?? "bishop",
    roundsWon: data.roundsWon,
    roundsLost: data.roundsLost,
    shareToken,
    createdAt: serverTimestamp(),
  });

  return shareToken;
}

/**
 * Returns the top N scores for a given council, ordered by score descending.
 * Returns [] if Firebase is not configured or the query fails.
 */
export async function getLeaderboard(
  council: string,
  limitCount = 10
): Promise<CouncilScore[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, "council_scores"),
      where("council", "==", council),
      orderBy("score", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((snap) =>
      toCouncilScore(snap.id, snap.data() as Record<string, unknown>)
    );
  } catch {
    return [];
  }
}

/**
 * Looks up a single score record by its 8-character shareToken.
 * Returns null if not found or Firebase is not configured.
 */
export async function getScoreByShareToken(
  token: string
): Promise<CouncilScore | null> {
  if (!db) return null;

  try {
    const q = query(
      collection(db, "council_scores"),
      where("shareToken", "==", token),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const snap = snapshot.docs[0];
    return toCouncilScore(snap.id, snap.data() as Record<string, unknown>);
  } catch {
    return null;
  }
}
