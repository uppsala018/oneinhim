import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SectionHeading from "@/components/section-heading";
import { protestantWorks } from "@/lib/content";

const protestantTextSections = [
  {
    icon: "1",
    title: "Lutheran Standards",
    items: [
      {
        title: "Augsburg Confession",
        detail: "The chief Lutheran confession and a key map for evangelical doctrine.",
        href: "/library/protestant/texts/augsburg-confession",
      },
      {
        title: "Luther's Large Catechism",
        detail: "Pastoral catechesis on the commandments, creed, prayer, baptism, and the Supper.",
        href: "/library/protestant/texts/luther-large-catechism",
      },
      {
        title: "Martin Luther",
        detail: "Reformation writings and catechetical study through the reformer's own voice.",
        href: "/library/protestant/figures/martin-luther",
      },
    ],
  },
  {
    icon: "2",
    title: "Reformed Standards",
    items: [
      {
        title: "Heidelberg Catechism",
        detail: "A classic Reformed text shaped around guilt, grace, and gratitude.",
        href: "/library/protestant/texts/heidelberg-catechism",
      },
      {
        title: "Westminster Shorter Catechism",
        detail: "A concise doctrinal standard for Presbyterian and Reformed study.",
        href: "/library/protestant/texts/westminster-shorter-catechism",
      },
      {
        title: "John Calvin",
        detail: "Institutes, Scripture, and church order through Calvin's own study path.",
        href: "/library/protestant/figures/john-calvin",
      },
    ],
  },
  {
    icon: "3",
    title: "Anglican And Baptist Standards",
    items: [
      {
        title: "Thirty-Nine Articles",
        detail: "The doctrinal standard of classical Anglicanism.",
        href: "/library/protestant/texts/thirty-nine-articles",
      },
      {
        title: "Second London Baptist Confession",
        detail: "A major Baptist confession built on Reformed theology.",
        href: "/library/protestant/texts/london-baptist-confession-1689",
      },
      {
        title: "John Wesley",
        detail: "Methodist theology, holiness, and later Protestant devotional life.",
        href: "/library/protestant/figures/john-wesley",
      },
    ],
  },
  {
    icon: "4",
    title: "Study Routes",
    items: [
      {
        title: "Reformation Era Study",
        detail: "Historical analysis of the first Protestant fractures and doctrinal lines.",
        href: "/library/protestant/reformation-era",
      },
      {
        title: "Reformation History",
        detail: "Church history context for the Protestant emergence.",
        href: "/library/history/reformation",
      },
      {
        title: "Protestant Figures",
        detail: "Internal profiles for reformers and later Protestant theologians.",
        href: "/library/protestant/figures",
      },
      {
        title: "Church Fathers",
        detail: "Shared ancient sources that still shape Protestant reading.",
        href: "/library/fathers",
      },
    ],
  },
];

const protestantWorkGroups = [
  {
    title: "Lutheran Standards",
    summary: "Classical Lutheran texts that define confession, catechesis, and worship.",
    slugs: ["augsburg-confession", "luther-large-catechism"],
  },
  {
    title: "Reformed Standards",
    summary: "Texts that shaped Reformed and Presbyterian doctrine and teaching.",
    slugs: ["heidelberg-catechism", "westminster-shorter-catechism"],
  },
  {
    title: "Anglican And Baptist Standards",
    summary: "Confessional texts that show how Protestant identity developed in England and beyond.",
    slugs: ["thirty-nine-articles", "london-baptist-confession-1689"],
  },
];

export default function ProtestantTextsPage() {
  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <main className="orthodox-mobile mobile-app-shell lg:hidden">
        <header className="orthodox-mobile__topbar">
          <Link href="/library/protestant" className="orthodox-mobile__back" aria-label="Back to Protestant Resources">
            &lt;
          </Link>
          <span className="orthodox-mobile__cross">+</span>
          <h1>Protestant Texts</h1>
        </header>

        <section className="orthodox-mobile__intro">
          <p>Protestant Texts</p>
          <h2>Confessions, catechisms, and doctrinal standards.</h2>
          <span>
            Study the Protestant tradition through its own primary texts rather than only through summaries.
          </span>
        </section>

        <section className="orthodox-mobile__sections" aria-label="Protestant text sections">
          {protestantTextSections.map((section) => (
            <article key={section.title} className="orthodox-mobile-card">
              <div className="orthodox-mobile-card__head">
                <span className="orthodox-mobile-card__icon">{section.icon}</span>
                <h2>{section.title}</h2>
                <span className="orthodox-mobile-card__chevron">&gt;</span>
              </div>
              <div className="orthodox-mobile-card__items">
                {section.items.map((item) => (
                  <Link key={`${section.title}-${item.title}`} href={item.href}>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <span>&gt;</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="orthodox-mobile__notice">
          <h2>Study note</h2>
          <p>
            These texts are grouped by tradition so the Protestant section stays readable on mobile and
            the doctrinal family lines remain clear.
          </p>
        </section>

        <MobileBottomNav active="Home" />
      </main>

      <main className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Protestant Texts"
          title="Confessions, catechisms, and doctrinal standards"
          body="The Protestant text hub keeps the major standards in one place so the tradition has real internal depth, not just historical labels."
        />

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {protestantWorkGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                {group.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{group.summary}</p>
              <div className="mt-5 grid gap-3">
                {group.slugs.map((slug) => {
                  const work = protestantWorks.find((entry) => entry.slug === slug);

                  if (!work) {
                    return null;
                  }

                  return (
                    <Link
                      key={work.slug}
                      href={`/library/protestant/texts/${work.slug}`}
                      className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-soft)]">
                        {work.tradition} - {work.yearLabel}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                        {work.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                        {work.summary}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                All Protestant Works
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                Browse the full text library
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {protestantWorks.map((work) => (
              <Link
                key={work.slug}
                href={`/library/protestant/texts/${work.slug}`}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5 transition hover:bg-[rgba(8,26,57,0.88)]"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                  {work.category}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                  {work.title}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                  {work.tradition} - {work.yearLabel}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {work.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
