import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import PrayerForumBoard from "@/components/prayer-forum-board";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export const metadata: Metadata = buildMeta({
  title: "Christian Prayer Forum â€” Requests & Community",
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
          <span>Prayer Â· Praise Â· Discussion</span>
        </div>
        <Link href="/library/prayer-forum/support" className="mobile-section-header__back" aria-label="Support" style={{ fontSize: "1.5rem" }}>?</Link>
      </header>

      <div className="px-4 pt-4 pb-2">
        <PrayerForumBoard />
      </div>

      <MobileBottomNav />
    </main>
  );
}

