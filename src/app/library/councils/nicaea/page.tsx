import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import JsonLd from "@/components/json-ld";
import NicaeaGameShell from "./components/NicaeaGameShell";
import "./nicaea.css";

export const metadata: Metadata = buildMeta({
  title: "Council of Nicaea 325 AD — Defend the Faith",
  description:
    "An interactive historical debate game. Play as Bishop Alexander and defend orthodox Christianity against Arius at the First Ecumenical Council, 325 AD. Learn what early Christians were truly up against.",
  keywords:
    "Council of Nicaea, Arianism, Ecumenical Councils, Church history game, Bible study tools, Christian apologetics game, Early church history",
  path: "/library/councils/nicaea",
  // canonical is set automatically via path above
  image: {
    url: "https://www.oneinhimbiblestudy.com/og/councils-nicaea.png",
    width: 1200,
    height: 630,
    alt: "Council of Nicaea 325 AD — Defend the Faith Against Arius | One In Him Bible Study",
  },
});

const educationalGameSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalGame",
  name: "Council of Nicaea — Defend the Faith",
  description:
    "Interactive historical debate game set at the First Ecumenical Council (325 AD). Players argue as Bishop Alexander against Arius across five theological rounds.",
  educationalLevel: "adult",
  about: "Council of Nicaea, Arianism, Early Church History",
  url: "https://www.oneinhimbiblestudy.com/library/councils/nicaea",
  provider: {
    "@type": "Organization",
    name: "One In Him Bible Study",
    url: "https://www.oneinhimbiblestudy.com",
  },
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "First Council of Nicaea",
  startDate: "0325",
  location: { "@type": "Place", name: "Nicaea, Bithynia (modern Turkey)" },
  description:
    "The First Council of Nicaea (325 AD) defined the full divinity of Christ against Arianism and produced the Nicene Creed.",
  url: "https://www.oneinhimbiblestudy.com/library/councils/nicaea",
  organizer: { "@type": "Organization", name: "One In Him Bible Study" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.oneinhimbiblestudy.com" },
    { "@type": "ListItem", position: 2, name: "Library", item: "https://www.oneinhimbiblestudy.com/library" },
    { "@type": "ListItem", position: 3, name: "Ecumenical Councils", item: "https://www.oneinhimbiblestudy.com/library/councils" },
    { "@type": "ListItem", position: 4, name: "Council of Nicaea", item: "https://www.oneinhimbiblestudy.com/library/councils/nicaea" },
  ],
};

export default function NicaeaPage() {
  return (
    <>
      <JsonLd data={educationalGameSchema} />
      <JsonLd data={eventSchema} />
      <JsonLd data={breadcrumbSchema} />
      <NicaeaGameShell />
    </>
  );
}
