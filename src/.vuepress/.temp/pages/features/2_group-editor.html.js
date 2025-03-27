import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/features/2_group-editor.html.vue"
const data = JSON.parse("{\"path\":\"/features/2_group-editor.html\",\"title\":\"Редактор групп процессов\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":2},\"headers\":[{\"level\":2,\"title\":\"Создание группы процессов\",\"slug\":\"создание-группы-процессов\",\"link\":\"#создание-группы-процессов\",\"children\":[]},{\"level\":2,\"title\":\"Как работать с группами\",\"slug\":\"как-работать-с-группами\",\"link\":\"#как-работать-с-группами\",\"children\":[]},{\"level\":2,\"title\":\"Горячие клавиши\",\"slug\":\"горячие-клавиши\",\"link\":\"#горячие-клавиши\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":1.28,\"words\":384},\"filePathRelative\":\"features/2_group-editor.md\",\"excerpt\":\"\\n<div class=\\\"hint-container warning\\\">\\n<p class=\\\"hint-container-title\\\">Примечание</p>\\n<p>Группы процессов работают только на тарифах TEAM и выше.</p>\\n</div>\\n<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">Предупреждение</p>\\n<p>Функционал недавно выпущен и может содержать ошибки. Сообщайте о любых ошибках в чат в приложении, мы оперативно их устраним.</p>\\n</div>\"}")
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
