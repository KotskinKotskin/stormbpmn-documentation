export const themeData = JSON.parse("{\"encrypt\":{},\"fullscreen\":true,\"repo\":\"KotskinKotskin/stormbpmn-documentation\",\"repoLabel\":\"Улучшить документацию\",\"repoDisplay\":true,\"docsRepo\":\"KotskinKotskin/stormbpmn-documentation\",\"docsDir\":\"docs\",\"docsBranch\":\"main\",\"editLink\":true,\"headerDepth\":2,\"footer\":\"\",\"lastUpdated\":true,\"logo\":\"https://stormbpmn.com/static/img/bpmnstorm_small.png\",\"locales\":{\"/\":{\"lang\":\"ru-RU\",\"navbarLocales\":{\"langName\":\"Русский\",\"selectLangAriaLabel\":\"Выберите язык\"},\"metaLocales\":{\"author\":\"Автор\",\"date\":\"Дата написания\",\"origin\":\"Оригинал\",\"views\":\"Просмотры страницы\",\"category\":\"Категория\",\"tag\":\"Тэги\",\"readingTime\":\"Время чтения\",\"words\":\"Слова\",\"toc\":\"На этой странице\",\"prev\":\"Предыдущая\",\"next\":\"Следующая\",\"lastUpdated\":\"Последнее обновление\",\"contributors\":\"Контрибьюторы\",\"editLink\":\"Редактировать эту страницу\",\"print\":\"Печать\"},\"outlookLocales\":{\"themeColor\":\"Цвет темы\",\"darkmode\":\"Режим темы\",\"fullscreen\":\"Полный экран\"},\"routeLocales\":{\"skipToContent\":\"Перейти к основному содержанию\",\"notFoundTitle\":\"Страница не найдена\",\"notFoundMsg\":[\"Здесь ничего нет.\",\"Как мы сюда попали?\",\"Это четыре-о-четыре.\",\"Похоже, у нас есть несколько неработающих ссылок.\"],\"back\":\"Вернуться назад\",\"home\":\"Вернуться на главную\",\"openInNewWindow\":\"Открыть в новом окне\"},\"sidebar\":\"structure\",\"navbar\":[\"/\",\"/get-started\",\"/features/1_bpmn-editor.html\",{\"text\":\"Вернуться на сервис\",\"link\":\"https://stormbpmn.com\",\"target\":\"_self\"}]}}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
