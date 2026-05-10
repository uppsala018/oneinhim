import FirebaseForumCategories from "@/components/firebase-forum-categories";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import PrayerForumContent from "./prayer-forum-content";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export const metadata: Metadata = buildMeta({
  title: "Christian Prayer Forum — Requests & Community",
  description: "Share prayer requests, give praise, and ask questions in the One In Him prayer forum. A respectful space for the body of Christ.",
  keywords: "christian prayer forum, prayer requests, christian community, bible study community, prayer",
  path: "/library/prayer-forum",
});

export default function PrayerForumPage() {
  return (
    <main className="mobile-app-shell" style={{ paddingBottom: "7rem" }}>
      <header className="mobile-section-header">
        <Link href="/" className="mobile-section-header__back" aria-label="Back">‹</Link>
        <div>
          <h1>Prayer Forum</h1>
          <span>Prayer · Praise · Discussion</span>
        </div>
        <Link href="/library/prayer-forum/support" className="mobile-section-header__back" aria-label="Support" style={{ fontSize: "1.5rem" }}>?</Link>
      </header>

      <section className="px-4 pt-6 pb-4 border-b border-[var(--color-border)]">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">Community</p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
          Christian Prayer &amp; Community
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Share prayer requests, give praise for answered prayer, and ask questions about faith
          and Scripture. Post a prayer request and the community will pray alongside you. Share a
          praise report and encourage others in their walk. Ask a theological or practical question
          and receive thoughtful, respectful responses from fellow believers across Catholic,
          Orthodox, and Protestant traditions. This is a place for the body of Christ to carry
          one another&apos;s burdens — not a debate space. All requests are treated with care.
          Post with your name or anonymously. Sign in with your email to participate.
        </p>
      </section>

      <PrayerForumContent />

      <FirebaseForumCategories />

      <MobileBottomNav />
    </main>
  );
}
