import Link from "next/link";
import AppHeader from "@/components/app-header";
import SectionHeading from "@/components/section-heading";
import { romanCatechismLibrary } from "@/lib/content";

function toPartId(part: string) {
  return part.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function groupByPart() {
  const grouped = new Map<string, typeof romanCatechismLibrary>();

  for (const entry of romanCatechismLibrary) {
    const bucket = grouped.get(entry.part) ?? [];
    bucket.push(entry);
    grouped.set(entry.part, bucket);
  }

  return [...grouped.entries()];
}

export default function CatechismPage() {
  const groups = groupByPart();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Roman Catechism"
          title="The full Catechism of Trent is now a real library inside the app."
          body="This section carries the public-domain Catechism of the Council of Trent as a route-backed library. The modern Catechism of the Catholic Church can be read free online at the Vatican website, but the embedded full text here is the Roman Catechism of Trent."
        />

        <section className="mt-10 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
            Table of Contents
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {groups.map(([part, entries]) => (
              <a
                key={part}
                href={`#${toPartId(part)}`}
                className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4"
              >
                <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                  {part}
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {entries.length} entries
                </p>
              </a>
            ))}
          </div>
        </section>

        <div className="mt-12 space-y-10">
          {groups.map(([part, entries]) => (
            <section key={part} id={toPartId(part)}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                  {part}
                </h2>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                  {entries.length} entries
                </span>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {entries.map((entry) => (
                  <article
                    key={entry.slug}
                    className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                      {entry.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {entry.summary}
                    </p>
                    <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-highlight)]">
                        Included Sections
                      </p>
                      <p className="mt-3 text-sm text-[var(--color-muted)]">
                        {entry.sections.length} thematic sections
                      </p>
                    </div>
                    <Link
                      href={`/library/catechism/${entry.slug}`}
                      className="mt-6 inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                    >
                      Open entry
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
