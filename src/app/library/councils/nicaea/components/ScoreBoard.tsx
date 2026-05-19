"use client";

import { useState, useEffect, useCallback } from "react";
import { getLeaderboard } from "../services/firebaseGame";
import type { CouncilScore } from "../services/firebaseGame";
import { BYZ } from "./NicaeaGameShell";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScoreBoardProps {
  /** shareToken of the current player — their row is highlighted if present */
  currentShareToken: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreToLabel(score: number): string {
  if (score >= 1000) return "Champion of Nicaea";
  if (score >= 800)  return "Defender of the Faith";
  if (score >= 600)  return "Faithful Bishop";
  if (score >= 400)  return "Wavering Presbyter";
  if (score >= 200)  return "Swayed by Heresy";
  return "Lost to Arianism";
}

function formatName(displayName: string, userId: string): string {
  const lower = displayName.toLowerCase();
  const isAnon =
    !displayName.trim() ||
    lower.includes("anonymous") ||
    lower.includes("pilgrim");

  if (isAnon) {
    const suffix = userId.slice(-4).toUpperCase();
    return `Anonymous Bishop · ${suffix}`;
  }
  return displayName.length > 22
    ? displayName.slice(0, 20) + "…"
    : displayName;
}

function formatDate(createdAt: unknown): string {
  if (!createdAt || typeof (createdAt as { toDate?: unknown }).toDate !== "function") {
    return "—";
  }
  try {
    const date = (createdAt as { toDate: () => Date }).toDate();
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
}

const VERDICT_COLOR: Record<string, string> = {
  victory: BYZ.gold,
  draw: "#D4882A",
  defeat: "#CC3333",
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow({ index }: { index: number }) {
  return (
    <tr>
      {[28, 120, 48, 110, 44].map((w, col) => (
        <td
          key={col}
          style={{
            padding: "0.7rem 0.75rem",
            borderBottom: `1px solid ${BYZ.borderDim}`,
          }}
        >
          <div
            style={{
              width: w,
              height: 10,
              background: `rgba(139,105,20,${0.12 + (index % 2) * 0.06})`,
              borderRadius: 2,
              animation: `scoreSkeleton 1.4s ease-in-out infinite ${col * 0.08}s`,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScoreBoard({ currentShareToken }: ScoreBoardProps) {
  const [scores, setScores] = useState<CouncilScore[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await getLeaderboard("nicaea", 10);
    setScores(data);
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    void load();
  }, [load]);

  // Refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(() => void load(), 60_000);
    return () => clearInterval(id);
  }, [load]);

  const isEmpty = !loading && scores.length === 0;

  return (
    <>
      {/* Keyframes — injected once per render tree */}
      <style>{`
        @keyframes scoreSkeleton {
          0%,100% { opacity:.45; }
          50%      { opacity:.85; }
        }
      `}</style>

      <section
        aria-label="Global leaderboard"
        style={{
          width: "100%",
          marginTop: "0.5rem",
        }}
      >
        {/* Section title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.6rem",
          }}
        >
          <div
            aria-hidden
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to right, transparent, ${BYZ.border})`,
            }}
          />
          <p
            className="gold-shimmer"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Hall of the Fathers — Global Rankings
          </p>
          <div
            aria-hidden
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to left, transparent, ${BYZ.border})`,
            }}
          />
        </div>

        {/* Scroll wrapper for narrow viewports */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 380,
              borderCollapse: "collapse",
              border: `1px solid ${BYZ.borderDim}`,
              background: "rgba(0,0,0,0.20)",
            }}
          >
            {/* Column headers */}
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${BYZ.border}60`,
                  background: "rgba(0,0,0,0.28)",
                }}
              >
                {["Rank", "Name", "Score", "Verdict", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "0.58rem",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: BYZ.muted,
                      padding: "0.65rem 0.75rem",
                      textAlign: h === "Score" ? "right" : "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Loading skeletons */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} index={i} />
                ))}

              {/* Empty state */}
              {isEmpty && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "1.5rem",
                      textAlign: "center",
                      fontFamily: "var(--font-eb-garamond)",
                      fontSize: "0.95rem",
                      fontStyle: "italic",
                      color: BYZ.muted,
                      opacity: 0.75,
                    }}
                  >
                    No scores recorded yet. Be the first to defend the faith.
                  </td>
                </tr>
              )}

              {/* Score rows */}
              {!loading &&
                scores.map((entry, idx) => {
                  const rank = idx + 1;
                  const isCurrentPlayer =
                    currentShareToken !== null &&
                    entry.shareToken === currentShareToken;
                  const isFirst = rank === 1;

                  return (
                    <tr
                      key={entry.id}
                      style={{
                        borderBottom: `1px solid ${BYZ.borderDim}`,
                        background: isCurrentPlayer
                          ? "rgba(201,168,76,0.10)"
                          : idx % 2 === 0
                          ? "rgba(0,0,0,0.12)"
                          : "transparent",
                        outline: isCurrentPlayer
                          ? `1px solid ${BYZ.gold}50`
                          : "none",
                        outlineOffset: "-1px",
                        transition: "background 0.2s",
                      }}
                    >
                      {/* Rank */}
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          fontFamily: "var(--font-cinzel)",
                          fontSize: isFirst ? "1rem" : "0.78rem",
                          fontWeight: 700,
                          color: isFirst
                            ? BYZ.gold
                            : isCurrentPlayer
                            ? BYZ.goldLight
                            : BYZ.muted,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isFirst ? (
                          <span title="Top rank" aria-label="Crown — Rank 1">
                            ♛
                          </span>
                        ) : (
                          rank
                        )}
                      </td>

                      {/* Name */}
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          fontFamily: "var(--font-eb-garamond)",
                          fontSize: "0.97rem",
                          lineHeight: 1.4,
                          color: isCurrentPlayer ? BYZ.goldLight : BYZ.cream,
                          maxWidth: 160,
                        }}
                      >
                        {formatName(entry.displayName, entry.userId)}
                        {isCurrentPlayer && (
                          <span
                            style={{
                              fontFamily: "var(--font-cinzel)",
                              fontSize: "0.5rem",
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: BYZ.gold,
                              marginLeft: "0.45rem",
                              opacity: 0.85,
                              verticalAlign: "middle",
                            }}
                          >
                            You
                          </span>
                        )}
                      </td>

                      {/* Score */}
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          fontFamily: "var(--font-cinzel)",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: isCurrentPlayer ? BYZ.goldLight : BYZ.cream,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entry.score}
                      </td>

                      {/* Verdict label (derived from score) */}
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          fontFamily: "var(--font-eb-garamond)",
                          fontSize: "0.88rem",
                          fontStyle: "italic",
                          color: VERDICT_COLOR[entry.verdict] ?? BYZ.muted,
                        }}
                      >
                        {scoreToLabel(entry.score)}
                      </td>

                      {/* Date */}
                      <td
                        style={{
                          padding: "0.65rem 0.75rem",
                          fontFamily: "var(--font-cinzel)",
                          fontSize: "0.6rem",
                          letterSpacing: "0.08em",
                          color: BYZ.muted,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(entry.createdAt)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Refresh hint */}
        {!loading && (
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.52rem",
              letterSpacing: "0.1em",
              color: BYZ.muted,
              opacity: 0.55,
              textAlign: "right",
              marginTop: "0.35rem",
            }}
          >
            Refreshes every 60 s
          </p>
        )}
      </section>
    </>
  );
}
