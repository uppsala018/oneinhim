import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import SectionHeading from "@/components/section-heading";
import { romanCatechismLibrary } from "@/lib/content";

export const metadata: Metadata = buildMeta({
  title: "Roman Catechism — Catechism of the Council of Trent",
  description: "Read the Roman Catechism (Catechism of Trent) online — the authoritative Catholic catechism from the Council of Trent, free and complete.",
  keywords: "Roman Catechism, Catechism of Trent, Catholic catechism, Council of Trent, Catholic doctrine, bible study",
  path: "/library/catechism",
});

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

const CATECHISM_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Roman Catechism?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Roman Catechism, also called the Catechism of the Council of Trent, was commissioned by the Council of Trent (1545–1563) and published in 1566 under Pope Pius V. It is an authoritative summary of Catholic doctrine written primarily for parish priests so they could teach the faith clearly and consistently.",
      },
    },
    {
      "@type": "Question",
      name: "How does the Roman Catechism differ from the modern Catechism?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Roman Catechism (1566) was written for clergy during the Counter-Reformation to address the challenges raised by the Protestant Reformation. The modern Catechism of the Catholic Church (CCC, 1992) is written for all the faithful and incorporates the teaching of the Second Vatican Council. Both are authoritative; the Roman Catechism is the classic Tridentine document.",
      },
    },
    {
      "@type": "Question",
      name: "What are the four parts of the Roman Catechism?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Following the traditional structure of catechetical instruction, the Roman Catechism covers four parts: (1) The Apostles' Creed — articles of faith; (2) The Sacraments — Baptism, Eucharist, Confirmation, Penance, Anointing, Holy Orders, and Matrimony; (3) The Ten Commandments — moral teaching; (4) The Lord's Prayer — prayer and devotion.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Roman Catechism free to read here?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The text here is the complete public-domain translation of the Catechismus Romanus, free to read with no account required. All four parts with their articles and sections are included.",
      },
    },
  ],
};

const catechismFaq = [
  {
    question: "What is the Roman Catechism?",
    answer:
      "Commissioned by the Council of Trent (1545–1563) and published in 1566 under Pope Pius V, it is an authoritative summary of Catholic doctrine written primarily for parish priests so they could teach the faith clearly and consistently.",
  },
  {
    question: "How does it differ from the modern Catechism (CCC)?",
    answer:
      "The Roman Catechism was written for clergy during the Counter-Reformation. The 1992 Catechism of the Catholic Church (CCC) is written for all the faithful and incorporates Vatican II teaching. Both are authoritative; the Roman Catechism is the classic Tridentine document.",
  },
  {
    question: "What are the four parts?",
    answer:
      "The Apostles' Creed (articles of faith), the Sacraments (seven sacraments explained), the Ten Commandments (moral teaching), and the Lord's Prayer (prayer and devotion) — the four classic pillars of Catholic catechetical instruction.",
  },
  {
    question: "Is it free to read?",
    answer:
      "Yes. The complete public-domain text is here at no cost, no account required. All four parts with their individual articles and sections are available.",
  },
];

export default function CatechismPage() {
  const groups = groupByPart();

  return (
    <>
      <JsonLd data={CATECHISM_FAQ} />
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Library", href: "/library" }, { label: "Roman Catechism" }]} />
        <h1 className="sr-only">Roman Catechism — Catechism of the Council of Trent</h1>
        <SectionHeading
          title="The Roman Catechism — complete and free."
          body="The Catechism of the Council of Trent (1566), commissioned at Trent and published under Pope Pius V, is here in full. Organized by the four classic pillars — Creed, Sacraments, Commandments, and the Lord's Prayer — it remains the authoritative Tridentine catechetical standard and a key reference for Catholic theology."
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
                className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4"
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
                    <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4">
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

        <section className="mt-16 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">Common Questions</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
            About the Roman Catechism
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {catechismFaq.map((item) => (
              <div key={item.question}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

