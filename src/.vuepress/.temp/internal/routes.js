export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/get-started.html.js"), meta: {"t":"1. Схема архитектуры","O":1} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/index.html.js"), meta: {"t":"Главная страница","O":0} }],
  ["/bpmn/1_lesson.html", { loader: () => import(/* webpackChunkName: "1_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/1_lesson.html.js"), meta: {"t":"1 урок: BPM, BPMN, BPMS"} }],
  ["/bpmn/2_lesson.html", { loader: () => import(/* webpackChunkName: "2_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/2_lesson.html.js"), meta: {"t":"2 урок:  Понятие бизнес-процесса и экзепляра процесса"} }],
  ["/bpmn/3_lesson.html", { loader: () => import(/* webpackChunkName: "3_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/3_lesson.html.js"), meta: {"t":"3 урок:  3 уровня моделирования BPMN-схем"} }],
  ["/bpmn/4_lesson.html", { loader: () => import(/* webpackChunkName: "4_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/4_lesson.html.js"), meta: {"t":"4 урок: BPMN для \"чайников\". Базовые элементы. (1/3)"} }],
  ["/bpmn/5_lesson.html", { loader: () => import(/* webpackChunkName: "5_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/5_lesson.html.js"), meta: {"t":"5 урок: BPMN для \"чайников\". Базовые элементы. (2/3)"} }],
  ["/bpmn/6_lesson.html", { loader: () => import(/* webpackChunkName: "6_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/6_lesson.html.js"), meta: {"t":"6 урок: BPMN для \"чайников\". Пулы и дорожки. (3/3)"} }],
  ["/bpmn/7_lesson.html", { loader: () => import(/* webpackChunkName: "7_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/7_lesson.html.js"), meta: {"t":"7 урок: Проверка BPMN-схем на корректность"} }],
  ["/bpmn/8_lesson.html", { loader: () => import(/* webpackChunkName: "8_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/8_lesson.html.js"), meta: {"t":"8 урок: Хороший стиль BPMN"} }],
  ["/bpmn/9_lesson.html", { loader: () => import(/* webpackChunkName: "9_lesson.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/9_lesson.html.js"), meta: {"t":"9 урок: Разбираем и улучшаем схему BPMN"} }],
  ["/bpmn/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/index.html.js"), meta: {"t":"Что такое BPMN","i":"circle-nodes","O":-2} }],
  ["/Changelog/6.6.1168.html", { loader: () => import(/* webpackChunkName: "6.6.1168.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/Changelog/6.6.1168.html.js"), meta: {"t":"Версия 6.6.1168 от 10.07.2025"} }],
  ["/Changelog/6.6.1169.html", { loader: () => import(/* webpackChunkName: "6.6.1169.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/Changelog/6.6.1169.html.js"), meta: {"t":"Версия 6.6.1169 от 10.07.2025"} }],
  ["/Changelog/6.6.1174.html", { loader: () => import(/* webpackChunkName: "6.6.1174.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/Changelog/6.6.1174.html.js"), meta: {"t":"Версия 6.6.1174 от 14.07.2025"} }],
  ["/Changelog/6.6.1175.html", { loader: () => import(/* webpackChunkName: "6.6.1175.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/Changelog/6.6.1175.html.js"), meta: {"t":"Версия 6.6.1175 от 14.07.2025"} }],
  ["/Changelog/6.6.1199.html", { loader: () => import(/* webpackChunkName: "6.6.1199.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/Changelog/6.6.1199.html.js"), meta: {"t":"Версия 6.6.1199 от 16.07.2025"} }],
  ["/Changelog/6.6.1229.html", { loader: () => import(/* webpackChunkName: "6.6.1229.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/Changelog/6.6.1229.html.js"), meta: {"t":"Версия 6.6.1229 от 17.07.2025"} }],
  ["/Changelog/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/Changelog/index.html.js"), meta: {"t":"Changelog","O":8} }],
  ["/configure/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/configure/index.html.js"), meta: {"t":"Конфигурация системы","O":5} }],
  ["/configure/SECURE.html", { loader: () => import(/* webpackChunkName: "SECURE.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/configure/SECURE.html.js"), meta: {"t":"Безопасность","O":4} }],
  ["/install/FULL_INSTALL.html", { loader: () => import(/* webpackChunkName: "FULL_INSTALL.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/install/FULL_INSTALL.html.js"), meta: {"t":"Production-Ready установка","O":2} }],
  ["/install/GET_STARTED.html", { loader: () => import(/* webpackChunkName: "GET_STARTED.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/install/GET_STARTED.html.js"), meta: {"t":"Быстрый старт","O":1} }],
  ["/install/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/install/index.html.js"), meta: {"t":"Установка","O":4} }],
  ["/operation/License.html", { loader: () => import(/* webpackChunkName: "License.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/operation/License.html.js"), meta: {"t":"Как работают лицензии"} }],
  ["/operation/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/operation/index.html.js"), meta: {"t":"Администрирование системы","O":5} }],
  ["/REST%20API/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/REST API/index.html.js"), meta: {"t":"REST API","O":7} }],
  ["/support/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/support/index.html.js"), meta: {"t":"Каналы поддержки","O":7} }],
  ["/recipes/Access_to_diagrams.html", { loader: () => import(/* webpackChunkName: "Access_to_diagrams.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/recipes/Access_to_diagrams.html.js"), meta: {"t":"Разделение прав доступа к диаграммам"} }],
  ["/recipes/ARC_REPO.html", { loader: () => import(/* webpackChunkName: "ARC_REPO.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/recipes/ARC_REPO.html.js"), meta: {"t":"Архитектурный репозиторий"} }],
  ["/recipes/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/recipes/index.html.js"), meta: {"t":"Рецепты решений для ENTERPRISE клиентов","O":7} }],
  ["/recipes/Replace_nginx_config.html", { loader: () => import(/* webpackChunkName: "Replace_nginx_config.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/recipes/Replace_nginx_config.html.js"), meta: {"t":"Замена конфига внутреннего nginx"} }],
  ["/recipes/Time_limit_user.html", { loader: () => import(/* webpackChunkName: "Time_limit_user.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/recipes/Time_limit_user.html.js"), meta: {"t":"Временная работа в системе"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"D:/stormbpmn-documentation/src/.vuepress/.temp/pages/404.html.js"), meta: {"t":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
