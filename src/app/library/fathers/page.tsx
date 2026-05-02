import Link from "next/link";
import AppHeader from "@/components/app-header";
import FathersMobileLibrary from "@/components/fathers-mobile-library";
import SectionHeading from "@/components/section-heading";
import { fathersLibrary } from "@/lib/content";

export default function FathersPage() {
  return (
    <>
      <FathersMobileLibrary fathers={fathersLibrary} />

      <div className="hidden lg:block">
        <AppHeader />
      </div>
      <main className="hidden lg:block mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Church Fathers"
          title="Patristic texts are now organized as a full-text library."
          body="Open a father, choose a work, and read the full document chapter by chapter."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {fathersLibrary.map((father) => (
            <article
              key={father.slug}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                    {father.tradition}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                    {father.name}
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                  {father.era}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--color-soft)]">
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
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {father.summary}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-soft)]">
                {father.region}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {father.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                  >
                    {theme}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-highlight)]">
                  Included Works
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
                  {father.works.map((work) => (
                    <li key={work.slug}>
                      {work.title} ({work.stats.sectionCount} sections, {work.stats.paragraphCount} paragraphs)
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/library/fathers/${father.slug}`}
                className="mt-6 inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
              >
                Open father
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
