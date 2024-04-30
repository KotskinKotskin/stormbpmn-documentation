import comp from "C:/Users/kotov/stormbpmn-documentation2/docs/src/.vuepress/.temp/pages/api/rest-api.html.vue"
const data = JSON.parse("{\"path\":\"/api/rest-api.html\",\"title\":\"Enterprise-версия\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":-3,\"link\":true,\"text\":\"Rest API\",\"collapsible\":false},\"index\":true,\"icon\":\"gears\"},\"headers\":[{\"level\":2,\"title\":\"Авторизация\",\"slug\":\"авторизация\",\"link\":\"#авторизация\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.1,\"words\":31},\"filePathRelative\":\"api/rest-api.md\"}")
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
