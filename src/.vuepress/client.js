import { defineClientConfig } from "@vuepress/client";
import LatestChangelog from "./components/LatestChangelog.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("LatestChangelog", LatestChangelog);
  },
});
