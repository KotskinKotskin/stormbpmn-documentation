import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import yandexMetrikaPlugin from "vuepress-plugin-yandex-metrika";

export default defineUserConfig({
    base: "/",
    lang: "ru-RU",

    title: "База знаний Enterprise Stormbpmn",
    description: "Всё о Enterprise-версии Stormbpmn",
    head: [["link", { rel: "icon", href: "favicon.svg", type: "image/svg+xml" }]],

    theme: hopeTheme({
        fullscreen: true,
        plugins: {
            searchPro: {
                indexContent: true,
            },
            copyCode: {},
            mdEnhance: {
                mark: true,
                align: true,
                attrs: false,
                tasklist: true,
                hint: true,
            },
        },
        repo: "KotskinKotskin/stormbpmn-documentation",
        // Customising the header label
        // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
        repoLabel: "Улучшить документацию",
        repoDisplay: true,
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
            "/",

            "/get-started",
            {
                text: "🚀 Установка",
                children: ["/install/", "/install/FULL_INSTALL.html"],
            },
            {
                text: "⚙️ Конфигурация",
                children: ["/configure/", "/configure/SECURE.html"],
            },
            "/operation/",
            "/REST%20API/",
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
