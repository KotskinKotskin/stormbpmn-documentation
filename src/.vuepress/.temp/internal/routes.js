export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/get-started.html.js"), meta: {"t":"С чего начать","i":"play","O":1} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/index.html.js"), meta: {"t":"Главная страница","O":0} }],
  ["/bpmn/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/index.html.js"), meta: {"t":"Что такое BPMN","i":"circle-nodes","O":-3} }],
  ["/enterprise/camunda_manage.html", { loader: () => import(/* webpackChunkName: "camunda_manage.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/camunda_manage.html.js"), meta: {"t":"Управление серверами Camunda","i":"folder"} }],
  ["/enterprise/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/index.html.js"), meta: {"t":"Enterprise-версия","i":"file","O":-3} }],
  ["/enterprise/rest-api.html", { loader: () => import(/* webpackChunkName: "rest-api.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/rest-api.html.js"), meta: {"t":"Rest API","i":"gears"} }],
  ["/features/1_bpmn-editor.html", { loader: () => import(/* webpackChunkName: "1_bpmn-editor.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/1_bpmn-editor.html.js"), meta: {"t":"Бизнес-процессы в BPMN","O":1} }],
  ["/features/2_group-editor.html", { loader: () => import(/* webpackChunkName: "2_group-editor.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/2_group-editor.html.js"), meta: {"t":"Редактор групп процессов","O":2} }],
  ["/features/3_org-chart-editor.html", { loader: () => import(/* webpackChunkName: "3_org-chart-editor.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/3_org-chart-editor.html.js"), meta: {"t":"Редактор оргструктуры","O":3} }],
  ["/features/4_assignees.html", { loader: () => import(/* webpackChunkName: "4_assignees.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/4_assignees.html.js"), meta: {"t":"Роли","O":4} }],
  ["/features/4_plant_uml.html", { loader: () => import(/* webpackChunkName: "4_plant_uml.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/4_plant_uml.html.js"), meta: {"t":"Редактор UML","O":4} }],
  ["/features/5_elements-architecture.html", { loader: () => import(/* webpackChunkName: "5_elements-architecture.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/5_elements-architecture.html.js"), meta: {"t":"Элементы архитектуры","O":5} }],
  ["/features/6_reglaments.html", { loader: () => import(/* webpackChunkName: "6_reglaments.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/6_reglaments.html.js"), meta: {"t":"Регламенты","O":6} }],
  ["/features/7_folders.html", { loader: () => import(/* webpackChunkName: "7_folders.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/7_folders.html.js"), meta: {"t":"Папки и теги","O":7} }],
  ["/features/8_comments.html", { loader: () => import(/* webpackChunkName: "8_comments.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/8_comments.html.js"), meta: {"t":"Комментарии","O":8} }],
  ["/features/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/index.html.js"), meta: {"t":"Функции системы","i":"star","O":3} }],
  ["/real-life-scenarios/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/real-life-scenarios/index.html.js"), meta: {"t":"В реальной жизни","i":"user","O":2} }],
  ["/team-work/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/team-work/index.html.js"), meta: {"t":"Совместная работа","i":"user-group","O":-3} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/404.html.js"), meta: {"t":""} }],
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
