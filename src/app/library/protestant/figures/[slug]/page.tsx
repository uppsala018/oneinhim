import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import { getProtestantFigure, protestantFigures } from "@/lib/content";

export function generateStaticParams() {
  return protestantFigures.map((figure) => ({
    slug: figure.slug,
  }));
}

export default async function ProtestantFigurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const figure = getProtestantFigure(slug);

  if (!figure) {
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
            href="/library/protestant/figures"
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Browse figures
          </Link>
        </div>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {figure.tradition}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {figure.name}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {figure.era} · {figure.region}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {figure.themes.map((theme) => (
                <span
                  key={`${figure.slug}-${theme}`}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {figure.bio}
          </p>
        </section>

        <section className="mt-10 space-y-8">
          {figure.works.map((work) => (
            <article
              key={work.slug}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                    {work.title}
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                  {work.yearLabel}
                </span>
              </div>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--color-muted)]">
                {work.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5">
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                  <span>{work.stats.sectionCount} sections</span>
                  <span>{work.stats.paragraphCount} paragraphs</span>
                </div>
                <Link
                  href={`/library/protestant/figures/${figure.slug}/${work.slug}`}
                  className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                >
                  Read text
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
