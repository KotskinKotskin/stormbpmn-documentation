import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setupDocsLanguage } from '../src/.vuepress/docs-language.js';

async function scenario({ path = '/guide/#section', language = 'en-US', saved, visited, bot = false, missing = false, blocked = false } = {}) {
  const pages = ['/', '/guide/', ...(missing ? [] : ['/en/', '/en/guide/'])];
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/:catchAll(.*)', name: 'vuepress-route', component: {} },
  ] });
  await router.push(path);
  const local = new Map(saved ? [['docs-lang', saved]] : []);
  const session = new Map(visited ? [['docs-lang-visited', '1']] : []);
  const storage = (map) => ({ getItem(key) { if (blocked) throw Error('disabled'); return map.get(key); }, setItem(key, value) { if (blocked) throw Error('disabled'); map.set(key, value); } });
  let click;
  await setupDocsLanguage(router, (path) => ({ notFound: !pages.includes(path) }), {
    navigator: { languages: [language], userAgent: bot ? 'Googlebot' : 'Firefox' },
    localStorage: storage(local), sessionStorage: storage(session),
    location: { origin: 'https://docs.test', href: 'https://docs.test' + path },
    document: { addEventListener(type, handler) { assert.equal(type, 'click'); click = handler; } },
  });
  return { router, local, click };
}

test('browser language redirects only initially, retains hash, never redirects bots or missing pages', async () => {
  const en = await scenario();
  assert.equal(en.router.currentRoute.value.fullPath, '/en/guide/#section');
  assert.equal(en.local.size, 0);
  await en.router.push('/');
  assert.equal(en.router.currentRoute.value.path, '/');
  for (const options of [{ language: 'ru-RU' }, { language: 'uk' }, { language: 'be' }, { language: 'kk-KZ' }, { bot: true }, { missing: true }, { visited: true }]) {
    assert.equal((await scenario(options)).router.currentRoute.value.path, '/guide/');
  }
  assert.equal((await scenario({ path: '/en/guide/', language: 'ru' })).router.currentRoute.value.path, '/en/guide/');
  assert.equal((await scenario({ blocked: true })).router.currentRoute.value.path, '/en/guide/');
});

test('saved choice wins; user cross-locale transitions and language menu clicks persist choice', async () => {
  assert.equal((await scenario({ saved: 'ru', path: '/en/guide/?q=1#id' })).router.currentRoute.value.fullPath, '/guide/?q=1#id');
  assert.equal((await scenario({ saved: 'en', language: 'ru', visited: true })).router.currentRoute.value.path, '/en/guide/');
  const user = await scenario({ language: 'ru' });
  await user.router.push('/en/guide/');
  assert.equal(user.local.get('docs-lang'), 'en');
  const anchor = { href: 'https://docs.test/guide/', closest: () => ({ querySelector: () => ({}) }) };
  user.click({ target: { closest: () => anchor } });
  assert.equal(user.local.get('docs-lang'), 'ru');
  const same = await scenario({ language: 'ru' });
  same.click({ target: { closest: () => anchor } });
  assert.equal(same.local.get('docs-lang'), 'ru');
});
