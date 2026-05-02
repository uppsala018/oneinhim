import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const inputPath = path.join(projectRoot, "imports", "raw", "catholic", "john-1.txt");
const outputPath = path.join(projectRoot, "src", "content", "catholic", "john-1.json");

async function main() {
  const raw = await fs.readFile(inputPath, "utf8");
  const verses = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\s+(.*)$/);

      if (!match) {
        throw new Error(`Could not parse verse line: ${line}`);
      }

      const number = Number(match[1]);
      const text = match[2];

      return {
        id: `john-1-${number}`,
        reference: `John 1:${number}`,
        number,
        text,
      };
    });

  const current = JSON.parse(await fs.readFile(outputPath, "utf8"));
  current.verses = verses;

  await fs.writeFile(outputPath, `${JSON.stringify(current, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
