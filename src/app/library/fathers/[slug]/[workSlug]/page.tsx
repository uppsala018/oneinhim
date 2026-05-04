import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import FatherWorkReader from "@/components/father-work-reader";
import { fathersLibrary, getFatherProfile, getFatherWork } from "@/lib/content";

export function generateStaticParams() {
  return fathersLibrary.flatMap((father) =>
    father.works.map((work) => ({ slug: father.slug, workSlug: work.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; workSlug: string }> }): Promise<Metadata> {
  const { slug, workSlug } = await params;
  const father = getFatherProfile(slug);
  const work = getFatherWork(slug, workSlug);
  if (!father || !work) return buildMeta({ title: "Work Not Found", description: "Text not found." });
  return buildMeta({
    title: `${work.title} — ${father.name}`,
    description: `Read ${work.title} by ${father.name}. An early church patristic text from the ${father.era} era, free for Bible study and research.`.slice(0, 155),
    keywords: `${father.name}, ${work.title}, church fathers, patristic writings, early church`,
    path: `/library/fathers/${slug}/${workSlug}`,
  });
}

export default async function FatherWorkPage({
  params,
}: {
  params: Promise<{ slug: string; workSlug: string }>;
}) {
  const { slug, workSlug } = await params;
  const father = getFatherProfile(slug);
  const work = getFatherWork(slug, workSlug);

  if (!father || !work) {
    notFound();
  }

  const workIndex = father.works.findIndex((candidate) => candidate.slug === work.slug);
  const previousWork = workIndex > 0 ? father.works[workIndex - 1] : null;
  const nextWork =
    workIndex >= 0 && workIndex < father.works.length - 1 ? father.works[workIndex + 1] : null;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/library/fathers"
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Back to Fathers
          </Link>
          <Link
            href={`/library/fathers/${father.slug}`}
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Back to {father.name}
          </Link>
        </div>

        <section
          id="work-top"
          className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {father.name}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {work.title}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {work.yearLabel} - {father.tradition}
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
        </section>

        <FatherWorkReader
          father={father}
          work={work}
          previousWork={
            previousWork
              ? {
                  href: `/library/fathers/${father.slug}/${previousWork.slug}`,
                  label: previousWork.title,
                }
              : null
          }
          nextWork={
            nextWork
              ? {
                  href: `/library/fathers/${father.slug}/${nextWork.slug}`,
                  label: nextWork.title,
                }
              : null
          }
        />
      </main>
    </>
  );
}
