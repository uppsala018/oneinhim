import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const feastSections = [
  {
    title: "The Liturgical Year",
    summary:
      "Orthodox feast days organize the Church's prayer around the life of Christ, the Theotokos, the saints, and the rhythm of fasting and celebration.",
    items: ["Nativity", "Theophany", "Great Lent", "Pascha", "Pentecost", "Dormition"],
  },
  {
    title: "The Great Feasts",
    summary:
      "The Twelve Great Feasts form the main cycle of Orthodox celebration and teach the Gospel through the Church's calendar.",
    items: [
      "Nativity of Christ",
      "Theophany",
      "Presentation",
      "Annunciation",
      "Transfiguration",
      "Palm Sunday",
    ],
  },
  {
    title: "Saints, Synaxis, And Namedays",
    summary:
      "Orthodox commemorations remember apostles, martyrs, teachers, monastics, and local saints in the prayer of the Church.",
    items: ["Martyrs", "Confessors", "Monastics", "Teachers", "Synaxis", "Namedays"],
  },
  {
    title: "The Theotokos And Holy Memory",
    summary:
      "Feast days around Mary and the saints express the Orthodox confession of the Incarnation, holiness, and communion in Christ.",
    items: ["Theotokos", "Annunciation", "Dormition", "Protection", "Intercession", "Veneration"],
  },
  {
    title: "Fasts And Commemorations",
    summary:
      "Fasting seasons and memorial days frame Orthodox feast keeping, showing that remembrance is joined to repentance and prayer.",
    items: ["Great Lent", "Apostles' Fast", "Dormition Fast", "Nativity Fast", "Soul Saturdays", "Panikhida"],
  },
];

export default function OrthodoxFeastDaysPage() {
  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <section className="mobile-app-shell min-h-screen lg:hidden">
        <header className="orthodox-mobile__topbar">
          <Link href="/library/orthodox/saints-devotions" className="orthodox-mobile__back" aria-label="Back">
            ←
          </Link>
          <h1>Feast Days</h1>
          <Link href="/library/settings" className="orthodox-mobile__back" aria-label="Settings">
            ⚙
          </Link>
        </header>

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-28 pt-6 sm:px-6">
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Orthodox Feast Days
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
              The calendar of the Church and the memory of holiness.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              Orthodox feast days are not separate from theology. They teach the Gospel, honor the saints,
              and shape the Church&apos;s prayer through the liturgical year.
            </p>
          </section>

          <section className="grid gap-4">
            {feastSections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.8rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
              >
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-highlight)]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{section.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-[1.8rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-highlight)]">
              Study Connections
            </h2>
            <div className="mt-4 grid gap-3">
              {[
                ["/library/orthodox/divine-liturgy", "Divine Liturgy", "The feast cycle is learned in worship."],
                ["/library/orthodox/lxx", "Brenton LXX Reader", "Read feast readings in the Septuagint path."],
                ["/library/fathers", "Church Fathers", "Ancient saints and teachers connected to feast memory."],
                ["/library/history/timeline", "Church History Timeline", "See the feasts inside the broader historical timeline."],
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
        </main>

        <MobileBottomNav active="Home" />
      </section>

      <main className="hidden lg:block mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/orthodox/saints-devotions"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Saints & Devotions
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Orthodox Feast Days
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            The liturgical calendar and the memory of holiness.
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            Feast days in Orthodox tradition are part of the Church&apos;s living memory. They unite Scripture,
            worship, fasting, saints, and the proclamation of Christ throughout the year.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {feastSections.map((section) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{section.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
            Study Connections
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              ["/library/orthodox/divine-liturgy", "Divine Liturgy", "The feast cycle is learned in worship."],
              ["/library/orthodox/lxx", "Brenton LXX Reader", "Read feast readings in the Septuagint path."],
              ["/library/fathers", "Church Fathers", "Ancient saints and teachers connected to feast memory."],
              ["/library/history/timeline", "Church History Timeline", "See the feasts inside the broader historical timeline."],
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
      </main>
    </>
  );
}
