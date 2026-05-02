import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, "../public/assets/art/catholic-icon.png");
const out = resolve(__dirname, "../public/assets/art");

const sizes = [48, 72, 96, 144, 192, 512];

for (const size of sizes) {
  await sharp(src)
    .resize(size, size, { fit: "contain", background: { r: 4, g: 17, b: 38, alpha: 1 } })
    .png()
    .toFile(`${out}/icon-${size}.png`);
  console.log(`✓ icon-${size}.png`);
}

// Maskable variant (512 with extra padding so safe zone is preserved)
await sharp(src)
  .resize(410, 410, { fit: "contain", background: { r: 4, g: 17, b: 38, alpha: 1 } })
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: { r: 4, g: 17, b: 38, alpha: 1 } })
  .png()
  .toFile(`${out}/icon-512-maskable.png`);
console.log("✓ icon-512-maskable.png");

console.log("Done.");
