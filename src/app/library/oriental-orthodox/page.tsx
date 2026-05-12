import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import Link from "next/link";
import { orientalOrthodoxLibrary } from "@/lib/content";

export const metadata: Metadata = buildMeta({
  title: "Oriental Orthodox — Coptic, Ethiopian & Syriac",
  description: "Study Oriental Orthodox Christianity — Coptic, Ethiopian, Armenian, and Syriac traditions, texts, and theology from the ancient pre-Chalcedonian churches.",
  keywords: "Oriental Orthodox, Coptic church, Ethiopian Orthodox, Syriac Christianity, Armenian church, early church",
  path: "/library/oriental-orthodox",
});

const resources = [
  {
    title: "Oriental Orthodoxy Text Library",
    href: "https://www.orientalorthodoxy.com/library/texts/",
    detail:
      "Oriental Orthodox texts, historical documents, and study material.",
  },
  {
    title: "Orthodox Church Fathers",
    href: "https://orthodoxchurchfathers.com/",
    detail:
      "Useful discovery hub for broader Orthodox patristic study and secondary reading paths.",
  },
  {
    title: "Greek Orthodox Archdiocese",
    href: "https://www.goarch.org/",
    detail:
      "Articles, educational material, and liturgical resources from the Greek Orthodox Archdiocese.",
  },
];

export default function OrientalOrthodoxPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Library", href: "/library" }, { label: "Traditions", href: "/library/traditions" }, { label: "Oriental Orthodox" }]} />

        <section className="mt-6 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
            Oriental Orthodox
          </p>
          <h1 className="site-page-title mt-3">Coptic, Ethiopian, Armenian &amp; Syriac</h1>
          <p className="site-heading-lead mt-4 max-w-3xl">
            The Oriental Orthodox churches — the Coptic Church of Alexandria, the Ethiopian Orthodox
            Tewahedo Church, the Armenian Apostolic Church, and the Syriac Orthodox Church — are
            among the oldest Christian communities in the world. This section collects their primary
            texts, theological traditions, and distinct liturgical heritage.
          </p>
        </section>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.56fr_0.44fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Internal Library
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                Imported Oriental Orthodox texts
              </h2>
              <div className="mt-5 grid gap-4">
                {orientalOrthodoxLibrary.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/library/oriental-orthodox/${entry.slug}`}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                          {entry.title}
                        </h3>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                          {entry.author} - {entry.era}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {entry.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Direction
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                Oriental Orthodox study expansion
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
                <p>
                  The current internal full-text imports are still mainly from the shared early
                  fathers and Greek/Latin patristic collections. This page makes the Oriental
                  Orthodox branch explicit so it can grow into its own library instead of being
                  buried inside a generic Orthodox bucket.
                </p>
                <p>
                  The next content step here is to identify important Oriental Orthodox texts and
                  turn them into route-backed library entries the same way the Fathers section now
                  works.
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Resources
              </p>
              <div className="mt-4 space-y-3">
                {resources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4"
                  >
                    <p className="font-semibold text-[var(--color-ink)]">{resource.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {resource.detail}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      <MobileBottomNav active="Home" />
    </>
  );
}
