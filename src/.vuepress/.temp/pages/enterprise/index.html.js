import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/index.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/\",\"title\":\"Enterprise-версия\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":-3,\"link\":false,\"text\":\"Enteprise-версия\",\"collapsible\":true},\"index\":false,\"icon\":\"file\"},\"headers\":[],\"git\":{},\"readingTime\":{\"minutes\":0.06,\"words\":17},\"filePathRelative\":\"enterprise/README.md\",\"excerpt\":\"\\n\\n\"}")
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
