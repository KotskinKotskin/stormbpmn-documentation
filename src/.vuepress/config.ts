import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import yandexMetrikaPlugin from "vuepress-plugin-yandex-metrika";
import { redirectPlugin } from "@vuepress/plugin-redirect";
import { viteBundler } from "@vuepress/bundler-vite";
import fs from "fs";
import path from "path";

// Читаем changelog файлы и получаем последний релиз
function getLatestRelease() {
    const changelogDir = path.resolve(__dirname, "../Changelog");
    const files = fs.readdirSync(changelogDir);

    const releases = files
        .filter((file) => /^\d+\.\d+\.\d+\.md$/.test(file))
        .map((file) => {
            const version = file.replace(".md", "");
            const filePath = path.join(changelogDir, file);
            const content = fs.readFileSync(filePath, "utf-8");
            
            // Пытаемся извлечь дату из заголовка "Версия X.X.X от DD.MM.YYYY"
            const dateMatch = content.match(/от\s+(\d{2}\.\d{2}\.\d{4})/);
            let date = dateMatch ? dateMatch[1] : null;
            
            // Fallback: дата создания/модификации файла
            if (!date) {
                const stats = fs.statSync(filePath);
                const fileDate = stats.birthtime || stats.mtime;
                date = fileDate.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit", 
                    year: "numeric"
                });
            }

            // Парсим версию для сортировки
            const [major, minor, patch] = version.split(".").map(Number);
            const versionNum = major * 100000000 + minor * 10000 + patch;

            return { version, date, versionNum };
        })
        .sort((a, b) => b.versionNum - a.versionNum);

    return releases[0] || null;
}

const latestRelease = getLatestRelease();

export default defineUserConfig({
    bundler: viteBundler({
        viteOptions: {
            define: {
                __LATEST_RELEASE__: JSON.stringify(latestRelease),
            },
        },
    }),
    base: "/",
    lang: "ru-RU",

    title: "Storm Enterprise",
    description: "Всё о Enterprise-версии Stormbpmn",
    head: [["link", { rel: "icon", href: "favicon.svg", type: "image/svg+xml" }]],

    theme: hopeTheme({
        fullscreen: true,
        plugins: {
            searchPro: {
                indexContent: true,
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
                attrs: false,
                tasklist: true,
                hint: true,
                component: true,
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

        logo: "https://new.stormbpmn.com/favicon.svg",

        navbar: [
            {
                text: "🚀 Установка",
                children: ["/install/", "/install/production/"],
            },
            {
                text: "⚙️ Конфигурация",
                children: ["/configure/", "/configure/security/"],
            },
            {
                text: "🤖 AI-ассистент",
                children: ["/ai/", "/ai/AI_CHAT.html", "/ai/KnowledgeBase.html", "/ai/self-hosted-llm/"],
            },
            "/operation/",
            "/support/",
            "/Changelog/",
            {
                text: "💼 Обсудить покупку",
                link: "https://stormbpmn.com/contact-sales",
                ariaLabel: "Обсудить покупку Enterprise версии",
            },
        ],
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
