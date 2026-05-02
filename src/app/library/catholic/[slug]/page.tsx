import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import { catholicLibrary, getCatholicStudyEntry } from "@/lib/content";

export function generateStaticParams() {
  return catholicLibrary.map((entry) => ({
    slug: entry.slug,
  }));
}

export default async function CatholicStudyEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCatholicStudyEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/catholic"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Catholic Bible
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {entry.translation}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {entry.title}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {entry.focus} - {entry.book} {entry.chapter}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {entry.summary}
          </p>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
              Scripture Reading
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
              {entry.book} {entry.chapter}
            </h2>
            <div className="mt-6 space-y-4">
              {entry.verses.map((verse) => (
                <article
                  key={verse.id}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                >
                  <p className="text-sm leading-8 text-[var(--color-ink)]">
                    <span className="mr-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                      {verse.number}
                    </span>
                    {verse.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(75,38,40,0.98),rgba(17,21,40,0.94))] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                {entry.catechismTitle}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                {entry.catechismReference}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {entry.catechismExcerpt}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Cross References
              </p>
              <div className="mt-5 space-y-4">
                {entry.crossReferences.map((item) => (
                  <article
                    key={item.reference}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4"
                  >
                    <p className="font-semibold text-[var(--color-highlight)]">
                      {item.reference}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {item.note}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
