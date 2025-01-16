export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/get-started.html.js"), meta: {"t":"С чего начать","i":"play","O":1} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/index.html.js"), meta: {"t":"Главная страница","O":0} }],
  ["/bpmn/1_lesson.html", { loader: () => import(/* webpackChunkName: "1_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/1_lesson.html.js"), meta: {"t":"1 урок: BPM, BPMN, BPMS","I":false} }],
  ["/bpmn/2_lesson.html", { loader: () => import(/* webpackChunkName: "2_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/2_lesson.html.js"), meta: {"t":"2 урок:  Понятие бизнес-процесса и экзепляра процесса","I":false} }],
  ["/bpmn/3_lesson.html", { loader: () => import(/* webpackChunkName: "3_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/3_lesson.html.js"), meta: {"t":"3 урок:  3 уровня моделирования BPMN-схем","I":false} }],
  ["/bpmn/4_lesson.html", { loader: () => import(/* webpackChunkName: "4_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/4_lesson.html.js"), meta: {"t":"4 урок: BPMN для \"чайников\". Базовые элементы. (1/3)","I":false} }],
  ["/bpmn/5_lesson.html", { loader: () => import(/* webpackChunkName: "5_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/5_lesson.html.js"), meta: {"t":"5 урок: BPMN для \"чайников\". Базовые элементы. (2/3)","I":false} }],
  ["/bpmn/6_lesson.html", { loader: () => import(/* webpackChunkName: "6_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/6_lesson.html.js"), meta: {"t":"6 урок: BPMN для \"чайников\". Пулы и дорожки. (3/3)","I":false} }],
  ["/bpmn/7_lesson.html", { loader: () => import(/* webpackChunkName: "7_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/7_lesson.html.js"), meta: {"t":"7 урок: Проверка BPMN-схем на корректность","I":false} }],
  ["/bpmn/8_lesson.html", { loader: () => import(/* webpackChunkName: "8_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/8_lesson.html.js"), meta: {"t":"8 урок: Хороший стиль BPMN","I":false} }],
  ["/bpmn/9_lesson.html", { loader: () => import(/* webpackChunkName: "9_lesson.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/9_lesson.html.js"), meta: {"t":"9 урок: Разбираем и улучшаем схему BPMN","I":false} }],
  ["/bpmn/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/index.html.js"), meta: {"t":"Что такое BPMN","i":"circle-nodes","O":-3} }],
  ["/enterprise/camunda_manage.html", { loader: () => import(/* webpackChunkName: "camunda_manage.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/camunda_manage.html.js"), meta: {"t":"Управление серверами Camunda","i":"server"} }],
  ["/enterprise/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/index.html.js"), meta: {"t":"Enterprise-версия","i":"file","O":-3} }],
  ["/enterprise/rest-api.html", { loader: () => import(/* webpackChunkName: "rest-api.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/rest-api.html.js"), meta: {"t":"Rest API","i":"gears","O":3} }],
  ["/enterprise/security.html", { loader: () => import(/* webpackChunkName: "security.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/security.html.js"), meta: {"t":"Обеспечение информационной безопасности","i":"lock","O":2} }],
  ["/enterprise/setup.html", { loader: () => import(/* webpackChunkName: "setup.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/setup.html.js"), meta: {"t":"Установка","i":"computer","O":1} }],
  ["/real-life-scenarios/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/real-life-scenarios/index.html.js"), meta: {"t":"В реальной жизни","i":"user","O":2} }],
  ["/features/0_home-page.html", { loader: () => import(/* webpackChunkName: "0_home-page.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/0_home-page.html.js"), meta: {"t":"Главная страница","i":null,"O":1} }],
  ["/features/10_Diagram_scoring.html", { loader: () => import(/* webpackChunkName: "10_Diagram_scoring.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/10_Diagram_scoring.html.js"), meta: {"t":"Оценка качества диаграмм","O":10} }],
  ["/features/1_bpmn-editor.html", { loader: () => import(/* webpackChunkName: "1_bpmn-editor.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/1_bpmn-editor.html.js"), meta: {"t":"Бизнес-процессы в BPMN","i":"heart","O":2} }],
  ["/features/2_group-editor.html", { loader: () => import(/* webpackChunkName: "2_group-editor.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/2_group-editor.html.js"), meta: {"t":"Редактор групп процессов","O":2} }],
  ["/features/3_org-chart-editor.html", { loader: () => import(/* webpackChunkName: "3_org-chart-editor.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/3_org-chart-editor.html.js"), meta: {"t":"Редактор оргструктуры","O":3} }],
  ["/features/4_assignees.html", { loader: () => import(/* webpackChunkName: "4_assignees.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/4_assignees.html.js"), meta: {"t":"Роли","O":4} }],
  ["/features/4_plant_uml.html", { loader: () => import(/* webpackChunkName: "4_plant_uml.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/4_plant_uml.html.js"), meta: {"t":"Редактор UML","O":4} }],
  ["/features/5_elements-architecture.html", { loader: () => import(/* webpackChunkName: "5_elements-architecture.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/5_elements-architecture.html.js"), meta: {"t":"Элементы архитектуры","O":5} }],
  ["/features/6_reglaments.html", { loader: () => import(/* webpackChunkName: "6_reglaments.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/6_reglaments.html.js"), meta: {"t":"Регламенты","O":6} }],
  ["/features/7_folders.html", { loader: () => import(/* webpackChunkName: "7_folders.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/7_folders.html.js"), meta: {"t":"Папки и теги","O":7} }],
  ["/features/8_comments.html", { loader: () => import(/* webpackChunkName: "8_comments.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/8_comments.html.js"), meta: {"t":"Комментарии","O":8} }],
  ["/features/9_FAQ.html", { loader: () => import(/* webpackChunkName: "9_FAQ.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/9_FAQ.html.js"), meta: {"t":"FAQ - ответы на часто задаваемые вопросы","O":9} }],
  ["/features/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features/index.html.js"), meta: {"t":"Функции системы","i":"star","O":3} }],
  ["/features_new_storm/0_home-page.html", { loader: () => import(/* webpackChunkName: "0_home-page.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/0_home-page.html.js"), meta: {"t":"New Шторм. Главная страница","i":null,"O":1} }],
  ["/features_new_storm/1_bpmn-editor.html", { loader: () => import(/* webpackChunkName: "1_bpmn-editor.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/1_bpmn-editor.html.js"), meta: {"t":"New Шторм. Редактор диаграмм BPMN","i":"heart","O":1} }],
  ["/features_new_storm/2_group-editor.html", { loader: () => import(/* webpackChunkName: "2_group-editor.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/2_group-editor.html.js"), meta: {"t":"New Шторм. Редактор групп процессов","O":2} }],
  ["/features_new_storm/3_org-chart-editor.html", { loader: () => import(/* webpackChunkName: "3_org-chart-editor.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/3_org-chart-editor.html.js"), meta: {"t":"New Шторм. Редактор оргструктуры","O":3} }],
  ["/features_new_storm/4_assignees.html", { loader: () => import(/* webpackChunkName: "4_assignees.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/4_assignees.html.js"), meta: {"t":"New Шторм. Роли","O":4} }],
  ["/features_new_storm/4_plant_uml.html", { loader: () => import(/* webpackChunkName: "4_plant_uml.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/4_plant_uml.html.js"), meta: {"t":"New Шторм. Редактор UML","O":4} }],
  ["/features_new_storm/5_elements-architecture.html", { loader: () => import(/* webpackChunkName: "5_elements-architecture.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/5_elements-architecture.html.js"), meta: {"t":"New Шторм. Элементы архитектуры","O":5} }],
  ["/features_new_storm/6_reglaments.html", { loader: () => import(/* webpackChunkName: "6_reglaments.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/6_reglaments.html.js"), meta: {"t":"New Шторм. Регламенты","O":6} }],
  ["/features_new_storm/7_folders.html", { loader: () => import(/* webpackChunkName: "7_folders.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/7_folders.html.js"), meta: {"t":"New Шторм. Папки и теги","O":7} }],
  ["/features_new_storm/8_comments.html", { loader: () => import(/* webpackChunkName: "8_comments.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/8_comments.html.js"), meta: {"t":"New Шторм. Комментарии","O":8} }],
  ["/features_new_storm/9_FAQ.html", { loader: () => import(/* webpackChunkName: "9_FAQ.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/9_FAQ.html.js"), meta: {"t":"New Шторм. FAQ - ответы на часто задаваемые вопросы","O":9} }],
  ["/features_new_storm/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/features_new_storm/index.html.js"), meta: {"t":"Функции системы","i":"star","O":-10} }],
  ["/support/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/support/index.html.js"), meta: {"t":"Тех.поддержка и администрирование","i":"handshake-angle","O":-1} }],
  ["/team-work/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/team-work/index.html.js"), meta: {"t":"Совместная работа","i":"user-group","O":-3} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"C:/StormBPMN/stormbpmn-documentation/src/.vuepress/.temp/pages/404.html.js"), meta: {"t":""} }],
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
