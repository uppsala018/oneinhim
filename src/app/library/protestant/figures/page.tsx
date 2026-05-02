import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SectionHeading from "@/components/section-heading";
import { protestantFigures } from "@/lib/content";

const protestantFigureSections = [
  {
    icon: "1",
    title: "Reformation Figures",
    items: protestantFigures.map((figure) => ({
      title: figure.name,
      detail: `${figure.era} - ${figure.tradition}`,
      href: `/library/protestant/figures/${figure.slug}`,
    })),
  },
  {
    icon: "2",
    title: "Primary Texts",
    items: [
      {
        title: "Martin Luther",
        detail: "Ninety-Five Theses, Large Catechism, and other Reformation writings.",
        href: "/library/protestant/figures/martin-luther",
      },
      {
        title: "John Calvin",
        detail: "Institutes of the Christian Religion and key doctrinal texts.",
        href: "/library/protestant/figures/john-calvin",
      },
      {
        title: "Huldrych Zwingli",
        detail: "Swiss reform, Scripture, worship, and Eucharistic controversy.",
        href: "/library/protestant/figures/huldrych-zwingli",
      },
      {
        title: "John Knox",
        detail: "Scottish Reformation and Presbyterian church order.",
        href: "/library/protestant/figures/john-knox",
      },
      {
        title: "John Wesley",
        detail: "Methodist preaching and holiness emphasis.",
        href: "/library/protestant/figures/john-wesley",
      },
    ],
  },
  {
    icon: "3",
    title: "Confessions And Catechisms",
    items: [
      {
        title: "Protestant Text Library",
        detail: "Augsburg, Heidelberg, Westminster, and related doctrinal standards.",
        href: "/library/protestant/texts",
      },
      {
        title: "Augsburg Confession",
        detail: "Lutheran confession and doctrinal summary.",
        href: "/library/protestant/texts/augsburg-confession",
      },
      {
        title: "Heidelberg Catechism",
        detail: "Comfort, guilt, grace, and gratitude.",
        href: "/library/protestant/texts/heidelberg-catechism",
      },
      {
        title: "Westminster Shorter Catechism",
        detail: "Major English Reformed catechetical standard.",
        href: "/library/protestant/texts/westminster-shorter-catechism",
      },
    ],
  },
  {
    icon: "4",
    title: "History And Movements",
    items: [
      {
        title: "Reformation History",
        detail: "Historical context for reform, conflict, and renewal.",
        href: "/library/history/reformation",
      },
      {
        title: "Reformation Era Study",
        detail: "Internal analysis page on the Reformation movement.",
        href: "/library/protestant/reformation-era",
      },
      {
        title: "Post-Reformation Movements",
        detail: "Later Protestant development and theological streams.",
        href: "/library/protestant/post-reformation-movements",
      },
      {
        title: "Charismatic Movement",
        detail: "Pentecostal and charismatic renewal as a major Protestant branch.",
        href: "/library/history/charismatic-movement",
      },
    ],
  },
  {
    icon: "5",
    title: "Shared Fathers",
    items: [
      {
        title: "Church Fathers",
        detail: "Shared fathers library.",
        href: "/library/fathers",
      },
      {
        title: "Augustine: Confessions",
        detail: "Grace, conversion, memory, and prayer.",
        href: "/library/fathers/augustine-hippo/confessions",
      },
      {
        title: "Athanasius",
        detail: "Christology, incarnation, and Nicene theology.",
        href: "/library/fathers/athanasius",
      },
      {
        title: "CCEL",
        detail: "Christian classics and theological texts.",
        href: "https://www.ccel.org/",
      },
    ],
  },
];

export default function ProtestantFiguresPage() {
  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <main className="orthodox-mobile mobile-app-shell lg:hidden">
        <header className="orthodox-mobile__topbar">
          <Link href="/library/protestant" className="orthodox-mobile__back" aria-label="Back to Protestant Resources">
            ‹
          </Link>
          <span className="orthodox-mobile__cross">✝</span>
          <h1>Protestant Figures</h1>
        </header>

        <section className="orthodox-mobile__intro">
          <p>Protestant Figures</p>
          <h2>Reformers, theologians, confessions, and historical movements.</h2>
          <span>
            Read Protestant figures through internal study profiles and primary texts, not only external links.
          </span>
        </section>

        <section className="orthodox-mobile__sections" aria-label="Protestant figure sections">
          {protestantFigureSections.map((section) => (
            <article key={section.title} className="orthodox-mobile-card">
              <div className="orthodox-mobile-card__head">
                <span className="orthodox-mobile-card__icon">{section.icon}</span>
                <h2>{section.title}</h2>
                <span className="orthodox-mobile-card__chevron">⌄</span>
              </div>
              <div className="orthodox-mobile-card__items">
                {section.items.map((item) =>
                  item.href.startsWith("https://") ? (
                    <a key={`${section.title}-${item.title}`} href={item.href} target="_blank" rel="noreferrer">
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.detail}</small>
                      </span>
                      <span>›</span>
                    </a>
                  ) : (
                    <Link key={`${section.title}-${item.title}`} href={item.href}>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.detail}</small>
                      </span>
                      <span>›</span>
                    </Link>
                  ),
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="orthodox-mobile__notice">
          <h2>Study note</h2>
          <p>
            Protestant study here is built around Scripture, reformers, confessions, and the shared
            ancient sources that shaped later Protestant debate.
          </p>
        </section>

        <MobileBottomNav active="Home" />
      </main>

      <main className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Protestant Figures"
          title="Reformers and Protestant theologians"
          body="Read Protestant figures through internal study profiles and primary texts, not only external links."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {protestantFigures.map((figure) => (
            <Link
              key={figure.slug}
              href={`/library/protestant/figures/${figure.slug}`}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition hover:bg-[rgba(8,26,57,0.88)]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                {figure.tradition}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                {figure.name}
              </h2>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {figure.era} · {figure.region}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {figure.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {figure.themes.slice(0, 4).map((theme) => (
                  <span
                    key={`${figure.slug}-${theme}`}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
