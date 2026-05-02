export default function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
        {eyebrow}
      </p>
      <h2 className="text-3xl leading-tight font-semibold text-[var(--color-ink)] sm:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-[var(--color-muted)] sm:text-lg">
        {body}
      </p>
    </div>
  );
}
