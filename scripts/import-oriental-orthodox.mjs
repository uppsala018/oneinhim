import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "imports", "raw", "oriental");
const outputPath = path.join(root, "src", "content", "oriental-orthodox-library.json");

const entries = [
  {
    slug: "claudius-ethiopia-confession",
    title: "Confession of Faith",
    author: "Emperor Claudius of Ethiopia",
    era: "1555",
    tradition: "Oriental Orthodox",
    summary:
      "A confession defending Ethiopian Orthodox teaching on creed, Sabbath, circumcision, and food customs against Jesuit accusations.",
    sourceUrl:
      "https://www.orientalorthodoxy.com/library/texts/fathers/emperor-claudius-confession/",
    fileName: "claudius-confession.html",
  },
  {
    slug: "origen-letter-to-friends",
    title: "Letter to Friends in Alexandria",
    author: "Origen of Alexandria",
    era: "3rd century",
    tradition: "Oriental Orthodox resource archive",
    summary:
      "A short apologetic letter in which Origen rejects slanders and forged claims attributed to his teaching.",
    sourceUrl:
      "https://www.orientalorthodoxy.com/library/texts/fathers/origen-letter-to-friends/",
    fileName: "origen-letter.html",
  },
  {
    slug: "matthew-iv-against-calvinists",
    title: "Against the Calvinists",
    author: "Pope Matthew IV of Alexandria",
    era: "17th century",
    tradition: "Oriental Orthodox",
    summary:
      "A Coptic Orthodox defense of Eucharistic belief against Protestant accusations, especially on Christ's real presence.",
    sourceUrl:
      "https://www.orientalorthodoxy.com/library/texts/fathers/matthew-iv-against-calvinists/",
    fileName: "matthew-iv-against-calvinists.html",
  },
];

function maybeRepairEncoding(value) {
  if (!/[â€œâ€ťâ€˜â€™â€”â€“Â]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function decodeEntities(value) {
  return maybeRepairEncoding(value)
    .replace(/&#160;|&nbsp;/g, " ")
    .replace(/&mdash;|&#8212;/g, " - ")
    .replace(/&ndash;|&#8211;/g, " - ")
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(value) {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<span[^>]*>.*?<\/span>/gis, (match) =>
        match.replace(/<a [^>]*>(.*?)<\/a>/gis, "$1"),
      )
      .replace(/<a [^>]*>(.*?)<\/a>/gis, "$1")
      .replace(/<em>|<\/em>|<strong>|<\/strong>|<b>|<\/b>|<i>|<\/i>/gi, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/ +([,.;:!?])/g, "$1")
      .replace(/\( /g, "(")
      .replace(/ \)/g, ")")
      .trim(),
  );
}

function extractRelevantBody(html) {
  const headingIndex = html.indexOf("elementor-heading-title elementor-size-default");
  const libraryIndex = html.indexOf("LIBRARY", headingIndex);
  const firstRealTitle = html.indexOf('elementor-heading-title elementor-size-default">', libraryIndex + 1);
  const footerIndex = html.lastIndexOf("About the Church");

  if (firstRealTitle >= 0 && footerIndex > firstRealTitle) {
    return html.slice(firstRealTitle, footerIndex);
  }

  return html;
}

function parseSections(html) {
  const body = extractRelevantBody(html);
  const tokens = body.match(/<(h2|p)[^>]*>[\s\S]*?<\/(h2|p)>/gi) ?? [];
  const sections = [];
  let currentSection = null;
  let seenTitle = false;
  let skippedIntroMeta = 0;

  for (const token of tokens) {
    const tag = token.startsWith("<h2") ? "h2" : "p";
    const inner = token.replace(/^<(h2|p)[^>]*>/i, "").replace(/<\/(h2|p)>$/i, "");
    const text = stripTags(inner);

    if (!text) {
      continue;
    }

    if (!seenTitle && tag === "h2") {
      seenTitle = true;
      continue;
    }

    if (text === "Oriental Orthodox" || text === "LIBRARY" || text === "TEXTS") {
      continue;
    }

    if (
      text.includes("Texts & Resources") ||
      text.includes("Learning & Education") ||
      text.includes("Christian Practice") ||
      text.includes("About the Church") ||
      text.includes("Apostolic Succession") ||
      text.includes("Become Orthodox") ||
      text.includes("Church Councils") ||
      text.includes("Church Fathers")
    ) {
      continue;
    }

    if (!seenTitle && tag === "p") {
      continue;
    }

    if (tag === "h2") {
      currentSection = {
        id: `section-${sections.length + 1}`,
        title: text.replace(/^[•\s]+/, ""),
        paragraphs: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (skippedIntroMeta < 2 && !currentSection) {
      skippedIntroMeta += 1;
      continue;
    }

    if (!currentSection) {
      currentSection = {
        id: "section-1",
        title: "Full Text",
        paragraphs: [],
      };
      sections.push(currentSection);
    }

    currentSection.paragraphs.push(text);
  }

  return sections.filter((section) => section.paragraphs.length > 0);
}

async function main() {
  const library = [];

  for (const entry of entries) {
    const html = await fs.readFile(path.join(sourceRoot, entry.fileName), "utf8");
    const sections = parseSections(html);

    library.push({
      slug: entry.slug,
      title: entry.title,
      author: entry.author,
      era: entry.era,
      tradition: entry.tradition,
      summary: entry.summary,
      source: "OrientalOrthodoxy.com free text archive",
      sourceUrl: entry.sourceUrl,
      sections,
    });
  }

  await fs.writeFile(outputPath, `${JSON.stringify(library, null, 2)}\n`, "utf8");
  console.log(`Wrote ${library.length} Oriental Orthodox entries to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
