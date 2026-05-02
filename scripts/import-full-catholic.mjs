import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "imports", "vendor", "original-douay-rheims", "bible", "raw");
const outputRoot = path.join(root, "data", "catholic");

const canon = [
  { slug: "genesis", code: "genesis", title: "Genesis", aliases: ["gen", "ge"] },
  { slug: "exodus", code: "exodus", title: "Exodus", aliases: ["exo", "ex"] },
  { slug: "leviticus", code: "leviticus", title: "Leviticus", aliases: ["lev", "lv"] },
  { slug: "numbers", code: "numbers", title: "Numbers", aliases: ["num", "nm"] },
  { slug: "deuteronomy", code: "deuteronomy", title: "Deuteronomy", aliases: ["deut", "dt"] },
  { slug: "josue", code: "josue", title: "Josue", aliases: ["joshua", "josh", "jos"] },
  { slug: "judges", code: "judges", title: "Judges", aliases: ["judg", "jdg"] },
  { slug: "ruth", code: "ruth", title: "Ruth", aliases: ["ru", "rth"] },
  { slug: "1-kings", code: "1-kings", title: "1 Kings", aliases: ["1samuel", "1sam", "1sa"] },
  { slug: "2-kings", code: "2-kings", title: "2 Kings", aliases: ["2samuel", "2sam", "2sa"] },
  { slug: "3-kings", code: "3-kings", title: "3 Kings", aliases: ["1kings", "1kgs", "1ki"] },
  { slug: "4-kings", code: "4-kings", title: "4 Kings", aliases: ["2kings", "2kgs", "2ki"] },
  {
    slug: "1-paralipomenon",
    code: "1-paralipomenon",
    title: "1 Paralipomenon",
    aliases: ["1chronicles", "1chron", "1chr"],
  },
  {
    slug: "2-paralipomenon",
    code: "2-paralipomenon",
    title: "2 Paralipomenon",
    aliases: ["2chronicles", "2chron", "2chr"],
  },
  { slug: "1-esdras", code: "1-esdras", title: "1 Esdras", aliases: ["ezra"] },
  { slug: "2-esdras", code: "2-esdras", title: "2 Esdras", aliases: ["nehemiah", "neh"] },
  { slug: "tobias", code: "tobias", title: "Tobias", aliases: ["tobit", "tob"] },
  { slug: "judith", code: "judith", title: "Judith", aliases: ["jdt"] },
  { slug: "esther", code: "esther", title: "Esther", aliases: ["est"] },
  { slug: "job", code: "job", title: "Job", aliases: [] },
  { slug: "psalms", code: "psalms", title: "Psalms", aliases: ["psalm", "ps", "psa"] },
  { slug: "proverbs", code: "proverbs", title: "Proverbs", aliases: ["prov", "prv"] },
  { slug: "ecclesiastes", code: "ecclesiastes", title: "Ecclesiastes", aliases: ["eccl", "ecc"] },
  {
    slug: "canticle-of-canticles",
    code: "canticle-of-canticles",
    title: "Canticle of Canticles",
    aliases: ["songofsongs", "songofsolomon", "canticles", "song"],
  },
  { slug: "wisdom", code: "wisdom", title: "Wisdom", aliases: ["wis"] },
  {
    slug: "ecclesiasticus",
    code: "ecclesiasticus",
    title: "Ecclesiasticus",
    aliases: ["sirach", "sir"],
  },
  { slug: "isaie", code: "isaie", title: "Isaie", aliases: ["isaiah", "isa"] },
  { slug: "jeremie", code: "jeremie", title: "Jeremie", aliases: ["jeremiah", "jer"] },
  { slug: "lamentations", code: "lamentations", title: "Lamentations", aliases: ["lam"] },
  { slug: "baruch", code: "baruch", title: "Baruch", aliases: ["bar"] },
  { slug: "ezechiel", code: "ezechiel", title: "Ezechiel", aliases: ["ezekiel", "ezek", "eze"] },
  { slug: "daniel", code: "daniel", title: "Daniel", aliases: ["dan"] },
  { slug: "osee", code: "osee", title: "Osee", aliases: ["hosea", "hos"] },
  { slug: "joel", code: "joel", title: "Joel", aliases: ["jl"] },
  { slug: "amos", code: "amos", title: "Amos", aliases: ["am"] },
  { slug: "abdias", code: "abdias", title: "Abdias", aliases: ["obadiah", "obad", "ob"] },
  { slug: "jonas", code: "jonas", title: "Jonas", aliases: ["jonah", "jon"] },
  { slug: "micheas", code: "micheas", title: "Micheas", aliases: ["micah", "mic"] },
  { slug: "nahum", code: "nahum", title: "Nahum", aliases: ["nah"] },
  { slug: "habacuc", code: "habacuc", title: "Habacuc", aliases: ["habakkuk", "hab"] },
  { slug: "sophonias", code: "sophonias", title: "Sophonias", aliases: ["zephaniah", "zep", "zeph"] },
  { slug: "aggeus", code: "aggeus", title: "Aggeus", aliases: ["haggai", "hag"] },
  { slug: "zacharias", code: "zacharias", title: "Zacharias", aliases: ["zechariah", "zech", "zec"] },
  { slug: "malachie", code: "malachie", title: "Malachie", aliases: ["malachi", "mal"] },
  { slug: "1-machabees", code: "1-machabees", title: "1 Machabees", aliases: ["1maccabees", "1macc", "1mac"] },
  { slug: "2-machabees", code: "2-machabees", title: "2 Machabees", aliases: ["2maccabees", "2macc", "2mac"] },
  { slug: "matthew", code: "matthew", title: "Matthew", aliases: ["matt", "mt"] },
  { slug: "mark", code: "mark", title: "Mark", aliases: ["mk", "mrk"] },
  { slug: "luke", code: "luke", title: "Luke", aliases: ["lk", "luk"] },
  { slug: "john", code: "john", title: "John", aliases: ["jn", "jhn"] },
  { slug: "acts", code: "acts", title: "Acts", aliases: ["act"] },
  { slug: "romans", code: "romans", title: "Romans", aliases: ["rom", "rm"] },
  { slug: "1-corinthians", code: "1-corinthians", title: "1 Corinthians", aliases: ["1corinthians", "1cor", "1co"] },
  { slug: "2-corinthians", code: "2-corinthians", title: "2 Corinthians", aliases: ["2corinthians", "2cor", "2co"] },
  { slug: "galatians", code: "galatians", title: "Galatians", aliases: ["gal"] },
  { slug: "ephesians", code: "ephesians", title: "Ephesians", aliases: ["eph"] },
  { slug: "philippians", code: "philippians", title: "Philippians", aliases: ["phil", "php"] },
  { slug: "colossians", code: "colossians", title: "Colossians", aliases: ["col"] },
  { slug: "1-thessalonians", code: "1-thessalonians", title: "1 Thessalonians", aliases: ["1thessalonians", "1thess", "1thes"] },
  { slug: "2-thessalonians", code: "2-thessalonians", title: "2 Thessalonians", aliases: ["2thessalonians", "2thess", "2thes"] },
  { slug: "1-timothy", code: "1-timothy", title: "1 Timothy", aliases: ["1timothy", "1tim", "1ti"] },
  { slug: "2-timothy", code: "2-timothy", title: "2 Timothy", aliases: ["2timothy", "2tim", "2ti"] },
  { slug: "titus", code: "titus", title: "Titus", aliases: ["tit"] },
  { slug: "philemon", code: "philemon", title: "Philemon", aliases: ["phlm", "phm"] },
  { slug: "hebrews", code: "hebrews", title: "Hebrews", aliases: ["heb"] },
  { slug: "james", code: "james", title: "James", aliases: ["jas", "jm"] },
  { slug: "1-peter", code: "1-peter", title: "1 Peter", aliases: ["1peter", "1pet", "1pe"] },
  { slug: "2-peter", code: "2-peter", title: "2 Peter", aliases: ["2peter", "2pet", "2pe"] },
  { slug: "1-john", code: "1-john", title: "1 John", aliases: ["1john", "1jn"] },
  { slug: "2-john", code: "2-john", title: "2 John", aliases: ["2john", "2jn"] },
  { slug: "3-john", code: "3-john", title: "3 John", aliases: ["3john", "3jn"] },
  { slug: "jude", code: "jude", title: "Jude", aliases: ["jud"] },
  { slug: "apocalypse", code: "apocalypse", title: "Apocalypse", aliases: ["revelation", "rev", "revelations"] },
];

function maybeRepairEncoding(value) {
  if (!/[ĂĂ‚ĂŽĂˇĂ—×]/.test(value)) {
    return value;
  }

  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");
    if (!repaired.includes("ďż˝")) {
      return repaired;
    }
  } catch {}

  return value;
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

function sanitizeText(value) {
  return maybeRepairEncoding(
    decodeEntities(value)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

async function ensureDirectories() {
  await fs.mkdir(path.join(outputRoot, "books"), { recursive: true });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function main() {
  await ensureDirectories();

  const books = [];
  const searchIndex = [];

  for (const bookMeta of canon) {
    const source = await readJson(path.join(sourceRoot, `${bookMeta.slug}.json`));
    const chapters = source.chapters.map((chapter) => {
      const verses = chapter.verses.map((verse) => {
        const verseNumber = Number(verse.verse);
        const text = sanitizeText(verse.text);
        const id = `${bookMeta.code}|${chapter.chapter}|${verseNumber}`;
        const reference = `${bookMeta.title} ${chapter.chapter}:${verseNumber}`;

        searchIndex.push({
          id,
          reference,
          bookCode: bookMeta.code,
          book: bookMeta.title,
          chapter: chapter.chapter,
          verse: verseNumber,
          text,
        });

        return {
          id,
          reference,
          number: verseNumber,
          text,
          notes: Array.isArray(verse.notes)
            ? verse.notes.map((note) => ({
                label: String(note.label ?? ""),
                text: sanitizeText(note.text ?? ""),
              }))
            : undefined,
          crossRefs: Array.isArray(verse.cross_refs)
            ? verse.cross_refs.map((item) => ({
                text: sanitizeText(item.text ?? ""),
              }))
            : undefined,
        };
      });

      return {
        number: chapter.chapter,
        summary: chapter.summary ? sanitizeText(chapter.summary) : null,
        verses,
      };
    });

    const book = {
      work: "Douay-Rheims",
      code: bookMeta.code,
      book: bookMeta.title,
      chapterCount: chapters.length,
      aliases: [bookMeta.title, source.short_title, source.book_title, bookMeta.code, bookMeta.slug, ...bookMeta.aliases]
        .filter(Boolean)
        .map((entry) => sanitizeText(String(entry))),
      chapters,
    };

    books.push({
      code: bookMeta.code,
      name: bookMeta.title,
      chapterCount: chapters.length,
      aliases: book.aliases,
    });

    await fs.writeFile(
      path.join(outputRoot, "books", `${bookMeta.code}.json`),
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

  console.log(`Imported full Catholic canon (${books.length} books).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
