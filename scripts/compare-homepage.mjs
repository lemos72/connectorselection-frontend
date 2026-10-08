// Compares two builds of the homepage HTML and reports anything that matters
// for SEO: head tags, headings, links, visible words, and image alt text.
//
//   node scripts/compare-homepage.mjs before.html out/index.html
//
// "before.html" is a copy of out/index.html saved from your CURRENT live build,
// made before you install the new files. No packages needed.
import { readFileSync } from 'node:fs';

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.log('Usage: node scripts/compare-homepage.mjs before.html out/index.html');
  process.exit(2);
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
const text = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function analyse(html) {
  const head = (/<head[^>]*>([\s\S]*?)<\/head>/i.exec(html) || [, ''])[1];
  const body = (/<body[^>]*>([\s\S]*)<\/body>/i.exec(html) || [, html])[1];

  const title = text((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(head) || [, ''])[1]);

  const meta = {};
  for (const m of head.matchAll(/<meta\s+([^>]*?)\/?>/gi)) {
    const attrs = Object.fromEntries(
      [...m[1].matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map((a) => [a[1].toLowerCase(), decode(a[2])])
    );
    const key = attrs.name || attrs.property || attrs['http-equiv'];
    if (key && key !== 'viewport') meta[key] = attrs.content || '';
  }
  const canonical =
    (/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i.exec(head) ||
      /<link[^>]*href="([^"]*)"[^>]*rel="canonical"/i.exec(head) || [, ''])[1];
  const jsonLd = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) =>
    m[1].replace(/\s+/g, '')
  );

  const headings = [...body.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => `h${m[1]}: ${text(m[2])}`);
  const links = new Set(
    [...body.matchAll(/<a\s[^>]*href="([^"]*)"/gi)].map((m) => decode(m[1]).replace(/\/$/, '') || '/')
  );
  const cleaned = body.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ');
  const words = new Set(
    text(cleaned)
      .toLowerCase()
      .split(/[^a-z0-9™®°%+./-]+/)
      .filter((w) => w.length > 2)
  );
  const imgs = [...body.matchAll(/<img\s[^>]*>/gi)].map((m) => ({
    alt: (/alt="([^"]*)"/i.exec(m[0]) || [, null])[1],
    src: (/\ssrc="([^"]*)"/i.exec(m[0]) || [, ''])[1],
  }));
  return { title, meta, canonical, jsonLd, headings, links, words, imgs };
}

const a = analyse(readFileSync(beforePath, 'utf8'));
const b = analyse(readFileSync(afterPath, 'utf8'));

let problems = 0;
const section = (name, ok, detail = []) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) problems++;
  detail.forEach((d) => console.log('        ' + d));
};
const missing = (x, y) => [...x].filter((v) => !y.has(v));

section('Page title unchanged', a.title === b.title, [`before: ${a.title}`, `after:  ${b.title}`]);
section('Canonical unchanged', a.canonical === b.canonical, [`before: ${a.canonical}`, `after:  ${b.canonical}`]);

const metaKeys = new Set([...Object.keys(a.meta), ...Object.keys(b.meta)]);
const metaDiffs = [...metaKeys].filter((k) => a.meta[k] !== b.meta[k]).map((k) => `${k}: "${a.meta[k]}" -> "${b.meta[k]}"`);
section('Meta tags (description, robots, Open Graph...) unchanged', metaDiffs.length === 0, metaDiffs);
section('Structured data (JSON-LD) unchanged', JSON.stringify(a.jsonLd) === JSON.stringify(b.jsonLd));

section(
  'Headings (h1-h4): same text, same order',
  JSON.stringify(a.headings) === JSON.stringify(b.headings),
  JSON.stringify(a.headings) === JSON.stringify(b.headings)
    ? []
    : [`before (${a.headings.length}): ${a.headings.join(' | ')}`, `after  (${b.headings.length}): ${b.headings.join(' | ')}`]
);

const lostLinks = missing(a.links, b.links);
const newLinks = missing(b.links, a.links);
section('No internal/external links lost', lostLinks.length === 0, lostLinks.map((l) => 'lost: ' + l));
if (newLinks.length) console.log('NOTE  new links added:\n        ' + newLinks.join('\n        '));

const lostWords = missing(a.words, b.words);
section('No visible words lost', lostWords.length === 0, lostWords.length ? [lostWords.slice(0, 40).join(', ')] : []);

const nonEmptyAlt = (x) => x.imgs.filter((i) => i.alt).map((i) => i.alt);
const lostAlts = missing(new Set(nonEmptyAlt(a)), new Set(nonEmptyAlt(b)));
section('No image alt text lost', lostAlts.length === 0, lostAlts.map((t) => 'lost alt: ' + t));
console.log(`INFO  images before: ${a.imgs.length}, after: ${b.imgs.length}`);

console.log(problems === 0 ? '\nRESULT: all checks passed.' : `\nRESULT: ${problems} check(s) need a look.`);
process.exit(problems === 0 ? 0 : 1);
