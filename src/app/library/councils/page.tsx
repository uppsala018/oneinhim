import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import JsonLd from "@/components/json-ld";
import { councilsLibrary } from "@/lib/content";

export const metadata: Metadata = buildMeta({
  title: "Ecumenical Councils of the Church",
  description: "Study all seven Ecumenical Councils — Nicaea, Constantinople, Ephesus, Chalcedon and more. Learn what was decided and why each council still matters.",
  keywords: "ecumenical councils, Council of Nicaea, Council of Chalcedon, church councils, early church, church history",
  path: "/library/councils",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.oneinhimbiblestudy.com" },
    { "@type": "ListItem", position: 2, name: "Library", item: "https://www.oneinhimbiblestudy.com/library" },
    { "@type": "ListItem", position: 3, name: "Ecumenical Councils", item: "https://www.oneinhimbiblestudy.com/library/councils" },
  ],
};

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
    <JsonLd data={breadcrumbSchema} />
    <JsonLd data={councilsFaqSchema} />
    <div className="hidden lg:block">
      <AppHeader />
    </div>
    <main className="councils-mobile mobile-app-shell lg:pt-[var(--header-height)]">
      <header className="mobile-section-header">
        <Link href="/" aria-label="Back home" className="mobile-section-header__back">
          ‹
        </Link>
        <div>
          <h1>Ecumenical Councils</h1>
          <span aria-hidden="true">◆ ─ ✦ ─ ◆</span>
        </div>
      </header>

      <section className="px-4 pt-6 pb-5 border-b border-[var(--color-border)]">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">Church History</p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
          The Seven Ecumenical Councils
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          From 325 to 787 AD, the Church gathered seven times in formal council to define the
          faith against serious theological errors. These seven councils — Nicaea, Constantinople,
          Ephesus, Chalcedon, and three more — settled the Church&apos;s core teaching on the
          Trinity and the person of Christ. Every question they addressed arose from a real
          crisis: bishops who disagreed, emperors who took sides, and congregations whose
          worship and salvation hung on the answer. Catholic and Eastern Orthodox churches
          accept all seven as fully ecumenical. Most Protestant traditions accept at least the
          first four. The Oriental Orthodox churches — Coptic, Armenian, Ethiopian, Syriac —
          accept the first three and consider Chalcedon (451) a departure from Cyril&apos;s
          theology. Each council page gives the historical background, the theological
          controversy, key figures, and what was decided.
        </p>
      </section>

      <section
        className="grid gap-4 px-4 py-6 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Seven ecumenical councils"
      >
        {councilsLibrary.map((council) => (
          <Link
            key={council.slug}
            href={`/library/councils/${council.slug}`}
            className="flex min-h-[18rem] flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-highlight)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
                  {council.year} AD
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-[var(--color-ink)]">
                  {council.title}
                </h2>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-sm text-[var(--color-highlight)]">
                {council.order}
              </span>
            </div>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-[var(--color-muted)]">
              <p>{council.calledBy}</p>
              <p>{council.issue}</p>
              <p>{council.attendance}</p>
            </div>
            <span className="mt-auto pt-5 text-sm font-semibold text-[var(--color-highlight)]">
              Read More →
            </span>
          </Link>
        ))}
      </section>

      <section className="px-4 pb-8">
        <div className="grid gap-4 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-highlight)]">
              Study Flow
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
              Read in order
            </h2>
          </div>
          <p className="text-sm leading-7 text-[var(--color-muted)] md:col-span-2">
            Start with Nicaea, then follow the councils chronologically. Each page keeps the same
            pattern: background, controversy, key figures, and what the Church decided.
          </p>
        </div>
      </section>

      <MobileBottomNav active="Home" />
    </main>
    </>
  );
}
