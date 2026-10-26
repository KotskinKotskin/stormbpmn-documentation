import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import yandexMetrikaPlugin from "vuepress-plugin-yandex-metrika";
import { redirectPlugin } from "@vuepress/plugin-redirect";
import { viteBundler } from "@vuepress/bundler-vite";
import fs from "fs";
import path from "path";

// Инлайн-разметка в текст: в таймлайне пункты рендерятся как обычные строки,
// markdown там не парсится, и сырые [текст](ссылка) / **жирный** читались бы мусором.
function stripInlineMarkdown(text: string): string {
    return text
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/__([^_]+)__/g, "$1")
        .replace(/\s*\{#[^}]+\}\s*$/, "")
        .replace(/\s+/g, " ")
        .trim();
}

// Разбираем страницу релиза на секции «## …» с их буллитами.
// Осознанно консервативно: собираем только верхнеуровневые пункты и глушим сбор
// внутри код-блоков и контейнеров (::: details / ::: warning), где живут
// docker-команды и дисклеймеры — в ленте изменений им делать нечего.
function parseReleaseSections(content: string) {
    const sections: { icon: string; title: string; items: string[] }[] = [];

    let current: (typeof sections)[number] | null = null;
    let insideFence = false;

    for (const line of content.split(/\r?\n/)) {
        if (line.startsWith("```")) {
            insideFence = !insideFence;
            continue;
        }
        if (insideFence) continue;

        if (line.startsWith(":::")) {
            current = null;
            continue;
        }

        const heading = /^##\s+(.+?)\s*$/.exec(line);
        if (heading) {
            const title = stripInlineMarkdown(heading[1]);
            // Ведущий эмодзи — готовая иконка секции; в чипе он несёт смысл
            // («что за изменения»), в заголовке остаётся только текст.
            const icon = /^([^\p{L}\p{N}\s]+)\s*/u.exec(title);

            current = {
                icon: icon ? icon[1] : "",
                title: icon ? title.slice(icon[0].length) : title,
                items: [],
            };
            sections.push(current);
            continue;
        }

        if (!current) continue;

        const bullet = /^[-*]\s+(.+?)\s*$/.exec(line);
        if (bullet) current.items.push(stripInlineMarkdown(bullet[1]));
    }

    return sections.filter((section) => section.items.length > 0);
}

// Читаем changelog-файлы и получаем список релизов, новые первыми
function readReleases(dir: string, routePrefix: string) {
    const changelogDir = path.resolve(__dirname, dir);
    const files = fs.existsSync(changelogDir) ? fs.readdirSync(changelogDir) : [];

    return files
        .filter((file) => /^\d+\.\d+\.\d+\.md$/.test(file))
        .map((file) => {
            const version = file.replace(".md", "");
            const filePath = path.join(changelogDir, file);
            const content = fs.readFileSync(filePath, "utf-8");

            // Пытаемся извлечь дату из заголовка "Версия X.X.X от DD.MM.YYYY"
            const dateMatch = content.match(/^#{1,6}\s+(.+)$/m)?.[1].match(/\d{2}\.\d{2}\.\d{4}/);
            let date = dateMatch ? dateMatch[0] : null;

            // Fallback: дата создания/модификации файла
            if (!date) {
                const stats = fs.statSync(filePath);
                const fileDate = stats.birthtime || stats.mtime;
                date = fileDate.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            }

            // Парсим версию для сортировки
            const [major, minor, patch] = version.split(".").map(Number);
            const versionNum = major * 100000000 + minor * 10000 + patch;

            return { version, date, versionNum, path: `${routePrefix}/${version}.html`, sections: parseReleaseSections(content) };
        })
        .sort((a, b) => b.versionNum - a.versionNum);
}

const releases = readReleases("../Changelog", "/Changelog");
const enReleases = readReleases("../en/Changelog", "/en/Changelog");
const latest = (items: typeof releases) => items[0]
    ? { version: items[0].version, date: items[0].date, path: items[0].path }
    : null;
const latestRelease = { "ru-RU": latest(releases), "en-US": latest(enReleases) ?? latest(releases) };

for (const [filename, items] of [["changelog-index.json", releases], ["changelog-index.en.json", enReleases]] as const) {
    fs.writeFileSync(path.resolve(__dirname, "public", filename),
        JSON.stringify(items.map(({ version, date, path, sections }) => ({ version, date, path, sections }))), "utf-8");
}

export default defineUserConfig({
    bundler: viteBundler({
        viteOptions: {
            define: {
                __LATEST_RELEASE__: JSON.stringify(latestRelease),
            },
        },
    }),
    base: "/",
    locales: {
        "/": { lang: "ru-RU", title: "Storm Enterprise", description: "Всё о Enterprise-версии Stormbpmn" },
        "/en/": { lang: "en-US", title: "Storm Enterprise", description: "Everything about Stormbpmn Enterprise" },
    },

    title: "Storm Enterprise",
    description: "Всё о Enterprise-версии Stormbpmn",
    head: [
        // Раньше здесь висел favicon.svg, которого в public/ не было, — браузер
        // молча падал на /favicon.ico. Оба файла теперь лежат рядом и оба брендовые.
        ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
        ["link", { rel: "alternate icon", href: "/favicon.ico", sizes: "any" }],
        // Onest (тело) и Luna (h1/h2) нужны на первом экране. Без preload браузер
        // узнаёт о них только разобрав CSS — это лишний круг и заметный FOUT.
        // JetBrains Mono не преloadим: он нужен только в код-блоках, ниже сгиба.
        [
            "link",
            { rel: "preload", href: "/assets/fonts/Onest-cyr-lat.woff2", as: "font", type: "font/woff2", crossorigin: "" },
        ],
        [
            "link",
            { rel: "preload", href: "/assets/fonts/HS_LunaObscura.woff2", as: "font", type: "font/woff2", crossorigin: "" },
        ],
        // AI-помощник по документации: плавающая кнопка «Спросить AI» (Ctrl/⌘+I), отвечает
        // строго по содержимому этого сайта и даёт ссылки на разделы.
        //
        // Скрипт самодостаточный — ни сборки, ни зависимостей. Ручку он дёргает по адресу
        // /ai/ask НА ЭТОМ ЖЕ домене (nginx проксирует её в сервис), поэтому запрос
        // same-origin и CORS не участвует. Ключей в разметке нет и быть не может.
        //
        // Горячая клавиша НЕ Ctrl+K: её занимает встроенный поиск (search-pro).
        ["script", { src: "https://stormbpmn.com/docs-chat/widget.js", defer: "" }],
    ],

    theme: hopeTheme({
        hostname: "https://enterprise.stormbpmn.com",
        fullscreen: true,
        plugins: {
            seo: {
                customHead: (head, page) => {
                    head.push(["link", { rel: "alternate", hreflang: page.lang.toLowerCase(), href: `https://enterprise.stormbpmn.com${page.path}` }]);
                },
            },
            searchPro: {
                indexContent: true,
                locales: {
                    "/": { placeholder: "Поиск", search: "Поиск" },
                    "/en/": { placeholder: "Search documentation", search: "Search" },
                },
            },
            copyCode: {},
            components: {
                rootComponents: {
                    notice: [],
                },
            },
            mdEnhance: {
                mark: true,
                align: true,
                attrs: true,
                tasklist: true,
                hint: true,
                component: true,
                // Диаграммы прямо в тексте страницы: ```mermaid. Рендерятся на клиенте и
                // грузятся динамически — на страницах без диаграмм библиотека не подтягивается.
                mermaid: true,
            },
        },
        repo: "KotskinKotskin/stormbpmn-documentation",
        // Customising the header label
        // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
        repoLabel: "Улучшить документацию",
        repoDisplay: false,
        // Optional options for generating "Edit this page" link

        // if your docs are in a different repo from your main project:
        docsRepo: "KotskinKotskin/stormbpmn-documentation",
        // if your docs are not at the root of the repo:
        docsDir: "src",
        // if your docs are in a specific branch (defaults to 'master'):
        docsBranch: "main",
        // defaults to false, set to true to enable
        editLink: true,
        headerDepth: 2,
        footer: "",
        hotReload: true,
        iconAssets: "fontawesome",
        lastUpdated: true, // string | boolean,
        sidebar: "structure",

        // Полный словознак вместо иконки с чужого домена. Светлый/тёмный вариант
        // отличаются только цветом надписи — тема сама переключает их по data-theme.
        logo: "/storm-logo.svg",
        logoDark: "/storm-logo-dark.svg",
        // В словознаке уже есть «STORM», поэтому имя сайта в шапке сведено к
        // квалификатору (иначе «STORM Storm Enterprise»). SEO-title не меняется.
        navbarTitle: "Enterprise",
        hideSiteNameOnMobile: true,
        // Раскладка темы по умолчанию + кнопка AI-помощника (AskAi, client.js) перед поиском.
        navbarLayout: {
            start: ["Brand"],
            center: ["Links"],
            end: ["Language", "Repo", "AskAi", "Outlook", "Search"],
        },

        locales: {
            "/": {
                navbarTitle: "Enterprise",
                repoLabel: "Улучшить документацию",
                navbar: [
                    {
                        text: "🚀 Установка",
                        children: ["/install/", "/install/production/"],
                    },
                    {
                        text: "⚙️ Конфигурация",
                        children: ["/configure/", "/configure/branding.html", "/configure/security/"],
                    },
                    {
                        text: "🤖 AI-ассистент",
                        children: ["/ai/", "/ai/AI_CHAT.html", "/ai/KnowledgeBase.html", "/ai/self-hosted-llm/", "/ai/voice-input.html", "/ai/retention.html"],
                    },
                    {
                        text: "📊 Симуляции",
                        children: ["/simulation/", "/simulation/install.html", "/simulation/operation.html"],
                    },
                    {
                        text: "🏛 Архитектурное ревью",
                        children: [
                            "/architecture/",
                            "/architecture/processes.html",
                            "/architecture/roles-raci.html",
                            "/architecture/user-management.html",
                            "/architecture/functional-requirements.html",
                            "/architecture/system-design.html",
                        ],
                    },
                    // Короткие подписи: заголовки страниц («Администрирование системы»,
                    // «Каналы поддержки») не помещаются в одну строку навбара.
                    { text: "Администрирование", link: "/operation/" },
                    { text: "Поддержка", link: "/support/" },
                    "/Changelog/",
                    {
                        text: "💼 Обсудить покупку",
                        link: "https://stormbpmn.com/contact-sales",
                        ariaLabel: "Обсудить покупку Enterprise версии",
                    },
                ],
            },
            "/en/": {
                navbarTitle: "Enterprise",
                repoLabel: "Improve documentation",
                navbar: [
                    {
                        text: "🚀 Installation",
                        children: ["/en/install/", "/en/install/production/"],
                    },
                    {
                        text: "⚙️ Configuration",
                        children: ["/en/configure/", "/en/configure/branding.html", "/en/configure/security/"],
                    },
                    {
                        text: "🤖 AI assistant",
                        children: ["/en/ai/", "/en/ai/AI_CHAT.html", "/en/ai/KnowledgeBase.html", "/en/ai/self-hosted-llm/", "/en/ai/voice-input.html", "/en/ai/retention.html"],
                    },
                    {
                        text: "📊 Simulations",
                        children: ["/en/simulation/", "/en/simulation/install.html", "/en/simulation/operation.html"],
                    },
                    {
                        text: "🏛 Architecture review",
                        children: [
                            "/en/architecture/",
                            "/en/architecture/processes.html",
                            "/en/architecture/roles-raci.html",
                            "/en/architecture/user-management.html",
                            "/en/architecture/functional-requirements.html",
                            "/en/architecture/system-design.html",
                        ],
                    },
                    { text: "Administration", link: "/en/operation/" },
                    { text: "Support", link: "/en/support/" },
                    { text: "Changelog", link: "/en/Changelog/" },
                    {
                        text: "💼 Contact sales",
                        link: "https://stormbpmn.com/contact-sales",
                        ariaLabel: "Contact Enterprise sales",
                    },
                ],
            },
        },
    }),
    plugins: [
        // Старые URL остаются живыми после переноса страниц (см. frontmatter redirectFrom).
        // Важно для ссылок из автопубликуемого Changelog и из приложения.
        redirectPlugin({}),
        yandexMetrikaPlugin({
            id: "96951202",
            config: {
                clickmap: false,
                trackLinks: true,
                accurateTrackBounce: true,
                ecommerce: "dataLayer",
            },
        }),
    ],
});
