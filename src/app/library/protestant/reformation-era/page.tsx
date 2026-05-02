import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SectionHeading from "@/components/section-heading";
import { getProtestantEntry, protestantFigures } from "@/lib/content";

const reformationEntry = getProtestantEntry("reformation-era");

const reformationMobileSections = [
  {
    icon: "1",
    title: "The Break And The Question Of Authority",
    items: [
      {
        title: "Reformation History",
        detail: "The broader historical setting for late medieval reform and conflict.",
        href: "/library/history/reformation",
      },
      {
        title: "Martin Luther",
        detail: "The first major Protestant public challenge to indulgence preaching.",
        href: "/library/protestant/figures/martin-luther",
      },
      {
        title: "Protestant Texts",
        detail: "Confessions and catechisms that show how reform became doctrine.",
        href: "/library/protestant/texts",
      },
    ],
  },
  {
    icon: "2",
    title: "German And Swiss Reform",
    items: [
      {
        title: "John Calvin",
        detail: "The second generation and the rise of Reformed theology.",
        href: "/library/protestant/figures/john-calvin",
      },
      {
        title: "Huldrych Zwingli",
        detail: "Zurich reform, worship, and Eucharistic controversy.",
        href: "/library/protestant/figures/huldrych-zwingli",
      },
      {
        title: "Augsburg Confession",
        detail: "Lutheran doctrine organized into a public confession.",
        href: "/library/protestant/texts/augsburg-confession",
      },
      {
        title: "Heidelberg Catechism",
        detail: "A warm Reformed catechism for teaching and devotion.",
        href: "/library/protestant/texts/heidelberg-catechism",
      },
    ],
  },
  {
    icon: "3",
    title: "England, Scotland, And Confessional Protestantism",
    items: [
      {
        title: "John Knox",
        detail: "Scottish Reformation and Presbyterian church order.",
        href: "/library/protestant/figures/john-knox",
      },
      {
        title: "Thirty-Nine Articles",
        detail: "Classical Anglican doctrinal identity.",
        href: "/library/protestant/texts/thirty-nine-articles",
      },
      {
        title: "Westminster Shorter Catechism",
        detail: "Presbyterian teaching in compact form.",
        href: "/library/protestant/texts/westminster-shorter-catechism",
      },
      {
        title: "Second London Baptist Confession",
        detail: "Baptist confessional life in Reformed language.",
        href: "/library/protestant/texts/london-baptist-confession-1689",
      },
    ],
  },
  {
    icon: "4",
    title: "Later Protestant Paths",
    items: [
      {
        title: "John Wesley",
        detail: "Methodism and the later holiness emphasis.",
        href: "/library/protestant/figures/john-wesley",
      },
      {
        title: "Post-Reformation Movements",
        detail: "Puritan, Pietist, Methodist, and holiness developments.",
        href: "/library/protestant/post-reformation-movements",
      },
      {
        title: "Church History Timeline",
        detail: "See the larger Christian divisions from apostolic roots onward.",
        href: "/library/history/timeline",
      },
    ],
  },
];

export default function ProtestantReformationEraPage() {
  if (!reformationEntry) {
    notFound();
  }

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
          <h1>The Reformation Era</h1>
        </header>

        <section className="orthodox-mobile__intro">
          <p>Protestant History</p>
          <h2>From Luther to confessional Protestantism and beyond.</h2>
          <span>
            Follow the first fracture points of Protestant history through reformers, confessions, and later
            Protestant trajectories.
          </span>
        </section>

        <section className="orthodox-mobile__sections" aria-label="Reformation era sections">
          {reformationMobileSections.map((section) => (
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
            The Reformation was not one event with one result. It produced Lutheran, Reformed,
            Anglican, Baptist, Methodist, and later charismatic streams.
          </p>
        </section>

        <MobileBottomNav active="Home" />
      </main>

      <main className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Reformation Era"
          title="Origins of Protestant theology and ecclesial separation"
          body="The Reformation Era page collects the first major Protestant fracture points and shows how theology, authority, and worship developed into different confessional lines."
        />

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="space-y-6">
            {reformationEntry.sections.map((section) => (
              <article
                key={section.id}
                className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
              >
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-muted)]">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-2 text-sm leading-7 text-[var(--color-muted)]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>- {bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Key Reformers
              </p>
              <div className="mt-5 grid gap-4">
                {protestantFigures.map((figure) => (
                  <Link
                    key={figure.slug}
                    href={`/library/protestant/figures/${figure.slug}`}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                      {figure.name}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                      {figure.era} - {figure.tradition}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {figure.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Continue With
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  ["/library/protestant/texts", "Protestant Texts", "Confessions and catechisms in one library."],
                  ["/library/protestant/figures", "Protestant Figures", "Reformers and theologians through their own profiles."],
                  ["/library/history/reformation", "Reformation History", "A broader historical frame for the movement."],
                  ["/library/history/timeline", "Church History Timeline", "See the larger split and branch patterns."],
                ].map(([href, label, detail]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4"
                  >
                    <p className="font-semibold text-[var(--color-ink)]">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{detail}</p>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </>
  );
}
