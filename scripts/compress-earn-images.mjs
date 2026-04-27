// One-shot image compressor for /creator/earn.
//
// Rewrites oversized source PNGs to appropriate-resolution PNGs (kept as PNG to
// preserve transparency and avoid breaking any existing `src` paths). Next's
// image optimizer will still serve WebP/AVIF variants at request time — this
// just cuts the source size so cold-cache optimization is faster and produced
// variants are smaller.
//
// Usage: `node scripts/compress-earn-images.mjs`
// Writes originals to `*.orig.png` as a backup the first time it runs.

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "public", "images", "creator", "earn");

// Displayed dimensions from the codebase; we encode 2x for retina.
// hero-illustration-2 is rendered at max 784px wide (desktop glass container).
// Story images are rendered at 362px wide (both mobile full-bleed and desktop).
// PROMO.png is shown full-viewport by the PromoCelebration overlay.
const targets = [
  { file: "hero-illustration-2.png", maxWidth: 1600 },
  { file: "hero-illustration.png",   maxWidth: 1600 },
  { file: "PROMO.png",               maxWidth: 1440 },
  { file: "story-1.png",             maxWidth: 800 },
  { file: "story-2.png",             maxWidth: 800 },
  { file: "story-3.png",             maxWidth: 800 },
  { file: "story-4.png",             maxWidth: 800 },
  { file: "story-1-hi-Latn.png",     maxWidth: 800 },
  { file: "story-2-hi-Latn.png",     maxWidth: 800 },
  { file: "story-3-hi-Latn.png",     maxWidth: 800 },
  { file: "story-4-hi-Latn.png",     maxWidth: 800 },
];

async function processOne({ file, maxWidth }) {
  const src = path.join(DIR, file);
  const backup = src.replace(/\.png$/i, ".orig.png");

  try {
    await fs.access(src);
  } catch {
    console.log(`skip (missing): ${file}`);
    return;
  }

  // Keep a backup the first time we touch a file.
  try {
    await fs.access(backup);
  } catch {
    await fs.copyFile(src, backup);
  }

  const before = (await fs.stat(backup)).size;
  const img = sharp(backup);
  const meta = await img.metadata();
  const width = meta.width ?? maxWidth;
  const targetWidth = Math.min(width, maxWidth);

  const buf = await sharp(backup)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 82, palette: true, effort: 10 })
    .toBuffer();

  await fs.writeFile(src, buf);
  const after = buf.byteLength;
  const pct = (((before - after) / before) * 100).toFixed(1);
  console.log(
    `${file.padEnd(28)} ${(before / 1024).toFixed(0).padStart(5)} KiB → ${(after / 1024).toFixed(0).padStart(5)} KiB  (−${pct}%)`
  );
}

for (const t of targets) {
  try {
    await processOne(t);
  } catch (err) {
    console.error(`error processing ${t.file}:`, err.message);
  }
}
