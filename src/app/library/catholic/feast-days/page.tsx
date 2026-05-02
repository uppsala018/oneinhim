import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const feastSections = [
  {
    title: "The Liturgical Year",
    summary:
      "Advent, Christmas, Lent, Easter, and Ordinary Time organize the Church's prayer and reading of salvation history.",
    items: ["Advent: anticipation", "Christmas: incarnation", "Lent: repentance", "Easter: resurrection", "Ordinary Time: discipleship"],
  },
  {
    title: "The Saints",
    summary:
      "Feast days remember the saints as witnesses to Christ, not as separate stories detached from the Gospel.",
    items: ["Apostles", "Martyrs", "Doctors of the Church", "Virgins", "Pastors", "Missionary saints"],
  },
  {
    title: "Mary And The Lord",
    summary:
      "Marian feasts belong to Christ because they celebrate what God has done in Mary for the sake of the incarnation and redemption.",
    items: ["Annunciation", "Visitation", "Nativity of Mary", "Assumption", "Immaculate Conception", "Queenship of Mary"],
  },
  {
    title: "Holy Days And Local Feasts",
    summary:
      "Some feasts are universal, while others are local, national, or tied to a religious order or patronage.",
    items: ["Patron saints", "Martyrs", "Church dedications", "Local diocesan feasts", "Religious order feasts", "Vigil days"],
  },
];

export default function CatholicFeastDaysPage() {
  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <section className="mobile-app-shell min-h-screen lg:hidden">
        <header className="catholic-mobile__topbar">
          <Link href="/library/catholic/saints-devotions" className="catholic-mobile__icon-button" aria-label="Back">
            ←
          </Link>
          <h1>Feast Days</h1>
          <Link href="/library/settings" className="catholic-mobile__icon-button" aria-label="Settings">
            ⚙
          </Link>
        </header>

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-28 pt-6 sm:px-6">
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Catholic Feast Days
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
              The calendar of the Church as a study guide.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              Catholic feast days teach doctrine through time: the life of Christ, the memory of the saints,
              and the rhythm of the liturgical year.
            </p>
          </section>

          <section className="grid gap-4">
            {feastSections.map((section) => (
              <article key={section.title} className="rounded-[1.8rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
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
        </main>

        <MobileBottomNav active="Home" />
      </section>

      <main className="hidden lg:block mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <Link
          href="/library/catholic/saints-devotions"
          className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
        >
          Back to Saints & Devotions
        </Link>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Catholic Feast Days
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            The liturgical calendar and the memory of holiness.
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            This page explains how Catholic feast days work, why they matter, and how they shape the
            Church&apos;s yearly prayer and reading.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {feastSections.map((section) => (
            <article key={section.title} className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
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
      </main>
    </>
  );
}
