import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/Новая версия/index.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F/\",\"title\":\"Список функций, которых нет, но планируются\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":6,\"dir\":{\"text\":\"Новая версия\",\"link\":true},\"index\":true,\"icon\":\"star\"},\"headers\":[{\"level\":2,\"title\":\"Особенности\",\"slug\":\"особенности\",\"link\":\"#особенности\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":1.18,\"words\":354},\"filePathRelative\":\"enterprise/Новая версия/README.md\",\"excerpt\":\"<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">Предупреждение</p>\\n<p>Новая версия в работе, следите за обновлениями. Экспериментальный билд с OAuth2 готов к тестированию.</p>\\n</div>\\n<h1>Список функций, которых нет, но планируются</h1>\\n<ul>\\n<li>Редактор оргструктуры</li>\\n<li>Редактор PlantUML</li>\\n<li>Представление \\\"Регламент\\\" на схеме процесса</li>\\n<li>Сравнение версий</li>\\n<li>Восстановление версий</li>\\n<li>Сравнение AS-IS и TO-BE</li>\\n</ul>\"}")
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
