import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/1_bpmn-editor/2_versioning.html.vue"
const data = JSON.parse("{\"path\":\"/features_new_storm/1_bpmn-editor/2_versioning.html\",\"title\":\"Версионирование\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":-5,\"dir\":{\"link\":true},\"index\":true,\"icon\":\"\"},\"headers\":[{\"level\":2,\"title\":\"Просмотр версий процесса\",\"slug\":\"просмотр-версии-процесса\",\"link\":\"#просмотр-версии-процесса\",\"children\":[]},{\"level\":2,\"title\":\"Восстановление процесса из предыдущей версии\",\"slug\":\"восстановление-процесса-из-предыдущеи-версии\",\"link\":\"#восстановление-процесса-из-предыдущеи-версии\",\"children\":[]},{\"level\":2,\"title\":\"Видео с примером просмотра версии, восстановление схемы из версии:\",\"slug\":\"видео-с-примером-просмотра-версии-восстановление-схемы-из-версии\",\"link\":\"#видео-с-примером-просмотра-версии-восстановление-схемы-из-версии\",\"children\":[]},{\"level\":2,\"title\":\"Сравнение версий\",\"slug\":\"сравнение-версии\",\"link\":\"#сравнение-версии\",\"children\":[]}],\"git\":{\"createdTime\":1741038310000,\"updatedTime\":1746459619000,\"contributors\":[{\"name\":\"VovaGDX\",\"email\":\"vladimir.shishkin@gmail.com\",\"commits\":2}]},\"readingTime\":{\"minutes\":0.63,\"words\":190},\"filePathRelative\":\"features_new_storm/1_bpmn-editor/2_versioning.md\",\"localizedDate\":\"4 марта 2025 г.\",\"excerpt\":\"\\n<p>Система автоматически создает версии диаграмм вот по таким поводам:</p>\\n<ul>\\n<li>Прошло больше 30 изменений диаграммы</li>\\n<li>Кто-то (не владелец процесса и не пред.автор изменения) внёс изменения в диаграмму</li>\\n</ul>\\n<p>Это позволяет <strong>всегда</strong> восстановить пред.версию и посмотреть разницу. Автор диаграммы получает e-mail уведомление, если в его диаграмме создали новую версию.\\nТакже система сохраняет версии описания задач.</p>\"}")
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
