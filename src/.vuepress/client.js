import { defineClientConfig } from "@vuepress/client";
import LatestChangelog from "./components/LatestChangelog.vue";
import ChangelogTimeline from "./components/ChangelogTimeline.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("LatestChangelog", LatestChangelog);
    app.component("ChangelogTimeline", ChangelogTimeline);
  },
});
