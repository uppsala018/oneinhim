// Shared constants for the Council of Nicaea game.
// Kept in a standalone module to avoid circular imports between
// NicaeaGameShell (which imports GameArena) and the game components
// (which need these values). Import from here, not from NicaeaGameShell.

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
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E\")";
