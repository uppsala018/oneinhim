"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import type { FatherProfile } from "@/lib/content-types";

const filters = ["All", "Apostolic Fathers", "Ante-Nicene", "Nicene", "Post-Nicene"];

function classifyFather(father: FatherProfile) {
  const era = father.era.toLowerCase();
  const name = father.name.toLowerCase();

  if (
    name.includes("ignatius") ||
    name.includes("clement") ||
    name.includes("polycarp") ||
    name.includes("didache") ||
    name.includes("barnabas") ||
    name.includes("diognetus")
  ) {
    return "Apostolic Fathers";
  }

  if (
    name.includes("irenaeus") ||
    name.includes("tertullian") ||
    name.includes("origen") ||
    name.includes("cyprian") ||
    era.includes("1st") ||
    era.includes("2nd") ||
    era.includes("100") ||
    era.includes("165") ||
    era.includes("220") ||
    era.includes("254") ||
    era.includes("258") ||
    era.includes("202")
  ) {
    return "Ante-Nicene";
  }

  if (
    name.includes("athanasius") ||
    name.includes("basil") ||
    name.includes("gregory") ||
    name.includes("cyril")
  ) {
    return "Nicene";
  }

  return "Post-Nicene";
}

function displayName(name: string) {
  if (name.startsWith("The ")) {
    return name;
  }

  if (name.includes("Didache") || name.includes("Barnabas") || name.includes("Diognetus")) {
    return name;
  }

  return `St. ${name}`;
}

function shortSummary(father: FatherProfile) {
  const firstWork = father.works[0]?.title;
  const workText = firstWork ? ` Includes ${firstWork}.` : "";

  return `${father.summary}${workText}`;
}

export default function FathersMobileLibrary({ fathers }: { fathers: FatherProfile[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleFathers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return fathers.filter((father) => {
      const category = classifyFather(father);
      const matchesFilter = activeFilter === "All" || category === activeFilter;
      const haystack = `${father.name} ${father.summary} ${father.themes.join(" ")} ${father.works
        .map((work) => work.title)
        .join(" ")}`.toLowerCase();

      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [activeFilter, fathers, query]);

  return (
    <main className="fathers-mobile mobile-app-shell lg:hidden">
      <header className="fathers-mobile__topbar">
        <Link href="/" aria-label="Back home">
          ‹
        </Link>
        <h1>Church Fathers</h1>
        <span>☦</span>
      </header>

      <label className="fathers-mobile__search">
        <span>⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Fathers, writings..."
        />
      </label>

      <div className="fathers-mobile__filters" aria-label="Father eras">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "fathers-mobile__filter--active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="fathers-mobile__list" aria-label="Church Fathers">
        {visibleFathers.map((father) => (
          <Link
            key={father.slug}
            href={`/library/fathers/${father.slug}`}
            className="fathers-mobile-card"
          >
            <div className="fathers-mobile-card__portrait" aria-hidden="true">
              <Image
                src="/assets/art/church-father-thumbnail.png"
                alt=""
                width={96}
                height={96}
                sizes="84px"
              />
            </div>
            <div>
              <h2>{displayName(father.name)}</h2>
              <p className="fathers-mobile-card__era">({father.era} AD)</p>
              <p className="fathers-mobile-card__summary">{shortSummary(father)}</p>
            </div>
            <span className="fathers-mobile-card__arrow">›</span>
          </Link>
        ))}
      </section>

      <MobileBottomNav active="Home" />
    </main>
  );
}
