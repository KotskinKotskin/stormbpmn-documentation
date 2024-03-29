import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress/cli";
import { viteBundler } from "@vuepress/bundler-vite";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
  base: "",
  lastUpdated: true,
  lang: "ru-RU",

  title: "Документация Stormbpmn",
  description: "Подробная документация обо всех функциях stormbpmn.com",

  theme: defaultTheme({
    repo: 'vuejs/vuepress',
    // Customising the header label
    // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
    repoLabel: 'Contribute!',

    // Optional options for generating "Edit this page" link

    // if your docs are in a different repo from your main project:
    docsRepo: 'vuejs/vuepress',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Help us improve this page!',
    displayAllHeaders: true,
    smoothScroll: true,
    lastUpdated: 'Last Updated', // string | boolean,
    sidebar: ["/", "/get-started", "/guide/"],
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
