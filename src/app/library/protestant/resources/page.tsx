import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const protestantMobileSections = [
  {
    icon: "1",
    title: "Bible And Word Study",
    items: [
      {
        title: "KJV Bible + Strong's",
        detail: "KJV reader with Strong's integration.",
        href: "/library/kjv",
      },
      {
        title: "Genesis 1 With Strong's",
        detail: "Start with Genesis 1 and Strong's.",
        href: "/library/kjv?book=Gen&chapter=1",
      },
      {
        title: "John 1",
        detail: "Core text for Christology and Word theology.",
        href: "/library/kjv?book=Jhn&chapter=1",
      },
      {
        title: "Romans",
        detail: "Key study book for sin, grace, and faith.",
        href: "/library/kjv?book=Rom&chapter=1",
      },
    ],
  },
  {
    icon: "2",
    title: "Reformers And Primary Texts",
    items: [
      {
        title: "Protestant Figures",
        detail: "Luther, Calvin, Zwingli, Knox, Wesley, and study paths.",
        href: "/library/protestant/figures",
      },
      {
        title: "Martin Luther",
        detail: "Reformation preaching and justification debates.",
        href: "/library/protestant/figures/martin-luther",
      },
      {
        title: "John Calvin",
        detail: "Institutes, doctrine, Scripture, church order.",
        href: "/library/protestant/figures/john-calvin",
      },
      {
        title: "Huldrych Zwingli",
        detail: "Swiss Reformation and worship reform.",
        href: "/library/protestant/figures/huldrych-zwingli",
      },
      {
        title: "John Knox",
        detail: "Scottish Reformation and Presbyterian order.",
        href: "/library/protestant/figures/john-knox",
      },
      {
        title: "John Wesley",
        detail: "Methodist theology, holiness, and grace.",
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
        detail: "Confessions, catechisms, and standards.",
        href: "/library/protestant/texts",
      },
      {
        title: "Augsburg Confession",
        detail: "Foundational Lutheran confession.",
        href: "/library/protestant/texts/augsburg-confession",
      },
      {
        title: "Heidelberg Catechism",
        detail: "Reformed catechesis organized around comfort, guilt, grace, and gratitude.",
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
        detail: "Historical context for reform and conflict.",
        href: "/library/history/reformation",
      },
      {
        title: "Reformation Era Study",
        detail: "Internal analysis page on the Reformation.",
        href: "/library/protestant/reformation-era",
      },
      {
        title: "Post-Reformation Movements",
        detail: "Later Protestant development.",
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
    title: "Shared Fathers And Ancient Sources",
    items: [
      {
        title: "Church Fathers",
        detail: "Shared fathers library.",
        href: "/library/fathers",
      },
      {
        title: "Augustine: Confessions",
        detail: "Text for grace, conversion, memory, prayer.",
        href: "/library/fathers/augustine-hippo/confessions",
      },
      {
        title: "Athanasius",
        detail: "Christology, incarnation, Nicene theology.",
        href: "/library/fathers/athanasius",
      },
      {
        title: "CCEL",
        detail: "Christian classics and theological texts.",
        href: "https://www.ccel.org/",
      },
    ],
  },
  {
    icon: "6",
    title: "Shared Christian Topics",
    items: [
      {
        title: "Catholic Resources",
        detail: "Catechesis, saints, sacraments, theology.",
        href: "/library/catholic/resources",
      },
      {
        title: "Orthodox Resources",
        detail: "Liturgy, fathers, saints, theology.",
        href: "/library/orthodox",
      },
      {
        title: "Ecumenical Councils",
        detail: "Shared doctrinal councils.",
        href: "/library/councils",
      },
      {
        title: "Church History Timeline",
        detail: "Wider splits and branches.",
        href: "/library/history/timeline",
      },
    ],
  },
];

const protestantSections = [
  {
    title: "Bible And Word Study",
    summary:
      "Protestant resources begin with direct Scripture reading, word study, and comparison with historical doctrine.",
    links: [
      {
        label: "KJV Bible + Strong's",
        href: "/library/kjv",
        detail: "Full KJV reader with Strong's lexicon integration.",
      },
      {
        label: "Genesis 1 With Strong's",
        href: "/library/kjv?book=Gen&chapter=1",
        detail: "Start with the current KJV + Strong's reading experience.",
      },
      {
        label: "John 1",
        href: "/library/kjv?book=Jhn&chapter=1",
        detail: "Core text for Christology and Word theology.",
      },
      {
        label: "Romans",
        href: "/library/kjv?book=Rom&chapter=1",
        detail: "Key Protestant study book for sin, grace, faith, and righteousness.",
      },
    ],
  },
  {
    title: "Reformers And Primary Texts",
    summary:
      "The Protestant path should not be only links. It should lead into internal pages for figures, writings, confessions, and theological themes.",
    links: [
      {
        label: "Protestant Figures",
        href: "/library/protestant/figures",
        detail: "Luther, Calvin, Zwingli, Knox, Wesley, and figure-based study paths.",
      },
      {
        label: "Martin Luther",
        href: "/library/protestant/figures/martin-luther",
        detail: "Reformation preaching, catechesis, and justification debates.",
      },
      {
        label: "John Calvin",
        href: "/library/protestant/figures/john-calvin",
        detail: "Institutes, doctrine of God, Scripture, and church order.",
      },
      {
        label: "Huldrych Zwingli",
        href: "/library/protestant/figures/huldrych-zwingli",
        detail: "Swiss reform, Scripture, worship, and Eucharistic controversy.",
      },
      {
        label: "John Knox",
        href: "/library/protestant/figures/john-knox",
        detail: "Scottish Reformation, preaching, and Presbyterian order.",
      },
      {
        label: "John Wesley",
        href: "/library/protestant/figures/john-wesley",
        detail: "Methodist theology, holiness, grace, and preaching.",
      },
    ],
  },
  {
    title: "Confessions And Catechisms",
    summary:
      "Confessional documents give the Protestant section depth beyond biography by showing how doctrine was organized and taught.",
    links: [
      {
        label: "Protestant Text Library",
        href: "/library/protestant/texts",
        detail: "Internal confessions, catechisms, and doctrinal standards.",
      },
      {
        label: "Augsburg Confession",
        href: "/library/protestant/texts/augsburg-confession",
        detail: "Foundational Lutheran confession.",
      },
      {
        label: "Heidelberg Catechism",
        href: "/library/protestant/texts/heidelberg-catechism",
        detail: "Reformed catechesis organized around comfort, guilt, grace, and gratitude.",
      },
      {
        label: "Westminster Shorter Catechism",
        href: "/library/protestant/texts/westminster-shorter-catechism",
        detail: "Major English Reformed catechetical standard.",
      },
    ],
  },
  {
    title: "History And Controversies",
    summary:
      "This track should help users understand Protestantism historically and theologically, without reducing it to modern denominational labels.",
    links: [
      {
        label: "Reformation History",
        href: "/library/history/reformation",
        detail: "Historical context for reform, confessional conflict, and church renewal.",
      },
      {
        label: "Reformation Era Study",
        href: "/library/protestant/reformation-era",
        detail: "Internal analysis page on the Reformation movement.",
      },
      {
        label: "Post-Reformation Movements",
        href: "/library/protestant/post-reformation-movements",
        detail: "Later Protestant development and theological streams.",
      },
      {
        label: "Book of Concord",
        href: "https://bookofconcord.org/",
        detail: "Lutheran confessional resource.",
      },
    ],
  },
  {
    title: "Shared Fathers And Ancient Sources",
    summary:
      "Protestant readers historically appealed to Scripture and the early Church. This prepares the next Church Fathers phase.",
    links: [
      {
        label: "Church Fathers",
        href: "/library/fathers",
        detail: "Shared fathers library.",
      },
      {
        label: "Augustine: Confessions",
        href: "/library/fathers/augustine-hippo/confessions",
        detail: "Major text for grace, conversion, memory, and prayer.",
      },
      {
        label: "Athanasius",
        href: "/library/fathers/athanasius",
        detail: "Christology, incarnation, and Nicene theology.",
      },
      {
        label: "CCEL",
        href: "https://www.ccel.org/",
        detail: "Christian classics and theological texts.",
      },
    ],
  },
  {
    title: "Shared Christian Topics",
    summary:
      "Protestant study often crosses directly into Catholic and Orthodox material when reading the early Church, councils, and shared ancient sources.",
    links: [
      {
        label: "Catholic Resources",
        href: "/library/catholic/resources",
        detail: "Catechesis, saints, sacraments, and Catholic theology.",
      },
      {
        label: "Orthodox Resources",
        href: "/library/orthodox",
        detail: "Liturgy, fathers, saints, and Orthodox theology.",
      },
      {
        label: "Ecumenical Councils",
        href: "/library/councils",
        detail: "Shared doctrinal councils of the historic Church.",
      },
      {
        label: "Church History Timeline",
        href: "/library/history/timeline",
        detail: "See the wider splits and branches across Christian history.",
      },
    ],
  },
];

export default function ProtestantResourcesPage() {
  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <main className="orthodox-mobile mobile-app-shell lg:hidden">
        <header className="orthodox-mobile__topbar">
          <Link href="/" className="orthodox-mobile__back" aria-label="Back home">
            ‹
          </Link>
          <span className="orthodox-mobile__cross">✝</span>
          <h1>Protestant Resources</h1>
        </header>

        <section className="orthodox-mobile__intro">
          <p>Protestant Resources</p>
          <h2>Protestant study hub for Scripture, reformers, confessions, and history.</h2>
          <span>
            Explore Scripture, reformers, confessions, history, and the shared fathers in one focused study path.
          </span>
        </section>

        <section className="orthodox-mobile__sections" aria-label="Protestant study sections">
          {protestantMobileSections.map((section) => (
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
            Protestant study here is built around Scripture first, then reformers, confessions, history,
            and the shared ancient sources that shaped later debate.
          </p>
        </section>

        <MobileBottomNav active="Home" />
      </main>

      <main className="hidden lg:block mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <section className="rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Protestant Resources
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            Protestant study hub for Scripture, reformers, confessions, and history.
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            This hub gives Protestant study the same navigable resource structure as the Orthodox
            path: Bible tools, primary texts, confessions, movement history, and ancient sources.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {protestantSections.map((section) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {section.summary}
              </p>
              <div className="mt-5 grid gap-3">
                {section.links.map((link) =>
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4"
                    >
                      <p className="font-semibold text-[var(--color-ink)]">{link.label}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                        {link.detail}
                      </p>
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4"
                    >
                      <p className="font-semibold text-[var(--color-ink)]">{link.label}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                        {link.detail}
                      </p>
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
