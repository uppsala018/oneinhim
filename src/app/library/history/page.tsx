import type { Metadata } from "next";
import { buildCollectionPageSchema, buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SiteHeroPanel from "@/components/site-hero-panel";
import { historyLibrary } from "@/lib/content";

export const metadata: Metadata = buildMeta({
  title: "Church History Timeline — 2000 Years of Christianity",
  description: "A complete church history timeline — from the apostolic era through the Great Schism, Reformation, and Charismatic movement to the present day.",
  keywords: "church history timeline, Christian history, early church history, reformation, Great Schism, church history",
  path: "/library/history",
});

const HISTORY_SCHEMA = buildCollectionPageSchema({
  path: "/library/history",
  name: "Church History Timeline — 2000 Years of Christianity",
  description:
    "A church history study hub covering the apostolic era, the East-West Schism, Chalcedon, the Reformation, and modern renewal movements.",
  about: ["Church history", "Christian history", "Reformation", "Great Schism"],
});

const hubCards = [
  {
    title: "Timeline",
    href: "/library/history/timeline",
    summary:
      "A vertical overview of the apostolic Church, the East-West split, the Reformation, and the modern branches that continue to 2026.",
  },
  {
    title: "East-West Schism",
    href: "/library/history/great-schism",
    summary:
      "Study the long rupture between Rome and Constantinople, including the Filioque, papal claims, and the later hardening of East and West.",
  },
  {
    title: "Chalcedon / Oriental Orthodox",
    href: "/library/history/chalcedon-451",
    summary:
      "Read the 451 Christological split and the continuation of the ancient Oriental Orthodox churches on their own historical path.",
  },
  {
    title: "Reformation",
    href: "/library/history/reformation",
    summary:
      "Read the Protestant Reformation as a doctrinal and ecclesial fracture inside the Latin West.",
  },
  {
    title: "Charismatic Movement",
    href: "/library/history/charismatic-movement",
    summary:
      "See how Pentecostal and charismatic renewal spread through Protestant, Catholic, and mainline churches.",
  },
];

export default function HistoryHubPage() {
  return (
    <>
      <JsonLd data={HISTORY_SCHEMA} />
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Library", href: "/library" },
          { label: "Church History" },
        ]} />

        {/* Hero panel */}
        <SiteHeroPanel
          eyebrow="Church History"
          title="2000 Years of Christianity"
          lead="A study hub for splits, continuities, councils, and modern renewal movements. Start with the timeline, then move into the East-West Schism, Chalcedon, the Reformation, and the Charismatic movement as distinct study paths."
        />

        {/* Hub study-path cards */}
        <section
          className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-labelledby="history-study-paths-heading"
        >
          <h2 id="history-study-paths-heading" className="sr-only">
            History study paths
          </h2>
          {hubCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-highlight)] md:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                Church History
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)] leading-tight">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {card.summary}
              </p>
            </Link>
          ))}
        </section>

        {/* All topics */}
        <section
          className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8"
          aria-labelledby="history-all-topics-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
            Study Links
          </p>
          <h2 id="history-all-topics-heading" className="sr-only">
            All church history topics
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {historyLibrary.map((topic) => (
              <Link
                key={topic.slug}
                href={`/library/history/${topic.slug}`}
                className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4 transition hover:border-[var(--color-highlight)]"
              >
                <p className="font-semibold text-[var(--color-ink)]">{topic.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {topic.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MobileBottomNav active="Home" />
    </>
  );
}
