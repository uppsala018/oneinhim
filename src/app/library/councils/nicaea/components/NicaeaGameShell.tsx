"use client";

import { Cinzel_Decorative, EB_Garamond, Cinzel } from "next/font/google";
import Link from "next/link";
import GameArena from "./GameArena";
import { BYZ, GRAIN } from "../constants";

// ─── Game-scoped fonts (instantiated at module level as Next.js requires) ─────

const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// BYZ and GRAIN live in ../constants to avoid circular imports.
// NicaeaGameShell imports GameArena; game components import BYZ — both point
// to constants, so the module graph has no cycle.

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function NicaeaGameShell() {
  const fontVars = `${cinzelDecorative.variable} ${ebGaramond.variable} ${cinzel.variable}`;

  return (
    <div
      className={`${fontVars} parchment-bg`}
      style={{
        minHeight: "100dvh",
        backgroundColor: BYZ.bg,
        backgroundImage: GRAIN,
        backgroundRepeat: "repeat",
        color: BYZ.cream,
        fontFamily: "var(--font-eb-garamond), Georgia, serif",
        overflowX: "hidden",
      }}
    >
      {/* Persistent nav — visible across all game phases */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          borderBottom: `1px solid ${BYZ.borderDim}`,
        }}
      >
        <Link
          href="/library/councils"
          style={{
            color: BYZ.muted,
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ← Ecumenical Councils
        </Link>
        <span
          aria-hidden
          style={{
            color: BYZ.gold,
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.65rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          Council Chronicles
        </span>
      </nav>

      {/* GameArena owns all state and phase routing */}
      <GameArena />
    </div>
  );
}
