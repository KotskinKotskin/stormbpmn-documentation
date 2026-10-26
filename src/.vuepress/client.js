import { defineClientConfig, resolveRoute } from "@vuepress/client";
import LatestChangelog from "./components/LatestChangelog.vue";
import ChangelogTimeline from "./components/ChangelogTimeline.vue";
import AskAiButton from "./components/AskAiButton.vue";
import { setupDocsLanguage } from "./docs-language.js";

export default defineClientConfig({
  enhance({ app, router }) {
    if (typeof window !== "undefined") void setupDocsLanguage(router, resolveRoute);
    app.component("LatestChangelog", LatestChangelog);
    app.component("ChangelogTimeline", ChangelogTimeline);
    app.component("AskAi", AskAiButton);
  },
});
