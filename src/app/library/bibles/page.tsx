import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export const metadata: Metadata = buildMeta({
  title: "Study the Bible — All Translations & Versions",
  description:
    "Read the Bible in any translation — KJV with Strong's concordance, Douay-Rheims Catholic Bible, Septuagint, NIV, ESV, NKJV, Amplified, NASB, and 35+ more versions.",
  keywords:
    "bible translations, KJV bible, NIV bible, ESV bible, NKJV, Amplified bible, Catholic bible, Septuagint, bible versions, free bible online",
  path: "/library/bibles",
});

const BIBLES_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.oneinhimbiblestudy.com/library/bibles/#page",
  url: "https://www.oneinhimbiblestudy.com/library/bibles",
  name: "Study the Bible — All Translations & Versions",
  description:
    "Bible study in every major translation — KJV + Strong's, Douay-Rheims, Septuagint, NIV, ESV, NKJV, Amplified, NASB, and 35+ more versions.",
  isPartOf: { "@id": "https://www.oneinhimbiblestudy.com/#website" },
};

const primaryBibles = [
  {
    id: "kjv",
    label: "KJV + Strong's Concordance",
    sub: "King James Version — 1611",
    desc: "Read the complete King James Version with word-by-word Strong's concordance. Click any word to see the original Hebrew or Greek definition, transliteration, and every other occurrence in Scripture. The most widely used Bible in the English-speaking world for four centuries.",
    tag: "Internal Reader",
    href: "/library/kjv",
    internal: true,
  },
  {
    id: "drb",
    label: "Catholic Bible",
    sub: "Douay-Rheims & RSV-CE",
    desc: "Read the Douay-Rheims Catholic Bible with the full deuterocanonical books — Tobit, Judith, 1–2 Maccabees, Wisdom, Sirach, and Baruch. Includes the RSV-CE for comparison. The standard Catholic English Scripture for study, theology, and liturgy.",
    tag: "Internal Reader",
    href: "/library/catholic",
    internal: true,
  },
];

const standardBibles = [
  {
    label: "Septuagint (LXX)",
    sub: "Brenton English Translation",
    desc: "The Greek Old Testament used by the early church and Eastern Orthodox tradition. Essential for patristic study.",
    href: "/library/orthodox/lxx",
    internal: true,
  },
  {
    label: "New King James Version",
    sub: "NKJV — Thomas Nelson, 1982",
    desc: "Modernized KJV language preserving the literary tradition of the 1611 text while updating archaic forms.",
    href: "https://www.biblegateway.com/passage/?search=John+1&version=NKJV",
    internal: false,
  },
  {
    label: "New International Version",
    sub: "NIV — Biblica, 1978/2011",
    desc: "The world's most widely sold Bible. Clear contemporary English with broad Protestant and evangelical use.",
    href: "https://www.biblegateway.com/passage/?search=John+1&version=NIV",
    internal: false,
  },
  {
    label: "English Standard Version",
    sub: "ESV — Crossway, 2001",
    desc: "Formal-equivalence translation favored for study, preaching, and memorization in Reformed and evangelical churches.",
    href: "https://www.esv.org/John+1/",
    internal: false,
  },
  {
    label: "Amplified Bible",
    sub: "AMP — Lockman Foundation",
    desc: "Expands the text with bracketed definitions and alternate renderings, drawing out the full meaning of key Greek and Hebrew words.",
    href: "https://www.biblegateway.com/passage/?search=John+1&version=AMP",
    internal: false,
  },
  {
    label: "New American Standard Bible",
    sub: "NASB — Lockman Foundation, 1971",
    desc: "One of the most literally precise English translations, widely used for word studies and exegetical preaching.",
    href: "https://www.biblegateway.com/passage/?search=John+1&version=NASB",
    internal: false,
  },
  {
    label: "Geneva Bible",
    sub: "1599 — Public Domain",
    desc: "The Bible of the Protestant Reformation, the Puritans, and the Mayflower. The first English Bible with verse numbers — predates the KJV by over a decade.",
    href: "https://www.biblegateway.com/passage/?search=John+1&version=GNV",
    internal: false,
  },
];

const allVersions = [
  { label: "New Living Translation (NLT)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NLT" },
  { label: "The Message (MSG)", href: "https://www.biblegateway.com/passage/?search=John+1&version=MSG" },
  { label: "Christian Standard Bible (CSB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=CSB" },
  { label: "New Revised Standard Version (NRSV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NRSV" },
  { label: "NET Bible", href: "https://netbible.org/bible/John+1" },
  { label: "Good News Translation (GNT)", href: "https://www.biblegateway.com/passage/?search=John+1&version=GNT" },
  { label: "Holman Christian Standard (HCSB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=HCSB" },
  { label: "Common English Bible (CEB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=CEB" },
  { label: "Contemporary English Version (CEV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=CEV" },
  { label: "New Century Version (NCV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NCV" },
  { label: "Tree of Life Version (TLV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=TLV" },
  { label: "Complete Jewish Bible (CJB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=CJB" },
  { label: "Orthodox Jewish Bible (OJB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=OJB" },
  { label: "New American Bible Revised (NABRE)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NABRE" },
  { label: "Berean Study Bible (BSB)", href: "https://berean.bible/tabs.htm#John-1" },
  { label: "Lexham English Bible (LEB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=LEB" },
  { label: "Voice Bible", href: "https://www.biblegateway.com/passage/?search=John+1&version=VOICE" },
  { label: "International Standard Version (ISV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=ISV" },
  { label: "Easy-to-Read Version (ERV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=ERV" },
  { label: "New International Reader's (NIrV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NIRV" },
  { label: "Revised Standard Version (RSV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=RSV" },
  { label: "American Standard Version (ASV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=ASV" },
  { label: "Young's Literal Translation (YLT)", href: "https://www.biblegateway.com/passage/?search=John+1&version=YLT" },
  { label: "World English Bible (WEB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=WEB" },
  { label: "21st Century King James (KJ21)", href: "https://www.biblegateway.com/passage/?search=John+1&version=KJ21" },
  { label: "Wycliffe Bible (c. 1395)", href: "https://www.biblegateway.com/passage/?search=John+1&version=WYC" },
  { label: "New Life Version (NLV)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NLV" },
  { label: "God's Word Translation (GWT)", href: "https://www.biblegateway.com/passage/?search=John+1&version=GWT" },
  { label: "Douay-Rheims 1899 (DRA)", href: "https://www.biblegateway.com/passage/?search=John+1&version=DRA" },
  { label: "New Jerusalem Bible (NJB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NJB" },
  { label: "Expanded Bible (EXB)", href: "https://www.biblegateway.com/passage/?search=John+1&version=EXB" },
  { label: "The Passion Translation (TPT)", href: "https://www.biblegateway.com/passage/?search=John+1&version=TPT" },
  { label: "New English Translation (NET)", href: "https://www.biblegateway.com/passage/?search=John+1&version=NET" },
  { label: "Disciples' Literal NT (DLNT)", href: "https://www.biblegateway.com/passage/?search=John+1&version=DLNT" },
  { label: "Phillips New Testament (PHILLIPS)", href: "https://www.biblegateway.com/passage/?search=John+1&version=PHILLIPS" },
];

export default function BiblesPage() {
  return (
    <>
      <JsonLd data={BIBLES_SCHEMA} />
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Library", href: "/library" },
          { label: "Bibles" },
        ]} />

        <div className="max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
            Study the Bible
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
            Read Scripture in any translation. This library includes two full internal readers —
            the King James Version with word-by-word Strong&apos;s concordance and the Catholic
            Bible with Douay-Rheims and RSV-CE — plus the Brenton Septuagint, the Greek Old
            Testament used by the early church and the Eastern Orthodox tradition. For modern
            translations, clear curated links take you directly to the relevant passage in the
            NIV, ESV, NKJV, Amplified, NASB, and Geneva Bible. Below those, a full directory of
            over thirty-five translations covers every major English version in use today —
            from literal formal-equivalence texts to dynamic idiomatic renderings, Catholic editions,
            Jewish translations, public-domain Reformation-era Bibles, and contemporary paraphrases.
            Whether you are doing word studies, comparing translations, reading devotionally, or
            studying church history through the Bible versions the Reformers and Fathers used,
            every major English translation is one click away.
          </p>
        </div>

        {/* Primary readers — full-width gold cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {primaryBibles.map((bible) => (
            <Link
              key={bible.id}
              href={bible.href}
              className="group overflow-hidden rounded-[2.4rem] border border-[rgba(230,190,120,0.45)] bg-[linear-gradient(145deg,rgba(230,190,120,0.12),rgba(10,10,10,0.82)_42%,rgba(10,10,10,0.94))] p-8 transition hover:border-[rgba(230,190,120,0.75)]"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
                {bible.tag}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                {bible.label}
              </h2>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                {bible.sub}
              </p>
              <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">{bible.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(230,190,120,0.48)] bg-[rgba(230,190,120,0.08)] px-6 py-3 text-sm font-semibold text-[var(--color-highlight)] transition group-hover:bg-[rgba(230,190,120,0.18)]">
                Open Reader &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Secondary bibles — 3-col grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {standardBibles.map((bible) => {
            const Wrapper = bible.internal ? Link : "a";
            const extraProps = bible.internal
              ? {}
              : { target: "_blank", rel: "noreferrer" };
            return (
              <Wrapper
                key={bible.label}
                href={bible.href}
                {...(extraProps as object)}
                className="group flex flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition hover:border-[rgba(230,190,120,0.45)]"
              >
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                  {bible.label}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--color-soft)]">
                  {bible.sub}
                </p>
                <p className="mt-3 flex-1 text-sm leading-6 text-[var(--color-muted)]">
                  {bible.desc}
                </p>
                <span className="mt-5 text-sm font-semibold text-[var(--color-highlight)] transition group-hover:underline">
                  {bible.internal ? "Open Reader →" : "Read online →"}
                </span>
              </Wrapper>
            );
          })}
        </div>

        {/* All versions — native details/summary */}
        <details className="group mt-8 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 md:p-8 [&::-webkit-details-marker]:hidden">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                Browse All
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                All Bible Versions
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                35+ translations — click to expand
              </p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-lg text-[var(--color-highlight)] transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>

          <div className="max-h-[520px] overflow-y-auto border-t border-[var(--color-border)] px-6 pb-6 pt-5">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {allVersions.map((v) => (
                <a
                  key={v.label}
                  href={v.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-[1rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] px-4 py-3 text-sm text-[var(--color-ink)] transition hover:border-[rgba(230,190,120,0.45)] hover:text-[var(--color-highlight)]"
                >
                  <span className="text-[var(--color-highlight)] text-xs">✦</span>
                  {v.label}
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs leading-6 text-[var(--color-soft)]">
              Links open Bible Gateway or the publisher&apos;s official reader. All listed versions are
              available free online. Sign in to this app to save notes and bookmarks across the
              internal KJV, Catholic, and Septuagint readers.
            </p>
          </div>
        </details>
      </main>

      <MobileBottomNav active="Search" />
    </>
  );
}
