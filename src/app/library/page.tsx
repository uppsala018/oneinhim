import type { Metadata } from "next";
import { buildCollectionPageSchema, buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";

export const metadata: Metadata = buildMeta({
  title: "Scripture & Study Library",
  description: "Browse the complete One In Him library — KJV Bible, Church Fathers, Ecumenical Councils, and Christian traditions from Catholic to Protestant.",
  keywords: "bible study, christian resources, church history, early church, scripture library",
  path: "/library",
});

const LIBRARY_SCHEMA = buildCollectionPageSchema({
  path: "/library",
  name: "Scripture & Study Library — One In Him Bible Study",
  description:
    "Free Bible study library covering KJV + Strong's, Church Fathers, Ecumenical Councils, Roman Catechism, and Christian tradition study hubs.",
  about: ["Bible study", "Church history", "Christian theology"],
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "KJV Bible + Strong's Concordance", url: "https://www.oneinhimbiblestudy.com/library/kjv" },
      { "@type": "ListItem", position: 2, name: "Church Fathers", url: "https://www.oneinhimbiblestudy.com/library/fathers" },
      { "@type": "ListItem", position: 3, name: "Ecumenical Councils", url: "https://www.oneinhimbiblestudy.com/library/councils" },
      { "@type": "ListItem", position: 4, name: "Roman Catechism", url: "https://www.oneinhimbiblestudy.com/library/catechism" },
      { "@type": "ListItem", position: 5, name: "Catholic Bible — Douay-Rheims", url: "https://www.oneinhimbiblestudy.com/library/catholic" },
      { "@type": "ListItem", position: 6, name: "Orthodox Study", url: "https://www.oneinhimbiblestudy.com/library/orthodox" },
      { "@type": "ListItem", position: 7, name: "Protestant Study", url: "https://www.oneinhimbiblestudy.com/library/protestant" },
      { "@type": "ListItem", position: 8, name: "Oriental Orthodox", url: "https://www.oneinhimbiblestudy.com/library/oriental-orthodox" },
      { "@type": "ListItem", position: 9, name: "Church History Timeline", url: "https://www.oneinhimbiblestudy.com/library/history" },
    ],
  },
});

type LibModule = { icon: string; title: string; href: string; summary: string };

const scripture: LibModule[] = [
  {
    icon: "✦",
    title: "KJV + Strong's",
    href: "/library/kjv",
    summary: "Read a structured KJV chapter and inspect linked Strong's entries with word-by-word original Hebrew and Greek.",
  },
  {
    icon: "☩",
    title: "Catholic Bible",
    href: "/library/catholic",
    summary: "Full Douay-Rheims canon with chapter search, bookmarks, notes, and catechism-linked companion studies.",
  },
  {
    icon: "✠",
    title: "Roman Catechism",
    href: "/library/catechism",
    summary: "The Catechism of Trent organized by creed, sacraments, commandments, and prayer.",
  },
];

const history: LibModule[] = [
  {
    icon: "✒",
    title: "Church Fathers",
    href: "/library/fathers",
    summary: "Browse father profiles and read full primary texts — Ignatius, Clement, Polycarp, Justin Martyr, Athanasius, and more.",
  },
  {
    icon: "◉",
    title: "Church Councils",
    href: "/library/councils",
    summary: "Study the seven ecumenical councils with timeline navigation, doctrine summaries, key terms, and related texts.",
  },
  {
    icon: "✠",
    title: "Church History",
    href: "/library/history",
    summary: "Browse structured history topics — the Great Schism, the Reformation, the Charismatic movement — 2000 years in depth.",
  },
];

const traditions: LibModule[] = [
  {
    icon: "☩",
    title: "Catholic Resources",
    href: "/library/catholic/resources",
    summary: "Bible, catechesis, liturgy, saints, councils, and official Catholic resources.",
  },
  {
    icon: "IC XC",
    title: "Orthodox Study",
    href: "/library/orthodox",
    summary: "Shared fathers, Cyril, Athanasius, liturgical catechesis, and curated Eastern Orthodox resources.",
  },
  {
    icon: "☦",
    title: "Oriental Orthodox",
    href: "/library/oriental-orthodox",
    summary: "Ethiopian, Coptic, Armenian, and Syriac Christian traditions with primary sources.",
  },
  {
    icon: "✝",
    title: "Protestant Study",
    href: "/library/protestant",
    summary: "KJV reader, Strong's study, and Reformation-related history for Protestant-focused study.",
  },
  {
    icon: "✝",
    title: "Protestant Resources",
    href: "/library/protestant/resources",
    summary: "Scripture study, reformers, confessions, history, and shared ancient sources.",
  },
  {
    icon: "✒",
    title: "Protestant Figures",
    href: "/library/protestant/figures",
    summary: "Luther, Calvin, Wesley, and Protestant theologians through profiles and primary-text study pages.",
  },
  {
    icon: "✦",
    title: "Protestant Texts",
    href: "/library/protestant/texts",
    summary: "Augsburg, Heidelberg, Westminster, Thirty-Nine Articles, and other confessions and catechisms.",
  },
];

const tools: LibModule[] = [
  {
    icon: "🙏",
    title: "Prayer Forum",
    href: "/library/prayer-forum",
    summary: "A quiet prayer board where signed-in users can share requests and pray for one another.",
  },
  {
    icon: "◎",
    title: "Notes & Bookmarks",
    href: "/library/notes",
    summary: "Your locally saved study notes and bookmarks across all library sections.",
  },
  {
    icon: "⚙",
    title: "Settings",
    href: "/library/settings",
    summary: "Adjust theme, Strong's display, and reader preferences for the whole app.",
  },
];

function LibCard({ icon, title, href, summary }: LibModule) {
  return (
    <Link
      href={href}
      className="library-card group"
    >
      <span className="library-card__icon" aria-hidden="true">{icon}</span>
      <div className="library-card__body">
        <h3 className="library-card__title">{title}</h3>
        <p className="library-card__desc">{summary}</p>
      </div>
      <span className="library-card__arrow" aria-hidden="true">→</span>
    </Link>
  );
}

function LibSection({
  id,
  eyebrow,
  title,
  modules,
}: {
  id: string;
  eyebrow: string;
  title: string;
  modules: LibModule[];
}) {
  return (
    <section className="library-section" aria-labelledby={id}>
      <div className="library-section__header">
        <p className="library-section__eyebrow">{eyebrow}</p>
        <h2 id={id} className="library-section__title">{title}</h2>
      </div>
      <div className="library-grid">
        {modules.map((m) => (
          <LibCard key={m.href} {...m} />
        ))}
      </div>
    </section>
  );
}

export default function LibraryPage() {
  return (
    <>
      <JsonLd data={LIBRARY_SCHEMA} />
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-20 sm:px-8 lg:px-12">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Library" }]} />

        {/* Page intro */}
        <div className="library-intro">
          <p className="library-intro__eyebrow">Study Library</p>
          <h1 className="library-intro__title">Scripture, History &amp; Tradition</h1>
          <p className="library-intro__lead">
            Free Bible study covering the King James Version with Strong&apos;s concordance,
            the Douay-Rheims Catholic Bible, early Church Fathers in full text, all seven
            Ecumenical Councils, the Roman Catechism of Trent, 2000 years of Church History,
            and dedicated study tracks for every Christian tradition.
          </p>
        </div>

        <LibSection
          id="lib-scripture"
          eyebrow="Scripture"
          title="Read the Word"
          modules={scripture}
        />

        <LibSection
          id="lib-history"
          eyebrow="History"
          title="Fathers &amp; Councils"
          modules={history}
        />

        <LibSection
          id="lib-traditions"
          eyebrow="Traditions"
          title="Every Branch of the Church"
          modules={traditions}
        />

        <LibSection
          id="lib-tools"
          eyebrow="Community"
          title="Prayer &amp; Tools"
          modules={tools}
        />
      </main>
      <MobileBottomNav active="Library" />
    </>
  );
}
