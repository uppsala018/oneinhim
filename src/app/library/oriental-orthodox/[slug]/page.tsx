import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import {
  getOrientalOrthodoxEntry,
  orientalOrthodoxLibrary,
} from "@/lib/content";

export function generateStaticParams() {
  return orientalOrthodoxLibrary.map((entry) => ({
    slug: entry.slug,
  }));
}

export default async function OrientalOrthodoxEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getOrientalOrthodoxEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/library/oriental-orthodox"
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Back to Oriental Orthodox
          </Link>
        </div>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {entry.tradition}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {entry.title}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {entry.author} - {entry.era}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {entry.summary}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-soft)]">
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-highlight)]"
            >
              Open reference
            </a>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          {entry.sections.map((section) => (
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
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
