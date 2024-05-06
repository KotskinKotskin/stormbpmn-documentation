import comp from "C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/free_course/1_lesson.html.vue"
const data = JSON.parse("{\"path\":\"/free_course/1_lesson.html\",\"title\":\"\",\"lang\":\"ru-RU\",\"frontmatter\":{\"index\":false},\"headers\":[],\"git\":{\"createdTime\":null,\"updatedTime\":null,\"contributors\":[]},\"readingTime\":{\"minutes\":0.01,\"words\":2},\"filePathRelative\":\"free_course/1_lesson.md\"}")
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
