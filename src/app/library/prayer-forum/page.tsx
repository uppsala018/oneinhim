import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import PrayerForumBoard from "@/components/prayer-forum-board";
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
          <h1>Community</h1>
          <span>Prayer · Praise · Discussion</span>
        </div>
        <Link href="/library/prayer-forum/support" className="mobile-section-header__back" aria-label="Support" style={{ fontSize: "1.5rem" }}>?</Link>
      </header>

      <div className="sr-only">
        <h2>Christian Prayer Forum — Community Prayer Requests & Praise</h2>
        <p>
          The One In Him prayer forum is a quiet space for Bible study members to share prayer
          requests, give praise for answered prayer, and ask questions about faith and Scripture.
          Post a prayer request and the community will pray alongside you. Share a praise report
          and encourage others in their walk. Ask a theological or practical question and receive
          thoughtful, respectful responses from fellow believers across Catholic, Orthodox,
          and Protestant traditions. This is not a debate space — it is a place for the body
          of Christ to carry one another&apos;s burdens in the spirit of Galatians 6:2. All prayer
          requests are treated with care and respect. Members can post anonymously or with their
          display name. The forum is open to all signed-in members of the One In Him community
          and is moderated to maintain a respectful, Christ-centered environment.
        </p>
      </div>

      <div className="px-4 pt-4 pb-2">
        <PrayerForumBoard />
      </div>

      <MobileBottomNav />
    </main>
  );
}

