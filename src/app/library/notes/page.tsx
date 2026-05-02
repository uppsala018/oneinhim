"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const BOOKMARK_KEY = "logos-legacy-bookmarks";
const NOTE_KEY     = "logos-legacy-notes";
const PROGRESS_KEY = "__logos_legacy_progress__";

export default function NotesPage() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes]         = useState<Record<string, string>>({});
  const [tab, setTab]             = useState<"bookmarks" | "notes">("bookmarks");
  const [copied, setCopied]       = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BOOKMARK_KEY);
      setBookmarks(raw ? (JSON.parse(raw) as string[]) : []);
    } catch { setBookmarks([]); }
    try {
      const raw = localStorage.getItem(NOTE_KEY);
      const all = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      const { [PROGRESS_KEY]: _, ...clean } = all;
      setNotes(clean);
    } catch { setNotes({}); }
  }, []);

  function removeBookmark(ref: string) {
    const next = bookmarks.filter((b) => b !== ref);
    setBookmarks(next);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  }

  function removeNote(ref: string) {
    const next = { ...notes };
    delete next[ref];
    setNotes(next);
    const stored = JSON.parse(localStorage.getItem(NOTE_KEY) ?? "{}") as Record<string, string>;
    delete stored[ref];
    localStorage.setItem(NOTE_KEY, JSON.stringify(stored));
  }

  async function copyBookmark(ref: string) {
    await navigator.clipboard.writeText(ref);
    setCopied(ref);
    window.setTimeout(() => setCopied(null), 1800);
  }

  const noteEntries = Object.entries(notes);

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    border: "1px solid",
    borderColor: active ? "var(--color-highlight)" : "rgba(229,197,122,0.2)",
    borderRadius: 999,
    background: active ? "rgba(229,197,122,0.12)" : "transparent",
    padding: "0.52rem 0",
    color: active ? "var(--color-highlight)" : "var(--color-soft)",
    fontSize: "0.85rem",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
  });

  return (
    <main className="mobile-app-shell" style={{ paddingBottom: "7rem" }}>
      <header className="mobile-section-header">
        <Link href="/" className="mobile-section-header__back" aria-label="Back">‹</Link>
        <div><h1>Saved</h1><span>Bookmarks &amp; Notes</span></div>
        <span />
      </header>

      <div style={{ padding: "1rem 1rem 0" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.1rem" }}>
          <button type="button" style={tabBtn(tab === "bookmarks")} onClick={() => setTab("bookmarks")}>
            Bookmarks {bookmarks.length > 0 ? `(${bookmarks.length})` : ""}
          </button>
          <button type="button" style={tabBtn(tab === "notes")} onClick={() => setTab("notes")}>
            Notes {noteEntries.length > 0 ? `(${noteEntries.length})` : ""}
          </button>
        </div>

        {tab === "bookmarks" && (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {bookmarks.length === 0 ? (
              <div style={{ border: "1px solid rgba(229,197,122,0.18)", borderRadius: "1.2rem", background: "rgba(7,25,54,0.6)", padding: "1.5rem", textAlign: "center" }}>
                <p style={{ margin: 0, color: "var(--color-highlight)", fontFamily: "var(--font-display),serif", fontSize: "1.3rem" }}>No bookmarks yet</p>
                <p style={{ margin: "0.5rem 0 0", color: "var(--color-muted)", fontSize: "0.88rem" }}>
                  Tap a verse in the KJV, Catholic Bible, or Septuagint reader and press Save.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center", marginTop: "1rem" }}>
                  {[["KJV Bible", "/library/kjv"], ["Catholic Bible", "/library/catholic"], ["Septuagint", "/library/orthodox/lxx"]].map(([label, href]) => (
                    <Link key={href} href={href} style={{ border: "1px solid rgba(229,197,122,0.3)", borderRadius: 999, padding: "0.38rem 0.85rem", color: "var(--color-highlight)", fontSize: "0.8rem" }}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : bookmarks.map((ref) => (
              <div key={ref} style={{ border: "1px solid rgba(229,197,122,0.22)", borderLeft: "3px solid rgba(229,197,122,0.6)", borderRadius: "1.1rem", background: "rgba(7,25,54,0.65)", padding: "0.85rem 1rem" }}>
                <p style={{ margin: 0, color: "var(--color-ink)", fontFamily: "var(--font-display),serif", fontSize: "1.05rem", fontWeight: 600 }}>{ref}</p>
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                  <button type="button"
                    onClick={() => void copyBookmark(ref)}
                    style={{ border: "1px solid rgba(229,197,122,0.25)", borderRadius: 999, padding: "0.3rem 0.75rem", color: copied === ref ? "var(--color-highlight)" : "var(--color-soft)", fontSize: "0.76rem", cursor: "pointer" }}>
                    {copied === ref ? "Copied ✓" : "Copy"}
                  </button>
                  <button type="button"
                    onClick={() => removeBookmark(ref)}
                    style={{ border: "1px solid rgba(230,165,165,0.3)", borderRadius: 999, padding: "0.3rem 0.75rem", color: "#e6a5a5", fontSize: "0.76rem", cursor: "pointer" }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "notes" && (
          <div style={{ display: "grid", gap: "0.7rem" }}>
            {noteEntries.length === 0 ? (
              <div style={{ border: "1px solid rgba(229,197,122,0.18)", borderRadius: "1.2rem", background: "rgba(7,25,54,0.6)", padding: "1.5rem", textAlign: "center" }}>
                <p style={{ margin: 0, color: "var(--color-highlight)", fontFamily: "var(--font-display),serif", fontSize: "1.3rem" }}>No notes yet</p>
                <p style={{ margin: "0.5rem 0 0", color: "var(--color-muted)", fontSize: "0.88rem" }}>
                  Write study notes from the KJV or Catholic Bible reader.
                </p>
              </div>
            ) : noteEntries.map(([ref, text]) => (
              <div key={ref} style={{ border: "1px solid rgba(229,197,122,0.22)", borderRadius: "1.1rem", background: "rgba(7,25,54,0.65)", padding: "0.9rem 1rem" }}>
                <p style={{ margin: "0 0 0.4rem", color: "var(--color-highlight)", fontFamily: "var(--font-display),serif", fontSize: "0.95rem", fontWeight: 600 }}>{ref}</p>
                <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.88rem", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{text}</p>
                <button type="button"
                  onClick={() => removeNote(ref)}
                  style={{ marginTop: "0.55rem", border: "1px solid rgba(230,165,165,0.3)", borderRadius: 999, padding: "0.28rem 0.7rem", color: "#e6a5a5", fontSize: "0.74rem", cursor: "pointer" }}>
                  Delete note
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileBottomNav active="Bookmarks" />
    </main>
  );
}
