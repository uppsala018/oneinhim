import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const saintGroups = [
  {
    title: "Shared Ancient Saints",
    era: "Apostolic and pre-schism",
    summary:
      "Catholic and Orthodox traditions share many saints from the ancient undivided Church: apostles, martyrs, bishops, confessors, and teachers.",
    examples: ["Mary, Mother of God", "Peter and Paul", "Ignatius of Antioch", "Polycarp", "Athanasius", "John Chrysostom"],
    href: "/library/fathers",
  },
  {
    title: "Orthodox Glorified Saints",
    era: "Local Church and synodal reception",
    summary:
      "In Orthodox life, saints are often glorified through the lived reception of the Church, with liturgy, icons, feast days, and synodal recognition.",
    examples: ["Seraphim of Sarov", "Gregory Palamas", "Silouan the Athonite", "Maria of Paris", "The New Martyrs", "Ancient confessors"],
    href: "/library/orthodox/liturgical-study",
  },
  {
    title: "Feasts And Holy Memory",
    era: "Calendar and worship",
    summary:
      "Orthodox devotion remembers saints in the liturgical calendar, troparia, kontakia, feast days, fasts, and holy images.",
    examples: ["Great Feasts", "Namedays", "Martyrs", "Confessors", "Monastics", "The Theotokos"],
    href: "/library/orthodox/feast-days",
  },
];

const devotionPaths = [
  {
    title: "Jesus Prayer",
    icon: "†",
    summary:
      "The Jesus Prayer is a central Orthodox prayer of repentance, humility, and continual remembrance of Christ.",
    study: ["Lord Jesus Christ", "Son of God", "Have mercy on me", "Sinner"],
    href: "/library/orthodox/jesus-prayer",
  },
  {
    title: "Akathists And Hymns",
    icon: "♬",
    summary:
      "Akathists and hymnography are theology sung in prayer, linking doctrine to worship, memory, and praise.",
    study: ["Akathist", "Troparion", "Kontakion", "Canon"],
    href: "/library/orthodox/akathist-hymn-study",
  },
  {
    title: "Icons And Holy Images",
    icon: "◈",
    summary:
      "Icons confess the incarnation and honor the saints while keeping worship directed to God alone.",
    study: ["Incarnation", "Veneration", "Prototype", "Nicaea II"],
    href: "/library/orthodox/icons-iconography",
  },
  {
    title: "Relics And Feast Days",
    icon: "✦",
    summary:
      "Relics, feasts, and memorials are part of Orthodox holy memory and the Church's life in time.",
    study: ["Martyr witness", "Liturgical calendar", "Synaxis", "Commemoration"],
    href: "/library/orthodox/feast-days",
  },
];

const doctrineCards = [
  {
    title: "Glorification",
    text:
      "Orthodox churches usually speak of glorification rather than centralized canonization. Saints are recognized through the life of the Church, liturgy, icons, and feast days, often with synodal confirmation.",
  },
  {
    title: "Veneration And Worship",
    text:
      "Saints are honored as friends of God and members of the glorified Church. Worship belongs to God alone; honor is shown to the saints, their icons, and their relics.",
  },
  {
    title: "Intercession",
    text:
      "The Orthodox Church prays with the saints as part of the one communion of the Church in Christ, living and departed together in his body.",
  },
  {
    title: "Catholic And Orthodox Difference",
    text:
      "Catholic canonization is normally a centralized papal act. Orthodox glorification is usually received through the life of the local and wider Church, especially in liturgy and devotion.",
  },
];

export default function OrthodoxSaintsDevotionsPage() {
  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <main className="orthodox-devotions-mobile mobile-app-shell lg:hidden">
        <header className="mobile-section-header">
          <Link href="/library/orthodox" aria-label="Back to Orthodox Resources" className="mobile-section-header__back">
            ‹
          </Link>
          <div>
            <h1>Saints & Devotions</h1>
            <span>Orthodox Resources</span>
          </div>
        </header>

        <section className="orthodox-devotions-hero">
          <p>Orthodox Saints & Devotions</p>
          <h2>Glorification, icons, feasts, prayer, and holy memory.</h2>
          <span>
            Study Orthodox saints through liturgy, prayer, icons, and the witness of the Church.
          </span>
        </section>

        <section className="orthodox-devotions-grid" aria-label="Saint groups">
          {saintGroups.map((group) => (
            <Link key={group.title} href={group.href} className="orthodox-devotions-card">
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

        <section className="orthodox-devotions-paths" aria-label="Devotion study paths">
          {devotionPaths.map((path) => (
            <Link key={path.title} href={path.href} className="orthodox-devotions-path">
              <div>{path.icon}</div>
              <span>
                <h2>{path.title}</h2>
                <p>{path.summary}</p>
              </span>
            </Link>
          ))}
        </section>

        <section className="orthodox-devotions-doctrine">
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
          href="/library/orthodox"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Orthodox Resources
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Orthodox Saints & Devotions
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            Saints, glorification, icons, feasts, and prayer in the Orthodox tradition.
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            This hub highlights the shared ancient saints as well as Orthodox-specific patterns of
            glorification, feast days, liturgical memory, and prayer. It also clarifies the difference
            between Catholic canonization and Orthodox reception.
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
