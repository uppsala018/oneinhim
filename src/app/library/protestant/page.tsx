import Link from "next/link";
import AppHeader from "@/components/app-header";
import SectionHeading from "@/components/section-heading";
import {
  getFathersForTrack,
  protestantFigures,
  protestantLibrary,
  protestantWorks,
} from "@/lib/content";

export default function ProtestantPage() {
  const fathers = getFathersForTrack("protestant");

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Protestant Study"
          title="A Protestant study path now sits alongside the Catholic and Orthodox tracks."
          body="This hub brings together the KJV reader, Strong's tools, Reformation history, and selected fathers and theologians that remained influential in Protestant reading traditions."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.52fr_0.48fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                    Reformers and Theologians
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                    Internal primary-text studies
                  </h2>
                </div>
                <Link
                  href="/library/protestant/figures"
                  className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                >
                  Open figures
                </Link>
              </div>
              <div className="mt-5 grid gap-4">
                {protestantFigures.map((figure) => (
                  <Link
                    key={figure.slug}
                    href={`/library/protestant/figures/${figure.slug}`}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                      {figure.name}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                      {figure.era} · {figure.tradition}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {figure.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Primary Tools
              </p>
              <div className="mt-4 grid gap-4">
                {[
                  ["/library/kjv", "KJV + Strong's", "Full KJV reader with lexicon lookup, search, bookmarks, and notes."],
                  ["/library/history/reformation", "Reformation History", "Structured history page for one of the defining Protestant eras."],
                  ["/library/fathers/augustine-hippo/confessions", "Augustine: Confessions", "A major text for Protestant and Catholic readers alike on grace, memory, and conversion."],
                ].map(([href, label, detail]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                  >
                    <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                      {label}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{detail}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                    Protestant Library
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                    Movement and analysis pages
                  </h2>
                </div>
              </div>
              <div className="mt-5 grid gap-4">
                {protestantLibrary.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/library/protestant/${entry.slug}`}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                      {entry.era}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {entry.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                    Confessions and Catechisms
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                    Doctrinal standards
                  </h2>
                </div>
                <Link
                  href="/library/protestant/texts"
                  className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                >
                  Open text library
                </Link>
              </div>
              <div className="mt-5 grid gap-4">
                {protestantWorks.slice(0, 4).map((work) => (
                  <Link
                    key={work.slug}
                    href={`/library/protestant/texts/${work.slug}`}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                      {work.title}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                      {work.tradition} · {work.yearLabel}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {work.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                  Influential Fathers
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                  Protestant-adjacent reading
                </h2>
              </div>
              <Link
                href="/library/fathers"
                className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
              >
                Open full Fathers library
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {fathers.map((father) => (
                <Link
                  key={father.slug}
                  href={`/library/fathers/${father.slug}`}
                  className="block rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                        {father.name}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                        {father.era} - {father.tradition}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]">
                      {father.stream}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {father.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
