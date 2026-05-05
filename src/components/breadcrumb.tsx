import Link from "next/link";
import JsonLd from "@/components/json-ld";

export type BreadcrumbItem = { label: string; href?: string };

const BASE = "https://www.oneinhimbiblestudy.com";

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-nav__list">
          {items.map((item, i) => (
            <li key={i} className="breadcrumb-nav__item">
              {item.href ? (
                <Link href={item.href} className="breadcrumb-nav__link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-nav__current" aria-current="page">
                  {item.label}
                </span>
              )}
              {i < items.length - 1 && (
                <span className="breadcrumb-nav__sep" aria-hidden="true">&rsaquo;</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
