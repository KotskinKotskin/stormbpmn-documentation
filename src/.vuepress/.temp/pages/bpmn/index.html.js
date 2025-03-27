import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/index.html.vue"
const data = JSON.parse("{\"path\":\"/bpmn/\",\"title\":\"Что такое BPMN\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":-1,\"link\":false,\"text\":\"Что такое BPMN\",\"collapsible\":true,\"collapsed\":true},\"index\":false,\"icon\":\"circle-nodes\"},\"headers\":[],\"git\":{},\"readingTime\":{\"minutes\":0.08,\"words\":25},\"filePathRelative\":\"bpmn/README.md\",\"excerpt\":\"\\n<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">Предупреждение</p>\\n<p>Раздел в разработке</p>\\n</div>\\n\"}")
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
