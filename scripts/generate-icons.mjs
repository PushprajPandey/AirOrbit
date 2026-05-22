import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateRawSync } from 'zlib';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(dir, { recursive: true });

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function createPng(size) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = [0];
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - size / 2, y - size / 2);
      if (d < size * 0.35) row.push(14, 165, 233);
      else row.push(255, 255, 255);
    }
    rows.push(...row);
  }
  const raw = Buffer.from(rows);
  const compressed = deflateRawSync(raw);
  return Buffer.concat([
    header,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  writeFileSync(join(dir, `icon-${size}.png`), createPng(size));
}

console.log('Icons generated');
