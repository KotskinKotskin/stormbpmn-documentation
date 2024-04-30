import comp from "C:/Users/kotov/stormbpmn-documentation2/docs/src/.vuepress/.temp/pages/examples/index.html.vue"
const data = JSON.parse("{\"path\":\"/examples/\",\"title\":\"Примеры процессов в BPMN\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"1 пример\",\"slug\":\"_1-пример\",\"link\":\"#_1-пример\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.04,\"words\":11},\"filePathRelative\":\"examples/index.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
