import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import { councilsLibrary } from "@/lib/content";

const BASE = "https://www.oneinhimbiblestudy.com";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = buildMeta({
  title: "The Seven Ecumenical Councils — Interactive Bible Study Games",
  description:
    "Explore the seven Ecumenical Councils through interactive debate games and study guides. Play the Council of Nicaea game, study Arianism, Chalcedon, and 2,000 years of church history — free Bible study tools for Christian apologetics.",
  keywords:
    "ecumenical councils game, council of Nicaea game, church history interactive, Bible study tools, Christian apologetics game, ecumenical councils study, early church history",
  path: "/library/councils",
  image: {
    url: `${BASE}/og/councils-nicaea.png`,
    width: 1200,
    height: 630,
    alt: "The Seven Ecumenical Councils — Interactive Bible Study Games",
  },
});

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE}/library/councils`,
  name: "The Seven Ecumenical Councils — Interactive Bible Study Games",
  description:
    "Interactive debate games and in-depth study guides for every Ecumenical Council. Defend orthodox Christianity against Arianism, Nestorianism, and other historical heresies.",
  url: `${BASE}/library/councils`,
  provider: {
    "@type": "Organization",
    name: "One In Him Bible Study",
    url: BASE,
  },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: 7,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "EducationalGame",
          name: "Council of Nicaea — Defend the Faith",
          description:
            "Interactive debate game. Play as Bishop Alexander and counter Arius's arguments over 5 rounds. 325 AD.",
          url: `${BASE}/library/councils/nicaea`,
          educationalLevel: "adult",
          about: "Council of Nicaea, Arianism, Early Church History",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "EducationalGame",
          name: "Council of Constantinople — Coming Soon",
          description: "Defend the Nicene faith against Neo-Arianism. 381 AD.",
          url: `${BASE}/library/councils/constantinople`,
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "EducationalGame",
          name: "Council of Ephesus — Coming Soon",
          description: "Defend the title Theotokos against Nestorius. 431 AD.",
          url: `${BASE}/library/councils/ephesus`,
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "EducationalGame",
          name: "Council of Chalcedon — Coming Soon",
          description: "Define the two natures of Christ against Eutyches. 451 AD.",
          url: `${BASE}/library/councils/chalcedon`,
        },
      },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Library", item: `${BASE}/library` },
    { "@type": "ListItem", position: 3, name: "Ecumenical Councils" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Council of Nicaea game?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Council of Nicaea game is an interactive debate simulator set in 325 AD. Players take the role of Bishop Alexander and must defend orthodox Christology against Arius across five rounds of theological argument. It's a free Bible study tool designed to teach early church history through gameplay.",
      },
    },
    {
      "@type": "Question",
      name: "What are the seven Ecumenical Councils?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The seven Ecumenical Councils are: Nicaea I (325), Constantinople I (381), Ephesus (431), Chalcedon (451), Constantinople II (553), Constantinople III (680–681), and Nicaea II (787). All seven are recognized by both the Catholic Church and the Eastern Orthodox Church as defining the core doctrines of Christianity.",
      },
    },
    {
      "@type": "Question",
      name: "What did the Council of Nicaea decide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The First Council of Nicaea (325 AD) condemned Arianism — the teaching that the Son of God was a created being — and affirmed that the Son is homoousios, of the same substance as the Father. It produced the Nicene Creed and established the theological foundation for Trinitarian Christianity.",
      },
    },
    {
      "@type": "Question",
      name: "Are these church history games educational?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Each Council Chronicles game is built on historically documented arguments, primary sources, and real theological debates. Players learn the actual arguments made at each council, why they mattered, and what was at stake for Christian doctrine. All content is free.",
      },
    },
  ],
};

// ─── Game cards data ──────────────────────────────────────────────────────────

const GAME_CARDS = [
  {
    order: 1,
    year: "325 AD",
    title: "Council of Nicaea",
    heresy: "Arianism",
    question: "Is the Son truly God, or a created being?",
    role: "Bishop Alexander of Alexandria",
    href: "/library/councils/nicaea",
    live: true,
  },
  {
    order: 2,
    year: "381 AD",
    title: "Council of Constantinople",
    heresy: "Neo-Arianism & Pneumatomachianism",
    question: "Is the Holy Spirit fully divine?",
    role: "Gregory of Nazianzus",
    href: null,
    live: false,
  },
  {
    order: 3,
    year: "431 AD",
    title: "Council of Ephesus",
    heresy: "Nestorianism",
    question: "Is Mary rightly called Theotokos — Mother of God?",
    role: "Cyril of Alexandria",
    href: null,
    live: false,
  },
  {
    order: 4,
    year: "451 AD",
    title: "Council of Chalcedon",
    heresy: "Monophysitism",
    question: "Does Christ have one nature or two?",
    role: "Pope Leo I",
    href: null,
    live: false,
  },
  {
    order: 5,
    year: "553 AD",
    title: "Second Council of Constantinople",
    heresy: "Three Chapters Controversy",
    question: "Can the Church posthumously condemn heretical writings?",
    role: "Emperor Justinian's Bishops",
    href: null,
    live: false,
  },
  {
    order: 6,
    year: "680 AD",
    title: "Third Council of Constantinople",
    heresy: "Monothelitism",
    question: "Did Christ have one will or two?",
    role: "Pope Agatho's Legates",
    href: null,
    live: false,
  },
  {
    order: 7,
    year: "787 AD",
    title: "Second Council of Nicaea",
    heresy: "Iconoclasm",
    question: "Is the veneration of icons permissible?",
    role: "Patriarch Tarasios",
    href: null,
    live: false,
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CouncilsHubPage() {
  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Library", href: "/library" },
            { label: "Ecumenical Councils" },
          ]}
        />

        {/* ── SEO hero ── */}
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-highlight)]">
            Church History · Interactive Games
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-[var(--color-ink)] sm:text-5xl">
            The Seven Ecumenical Councils
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">
            Debate games and study guides for every Ecumenical Council — from Nicaea in 325 AD to
            Nicaea II in 787 AD. Step into the council hall, defend the faith against real
            historical heresies, and learn why each decision still shapes Christianity today.
          </p>
        </header>

        {/* ── Game cards grid ── */}
        <section aria-labelledby="games-heading" className="mb-14">
          <h2
            id="games-heading"
            className="mb-6 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
          >
            Council Chronicles — Debate Games
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {GAME_CARDS.map((card) => {
              const inner = (
                <>
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                        {card.year}
                      </p>
                      <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-[var(--color-ink)]">
                        {card.title}
                      </h3>
                    </div>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-xs text-[var(--color-highlight)]">
                      {card.order}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="mt-3 space-y-1.5 text-sm leading-6 text-[var(--color-muted)]">
                    <p>
                      <span className="text-[var(--color-highlight)] font-medium">Heresy: </span>
                      {card.heresy}
                    </p>
                    <p className="italic">&ldquo;{card.question}&rdquo;</p>
                    <p>Play as: {card.role}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4">
                    {card.live ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-highlight)]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-highlight)]" />
                        Play Now →
                      </span>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] opacity-60">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </>
              );

              return card.live ? (
                <Link
                  key={card.order}
                  href={card.href}
                  className="flex flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-highlight)] hover:shadow-[0_0_24px_rgba(201,168,76,0.12)]"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={card.order}
                  className="flex flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 opacity-60"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Study guides grid ── */}
        <section aria-labelledby="study-heading" className="mb-12">
          <h2
            id="study-heading"
            className="mb-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
          >
            Study the Councils
          </h2>
          <p className="mb-6 text-sm leading-7 text-[var(--color-muted)]">
            In-depth study pages covering background, theological controversy, key figures, and
            what each council decided — and why it still matters.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {councilsLibrary.map((council) => (
              <Link
                key={council.slug}
                href={`/library/councils/${council.slug}`}
                className="flex flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-highlight)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                      {council.year} AD
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-[var(--color-ink)]">
                      {council.title}
                    </h3>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-sm text-[var(--color-highlight)]">
                    {council.order}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--color-muted)]">
                  <p>{council.calledBy}</p>
                  <p>{council.issue}</p>
                </div>
                <span className="mt-auto pt-5 text-sm font-semibold text-[var(--color-highlight)]">
                  Study this council →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── What are the Ecumenical Councils? (SEO content + FAQ) ── */}
        <section
          aria-labelledby="about-heading"
          className="mb-12 grid gap-6 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:grid-cols-2 md:p-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
              What are the Ecumenical Councils?
            </p>
            <h2
              id="about-heading"
              className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
            >
              Seven gatherings that defined Christianity
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-[var(--color-muted)]">
            <p>
              Ecumenical Councils are formal assemblies of bishops from across the Christian world
              convened to define doctrine, address heresies, and settle church discipline. The word
              <em> ecumenical</em> comes from the Greek <em>oikoumene</em> — the whole inhabited
              world — signalling that these councils speak for the whole Church, not just one region.
            </p>
            <p>
              All seven councils are accepted by both the Catholic Church and the Eastern Orthodox
              Church. Most Protestant traditions accept at minimum the first four, which settled the
              doctrines of the Trinity and the person of Christ. Each council faced a specific
              heresy that would have fundamentally altered the faith — and defeated it.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section aria-labelledby="faq-heading" className="mb-12">
          <h2
            id="faq-heading"
            className="mb-6 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
          >
            Frequently Asked Questions
          </h2>
          <dl className="grid gap-5 sm:grid-cols-2">
            {[
              {
                q: "Is the Council of Nicaea game free?",
                a: "Yes. All Council Chronicles games are completely free. No account required to play — just open the page and start debating.",
              },
              {
                q: "How historically accurate are the games?",
                a: "Each argument in the Nicaea game is drawn from real Arian sources: Arius's Thalia, his letters to Eusebius and Alexander, and the council proceedings. The responses reflect what Alexander, Athanasius, and other orthodox bishops actually argued.",
              },
              {
                q: "Which traditions accept all seven councils?",
                a: "The Catholic Church and the Eastern Orthodox Church accept all seven. Oriental Orthodox churches (Coptic, Ethiopian, Armenian, Syriac) accept the first three but not Chalcedon. Most Protestant traditions accept the first four councils on Trinitarian and Christological doctrine.",
              },
              {
                q: "When will the other council games launch?",
                a: "Constantinople I, Ephesus, and Chalcedon are in development. Sign up on the home page to be notified when each game launches.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
              >
                <dt className="font-semibold text-[var(--color-ink)]">{q}</dt>
                <dd className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <MobileBottomNav active="Home" />
    </>
  );
}
