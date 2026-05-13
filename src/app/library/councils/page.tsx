import type { Metadata } from "next";
import { buildCollectionPageSchema, buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import SiteHeroPanel from "@/components/site-hero-panel";
import { councilsLibrary } from "@/lib/content";

export const metadata: Metadata = buildMeta({
  title: "Ecumenical Councils of the Church",
  description: "Study all seven Ecumenical Councils — Nicaea, Constantinople, Ephesus, Chalcedon and more. Learn what was decided and why each council still matters.",
  keywords: "ecumenical councils, Council of Nicaea, Council of Chalcedon, church councils, early church, church history",
  path: "/library/councils",
});

const councilsSchema = buildCollectionPageSchema({
  path: "/library/councils",
  name: "Ecumenical Councils of the Church",
  description:
    "A church councils study hub covering the seven Ecumenical Councils, their historical background, theological controversies, key figures, and doctrinal decisions.",
  about: ["Ecumenical councils", "Church history", "Christian doctrine"],
});

const councilsFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the Ecumenical Councils?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ecumenical Councils are formal assemblies of bishops from across the Christian world convened to define doctrine, address heresies, and settle church discipline. The word ecumenical (from Greek oikoumene, the whole inhabited world) signals that these councils speak for the whole Church, not just one region.",
      },
    },
    {
      "@type": "Question",
      name: "How many Ecumenical Councils are there?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Seven councils are recognized by both the Catholic Church and the Eastern Orthodox Church as fully ecumenical: Nicaea I (325), Constantinople I (381), Ephesus (431), Chalcedon (451), Constantinople II (553), Constantinople III (680), and Nicaea II (787). The Catholic Church recognizes additional councils through Vatican II (1965).",
      },
    },
    {
      "@type": "Question",
      name: "What did the Council of Nicaea decide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The First Council of Nicaea (325 AD) defined the full divinity of Christ against Arianism, which taught that the Son was a created being subordinate to the Father. The council produced the Nicene Creed and declared the Son to be homoousios — of the same substance as the Father.",
      },
    },
    {
      "@type": "Question",
      name: "Which traditions accept the Ecumenical Councils?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All seven councils are accepted by the Catholic Church and the Eastern Orthodox Church. The Oriental Orthodox churches (Coptic, Ethiopian, Armenian, Syriac) accept the first three councils but not Chalcedon (451). Most Protestant traditions accept at minimum the first four councils as authoritative on Trinitarian and Christological doctrine.",
      },
    },
  ],
};

export default function CouncilsPage() {
  return (
    <>
      <JsonLd data={councilsSchema} />
      <JsonLd data={councilsFaqSchema} />
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Library", href: "/library" },
            { label: "Ecumenical Councils" },
          ]}
        />

        {/* Hero panel */}
        <SiteHeroPanel
          eyebrow="Church History"
          title="Ecumenical Councils"
          lead="From 325 to 787 AD, the Church gathered seven times in formal council to define the faith against serious theological errors. These councils settled the Church's core teaching on the Trinity and the person of Christ. Catholic and Eastern Orthodox churches accept all seven. Most Protestant traditions accept at least the first four. Each council page gives the historical background, the theological controversy, key figures, and what was decided."
        />

        {/* Council cards */}
        <section
          className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-labelledby="seven-councils-heading"
        >
          <h2 id="seven-councils-heading" className="sr-only">
            Seven ecumenical councils
          </h2>
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
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)] leading-tight">
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
                <p>{council.attendance}</p>
              </div>
              <span className="mt-auto pt-5 text-sm font-semibold text-[var(--color-highlight)]">
                Study this council →
              </span>
            </Link>
          ))}
        </section>

        {/* Study flow guide */}
        <section className="mt-8" aria-labelledby="council-study-flow-heading">
          <div className="grid gap-4 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:grid-cols-3 md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                Study Flow
              </p>
              <h2 id="council-study-flow-heading" className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                Read in order
              </h2>
            </div>
            <p className="text-sm leading-7 text-[var(--color-muted)] md:col-span-2">
              Start with Nicaea, then follow the councils chronologically. Each page keeps the same
              pattern: background, controversy, key figures, and what the Church decided.
            </p>
          </div>
        </section>
      </main>

      <MobileBottomNav active="Home" />
    </>
  );
}
