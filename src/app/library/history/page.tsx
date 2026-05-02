import Link from "next/link";
import AppHeader from "@/components/app-header";
import { historyLibrary } from "@/lib/content";

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
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <section className="rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Church History
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] md:text-5xl">
            A study hub for splits, continuities, councils, and modern renewal movements.
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            Start with the timeline, then move into the East-West Schism, Chalcedon, the
            Reformation, and the Charismatic movement as distinct study paths.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {hubCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:bg-[rgba(8,26,57,0.88)] md:p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
                Church History
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] md:text-3xl">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {card.summary}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
            Study Links
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {historyLibrary.map((topic) => (
              <Link
                key={topic.slug}
                href={`/library/history/${topic.slug}`}
                className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4"
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
    </>
  );
}
