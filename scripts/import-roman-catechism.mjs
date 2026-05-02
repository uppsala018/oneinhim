import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputPath = path.join(root, "src", "content", "roman-catechism-library.json");

const entries = [
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 1", 'Article I. "I Believe in God, the Father Almighty, Maker of Heaven and Earth."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 2", 'Article II. "And in Jesus Christ, His Only Son, Our Lord."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 3", 'Article III. "Who Was Conceived of the Holy Ghost, Born of the Virgin Mary."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 4", 'Article IV. "Suffered Under Pontius Pilate, Was Crucified, Dead, and Buried."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 5", 'Article V. "He Descended Into Hell, the Third Day He Arose Again From the Dead."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 6", 'Article VI. "He Ascended Into Heaven, Sitteth at the Right Hand of God the Father Almighty."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 7", 'Article VII. "From Thence He Shall Come To Judge the Living and the Dead."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 8", 'Article VIII. "I Believe in the Holy Ghost."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 9", 'Article IX. "I Believe the Holy Catholic Church."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 10", 'Article X. "The Forgiveness of Sins."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 11", 'Article XI. "The Resurrection of the Body."'],
  ["Part I. On the Twelve Articles of the Creed", "Part 1: Article 12", 'Article XII. "Life Everlasting."'],
  ["Part II. On the Sacraments", "Part 2: Baptism", "On Baptism"],
  ["Part II. On the Sacraments", "Part 2: Confirmation", "On Confirmation"],
  ["Part II. On the Sacraments", "Part 2: The Holy Eucharist", "On the Holy Eucharist"],
  ["Part II. On the Sacraments", "Part 2: Penance", "On Penance"],
  ["Part II. On the Sacraments", "Part 2: Extreme Unction", "On Extreme Unction"],
  ["Part II. On the Sacraments", "Part 2: Holy Orders", "On Holy Orders"],
  ["Part II. On the Sacraments", "Part 2: Holy Matrimony", "On Holy Matrimony"],
  ["Part III. On the Decalogue", "Part 3: The First Commandment", "The First Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Second Commandment", "The Second Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Third Commandment", "The Third Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Fourth Commandment", "The Fourth Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Fifth Commandment", "The Fifth Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Sixth Commandment", "The Sixth Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Seventh Commandment", "The Seventh Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Eighth Commandment", "The Eighth Commandment"],
  ["Part III. On the Decalogue", "Part 3: The Ninth and Tenth Commandment", "The Ninth and Tenth Commandment"],
  ["Part IV. On Prayer", "Part 4: Our Father who art in heaven", "Our Father who art in heaven"],
  ["Part IV. On Prayer", "Part 4: Hallowed be Thy Name", "Hallowed be Thy Name"],
  ["Part IV. On Prayer", "Part 4: Thy Kingdom Come", "Thy Kingdom Come"],
  ["Part IV. On Prayer", "Part 4: Thy will be done on earth as it is in heaven", "Thy will be done on earth as it is in heaven"],
  ["Part IV. On Prayer", "Part 4: Give us this day our daily bread", "Give us this day our daily bread"],
  ["Part IV. On Prayer", "Part 4: Forgive our trespasses as we forgive those who trespass against us", "Forgive our trespasses as we forgive those who trespass against us"],
  ["Part IV. On Prayer", "Part 4: And lead us not into temption", "And lead us not into temptation"],
  ["Part IV. On Prayer", "Part 4: But deliver us from evil", "But deliver us from evil"],
  ["Part IV. On Prayer", "Part 4: Amen", "Amen"],
  ["Appendix", "Praxis Catechismi", "Praxis Catechismi"],
];

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function maybeRepairEncoding(value) {
  if (!/[â€™â€œâ€]/.test(value)) {
    return value;
  }

  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");
    if (!repaired.includes("�")) {
      return repaired;
    }
  } catch {}

  return value;
}

function decodeHtml(value) {
  return maybeRepairEncoding(value)
    .replace(/&#160;|&nbsp;/g, " ")
    .replace(/&#91;/g, "[")
    .replace(/&#93;/g, "]")
    .replace(/&#32;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(value) {
  return maybeRepairEncoding(decodeHtml(
    value
      .replace(/<sup[^>]*>.*?<\/sup>/gis, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<link[^>]*>/gi, "")
      .replace(/<span class="pagenum[\s\S]*?<\/span><\/span>/gi, " ")
      .replace(/<div class="__nop wst-nop"><\/div>/gi, " ")
      .replace(/<\/?(?:div|span|p|i|b|small|br|hr)[^>]*>/gi, " ")
      .replace(/<a [^>]*>(.*?)<\/a>/gi, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  ));
}

function extractReferenceMap(html) {
  const map = new Map();
  const refRegex = /<li id="cite&#95;note-(\d+)"[\s\S]*?<span class="reference-text">(.*?)<\/span>[\s\S]*?<\/li>/gi;
  let match;

  while ((match = refRegex.exec(html)) !== null) {
    map.set(match[1], stripTags(match[2]));
  }

  return map;
}

function applyReferenceMap(text, referenceMap) {
  return text.replace(/\[(\d+)\]/g, (_, id) => {
    const reference = referenceMap.get(id);
    return reference ? ` (${reference})` : "";
  });
}

function parseSections(html, entryTitle) {
  const referenceMap = extractReferenceMap(html);
  const sections = [];
  const paragraphRegex = /<p>([\s\S]*?)<\/p>/gi;
  let match;
  let currentSection = null;

  while ((match = paragraphRegex.exec(html)) !== null) {
    const raw = match[1];

    if (
      raw.includes("wst-header-title-text") ||
      raw.includes("THE COUNCIL OF TRENT") ||
      raw.includes("OF THE COUNCIL OF TRENT") ||
      raw.includes("PART I.") ||
      raw.includes("PART II.") ||
      raw.includes("PART III.") ||
      raw.includes("PART IV.") ||
      raw.includes("ARTICLE I.") ||
      raw.includes("ARTICLE II.") ||
      raw.includes("ARTICLE III.") ||
      raw.includes("ARTICLE IV.") ||
      raw.includes("ARTICLE V.") ||
      raw.includes("ARTICLE VI.") ||
      raw.includes("ARTICLE VII.") ||
      raw.includes("ARTICLE VIII.") ||
      raw.includes("ARTICLE IX.") ||
      raw.includes("ARTICLE X.") ||
      raw.includes("ARTICLE XI.") ||
      raw.includes("ARTICLE XII.")
    ) {
      continue;
    }

    const sideNoteMatch = raw.match(/<span class="wst-sidenote-inner">(.*?)<\/span>/i);
    const text = applyReferenceMap(stripTags(raw), referenceMap)
      .replace(/ +([,.;:!?])/g, "$1")
      .replace(/\s+\)/g, ")")
      .replace(/\(\s+/g, "(")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (
      !text ||
      text === "THE" ||
      text === "CATECHISM" ||
      text === "OF" ||
      text.startsWith("ON THE TWELVE ARTICLES OF THE CREED.") ||
      text === `"${entryTitle.toUpperCase().replace(/^ARTICLE [IVXLC]+\. /, "").replace(/^ON /, "").replace(/\.$/, "")}"`
    ) {
      continue;
    }

    const sideTitle = sideNoteMatch ? stripTags(sideNoteMatch[1]) : undefined;
    const cleanText = text.startsWith(`${sideTitle} `) ? text.slice(sideTitle.length + 1).trim() : text;

    if (sideTitle || !currentSection) {
      currentSection = {
        id: `section-${sections.length + 1}`,
        title: sideTitle,
        paragraphs: [cleanText],
      };
      sections.push(currentSection);
      continue;
    }

    currentSection.paragraphs.push(cleanText);
  }

  return sections.filter((section) => section.paragraphs.some(Boolean));
}

async function fetchEntry(pageTitle) {
  const url = new URL("https://en.wikisource.org/w/api.php");
  url.searchParams.set("action", "parse");
  url.searchParams.set("page", `The_Catechism_of_the_Council_of_Trent/${pageTitle}`);
  url.searchParams.set("prop", "text");
  url.searchParams.set("format", "json");

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "logos-legacy-web importer",
      },
    });

    if (response.ok) {
      const payload = await response.json();
      const html = payload?.parse?.text?.["*"];

      if (!html) {
        throw new Error(`Missing parsed content for ${pageTitle}`);
      }

      return html;
    }

    if (response.status !== 429 || attempt === 5) {
      throw new Error(`Failed to fetch ${pageTitle}: ${response.status}`);
    }

    await sleep(10000 * attempt);
  }

  throw new Error(`Failed to fetch ${pageTitle}`);
}

async function main() {
  const library = [];

  for (let index = 0; index < entries.length; index += 1) {
    const [part, pageTitle, title] = entries[index];
    const html = await fetchEntry(pageTitle);
    const sections = parseSections(html, title);
    const paragraphs = sections.flatMap((section) => section.paragraphs).filter(Boolean);
    const summarySeed =
      sections.find((section) => section.title)?.paragraphs[0] ??
      paragraphs[0] ??
      title;

    library.push({
      slug: slugify(pageTitle),
      part,
      order: index + 1,
      title,
      source: "The Catechism of the Council of Trent (1829 trans. Jeremiah Donovan)",
      summary: summarySeed.slice(0, 360).trim(),
      sections,
    });

    await sleep(3000);
  }

  await fs.writeFile(outputPath, `${JSON.stringify(library, null, 2)}\n`, "utf8");
  console.log(`Imported Roman Catechism library (${library.length} entries).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
