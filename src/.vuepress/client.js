import { defineClientConfig } from "@vuepress/client";
import LatestChangelog from "./components/LatestChangelog.vue";
import ChangelogTimeline from "./components/ChangelogTimeline.vue";
import AskAiButton from "./components/AskAiButton.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("LatestChangelog", LatestChangelog);
    app.component("ChangelogTimeline", ChangelogTimeline);
    app.component("AskAi", AskAiButton);
  },
});
