import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { councilsLibrary } from "@/lib/content";

export const metadata: Metadata = buildMeta({
  title: "Ecumenical Councils of the Church",
  description: "Study all seven Ecumenical Councils â€” Nicaea, Constantinople, Ephesus, Chalcedon and more. Learn what was decided and why each council still matters.",
  keywords: "ecumenical councils, Council of Nicaea, Council of Chalcedon, church councils, early church, church history",
  path: "/library/councils",
});

export default function CouncilsPage() {
  return (
    <main className="councils-mobile mobile-app-shell">
      <header className="mobile-section-header">
        <Link href="/" aria-label="Back home" className="mobile-section-header__back">
          â€ą
        </Link>
        <div>
          <h1>Ecumenical Councils</h1>
          <span aria-hidden="true">â—† â”€ âś¦ â”€ â—†</span>
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
                â™ś
              </div>
              <div className="council-card__body">
                <p>{council.year} AD</p>
                <h2>{council.title}</h2>
                <ul>
                  <li>{council.calledBy}</li>
                  <li>{council.issue}</li>
                  <li>{council.attendance}</li>
                </ul>
                <span className="council-card__button">Read More â€ş</span>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <MobileBottomNav active="Home" />
    </main>
  );
}

