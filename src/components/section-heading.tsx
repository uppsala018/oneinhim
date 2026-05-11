export default function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
          {eyebrow}
        </p>
      )}
      <h2 className="site-section-title">
        {title}
      </h2>
      <p className="site-heading-lead">
        {body}
      </p>
    </div>
  );
}

