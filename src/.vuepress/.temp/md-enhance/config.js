import { defineClientConfig } from "vuepress/client";
import { useHintContainers } from "C:/Users/Lenovo/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/composables/useHintContainers.js";
import "C:/Users/Lenovo/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/hint/index.scss";
import "C:/Users/Lenovo/stormbpmn-documentation/node_modules/vuepress-plugin-md-enhance/lib/client/styles/tasklist.scss";

export default defineClientConfig({
  enhance: ({ app }) => {

  },
  setup: () => {
useHintContainers();
  }
});
