import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
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
    <main className="councils-mobile mobile-app-shell">
      <div className="sr-only">
        <h2>Common questions about the Ecumenical Councils</h2>
        <p><strong>What are the Ecumenical Councils?</strong> Ecumenical Councils are formal assemblies of bishops convened to define doctrine and address heresies. Seven are recognized by both Catholic and Orthodox churches.</p>
        <p><strong>What did the Council of Nicaea decide?</strong> Nicaea (325 AD) defined the full divinity of Christ against Arianism and produced the Nicene Creed, declaring the Son to be of the same substance as the Father.</p>
        <p><strong>Which traditions accept the councils?</strong> All seven are accepted by the Catholic and Eastern Orthodox churches. The Oriental Orthodox accept the first three. Most Protestants accept at least the first four on Trinitarian doctrine.</p>
      </div>
      <header className="mobile-section-header">
        <Link href="/" aria-label="Back home" className="mobile-section-header__back">
          ‹
        </Link>
        <div>
          <h1>Ecumenical Councils</h1>
          <span aria-hidden="true">◆ ─ ✦ ─ ◆</span>
        </div>
      </header>

      <section className="councils-timeline" aria-label="Seven ecumenical councils">
        {councilsLibrary.map((council) => (
          <article key={council.slug} className="council-timeline-item">
            <div className="council-timeline-item__marker">
              <span>{council.order}</span>
            </div>
            <Link href={`/library/councils/${council.slug}`} className="council-card">
              <div className="council-card__icon" aria-hidden="true">
                ♜
              </div>
              <div className="council-card__body">
                <p>{council.year} AD</p>
                <h2>{council.title}</h2>
                <ul>
                  <li>{council.calledBy}</li>
                  <li>{council.issue}</li>
                  <li>{council.attendance}</li>
                </ul>
                <span className="council-card__button">Read More ›</span>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <MobileBottomNav active="Home" />
    </main>
    </>
  );
}

