import comp from "C:/Users/kotov/stormbpmn-documentation2/docs/src/.vuepress/.temp/pages/docs/how-to/index.html.vue"
const data = JSON.parse("{\"path\":\"/docs/how-to/\",\"title\":\"Как ... ?\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[],\"readingTime\":{\"minutes\":0.03,\"words\":9},\"filePathRelative\":\"docs/how-to/index.md\"}")
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
