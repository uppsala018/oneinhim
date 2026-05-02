import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { councilsLibrary } from "@/lib/content";

export default function CouncilsPage() {
  return (
    <main className="councils-mobile mobile-app-shell">
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
  );
}
