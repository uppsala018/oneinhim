import Link from "next/link";
import AppHeader from "@/components/app-header";

const scriptureCards = [
  {
    icon: "✦",
    title: "KJV Bible + Strong's",
    desc: "Read the King James Version with word-by-word Strong's concordance lookup.",
    href: "/library/kjv",
  },
  {
    icon: "☩",
    title: "Catholic Bible",
    desc: "The Douay-Rheims and RSV-CE Catholic editions with full deuterocanonical books.",
    href: "/library/catholic",
  },
  {
    icon: "IC XC",
    title: "Septuagint (LXX)",
    desc: "The Greek Old Testament as used by the early church and the Eastern Orthodox tradition.",
    href: "/library/orthodox/lxx",
  },
];

const historyCards = [
  {
    icon: "✒",
    title: "Church Fathers",
    desc: "Apostolic, Ante-Nicene, and Nicene Fathers — the voices that shaped Christian theology.",
    href: "/library/fathers",
  },
  {
    icon: "◉",
    title: "Ecumenical Councils",
    desc: "From Nicaea to Vatican II — what was decided, why it mattered, and what it means today.",
    href: "/library/councils",
  },
  {
    icon: "⌂",
    title: "Church History",
    desc: "The Great Schism, the Reformation, the Charismatic movement — the full sweep of Christian history.",
    href: "/library/history",
  },
];

const traditionCards = [
  {
    icon: "☩",
    title: "Catholic",
    desc: "Roman Catechism, saints, devotions, the Rosary, feast days, and sacramental theology.",
    href: "/library/catholic/resources",
  },
  {
    icon: "IC XC",
    title: "Orthodox",
    desc: "Divine Liturgy, Orthodox saints, feast days, and Eastern theological tradition.",
    href: "/library/orthodox",
  },
  {
    icon: "✤",
    title: "Protestant",
    desc: "Luther, Calvin, and the Reformers — their writings, theology, and lasting legacy.",
    href: "/library/protestant",
  },
  {
    icon: "✠",
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
        {/* Hero */}
        <section className="web-hero">
          <div className="web-hero__inner">
            <span className="web-hero__ornament">✝</span>
            <p className="web-hero__ref">John 17:21</p>
            <h1 className="web-hero__title">
              <em>That they all</em><br />may be one
            </h1>
            <p className="web-hero__desc">
              A complete Bible study and church history resource. Scripture,
              theology, the early church, councils, and every major Christian
              tradition — all in one place, free.
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
                Download the App
              </a>
            </div>
          </div>
          <div className="web-hero__divider">Scroll</div>
        </section>

        <div className="web-sections">
          {/* Scripture */}
          <section className="web-section">
            <p className="web-section__eyebrow">Scripture</p>
            <h2 className="web-section__title">Read the Word</h2>
            <p className="web-section__lead">
              Multiple Bible translations with study tools — Strong&apos;s
              concordance, cross-references, and notes built in.
            </p>
            <div className="web-card-grid">
              {scriptureCards.map((card) => (
                <Link key={card.href} href={card.href} className="web-card">
                  <span className="web-card__icon">{card.icon}</span>
                  <span className="web-card__title">{card.title}</span>
                  <span className="web-card__desc">{card.desc}</span>
                  <span className="web-card__arrow">Read →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* History */}
          <section className="web-section">
            <p className="web-section__eyebrow">History</p>
            <h2 className="web-section__title">Understand the Church</h2>
            <p className="web-section__lead">
              Two thousand years of Christianity — the councils, the fathers,
              the splits, the movements. Studied honestly and in depth.
            </p>
            <div className="web-card-grid">
              {historyCards.map((card) => (
                <Link key={card.href} href={card.href} className="web-card">
                  <span className="web-card__icon">{card.icon}</span>
                  <span className="web-card__title">{card.title}</span>
                  <span className="web-card__desc">{card.desc}</span>
                  <span className="web-card__arrow">Study →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Traditions */}
          <section className="web-section">
            <p className="web-section__eyebrow">Traditions</p>
            <h2 className="web-section__title">Every Branch of the Church</h2>
            <p className="web-section__lead">
              Catholic, Orthodox, Oriental Orthodox, and Protestant — each
              tradition studied on its own terms, with its own texts and sources.
            </p>
            <div className="web-card-grid">
              {traditionCards.map((card) => (
                <Link key={card.href} href={card.href} className="web-card">
                  <span className="web-card__icon">{card.icon}</span>
                  <span className="web-card__title">{card.title}</span>
                  <span className="web-card__desc">{card.desc}</span>
                  <span className="web-card__arrow">Explore →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Community */}
          <section className="web-section">
            <p className="web-section__eyebrow">Community</p>
            <h2 className="web-section__title">Pray Together</h2>
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
        </div>
      </main>

      {/* Footer */}
      <footer className="web-footer">
        <div className="web-footer__inner">
          <span className="web-footer__brand">One In Him</span>
          <nav className="web-footer__links" aria-label="Footer navigation">
            <Link href="/library">Library</Link>
            <Link href="/library/prayer-forum">Prayer Forum</Link>
            <Link href="/donate">Support</Link>
            <Link href="/privacy">Privacy</Link>
            <a
              href="https://bible-study-virid.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mobile App
            </a>
          </nav>
          <p className="web-footer__copy">
            © {new Date().getFullYear()} One In Him. All content from public domain and freely redistributable sources.
          </p>
        </div>
      </footer>
    </>
  );
}
