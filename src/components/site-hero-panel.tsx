import type { ReactNode } from "react";

export default function SiteHeroPanel({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <section className="mt-6 rounded-[2.4rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
        {eyebrow}
      </p>
      <h1 className="site-page-title mt-3">{title}</h1>
      <p className="site-heading-lead mt-4 max-w-3xl">{lead}</p>
      {children}
    </section>
  );
}
