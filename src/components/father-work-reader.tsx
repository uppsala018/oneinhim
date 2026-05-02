"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import type { FatherProfile, FatherSection, FatherWork } from "@/lib/content-types";

type WorkNavTarget = {
  href: string;
  label: string;
} | null;

type FatherWorkReaderProps = {
  father: FatherProfile;
  work: FatherWork;
  previousWork: WorkNavTarget;
  nextWork: WorkNavTarget;
};

function sectionText(section: FatherSection) {
  return `${section.title} ${section.citation ?? ""} ${section.paragraphs.join(" ")}`.toLowerCase();
}

function sectionPreview(section: FatherSection) {
  const firstParagraph = section.paragraphs[0] ?? "";
  return firstParagraph.length > 145 ? `${firstParagraph.slice(0, 145)}...` : firstParagraph;
}

export default function FatherWorkReader({
  father,
  work,
  previousWork,
  nextWork,
}: FatherWorkReaderProps) {
  const [query, setQuery] = useState("");
  const [readerWidth, setReaderWidth] = useState<"comfortable" | "wide">("comfortable");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleSections = useMemo(() => {
    if (!deferredQuery) {
      return work.sections;
    }

    return work.sections.filter((section) => sectionText(section).includes(deferredQuery));
  }, [deferredQuery, work.sections]);

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[1.8rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.78)] p-5 shadow-2xl shadow-black/20">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
            Reader tools
          </p>

          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
              Search this work
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search text or title..."
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(7,27,55,0.75)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[rgba(203,196,178,0.62)]"
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setReaderWidth("comfortable")}
              className={`rounded-full border px-3 py-2 text-xs ${
                readerWidth === "comfortable"
                  ? "border-[var(--color-highlight)] text-[var(--color-highlight)]"
                  : "border-[var(--color-border)] text-[var(--color-soft)]"
              }`}
            >
              Comfort
            </button>
            <button
              type="button"
              onClick={() => setReaderWidth("wide")}
              className={`rounded-full border px-3 py-2 text-xs ${
                readerWidth === "wide"
                  ? "border-[var(--color-highlight)] text-[var(--color-highlight)]"
                  : "border-[var(--color-border)] text-[var(--color-soft)]"
              }`}
            >
              Wide
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[rgba(2,9,20,0.34)] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
              Contents
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {visibleSections.length} of {work.sections.length} sections
            </p>
            <nav className="mt-3 max-h-[52vh] space-y-2 overflow-y-auto pr-1">
              {visibleSections.slice(0, 80).map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl border border-transparent px-3 py-2 text-sm leading-snug text-[var(--color-soft)] hover:border-[var(--color-border)] hover:text-[var(--color-highlight)]"
                >
                  {section.title}
                </a>
              ))}
              {visibleSections.length > 80 ? (
                <p className="px-3 py-2 text-xs text-[var(--color-muted)]">
                  Search to narrow the table of contents.
                </p>
              ) : null}
            </nav>
          </div>
        </div>
      </aside>

      <section
        className={`space-y-6 ${readerWidth === "comfortable" ? "max-w-4xl" : "max-w-none"}`}
        aria-label={`${father.name}, ${work.title}`}
      >
        {deferredQuery ? (
          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.62)] p-4 text-sm text-[var(--color-soft)]">
            Showing {visibleSections.length} matching sections for{" "}
            <span className="text-[var(--color-highlight)]">{query}</span>.
          </div>
        ) : null}

        {visibleSections.map((section, visibleIndex) => {
          const originalIndex = work.sections.findIndex((candidate) => candidate.id === section.id);
          const previousSection = originalIndex > 0 ? work.sections[originalIndex - 1] : null;
          const nextSection =
            originalIndex >= 0 && originalIndex < work.sections.length - 1
              ? work.sections[originalIndex + 1]
              : null;

          return (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                    Section {originalIndex + 1} of {work.sections.length}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                    {section.title}
                  </h2>
                </div>
                {section.citation && section.citation !== section.title ? (
                  <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--color-soft)]">
                    {section.citation}
                  </span>
                ) : null}
              </div>

              {deferredQuery ? (
                <p className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(229,197,122,0.06)] p-3 text-sm leading-6 text-[var(--color-soft)]">
                  {sectionPreview(section)}
                </p>
              ) : null}

              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-muted)] sm:text-lg sm:leading-9">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  {previousSection ? (
                    <a
                      href={`#${previousSection.id}`}
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-soft)]"
                    >
                      Previous section
                    </a>
                  ) : null}
                  {nextSection ? (
                    <a
                      href={`#${nextSection.id}`}
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-highlight)]"
                    >
                      Next section
                    </a>
                  ) : null}
                </div>
                <a href="#work-top" className="text-[var(--color-soft)]">
                  Back to top
                </a>
              </div>

              {visibleIndex === visibleSections.length - 1 ? (
                <div className="mt-6 grid gap-3 border-t border-[var(--color-border)] pt-5 sm:grid-cols-2">
                  {previousWork ? (
                    <Link
                      href={previousWork.href}
                      className="rounded-2xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-soft)]"
                    >
                      Previous work
                      <span className="mt-1 block text-[var(--color-highlight)]">
                        {previousWork.label}
                      </span>
                    </Link>
                  ) : null}
                  {nextWork ? (
                    <Link
                      href={nextWork.href}
                      className="rounded-2xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-soft)]"
                    >
                      Next work
                      <span className="mt-1 block text-[var(--color-highlight)]">
                        {nextWork.label}
                      </span>
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}

        {visibleSections.length === 0 ? (
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8 text-[var(--color-muted)]">
            No sections matched that search.
          </div>
        ) : null}
      </section>
    </div>
  );
}
