import type { ReactNode } from "react";

function toHeadingId(title: string) {
  return `hero-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export default function SiteHeroPanel({
  eyebrow,
  title,
  lead,
  children,
  headingLevel = 1,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
  headingLevel?: 1 | 2;
}) {
  const headingId = toHeadingId(title);
  const Heading = headingLevel === 2 ? "h2" : "h1";

  return (
    <section
      className="mt-6 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10"
      aria-labelledby={headingId}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
        {eyebrow}
      </p>
      <Heading id={headingId} className="site-page-title mt-3">{title}</Heading>
      <p className="site-heading-lead mt-4 max-w-3xl">{lead}</p>
      {children}
    </section>
  );
}
