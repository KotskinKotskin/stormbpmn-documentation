import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/3_lesson.html.vue"
const data = JSON.parse("{\"path\":\"/bpmn/3_lesson.html\",\"title\":\"3 урок:  3 уровня моделирования BPMN-схем\",\"lang\":\"ru-RU\",\"frontmatter\":{\"index\":true},\"headers\":[{\"level\":2,\"title\":\"Согласовательный уровень\",\"slug\":\"согласовательныи-уровень\",\"link\":\"#согласовательныи-уровень\",\"children\":[]},{\"level\":2,\"title\":\"Аналитический уровень\",\"slug\":\"аналитическии-уровень\",\"link\":\"#аналитическии-уровень\",\"children\":[]},{\"level\":2,\"title\":\"Исполняемый уровень\",\"slug\":\"исполняемыи-уровень\",\"link\":\"#исполняемыи-уровень\",\"children\":[]},{\"level\":2,\"title\":\"Выводы\",\"slug\":\"выводы\",\"link\":\"#выводы\",\"children\":[]}],\"git\":{\"createdTime\":1715029278000,\"updatedTime\":1740668561000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":3}]},\"readingTime\":{\"minutes\":1.46,\"words\":437},\"filePathRelative\":\"bpmn/3_lesson.md\",\"localizedDate\":\"7 мая 2024 г.\",\"excerpt\":\"\\n<p>Bpmn2 содержит ~480 элементов, которые не только описывают бизнес-процессы, но и могут использоваться для создания исполняемых программ в BPMS. При этом использование всей палитры может усложнить схему и сделать ее нечитаемой.</p>\\n<p>Авторы BPMN выделяют 3 уровня моделирования:</p>\\n<ul>\\n<li>\\n<p>Согласовательный (описательный);</p>\\n</li>\\n<li>\\n<p>Аналитический;</p>\\n</li>\\n<li>\\n<p>Исполняемый.</p>\\n</li>\\n</ul>\"}")
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
