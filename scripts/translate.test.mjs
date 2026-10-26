import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import { createMarkdown } from '@vuepress/markdown';
import { attrs } from '@mdit/plugin-attrs';
import yaml from 'js-yaml';
import { mask, unmask, splitChunks, rewriteLinks, addHeadingIds, isStale, sourceHash } from './translate-lib.mjs';

test('mask protects fences, inline code, URLs, tags, comments and container keywords', () => {
  const source = '## Заголовок\n\n````js\n```\n## hidden\n````\n~~~sh\necho test\n~~~\n`a` and ``a ` b``\n[x](/foo(bar).md#id "Название") <https://test/a>\n<AskAiButton /> <img src="./x.png"> <!-- test -->\n::: warning Важно\nТекст\n:::\n';
  const result = mask(source);
  assert.equal(unmask(result.text, result.tokens), source);
  for (const literal of ['hidden', 'echo test', 'foo(bar)', '<img', '<AskAiButton', '<!--', '::: warning']) assert.ok(!result.text.includes(literal), literal);
  assert.match(result.text, /Важно/);
  assert.throws(() => unmask(result.text.replace('⟦0⟧', ''), result.tokens));
  assert.throws(() => unmask(result.text + '⟦0⟧', result.tokens));
  assert.throws(() => unmask(result.text + '⟦999⟧', result.tokens));
  for (const link of ['[x](<https://test/a>)', '[x](<./file.md>)', '[x](/a(b(c)).md)', '<img alt="a > b" src="x">']) {
    const protectedLink = mask(link);
    assert.equal(unmask(protectedLink.text, protectedLink.tokens), link);
  }
});

test('splitChunks preserves content, headings and code, respects masked limit', () => {
  const source = '## Один\n\n' + 'Абзац. '.repeat(30) + '\n\n```sh\n## hidden\n' + 'x'.repeat(50) + '\n```\n\n### Два\nКонец';
  const chunks = splitChunks(source, 100);
  assert.equal(chunks.join(''), source);
  assert.ok(chunks.some((c) => c.includes('```sh\n## hidden')));
  assert.ok(chunks.every((c) => c.length <= 100));
  const masked = mask(source).text;
  assert.ok(splitChunks(masked, 100).every((c) => c.length <= 100));
  assert.equal(splitChunks(masked, 100).join(''), masked);
});

test('rewriteLinks handles internal pages, assets, fragments, external URLs and code', () => {
  const source = '[a](/install/a.md#якорь) [b](/x.html) [c](/x.png) [d](/helm/index.yaml) ![e](../img/a.png) [f](./a.md) [g](#якорь) [h](https://test/a) `[](/x)`\n```md\n[x](/x)\n```\n<img src="./pic.svg"> [pdf](manual.pdf)';
  const result = rewriteLinks(source, 'install/production/README.md');
  assert.match(result, /\[a\]\(\/en\/install\/a.md#якорь\)/);
  assert.match(result, /\[b\]\(\/en\/x.html\)/);
  for (const unchanged of ['[c](/x.png)', '[d](/helm/index.yaml)', '[f](./a.md)', '[g](#якорь)', '[h](https://test/a)', '`[](/x)`', '[x](/x)']) assert.ok(result.includes(unchanged), unchanged);
  assert.ok(result.includes('![e](../../../install/img/a.png)'));
  assert.ok(result.includes('<img src="../../../install/production/pic.svg">'));
  assert.ok(result.includes('[pdf](../../../install/production/manual.pdf)'));
  assert.ok(rewriteLinks('![s](./s.png)', 'REST API/a.md').includes('![s](../../REST%20API/s.png)'));
});

test('heading IDs use VuePress slugs and duplicate suffixes; attrs renders real IDs', () => {
  const ru = '# Начало\n## **Установка** `ENV`\n## Установка\n## Установка\n```\n## hidden\n```\n### Особый {#custom}\n';
  const en = '# Start\n## Install ENV\n## Install\n## Install\n```\n## hidden\n```\n### Special\n';
  const result = addHeadingIds(ru, en);
  assert.match(result, /Install ENV \{#установка-env\}/);
  assert.match(result, /Install \{#установка-1\}/);
  assert.match(result, /Special \{#custom\}/);
  assert.throws(() => addHeadingIds(ru, en + '\n## Extra'));
  const markdown = createMarkdown().use(attrs);
  assert.match(markdown.render(result), /<h2 id="установка-env"/);
  assert.ok(!markdown.render(result).includes('{#установка'));
});

test('source_hash only counts inside frontmatter and changes on source edits', () => {
  const hash = sourceHash('source');
  assert.match(hash, /^[a-f\d]{16}$/);
  assert.equal(isStale('source', `---\nsource_hash: ${hash}\n---\ntext`), false);
  assert.equal(isStale('changed', `---\nsource_hash: ${hash}\n---\ntext`), true);
  assert.equal(isStale('source', `source_hash: ${hash}`), true);
  assert.equal(isStale('source', undefined), true);
});

test('CLI fake translation, check, filtering, force and orphan deletion in temp directory', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-translate-'));
  const cli = path.resolve('scripts/translate.mjs');
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, TRANSLATE_FAKE: '1' } });
  try {
    await fs.mkdir(path.join(root, 'src/install'), { recursive: true });
    const source = await fs.readFile(new URL('./__fixtures__/translate/install/README.md', import.meta.url), 'utf8');
    await fs.writeFile(path.join(root, 'src/install/README.md'), source);
    await fs.mkdir(path.join(root, 'src/.vuepress'), { recursive: true });
    await fs.writeFile(path.join(root, 'src/.vuepress/ignored.md'), 'ignore');
    await fs.writeFile(path.join(root, 'src/install/file.png'), 'asset');
    assert.equal(run('--check').status, 1);
    await assert.rejects(fs.access(path.join(root, 'src/en')));
    const first = run('--concurrency', '2');
    assert.equal(first.status, 0, first.stderr);
    const target = path.join(root, 'src/en/install/README.md');
    const output = await fs.readFile(target, 'utf8');
    const fm = yaml.load(output.match(/^---\n([\s\S]*?)\n---/)[1]);
    assert.equal(fm.title, 'EN: Установка');
    assert.equal(fm.order, 7);
    assert.equal(fm.home, false);
    assert.deepEqual(fm.redirectFrom, ['/en/old-install/']);
    assert.deepEqual(fm.tag, ['EN: установка']);
    assert.equal(fm.source_hash, sourceHash(source));
    assert.ok(output.includes('## EN: Установка {#установка}'));
    assert.ok(output.includes('## EN: Установка {#установка-1}'));
    assert.ok(output.includes('](/en/configure/#настройка)'));
    assert.ok(output.includes('](../../img/setup.png)'));
    assert.ok(output.includes("echo 'Привет'"));
    await assert.rejects(fs.access(path.join(root, 'src/en/install/file.png')));
    assert.equal(run('--check').status, 0);
    assert.equal(run('--check', '--force', '--only', 'no-match').status, 0);
    assert.equal(run('--check', '--force', '--only', 'install').status, 1);
    await fs.writeFile(path.join(root, 'src/en/orphan.md'), 'extra');
    assert.equal(run('--check').status, 1);
    await fs.access(path.join(root, 'src/en/orphan.md'));
    assert.equal(run().status, 0);
    await assert.rejects(fs.access(path.join(root, 'src/en/orphan.md')));
    assert.equal(run('--concurrency', '0').status, 1);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('LLM retries malformed chunks and 5xx, keeps failed files and continues others', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-translate-http-'));
  const calls = new Map();
  const server = http.createServer(async (req, res) => {
    let raw = '';
    for await (const part of req) raw += part;
    const data = JSON.parse(raw);
    assert.equal(req.url, '/v1/chat/completions');
    assert.equal(req.headers.authorization, 'Bearer test-key');
    assert.equal(data.temperature, 0.1);
    assert.equal(data.model, 'test-model');
    assert.deepEqual(data.chat_template_kwargs, { enable_thinking: false });
    const text = data.messages[1].content;
    const kind = text.includes('BROKEN') ? 'broken' : text.includes('RECOVER') ? 'recover' : 'good';
    const count = (calls.get(kind) ?? 0) + 1;
    calls.set(kind, count);
    if (kind === 'recover' && count === 1) { res.writeHead(503).end(); return; }
    let content = text;
    if (kind === 'broken' || (kind === 'recover' && count === 2)) content = text.replace(/⟦\d+⟧/, '');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ choices: [{ message: { content } }] }));
  });
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    await fs.mkdir(path.join(root, 'src/en'), { recursive: true });
    for (const name of ['BROKEN', 'RECOVER', 'GOOD']) await fs.writeFile(path.join(root, `src/${name}.md`), `## ${name}\n\nText with \`ENV\`\n`);
    await fs.writeFile(path.join(root, 'src/en/BROKEN.md'), 'old translation');
    const result = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [path.resolve('scripts/translate.mjs'), '--concurrency', '2'], {
        cwd: root, env: { ...process.env, TRANSLATE_FAKE: '', LLM_BASE_URL: `http://127.0.0.1:${server.address().port}/v1`, LLM_API_KEY: 'test-key', LLM_MODEL: 'test-model' },
      });
      let stderr = '';
      child.stderr.on('data', (s) => { stderr += s; });
      child.stdout.resume();
      child.on('error', reject);
      child.on('exit', (code) => resolve({ code, stderr }));
    });
    assert.equal(result.code, 1);
    assert.match(result.stderr, /BROKEN.md: Missing/);
    assert.equal(calls.get('broken'), 3);
    assert.equal(calls.get('recover'), 3);
    assert.equal(calls.get('good'), 1);
    assert.equal(await fs.readFile(path.join(root, 'src/en/BROKEN.md'), 'utf8'), 'old translation');
    for (const name of ['GOOD', 'RECOVER']) assert.match(await fs.readFile(path.join(root, `src/en/${name}.md`), 'utf8'), /source_hash:/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(root, { recursive: true, force: true });
  }
});

// --check must run from a clean checkout without node_modules.
test('check has no dependencies; env is mandatory; TARGET_LOCALES and github output', async () => {
  const { TARGET_LOCALES } = await import('./translate-lib.mjs');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-check-'));
  try {
    await fs.mkdir(path.join(root, 'scripts'));
    await fs.mkdir(path.join(root, 'src'));
    for (const file of ['translate.mjs', 'translate-lib.mjs']) await fs.copyFile(path.resolve('scripts', file), path.join(root, 'scripts', file));
    await fs.writeFile(path.join(root, 'src/a.md'), '# Source');
    const summary = path.join(root, 'summary.md');
    const env = { ...process.env, TRANSLATE_FAKE: '', LLM_BASE_URL: '', LLM_MODEL: '', LLM_API_KEY: '', GITHUB_STEP_SUMMARY: summary };
    const run = (...args) => spawnSync(process.execPath, ['scripts/translate.mjs', ...args], { cwd: root, env, encoding: 'utf8' });
    const missing = run();
    assert.equal(missing.status, 2);
    for (const key of ['LLM_BASE_URL', 'LLM_MODEL', 'LLM_API_KEY']) assert.ok(missing.stderr.includes(key));
    const check = run('--check', '--format', 'github');
    assert.equal(check.status, 1, check.stderr);
    for (const locale of TARGET_LOCALES) {
      assert.ok(check.stdout.includes(`::warning file=src/a.md::Нет/устарел перевод (${locale}): src/${locale}/a.md. Обнови: node scripts/translate.mjs --only a.md`));
      await fs.mkdir(path.join(root, 'src', locale), { recursive: true });
      await fs.writeFile(path.join(root, 'src', locale, 'a.md'), `---\nsource_hash: ${sourceHash('# Source')}\n---\nTranslation`);
    }
    assert.match(await fs.readFile(summary, 'utf8'), /\| Исходник \| Локаль \|/);
    assert.equal(run('--check').status, 0);
    assert.equal(run('--check', '--locale', TARGET_LOCALES[0]).status, 0);
    assert.equal(run('--check', '--locale', 'unknown').status, 1);
    assert.equal(run('--check', '--changed-since', 'no-such-ref').status, 1);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('changed-since checks only changed sources, including deleted sources and locale filtering', async () => {
  const { main } = await import('./translate.mjs');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'storm-changed-'));
  const lines = [];
  const log = console.log;
  try {
    await fs.mkdir(path.join(root, 'src/en'), { recursive: true });
    for (const file of ['changed.md', 'untouched.md']) await fs.writeFile(path.join(root, 'src', file), '# Source');
    await fs.writeFile(path.join(root, 'src/en/deleted.md'), 'Old translation');
    await fs.writeFile(path.join(root, 'src/en/untouched-orphan.md'), 'Old translation');
    console.log = (line) => lines.push(line);
    const list = (ref) => {
      assert.equal(ref, 'origin/main');
      return ['src/changed.md', 'src/deleted.md', 'src/en/untouched.md', 'src/.vuepress/ignored.md'];
    };
    assert.equal(await main(['--check', '--changed-since', 'origin/main'], root, list), 1);
    assert.deepEqual(lines.sort(), ['extra (en): deleted.md', 'missing (en): changed.md']);
    lines.length = 0;
    assert.equal(await main(['--check', '--changed-since', 'origin/main', '--only', 'untouched'], root, list), 0);
    assert.deepEqual(lines, []);
  } finally { console.log = log; await fs.rm(root, { recursive: true, force: true }); }
});

test('addHeadingIds keeps explicit suffixed id when the duplicate lands in another chunk', () => {
  const ru = '## Сетевые требования {#сетевые-требования-1}\n\nтекст\n';
  const en = '## Network requirements\n\ntext\n';
  assert.match(addHeadingIds(ru, en), /\{#сетевые-требования-1\}/);
});

test('rewriteLinks treats any non-page extension as an asset, but not dots in anchors', () => {
  const out = rewriteLinks('[q](./adoption-pulse/queries.sql) [p](/assets/v/verify.py) [a](/install/a.md#v6.6) [d](/configure/#x)', 'recipes/A.md');
  assert.ok(out.includes('[q](../../recipes/adoption-pulse/queries.sql)'), out);
  assert.ok(out.includes('[p](/assets/v/verify.py)'), out);
  assert.ok(out.includes('[a](/en/install/a.md#v6.6)'), out);
  assert.ok(out.includes('[d](/en/configure/#x)'), out);
});

test('localizeRedirect moves old addresses under /en/', async () => {
  const { localizeRedirect } = await import('./translate-lib.mjs');
  assert.equal(localizeRedirect('/configure/SECURE.html'), '/en/configure/SECURE.html');
  assert.equal(localizeRedirect('/en/x.html'), '/en/x.html');
});
