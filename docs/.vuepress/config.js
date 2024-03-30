import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress/cli";
import { viteBundler } from "@vuepress/bundler-vite";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
  base: "",
  lastUpdated: true,
  lang: "ru-RU",

  title: "База знаний ",
  description: "Подробная документация о том, как решать ваши задачи с помощью Stormbpmn",
  head: [
    ['link', { rel: 'icon', href: 'favicon.svg', type: 'image/svg+xml' }],
  ],
  theme: defaultTheme({
    repo: 'KotskinKotskin/stormbpmn-documentation',
    // Customising the header label
    // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
    repoLabel: 'Улучшить документацию',

    // Optional options for generating "Edit this page" link

    // if your docs are in a different repo from your main project:
    docsRepo: 'KotskinKotskin/stormbpmn-documentation',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'main',
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Помогите нам улучшить документацию',
    displayAllHeaders: true,
    smoothScroll: true,
    lastUpdated: 'Обновлено', // string | boolean,
    sidebar: ["/", "/get-started", "/real-life-scenarios/", "/features/", "/team-work/", "/api/", "/examples/", "/usefull-link/", "/how-to/", "/enterprise/"],
    logo: "https://stormbpmn.com/static/img/bpmnstorm_small.png",

    navbar: ["/", "/get-started"],
  }),
  plugins: [
    searchPlugin({
      // options
    }),
  ],
  bundler: viteBundler(),
});
