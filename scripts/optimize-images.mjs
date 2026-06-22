// One-shot brand image optimizer (run with: node scripts/optimize-images.mjs).
// Resizes the oversized brand PNGs to retina-safe dimensions and recompresses
// them in place. Requires the dev dependency `sharp`.
import sharp from "sharp";
import fs from "node:fs";

const jobs = [
  { f: "public/brand/app-icon.png", size: 512, q: 90 },
  { f: "public/brand/brand-sheet.png", size: 800, q: 85 },
  { f: "public/brand/logo-horizontal.png", w: 600, q: 90 },
  ...["sovereign", "strategist", "visionary", "builder", "rebel", "protector", "oracle"].map(
    (s) => ({ f: `public/brand/signals/${s}.png`, size: 800, q: 90 }),
  ),
];

let before = 0;
let after = 0;
for (const j of jobs) {
  const orig = fs.statSync(j.f).size;
  before += orig;
  let img = sharp(j.f);
  img = j.w
    ? img.resize({ width: j.w, withoutEnlargement: true })
    : img.resize({ width: j.size, height: j.size, fit: "inside", withoutEnlargement: true });
  const buf = await img
    .png({ palette: true, quality: j.q, compressionLevel: 9, effort: 10 })
    .toBuffer();
  fs.writeFileSync(j.f, buf);
  after += buf.length;
  console.log(`${j.f.padEnd(40)} ${(orig / 1024) | 0}KB → ${(buf.length / 1024) | 0}KB`);
}
console.log(
  `TOTAL ${(before / 1024) | 0}KB → ${(after / 1024) | 0}KB (-${100 - ((after / before) * 100) | 0}%)`,
);
