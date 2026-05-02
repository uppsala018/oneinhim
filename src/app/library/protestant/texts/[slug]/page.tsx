import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import { getProtestantWork, protestantWorks } from "@/lib/content";

export function generateStaticParams() {
  return protestantWorks.map((work) => ({
    slug: work.slug,
  }));
}

export default async function ProtestantWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getProtestantWork(slug);

  if (!work) {
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
            href="/library/protestant/texts"
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Browse Protestant texts
          </Link>
        </div>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {work.category}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {work.title}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {work.tradition} · {work.yearLabel}
              </p>
            </div>
            <a
              href={work.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
            >
              Open reference
            </a>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {work.summary}
          </p>
        </section>

        <section className="mt-10 space-y-6">
          {work.sections.map((section) => (
            <article
              key={section.id}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-muted)]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>{paragraph}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-5 space-y-2 text-sm leading-7 text-[var(--color-muted)]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>- {bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
