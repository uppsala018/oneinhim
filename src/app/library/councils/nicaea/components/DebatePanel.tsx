"use client";

import { useState, useEffect, useCallback } from "react";
import type { DebateResponse, ResponseStrength } from "../hooks/useNicaeaGame";

// ─── Palette (self-contained — no BYZ import needed) ─────────────────────────

const C = {
  panelBg: "#3D2415",
  cardBg: "#2C1810",
  cardHoverBg: "#3A1E10",
  gold: "#C9A84C",
  goldLight: "#E8C96D",
  goldGlow: "rgba(201,168,76,0.35)",
  cream: "#F5E6C8",
  muted: "#B8956A",
  border: "#8B6914",
  borderDim: "rgba(139,105,20,0.38)",
  green: "#4A9B6F",
  greenBg: "rgba(74,155,111,0.18)",
  amber: "#D4882A",
  amberBg: "rgba(212,136,42,0.16)",
  red: "#8B1A1A",
  redBg: "rgba(139,26,26,0.20)",
} as const;

const LABELS = ["A", "B", "C"] as const;
const KEY_MAP: Record<string, number> = {
  "1": 0, A: 0,
  "2": 1, B: 1,
  "3": 2, C: 2,
};

// ─── Result configs ───────────────────────────────────────────────────────────

const RESULT_STYLE: Record<ResponseStrength, { bg: string; border: string; glow: string }> = {
  strong:  { bg: C.greenBg, border: C.green, glow: `0 0 14px rgba(74,155,111,0.45)` },
  partial: { bg: C.amberBg, border: C.amber, glow: `0 0 14px rgba(212,136,42,0.40)` },
  weak:    { bg: C.redBg,   border: C.red,   glow: `0 0 14px rgba(139,26,26,0.45)` },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" stroke={C.green} strokeWidth="1.5" />
      <path d="M5 9.5l3 3 5-5.5" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HalfCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" stroke={C.amber} strokeWidth="1.5" />
      {/* Filled left half */}
      <path d="M9 1a8 8 0 0 0 0 16V1z" fill={C.amber} opacity="0.7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" stroke={C.red} strokeWidth="1.5" />
      <path d="M6 6l6 6M12 6l-6 6" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ResultIcon({ strength }: { strength: ResponseStrength }) {
  if (strength === "strong")  return <CheckIcon />;
  if (strength === "partial") return <HalfCircleIcon />;
  return <XIcon />;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DebatePanelProps {
  responses: DebateResponse[];
  onSelect: (responseId: string) => void;
  selectedResponse: string | null;
  responseResult: ResponseStrength | null;
  isDisabled: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DebatePanel({
  responses,
  onSelect,
  selectedResponse,
  responseResult,
  isDisabled,
}: DebatePanelProps) {
  // Stagger: each card fades/slides in with a CSS transition after a timeout
  const [visible, setVisible] = useState([false, false, false]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Re-run stagger whenever responses change (new round loaded)
  useEffect(() => {
    setVisible([false, false, false]);
    const timers = [0, 150, 300].map((delay, i) =>
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev] as [boolean, boolean, boolean];
          next[i] = true;
          return next;
        });
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  // responses.length is the right dep — re-stagger when a new round provides new responses
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses.length, responses[0]?.id]);

  // Keyboard support: 1/2/3 or A/B/C
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isDisabled || selectedResponse !== null) return;
      // Don't steal keys when the user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const index = KEY_MAP[e.key.toUpperCase()];
      if (index !== undefined && responses[index]) {
        onSelect(responses[index].id);
      }
    },
    [isDisabled, selectedResponse, responses, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const isLocked = selectedResponse !== null || isDisabled;

  return (
    <div
      style={{
        background: C.panelBg,
        // Ornate double border: inner solid gold + outer dim ring
        border: `2px solid ${C.gold}`,
        outline: `1px solid ${C.goldGlow}`,
        outlineOffset: "4px",
        boxShadow: `0 0 20px rgba(201,168,76,0.10), inset 0 0 28px rgba(0,0,0,0.35)`,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      {/* Panel title */}
      <p
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.68rem",
          fontVariant: "small-caps",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: C.gold,
          margin: 0,
        }}
      >
        Choose Your Rebuttal
      </p>

      {/* Keyboard hint */}
      <p
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.55rem",
          letterSpacing: "0.14em",
          color: C.muted,
          opacity: 0.65,
          margin: "-0.4rem 0 0",
        }}
      >
        Press A B C or 1 2 3
      </p>

      {/* Response cards */}
      {responses.map((response, i) => {
        const isSelected = selectedResponse === response.id;
        const isOtherSelected = !isSelected && selectedResponse !== null;
        const result = isSelected ? responseResult : null;
        const isHovered = hoveredIndex === i && !isLocked;

        // Resolve visual state
        let bg: string = C.cardBg;
        let borderColor: string = C.border;
        let boxShadow: string = "none";
        let opacity: number = 1;

        if (isOtherSelected) {
          opacity = 0.4;
        } else if (isSelected && result) {
          const cfg = RESULT_STYLE[result];
          bg = cfg.bg;
          borderColor = cfg.border;
          boxShadow = cfg.glow;
        } else if (isSelected) {
          borderColor = C.gold;
          boxShadow = `0 0 10px ${C.goldGlow}`;
        } else if (isHovered) {
          bg = C.cardHoverBg;
          borderColor = C.gold;
          boxShadow = `0 0 8px ${C.goldGlow}`;
        }

        return (
          <button
            key={response.id}
            onClick={() => !isLocked && onSelect(response.id)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            disabled={isLocked}
            aria-pressed={isSelected}
            aria-label={`Response ${LABELS[i]}: ${response.text}`}
            className="nicaea-scroll-unfurl"
            style={{
              // CSS animation handles the entrance transform (scroll unfurl).
              // JS manages opacity separately — no conflict since keyframes only touch transform.
              animationDelay: `${i * 150}ms`,
              opacity: visible[i] ? opacity : 0,
              transition: "opacity 0.32s ease, background 0.22s, border-color 0.22s, box-shadow 0.22s",

              background: bg,
              border: `1px solid ${borderColor}`,
              boxShadow,
              padding: "0.95rem 1rem 0.95rem 0.9rem",
              textAlign: "left",
              cursor: isLocked ? "default" : "pointer",
              width: "100%",
              display: "grid",
              gridTemplateColumns: "2rem 1fr auto",
              gap: "0 0.75rem",
              alignItems: "flex-start",
            }}
          >
            {/* Letter label */}
            <span
              style={{
                fontFamily: "var(--font-cinzel-decorative)",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: isSelected && result
                  ? RESULT_STYLE[result].border
                  : isHovered
                  ? C.goldLight
                  : C.gold,
                lineHeight: 1,
                paddingTop: "0.15rem",
                transition: "color 0.2s",
                userSelect: "none",
              }}
              aria-hidden
            >
              {LABELS[i]}
            </span>

            {/* Response text */}
            <span
              style={{
                fontFamily: "var(--font-eb-garamond)",
                fontSize: "clamp(0.95rem, 2.2vw, 1.05rem)",
                lineHeight: 1.8,
                color: isOtherSelected ? C.muted : C.cream,
                display: "block",
                transition: "color 0.25s",
              }}
            >
              {response.text}
            </span>

            {/* Result icon — shown after judging */}
            <span
              style={{
                paddingTop: "0.2rem",
                flexShrink: 0,
                opacity: result ? 1 : 0,
                transition: "opacity 0.25s",
              }}
            >
              {result && <ResultIcon strength={result} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
