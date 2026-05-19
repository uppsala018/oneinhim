"use client";

import { useState, useEffect, useCallback, CSSProperties } from "react";
import Link from "next/link";
import type { GameState } from "../hooks/useNicaeaGame";
import ScoreBoard from "./ScoreBoard";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#2C1810",
  gold: "#C9A84C",
  goldLight: "#E8C96D",
  cream: "#F5E6C8",
  muted: "#B8956A",
  border: "#8B6914",
  borderDim: "rgba(139,105,20,0.38)",
  green: "#4A9B6F",
  amber: "#D4882A",
  red: "#8B1A1A",
} as const;

// ─── Verdict configs ──────────────────────────────────────────────────────────

const VERDICT_CFG = {
  victory: {
    banner: "VICTORY FOR ORTHODOXY",
    bannerBg: "rgba(201,168,76,0.16)",
    bannerBorder: C.gold,
    bannerGlow: "0 0 48px rgba(201,168,76,0.28)",
    headingColor: C.gold,
    historicalNote:
      "The council voted overwhelmingly to condemn Arianism. Arius was anathematized by name and his writings were ordered burned. Emperor Constantine exiled him to Illyricum. Only two bishops refused to sign the Creed and were likewise exiled — a decisive, near-unanimous verdict for orthodoxy.",
  },
  draw: {
    banner: "THE DEBATE CONTINUES",
    bannerBg: "rgba(212,136,42,0.14)",
    bannerBorder: C.amber,
    bannerGlow: "0 0 36px rgba(212,136,42,0.20)",
    headingColor: C.amber,
    historicalNote:
      "The real council of 325 AD reached a decisive vote — but the controversy did not end there. Arian sympathisers regrouped under Emperor Constantius II, who exiled orthodox bishops and nearly made Arianism the official theology of the empire. The Council of Constantinople in 381 AD was needed to finally settle the question.",
  },
  defeat: {
    banner: "HERESY GAINS GROUND",
    bannerBg: "rgba(139,26,26,0.20)",
    bannerBorder: C.red,
    bannerGlow: "0 0 36px rgba(139,26,26,0.28)",
    headingColor: "#CC3333",
    historicalNote:
      "Historically, Nicaea did not fail — but the temptation Arius represented was real and persistent. After 325 AD, Arian emperors rose to power, exiling orthodox bishops and suppressing the Creed. Athanasius was exiled five times for standing firm. One man's faithfulness, against the weight of imperial pressure, changed history.",
  },
} as const;

// ─── Static historical context (shown below verdict-specific note) ────────────

const NICAEA_FACT =
  "The First Council of Nicaea (325 AD) was attended by more than 300 bishops from across the Roman Empire. It produced the Nicene Creed, affirming that the Son is homoousios — 'of one substance with the Father.' Arius refused to sign and was sent into exile. The creed remains the common confession of Catholic, Orthodox, and most Protestant Christians to this day.";

// ─── Strength display ─────────────────────────────────────────────────────────

const STRENGTH_COLOR: Record<string, string> = {
  strong: C.green,
  partial: C.gold,
  weak: C.red,
};

const STRENGTH_LABEL: Record<string, string> = {
  strong: "Strong rebuttal",
  partial: "Partial rebuttal",
  weak: "Weak rebuttal",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface VerdictScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  shareToken: string | null;
}

// ─── Score count-up hook ──────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean): number {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active || target === 0) return;
    const steps = 60;
    const duration = 1000;
    const increment = target / steps;
    let current = 0;

    const id = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(target);
        clearInterval(id);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(id);
  }, [target, active]);

  return display;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VerdictScreen({
  gameState,
  onPlayAgain,
  shareToken,
}: VerdictScreenProps) {
  const { verdict, verdictLabel, score, roundHistory, isLoading, error } = gameState;

  // Animation stage gate — each section unlocks at its stage
  // 0: chi-rho  1: heading  2: banner  3: score  4: history+context  5: buttons
  const [stage, setStage] = useState(0);
  const [shareCardOpen, setShareCardOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "text" | null>(null);

  const displayScore = useCountUp(score, stage >= 3);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 1500),
      setTimeout(() => setStage(4), 2500),
      setTimeout(() => setStage(5), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const resolvedToken = shareToken ?? gameState.shareToken;
  const shareUrl = resolvedToken
    ? `https://oneinhimbiblestudy.com/library/councils/nicaea?result=${resolvedToken}`
    : null;
  const shareText = `I scored ${score}/1250 as Bishop Alexander at the Council of Nicaea. Verdict: ${verdictLabel ?? "Unknown"}. Can you defend the faith? oneinhimbiblestudy.com/library/councils/nicaea`;

  const copyToClipboard = useCallback(
    async (text: string, type: "link" | "text") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2500);
      } catch {
        // silent — clipboard not available
      }
    },
    []
  );

  if (!verdict) return null;

  const cfg = VERDICT_CFG[verdict];

  // Staged reveal helper — returns transition + visibility styles
  function reveal(atStage: number, slideFrom: "down" | "up" = "up"): CSSProperties {
    const visible = stage >= atStage;
    return {
      opacity: visible ? 1 : 0,
      transform: visible
        ? "translateY(0)"
        : slideFrom === "up"
        ? "translateY(18px)"
        : "translateY(-18px)",
      transition: "opacity 0.55s ease, transform 0.55s ease",
    };
  }

  return (
    <>
      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes chirhoPulse {
          0%,100% { opacity:.78; text-shadow:0 0 22px rgba(201,168,76,.40),0 0 44px rgba(201,168,76,.14); }
          50%      { opacity:1;   text-shadow:0 0 38px rgba(201,168,76,.78),0 0 72px rgba(201,168,76,.30); }
        }
        @keyframes bannerReveal {
          from { clip-path:inset(0 65% 0 0); opacity:0; }
          to   { clip-path:inset(0 0%  0 0); opacity:1; }
        }
        @keyframes scoreGlow {
          0%,100% { text-shadow:0 0 12px rgba(201,168,76,.25); }
          50%      { text-shadow:0 0 30px rgba(201,168,76,.72); }
        }
        @keyframes btnPulse {
          0%,100% { box-shadow:0 0 0px rgba(201,168,76,0); }
          50%      { box-shadow:0 0 20px rgba(201,168,76,.32); }
        }
        @keyframes dividerGrow {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
      `}</style>

      <div
        style={{
          minHeight: "calc(100dvh - 49px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 1.25rem 5rem",
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* Stage 0 — Chi-rho */}
        <div
          aria-hidden
          style={{
            fontSize: "clamp(3.5rem,12vw,5rem)",
            color: C.gold,
            lineHeight: 1,
            marginBottom: "1.1rem",
            fontFamily: "serif",
            animation: "chirhoPulse 3.5s ease-in-out infinite",
          }}
        >
          ☧
        </div>

        {/* Stage 1 — "The Council Has Spoken" */}
        <h1
          style={{
            fontFamily: "var(--font-cinzel-decorative)",
            fontSize: "clamp(1.05rem,3.8vw,1.65rem)",
            fontWeight: 900,
            color: C.cream,
            letterSpacing: "0.07em",
            textAlign: "center",
            margin: "0 0 1.75rem",
            ...reveal(1, "down"),
          }}
        >
          The Council Has Spoken
        </h1>

        {/* Ornamental divider */}
        <div
          aria-hidden
          style={{
            width: "100%",
            maxWidth: "380px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${C.border}, transparent)`,
            marginBottom: "1.75rem",
            animation: stage >= 1 ? "dividerGrow 0.6s ease forwards" : "none",
            opacity: stage >= 1 ? 1 : 0,
          }}
        />

        {/* Stage 2 — Verdict banner */}
        <div
          style={{
            width: "100%",
            border: `1px solid ${cfg.bannerBorder}`,
            background: cfg.bannerBg,
            boxShadow: stage >= 2 ? cfg.bannerGlow : "none",
            padding: "2rem 1.5rem 1.75rem",
            textAlign: "center",
            marginBottom: "1.5rem",
            animation: stage >= 2 ? "bannerReveal 0.65s ease forwards" : "none",
            opacity: stage >= 2 ? undefined : 0,
            transition: "box-shadow 1.2s ease",
          }}
        >
          {/* Verdict headline — gold-shimmer gives it a slow gleaming sweep */}
          <p
            className="gold-shimmer"
            style={{
              fontFamily: "var(--font-cinzel-decorative)",
              fontSize: "clamp(1.2rem,4.5vw,2.1rem)",
              fontWeight: 900,
              letterSpacing: "0.04em",
              lineHeight: 1.2,
              margin: "0 0 0.5rem",
            }}
          >
            {cfg.banner}
          </p>

          {/* Verdict label */}
          {verdictLabel && (
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.7rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: cfg.headingColor,
                opacity: 0.8,
                margin: "0 0 1.5rem",
              }}
            >
              {verdictLabel}
            </p>
          )}

          {/* Stage 3 — Score counter */}
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.15rem",
              padding: "0.8rem 2.25rem",
              border: `1px solid ${C.borderDim}`,
              background: "rgba(0,0,0,0.3)",
              ...reveal(3),
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.58rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.muted,
              }}
            >
              Final Score
            </span>
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "3rem",
                fontWeight: 700,
                color: C.cream,
                lineHeight: 1,
                animation: stage >= 3 ? "scoreGlow 2.5s ease-in-out infinite" : "none",
              }}
            >
              {displayScore}
            </span>
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                color: C.muted,
              }}
            >
              / 1250
            </span>
          </div>
        </div>

        {/* Stage 4 — Round history */}
        <div
          style={{
            width: "100%",
            marginBottom: "1.25rem",
            ...reveal(4),
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: "0.6rem",
            }}
          >
            Debate Record
          </p>

          <div
            style={{
              border: `1px solid ${C.borderDim}`,
              background: "rgba(0,0,0,0.22)",
            }}
          >
            {roundHistory.map((r, idx) => (
              <div
                key={r.round}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2rem 1fr auto",
                  gap: "0.4rem 0.8rem",
                  alignItems: "start",
                  padding: "0.85rem 1rem",
                  borderBottom:
                    idx < roundHistory.length - 1
                      ? `1px solid ${C.borderDim}`
                      : "none",
                }}
              >
                {/* Round number */}
                <span
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.muted,
                    paddingTop: "0.22rem",
                  }}
                >
                  R{r.round}
                </span>

                {/* Response text + strength */}
                <span>
                  <span
                    style={{
                      fontFamily: "var(--font-eb-garamond)",
                      fontSize: "0.95rem",
                      lineHeight: 1.72,
                      color: C.cream,
                      display: "block",
                    }}
                  >
                    {r.playerResponse}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "0.54rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: STRENGTH_COLOR[r.strength] ?? C.muted,
                      marginTop: "0.18rem",
                      display: "block",
                    }}
                  >
                    {STRENGTH_LABEL[r.strength] ?? r.strength}
                  </span>
                </span>

                {/* Points */}
                <span
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: STRENGTH_COLOR[r.strength] ?? C.muted,
                    whiteSpace: "nowrap",
                    paddingTop: "0.15rem",
                  }}
                >
                  +{r.pointsEarned}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 4 — Historical context */}
        <div
          style={{
            width: "100%",
            marginBottom: "1.25rem",
            border: `1px solid ${C.borderDim}`,
            background: "rgba(0,0,0,0.16)",
            padding: "1.1rem",
            ...reveal(4),
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: C.gold,
              opacity: 0.85,
              marginBottom: "0.65rem",
            }}
          >
            What Actually Happened at Nicaea
          </p>

          {/* Verdict-specific note */}
          <p
            style={{
              fontFamily: "var(--font-eb-garamond)",
              fontSize: "1rem",
              lineHeight: 1.82,
              color: C.cream,
              margin: "0 0 0.85rem",
            }}
          >
            {cfg.historicalNote}
          </p>

          {/* Divider */}
          <div
            aria-hidden
            style={{
              height: "1px",
              background: `linear-gradient(to right, transparent, ${C.borderDim}, transparent)`,
              marginBottom: "0.85rem",
            }}
          />

          {/* Static fact */}
          <p
            style={{
              fontFamily: "var(--font-eb-garamond)",
              fontSize: "0.92rem",
              lineHeight: 1.8,
              fontStyle: "italic",
              color: C.muted,
              borderLeft: `2px solid ${C.borderDim}`,
              paddingLeft: "0.9rem",
              margin: 0,
            }}
          >
            {NICAEA_FACT}
          </p>
        </div>

        {/* Share card — toggled by button */}
        {shareCardOpen && (
          <div
            style={{
              width: "100%",
              border: `1px solid rgba(201,168,76,0.45)`,
              background: "rgba(201,168,76,0.06)",
              padding: "1.1rem",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: "0.65rem",
              }}
            >
              Share Your Result
            </p>

            {/* Share text preview */}
            <p
              style={{
                fontFamily: "var(--font-eb-garamond)",
                fontSize: "0.98rem",
                lineHeight: 1.75,
                fontStyle: "italic",
                color: C.cream,
                margin: "0 0 0.65rem",
                background: "rgba(0,0,0,0.22)",
                border: `1px solid ${C.borderDim}`,
                padding: "0.7rem 0.85rem",
              }}
            >
              &ldquo;{shareText}&rdquo;
            </p>

            {/* Share URL */}
            {shareUrl && (
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: C.muted,
                  marginBottom: "0.75rem",
                  wordBreak: "break-all",
                  opacity: 0.85,
                }}
              >
                {shareUrl}
              </p>
            )}

            {/* Copy buttons */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {shareUrl && (
                <button
                  onClick={() => copyToClipboard(shareUrl, "link")}
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.gold}`,
                    color: copied === "link" ? C.green : C.gold,
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    transition: "color 0.25s",
                  }}
                >
                  {copied === "link" ? "✓ Link Copied" : "Copy Link"}
                </button>
              )}
              <button
                onClick={() => copyToClipboard(shareText, "text")}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.borderDim}`,
                  color: copied === "text" ? C.green : C.muted,
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  transition: "color 0.25s",
                }}
              >
                {copied === "text" ? "✓ Text Copied" : "Copy Text"}
              </button>
            </div>
          </div>
        )}

        {/* Saving indicator */}
        {isLoading && !gameState.shareToken && (
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.63rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.muted,
              textAlign: "center",
              opacity: 0.7,
              marginBottom: "0.75rem",
            }}
          >
            Recording to the council archives…
          </p>
        )}
        {error && (
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.63rem",
              color: C.muted,
              textAlign: "center",
              opacity: 0.75,
              marginBottom: "0.75rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Stage 5 — Action buttons */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            ...reveal(5),
          }}
        >
          {/* Play Again — illuminated manuscript button with periodic pulse */}
          <button
            onClick={onPlayAgain}
            style={{
              background: "transparent",
              border: `1px solid ${C.gold}`,
              color: C.gold,
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.84rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "1rem",
              cursor: "pointer",
              width: "100%",
              animation: stage >= 5 ? "btnPulse 3s ease-in-out infinite 0.8s" : "none",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(201,168,76,0.09)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            ↺ &nbsp; Play Again
          </button>

          {/* Share Your Result */}
          <button
            onClick={() => setShareCardOpen((v) => !v)}
            style={{
              background: shareCardOpen ? "rgba(201,168,76,0.05)" : "transparent",
              border: `1px solid ${C.borderDim}`,
              color: C.muted,
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.8rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "0.92rem",
              cursor: "pointer",
              width: "100%",
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = `rgba(201,168,76,0.55)`;
              b.style.color = C.cream;
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = C.borderDim;
              b.style.color = C.muted;
            }}
          >
            {shareCardOpen ? "▲  Hide Share Card" : "⊕  Share Your Result"}
          </button>

          {/* Try Another Council */}
          <Link
            href="/library/councils"
            style={{
              display: "block",
              background: "transparent",
              border: `1px solid ${C.borderDim}`,
              color: C.muted,
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.88rem",
              textAlign: "center",
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const a = e.currentTarget as HTMLAnchorElement;
              a.style.borderColor = `rgba(201,168,76,0.55)`;
              a.style.color = C.cream;
            }}
            onMouseLeave={(e) => {
              const a = e.currentTarget as HTMLAnchorElement;
              a.style.borderColor = C.borderDim;
              a.style.color = C.muted;
            }}
          >
            Try Another Council →
          </Link>
        </div>

        {/* Global leaderboard — shown below action buttons on verdict screen */}
        <div style={{ width: "100%", marginTop: "2rem", ...reveal(5) }}>
          <ScoreBoard currentShareToken={resolvedToken} />
        </div>
      </div>
    </>
  );
}
