import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "imports", "vendor", "kjv-source");
const outputRoot = path.join(root, "data");

function decodeHtml(input) {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#8212;/g, " - ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(text) {
  return text.replace(/\[(?:H|G)\d+\]/g, "").replace(/\s+/g, " ").trim();
}

function extractStrongs(text) {
  const strongs = [];
  const regex = /([^\[]+?)((?:\[(?:H|G)\d+\])+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const label = match[1]
      .replace(/\s+/g, " ")
      .replace(/^[^A-Za-z0-9']+/, "")
      .replace(/[^A-Za-z0-9']+$/, "")
      .trim();
    const ids = [...match[2].matchAll(/\[((?:H|G)\d+)\]/g)].map((item) => item[1]);

    for (const strongsId of ids) {
      strongs.push({
        label: label || strongsId,
        strongsId,
      });
    }
  }

  return strongs;
}

async function ensureDirectories() {
  await fs.mkdir(path.join(outputRoot, "kjv", "books"), { recursive: true });
  await fs.mkdir(path.join(outputRoot, "strongs"), { recursive: true });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function readEnglishVerses(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const regex = /"([1-3A-Za-z]{3}\|\d+\|\d+)":\s*\{\s*"en":\s*"((?:\\.|[^"\\])*)"/g;
  const verses = [];
  let match;

  while ((match = regex.exec(raw)) !== null) {
    verses.push({
      id: match[1],
      en: match[2].replace(/\\"/g, '"'),
    });
  }

  return verses;
}

async function importBooks() {
  const booksPayload = await readJson(path.join(sourceRoot, "books.json"));
  const chapterCountPayload = await readJson(
    path.join(sourceRoot, "chapter_count.json"),
  );

  const books = booksPayload.books.map((entry) => {
    const [name, code] = Object.entries(entry)[0];
    return {
      code,
      name,
      chapterCount: Number(chapterCountPayload[code]),
    };
  });

  const searchIndex = [];

  for (const book of books) {
    const sourceVerses = await readEnglishVerses(
      path.join(sourceRoot, `${book.code}.json`),
    );
    const chapters = [];

    for (let chapterNumber = 1; chapterNumber <= book.chapterCount; chapterNumber += 1) {
      const verses = sourceVerses
        .filter((item) => Number(item.id.split("|")[1]) === chapterNumber)
        .sort((a, b) => Number(a.id.split("|")[2]) - Number(b.id.split("|")[2]))
        .map((item) => {
          const verseNumber = Number(item.id.split("|")[2]);
          const taggedText = item.en;
          const text = stripTags(taggedText);
          const strongs = extractStrongs(taggedText);

          searchIndex.push({
            id: item.id,
            reference: `${book.name} ${chapterNumber}:${verseNumber}`,
            bookCode: book.code,
            book: book.name,
            chapter: chapterNumber,
            verse: verseNumber,
            text,
          });

          return {
            id: item.id,
            reference: `${book.name} ${chapterNumber}:${verseNumber}`,
            number: verseNumber,
            text,
            strongs,
          };
        });

      chapters.push({
        number: chapterNumber,
        verses,
      });
    }

    const normalizedBook = {
      work: "KJV + Strong's",
      code: book.code,
      book: book.name,
      chapterCount: book.chapterCount,
      chapters,
    };

    await fs.writeFile(
      path.join(outputRoot, "kjv", "books", `${book.code}.json`),
      `${JSON.stringify(normalizedBook)}\n`,
      "utf8",
    );
  }

  await fs.writeFile(
    path.join(outputRoot, "kjv", "books.json"),
    `${JSON.stringify(books)}\n`,
    "utf8",
  );

  await fs.writeFile(
    path.join(outputRoot, "kjv", "search-index.json"),
    `${JSON.stringify(searchIndex)}\n`,
    "utf8",
  );
}

async function importLexicon() {
  const source = await readJson(path.join(sourceRoot, "lexicon.json"));
  const normalized = {};

  for (const [id, entry] of Object.entries(source)) {
    const isGreek = id.startsWith("G");
    normalized[id] = {
      id,
      lemma: decodeHtml(
        isGreek ? entry.Gk_word || entry.transliteration : entry.Hebrew_word || entry.transliteration,
      ),
      language: isGreek ? "Greek" : "Hebrew",
      transliteration: decodeHtml(entry.transliteration || ""),
      pronunciation: decodeHtml(entry.transliteration || ""),
      definition: decodeHtml(entry.strongs_def || entry.outline_usage || ""),
      root: decodeHtml(entry.root_word || ""),
      partOfSpeech: decodeHtml(entry.part_of_speech || ""),
      usage: decodeHtml(entry.outline_usage || ""),
      occurrences: decodeHtml(entry.occurrences || ""),
    };
  }

  await fs.writeFile(
    path.join(outputRoot, "strongs", "lexicon.json"),
    `${JSON.stringify(normalized)}\n`,
    "utf8",
  );
}

async function main() {
  await ensureDirectories();
  await importBooks();
  await importLexicon();
  console.log("Imported full KJV and Strong's dataset.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
