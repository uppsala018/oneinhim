"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNicaeaGame } from "../hooks/useNicaeaGame";
import type { DebateResponse, ResponseStrength, GameState } from "../hooks/useNicaeaGame";
import DebatePanel from "./DebatePanel";
import VerdictScreen from "./VerdictScreen";
import ScoreBoard from "./ScoreBoard";
import { BYZ } from "../constants";

// ─── Web Audio API sound utilities ───────────────────────────────────────────
// All sounds generated programmatically — no audio file dependencies.
// AudioContext is created lazily after the first user gesture (browser policy).

let _audioCtx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_audioCtx || _audioCtx.state === "closed") {
      _audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    if (_audioCtx.state === "suspended") _audioCtx.resume();
    return _audioCtx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType = "triangle",
  gain = 0.22
) {
  const ctx = ac();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
    g.gain.setValueAtTime(0.001, ctx.currentTime + startAt);
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + startAt + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + duration + 0.05);
  } catch {
    // AudioContext unavailable — silent fallback
  }
}

// Low resonant organ tones — played at debate start / round start
function playDebateStart() {
  tone(110, 0.0, 1.2, "triangle", 0.28);
  tone(165, 0.3, 0.9, "triangle", 0.20);
  tone(220, 0.6, 0.8, "triangle", 0.18);
  tone(165, 0.6, 0.6, "sine", 0.10);
}

// Triumphant ascending C-major chord
function playStrongRebuttal() {
  tone(261, 0.00, 1.0, "triangle", 0.22);
  tone(329, 0.06, 0.95, "triangle", 0.18);
  tone(392, 0.12, 0.90, "triangle", 0.15);
  tone(523, 0.22, 0.80, "sine", 0.12);
}

// Neutral two-note — partial success
function playPartialRebuttal() {
  tone(330, 0.0, 0.55, "sine", 0.20);
  tone(440, 0.1, 0.50, "sine", 0.16);
}

// Descending minor — failure
function playWeakRebuttal() {
  tone(440, 0.0, 0.50, "triangle", 0.22);
  tone(330, 0.2, 0.55, "triangle", 0.18);
  tone(220, 0.4, 0.70, "triangle", 0.16);
}

// Sharp click for countdown ticking
function playTick() {
  tone(880, 0, 0.055, "square", 0.14);
}

// Dramatic conclusion chord sequence
function playVerdict(isVictory: boolean) {
  if (isVictory) {
    [261, 329, 392, 523, 659, 784].forEach((f, i) =>
      tone(f, i * 0.18, 0.85, "triangle", 0.20)
    );
    tone(523, 1.2, 1.5, "triangle", 0.22);
    tone(659, 1.2, 1.5, "triangle", 0.18);
    tone(784, 1.2, 1.5, "triangle", 0.15);
  } else {
    [392, 330, 261, 220].forEach((f, i) =>
      tone(f, i * 0.30, 0.90, "triangle", 0.22)
    );
    tone(165, 1.0, 1.8, "triangle", 0.18);
  }
}

// ─── Portrait frame ───────────────────────────────────────────────────────────

function PortraitFrame({
  label,
  color,
  size = 80,
}: {
  label: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        position: "relative",
        background: `radial-gradient(circle at 35% 35%, ${color}18, rgba(0,0,0,0.55))`,
        border: `1px solid ${color}`,
        boxShadow: `
          inset 0 0 0 4px ${BYZ.bg},
          inset 0 0 0 5px ${color}55,
          0 0 0 1px ${color}30,
          0 0 18px ${color}22
        `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Corner ornaments */}
      {(
        [
          { top: -1, left: -1 },
          { top: -1, right: -1 },
          { bottom: -1, left: -1 },
          { bottom: -1, right: -1 },
        ] as React.CSSProperties[]
      ).map((pos, i) => (
        <svg
          key={i}
          aria-hidden
          width="10"
          height="10"
          viewBox="0 0 10 10"
          style={{ position: "absolute", ...pos }}
        >
          <rect width="10" height="10" fill={BYZ.bg} />
          <path
            d={
              i === 0
                ? "M9,1 L1,1 L1,9"
                : i === 1
                ? "M1,1 L9,1 L9,9"
                : i === 2
                ? "M9,9 L1,9 L1,1"
                : "M1,9 L9,9 L9,1"
            }
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
        </svg>
      ))}

      {/* Monogram */}
      <span
        aria-hidden
        style={{
          fontFamily: "var(--font-cinzel-decorative), serif",
          fontSize: size * 0.32,
          fontWeight: 700,
          color,
          userSelect: "none",
          opacity: 0.9,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Corruption meter ─────────────────────────────────────────────────────────

function FlameSvg({ lit }: { lit: boolean }) {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 20"
      aria-hidden
      style={{ opacity: lit ? 1 : 0.18 }}
    >
      <path
        d="M7 1C7 1 13 8 13 13C13 16.3 10.3 19 7 19C3.7 19 1 16.3 1 13C1 8 7 1 7 1Z"
        fill={lit ? BYZ.red : BYZ.muted}
        style={lit ? { filter: `drop-shadow(0 0 3px ${BYZ.red}90)` } : {}}
      />
      <path
        d="M7 9C7 9 10 12 10 14C10 15.7 8.7 17 7 17C5.3 17 4 15.7 4 14C4 12 7 9 7 9Z"
        fill={lit ? "#E8A020" : "transparent"}
      />
    </svg>
  );
}

function CorruptionMeter({ round }: { round: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        marginTop: "0.5rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.56rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: BYZ.muted,
          marginRight: "4px",
        }}
      >
        Heresy
      </span>
      {Array.from({ length: 5 }).map((_, i) => (
        <FlameSvg key={i} lit={i < round} />
      ))}
    </div>
  );
}

// ─── Chamber top half ─────────────────────────────────────────────────────────

function ChamberTop({
  gameState,
}: {
  gameState: GameState;
}) {
  const { round, totalRounds, score, currentArgument } = gameState;
  if (!currentArgument) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1px",
        borderBottom: `1px solid ${BYZ.borderDim}`,
        background: BYZ.borderDim,
      }}
    >
      {/* ── Arius panel ── */}
      <div
        style={{
          background: `radial-gradient(ellipse at 10% 90%, rgba(139,26,26,0.12) 0%, ${BYZ.bg} 70%)`,
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem" }}>
          <PortraitFrame label="Ar" color={BYZ.red} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: `${BYZ.red}cc`,
                margin: "0 0 0.2rem",
              }}
            >
              Arius of Alexandria
            </p>
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                color: BYZ.muted,
                opacity: 0.75,
              }}
            >
              Presbyter · Heresiarch
            </p>
            <CorruptionMeter round={round} />
          </div>
        </div>

        {/* Argument text */}
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={currentArgument.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "var(--font-eb-garamond)",
              fontSize: "clamp(0.95rem, 2.2vw, 1.08rem)",
              lineHeight: 1.82,
              fontStyle: "italic",
              color: BYZ.cream,
              margin: 0,
              borderLeft: `2px solid ${BYZ.red}60`,
              paddingLeft: "0.85rem",
            }}
          >
            &ldquo;{currentArgument.text}&rdquo;
          </motion.blockquote>
        </AnimatePresence>

        <p
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            color: BYZ.muted,
            opacity: 0.72,
          }}
        >
          — {currentArgument.historicalSource}
        </p>
      </div>

      {/* ── Player panel ── */}
      <div
        style={{
          background: `radial-gradient(ellipse at 90% 90%, rgba(201,168,76,0.08) 0%, ${BYZ.bg} 70%)`,
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem" }}>
          <PortraitFrame label="Al" color={BYZ.gold} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.68rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: BYZ.gold,
                margin: "0 0 0.2rem",
              }}
            >
              Bishop Alexander
            </p>
            <p
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                color: BYZ.muted,
                opacity: 0.75,
              }}
            >
              Alexandria · Orthodox
            </p>
          </div>
        </div>

        {/* Atmospheric text */}
        <p
          style={{
            fontFamily: "var(--font-eb-garamond)",
            fontSize: "0.92rem",
            lineHeight: 1.75,
            fontStyle: "italic",
            color: BYZ.muted,
            opacity: 0.85,
          }}
        >
          The council watches in silence. Every bishop in this hall will remember
          how you answered Arius today.
        </p>

        {/* Round indicators + score */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.58rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: BYZ.muted,
              }}
            >
              Round {round} of {totalRounds}
            </span>
          </div>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {Array.from({ length: totalRounds }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    i < round - 1
                      ? BYZ.gold
                      : i === round - 1
                      ? BYZ.cream
                      : BYZ.borderDim,
                  transition: "background 0.4s",
                  boxShadow:
                    i === round - 1
                      ? `0 0 6px ${BYZ.goldLight}`
                      : i < round - 1
                      ? `0 0 4px ${BYZ.gold}60`
                      : "none",
                }}
              />
            ))}
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: BYZ.muted,
                marginLeft: "0.4rem",
              }}
            >
              Score:{" "}
              <motion.span
                key={score}
                initial={{ color: BYZ.goldLight }}
                animate={{ color: BYZ.cream }}
                style={{ fontWeight: 700 }}
              >
                {score}
              </motion.span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Timer bar ────────────────────────────────────────────────────────────────

function TimerBar({
  timeRemaining,
  isPaused,
}: {
  timeRemaining: number;
  isPaused: boolean;
}) {
  const pct = Math.max(0, (timeRemaining / 30) * 100);
  const isUrgent = timeRemaining <= 8;
  const isWarning = timeRemaining <= 15;
  const barColor = isUrgent ? "#CC3333" : isWarning ? "#D4882A" : BYZ.gold;

  return (
    <div
      style={{
        padding: "0.55rem 1.25rem",
        borderBottom: `1px solid ${BYZ.borderDim}`,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span
        className={isUrgent && !isPaused ? "nicaea-timer-urgent" : undefined}
        style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          color: isPaused ? BYZ.muted : barColor,
          minWidth: "2rem",
          transition: isUrgent ? "none" : "color 0.4s",
        }}
      >
        {isPaused ? "—" : `${String(timeRemaining).padStart(2, "0")}s`}
      </span>

      <div
        style={{
          flex: 1,
          height: "4px",
          background: "rgba(0,0,0,0.4)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ width: isPaused ? `${pct}%` : `${pct}%`, backgroundColor: barColor }}
          transition={{ duration: 0.85, ease: "linear" }}
          style={{ height: "100%", borderRadius: "2px" }}
        />
      </div>

      {/* Pulsing indicator when urgent */}
      {isUrgent && !isPaused && (
        <motion.div
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#CC3333",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}

// ─── Result flash between rounds ──────────────────────────────────────────────

const RESULT_CONFIG = {
  strong: {
    flash: "rgba(74, 155, 111, 0.18)",
    border: "#4A9B6F",
    label: "Excellent rebuttal!",
    labelColor: "#4A9B6F",
  },
  partial: {
    flash: "rgba(212, 136, 42, 0.15)",
    border: "#D4882A",
    label: "Adequate, but incomplete.",
    labelColor: "#D4882A",
  },
  weak: {
    flash: "rgba(139, 26, 26, 0.18)",
    border: BYZ.red,
    label: "The council murmurs…",
    labelColor: BYZ.red,
  },
} as const;

function ResultFlash({
  response,
  result,
  pointsEarned,
  showButton,
  onContinue,
  isLastRound,
  isLoading,
}: {
  response: DebateResponse;
  result: ResponseStrength;
  pointsEarned: number;
  showButton: boolean;
  onContinue: () => void;
  isLastRound: boolean;
  isLoading: boolean;
}) {
  const cfg = RESULT_CONFIG[result];
  const basePoints = result === "strong" ? 200 : result === "partial" ? 100 : 0;
  const hasSpeedBonus = pointsEarned > basePoints;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Flash banner */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: cfg.flash,
          border: `1px solid ${cfg.border}`,
          padding: "0.8rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transformOrigin: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.82rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: cfg.labelColor,
          }}
        >
          {cfg.label}
        </span>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "1rem",
              fontWeight: 700,
              color: cfg.labelColor,
            }}
          >
            +{basePoints}
          </span>
          {hasSpeedBonus && (
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.62rem",
                color: BYZ.goldLight,
                marginLeft: "0.4rem",
              }}
            >
              +50 speed
            </span>
          )}
        </div>
      </motion.div>

      {/* Explanation */}
      <div
        style={{
          borderLeft: `2px solid ${BYZ.borderDim}`,
          paddingLeft: "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-eb-garamond)",
            fontSize: "1.02rem",
            lineHeight: 1.82,
            fontStyle: "italic",
            color: BYZ.muted,
            margin: 0,
          }}
        >
          {response.explanation}
        </p>
        {response.scriptureRef && (
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: BYZ.gold,
              marginTop: "0.5rem",
              opacity: 0.9,
            }}
          >
            {response.scriptureRef}
          </p>
        )}
      </div>

      {/* Next button — delayed 2 seconds */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onContinue}
            disabled={isLoading}
            style={{
              background: "transparent",
              border: `1px solid ${BYZ.gold}`,
              color: BYZ.gold,
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "0.9rem",
              cursor: isLoading ? "default" : "pointer",
              opacity: isLoading ? 0.55 : 1,
              width: "100%",
            }}
          >
            {isLoading
              ? "Recording to the archives…"
              : isLastRound
              ? "See the Verdict →"
              : "Next Round →"}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100dvh - 49px)",
        padding: "2.5rem 1.5rem",
        textAlign: "center",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      <motion.div
        aria-hidden
        animate={{
          opacity: [0.72, 1, 0.72],
          filter: [
            `drop-shadow(0 0 16px ${BYZ.gold}45)`,
            `drop-shadow(0 0 34px ${BYZ.gold}75)`,
            `drop-shadow(0 0 16px ${BYZ.gold}45)`,
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontSize: "clamp(4rem, 14vw, 5.5rem)", color: BYZ.gold, lineHeight: 1, marginBottom: "1.5rem", fontFamily: "serif" }}
      >
        ☧
      </motion.div>

      <h1
        className="nicaea-candle-flicker"
        style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.5rem, 5.5vw, 2.3rem)", fontWeight: 900, color: BYZ.gold, letterSpacing: "0.04em", lineHeight: 1.2, margin: "0 0 0.7rem" }}
      >
        THE COUNCIL OF NICAEA
      </h1>

      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.76rem", color: BYZ.muted, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.75rem" }}>
        325 AD — Defend the Faith Against Arianism
      </p>

      <div aria-hidden style={{ width: "100%", maxWidth: "360px", height: "1px", background: `linear-gradient(to right, transparent, ${BYZ.border}, transparent)`, marginBottom: "1.75rem" }} />

      <p style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "clamp(1rem, 2.5vw, 1.12rem)", lineHeight: 1.85, color: BYZ.cream, maxWidth: "510px", marginBottom: "0" }}>
        Emperor Constantine has summoned over 300 bishops to the imperial palace at
        Nicaea, Bithynia. A priest from Alexandria named Arius has shaken the Church
        with a devastating claim: that the Son of God is a created being — the greatest
        of God&apos;s works, but not eternal and not truly divine. The faith of
        Christendom hangs on what this council decides.
      </p>

      <div style={{ borderTop: `1px solid ${BYZ.borderDim}`, borderBottom: `1px solid ${BYZ.borderDim}`, padding: "0.9rem 2rem", margin: "1.75rem 0 2rem", color: BYZ.goldLight, fontFamily: "var(--font-cinzel)", fontSize: "0.87rem", letterSpacing: "0.1em", width: "100%", maxWidth: "420px" }}>
        You are Bishop Alexander of Alexandria
      </div>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.03, boxShadow: `0 0 32px ${BYZ.gold}45, 0 0 60px ${BYZ.gold}18` }}
        whileTap={{ scale: 0.97 }}
        style={{ background: "transparent", border: `1px solid ${BYZ.gold}`, color: BYZ.gold, fontFamily: "var(--font-cinzel)", fontSize: "0.88rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.9rem 2.8rem", cursor: "pointer", boxShadow: `0 0 16px ${BYZ.gold}22` }}
      >
        Enter the Council Chamber
      </motion.button>

      <p style={{ marginTop: "1.4rem", fontSize: "0.73rem", color: BYZ.muted, fontFamily: "var(--font-cinzel)", letterSpacing: "0.1em", opacity: 0.75 }}>
        5 rounds · 30 seconds per argument · 1250 points max
      </p>

      {/* Global leaderboard — shown below CTA on intro screen */}
      <div style={{ width: "100%", maxWidth: "640px", marginTop: "2.5rem" }}>
        <ScoreBoard currentShareToken={null} />
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GameArena() {
  const { gameState, startGame, selectResponse, nextRound, resetGame } =
    useNicaeaGame();

  const {
    phase,
    round,
    totalRounds,
    timeRemaining,
    currentArgument,
    selectedResponse,
    responseResult,
    isLoading,
    verdict,
  } = gameState;

  const [showNextButton, setShowNextButton] = useState(false);
  const [resultFlash, setResultFlash] = useState<"strong" | "partial" | "weak" | null>(null);

  // Brief full-screen flash when a response is first selected
  useEffect(() => {
    if (!responseResult) return;
    setResultFlash(responseResult);
    const id = setTimeout(() => setResultFlash(null), 380);
    return () => clearTimeout(id);
  }, [responseResult]);

  // Reveal "Next Round" button 2 seconds after a response is submitted
  useEffect(() => {
    if (responseResult) {
      setShowNextButton(false);
      const id = setTimeout(() => setShowNextButton(true), 2000);
      return () => clearTimeout(id);
    } else {
      setShowNextButton(false);
    }
  }, [responseResult]);

  // ── Sounds ────────────────────────────────────────────────────────────────

  const prevRoundRef = useRef(0);
  useEffect(() => {
    if (phase !== "debate") return;
    if (round !== prevRoundRef.current) {
      prevRoundRef.current = round;
      playDebateStart();
    }
  }, [phase, round]);

  useEffect(() => {
    if (!responseResult) return;
    if (responseResult === "strong") playStrongRebuttal();
    else if (responseResult === "partial") playPartialRebuttal();
    else playWeakRebuttal();
  }, [responseResult]);

  // One tick per second when timer is in the danger zone
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0 && !selectedResponse && phase === "debate") {
      playTick();
    }
  }, [timeRemaining, selectedResponse, phase]);

  // Verdict sound
  useEffect(() => {
    if (phase === "verdict" && verdict) {
      playVerdict(verdict === "victory");
    }
  }, [phase, verdict]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const isPaused = selectedResponse !== null;
  const isLastRound = round === totalRounds;

  const selectedResponseObj = selectedResponse && currentArgument
    ? currentArgument.responses.find((r) => r.id === selectedResponse) ?? null
    : null;

  const lastPointsEarned =
    gameState.roundHistory[gameState.roundHistory.length - 1]?.pointsEarned ?? 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Result flash overlay — CSS-animated semi-transparent screen burst */}
      {resultFlash && (
        <div
          key={String(Date.now())}
          className={`nicaea-result-flash nicaea-result-flash--${resultFlash}`}
          aria-hidden
        />
      )}

      <AnimatePresence mode="wait">
      {phase === "intro" && (
        <IntroScreen key="intro" onStart={startGame} />
      )}

      {phase === "debate" && (
        <motion.div
          key={`debate-${round}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="nicaea-chamber-bg"
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            minHeight: "calc(100dvh - 49px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChamberTop gameState={gameState} />

          <TimerBar timeRemaining={timeRemaining} isPaused={isPaused} />

          {/* Bottom half — response panel */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              {!isPaused ? (
                <motion.div
                  key="debate-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: "1.1rem 1.25rem" }}
                >
                  <DebatePanel
                    responses={currentArgument?.responses ?? []}
                    onSelect={(responseId) => {
                      const response = currentArgument?.responses.find(
                        (r) => r.id === responseId
                      );
                      if (response) selectResponse(response);
                    }}
                    selectedResponse={selectedResponse}
                    responseResult={responseResult}
                    isDisabled={isPaused}
                  />
                </motion.div>
              ) : selectedResponseObj && responseResult ? (
                <ResultFlash
                  key="result-flash"
                  response={selectedResponseObj}
                  result={responseResult}
                  pointsEarned={lastPointsEarned}
                  showButton={showNextButton}
                  onContinue={nextRound}
                  isLastRound={isLastRound}
                  isLoading={isLoading}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {phase === "verdict" && (
        <motion.div
          key="verdict"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VerdictScreen
            gameState={gameState}
            onPlayAgain={resetGame}
            shareToken={gameState.shareToken}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
