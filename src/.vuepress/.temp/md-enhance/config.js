import { defineClientConfig } from "vuepress/client";
import { useHintContainers } from "D:/StormBPMN/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/composables/useHintContainers.js";
import "D:/StormBPMN/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/hint/index.scss";
import "D:/StormBPMN/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/tasklist.scss";

export default defineClientConfig({
  enhance: ({ app }) => {

  },
  setup: () => {
useHintContainers();
  }
});
