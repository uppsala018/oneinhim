import type { Metadata } from "next";
import { buildCollectionPageSchema, buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import FathersMobileLibrary from "@/components/fathers-mobile-library";
import SiteHeroPanel from "@/components/site-hero-panel";
import { fathersLibrary } from "@/lib/content";

export const metadata: Metadata = buildMeta({
  title: "Church Fathers — Patristic Writings Library",
  description: "Read the early church fathers — Ignatius of Antioch, Justin Martyr, Origen, Augustine, Chrysostom and more. Free patristic writings from every era.",
  keywords: "church fathers, patristic writings, early church fathers, Augustine, Chrysostom, Ignatius of Antioch, christian history",
  path: "/library/fathers",
});

const FATHERS_SCHEMA = buildCollectionPageSchema({
  path: "/library/fathers",
  name: "Church Fathers — Patristic Writings Library",
  description:
    "A patristic writings library with Church Father profiles, complete primary texts, and study paths across Christian traditions.",
  about: ["Church Fathers", "Patristics", "Early Christianity", "Christian theology"],
});

const FATHERS_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who are the Church Fathers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Church Fathers are early Christian writers from roughly the 1st to 8th centuries whose works shaped Christian theology and practice. They include the Apostolic Fathers (those who knew the apostles or their successors), the early Apologists who defended Christianity to Rome, and the great Nicene and post-Nicene writers who settled Trinitarian and Christological doctrine.",
      },
    },
    {
      "@type": "Question",
      name: "What is patristics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Patristics (from Latin pater, father) is the branch of theology and church history devoted to the study of the Church Fathers' writings, lives, and teachings. Reading patristic texts directly is one of the most effective ways to understand how the early church interpreted Scripture and how core Christian doctrine was developed.",
      },
    },
    {
      "@type": "Question",
      name: "Which Christian traditions honor the Church Fathers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The early Fathers are honored across Catholic, Eastern Orthodox, Oriental Orthodox, and many Protestant traditions. Catholic and Orthodox churches formally canonize many of them as saints. Protestant Reformers including Luther and Calvin also appealed heavily to Augustine and other Fathers in their theological arguments.",
      },
    },
    {
      "@type": "Question",
      name: "What patristic works are available to read here?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Full primary texts are available for Ignatius of Antioch, Clement of Rome, Polycarp of Smyrna, Justin Martyr, Irenaeus of Lyon, Origen of Alexandria, Athanasius, Cyril of Jerusalem, Basil the Great, Gregory of Nazianzus, John Chrysostom, Augustine of Hippo, and more — with suggested reading orders tailored for Catholic, Orthodox, and Protestant study paths.",
      },
    },
  ],
};

const fathersFaq = [
  {
    question: "Who are the Church Fathers?",
    answer:
      "Early Christian writers from roughly the 1st to 8th centuries whose works shaped Christian theology. They include the Apostolic Fathers (who knew the apostles or their successors), the Apologists who defended the faith to Rome, and the great Nicene writers who settled Trinitarian doctrine.",
  },
  {
    question: "What is patristics?",
    answer:
      "Patristics (from Latin pater, father) is the study of the Church Fathers' writings, lives, and teachings. Reading patristic texts directly is one of the most effective ways to understand how the early church interpreted Scripture and developed doctrine.",
  },
  {
    question: "Which traditions honor the Church Fathers?",
    answer:
      "The early Fathers are honored across Catholic, Eastern Orthodox, Oriental Orthodox, and many Protestant traditions. Catholic and Orthodox churches formally canonize many as saints. Protestant Reformers including Luther and Calvin also appealed heavily to Augustine and the Fathers.",
  },
  {
    question: "What works are available here?",
    answer:
      "Full texts for Ignatius, Clement, Polycarp, Justin Martyr, Irenaeus, Origen, Athanasius, Cyril of Jerusalem, Basil the Great, Gregory of Nazianzus, Chrysostom, Augustine, and more — with suggested reading orders for each tradition.",
  },
];

export default function FathersPage() {
  return (
    <>
      <JsonLd data={FATHERS_SCHEMA} />
      <JsonLd data={FATHERS_FAQ} />

      {/* Mobile / tablet: searchable list with custom topbar */}
      <FathersMobileLibrary fathers={fathersLibrary} />

      {/* Desktop (≥1024px): centered polished layout */}
      <div className="hidden lg:block">
        <AppHeader />
      </div>
      <main className="hidden lg:block mx-auto max-w-7xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Library", href: "/library" },
          { label: "Church Fathers" },
        ]} />

        {/* Hero panel */}
        <SiteHeroPanel
          eyebrow="Patristics"
          title="Church Fathers"
          lead="The early church writers — Ignatius, Justin Martyr, Origen, Athanasius, Augustine, Chrysostom, and more — available here as complete primary texts organized by author and work. Browse father profiles, read the included writings, and follow suggested reading orders tailored for Catholic, Orthodox, and Protestant study."
        />

        {/* Father cards */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {fathersLibrary.map((father) => (
            <article
              key={father.slug}
              className="flex flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-highlight)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                    {father.tradition}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-[var(--color-ink)]">
                    {father.name}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs uppercase tracking-[0.15em] text-[var(--color-soft)]">
                  {father.era}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs text-[var(--color-soft)]">
                  {father.stream === "shared" ? "Shared Catholic/Orthodox" : father.stream}
                </span>
                {father.studyTracks.map((track) => (
                  <span
                    key={`${father.slug}-${track}`}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs text-[var(--color-soft)]"
                  >
                    {track}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {father.summary}
              </p>

              <div className="mt-4 rounded-[1.25rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                  Included Works
                </p>
                <ul className="mt-2 space-y-1 text-xs text-[var(--color-muted)]">
                  {father.works.map((work) => (
                    <li key={work.slug} className="leading-5">
                      {work.title}
                      <span className="ml-1 text-[var(--color-soft)]">
                        ({work.stats.sectionCount} sections)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/library/fathers/${father.slug}`}
                className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-highlight)] hover:underline"
              >
                Read writings →
              </Link>
            </article>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-14 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
            Common Questions
          </p>
          <h2 className="site-section-title mt-2">About the Church Fathers</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {fathersFaq.map((item) => (
              <div key={item.question}>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
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
