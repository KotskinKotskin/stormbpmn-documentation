import comp from "D:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/3_org-chart-editor.html.vue"
const data = JSON.parse("{\"path\":\"/features/3_org-chart-editor.html\",\"title\":\"Редактор оргструктуры\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":3},\"headers\":[{\"level\":2,\"title\":\"Меню и редактор\",\"slug\":\"меню-и-редактор\",\"link\":\"#меню-и-редактор\",\"children\":[]},{\"level\":2,\"title\":\"Карточка должности\",\"slug\":\"карточка-должности\",\"link\":\"#карточка-должности\",\"children\":[]},{\"level\":2,\"title\":\"Заполнение из CSV\",\"slug\":\"заполнение-из-csv\",\"link\":\"#заполнение-из-csv\",\"children\":[]}],\"git\":{\"createdTime\":1714504462000,\"updatedTime\":1715964947000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":2},{\"name\":\"andreev-ibs\",\"email\":\"125542350+andreev-ibs@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":0.74,\"words\":221},\"filePathRelative\":\"features/3_org-chart-editor.md\",\"localizedDate\":\"30 апреля 2024 г.\",\"excerpt\":\"\\n<p>Stormbpmn позволяет моделировать оргструктуру предпрятия, соединять ее с ролями на бизнес-процессах и конкретными сотрудниками. Такая связь может однозначно ответить, что именно делает конкретная должность или даже сотрудник в бизнес-процессах.<br>\\n</p>\\n<p>Решение такой задачи базируется на нескольких тезисах:</p>\"}")
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
