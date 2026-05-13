import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import PrayerForumContent from "./prayer-forum-content";
import FirebaseLatestDiscussions from "@/components/firebase-latest-discussions";
import FirebaseForumCategories from "@/components/firebase-forum-categories";
import SiteHeroPanel from "@/components/site-hero-panel";

export const metadata: Metadata = buildMeta({
  title: "Prayer Forum — One In Him Community",
  description:
    "Share prayer requests, give praise, and ask questions in the One In Him prayer forum. Anyone can read. Sign in to participate.",
  keywords:
    "christian prayer forum, prayer requests, christian community, bible study community, prayer",
  path: "/library/prayer-forum",
});

export default function PrayerForumPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Library", href: "/library" },
            { label: "Prayer Forum" },
          ]}
        />

        {/* Hero panel */}
        <SiteHeroPanel
          eyebrow="Community"
          title="Prayer Forum"
          lead="Share prayer requests, give praise for answered prayer, and ask questions about faith and Scripture. Anyone can read and browse — sign in only when you want to start a discussion or reply. This is a place for the body of Christ to carry one another's burdens across Catholic, Orthodox, and Protestant traditions."
        >
          <div className="mt-6">
            <PrayerForumContent />
          </div>
        </SiteHeroPanel>

        {/* Latest discussions */}
        <div className="mt-10">
          <FirebaseLatestDiscussions />
        </div>

        {/* Forum categories */}
        <div className="mt-8">
          <FirebaseForumCategories />
        </div>

        {/* Support link */}
        <p className="mt-10 text-sm text-[var(--color-muted)]">
          Questions or issues?{" "}
          <Link
            href="/library/prayer-forum/support"
            className="text-[var(--color-highlight)] hover:underline"
          >
            Contact & Support
          </Link>
        </p>
      </main>
      <MobileBottomNav active="Prayer Forum" />
    </>
  );
}
