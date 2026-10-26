import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { execFileSync } from 'node:child_process';
import { mask, unmask, splitChunks, rewriteLinks, addHeadingIds, isStale, sourceHash, TARGET_LOCALES, localizeRedirect } from './translate-lib.mjs';

const CYRILLIC = /[А-Яа-яЁё]/;
// Технические ключи frontmatter: значения не текст для читателя, даже если в них кириллица.
const FRONTMATTER_KEEP = new Set(['icon', 'image', 'permalink', 'layout', 'type', 'lang', 'pageClass', 'source_hash']);

export const GLOSSARY = {
  'модель процесса': 'process model', 'оргструктура': 'org structure', 'дорожка': 'lane',
  'реестр': 'registry', 'лицензия': 'license', 'сборка': 'build',
};
const SYSTEM = `Translate Russian technical documentation for the on-prem BPMN product Stormbpmn into English.
Return only the translated text, without wrapping it in a code fence or adding commentary.
Preserve Markdown syntax, heading count and levels, and every ⟦N⟧ placeholder exactly once, unchanged.
Do not translate environment variable names, commands, paths or configuration keys. Brand: Stormbpmn.
Glossary: ${JSON.stringify(GLOSSARY)}.`;

async function request(text) {
  if (process.env.TRANSLATE_FAKE === '1') {
    return text.replace(/^(#{1,6}\s+)?([^\n]+)$/gm, (line, heading = '', rest) =>
      /[^\s⟦⟧\d]/.test(rest.replace(/⟦\d+⟧/g, '')) ? `${heading}EN: ${rest}` : line);
  }
  const response = await fetch(`${process.env.LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST', signal: AbortSignal.timeout(120_000),
    headers: { 'Content-Type': 'application/json', ...(process.env.LLM_API_KEY ? { Authorization: `Bearer ${process.env.LLM_API_KEY}` } : {}) },
    body: JSON.stringify({ model: process.env.LLM_MODEL, temperature: 0.1,
      chat_template_kwargs: { enable_thinking: false },
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: text }] }),
  });
  if (!response.ok) {
    const error = new Error(`LLM HTTP ${response.status}`);
    error.permanent = response.status < 500;
    throw error;
  }
  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw new Error('Empty LLM response');
  return content;
}

async function translatePart(source, validate = (s) => s) {
  const leading = source.match(/^\s*/)[0];
  const trailing = source.slice(leading.length).match(/\s*$/)[0];
  const core = source.slice(leading.length, trailing.length ? -trailing.length : undefined);
  if (!core) return source;
  const masked = mask(core);
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return validate(leading + unmask((await request(masked.text)).trim(), masked.tokens) + trailing); }
    catch (error) {
      lastError = error;
      if (error.permanent) break;
      if (attempt < 2 && process.env.TRANSLATE_FAKE !== '1') await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
    }
  }
  throw lastError;
}

function frontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);
  return match ? { raw: match[1], body: content.slice(match[0].length) } : { raw: '', body: content };
}

async function translateFile(content, relative) {
  const { default: yaml } = await import('js-yaml');
  const { raw, body } = frontmatter(content);
  const data = raw ? yaml.load(raw) ?? {} : {};
  delete data.source_hash;
  // Во frontmatter у темы живёт видимый текст (hero, кнопки, подписи разделов, футер), поэтому
  // переводим любую строку с кириллицей, кроме технических ключей. Ссылки — под /en/:
  // без префикса кнопки главной и редиректы уводили бы на русскую версию.
  const walk = async (v, key) => {
    if (key === 'redirectFrom') return [v].flat().filter(Boolean).map(localizeRedirect);
    if (Array.isArray(v)) return Promise.all(v.map((x) => walk(x, key)));
    if (v && typeof v === 'object') {
      const out = {};
      for (const [k, x] of Object.entries(v)) out[k] = await walk(x, k);
      return out;
    }
    if (typeof v !== 'string') return v;
    if (key === 'link') return rewriteLinks(`[](${v})`, relative).slice(3, -1);
    if (FRONTMATTER_KEEP.has(key) || !CYRILLIC.test(v)) return v;
    return translatePart(v);
  };
  const translated = raw ? [yaml.dump(await walk(data), { lineWidth: -1 })] : [];
  // Assign IDs before chunking so repeated headings retain VuePress's document-wide suffixes.
  const withIds = addHeadingIds(body, body);
  const masked = mask(withIds);
  const chunks = splitChunks(masked.text, 6000);
  const output = [];
  for (const chunk of chunks) {
    // Re-mask each chunk locally; code tokens may represent more than 6000 source characters.
    const source = chunk.replace(/⟦(\d+)⟧/g, (_, n) => masked.tokens[+n]);
    output.push(await translatePart(source, (en) => addHeadingIds(source, en)));
  }
  // Текстовые props компонентов (caption="…") маска прячет вместе с тегом — переводим их отдельно.
  let en = output.join('');
  for (const m of [...new Set([...en.matchAll(/<[A-Z][\w-]*\b[^>]*>/g)].flatMap((t) => [...t[0].matchAll(/\s[\w-]+="([^"]*)"/g)].map((a) => a[1])))]) {
    if (CYRILLIC.test(m)) en = en.split(`"${m}"`).join(`"${(await translatePart(m)).replace(/"/g, '&quot;')}"`);
  }
  const fm = translated.map((s) => s.endsWith('\n') ? s : s + '\n').join('');
  return `---\n${fm}source_hash: ${sourceHash(content)}\n---\n${rewriteLinks(en, relative)}`;
}

async function listMarkdown(dir, excluded = []) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const result = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (excluded.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await listMarkdown(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) result.push(full);
  }
  return result;
}

export async function main(args = process.argv.slice(2), root = process.cwd(), changedFiles = (ref) =>
  execFileSync('git', ['diff', '--name-only', '-z', `${ref}...HEAD`, '--', 'src'], { cwd: root, encoding: 'utf8' }).split('\0')) {
  const { values } = parseArgs({ args, options: { check: { type: 'boolean' }, only: { type: 'string' },
    concurrency: { type: 'string', default: '3' }, force: { type: 'boolean' }, locale: { type: 'string' }, 'changed-since': { type: 'string' }, format: { type: 'string', default: 'text' } } });
  const concurrency = Number(values.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error('--concurrency must be a positive integer');
  if (values.locale && !TARGET_LOCALES.includes(values.locale)) throw new Error('Unknown --locale');
  if (!['text', 'github'].includes(values.format)) throw new Error('Unknown --format');
  if (!values.check && process.env.TRANSLATE_FAKE !== '1') {
    const missing = ['LLM_BASE_URL', 'LLM_MODEL', 'LLM_API_KEY'].filter((key) => !process.env[key]?.trim());
    if (missing.length) { console.error(`Set required environment variables: ${missing.join(', ')}`); return 2; }
  }
  const src = path.join(root, 'src');
  const locales = values.locale ? [values.locale] : TARGET_LOCALES;
  const sources = await listMarkdown(src, [...TARGET_LOCALES, '.vuepress']);
  const relative = (file, base) => path.relative(base, file).split(path.sep).join('/');
  const names = new Set(sources.map((file) => relative(file, src)));
  const changed = values['changed-since'] ? new Set(changedFiles(values['changed-since'])) : null;
  const selected = (name) => (!values.only || name.includes(values.only)) && (!changed || changed.has(`src/${name}`));
  const jobs = [], extra = [], findings = [];
  for (const locale of locales) {
    const target = path.join(src, locale);
    for (const file of await listMarkdown(target)) {
      const name = relative(file, target);
      if (!names.has(name) && selected(name)) { extra.push(file); findings.push({ name, locale, kind: 'extra' }); }
    }
    for (const file of sources) {
      const name = relative(file, src);
      if (!selected(name)) continue;
      const content = await fs.readFile(file, 'utf8');
      let existing;
      try { existing = await fs.readFile(path.join(target, name), 'utf8'); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      if (isStale(content, existing) || values.force) {
        findings.push({ name, locale, kind: existing === undefined ? 'missing' : 'stale' });
        jobs.push({ name, content, target });
      }
    }
  }
  const escape = (s) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  for (const { name, locale, kind } of findings) {
    if (values.format === 'github') {
      const message = `${kind === 'extra' ? 'Лишний перевод' : 'Нет/устарел перевод'} (${locale}): src/${locale}/${name}. Обнови: node scripts/translate.mjs --only ${name}`;
      console.log(`::warning file=${escape(`src/${name}`).replace(/,/g, '%2C').replace(/:/g, '%3A')}::${escape(message)}`);
    } else console.log(`${kind} (${locale}): ${name}`);
  }
  if (values.format === 'github' && process.env.GITHUB_STEP_SUMMARY) {
    const cell = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\|/g, '&#124;').replace(/[\r\n]/g, ' ');
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY,
      `## Переводы\n\n| Исходник | Локаль | Статус | Перевод |\n| --- | --- | --- | --- |\n` +
      findings.map(({ name, locale, kind }) => `| ${cell(`src/${name}`)} | ${locale} | ${kind} | ${cell(`src/${locale}/${name}`)} |\n`).join('') +
      (findings.length ? '' : '\nВсе переводы актуальны.\n'));
  }
  if (values.check) return findings.length ? 1 : 0;
  for (const file of extra) await fs.unlink(file);
  let failed = false;
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (next < jobs.length) {
      const { name, content, target } = jobs[next++];
      try {
        const output = await translateFile(content, name);
        const file = path.join(target, name);
        await fs.mkdir(path.dirname(file), { recursive: true });
        // Replace atomically; failed translation or interrupted writes leave the old file intact.
        await fs.writeFile(file + '.tmp', output);
        await fs.rename(file + '.tmp', file);
        console.log(`translated: ${name}`);
      } catch (error) { failed = true; console.error(`${name}: ${error.message}`); }
    }
  }));
  return failed ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
