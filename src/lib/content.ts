import catholicLibraryJson from "@/content/catholic-library.json";
import councilsLibraryJson from "@/content/councils-library.json";
import fathersLibraryJson from "@/content/fathers-library.json";
import historyLibraryJson from "@/content/history-library.json";
import kjvChapterJson from "@/content/kjv/genesis-1.json";
import orientalOrthodoxLibraryJson from "@/content/oriental-orthodox-library.json";
import orthodoxDivineLiturgyJson from "@/content/orthodox-divine-liturgy.json";
import orthodoxStudyJson from "@/content/orthodox-study.json";
import protestantFiguresJson from "@/content/protestant-figures.json";
import protestantLibraryJson from "@/content/protestant-library.json";
import protestantWorksJson from "@/content/protestant-works.json";
import romanCatechismLibraryJson from "@/content/roman-catechism-library.json";
import strongsJson from "@/content/strongs.json";
import type {
  ArticleCard,
  CatholicReading,
  CatholicStudyEntry,
  CatechismEntry,
  CouncilTopic,
  DivineLiturgyGuide,
  FatherProfile,
  OrientalOrthodoxEntry,
  OrthodoxStudyEntry,
  ProtestantEntry,
  ProtestantFigure,
  ProtestantWork,
  StudyTradition,
  HistoryTopic,
  LexiconEntry,
  ScriptureChapter,
  SearchResult,
} from "@/lib/content-types";

export const kjvChapter = kjvChapterJson as ScriptureChapter;
export const catholicLibrary = catholicLibraryJson as CatholicStudyEntry[];
export const catholicReading = catholicLibrary[0] as CatholicReading;
export const catholicTopics: ArticleCard[] = catholicLibrary.map((entry) => ({
  id: entry.slug,
  title: entry.title,
  summary: entry.summary,
  era: entry.translation,
}));
export const romanCatechismLibrary = romanCatechismLibraryJson as CatechismEntry[];
export const catechismTopics: ArticleCard[] = romanCatechismLibrary.map((entry) => ({
  id: entry.slug,
  title: entry.title,
  summary: entry.summary,
  era: entry.part,
}));
export const fathersLibrary = fathersLibraryJson as FatherProfile[];
export const fathers: ArticleCard[] = fathersLibrary.map((father) => ({
  id: father.slug,
  title: father.name,
  summary: father.summary,
  era: father.era,
}));
export const historyLibrary = historyLibraryJson as HistoryTopic[];
export const historyTopics: ArticleCard[] = historyLibrary.map((topic) => ({
  id: topic.slug,
  title: topic.title,
  summary: topic.summary,
  era: topic.era,
}));
export const councilsLibrary = councilsLibraryJson as CouncilTopic[];
export const councilTopics: ArticleCard[] = councilsLibrary.map((council) => ({
  id: council.slug,
  title: council.title,
  summary: council.summary,
  era: council.year,
}));
export const orientalOrthodoxLibrary =
  orientalOrthodoxLibraryJson as OrientalOrthodoxEntry[];
export const orientalOrthodoxTopics: ArticleCard[] = orientalOrthodoxLibrary.map((entry) => ({
  id: entry.slug,
  title: entry.title,
  summary: entry.summary,
  era: entry.author,
}));
export const orthodoxStudyLibrary = orthodoxStudyJson as OrthodoxStudyEntry[];
export const orthodoxStudyTopics: ArticleCard[] = orthodoxStudyLibrary.map((entry) => ({
  id: entry.slug,
  title: entry.title,
  summary: entry.summary,
  era: entry.category,
}));
export const orthodoxDivineLiturgyGuide =
  orthodoxDivineLiturgyJson as DivineLiturgyGuide;
export const protestantLibrary = protestantLibraryJson as ProtestantEntry[];
export const protestantTopics: ArticleCard[] = protestantLibrary.map((entry) => ({
  id: entry.slug,
  title: entry.title,
  summary: entry.summary,
  era: entry.era,
}));
export const protestantWorks = protestantWorksJson as ProtestantWork[];
export const protestantWorkCards: ArticleCard[] = protestantWorks.map((entry) => ({
  id: entry.slug,
  title: entry.title,
  summary: entry.summary,
  era: entry.tradition,
}));
export const protestantFigures = protestantFiguresJson as ProtestantFigure[];
export const protestantFigureCards: ArticleCard[] = protestantFigures.map((entry) => ({
  id: entry.slug,
  title: entry.name,
  summary: entry.summary,
  era: entry.tradition,
}));
export const strongsLexicon = strongsJson as Record<string, LexiconEntry>;

export function getKjvVerse(verseId: string) {
  return kjvChapter.verses.find((verse) => verse.id === verseId) ?? kjvChapter.verses[0];
}

export function getCatholicVerse(verseId: string) {
  return (
    catholicReading.verses.find((verse) => verse.id === verseId) ??
    catholicReading.verses[0]
  );
}

export function getCatholicStudyEntry(slug: string) {
  return catholicLibrary.find((entry) => entry.slug === slug) ?? null;
}

export function getCatechismEntry(slug: string) {
  return romanCatechismLibrary.find((entry) => entry.slug === slug) ?? null;
}

export function getFatherProfile(slug: string) {
  return fathersLibrary.find((father) => father.slug === slug) ?? null;
}

export function getFatherWork(profileSlug: string, workSlug: string) {
  const father = getFatherProfile(profileSlug);

  if (!father) {
    return null;
  }

  return father.works.find((work) => work.slug === workSlug) ?? null;
}

export function getFathersForTrack(track: StudyTradition) {
  return fathersLibrary.filter((father) => father.studyTracks.includes(track));
}

export function getOrientalOrthodoxEntry(slug: string) {
  return orientalOrthodoxLibrary.find((entry) => entry.slug === slug) ?? null;
}

export function getOrthodoxStudyEntry(slug: string) {
  return orthodoxStudyLibrary.find((entry) => entry.slug === slug) ?? null;
}

export function getProtestantEntry(slug: string) {
  return protestantLibrary.find((entry) => entry.slug === slug) ?? null;
}

export function getProtestantWork(slug: string) {
  return protestantWorks.find((entry) => entry.slug === slug) ?? null;
}

export function getProtestantFigure(slug: string) {
  return protestantFigures.find((entry) => entry.slug === slug) ?? null;
}

export function getProtestantFigureWork(figureSlug: string, workSlug: string) {
  const figure = getProtestantFigure(figureSlug);

  if (!figure) {
    return null;
  }

  return figure.works.find((work) => work.slug === workSlug) ?? null;
}

export function getHistoryTopic(slug: string) {
  return historyLibrary.find((topic) => topic.slug === slug) ?? null;
}

export function getCouncilTopic(slug: string) {
  return councilsLibrary.find((council) => council.slug === slug) ?? null;
}

export const searchIndex: SearchResult[] = [
  ...kjvChapter.verses.map((verse) => ({
    id: verse.id,
    title: verse.reference,
    detail: verse.text,
    target: { kind: "kjv-verse", verseId: verse.id } as const,
  })),
  ...Object.values(strongsLexicon).map((entry) => ({
    id: entry.id,
    title: `${entry.id} ${entry.transliteration}`,
    detail: entry.definition,
    target: { kind: "strongs", strongsId: entry.id } as const,
  })),
  ...catholicLibrary.flatMap((entry) =>
    entry.verses.map((verse) => ({
      id: verse.id,
      title: verse.reference,
      detail: `${verse.text} (${entry.title})`,
      target: { kind: "catholic-verse", verseId: verse.id } as const,
    })),
  ),
  ...romanCatechismLibrary.map((entry) => ({
    id: entry.slug,
    title: entry.title,
    detail: `${entry.summary} (${entry.part})`,
    target: { kind: "catechism", slug: entry.slug } as const,
  })),
  ...fathers.map((card) => ({
    id: card.id,
    title: card.title,
    detail: card.summary,
    target: { kind: "father", cardId: card.id } as const,
  })),
  ...historyTopics.map((card) => ({
    id: card.id,
    title: card.title,
    detail: card.summary,
    target: { kind: "history", cardId: card.id } as const,
  })),
];
