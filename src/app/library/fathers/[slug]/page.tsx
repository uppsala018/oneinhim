import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import { fathersLibrary, getFatherProfile } from "@/lib/content";
import { getFatherStudyGuide } from "@/lib/father-study-guides";

export function generateStaticParams() {
  return fathersLibrary.map((father) => ({
    slug: father.slug,
  }));
}

export default async function FatherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const father = getFatherProfile(slug);

  if (!father) {
    notFound();
  }

  const studyGuide = getFatherStudyGuide(father);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/fathers"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Fathers
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            {father.tradition}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
                {father.name}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {father.era} - {father.region}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]">
                {father.stream === "shared" ? "Shared Catholic/Orthodox" : father.stream}
              </span>
              {father.studyTracks.map((track) => (
                <span
                  key={`${father.slug}-${track}`}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                >
                  {track}
                </span>
              ))}
              {father.themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {father.bio}
          </p>
        </section>

        <section className="mt-10 overflow-hidden rounded-[2.4rem] border border-[rgba(230,190,120,0.45)] bg-[linear-gradient(145deg,rgba(230,190,120,0.12),rgba(8,24,46,0.82)_42%,rgba(5,17,34,0.94))] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="border-b border-[var(--color-border)] p-7 sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Start Here
            </p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] sm:text-5xl">
                  How to read {father.name}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
                  {studyGuide.why}
                </p>
              </div>

              {studyGuide.startWork ? (
                <Link
                  href={`/library/fathers/${father.slug}/${studyGuide.startWork.slug}`}
                  className="rounded-[1.5rem] border border-[rgba(230,190,120,0.48)] bg-[rgba(230,190,120,0.08)] p-5 transition hover:border-[var(--color-highlight)]"
                >
                  <span className="text-xs uppercase tracking-[0.25em] text-[var(--color-soft)]">
                    Best first work
                  </span>
                  <span className="mt-2 block font-[family-name:var(--font-display)] text-2xl text-[var(--color-highlight)]">
                    {studyGuide.startWork.title}
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-[var(--color-muted)]">
                    {studyGuide.startNote}
                  </span>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] p-5">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                Suggested Reading Order
              </h3>
              <ol className="mt-5 space-y-4">
                {studyGuide.readingOrder.map((item, index) => (
                  <li key={`${item.title}-${index}`} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm text-[var(--color-highlight)]">
                      {index + 1}
                    </span>
                    <span>
                      {item.work ? (
                        <Link
                          href={`/library/fathers/${father.slug}/${item.work.slug}`}
                          className="font-[family-name:var(--font-display)] text-xl text-[var(--color-highlight)] hover:text-[var(--color-ink)]"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-highlight)]">
                          {item.title}
                        </span>
                      )}
                      <span className="mt-1 block text-sm leading-6 text-[var(--color-muted)]">
                        {item.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] p-5">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                Key Doctrines And Themes
              </h3>
              <div className="mt-5 space-y-4">
                {studyGuide.keyIdeas.map((idea) => (
                  <div key={idea.term}>
                    <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-highlight)]">
                      {idea.term}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                      {idea.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] p-5">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                Tradition Lens
              </h3>
              <div className="mt-5 space-y-4">
                {studyGuide.traditionLens.map((lens) => (
                  <div key={lens.tradition}>
                    <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-highlight)]">
                      {lens.tradition}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                      {lens.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] p-5">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                Scripture And Terms
              </h3>
              <div className="mt-5">
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-highlight)]">
                  Scripture connections
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {studyGuide.scriptureConnections.map((reference) => (
                    <span
                      key={reference}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-soft)]"
                    >
                      {reference}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {studyGuide.glossary.map((item) => (
                  <div key={item.term}>
                    <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-highlight)]">
                      {item.term}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-8">
          {father.works.map((work) => (
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
                  href={`/library/fathers/${father.slug}/${work.slug}`}
                  className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                >
                  Read full text
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
