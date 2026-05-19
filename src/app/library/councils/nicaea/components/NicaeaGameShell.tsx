"use client";

import { Cinzel_Decorative, EB_Garamond, Cinzel } from "next/font/google";
import Link from "next/link";
import GameArena from "./GameArena";

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

// ─── Byzantine palette (scoped to the game — does not touch globals.css) ──────

export const BYZ = {
  bg: "#2C1810",
  bgPanel: "rgba(20, 10, 5, 0.72)",
  gold: "#C9A84C",
  goldLight: "#E8C96D",
  goldDim: "rgba(201, 168, 76, 0.18)",
  cream: "#F5E6C8",
  muted: "#B8956A",
  border: "#8B6914",
  borderDim: "rgba(139, 105, 20, 0.35)",
  red: "#8B1A1A",
  blue: "#1A3A5C",
} as const;

// Repeating SVG noise — gives the parchment grain texture
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E\")";

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
