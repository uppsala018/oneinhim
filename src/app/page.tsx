import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import SiteFooter from "@/components/site-footer";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "One In Him Bible Study | KJV, Church Fathers & Church History",
  description:
    "Free Bible study app with KJV + Strong's, Douay-Rheims, Church Fathers, Ecumenical Councils and complete Church History timeline.",
  keywords:
    "bible study, KJV bible, Strong's concordance, church fathers, church history, ecumenical councils, early church, catechism of trent, orthodox bible, protestant resources",
  openGraph: {
    title: "One In Him Bible Study | KJV, Church Fathers & Church History",
    description:
      "Free Bible study app with KJV + Strong's, Douay-Rheims, Church Fathers, Ecumenical Councils and complete Church History timeline.",
    url: "https://www.oneinhimbiblestudy.com",
    siteName: "One In Him Bible Study",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "One In Him Bible Study | KJV, Church Fathers & Church History",
    description:
      "Free Bible study app with KJV + Strong's, Douay-Rheims, Church Fathers, Ecumenical Councils and complete Church History timeline.",
  },
  alternates: {
    canonical: "https://www.oneinhimbiblestudy.com",
  },
};

const featureCards = [
  {
    icon: "âś¦",
    title: "KJV Bible + Strong's",
    desc: "Read the King James Version with word-by-word Strong's concordance. Click any word to see the original Hebrew or Greek meaning.",
    href: "/library/kjv",
    label: "Open Reader",
  },
  {
    icon: "âś’",
    title: "Church Fathers",
    desc: "Ignatius of Antioch, Justin Martyr, Athanasius, Augustine and more â€” the writers who shaped Christian doctrine.",
    href: "/library/fathers",
    label: "Browse Fathers",
  },
  {
    icon: "â—‰",
    title: "Ecumenical Councils",
    desc: "From Nicaea (325 AD) to Vatican II â€” every major council explained: what was decided and why it still matters.",
    href: "/library/councils",
    label: "Study Councils",
  },
  {
    icon: "âŚ‚",
    title: "Church History Timeline",
    desc: "The Great Schism, the Reformation, the Charismatic movement â€” 2000 years of Christianity studied in depth.",
    href: "/library/history",
    label: "Explore History",
  },
  {
    icon: "đź™Ź",
    title: "Prayer Forum",
    desc: "Share prayer requests, give praise, and ask questions. A quiet, respectful space for the body of Christ.",
    href: "/library/prayer-forum",
    label: "Join Community",
  },
];

const scriptureCards = [
  {
    icon: "â©",
    title: "Catholic Bible",
    desc: "The Douay-Rheims and RSV-CE Catholic editions with full deuterocanonical books.",
    href: "/library/catholic",
  },
  {
    icon: "IC XC",
    title: "Septuagint (LXX)",
    desc: "The Greek Old Testament used by the early church and the Eastern Orthodox tradition.",
    href: "/library/orthodox/lxx",
  },
  {
    icon: "âś ",
    title: "Roman Catechism",
    desc: "The Catechism of the Council of Trent â€” authoritative Catholic teaching in full.",
    href: "/library/catechism",
  },
];

const traditionCards = [
  {
    icon: "â©",
    title: "Catholic Resources",
    desc: "Saints, devotions, the Rosary, feast days, sacramental theology, and more.",
    href: "/library/catholic/resources",
  },
  {
    icon: "IC XC",
    title: "Orthodox",
    desc: "Divine Liturgy, Orthodox saints, feast days, and the Eastern theological tradition.",
    href: "/library/orthodox",
  },
  {
    icon: "âś¤",
    title: "Protestant",
    desc: "Luther, Calvin, Wesley and the Reformers â€” their writings, theology, and lasting legacy.",
    href: "/library/protestant",
  },
  {
    icon: "âś ",
    title: "Oriental Orthodox",
    desc: "Coptic, Ethiopian, Armenian, and Syriac Christian traditions and texts.",
    href: "/library/oriental-orthodox",
  },
];

export default function Home() {
  return (
    <>
      <AppHeader />

      <main>
        {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="web-hero" aria-label="Welcome">
          {/* Cross watermark */}
          <div className="web-hero__watermark" aria-hidden="true">
            <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="88" y="10" width="24" height="240" fill="currentColor" />
              <rect x="10" y="80" width="180" height="24" fill="currentColor" />
            </svg>
          </div>

          <div className="web-hero__inner">
            <span className="web-hero__ornament" aria-hidden="true">âśť</span>
            <p className="web-hero__ref">John 17:21</p>

            <h1 className="web-hero__title">
              One In Him â€”<br />
              <em>Bible Study &amp; Church History</em>
            </h1>

            <p className="web-hero__desc">
              Explore Scripture, Church Fathers, Ecumenical Councils and
              2000 years of Christian history â€” all free, all in one place.
            </p>

            <div className="web-hero__actions">
              <Link href="/library" className="cta-primary">
                Explore the Library
              </Link>
              <a
                href="https://bible-study-virid.vercel.app"
                className="cta-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install the App
              </a>
            </div>
          </div>

          <div className="web-hero__divider" aria-hidden="true">Scroll</div>
        </section>

        {/* â”€â”€ Feature Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="web-sections" aria-labelledby="features-heading">
          <div className="web-section" style={{ borderTop: "none", paddingTop: "4rem" }}>
            <p className="web-section__eyebrow">What&apos;s Inside</p>
            <h2 className="web-section__title" id="features-heading">
              Explore the Library
            </h2>
            <p className="web-section__lead">
              Five core study areas â€” scripture, history, tradition, community, and prayer.
            </p>

            <div className="feature-grid">
              {featureCards.map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80}>
                  <Link href={card.href} className="feature-card">
                    <span className="feature-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="feature-card__title">{card.title}</h3>
                    <p className="feature-card__desc">{card.desc}</p>
                    <span className="feature-card__link">{card.label} â†’</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* â”€â”€ Scripture â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="web-section" aria-labelledby="scripture-heading">
            <p className="web-section__eyebrow">Scripture</p>
            <h2 className="web-section__title" id="scripture-heading">Read the Word</h2>
            <p className="web-section__lead">
              Multiple Bible translations with built-in study tools â€” Strong&apos;s
              concordance, cross-references, and personal notes.
            </p>
            <div className="web-card-grid">
              {scriptureCards.map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80}>
                  <Link href={card.href} className="web-card">
                    <span className="web-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="web-card__title">{card.title}</h3>
                    <p className="web-card__desc">{card.desc}</p>
                    <span className="web-card__arrow">Read â†’</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* â”€â”€ History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="web-section" aria-labelledby="history-heading">
            <p className="web-section__eyebrow">History</p>
            <h2 className="web-section__title" id="history-heading">Understand the Church</h2>
            <p className="web-section__lead">
              Two thousand years of Christianity â€” the councils, the fathers,
              the splits, the movements. Studied honestly and in depth.
            </p>
            <div className="web-card-grid">
              {[
                {
                  icon: "âś’",
                  title: "Church Fathers",
                  desc: "Apostolic, Ante-Nicene, and Nicene Fathers â€” the voices that shaped Christian theology.",
                  href: "/library/fathers",
                },
                {
                  icon: "â—‰",
                  title: "Ecumenical Councils",
                  desc: "From Nicaea to Vatican II â€” what was decided, why it mattered, and what it means today.",
                  href: "/library/councils",
                },
                {
                  icon: "âŚ‚",
                  title: "Church History",
                  desc: "The Great Schism, the Reformation, the Charismatic movement â€” the full sweep of Christian history.",
                  href: "/library/history",
                },
              ].map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80}>
                  <Link href={card.href} className="web-card">
                    <span className="web-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="web-card__title">{card.title}</h3>
                    <p className="web-card__desc">{card.desc}</p>
                    <span className="web-card__arrow">Study â†’</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* â”€â”€ Traditions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="web-section" aria-labelledby="traditions-heading">
            <p className="web-section__eyebrow">Traditions</p>
            <h2 className="web-section__title" id="traditions-heading">
              Every Branch of the Church
            </h2>
            <p className="web-section__lead">
              Catholic, Orthodox, Oriental Orthodox, and Protestant â€” each
              tradition studied on its own terms, with its own primary texts.
            </p>
            <div className="web-card-grid">
              {traditionCards.map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80}>
                  <Link href={card.href} className="web-card">
                    <span className="web-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="web-card__title">{card.title}</h3>
                    <p className="web-card__desc">{card.desc}</p>
                    <span className="web-card__arrow">Explore â†’</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* â”€â”€ Community â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="web-section" aria-labelledby="community-heading">
            <p className="web-section__eyebrow">Community</p>
            <h2 className="web-section__title" id="community-heading">Pray Together</h2>
            <p className="web-section__lead">
              Share prayer requests, give praise, and ask questions. A quiet
              space for the body of Christ.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/library/prayer-forum" className="cta-primary">
                Open the Prayer Forum
              </Link>
              <Link href="/library/notes" className="cta-secondary">
                My Notes &amp; Bookmarks
              </Link>
            </div>
          </section>
        </section>

        {/* â”€â”€ Mission Statement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <ScrollReveal>
          <section className="web-mission" aria-labelledby="mission-heading">
            <div className="web-mission__inner">
              <p className="web-mission__eyebrow">Our Mission</p>
              <h2 className="web-mission__title" id="mission-heading">
                One Church, One Truth, One Source
              </h2>
              <p className="web-mission__body">
                One In Him exists to make the full depth of Christian scholarship
                freely available to everyone. The Bible in multiple translations,
                the writings of the early church fathers, the decrees of every
                ecumenical council, and the theological traditions of Catholic,
                Orthodox, and Protestant Christianity â€” studied together, without
                walls or paywalls.
              </p>
              <p className="web-mission__body">
                Whether you are new to faith or a seasoned theologian, this is
                your library. Free. Always.
              </p>
              <p className="web-mission__verse">
                &ldquo;That they all may be one.&rdquo; â€” John 17:21
              </p>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SiteFooter />
    </>
  );
}

