import { createHash } from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let md;
const markdown = () => md ??= new (require('markdown-it'))({ html: true });
export const TARGET_LOCALES = ['en'];
const placeholder = /⟦(\d+)⟧/g;

function protectCode(text, save) {
  const lines = text.split(/(?<=\n)/);
  let result = '';
  for (let i = 0; i < lines.length; i++) {
    const fence = /^ {0,3}(`{3,}|~{3,})/.exec(lines[i]);
    if (!fence) { result += lines[i]; continue; }
    let block = lines[i];
    const close = new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`);
    while (++i < lines.length) {
      block += lines[i];
      if (close.test(lines[i])) break;
    }
    // Keep the boundary newline outside the token so headings remain separate lines.
    result += block.endsWith('\n') ? save(block.slice(0, -1)) + '\n' : save(block);
  }
  return result.replace(/(`+)([^`]|[\s\S]*?[^`])\1(?!`)/g, save);
}

function mapLinks(text, change) {
  const starts = /\]\(\s*/g;
  let result = '', cursor = 0, match;
  while ((match = starts.exec(text))) {
    const start = starts.lastIndex;
    const parsed = markdown().helpers.parseLinkDestination(text, start, text.length);
    if (!parsed.ok) continue;
    result += text.slice(cursor, start) + change(text.slice(start, parsed.pos));
    cursor = starts.lastIndex = parsed.pos;
  }
  return result + text.slice(cursor);
}

export function mask(text) {
  const tokens = [];
  const save = (value) => { tokens.push(value); return `⟦${tokens.length - 1}⟧`; };
  if (/⟦\d+⟧/.test(text)) throw new Error('Source contains reserved placeholders');
  text = protectCode(text, save);
  text = text.replace(/<!--[\s\S]*?-->|<\/?[A-Za-z](?:"[^"]*"|'[^']*'|[^'">])*>|<(?:https?:\/\/|mailto:)[^>]+>/g, save);
  text = mapLinks(text, (value) => /^⟦\d+⟧$/.test(value) ? value : save(value));
  text = text.replace(/^[ \t]*:::(?:[ \t]*(?:warning|tip|details|info|danger|note)\b|[ \t]*(?=\r?$))/gm, save);
  text = text.replace(/\{#[^}\n]+\}/g, save);
  return { text, tokens };
}

export function unmask(text, tokens) {
  const counts = new Map();
  for (const match of text.matchAll(placeholder)) counts.set(+match[1], (counts.get(+match[1]) ?? 0) + 1);
  if ([...counts.keys()].some((n) => n >= tokens.length) || tokens.some((_, n) => counts.get(n) !== 1)) {
    throw new Error('Missing, duplicated or unknown placeholder');
  }
  return text.replace(placeholder, (_, n) => tokens[+n]);
}

export function splitChunks(body, limit = 6000) {
  if (!Number.isInteger(limit) || limit < 16) throw new Error('Invalid chunk limit');
  // Also safe for direct callers passing unmasked fenced code.
  const tokens = [];
  const safe = protectCode(body, (s) => { tokens.push(s); return `⟪${tokens.length - 1}⟫`; });
  const restore = (s) => s.replace(/⟪(\d+)⟫/g, (_, n) => tokens[+n]);
  const chunks = [];
  let current = '';
  const flush = () => { if (current) chunks.push(current); current = ''; };
  const append = (part) => {
    if (current.length + part.length > limit) flush();
    current += part;
  };
  for (const section of safe.split(/(?=^#{2,3} )/m)) {
    for (const paragraph of section.split(/(?<=\n\n)/)) {
      if (restore(paragraph).length <= limit) append(restore(paragraph));
      else for (const atom of paragraph.match(/⟪\d+⟫|⟦\d+⟧|[\s\S]/gu) ?? []) append(restore(atom));
    }
    flush();
  }
  return chunks;
}

// Ассет — любой файл с расширением, кроме страниц (.md/.html): .sql, .py и т.п. тоже лежат только в ru.
// Расширение смотрим до #/?: в якоре бывают точки (#v6.6).
const asset = { test: (url) => /\.(?!(?:md|html)$)[a-z\d]+$/i.test(url.split(/[?#]/)[0]) };

export const localizeRedirect = (from) => from.startsWith('/en/') ? from : '/en' + (from.startsWith('/') ? from : '/' + from);
export function rewriteLinks(text, srcRelPath) {
  const tokens = [];
  text = protectCode(text, (s) => { tokens.push(s); return `⟦${tokens.length - 1}⟧`; });
  const rewrite = (raw) => {
    const angle = raw.startsWith('<') && raw.endsWith('>');
    let url = angle ? raw.slice(1, -1) : raw;
    if (url.startsWith('/') && !url.startsWith('//') && !/^\/(?:en|helm)(?:\/|$)/.test(url) && !asset.test(url)) url = '/en' + url;
    // Ассет рядом с исходником: Vite берёт его импортом, поэтому путь остаётся относительным,
    // но из src/en/<dir> ведёт обратно к оригиналу в src/<dir>. Абсолютный путь Vite искал бы в public/.
    else if (!/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url) && asset.test(url)) {
      const dir = path.posix.dirname(srcRelPath);
      url = path.posix.relative(path.posix.join('en', dir), path.posix.join(dir, url)).replace(/ /g, '%20');
    }
    return angle ? `<${url}>` : url;
  };
  text = mapLinks(text, rewrite);
  text = text.replace(/(<[^>]+\b(?:src|href)=)(["'])(.*?)\2/g, (_, start, quote, url) => start + quote + rewrite(url) + quote);
  return unmask(text, tokens);
}

function headings(text) {
  const { resolveTitleFromToken } = require('@mdit-vue/shared');
  const tokens = markdown().parse(text, {});
  return tokens.flatMap((token, i) => token.type === 'heading_open' ? [{
    line: token.map[0], end: token.map[1], level: token.tag.slice(1),
    title: resolveTitleFromToken(tokens[i + 1], { shouldAllowHtml: false, shouldEscapeText: false }),
  }] : []);
}

export function addHeadingIds(ruChunk, enChunk) {
  const { slugify } = require('@mdit-vue/shared');
  const ru = headings(ruChunk), en = headings(enChunk);
  if (ru.length !== en.length || ru.some((h, i) => h.level !== en[i].level)) throw new Error('Heading count or levels changed');
  const used = new Set();
  const lines = enChunk.split('\n');
  const ruLines = ruChunk.split('\n');
  for (let i = 0; i < ru.length; i++) {
    // Явный id читаем из сырой строки: парсер срезает {#…} из title, и в чанке без соседей
    // уже назначенный суффикс (-1) потерялся бы.
    const explicit = /\s*\{#([^}]+)\}\s*$/.exec(ruLines[ru[i].line]);
    const base = explicit?.[1] ?? slugify(ru[i].title);
    let id = base, suffix = 0;
    while (used.has(id)) id = `${base}-${++suffix}`;
    used.add(id);
    const line = en[i].line;
    lines[line] = lines[line].replace(/\s*\{#[^}]+\}\s*$/, '').replace(/\s+#+\s*$/, '') + ` {#${id}}`;
  }
  return lines.join('\n');
}

export const sourceHash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 16);
export function isStale(srcContent, enContent) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(enContent ?? '');
  return frontmatter?.[1].match(/^source_hash:\s*['"]?([a-f\d]{16})['"]?\s*$/m)?.[1] !== sourceHash(srcContent);
}
