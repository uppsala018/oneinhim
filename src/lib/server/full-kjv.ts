import fs from "node:fs/promises";
import path from "node:path";
import type { LexiconEntry, Verse } from "@/lib/content-types";

type BookMeta = {
  code: string;
  name: string;
  chapterCount: number;
};

type ChapterData = {
  work: string;
  code: string;
  book: string;
  chapterCount: number;
  chapter: number;
  verses: Verse[];
};

type BookData = {
  work: string;
  code: string;
  book: string;
  chapterCount: number;
  chapters: Array<{
    number: number;
    verses: Verse[];
  }>;
};

type SearchHit = {
  id: string;
  reference: string;
  bookCode: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

type ResolvedReference = SearchHit & {
  chapterReference: string;
  matchedQuery: string;
};

const dataRoot = path.join(process.cwd(), "data");
let booksPromise: Promise<BookMeta[]> | null = null;
let searchPromise: Promise<SearchHit[]> | null = null;
let lexiconPromise: Promise<Record<string, LexiconEntry>> | null = null;
const bookCache = new Map<string, Promise<BookData>>();

function decodeEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#8212;/g, " - ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"');
}

function stripMarkup(value: string) {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function maybeRepairEncoding(value: string) {
  if (!/[ÃÂÎá×]/.test(value)) {
    return value;
  }

  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");

    if (repaired.includes("�")) {
      return value;
    }

    if (/[\u0370-\u03ff\u0590-\u05ff]/.test(repaired) || /[āēīōū]/i.test(repaired)) {
      return repaired;
    }
  } catch {
    return value;
  }

  return value;
}

function sanitizeText(value: string) {
  return maybeRepairEncoding(stripMarkup(value));
}

function normalizeReferenceKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function createBookAliases(book: BookMeta) {
  const aliases = new Set<string>();
  const normalizedName = normalizeReferenceKey(book.name);
  const normalizedCode = normalizeReferenceKey(book.code);
  aliases.add(normalizedName);
  aliases.add(normalizedCode);

  if (book.name === "Psalms") {
    aliases.add("psalm");
    aliases.add("psalms");
    aliases.add("ps");
    aliases.add("psa");
  }

  if (book.name === "Song of Songs") {
    aliases.add("songofsolomon");
    aliases.add("song");
    aliases.add("sos");
    aliases.add("songofsongs");
  }

  if (book.name === "Revelation") {
    aliases.add("revelations");
    aliases.add("rev");
  }

  if (/^\d/.test(book.name)) {
    const compact = normalizedName;
    aliases.add(compact);

    const spaced = book.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
    aliases.add(spaced);
  }

  return aliases;
}

function sanitizeVerse(verse: Verse): Verse {
  return {
    ...verse,
    text: stripMarkup(verse.text),
    strongs: verse.strongs?.map((word) => ({
      ...word,
      label: stripMarkup(word.label),
    })),
  };
}

function sanitizeLexiconEntry(entry: LexiconEntry): LexiconEntry {
  return {
    ...entry,
    lemma: sanitizeText(entry.lemma),
    transliteration: sanitizeText(entry.transliteration),
    pronunciation: sanitizeText(entry.pronunciation),
    definition: sanitizeText(entry.definition),
    root: sanitizeText(entry.root),
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}

export async function getBookCatalog() {
  if (!booksPromise) {
    booksPromise = readJsonFile<BookMeta[]>(path.join(dataRoot, "kjv", "books.json"));
  }

  return booksPromise;
}

export async function getBookData(bookCode: string) {
  if (!bookCache.has(bookCode)) {
    bookCache.set(
      bookCode,
      readJsonFile<BookData>(path.join(dataRoot, "kjv", "books", `${bookCode}.json`)),
    );
  }

  return bookCache.get(bookCode)!;
}

export async function getChapterData(bookCode: string, chapterNumber: number) {
  const book = await getBookData(bookCode);
  const chapter = book.chapters.find((item) => item.number === chapterNumber);

  if (!chapter) {
    return null;
  }

  return {
    work: book.work,
    code: book.code,
    book: book.book,
    chapterCount: book.chapterCount,
    chapter: chapter.number,
    verses: chapter.verses.map(sanitizeVerse),
  } satisfies ChapterData;
}

export async function searchBible(query: string, limit = 20) {
  if (!searchPromise) {
    searchPromise = readJsonFile<SearchHit[]>(
      path.join(dataRoot, "kjv", "search-index.json"),
    );
  }

  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const searchIndex = await searchPromise;
  return searchIndex
    .filter((item) => {
      const haystack = `${item.reference} ${item.text}`.toLowerCase();
      return haystack.includes(normalized);
    })
    .map((item) => ({
      ...item,
      text: stripMarkup(item.text),
    }))
    .slice(0, limit);
}

export async function resolveReference(query: string): Promise<ResolvedReference | null> {
  const trimmed = query.trim();
  const match = trimmed.match(/^(.+?)\s+(\d+)(?::(\d+))?$/i);

  if (!match) {
    return null;
  }

  const [, rawBook, rawChapter, rawVerse] = match;
  const chapterNumber = Number(rawChapter);
  const verseNumber = rawVerse ? Number(rawVerse) : null;

  if (!Number.isFinite(chapterNumber) || (verseNumber !== null && !Number.isFinite(verseNumber))) {
    return null;
  }

  const books = await getBookCatalog();
  const requestedBook = normalizeReferenceKey(rawBook);
  const matchedBook = books.find((book) => createBookAliases(book).has(requestedBook));

  if (!matchedBook) {
    return null;
  }

  const chapter = await getChapterData(matchedBook.code, chapterNumber);

  if (!chapter) {
    return null;
  }

  const verse =
    verseNumber === null
      ? chapter.verses[0]
      : chapter.verses.find((item) => item.number === verseNumber);

  if (!verse) {
    return null;
  }

  return {
    id: verse.id,
    reference: verse.reference,
    chapterReference: `${chapter.book} ${chapter.chapter}`,
    matchedQuery: trimmed,
    bookCode: matchedBook.code,
    book: chapter.book,
    chapter: chapter.chapter,
    verse: verse.number,
    text: verse.text,
  };
}

export async function getLexiconEntry(id: string) {
  if (!lexiconPromise) {
    lexiconPromise = readJsonFile<Record<string, LexiconEntry>>(
      path.join(dataRoot, "strongs", "lexicon.json"),
    );
  }

  const lexicon = await lexiconPromise;
  const entry = lexicon[id];

  if (!entry) {
    return null;
  }

  return sanitizeLexiconEntry(entry);
}
