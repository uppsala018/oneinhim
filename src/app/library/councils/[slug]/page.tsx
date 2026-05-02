import Link from "next/link";
import { notFound } from "next/navigation";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { councilsLibrary, getCouncilTopic } from "@/lib/content";

export function generateStaticParams() {
  return councilsLibrary.map((council) => ({
    slug: council.slug,
  }));
}

export default async function CouncilDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const council = getCouncilTopic(slug);

  if (!council) {
    notFound();
  }

  return (
    <main className="council-detail mobile-app-shell">
      <header className="mobile-section-header">
        <Link href="/library/councils" aria-label="Back to councils" className="mobile-section-header__back">
          ‹
        </Link>
        <div>
          <h1>{council.shortTitle}</h1>
          <span>{council.year} AD</span>
        </div>
      </header>

      <section className="council-detail__hero">
        <div className="council-detail__seal" aria-hidden="true">
          {council.order}
        </div>
        <p>{council.location}</p>
        <h2>{council.title}</h2>
        <p>{council.summary}</p>
      </section>

      <section className="council-detail-grid">
        <article>
          <span>Issue</span>
          <p>{council.issue}</p>
        </article>
        <article>
          <span>Called by</span>
          <p>{council.calledBy}</p>
        </article>
        <article>
          <span>Attendance</span>
          <p>{council.attendance}</p>
        </article>
      </section>

      <section className="council-study-card">
        <p className="council-study-card__eyebrow">Outcome</p>
        <h2>What the council decided</h2>
        <p>{council.outcome}</p>
      </section>

      <section className="council-study-card council-study-card--gold">
        <p className="council-study-card__eyebrow">Why it matters</p>
        <h2>The doctrine at stake</h2>
        <p>{council.whyItMatters}</p>
      </section>

      <section className="council-study-card">
        <p className="council-study-card__eyebrow">Council teaching</p>
        <h2>{council.teachingText.title}</h2>
        <div className="council-paragraph-stack">
          {council.teachingText.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="council-study-card council-study-card--gold">
        <p className="council-study-card__eyebrow">Controversy explained</p>
        <h2>{council.controversy.title}</h2>
        <div className="council-paragraph-stack">
          {council.controversy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="council-study-card">
        <p className="council-study-card__eyebrow">Study path</p>
        <h2>How to understand it</h2>
        <div className="council-study-steps">
          {council.studyPath.map((step, index) => (
            <article key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="council-study-card">
        <p className="council-study-card__eyebrow">Reception</p>
        <h2>How the traditions receive it</h2>
        <div className="council-reception-list">
          {council.reception.map((item) => (
            <article key={item.tradition}>
              <h3>{item.tradition}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="council-study-card">
        <p className="council-study-card__eyebrow">Key terms</p>
        <h2>Words to know</h2>
        <div className="council-term-list">
          {council.keyTerms.map((term) => (
            <article key={term.term}>
              <h3>{term.term}</h3>
              <p>{term.definition}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="council-study-card">
        <p className="council-study-card__eyebrow">Scripture</p>
        <h2>Biblical connections</h2>
        <div className="council-chip-row">
          {council.scriptureConnections.map((reference) => (
            <span key={reference}>{reference}</span>
          ))}
        </div>
      </section>

      <section className="council-study-card">
        <p className="council-study-card__eyebrow">Continue study</p>
        <h2>Related app sections</h2>
        <div className="council-link-list">
          {council.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
              <span>›</span>
            </Link>
          ))}
        </div>
      </section>

      <MobileBottomNav active="Home" />
    </main>
  );
}
