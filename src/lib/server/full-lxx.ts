import fs from "node:fs/promises";
import path from "node:path";
import type { Verse } from "@/lib/content-types";

export type LxxBookMeta = {
  code: string;
  usfmId: string;
  name: string;
  shortTitle: string;
  chapterCount: number;
  canonGroup: string;
  canonStatus: "protocanonical" | "deuterocanonical" | "orthodox-expanded";
  aliases: string[];
};

type LxxBookData = {
  work: string;
  code: string;
  usfmId: string;
  book: string;
  shortTitle: string;
  chapterCount: number;
  canonGroup: string;
  canonStatus: LxxBookMeta["canonStatus"];
  aliases: string[];
  chapters: Array<{
    number: number;
    verses: Verse[];
  }>;
};

type LxxSearchHit = {
  id: string;
  reference: string;
  bookCode: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  canonGroup: string;
  canonStatus: LxxBookMeta["canonStatus"];
};

const dataRoot = path.join(process.cwd(), "data", "lxx");
let booksPromise: Promise<LxxBookMeta[]> | null = null;
let searchPromise: Promise<LxxSearchHit[]> | null = null;
const bookCache = new Map<string, Promise<LxxBookData>>();

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}

function normalizeReferenceKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export async function getLxxBookCatalog() {
  if (!booksPromise) {
    booksPromise = readJsonFile<LxxBookMeta[]>(path.join(dataRoot, "books.json"));
  }

  return booksPromise;
}

export async function getLxxBookData(bookCode: string) {
  if (!bookCache.has(bookCode)) {
    bookCache.set(
      bookCode,
      readJsonFile<LxxBookData>(path.join(dataRoot, "books", `${bookCode}.json`)),
    );
  }

  return bookCache.get(bookCode)!;
}

export async function getLxxChapterData(bookCode: string, chapterNumber: number) {
  const book = await getLxxBookData(bookCode);
  const chapter = book.chapters.find((item) => item.number === chapterNumber);

  if (!chapter) {
    return null;
  }

  return {
    work: book.work,
    code: book.code,
    usfmId: book.usfmId,
    book: book.book,
    shortTitle: book.shortTitle,
    chapterCount: book.chapterCount,
    chapter: chapter.number,
    canonGroup: book.canonGroup,
    canonStatus: book.canonStatus,
    verses: chapter.verses,
  };
}

export async function searchLxx(query: string, limit = 20) {
  if (!searchPromise) {
    searchPromise = readJsonFile<LxxSearchHit[]>(path.join(dataRoot, "search-index.json"));
  }

  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const searchIndex = await searchPromise;
  return searchIndex
    .filter((item) => {
      const haystack = `${item.reference} ${item.book} ${item.text}`.toLowerCase();
      return haystack.includes(normalized);
    })
    .slice(0, limit);
}

export async function resolveLxxReference(query: string) {
  const books = await getLxxBookCatalog();
  const normalized = query.trim().toLowerCase();
  const match = normalized.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);

  if (!match) {
    return null;
  }

  const requestedBook = normalizeReferenceKey(match[1]);
  const chapter = Number(match[2]);
  const verse = match[3] ? Number(match[3]) : 1;
  const book = books.find((item) =>
    [item.name, item.shortTitle, item.code, item.usfmId, ...item.aliases]
      .filter(Boolean)
      .map(normalizeReferenceKey)
      .includes(requestedBook),
  );

  if (!book) {
    return null;
  }

  const chapterData = await getLxxChapterData(book.code, chapter);
  const verseData = chapterData?.verses.find((item) => item.number === verse);

  if (!chapterData || !verseData) {
    return null;
  }

  return {
    ...verseData,
    bookCode: book.code,
    book: book.name,
    chapter,
    verse,
    chapterReference: `${book.name} ${chapter}`,
    matchedQuery: query,
  };
}
