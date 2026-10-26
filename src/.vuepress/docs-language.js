const locale = (path) => /^\/en(?:\/|$)/.test(path) ? 'en' : 'ru';
const bots = /bot|crawl|spider|slurp|yandex|google|bing|lighthouse|headless/i;

export async function setupDocsLanguage(router, resolvePage, browser = window) {
  if (bots.test(browser.navigator.userAgent)) return;
  const read = (storage, key) => { try { return browser[storage].getItem(key); } catch { return null; } };
  const write = (storage, key, value) => { try { browser[storage].setItem(key, value); } catch { /* Storage may be disabled. */ } };
  await router.isReady();
  const current = router.currentRoute.value;
  const saved = read('localStorage', 'docs-lang');
  const first = !read('sessionStorage', 'docs-lang-visited');
  write('sessionStorage', 'docs-lang-visited', '1');
  const preferred = ['ru', 'en'].includes(saved) ? saved :
    first && !/^(ru|uk|be|kk)/i.test(browser.navigator.languages?.[0] || browser.navigator.language || 'ru') ? 'en' : null;
  // A direct English link stays English unless the reader saved a preference.
  if (preferred && locale(current.path) !== preferred) {
    const path = preferred === 'en' ? '/en' + current.path : current.path.replace(/^\/en(?=\/|$)/, '') || '/';
    const resolved = router.resolve(path);
    // VuePress rc.9 uses one catch-all route, so router.resolve alone cannot detect 404s.
    if (!resolvePage(resolved.path).notFound && resolved.path !== '/404.html') {
      await router.replace({ path, query: current.query, hash: current.hash });
    }
  }
  // Capture language links, including full-page navigation and modified clicks.
  browser.document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    const url = new URL(anchor.href, browser.location.href);
    const languageItem = anchor.closest('.vp-nav-item')?.querySelector('.i18n-icon');
    if (url.origin === browser.location.origin && (languageItem || locale(url.pathname) !== locale(router.currentRoute.value.path))) {
      write('localStorage', 'docs-lang', locale(url.pathname));
    }
  }, true);
  router.afterEach((to, from, failure) => {
    if (!failure && locale(to.path) !== locale(from.path)) write('localStorage', 'docs-lang', locale(to.path));
  });
}
