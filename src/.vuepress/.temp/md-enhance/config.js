import { defineClientConfig } from "vuepress/client";
import { useHintContainers } from "D:/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/composables/useHintContainers.js";
import "D:/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/hint/index.scss";
import "D:/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/tasklist.scss";

export default defineClientConfig({
  enhance: ({ app }) => {

  },
  setup: () => {
useHintContainers();
  }
});
