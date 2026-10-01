// Fails when a text file at the repository root or under src/, scripts/ or worker/ exceeds MAX_FILE_LINES.
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

import { MAX_FILE_LINES } from '../quality.config.js';

const ROOT = join(import.meta.dirname, '..');
const BINARY = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico', '.woff', '.woff2']);
const IGNORED_ROOT_FILES = new Set(['pnpm-lock.yaml']);

const isText = (path) => !BINARY.has(extname(path).toLowerCase());
const countLines = (text) => text.split('\n').length - (text.endsWith('\n') ? 1 : 0);

const rootFiles = readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isFile() && !IGNORED_ROOT_FILES.has(entry.name))
  .map((entry) => join(ROOT, entry.name));
const nestedFiles = ['src', 'scripts', 'worker'].flatMap((dir) =>
  readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name)),
);

const offenders = [...rootFiles, ...nestedFiles]
  .filter(isText)
  .map((path) => ({ path: relative(ROOT, path), lines: countLines(readFileSync(path, 'utf8')) }))
  .filter(({ lines }) => lines > MAX_FILE_LINES);

if (offenders.length > 0) {
  console.error(`Files over ${MAX_FILE_LINES} lines:`);
  for (const { path, lines } of offenders) console.error(`  ${path}: ${lines}`);
  process.exit(1);
}
console.log(`All files are within ${MAX_FILE_LINES} lines.`);
