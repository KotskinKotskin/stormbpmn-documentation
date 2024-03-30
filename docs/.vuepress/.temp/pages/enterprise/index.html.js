import comp from "C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/enterprise/index.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/\",\"title\":\"Enterprise-версия\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Архитектура\",\"slug\":\"архитектура\",\"link\":\"#архитектура\",\"children\":[]},{\"level\":2,\"title\":\"Инструкция по установке\",\"slug\":\"инструкция-по-установке\",\"link\":\"#инструкция-по-установке\",\"children\":[]},{\"level\":2,\"title\":\"Админинистративный интерфейс\",\"slug\":\"админинистративныи-интерфеис\",\"link\":\"#админинистративныи-интерфеис\",\"children\":[]}],\"git\":{\"updatedTime\":null,\"contributors\":[]},\"filePathRelative\":\"enterprise/index.md\"}")
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
