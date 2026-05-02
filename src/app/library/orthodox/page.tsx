import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SectionHeading from "@/components/section-heading";
import { getFathersForTrack } from "@/lib/content";

const orthodoxMobileSections = [
  {
    icon: "1",
    title: "Orthodox Bible Study",
    items: [
      {
        title: "Septuagint study path",
        detail: "Brenton LXX and Orthodox study path.",
        href: "/library/orthodox/lxx",
      },
      {
        title: "KJV reference reader",
        detail: "Compare readings through the KJV + Strong's tools.",
        href: "/library/kjv",
      },
      {
        title: "Canon and deuterocanonical notes",
        detail: "Orthodox canon and deuterocanonical notes.",
        href: "/library/orthodox/lxx?group=deuterocanonical",
      },
    ],
  },
  {
    icon: "2",
    title: "Orthodox Fathers",
    items: [
      {
        title: "St. John Chrysostom",
        detail: "Read On the Priesthood and patristic study material.",
        href: "/library/fathers/john-chrysostom",
      },
      {
        title: "St. Basil the Great",
        detail: "Read On the Holy Spirit.",
        href: "/library/fathers/basil-great",
      },
      {
        title: "St. Gregory of Nazianzus",
        detail: "Read the Theological Orations.",
        href: "/library/fathers/gregory-nazianzen",
      },
      {
        title: "St. Cyril of Jerusalem",
        detail: "Read the Catechetical Lectures.",
        href: "/library/fathers/cyril-jerusalem",
      },
    ],
  },
  {
    icon: "3",
    title: "Liturgy & Prayer",
    items: [
      {
        title: "Liturgical study",
        detail: "Annotated Divine Liturgy guide.",
        href: "/library/orthodox/divine-liturgy",
      },
      {
        title: "Jesus Prayer",
        detail: "Prayer and hesychasm study.",
        href: "/library/orthodox/jesus-prayer",
      },
      {
        title: "Akathist and hymn study",
        detail: "Orthodox hymnography and akathists.",
        href: "/library/orthodox/akathist-hymn-study",
      },
    ],
  },
  {
    icon: "4",
    title: "Theology",
    items: [
      {
        title: "Theosis",
        detail: "Deification in Scripture and the Fathers.",
        href: "/library/fathers/athanasius",
      },
      {
        title: "Hesychasm",
        detail: "Prayer of the heart and stillness.",
        href: "/library/orthodox/hesychasm",
      },
      {
        title: "Icons & iconography",
        detail: "Image, worship, and the Incarnation.",
        href: "/library/orthodox/icons-iconography",
      },
    ],
  },
  {
    icon: "5",
    title: "Saints & Devotions",
    items: [
      {
        title: "Shared ancient saints",
        detail: "Ancient saints shared across traditions.",
        href: "/library/fathers",
      },
      {
        title: "Orthodox saints and feasts",
        detail: "Glorification, liturgy, icons, and feast days.",
        href: "/library/orthodox/saints-devotions",
      },
      {
        title: "Canonization differences",
        detail: "Catholic canonization and Orthodox glorification.",
        href: "/library/history/timeline",
      },
    ],
  },
  {
    icon: "6",
    title: "Oriental Orthodox",
    items: [
      {
        title: "Oriental Orthodox texts",
        detail: "Text archive and study entries.",
        href: "/library/oriental-orthodox",
      },
      {
        title: "Coptic and Ethiopian studies",
        detail: "Coptic and Ethiopian study branch.",
        href: "/library/orthodox/oriental-coptic-ethiopian-studies",
      },
    ],
  },
  {
    icon: "7",
    title: "Shared Christian Topics",
    items: [
      {
        title: "Catholic Resources",
        detail: "Catechesis, saints, sacraments, theology.",
        href: "/library/catholic/resources",
      },
      {
        title: "Protestant Resources",
        detail: "Reformers, confessions, and Protestant history.",
        href: "/library/protestant/resources",
      },
      {
        title: "Ecumenical Councils",
        detail: "Shared doctrinal councils.",
        href: "/library/councils",
      },
      {
        title: "Church History Timeline",
        detail: "Major splits and continuities.",
        href: "/library/history/timeline",
      },
    ],
  },
];

const orthodoxResources = [
  {
    title: "Orthodox Church Fathers",
    href: "https://orthodoxchurchfathers.com/",
    detail: "Modern Orthodox resource hub for patristic reading and discovery.",
  },
  {
    title: "Greek Orthodox Archdiocese",
    href: "https://www.goarch.org/",
    detail: "Orthodox articles, liturgical resources, and educational material.",
  },
  {
    title: "Oriental Orthodoxy Library",
    href: "https://www.orientalorthodoxy.com/library/texts/",
    detail: "Oriental Orthodox texts and study materials.",
  },
];

export default function OrthodoxPage() {
  const fathers = getFathersForTrack("orthodox");

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
          <span className="orthodox-mobile__cross">☦</span>
          <h1>Orthodox Resources</h1>
        </header>

        <section className="orthodox-mobile__intro">
          <p>Orthodox Resources</p>
          <h2>Orthodox study hub for Scripture, liturgy, prayer, theology, and tradition.</h2>
          <span>
            Explore Scripture, liturgy, prayer, theology, and the Fathers in one focused study path.
          </span>
        </section>

        <section className="orthodox-mobile__sections" aria-label="Orthodox study sections">
          {orthodoxMobileSections.map((section) => (
            <article key={section.title} className="orthodox-mobile-card">
              <div className="orthodox-mobile-card__head">
                <span className="orthodox-mobile-card__icon">{section.icon}</span>
                <h2>{section.title}</h2>
                <span className="orthodox-mobile-card__chevron">⌄</span>
              </div>
              <div className="orthodox-mobile-card__items">
                {section.items.map((item) => (
                  <Link key={`${section.title}-${item.title}`} href={item.href}>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <span>›</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="orthodox-mobile__notice">
          <h2>Study note</h2>
          <p>
            The Orthodox path is built around Scripture reading, patristic texts, prayer, liturgy,
            and theological study without copying modern copyrighted study Bible notes.
          </p>
        </section>

        <MobileBottomNav active="Home" />
      </main>

      <main className="hidden lg:block mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Orthodox Study"
          title="An Orthodox track now sits beside the Catholic and Protestant paths."
          body="This hub groups patristic texts, Orthodox-oriented catechetical material, and external resources for continued study. Shared fathers remain shared, but they are now easy to approach through an Orthodox reading path."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
          <section className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                  Core Reading
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                  Orthodox and shared fathers
                </h2>
              </div>
              <Link
                href="/library/fathers"
                className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
              >
                Open full Fathers library
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fathers.map((father) => (
                <Link
                  key={father.slug}
                  href={`/library/fathers/${father.slug}`}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                        {father.name}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                        {father.era} - {father.tradition}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]">
                      {father.stream === "shared" ? "Shared" : "Orthodox"}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {father.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Internal Links
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  ["/library/catholic", "Catholic Bible", "Douay-Rheims reader with Catholic canon"],
                  ["/library/catechism", "Roman Catechism", "Catholic doctrinal study library"],
                  ["/library/fathers", "Shared Ancient Saints", "Fathers and saints honored across ancient Christian traditions"],
                  ["/library/orthodox/saints-devotions", "Orthodox Saints & Devotions", "Orthodox holiness through liturgy, icons, feast days, and glorification"],
                  ["/library/history/great-schism", "Great Schism", "History page relevant to East-West study"],
                  ["/library/oriental-orthodox", "Oriental Orthodox", "Dedicated page with Oriental Orthodox texts and study expansion"],
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

            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Shared Christian Topics
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  ["/library/catholic/resources", "Catholic Resources", "Catechesis, saints, sacraments, and Catholic theology."],
                  ["/library/protestant/resources", "Protestant Resources", "Reformers, confessions, and Protestant history."],
                  ["/library/councils", "Ecumenical Councils", "Shared doctrinal councils of the historic Church."],
                  ["/library/history/timeline", "Church History Timeline", "The major splits and continuities across Christian history."],
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

            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Resources
              </p>
              <div className="mt-4 space-y-3">
                {orthodoxResources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4"
                  >
                    <p className="font-semibold text-[var(--color-ink)]">{resource.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {resource.detail}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
