import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const svg = readFileSync(join(publicDir, 'favicon.svg'));

async function png(size) {
  return sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
}

const [png16, png32, png48, png192, png180] = await Promise.all([
  png(16), png(32), png(48), png(192), png(180),
]);

writeFileSync(join(publicDir, 'favicon-48x48.png'), png48);
writeFileSync(join(publicDir, 'favicon-192x192.png'), png192);
writeFileSync(join(publicDir, 'apple-touch-icon.png'), png180);

// ICO container: header + per-image directory entries + PNG payloads
const images = [png16, png32, png48];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);

const entries = [];
let offset = 6 + images.length * 16;
for (const [i, buf] of images.entries()) {
  const size = [16, 32, 48][i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(buf.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += buf.length;
  entries.push(entry);
}

writeFileSync(join(publicDir, 'favicon.ico'), Buffer.concat([header, ...entries, ...images]));

console.log('Favicons written to public/');
