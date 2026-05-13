import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import SiteFooter from "@/components/site-footer";
import ScrollReveal from "@/components/scroll-reveal";
import JsonLd from "@/components/json-ld";
import PwaInstallButton from "@/components/pwa-install-button";
import { buildCollectionPageSchema, buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Bible Study & Church History",
  description:
    "Free Christian Bible study with KJV and Strong's, Douay-Rheims, Church Fathers, Ecumenical Councils, and church history resources.",
  keywords:
    "bible study, KJV bible, Strong's concordance, church fathers, church history, ecumenical councils, early church, catechism of trent, orthodox bible, protestant resources",
});

const featureCards = [
  {
    icon: "✦",
    title: "KJV Bible + Strong's",
    desc: "Read the King James Version with word-by-word Strong's concordance. Click any word to see the original Hebrew or Greek meaning.",
    href: "/library/kjv",
    label: "Open Reader",
  },
  {
    icon: "✒",
    title: "Church Fathers",
    desc: "Ignatius of Antioch, Justin Martyr, Athanasius, Augustine and more — the writers who shaped Christian doctrine.",
    href: "/library/fathers",
    label: "Browse Fathers",
  },
  {
    icon: "◉",
    title: "Ecumenical Councils",
    desc: "From Nicaea (325 AD) to Vatican II — every major council explained: what was decided and why it still matters.",
    href: "/library/councils",
    label: "Study Councils",
  },
  {
    icon: "✠",
    title: "Church History Timeline",
    desc: "The Great Schism, the Reformation, the Charismatic movement — 2000 years of Christianity studied in depth.",
    href: "/library/history",
    label: "Explore History",
  },
];

const scriptureCards = [
  {
    icon: "✦",
    title: "KJV + Concordance",
    desc: "The King James Version with word-by-word Strong's concordance for Hebrew and Greek word studies.",
    href: "/library/kjv",
  },
  {
    icon: "IC XC",
    title: "Septuagint (LXX)",
    desc: "The Greek Old Testament used by the early church and the Eastern Orthodox tradition.",
    href: "/library/orthodox/lxx",
  },
  {
    icon: "☩",
    title: "Catholic Bible",
    desc: "The Douay-Rheims and RSV-CE Catholic editions with full deuterocanonical books.",
    href: "/library/catholic",
  },
  {
    icon: "✠",
    title: "Catholic Catechism",
    desc: "The Catechism of the Council of Trent — authoritative Catholic teaching in full.",
    href: "/library/catechism",
  },
];

const communityCards = [
  {
    icon: "🙏",
    title: "Community",
    desc: "Introduce yourself, make friends, and join the general discussion.",
    href: "/library/prayer-forum/category/community",
  },
  {
    icon: "✝",
    title: "Prayer",
    desc: "Share prayer requests, give praise, and encourage one another in faith.",
    href: "/library/prayer-forum/category/prayer",
  },
  {
    icon: "✦",
    title: "Bible Study",
    desc: "Study Scripture together across Old and New Testament, Gospels, and more.",
    href: "/library/prayer-forum/category/bible-study",
  },
  {
    icon: "◉",
    title: "Questions & Answers",
    desc: "Ask theology, church tradition, and Scripture questions of any level.",
    href: "/library/prayer-forum/category/questions-answers",
  },
];

const traditionCards = [
  {
    icon: "☩",
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
    icon: "✝",
    title: "Protestant",
    desc: "Luther, Calvin, Wesley and the Reformers — their writings, theology, and lasting legacy.",
    href: "/library/protestant",
  },
  {
    icon: "☦",
    title: "Oriental Orthodox",
    desc: "Coptic, Ethiopian, Armenian, and Syriac Christian traditions and texts.",
    href: "/library/oriental-orthodox",
  },
];

const HOME_SCHEMA = buildCollectionPageSchema({
  path: "/",
  name: "One In Him Bible Study",
  description:
    "Free Christian Bible study with Scripture readers, Church Fathers, Ecumenical Councils, Christian traditions, church history, and a prayer forum.",
  about: [
    "Bible study",
    "Church history",
    "Church Fathers",
    "Ecumenical councils",
    "Christian theology",
  ],
});

export default function Home() {
  return (
    <>
      <JsonLd data={HOME_SCHEMA} />
      <AppHeader />

      <main>
        {/* Hero */}
        <section className="web-hero" aria-label="Welcome">
          <div className="web-hero__watermark" aria-hidden="true">
            <svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="88" y="10" width="24" height="240" fill="currentColor" />
              <rect x="10" y="80" width="180" height="24" fill="currentColor" />
            </svg>
          </div>

          <div className="web-hero__inner">
            <span className="web-hero__ornament" aria-hidden="true">✝</span>
            <p className="web-hero__ref">John 17:21</p>

            <h1 className="web-hero__title">
              One In Him &mdash;<br />
              <em>Bible Study &amp; Church History</em>
            </h1>

            <p className="web-hero__desc">
              Explore Scripture, Church Fathers, Ecumenical Councils and
              2000 years of Christian history &mdash; all free, all in one place.
            </p>

            <div className="web-hero__actions">
              <Link href="/library" className="hero-cta">
                Explore
              </Link>
              <PwaInstallButton className="hero-cta" />
              <Link href="/library/prayer-forum" className="hero-cta">
                Community
              </Link>
              <Link href="/library/notes" className="hero-cta">
                My Notes
              </Link>
            </div>
          </div>

        </section>

        {/* Feature Cards */}
        <section className="web-sections" aria-labelledby="features-heading">
          <div className="web-section" style={{ borderTop: "none", paddingTop: "4rem" }}>
            <p className="web-section__eyebrow">What&apos;s Inside</p>
            <h2 className="web-section__title" id="features-heading">
              Explore the Library
            </h2>
            <p className="web-section__lead">
              Four core study areas &mdash; scripture, history, tradition, and community.
            </p>

            <div className="feature-grid">
              {featureCards.map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80}>
                  <Link href={card.href} className="feature-card">
                    <span className="feature-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="feature-card__title">{card.title}</h3>
                    <p className="feature-card__desc">{card.desc}</p>
                    <span className="feature-card__link">{card.label} &rarr;</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Scripture */}
          <section className="web-section" aria-labelledby="scripture-heading">
            <p className="web-section__eyebrow">Scripture</p>
            <h2 className="web-section__title" id="scripture-heading">Read the Word</h2>
            <p className="web-section__lead">
              Multiple Bible translations with built-in study tools &mdash; Strong&apos;s
              concordance, cross-references, and personal notes.
            </p>
            <div className="web-card-grid">
              {scriptureCards.map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80}>
                  <Link href={card.href} className="web-card">
                    <span className="web-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="web-card__title">{card.title}</h3>
                    <p className="web-card__desc">{card.desc}</p>
                    <span className="web-card__arrow">Read &rarr;</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Traditions */}
          <section className="web-section" aria-labelledby="traditions-heading">
            <p className="web-section__eyebrow">Traditions</p>
            <h2 className="web-section__title" id="traditions-heading">
              Every Branch of the Church
            </h2>
            <p className="web-section__lead">
              Catholic, Orthodox, Oriental Orthodox, and Protestant &mdash; each
              tradition studied on its own terms, with its own primary texts.
            </p>
            <div className="web-card-grid">
              {traditionCards.map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80}>
                  <Link href={card.href} className="web-card">
                    <span className="web-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="web-card__title">{card.title}</h3>
                    <p className="web-card__desc">{card.desc}</p>
                    <span className="web-card__arrow">Explore &rarr;</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Community */}
          <section className="web-section" aria-labelledby="community-heading">
            <p className="web-section__eyebrow">Community</p>
            <h2 className="web-section__title" id="community-heading">Pray Together</h2>
            <p className="web-section__lead">
              Share prayer requests, give praise, and ask questions. A quiet
              space for the body of Christ.
            </p>
            <div className="web-card-grid">
              {communityCards.map((card, i) => (
                <ScrollReveal key={card.href} delay={i * 80} className="h-full">
                  <Link href={card.href} className="web-card" style={{ height: "100%" }}>
                    <span className="web-card__icon" aria-hidden="true">{card.icon}</span>
                    <h3 className="web-card__title">{card.title}</h3>
                    <p className="web-card__desc">{card.desc}</p>
                    <span className="web-card__arrow">Join &rarr;</span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </section>

        {/* Mission Statement */}
        <ScrollReveal>
          <section className="web-mission" aria-labelledby="mission-heading">
            <div className="web-mission__inner">
              <p className="web-mission__eyebrow">Our Mission</p>
              <h2 className="web-mission__title site-section-title" id="mission-heading">
                One Church, One Truth, One Source
              </h2>
              <p className="web-mission__body">
                One In Him exists to make the full depth of Christian scholarship
                freely available to everyone. The Bible in multiple translations,
                the writings of the early church fathers, the decrees of every
                ecumenical council, and the theological traditions of Catholic,
                Orthodox, and Protestant Christianity &mdash; studied together, without
                walls or paywalls.
              </p>
              <p className="web-mission__body">
                Whether you are new to faith or a seasoned theologian, this is
                your library. Free. Always.
              </p>
              <p className="web-mission__verse">
                &ldquo;That they all may be one.&rdquo; &mdash; John 17:21
              </p>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SiteFooter />
    </>
  );
}
