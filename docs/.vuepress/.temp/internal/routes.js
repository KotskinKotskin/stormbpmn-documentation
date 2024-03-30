export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"С чего начать"} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Главная страница"} }],
  ["/api/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/api/index.html.js"), meta: {"title":"API"} }],
  ["/bpmn/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/bpmn/index.html.js"), meta: {"title":"Что такое BPMN"} }],
  ["/examples/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/examples/index.html.js"), meta: {"title":"Примеры процессов в BPMN"} }],
  ["/features/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/features/index.html.js"), meta: {"title":"Описание функций"} }],
  ["/guide/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/guide/index.html.js"), meta: {"title":"h1 Heading 😎"} }],
  ["/enterprise/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/enterprise/index.html.js"), meta: {"title":"Enterprise-версия"} }],
  ["/how-to/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/how-to/index.html.js"), meta: {"title":"Как ... ?"} }],
  ["/real-life-scenarios/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/real-life-scenarios/index.html.js"), meta: {"title":"В реальной жизни"} }],
  ["/team-work/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/team-work/index.html.js"), meta: {"title":"Совместная работа"} }],
  ["/usefull-link/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/usefull-link/index.html.js"), meta: {"title":"Полезные ссылки"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"C:/Users/kotov/stormbpmn-documentation/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
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
