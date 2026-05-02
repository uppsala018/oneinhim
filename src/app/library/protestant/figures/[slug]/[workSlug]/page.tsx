import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import {
  getProtestantFigure,
  getProtestantFigureWork,
  protestantFigures,
} from "@/lib/content";

export function generateStaticParams() {
  return protestantFigures.flatMap((figure) =>
    figure.works.map((work) => ({
      slug: figure.slug,
      workSlug: work.slug,
    })),
  );
}

export default async function ProtestantFigureWorkPage({
  params,
}: {
  params: Promise<{ slug: string; workSlug: string }>;
}) {
  const { slug, workSlug } = await params;
  const figure = getProtestantFigure(slug);
  const work = getProtestantFigureWork(slug, workSlug);

  if (!figure || !work) {
    notFound();
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/library/protestant"
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Back to Protestant
          </Link>
          <Link
            href={`/library/protestant/figures/${figure.slug}`}
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Back to {figure.name}
          </Link>
        </div>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {figure.name}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {work.title}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {work.yearLabel} · {figure.tradition}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
                {work.stats.sectionCount} sections
              </span>
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
                {work.stats.paragraphCount} paragraphs
              </span>
            </div>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {work.summary}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-soft)]">
            <a
              href={work.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-highlight)]"
            >
              Open reference
            </a>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          {work.sections.map((section) => (
            <article
              key={section.id}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                  {section.title}
                </h2>
                {section.citation ? (
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                    {section.citation}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-muted)]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
