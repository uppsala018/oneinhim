export type StrongWord = {
  label: string;
  strongsId: string;
};

export type VerseNote = {
  label?: string;
  text: string;
};

export type VerseCrossReference = {
  text: string;
};

export type Verse = {
  id: string;
  reference: string;
  number: number;
  text: string;
  strongs?: StrongWord[];
  notes?: VerseNote[];
  crossRefs?: VerseCrossReference[];
  summary?: string | null;
};

export type LexiconEntry = {
  id: string;
  lemma: string;
  language: "Hebrew" | "Greek";
  transliteration: string;
  pronunciation: string;
  definition: string;
  root: string;
};

export type CrossReference = {
  reference: string;
  note: string;
};

export type ScriptureChapter = {
  work: string;
  book: string;
  chapter: number;
  verses: Verse[];
};

export type CatholicReading = ScriptureChapter & {
  translation: string;
  catechismTitle: string;
  catechismExcerpt: string;
  catechismReference: string;
  crossReferences: CrossReference[];
};

export type CatholicStudyEntry = CatholicReading & {
  slug: string;
  title: string;
  focus: string;
  source: string;
  summary: string;
};

export type CatechismSection = {
  id: string;
  title?: string;
  paragraphs: string[];
};

export type CatechismEntry = {
  slug: string;
  part: string;
  order: number;
  title: string;
  source: string;
  summary: string;
  sections: CatechismSection[];
};

export type ArticleCard = {
  id: string;
  title: string;
  summary: string;
  era: string;
};

export type StudyTradition = "catholic" | "orthodox" | "protestant";

export type FatherStream = "shared" | "catholic" | "orthodox";

export type FatherSection = {
  id: string;
  title: string;
  citation?: string | null;
  paragraphs: string[];
};

export type FatherWork = {
  slug: string;
  title: string;
  source: string;
  sourceUrl?: string;
  yearLabel: string;
  summary: string;
  sections: FatherSection[];
  stats: {
    sectionCount: number;
    paragraphCount: number;
  };
};

export type FatherProfile = {
  slug: string;
  name: string;
  era: string;
  region: string;
  tradition: string;
  stream: FatherStream;
  studyTracks: StudyTradition[];
  summary: string;
  bio: string;
  themes: string[];
  works: FatherWork[];
};

export type OrientalOrthodoxSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type OrientalOrthodoxEntry = {
  slug: string;
  title: string;
  author: string;
  era: string;
  tradition: string;
  summary: string;
  source: string;
  sourceUrl: string;
  sections: OrientalOrthodoxSection[];
};

export type OrthodoxStudySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type OrthodoxStudyEntry = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  source: string;
  sections: OrthodoxStudySection[];
  links?: Array<{
    label: string;
    href: string;
  }>;
};

export type DivineLiturgyStep = {
  id: string;
  phase: string;
  title: string;
  liturgicalAction: string;
  meaning: string;
  studyPrompt: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

export type DivineLiturgyGuide = {
  title: string;
  subtitle: string;
  source: string;
  summary: string;
  steps: DivineLiturgyStep[];
};

export type ProtestantSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ProtestantEntry = {
  slug: string;
  title: string;
  era: string;
  summary: string;
  focus: string;
  source: string;
  sections: ProtestantSection[];
  links?: Array<{
    label: string;
    href: string;
  }>;
};

export type ProtestantWorkSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ProtestantWork = {
  slug: string;
  title: string;
  tradition: string;
  yearLabel: string;
  category: string;
  summary: string;
  source: string;
  sourceUrl: string;
  sections: ProtestantWorkSection[];
};

export type ProtestantFigureSection = {
  id: string;
  title: string;
  citation?: string | null;
  paragraphs: string[];
};

export type ProtestantFigureWork = {
  slug: string;
  title: string;
  shortTitle: string;
  yearLabel: string;
  source: string;
  sourceUrl: string;
  summary: string;
  sections: ProtestantFigureSection[];
  stats: {
    sectionCount: number;
    paragraphCount: number;
  };
};

export type ProtestantFigure = {
  slug: string;
  name: string;
  era: string;
  region: string;
  tradition: string;
  summary: string;
  bio: string;
  themes: string[];
  works: ProtestantFigureWork[];
};

export type HistorySection = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
};

export type HistoryTopic = {
  slug: string;
  title: string;
  era: string;
  summary: string;
  overview: string;
  significance: string;
  sections: HistorySection[];
  relatedTopics: string[];
  links?: Array<{
    label: string;
    href: string;
  }>;
};

export type CouncilTopic = {
  slug: string;
  order: number;
  title: string;
  shortTitle: string;
  year: string;
  location: string;
  calledBy: string;
  attendance: string;
  issue: string;
  summary: string;
  outcome: string;
  whyItMatters: string;
  teachingText: {
    title: string;
    paragraphs: string[];
  };
  controversy: {
    title: string;
    paragraphs: string[];
  };
  reception: Array<{
    tradition: string;
    note: string;
  }>;
  keyTerms: Array<{
    term: string;
    definition: string;
  }>;
  studyPath: Array<{
    title: string;
    detail: string;
  }>;
  scriptureConnections: string[];
  relatedLinks: Array<{
    label: string;
    href: string;
  }>;
};

export type SearchResult = {
  id: string;
  title: string;
  detail: string;
  target:
    | { kind: "kjv-verse"; verseId: string }
    | { kind: "catholic-verse"; verseId: string }
    | { kind: "catechism"; slug: string }
    | { kind: "strongs"; strongsId: string }
    | { kind: "father"; cardId: string }
    | { kind: "history"; cardId: string };
};
