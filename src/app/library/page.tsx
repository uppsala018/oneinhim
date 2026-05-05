import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = buildMeta({
  title: "Scripture & Study Library",
  description: "Browse the complete One In Him library — KJV Bible, Church Fathers, Ecumenical Councils, and Christian traditions from Catholic to Protestant.",
  keywords: "bible study, christian resources, church history, early church, scripture library",
  path: "/library",
});

const modules = [
  {
    title: "Protestant Study",
    href: "/library/protestant",
    summary:
      "Open a Protestant-focused hub for the KJV reader, Strong's study, and Reformation-related history.",
  },
  {
    title: "Protestant Resources",
    href: "/library/protestant/resources",
    summary:
      "Navigate Protestant Scripture study, reformers, confessions, history, and shared ancient sources.",
  },
  {
    title: "Protestant Figures",
    href: "/library/protestant/figures",
    summary:
      "Read Luther, Calvin, Wesley, and Protestant theologians through internal profiles and primary-text study pages.",
  },
  {
    title: "Protestant Texts",
    href: "/library/protestant/texts",
    summary:
      "Browse confessions, catechisms, and doctrinal standards such as Augsburg, Heidelberg, Westminster, and the Thirty-Nine Articles.",
  },
  {
    title: "KJV + Strong's",
    href: "/library/kjv",
    summary:
      "Read a structured KJV chapter and inspect linked Strong's entries with notes and bookmarks.",
  },
  {
    title: "Catholic Bible",
    href: "/library/catholic",
    summary:
      "Read the full Douay-Rheims canon with chapter search, bookmarks, notes, and catechism-linked companion studies.",
  },
  {
    title: "Catholic Resources",
    href: "/library/catholic/resources",
    summary:
      "Navigate Catholic Bible, catechesis, liturgy, saints, councils, and official resources.",
  },
  {
    title: "Roman Catechism",
    href: "/library/catechism",
    summary:
      "Read the Catechism of Trent organized by creed, sacraments, commandments, and prayer.",
  },
  {
    title: "Church Fathers",
    href: "/library/fathers",
    summary:
      "Browse father profiles and read full primary texts, including Ignatius, Clement, Polycarp, Justin, and Athanasius.",
  },
  {
    title: "Church Councils",
    href: "/library/councils",
    summary:
      "Study the seven ecumenical councils with timeline navigation, doctrine summaries, key terms, and related app sections.",
  },
  {
    title: "Orthodox Study",
    href: "/library/orthodox",
    summary:
      "Open an Orthodox-focused hub with shared fathers, Cyril, Athanasius, liturgical catechesis, and curated external resources.",
  },
  {
    title: "Church History",
    href: "/library/history",
    summary:
      "Browse structured history topics with dedicated pages for councils, schism, and reform.",
  },
  {
    title: "Notes Archive",
    href: "/library/notes",
    summary:
      "See your locally saved study notes with a Supabase-ready persistence path.",
  },
  {
    title: "Prayer Forum",
    href: "/library/prayer-forum",
    summary:
      "Open a small prayer board where signed-in users can share requests and pray for one another.",
  },
  {
    title: "Oriental Orthodox",
    href: "/library/oriental-orthodox",
    summary:
      "Explore Oriental Orthodox Christianity — Ethiopian, Coptic, Armenian, and Syriac traditions with primary sources.",
  },
  {
    title: "Settings",
    href: "/library/settings",
    summary:
      "Adjust theme, Strong's display, and reader preferences for the whole app.",
  },
];

export default function LibraryPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Library" }]} />
        <div className="max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            Study Library
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
            Free Bible study covering the King James Version with Strong&apos;s concordance,
            the Douay-Rheims Catholic Bible and RSV-CE, the Brenton Septuagint, early Church Fathers
            in full text, all seven Ecumenical Councils, the Roman Catechism of Trent, 2000 years of
            Church History, and dedicated study tracks for Catholic, Orthodox, Oriental Orthodox,
            and Protestant traditions.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition hover:bg-[rgba(16,16,16,0.88)]"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                {module.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {module.summary}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <MobileBottomNav active="Search" />
    </>
  );
}

