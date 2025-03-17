import { defineClientConfig } from "vuepress/client";
import { useHintContainers } from "C:/StormBPMN/Stormdocs 20250317/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/composables/useHintContainers.js";
import "C:/StormBPMN/Stormdocs 20250317/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/hint/index.scss";
import "C:/StormBPMN/Stormdocs 20250317/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/tasklist.scss";

export default defineClientConfig({
  enhance: ({ app }) => {

  },
  setup: () => {
useHintContainers();
  }
});
