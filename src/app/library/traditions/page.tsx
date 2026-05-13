import type { Metadata } from "next";
import { buildCollectionPageSchema, buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SiteHeroPanel from "@/components/site-hero-panel";

export const metadata: Metadata = buildMeta({
  title: "Christian Traditions — Catholic, Orthodox & Protestant",
  description:
    "Study every major branch of Christianity — Catholic, Eastern Orthodox, Oriental Orthodox, and Protestant — with dedicated hubs for Scripture, theology, and tradition.",
  keywords:
    "Christian traditions, Catholic study, Orthodox Christianity, Protestant theology, oriental orthodox, church traditions",
  path: "/library/traditions",
});

const TRADITIONS_SCHEMA = buildCollectionPageSchema({
  path: "/library/traditions",
  name: "Christian Traditions — Catholic, Orthodox & Protestant",
  description:
    "A Christian traditions study hub for Catholic, Eastern Orthodox, Oriental Orthodox, and Protestant Scripture, theology, and history resources.",
  about: [
    "Christian traditions",
    "Catholic theology",
    "Orthodox Christianity",
    "Protestant theology",
    "Church history",
  ],
});

const primaryTraditions = [
  {
    eyebrow: "Catholic",
    title: "Catholic Resources",
    href: "/library/catholic/resources",
    summary:
      "Bible, catechesis, sacraments, saints, councils, and Catholic study resources organized as one integrated path.",
  },
  {
    eyebrow: "Eastern Orthodox",
    title: "Orthodox Study",
    href: "/library/orthodox",
    summary:
      "Shared fathers, Cyril, Athanasius, liturgical catechesis, and curated Eastern Orthodox study resources.",
  },
  {
    eyebrow: "Oriental Orthodox",
    title: "Oriental Orthodox",
    href: "/library/oriental-orthodox",
    summary:
      "Ethiopian, Coptic, Armenian, and Syriac Christian traditions with primary sources and theological heritage.",
  },
  {
    eyebrow: "Protestant",
    title: "Protestant Resources",
    href: "/library/protestant/resources",
    summary:
      "KJV reader, Strong's study, Reformation history, reformers, confessions, and Protestant scripture study.",
  },
];

const protestantPaths = [
  {
    title: "Protestant Study",
    href: "/library/protestant",
    summary:
      "KJV reader, Strong's concordance, and Reformation-related history for Protestant-focused study.",
  },
  {
    title: "Protestant Figures",
    href: "/library/protestant/figures",
    summary:
      "Luther, Calvin, Wesley, and Protestant theologians through profiles and primary-text study pages.",
  },
  {
    title: "Protestant Texts",
    href: "/library/protestant/texts",
    summary:
      "Augsburg, Heidelberg, Westminster, Thirty-Nine Articles, and other confessions and catechisms.",
  },
];

export default function TraditionsPage() {
  return (
    <>
      <JsonLd data={TRADITIONS_SCHEMA} />
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Library", href: "/library" },
            { label: "Traditions" },
          ]}
        />

        {/* Hero panel */}
        <SiteHeroPanel
          eyebrow="Traditions"
          title="Every Branch of the Church"
          lead="Dedicated study hubs for every major Christian tradition — Catholic, Eastern Orthodox, Oriental Orthodox, and Protestant — with Scripture tools, primary texts, catechesis, theology, and the shared early Church that underlies them all."
        />

        {/* Primary tradition cards */}
        <section
          className="mt-10 grid gap-4 sm:grid-cols-2"
          aria-label="Christian tradition study hubs"
        >
          {primaryTraditions.map((tradition) => (
            <Link
              key={tradition.href}
              href={tradition.href}
              className="flex flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-highlight)] md:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                {tradition.eyebrow}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)] leading-tight">
                {tradition.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">
                {tradition.summary}
              </p>
              <span className="mt-auto pt-4 text-sm font-semibold text-[var(--color-highlight)]">
                Open study hub →
              </span>
            </Link>
          ))}
        </section>

        {/* Protestant additional paths */}
        <section className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
            Protestant Study
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            Additional Protestant paths
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {protestantPaths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4 transition hover:border-[var(--color-highlight)]"
              >
                <p className="font-semibold text-[var(--color-ink)]">{path.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{path.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MobileBottomNav active="Home" />
    </>
  );
}
