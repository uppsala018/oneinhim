import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";

const homeCards = [
  {
    title: "KJV Bible + Strong's",
    href: "/library/kjv",
    icon: "▰⌕",
  },
  {
    title: "Catholic Bible + Catechism",
    href: "/library/catholic",
    icon: "☩",
  },
  {
    title: "Catholic Resources",
    href: "/library/catholic/resources",
    icon: "✦",
  },
  {
    title: "Orthodox Resources",
    href: "/library/orthodox",
    icon: "IC XC",
  },
  {
    title: "Oriental Orthodox",
    href: "/library/oriental-orthodox",
    icon: "☩",
  },
  {
    title: "Protestant Resources",
    href: "/library/protestant/resources",
    icon: "✤",
  },
  {
    title: "Roman Catechism",
    href: "/library/catechism",
    icon: "✠",
  },
  {
    title: "Church Fathers",
    href: "/library/fathers",
    icon: "✒",
  },
  {
    title: "Church Councils",
    href: "/library/councils",
    icon: "◉",
  },
  {
    title: "Church History",
    href: "/library/history",
    icon: "⌂",
  },
  {
    title: "Prayer Forum",
    href: "/library/prayer-forum",
    icon: "🙏",
  },
  {
    title: "Support",
    href: "/donate",
    icon: "☩",
  },
];

export default function Home() {
  return (
    <main className="mobile-app-shell mobile-home">
      <section className="mobile-home__hero">
        <div className="mobile-home__cross">✝</div>
        <p className="mobile-home__verse-ref">John 17:21</p>
        <h1>One In Him</h1>
        <div className="mobile-home__book">⌁ ▱ ▱ ⌁</div>
        <p className="mobile-home__subtitle">Biblestudy &amp; Church History</p>
      </section>

      <section className="mobile-home__grid" aria-label="Study sections">
        {homeCards.map((card) =>
          card.href.startsWith("https://") ? (
            <a key={card.title} href={card.href} className="mobile-home-card">
              <span className="mobile-home-card__icon">{card.icon}</span>
              <span className="mobile-home-card__title">{card.title}</span>
            </a>
          ) : (
            <Link key={card.title} href={card.href} className="mobile-home-card">
              <span className="mobile-home-card__icon">{card.icon}</span>
              <span className="mobile-home-card__title">{card.title}</span>
            </Link>
          ),
        )}
      </section>

      <MobileBottomNav active="Home" />
    </main>
  );
}
