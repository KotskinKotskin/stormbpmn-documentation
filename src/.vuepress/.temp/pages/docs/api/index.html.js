import comp from "C:/Users/kotov/stormbpmn-documentation2/docs/src/.vuepress/.temp/pages/docs/api/index.html.vue"
const data = JSON.parse("{\"path\":\"/docs/api/\",\"title\":\"API\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Авторизация\",\"slug\":\"авторизация\",\"link\":\"#авторизация\",\"children\":[]}],\"readingTime\":{\"minutes\":0.05,\"words\":15},\"filePathRelative\":\"docs/api/index.md\"}")
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
