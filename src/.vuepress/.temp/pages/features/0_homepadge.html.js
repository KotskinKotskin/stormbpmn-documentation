import comp from "C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/0_homepadge.html.vue"
const data = JSON.parse("{\"path\":\"/features/0_homepadge.html\",\"title\":\"Домашная страница\",\"lang\":\"ru-RU\",\"frontmatter\":{\"index\":true,\"icon\":null,\"order\":1},\"headers\":[],\"git\":{\"createdTime\":null,\"updatedTime\":null,\"contributors\":[]},\"readingTime\":{\"minutes\":0.02,\"words\":7},\"filePathRelative\":\"features/0_homepadge.md\"}")
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
