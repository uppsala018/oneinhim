import Link from "next/link";
import AppHeader from "@/components/app-header";
import { orthodoxDivineLiturgyGuide } from "@/lib/content";

export default function DivineLiturgyGuidePage() {
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
            Divine Liturgy & Prayer
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            {orthodoxDivineLiturgyGuide.title}
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
            {orthodoxDivineLiturgyGuide.subtitle}
          </p>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {orthodoxDivineLiturgyGuide.summary}
          </p>
        </section>

        <section className="mt-10 grid gap-5">
          {orthodoxDivineLiturgyGuide.steps.map((step, index) => (
            <article
              key={step.id}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                    {String(index + 1).padStart(2, "0")} - {step.phase}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                    {step.title}
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] p-4">
                  <h3 className="font-semibold text-[var(--color-highlight)]">
                    Liturgical Action
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {step.liturgicalAction}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] p-4">
                  <h3 className="font-semibold text-[var(--color-highlight)]">
                    Meaning
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {step.meaning}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] p-4">
                  <h3 className="font-semibold text-[var(--color-highlight)]">
                    Study Prompt
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {step.studyPrompt}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {step.links.map((link) =>
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
