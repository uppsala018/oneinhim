import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const saintGroups = [
  {
    title: "Shared Ancient Saints",
    era: "Apostolic and pre-schism",
    summary:
      "Many early saints are honored across Catholic and Orthodox traditions because they belong to the shared ancient Church before later divisions hardened.",
    examples: ["Mary, Mother of God", "Peter and Paul", "Ignatius of Antioch", "Polycarp", "Athanasius", "John Chrysostom"],
    href: "/library/fathers",
  },
  {
    title: "Catholic Canonized Saints",
    era: "West and global Catholic Church",
    summary:
      "Catholic canonization is normally a formal act of the Church that recognizes a person as a saint for public veneration throughout the Church.",
    examples: ["Augustine", "Benedict", "Francis of Assisi", "Thomas Aquinas", "Teresa of Avila", "Therese of Lisieux"],
    href: "/library/catechism",
  },
  {
    title: "Local And Devotional Saints",
    era: "Feasts, patrons, and popular devotion",
    summary:
      "Some saints have universal feasts, while others are especially loved in particular countries, religious orders, cities, or devotional traditions.",
    examples: ["Patron saints", "Martyrs", "Doctors of the Church", "Missionary saints", "Monastic saints", "Modern witnesses"],
    href: "/library/history/timeline",
  },
];

const devotionPaths = [
  {
    title: "Marian Devotion",
    icon: "M",
    summary:
      "Catholic devotion to Mary is rooted in Christology: Mary is honored because of her role in the incarnation and her witness of obedient faith.",
    study: ["Annunciation", "Theotokos", "Magnificat", "Maternal intercession"],
    href: "/library/catholic/rosary",
  },
  {
    title: "Rosary",
    icon: "✢",
    summary:
      "The rosary is a biblical and contemplative prayer centered on the mysteries of Christ's life, death, and resurrection.",
    study: ["Joyful mysteries", "Sorrowful mysteries", "Glorious mysteries", "Luminous mysteries"],
    href: "/library/catholic/rosary",
  },
  {
    title: "Relics And Holy Memory",
    icon: "☩",
    summary:
      "Catholic veneration of relics is tied to belief in the resurrection, the holiness of the body, and God's work through the saints.",
    study: ["Resurrection", "Martyr witness", "Sacred memory", "Intercession"],
    href: "/library/councils/nicaea-787",
  },
  {
    title: "Feast Days",
    icon: "✦",
    summary:
      "The liturgical calendar teaches the faith through the life of Christ, Mary, martyrs, apostles, pastors, virgins, and holy men and women.",
    study: ["Advent", "Christmas", "Lent", "Easter", "Saints' days"],
    href: "/library/catholic/feast-days",
  },
];

const doctrineCards = [
  {
    title: "Canonization",
    text:
      "Canonization does not make someone holy. It is the Church's formal recognition that a person lived and died in heroic fidelity to Christ and may be publicly venerated.",
  },
  {
    title: "Veneration And Worship",
    text:
      "Catholic teaching distinguishes worship owed to God alone from the honor given to saints. Saints are honored as God's work in human lives, not as rivals to Christ.",
  },
  {
    title: "Intercession",
    text:
      "Prayer with the saints is understood as communion in Christ: the living and departed members of the Body of Christ pray before God.",
  },
  {
    title: "Catholic And Orthodox Difference",
    text:
      "Catholic canonization is normally centralized through papal recognition. Orthodox glorification is more often received through local and synodal life, liturgy, icons, and feast days.",
  },
];

export default function CatholicSaintsDevotionsPage() {
  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <main className="catholic-devotions-mobile mobile-app-shell lg:hidden">
        <header className="mobile-section-header">
          <Link href="/library/catholic/resources" aria-label="Back to Catholic Resources" className="mobile-section-header__back">
            ‹
          </Link>
          <div>
            <h1>Saints & Devotions</h1>
            <span>Catholic Resources</span>
          </div>
        </header>

        <section className="catholic-devotions-hero">
          <p>Catholic Saints & Devotions</p>
          <h2>Holiness, prayer, feast days, and sacred memory.</h2>
          <span>
            Study saints through Christ, the Church, liturgy, and the call to holiness.
          </span>
        </section>

        <section className="catholic-devotions-grid" aria-label="Saint groups">
          {saintGroups.map((group) => (
            <Link key={group.title} href={group.href} className="catholic-devotions-card">
              <p>{group.era}</p>
              <h2>{group.title}</h2>
              <span>{group.summary}</span>
              <div>
                {group.examples.slice(0, 4).map((example) => (
                  <small key={example}>{example}</small>
                ))}
              </div>
            </Link>
          ))}
        </section>

        <section className="catholic-devotions-paths" aria-label="Devotion study paths">
          {devotionPaths.map((path) => (
            <Link key={path.title} href={path.href} className="catholic-devotions-path">
              <div>{path.icon}</div>
              <span>
                <h2>{path.title}</h2>
                <p>{path.summary}</p>
              </span>
            </Link>
          ))}
        </section>

        <section className="catholic-devotions-doctrine">
          {doctrineCards.map((card) => (
            <article key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </section>

        <MobileBottomNav active="Home" />
      </main>

      <main className="hidden lg:block mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/catholic/resources"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Catholic Resources
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Catholic Saints & Devotions
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            Saints, feast days, Marian devotion, prayer, and canonization.
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            This hub separates Catholic devotional life from Orthodox glorification while also
            showing the shared ancient saints honored before the later divisions of Christian history.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {saintGroups.map((group) => (
            <Link
              key={group.title}
              href={group.href}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-soft)]">
                {group.era}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                {group.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {group.summary}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {devotionPaths.map((path) => (
            <Link
              key={path.title}
              href={path.href}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                {path.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {path.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {path.study.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
