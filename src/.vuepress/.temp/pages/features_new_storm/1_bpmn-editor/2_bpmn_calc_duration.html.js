import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/1_bpmn-editor/2_bpmn_calc_duration.html.vue"
const data = JSON.parse("{\"path\":\"/features_new_storm/1_bpmn-editor/2_bpmn_calc_duration.html\",\"title\":\"Расчёт длительности сценария\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":-6,\"dir\":{\"link\":true},\"index\":true,\"icon\":\"\"},\"headers\":[],\"git\":{\"createdTime\":1741038310000,\"updatedTime\":1742193782000,\"contributors\":[{\"name\":\"VovaGDX\",\"email\":\"vladimir.shishkin@gmail.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":0.15,\"words\":44},\"filePathRelative\":\"features_new_storm/1_bpmn-editor/2_bpmn_calc_duration.md\",\"localizedDate\":\"4 марта 2025 г.\",\"excerpt\":\"\\n<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">В разработке</p>\\n<p>Если вы указывали <a href=\\\"#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8\\\">длительность в задачах</a>, то система может посчитать время, за которое выполнится конкретный проход токена при симуляции токена, указав самые длительные операции:\\n</p>\\n</div>\"}")
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
