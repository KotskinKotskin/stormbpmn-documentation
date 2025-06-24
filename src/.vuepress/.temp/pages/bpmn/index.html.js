import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/index.html.vue"
const data = JSON.parse("{\"path\":\"/bpmn/\",\"title\":\"Что такое BPMN\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":-2,\"link\":false,\"text\":\"Что такое BPMN\",\"collapsible\":true,\"collapsed\":true},\"index\":false,\"icon\":\"circle-nodes\"},\"headers\":[],\"git\":{\"createdTime\":1714504462000,\"updatedTime\":1743616778000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":2},{\"name\":\"VovaGDX\",\"email\":\"vladimir.shishkin@gmail.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":0.08,\"words\":25},\"filePathRelative\":\"bpmn/README.md\",\"localizedDate\":\"30 апреля 2024 г.\",\"excerpt\":\"\\n<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">Предупреждение</p>\\n<p>Раздел в разработке</p>\\n</div>\\n\"}")
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
