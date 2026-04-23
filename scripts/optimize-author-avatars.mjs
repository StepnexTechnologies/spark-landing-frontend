#!/usr/bin/env node
/**
 * One-shot avatar optimizer for /public/authors/.
 * Reads the listed source files, produces WebP @ 512x512 (quality 80, fit=cover),
 * and writes them alongside the originals. Run manually after adding a new author
 * with a large source portrait.
 *
 * Usage: node scripts/optimize-author-avatars.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTHORS_DIR = join(__dirname, "..", "public", "authors");

// Only the oversized portraits. Saurabh's jpg is already 6 KB, signature is tiny.
const sources = [
  "BinnyProfilePictue.png",
  "ProfilePictureVipasha.png",
  "rachit-jain-sparkonomy-author.png",
  "ProfilePictureMegha.png",
  "ProfilePicture_gunnet.png",
];

const MAX_SIZE = 512;
const QUALITY = 82;

for (const file of sources) {
  const srcPath = join(AUTHORS_DIR, file);
  if (!existsSync(srcPath)) {
    console.warn(`skip: ${file} (not found)`);
    continue;
  }
  const outPath = srcPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const input = readFileSync(srcPath);
  const before = input.length;
  const buffer = await sharp(input)
    .resize(MAX_SIZE, MAX_SIZE, { fit: "cover", position: "center" })
    .webp({ quality: QUALITY })
    .toBuffer();
  writeFileSync(outPath, buffer);
  const after = buffer.length;
  console.log(
    `${file} -> ${outPath.split(/[\\/]/).pop()}  ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024).toFixed(0)} KB`
  );
}
