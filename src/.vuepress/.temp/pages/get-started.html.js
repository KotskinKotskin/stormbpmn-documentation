import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/get-started.html.vue"
const data = JSON.parse("{\"path\":\"/get-started.html\",\"title\":\"💡1. Схема архитектуры\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"name\":\"💡 1. Схема архитектуры\",\"order\":1,\"link\":true},\"index\":true,\"order\":1},\"headers\":[{\"level\":2,\"title\":\"💡 Архитектура StormBPMN\",\"slug\":\"💡-архитектура-stormbpmn\",\"link\":\"#💡-архитектура-stormbpmn\",\"children\":[{\"level\":3,\"title\":\"🧩 Основной компонент\",\"slug\":\"🧩-основнои-компонент\",\"link\":\"#🧩-основнои-компонент\",\"children\":[]},{\"level\":3,\"title\":\"🏢 Используемая инфраструктура (на стороне заказчика)\",\"slug\":\"🏢-используемая-инфраструктура-на-стороне-заказчика\",\"link\":\"#🏢-используемая-инфраструктура-на-стороне-заказчика\",\"children\":[]},{\"level\":3,\"title\":\"🌐 Внешние open-source решения\",\"slug\":\"🌐-внешние-open-source-решения\",\"link\":\"#🌐-внешние-open-source-решения\",\"children\":[]},{\"level\":3,\"title\":\"👤 Пользователи системы\",\"slug\":\"👤-пользователи-системы\",\"link\":\"#👤-пользователи-системы\",\"children\":[]},{\"level\":3,\"title\":\"🔗 Основные взаимодействия\",\"slug\":\"🔗-основные-взаимодеиствия\",\"link\":\"#🔗-основные-взаимодеиствия\",\"children\":[]},{\"level\":3,\"title\":\"🔐 Безопасность\",\"slug\":\"🔐-безопасность\",\"link\":\"#🔐-безопасность\",\"children\":[]}]}],\"git\":{\"createdTime\":1711730231000,\"updatedTime\":1714504462000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":0.91,\"words\":272},\"filePathRelative\":\"get-started.md\",\"localizedDate\":\"29 марта 2024 г.\",\"excerpt\":\"\\n<p>Если использовать все возможности системы, то компонентная архитектура будет выглядеть так <a href=\\\"https://stormbpmn.com/app/plant/f3af4a00-b1dd-4666-ad10-82f89705c74e\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">ссылка.</a></p>\\n<h2>💡 Архитектура StormBPMN</h2>\\n<h3>🧩 Основной компонент</h3>\\n<ul>\\n<li><strong>Приложение StormBPMN</strong><br>\\nЦентральное веб-приложение, поставляемое командой StormBPMN. Отвечает за моделирование, хранение и управление бизнес-процессами.</li>\\n</ul>\"}")
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
