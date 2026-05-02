import fs from "node:fs/promises";
import path from "node:path";
import type { Verse } from "@/lib/content-types";

type BookMeta = {
  code: string;
  name: string;
  chapterCount: number;
  aliases?: string[];
};

type ChapterData = {
  work: string;
  code: string;
  book: string;
  chapterCount: number;
  chapter: number;
  summary: string | null;
  verses: Verse[];
};

type BookData = {
  work: string;
  code: string;
  book: string;
  chapterCount: number;
  aliases?: string[];
  chapters: Array<{
    number: number;
    summary: string | null;
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

function maybeRepairEncoding(value: string) {
  if (!/[ĂĂ‚ĂŽĂˡĂ—×]/.test(value)) {
    return value;
  }

  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");
    if (!repaired.includes("ďż˝")) {
      return repaired;
    }
  } catch {
    return value;
  }

  return value;
}

function sanitizeText(value: string) {
  return maybeRepairEncoding(
    decodeEntities(value)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function normalizeReferenceKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function createBookAliases(book: BookMeta) {
  const aliases = new Set<string>();
  aliases.add(normalizeReferenceKey(book.name));
  aliases.add(normalizeReferenceKey(book.code));

  for (const alias of book.aliases ?? []) {
    aliases.add(normalizeReferenceKey(alias));
  }

  if (book.name === "Psalms") {
    aliases.add("psalm");
    aliases.add("psalms");
    aliases.add("ps");
    aliases.add("psa");
  }

  if (book.name === "Canticle of Canticles") {
    aliases.add("songofsongs");
    aliases.add("songofsolomon");
    aliases.add("canticles");
    aliases.add("song");
  }

  if (book.name === "Apocalypse") {
    aliases.add("revelation");
    aliases.add("revelations");
    aliases.add("rev");
  }

  return aliases;
}

function sanitizeVerse(verse: Verse): Verse {
  return {
    ...verse,
    text: sanitizeText(verse.text),
    notes: verse.notes?.map((note) => ({
      label: note.label ? sanitizeText(note.label) : undefined,
      text: sanitizeText(note.text),
    })),
    crossRefs: verse.crossRefs?.map((item) => ({
      text: sanitizeText(item.text),
    })),
    summary: verse.summary ? sanitizeText(verse.summary) : verse.summary,
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}

export async function getCatholicBookCatalog() {
  if (!booksPromise) {
    booksPromise = readJsonFile<BookMeta[]>(path.join(dataRoot, "catholic", "books.json"));
  }

  return booksPromise;
}

export async function getCatholicBookData(bookCode: string) {
  if (!bookCache.has(bookCode)) {
    bookCache.set(
      bookCode,
      readJsonFile<BookData>(path.join(dataRoot, "catholic", "books", `${bookCode}.json`)),
    );
  }

  return bookCache.get(bookCode)!;
}

export async function getCatholicChapterData(bookCode: string, chapterNumber: number) {
  const book = await getCatholicBookData(bookCode);
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
    summary: chapter.summary,
    verses: chapter.verses.map(sanitizeVerse),
  } satisfies ChapterData;
}

export async function searchCatholicBible(query: string, limit = 20) {
  if (!searchPromise) {
    searchPromise = readJsonFile<SearchHit[]>(
      path.join(dataRoot, "catholic", "search-index.json"),
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
    .slice(0, limit);
}

export async function resolveCatholicReference(query: string): Promise<ResolvedReference | null> {
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

  const books = await getCatholicBookCatalog();
  const requestedBook = normalizeReferenceKey(rawBook);
  const matchedBook = books.find((book) => createBookAliases(book).has(requestedBook));

  if (!matchedBook) {
    return null;
  }

  const chapter = await getCatholicChapterData(matchedBook.code, chapterNumber);

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
