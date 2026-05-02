import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import { getCatechismEntry, romanCatechismLibrary } from "@/lib/content";

export function generateStaticParams() {
  return romanCatechismLibrary.map((entry) => ({
    slug: entry.slug,
  }));
}

export default async function CatechismEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCatechismEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/catechism"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Catechism
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {entry.part}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {entry.title}
              </h1>
            </div>
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
              Entry {entry.order}
            </span>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {entry.summary}
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
            Jump to section
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {entry.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)]"
              >
                {section.title ?? "Intro"}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-5">
          {entry.sections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="rounded-[1.8rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              {section.title ? (
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                  {section.title}
                </h2>
              ) : null}
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={`${section.id}-${index}`}
                    className="text-sm leading-8 text-[var(--color-ink)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
