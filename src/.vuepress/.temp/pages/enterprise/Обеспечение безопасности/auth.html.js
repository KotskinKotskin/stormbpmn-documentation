import comp from "C:/StormBPMN/Stormdocs 20250317/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/Обеспечение безопасности/auth.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/%D0%9E%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D0%BE%D1%81%D1%82%D0%B8/auth.html\",\"title\":\"Авторизация\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":3,\"index\":true},\"headers\":[{\"level\":2,\"title\":\"Настройка keycloak\",\"slug\":\"настроика-keycloak\",\"link\":\"#настроика-keycloak\",\"children\":[]},{\"level\":2,\"title\":\"Административная панель\",\"slug\":\"административная-панель\",\"link\":\"#административная-панель\",\"children\":[]},{\"level\":2,\"title\":\"Настройка LDAP\",\"slug\":\"настроика-ldap\",\"link\":\"#настроика-ldap\",\"children\":[]},{\"level\":2,\"title\":\"Настройка Oauth2\",\"slug\":\"настроика-oauth2\",\"link\":\"#настроика-oauth2\",\"children\":[{\"level\":3,\"title\":\"Пример создания и настройки Oauth2-клиента в Keycloak 26.0.7\",\"slug\":\"пример-создания-и-настроики-oauth2-клиента-в-keycloak-26-0-7\",\"link\":\"#пример-создания-и-настроики-oauth2-клиента-в-keycloak-26-0-7\",\"children\":[]}]}],\"git\":{\"createdTime\":1740668561000,\"updatedTime\":1740668561000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":1.46,\"words\":437},\"filePathRelative\":\"enterprise/Обеспечение безопасности/auth.md\",\"localizedDate\":\"27 февраля 2025 г.\",\"excerpt\":\"\\n<p>Поддерживается 4 типа авторизации - keycloak, oauth2, ldap, встроенная.  Рекомендуем использовать ouath2. Для встроенной авторизации дополнительных настроек не требуется.</p>\\n<h2>Настройка keycloak</h2>\\n<p>В данном разделе перечислены настройки, которые связаны с авторизацией с использованием keycloak:</p>\"}")
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
