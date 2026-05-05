import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import {
  getOrientalOrthodoxEntry,
  orientalOrthodoxLibrary,
} from "@/lib/content";

export function generateStaticParams() {
  return orientalOrthodoxLibrary.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getOrientalOrthodoxEntry(slug);
  if (!entry) return buildMeta({ title: "Not Found", description: "Entry not found." });
  const desc = ((entry.summary ?? `Study ${entry.title} in the Oriental Orthodox library.`).slice(0, 155));
  return buildMeta({
    title: entry.title,
    description: desc,
    keywords: `${entry.title}, Oriental Orthodox, Coptic church, Ethiopian Orthodox, Syriac Christianity`,
    path: `/library/oriental-orthodox/${slug}`,
  });
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
      <main className="mx-auto max-w-6xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Library", href: "/library" },
          { label: "Oriental Orthodox", href: "/library/oriental-orthodox" },
          { label: entry.title },
        ]} />

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
