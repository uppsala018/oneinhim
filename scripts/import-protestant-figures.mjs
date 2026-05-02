import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const rawDir = path.join(root, "imports", "raw", "protestant");
const outPath = path.join(root, "src", "content", "protestant-figures.json");

function readRaw(file) {
  return readFileSync(path.join(rawDir, file), "utf8").replace(/\r\n/g, "\n");
}

function normalizeParagraph(text) {
  return text.replace(/\s+/g, " ").trim();
}

function sectionFromLines(id, title, lines) {
  const paragraphs = [];
  let current = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.length) {
        paragraphs.push(normalizeParagraph(current.join(" ")));
        current = [];
      }
      continue;
    }
    current.push(trimmed);
  }

  if (current.length) {
    paragraphs.push(normalizeParagraph(current.join(" ")));
  }

  return {
    id,
    title,
    citation: null,
    paragraphs,
  };
}

function extractLines(text, startPattern, endPattern) {
  const lines = text.split("\n");
  const startIndex = lines.findIndex((line) => startPattern.test(line));
  if (startIndex === -1) {
    return [];
  }
  const endIndex = lines.findIndex((line, index) => index > startIndex && endPattern.test(line));
  return lines.slice(startIndex, endIndex === -1 ? lines.length : endIndex);
}

function extractLinesAfter(text, anchorPattern, startPattern, endPattern) {
  const lines = text.split("\n");
  const anchorIndex = lines.findIndex((line) => anchorPattern.test(line));
  if (anchorIndex === -1) {
    return [];
  }
  const startIndex = lines.findIndex(
    (line, index) => index > anchorIndex && startPattern.test(line),
  );
  if (startIndex === -1) {
    return [];
  }
  const endIndex = lines.findIndex((line, index) => index > startIndex && endPattern.test(line));
  return lines.slice(startIndex, endIndex === -1 ? lines.length : endIndex);
}

function parseNinetyFiveTheses(text) {
  const lines = text.split("\n").slice(66, 409);
  const theses = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(/^(\d{1,2})\.\s*(.*)$/);
    if (match) {
      if (current) {
        theses.push(current);
      }
      current = { number: Number(match[1]), lines: [match[2]] };
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    theses.push(current);
  }

  const groups = [
    ["theses-1-20", "Theses 1-20: Repentance, penalty, and papal jurisdiction", 1, 20],
    ["theses-21-40", "Theses 21-40: Indulgence preaching and true contrition", 21, 40],
    ["theses-41-60", "Theses 41-60: Works of mercy, Peter's basilica, and the treasure of the Church", 41, 60],
    ["theses-61-80", "Theses 61-80: The gospel, the cross, and the questions of the laity", 61, 80],
    ["theses-81-95", "Theses 81-95: Final objections and the theology of the cross", 81, 95],
  ];

  return groups.map(([id, title, first, last]) => ({
    id,
    title,
    citation: `Theses ${first}-${last}`,
    paragraphs: theses
      .filter((thesis) => thesis.number >= first && thesis.number <= last)
      .map((thesis) => `${thesis.number}. ${normalizeParagraph(thesis.lines.join(" "))}`),
  }));
}

function stats(sections) {
  return {
    sectionCount: sections.length,
    paragraphCount: sections.reduce((sum, section) => sum + section.paragraphs.length, 0),
  };
}

const lutherTheses = readRaw("luther-95-theses.txt");
const lutherCatechism = readRaw("luther-large-catechism.txt");
const calvinInstitutesVol1 = readRaw("calvin-institutes-vol-1.txt");
const calvinInstitutesVol2 = readRaw("calvin-institutes-vol-2.txt");
const wesleyWorksVol1 = readRaw("wesley-works-vol-1.txt");

const lutherCatechismSections = [
  sectionFromLines(
    "commandments",
    "The Ten Commandments",
    extractLines(lutherCatechism, /^I\. The Ten Commandments$/, /^II\. The Creed$/),
  ),
  sectionFromLines(
    "creed",
    "The Creed",
    extractLines(lutherCatechism, /^II\. The Creed$/, /^III\. The Lord's Prayer$/),
  ),
  sectionFromLines(
    "prayer",
    "The Lord's Prayer",
    extractLines(lutherCatechism, /^III\. The Lord's Prayer$/, /^IV\. The Sacrament Of Holy Baptism$/),
  ),
].filter((section) => section.paragraphs.length);

const calvinChapterOne = sectionFromLines(
  "knowledge-of-god-and-self",
  "Book I, Chapter I: The Knowledge of God and the Knowledge of Ourselves",
  extractLines(calvinInstitutesVol1, /^Chapter I\. The Connection Between The Knowledge Of God/, /^Chapter II\./),
);

const calvinFaith = sectionFromLines(
  "faith-defined",
  "Book III, Chapter II: Faith Defined",
  extractLines(calvinInstitutesVol1, /^Chapter II\. Faith Defined/, /^Chapter III\./),
);

const calvinJustification = sectionFromLines(
  "justification-by-faith",
  "Book III, Chapter XI: Justification by Faith",
  extractLines(calvinInstitutesVol1, /^Chapter XI\. Justification By Faith/, /^Chapter XII\./),
);

const calvinChurch = sectionFromLines(
  "true-church",
  "Book IV, Chapter I: The True Church",
  extractLinesAfter(
    calvinInstitutesVol2,
    /^\s*BOOK IV\.$/,
    /^\s*CHAPTER I\.$/,
    /^\s*CHAPTER II\.$/,
  ),
);

const calvinSacraments = sectionFromLines(
  "sacraments",
  "Book IV, Chapter XIV: The Sacraments",
  extractLinesAfter(
    calvinInstitutesVol2,
    /^\s*BOOK IV\.$/,
    /^\s*CHAPTER XIV\.$/,
    /^\s*CHAPTER XV\.$/,
  ),
);

function wesleySermonSection(id, title, startPattern, endPattern) {
  return sectionFromLines(
    id,
    title,
    extractLinesAfter(
      wesleyWorksVol1,
      /^\s*SERMONS ON SEVERAL OCCASIONS\.$/,
      startPattern,
      endPattern,
    ),
  );
}

const wesleySermons = [
  wesleySermonSection(
    "salvation-by-faith",
    "Sermon I: Salvation by Faith",
    /^\s*SERMON I\.\[1\]$/,
    /^\s*SERMON II\.\[2\]$/,
  ),
  wesleySermonSection(
    "almost-christian",
    "Sermon II: The Almost Christian",
    /^\s*SERMON II\.\[2\]$/,
    /^\s*SERMON III\.\[6\]$/,
  ),
  wesleySermonSection(
    "justification-by-faith",
    "Sermon V: Justification by Faith",
    /^\s*SERMON V\.$/,
    /^\s*SERMON VI\.$/,
  ),
  wesleySermonSection(
    "means-of-grace",
    "Sermon XVI: The Means of Grace",
    /^\s*SERMON XVI\.$/,
    /^\*\*\* END OF THE PROJECT GUTENBERG EBOOK/,
  ),
].filter((section) => section.paragraphs.length);

const figures = [
  {
    slug: "martin-luther",
    name: "Martin Luther",
    era: "1483-1546",
    region: "Wittenberg and the German lands",
    tradition: "Lutheran Reformation",
    summary:
      "Augustinian friar, biblical lecturer, reformer, translator, and catechist whose challenge to indulgence preaching became the public beginning of the Protestant Reformation.",
    bio:
      "Martin Luther began as an Augustinian monk and professor of Scripture. His theology developed around repentance, the promise of the gospel, justification by faith, and the authority of Scripture over abusive ecclesial practice. He was not merely a protest figure; he was also a pastor, translator, preacher, hymn writer, and catechist whose work shaped Lutheran worship and household instruction.",
    themes: ["justification", "repentance", "Scripture", "catechesis", "sacraments"],
    works: [
      {
        slug: "ninety-five-theses",
        title: "Disputation on the Power and Efficacy of Indulgences",
        shortTitle: "The 95 Theses",
        yearLabel: "1517",
        source: "Project Gutenberg eBook #274",
        sourceUrl: "https://www.gutenberg.org/ebooks/274",
        summary:
          "Luther's public disputation against indulgence preaching. The text centers on repentance, papal authority, purgatory, works of mercy, and the difference between true Christian confidence and false assurance bought by letters of pardon.",
        sections: parseNinetyFiveTheses(lutherTheses),
      },
      {
        slug: "large-catechism",
        title: "The Large Catechism",
        shortTitle: "Large Catechism",
        yearLabel: "1529",
        source: "Project Gutenberg eBook #1670",
        sourceUrl: "https://www.gutenberg.org/ebooks/1670",
        summary:
          "Luther's extended pastoral exposition of the commandments, creed, Lord's Prayer, baptism, confession, and the Lord's Supper. It shows Protestant theology as catechesis and household formation, not only controversy.",
        sections: lutherCatechismSections,
      },
    ],
  },
  {
    slug: "john-calvin",
    name: "John Calvin",
    era: "1509-1564",
    region: "Geneva, France, and the Reformed churches",
    tradition: "Reformed Protestantism",
    summary:
      "French reformer and theologian whose Institutes gave Reformed Protestantism a systematic account of God, Scripture, Christ, grace, church order, sacraments, and Christian life.",
    bio:
      "John Calvin was a second-generation reformer whose influence came through preaching, ecclesial discipline, biblical commentary, and theological synthesis. His Institutes of the Christian Religion became one of the defining works of Reformed theology, arranging Protestant doctrine around knowledge of God, redemption in Christ, participation in grace, and the outward means by which God gathers the church.",
    themes: ["sovereignty", "Scripture", "union with Christ", "faith", "church discipline"],
    works: [
      {
        slug: "institutes-book-one",
        title: "Institutes of the Christian Religion, Book I",
        shortTitle: "Institutes Book I",
        yearLabel: "1559 edition",
        source: "Project Gutenberg eBook #45001",
        sourceUrl: "https://www.gutenberg.org/ebooks/45001",
        summary:
          "Calvin opens the Institutes by joining the knowledge of God to the knowledge of ourselves. The work then develops creation, Scripture, providence, idolatry, and the doctrine of the Trinity.",
        sections: [calvinChapterOne].filter((section) => section.paragraphs.length),
      },
      {
        slug: "institutes-faith",
        title: "Institutes of the Christian Religion, Book III on Faith",
        shortTitle: "Institutes on Faith",
        yearLabel: "1559 edition",
        source: "Project Gutenberg eBook #45001",
        sourceUrl: "https://www.gutenberg.org/ebooks/45001",
        summary:
          "A representative Reformed treatment of faith, showing Calvin's concern that Christ's benefits are received through the Spirit and apprehended by faith.",
        sections: [calvinFaith].filter((section) => section.paragraphs.length),
      },
      {
        slug: "institutes-justification",
        title: "Institutes of the Christian Religion, Book III on Justification",
        shortTitle: "Institutes on Justification",
        yearLabel: "1559 edition",
        source: "Project Gutenberg eBook #45001",
        sourceUrl: "https://www.gutenberg.org/ebooks/45001",
        summary:
          "Calvin's developed account of justification by faith, where he defines the term, distinguishes it from works-righteousness, and frames it around union with Christ.",
        sections: [calvinJustification].filter((section) => section.paragraphs.length),
      },
      {
        slug: "institutes-church-and-sacraments",
        title: "Institutes of the Christian Religion, Book IV on Church and Sacraments",
        shortTitle: "Institutes on Church",
        yearLabel: "1559 edition",
        source: "Project Gutenberg eBook #64392",
        sourceUrl: "https://www.gutenberg.org/ebooks/64392",
        summary:
          "Calvin's doctrine of the visible church and sacraments, showing that Reformed theology includes ecclesiology and sacramental order, not only individual doctrine.",
        sections: [calvinChurch, calvinSacraments].filter((section) => section.paragraphs.length),
      },
    ],
  },
  {
    slug: "john-wesley",
    name: "John Wesley",
    era: "1703-1791",
    region: "England and the Methodist societies",
    tradition: "Methodist Protestantism",
    summary:
      "Anglican priest and Methodist organizer whose preaching and societies renewed Protestant devotion around conversion, disciplined holiness, and practical divinity.",
    bio:
      "John Wesley stands downstream from Anglicanism, Pietism, and the wider Protestant evangelical awakening. His movement emphasized conversion, assurance, disciplined societies, works of mercy, and holiness of heart and life. Later Methodist and Holiness traditions drew heavily from his theological and pastoral priorities.",
    themes: ["conversion", "assurance", "holiness", "discipline", "mission"],
    works: [
      {
        slug: "sermons-on-several-occasions",
        title: "Sermons on Several Occasions",
        shortTitle: "Selected Sermons",
        yearLabel: "1746 collection",
        source: "Project Gutenberg eBook #59743",
        sourceUrl: "https://www.gutenberg.org/ebooks/59743",
        summary:
          "Selected public-domain sermons from Wesley's first volume, including salvation by faith, the almost Christian, justification by faith, and the means of grace.",
        sections: wesleySermons,
      },
    ],
  },
];

for (const figure of figures) {
  for (const work of figure.works) {
    work.stats = stats(work.sections);
  }
}

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(figures, null, 2)}\n`);

console.log(`Wrote ${figures.length} Protestant figures to ${outPath}`);
