import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const theologySections = [
  {
    title: "Creed And Trinity",
    paragraphs: [
      "Catholic theology begins with the Creed. God is confessed as Father, Son, and Holy Spirit, and the Son is understood as eternally one with the Father.",
      "This is not an abstract system detached from worship. The creed is the Church's public confession and the shape of Catholic prayer, liturgy, and catechesis.",
    ],
    links: [
      ["/library/catholic/john-prologue", "John Prologue Study"],
      ["/library/catechism", "Roman Catechism"],
      ["/library/councils/nicaea-325", "Council of Nicaea"],
    ],
  },
  {
    title: "Grace, Sacraments, And Salvation",
    paragraphs: [
      "Catholic teaching presents grace as God's real initiative in salvation, received through faith, repentance, sacramental life, and perseverance in Christ.",
      "The sacraments are not treated as empty symbols. They are outward signs through which Christ acts in the Church to give grace and form holy life.",
    ],
    links: [
      ["/library/catholic/sacraments", "Catholic Sacraments"],
      ["/library/catholic/matthew-16-keys", "Peter And The Keys"],
      ["/library/catechism/part-1-article-5", "Roman Catechism on Christ"],
    ],
  },
  {
    title: "Mary, Saints, And Communion",
    paragraphs: [
      "Mary is honored because of Christ. Catholic theology sees her role through the Incarnation and the Church's confession of the Word made flesh.",
      "The saints belong to the communion of the Church and are remembered as witnesses to holiness, intercession, and the resurrection hope.",
    ],
    links: [
      ["/library/catholic/annunciation-luke-1", "Annunciation Study"],
      ["/library/catholic/saints-devotions", "Catholic Saints & Devotions"],
      ["/library/fathers", "Church Fathers"],
    ],
  },
  {
    title: "Church, Councils, And Authority",
    paragraphs: [
      "Catholic ecclesiology emphasizes a visible Church with real teaching authority, apostolic succession, and conciliar life.",
      "This is why the councils matter: they show how doctrine was received, clarified, and defended in the historic Church.",
    ],
    links: [
      ["/library/councils", "Ecumenical Councils"],
      ["/library/history/timeline", "Church History Timeline"],
      ["/library/history/great-schism", "Great Schism"],
    ],
  },
];

export default function CatholicTheologyPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/library/catholic/resources"
            className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
          >
            Back to Catholic Resources
          </Link>
        </div>

        <section className="mt-8 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
            Catholic Theology
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            Creed, grace, Mary, saints, and authority
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            This page gathers the main doctrinal themes of Catholic study into one internal route so
            the app can move from Scripture to doctrine without leaving the Catholic track.
          </p>
        </section>

        <section className="mt-10 space-y-6">
          {theologySections.map((section) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-muted)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {section.links.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.52)] p-4 text-sm text-[var(--color-ink)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
      <MobileBottomNav active="Home" />
    </>
  );
}
