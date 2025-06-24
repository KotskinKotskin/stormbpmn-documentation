import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/Обеспечение безопасности/auth.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/%D0%9E%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D0%BE%D1%81%D1%82%D0%B8/auth.html\",\"title\":\"Авторизация\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":3,\"index\":true},\"headers\":[{\"level\":2,\"title\":\"Настройка Oauth2\",\"slug\":\"настроика-oauth2\",\"link\":\"#настроика-oauth2\",\"children\":[{\"level\":3,\"title\":\"Пример создания и настройки Oauth2-клиента в Keycloak 26.0.7\",\"slug\":\"пример-создания-и-настроики-oauth2-клиента-в-keycloak-26-0-7\",\"link\":\"#пример-создания-и-настроики-oauth2-клиента-в-keycloak-26-0-7\",\"children\":[]},{\"level\":3,\"title\":\"Проверка Claims внутри ответа\",\"slug\":\"проверка-claims-внутри-ответа\",\"link\":\"#проверка-claims-внутри-ответа\",\"children\":[]},{\"level\":3,\"title\":\"Вход с базовой авторизацией, даже когда она отключена\",\"slug\":\"вход-с-базовои-авторизациеи-даже-когда-она-отключена\",\"link\":\"#вход-с-базовои-авторизациеи-даже-когда-она-отключена\",\"children\":[]}]}],\"git\":{\"createdTime\":1740668561000,\"updatedTime\":1749162633000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":4}]},\"readingTime\":{\"minutes\":0.99,\"words\":296},\"filePathRelative\":\"enterprise/Обеспечение безопасности/auth.md\",\"localizedDate\":\"27 февраля 2025 г.\",\"excerpt\":\"\\n<p>Поддерживается 2 типа авторизации -  oauth2 и встроенная.  Рекомендуем использовать ouath2. Для встроенной авторизации дополнительных настроек не требуется.</p>\\n<h2>Настройка Oauth2</h2>\\n<p>Самый простой и продвинутый способ авторизации. Задачется через административную панель:</p>\\n<ul>\\n<li><strong>OAuthIsEnabled</strong> - включение кастомного провайдера Oauth.</li>\\n<li><strong>OAuthClientId</strong> - clientId приложения, зарегистрированного в кастомном провайдере Oauth.</li>\\n<li><strong>OAuthClientSecret</strong> - clientSecret приложения, зарегистрированного в кастомном провайдере Oauth.</li>\\n<li><strong>OAuthAuthorizeUri</strong> - URL авторизации в кастомном провайдере.</li>\\n<li><strong>OAuthUserInfoUri</strong> - URL получения информации о пользователе.</li>\\n<li><strong>OAuthTokenUri</strong> - URL для запроса токена.</li>\\n<li><strong>OAuthButtonLabel</strong> - текст на кнопке авторизации.</li>\\n<li><strong>OAuthRedirectUri</strong> - URL для редиректа в приложение ( укажите ваш базовый URL + /app/sigin).</li>\\n</ul>\"}")
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
