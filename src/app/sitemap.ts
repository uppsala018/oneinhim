import type { MetadataRoute } from "next";
import {
  fathersLibrary,
  councilsLibrary,
  historyLibrary,
  protestantFigures,
  protestantWorks,
  protestantLibrary,
  catholicLibrary,
  romanCatechismLibrary,
  orthodoxStudyLibrary,
  orientalOrthodoxLibrary,
} from "@/lib/content";

const BASE = "https://www.oneinhimbiblestudy.com";

function url(path: string, priority = 0.7, changefreq: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency: changefreq, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    url("/", 1.0, "weekly"),
    url("/library", 0.9, "weekly"),

    // Scripture
    url("/library/kjv", 0.9),
    url("/library/catholic", 0.8),
    url("/library/orthodox/lxx", 0.8),
    url("/library/catechism", 0.8),

    // Catholic sub-pages
    url("/library/catholic/resources", 0.7),
    url("/library/catholic/theology", 0.6),
    url("/library/catholic/sacraments", 0.6),
    url("/library/catholic/saints-devotions", 0.6),
    url("/library/catholic/rosary", 0.6),
    url("/library/catholic/feast-days", 0.6),

    // Orthodox
    url("/library/orthodox", 0.8),
    url("/library/orthodox/divine-liturgy", 0.6),
    url("/library/orthodox/saints-devotions", 0.6),
    url("/library/orthodox/feast-days", 0.6),

    // Oriental Orthodox
    url("/library/oriental-orthodox", 0.7),

    // Church Fathers
    url("/library/fathers", 0.9),
    ...fathersLibrary.map((f) => url(`/library/fathers/${f.slug}`, 0.7)),
    ...fathersLibrary.flatMap((f) =>
      f.works.map((w) => url(`/library/fathers/${f.slug}/${w.slug}`, 0.6)),
    ),

    // Councils
    url("/library/councils", 0.9),
    ...councilsLibrary.map((c) => url(`/library/councils/${c.slug}`, 0.7)),

    // History
    url("/library/history", 0.9),
    url("/library/history/timeline", 0.8),
    ...historyLibrary.map((h) => url(`/library/history/${h.slug}`, 0.7)),

    // Protestant
    url("/library/protestant", 0.8),
    url("/library/protestant/figures", 0.7),
    url("/library/protestant/resources", 0.7),
    url("/library/protestant/reformation-era", 0.7),
    url("/library/protestant/texts", 0.7),
    ...protestantFigures.map((f) => url(`/library/protestant/figures/${f.slug}`, 0.6)),
    ...protestantFigures.flatMap((f) =>
      f.works.map((w) => url(`/library/protestant/figures/${f.slug}/${w.slug}`, 0.5)),
    ),
    ...protestantWorks.map((w) => url(`/library/protestant/texts/${w.slug}`, 0.5)),
    ...protestantLibrary.map((e) => url(`/library/protestant/${e.slug}`, 0.5)),

    // Catholic study entries
    ...catholicLibrary.map((e) => url(`/library/catholic/${e.slug}`, 0.5)),

    // Catechism entries
    ...romanCatechismLibrary.map((e) => url(`/library/catechism/${e.slug}`, 0.5)),

    // Orthodox study entries
    ...orthodoxStudyLibrary.map((e) => url(`/library/orthodox/${e.slug}`, 0.5)),

    // Oriental Orthodox entries
    ...orientalOrthodoxLibrary.map((e) => url(`/library/oriental-orthodox/${e.slug}`, 0.5)),

    // Community
    url("/library/prayer-forum", 0.7, "daily"),
    url("/library/notes", 0.5),

    // Other
    url("/donate", 0.5),
    url("/privacy", 0.4),
  ];
}
