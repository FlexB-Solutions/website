import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(sourceRoot, 'public');
const entryFiles = [
  'index.html', 'impressum.html', 'datenschutz.html', '404.html', 'robots.txt', 'sitemap.xml',
  'favicon.ico', 'apple-touch-icon.png', '.well-known/security.txt',
  'automatisierung-markt/index.html',
  'ui_kits/website/index.html', 'ui_kits/website/impressum.html', 'ui_kits/website/datenschutz.html',
  ...['prozess', 'software', 'ki', 'ml', 'sensorik', 'webseiten', 'custom-workflows', '3d-druck', 'kleinserien']
    .map((name) => `leistungen/${name}/index.html`)
];

const copied = new Set();
const pending = [...entryFiles];

function isLocalReference(value) {
  return value && !value.startsWith('#') && !value.startsWith('data:') && !value.startsWith('mailto:') &&
    !value.startsWith('tel:') && !value.startsWith('http:') && !value.startsWith('https:') && !value.startsWith('//');
}

function referencedPaths(content, relativeFile) {
  const found = new Set();
  const add = (raw) => {
    const value = raw.trim().replace(/^['"]|['"]$/g, '').split(/[?#]/, 1)[0];
    if (!isLocalReference(value) || !/[/.]/.test(value)) return;
    const target = value.startsWith('/')
      ? path.resolve(sourceRoot, `.${value}`)
      : path.resolve(sourceRoot, path.dirname(relativeFile), value);
    if (target.startsWith(`${sourceRoot}${path.sep}`) || target === sourceRoot) found.add(path.relative(sourceRoot, target));
  };

  for (const match of content.matchAll(/(?:src|href|poster)=["']([^"']+)["']/gi)) add(match[1]);
  for (const match of content.matchAll(/(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*content=["']([^"']+)["']/gi)) add(match[1]);
  for (const match of content.matchAll(/url\(([^)]+)\)/gi)) add(match[1]);
  for (const match of content.matchAll(/["']((?:\/(?:assets|uploads|ui_kits|leistungen|automatisierung-markt)\/|(?:\.\.\/)+(?:assets|uploads|ui_kits|leistungen|automatisierung-markt)\/)[^"']+)["']/g)) add(match[1]);
  return found;
}

async function copyOne(relativeFile) {
  const normalized = relativeFile.replace(/^\.\//, '');
  if (copied.has(normalized)) return;
  const source = path.join(sourceRoot, normalized);
  const destination = path.join(publicRoot, normalized);
  let info;
  try { info = await stat(source); } catch { throw new Error(`Referenzierte Datei fehlt: ${normalized}`); }
  if (!info.isFile()) return;
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination);
  copied.add(normalized);
  if (/\.(?:html?|css|js|mjs|xml|txt)$/i.test(normalized)) {
    const content = await readFile(source, 'utf8');
    for (const reference of referencedPaths(content, normalized)) pending.push(reference);
  }
}

await rm(publicRoot, { recursive: true, force: true });
await mkdir(publicRoot, { recursive: true });
while (pending.length) {
  const next = pending.shift();
  if (next) await copyOne(next);
}
console.log(`Prepared ${copied.size} public files in ${publicRoot}`);
