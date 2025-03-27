import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/Обеспечение безопасности/siem.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/%D0%9E%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D0%BE%D1%81%D1%82%D0%B8/siem.html\",\"title\":\"SIEM\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":3,\"index\":true},\"headers\":[{\"level\":2,\"title\":\"Особенности\",\"slug\":\"особенности\",\"link\":\"#особенности\",\"children\":[]},{\"level\":2,\"title\":\"Принцип работы\",\"slug\":\"принцип-работы\",\"link\":\"#принцип-работы\",\"children\":[]},{\"level\":2,\"title\":\"Настройка Syslog\",\"slug\":\"настроика-syslog\",\"link\":\"#настроика-syslog\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.96,\"words\":289},\"filePathRelative\":\"enterprise/Обеспечение безопасности/siem.md\",\"excerpt\":\"\\n<p>Мы предоставляем возможность получать информацию о всех операциях, выполняемых авторизированными пользователями в отдельном хранилище. Сейчас поддерживается Syslog как транспорт, сообщите менеджерам, если вам требуется другой транспорт, например Kafka.</p>\\n<h2>Особенности</h2>\\n<ul>\\n<li>SIEM-логирование работает только для авторизованных методов</li>\\n<li>Мы маскируем авторизационные заголовки и пароли, их невозможно найти в логах.</li>\\n<li>Мы не сохраняем большие элементы запросов (body диаграмм).</li>\\n</ul>\"}")
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
