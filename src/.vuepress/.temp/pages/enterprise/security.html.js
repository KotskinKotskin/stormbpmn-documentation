import comp from "C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/security.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/security.html\",\"title\":\"Обеспечение информационной безопасности\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":2,\"dir\":{\"link\":true},\"index\":true,\"icon\":\"lock\"},\"headers\":[{\"level\":2,\"title\":\"Возможные настройки\",\"slug\":\"возможные-настроики\",\"link\":\"#возможные-настроики\",\"children\":[{\"level\":3,\"title\":\"Переменные окружения\",\"slug\":\"переменные-окружения\",\"link\":\"#переменные-окружения\",\"children\":[]},{\"level\":3,\"title\":\"Административная панель\",\"slug\":\"административная-панель\",\"link\":\"#административная-панель\",\"children\":[]}]},{\"level\":2,\"title\":\"Авторизация\",\"slug\":\"авторизация\",\"link\":\"#авторизация\",\"children\":[{\"level\":3,\"title\":\"Настройка keycloak\",\"slug\":\"настроика-keycloak\",\"link\":\"#настроика-keycloak\",\"children\":[]},{\"level\":3,\"title\":\"Настройка LDAP\",\"slug\":\"настроика-ldap\",\"link\":\"#настроика-ldap\",\"children\":[]},{\"level\":3,\"title\":\"Настройка Oauth2\",\"slug\":\"настроика-oauth2\",\"link\":\"#настроика-oauth2\",\"children\":[]}]},{\"level\":2,\"title\":\"Регистрация событий безопасности и интеграции с SIEM\\\\лог-коллекторами\",\"slug\":\"регистрация-событии-безопасности-и-интеграции-с-siem-лог-коллекторами\",\"link\":\"#регистрация-событии-безопасности-и-интеграции-с-siem-лог-коллекторами\",\"children\":[{\"level\":3,\"title\":\"Особенности\",\"slug\":\"особенности\",\"link\":\"#особенности\",\"children\":[]},{\"level\":3,\"title\":\"Принцип работы\",\"slug\":\"принцип-работы\",\"link\":\"#принцип-работы\",\"children\":[]},{\"level\":3,\"title\":\"Настройка Syslog\",\"slug\":\"настроика-syslog\",\"link\":\"#настроика-syslog\",\"children\":[]}]}],\"git\":{\"createdTime\":1728916519000,\"updatedTime\":1730465391000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":4},{\"name\":\"Roman Migalev\",\"email\":\"karddenol@icloud.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":2.78,\"words\":834},\"filePathRelative\":\"enterprise/security.md\",\"localizedDate\":\"14 октября 2024 г.\",\"excerpt\":\"<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">Предупреждение</p>\\n<p>Раздел в разработке</p>\\n</div>\\n<h1>Обеспечение информационной безопасности</h1>\\n<p>Мы серьезно относимся к обеспечению информационной безопасности при использовании нашего решения. Помимо регулярного обновления зависимостей, сканирования приложения сканерами уязвимости и устранение найденных уязвимостей, мы предоставляем важные настройки, которые позволяют существенно органичить возможности системы для неавторизованных пользователей.</p>\"}")
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
