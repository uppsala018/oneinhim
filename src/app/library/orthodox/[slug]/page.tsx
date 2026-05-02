import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import {
  getOrthodoxStudyEntry,
  orthodoxStudyLibrary,
} from "@/lib/content";

export function generateStaticParams() {
  return orthodoxStudyLibrary.map((entry) => ({
    slug: entry.slug,
  }));
}

export default async function OrthodoxStudyEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getOrthodoxStudyEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/orthodox"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Orthodox Resources
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {entry.category}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            {entry.title}
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {entry.summary}
          </p>
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

        {entry.links?.length ? (
          <section className="mt-10 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
              Resources
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {entry.links.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4 text-sm text-[var(--color-ink)]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4 text-sm text-[var(--color-ink)]"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
