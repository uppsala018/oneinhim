import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "imports", "vendor", "brenton-lxx", "usfm");
const outputRoot = path.join(root, "data", "lxx");

const skipIds = new Set(["FRT", "INT", "BAK", "OTH", "XXA", "XXB", "XXC"]);
const deuterocanonicalIds = new Set([
  "TOB",
  "JDT",
  "ESG",
  "WIS",
  "SIR",
  "BAR",
  "LJE",
  "SUS",
  "BEL",
  "1MA",
  "2MA",
  "1ES",
  "MAN",
  "3MA",
  "4MA",
]);
const orthodoxExpandedIds = new Set(["DAG"]);

const groupById = {
  GEN: "Pentateuch",
  EXO: "Pentateuch",
  LEV: "Pentateuch",
  NUM: "Pentateuch",
  DEU: "Pentateuch",
  JOS: "Historical Books",
  JDG: "Historical Books",
  RUT: "Historical Books",
  "1SA": "Historical Books",
  "2SA": "Historical Books",
  "1KI": "Historical Books",
  "2KI": "Historical Books",
  "1CH": "Historical Books",
  "2CH": "Historical Books",
  EZR: "Historical Books",
  NEH: "Historical Books",
  JOB: "Wisdom And Poetry",
  PSA: "Wisdom And Poetry",
  PRO: "Wisdom And Poetry",
  ECC: "Wisdom And Poetry",
  SNG: "Wisdom And Poetry",
  ISA: "Major Prophets",
  JER: "Major Prophets",
  LAM: "Major Prophets",
  EZK: "Major Prophets",
  HOS: "Minor Prophets",
  JOL: "Minor Prophets",
  AMO: "Minor Prophets",
  OBA: "Minor Prophets",
  JON: "Minor Prophets",
  MIC: "Minor Prophets",
  NAM: "Minor Prophets",
  HAB: "Minor Prophets",
  ZEP: "Minor Prophets",
  HAG: "Minor Prophets",
  ZEC: "Minor Prophets",
  MAL: "Minor Prophets",
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#8212;/g, " - ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripUsfm(value) {
  return decodeEntities(value)
    .replace(/\\f\s+.*?\\f\*/g, "")
    .replace(/\\x\s+.*?\\x\*/g, "")
    .replace(/\\\+?[a-z0-9]+\*/gi, "")
    .replace(/\\[a-z0-9]+\s?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeReferenceKey(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

async function ensureDirectories() {
  await fs.mkdir(path.join(outputRoot, "books"), { recursive: true });
}

function parseMetadata(raw, fallbackId) {
  const id = raw.match(/^\\id\s+([A-Z0-9]+)/m)?.[1] ?? fallbackId;
  const toc1 = raw.match(/^\\toc1\s+(.+)$/m)?.[1]?.trim();
  const toc2 = raw.match(/^\\toc2\s+(.+)$/m)?.[1]?.trim();
  const heading = raw.match(/^\\h\s+(.+)$/m)?.[1]?.trim();
  const title = stripUsfm(toc1 || toc2 || heading || id);
  const shortTitle = stripUsfm(raw.match(/^\\toc3\s+(.+)$/m)?.[1]?.trim() || title);

  return { id, title, shortTitle };
}

function parseChapters(raw, bookCode, bookTitle) {
  const chapters = [];
  let currentChapter = null;
  let currentVerse = null;

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const chapterMatch = line.match(/^\\c\s+(\d+)/);
    if (chapterMatch) {
      currentChapter = {
        number: Number(chapterMatch[1]),
        verses: [],
      };
      chapters.push(currentChapter);
      currentVerse = null;
      continue;
    }

    const verseMatch = line.match(/^\\v\s+([0-9]+[a-z]?)\s*(.*)$/i);
    if (verseMatch && currentChapter) {
      const numberLabel = verseMatch[1];
      const number = Number.parseInt(numberLabel, 10);
      const text = stripUsfm(verseMatch[2]);

      currentVerse = {
        id: `${bookCode}|${currentChapter.number}|${numberLabel}`,
        reference: `${bookTitle} ${currentChapter.number}:${numberLabel}`,
        number,
        label: numberLabel,
        text,
      };
      currentChapter.verses.push(currentVerse);
      continue;
    }

    if (currentVerse && !line.startsWith("\\")) {
      currentVerse.text = `${currentVerse.text} ${stripUsfm(line)}`.trim();
    }
  }

  return chapters
    .map((chapter) => ({
      ...chapter,
      verses: chapter.verses.filter((verse) => verse.text),
    }))
    .filter((chapter) => chapter.verses.length);
}

function aliasesFor(meta, code) {
  const aliases = new Set([meta.title, meta.shortTitle, meta.id, code]);
  const normalizedTitle = normalizeReferenceKey(meta.title);

  aliases.add(normalizedTitle);
  if (meta.title === "Psalms") {
    aliases.add("psalm");
    aliases.add("ps");
    aliases.add("psa");
  }
  if (meta.title === "Song of Songs") {
    aliases.add("song");
    aliases.add("songofsolomon");
    aliases.add("canticles");
  }
  if (meta.id === "DAG") {
    aliases.add("daniel");
    aliases.add("dan");
    aliases.add("greekdaniel");
  }
  if (meta.id === "LJE") {
    aliases.add("letterofjeremiah");
    aliases.add("epistleofjeremy");
  }

  return [...aliases].filter(Boolean);
}

async function main() {
  await ensureDirectories();
  const files = (await fs.readdir(sourceRoot))
    .filter((file) => file.endsWith(".usfm"))
    .sort((a, b) => Number(a.split("-")[0]) - Number(b.split("-")[0]));

  const books = [];
  const searchIndex = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(sourceRoot, file), "utf8");
    const fallbackId = file.match(/-([A-Z0-9]+)eng-Brenton/)?.[1] ?? file;
    const meta = parseMetadata(raw, fallbackId);

    if (skipIds.has(meta.id)) {
      continue;
    }

    const code = slugify(meta.title);
    const chapters = parseChapters(raw, code, meta.title);

    if (!chapters.length) {
      continue;
    }

    const canonGroup =
      groupById[meta.id] ??
      (deuterocanonicalIds.has(meta.id) ? "Deuterocanonical And Orthodox Books" : "Septuagint Books");
    const canonStatus = deuterocanonicalIds.has(meta.id)
      ? "deuterocanonical"
      : orthodoxExpandedIds.has(meta.id)
        ? "orthodox-expanded"
        : "protocanonical";

    for (const chapter of chapters) {
      for (const verse of chapter.verses) {
        searchIndex.push({
          id: verse.id,
          reference: verse.reference,
          bookCode: code,
          book: meta.title,
          chapter: chapter.number,
          verse: verse.number,
          text: verse.text,
          canonGroup,
          canonStatus,
        });
      }
    }

    const book = {
      work: "Brenton Septuagint",
      code,
      usfmId: meta.id,
      book: meta.title,
      shortTitle: meta.shortTitle,
      chapterCount: chapters.length,
      canonGroup,
      canonStatus,
      aliases: aliasesFor(meta, code),
      chapters,
    };

    books.push({
      code,
      usfmId: meta.id,
      name: meta.title,
      shortTitle: meta.shortTitle,
      chapterCount: chapters.length,
      canonGroup,
      canonStatus,
      aliases: book.aliases,
    });

    await fs.writeFile(
      path.join(outputRoot, "books", `${code}.json`),
      `${JSON.stringify(book)}\n`,
      "utf8",
    );
  }

  await fs.writeFile(
    path.join(outputRoot, "books.json"),
    `${JSON.stringify(books)}\n`,
    "utf8",
  );
  await fs.writeFile(
    path.join(outputRoot, "search-index.json"),
    `${JSON.stringify(searchIndex)}\n`,
    "utf8",
  );

  console.log(`Imported Brenton Septuagint (${books.length} books).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
