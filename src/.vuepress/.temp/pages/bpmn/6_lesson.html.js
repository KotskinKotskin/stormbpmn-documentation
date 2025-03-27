import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/6_lesson.html.vue"
const data = JSON.parse("{\"path\":\"/bpmn/6_lesson.html\",\"title\":\"6 урок: BPMN для \\\"чайников\\\". Пулы и дорожки. (3/3)\",\"lang\":\"ru-RU\",\"frontmatter\":{\"index\":true},\"headers\":[{\"level\":2,\"title\":\"Пулы\",\"slug\":\"пулы\",\"link\":\"#пулы\",\"children\":[]},{\"level\":2,\"title\":\"Исполнители\",\"slug\":\"исполнители\",\"link\":\"#исполнители\",\"children\":[]},{\"level\":2,\"title\":\"Взаимодействие исполнителей между собой\",\"slug\":\"взаимодеиствие-исполнителеи-между-собои\",\"link\":\"#взаимодеиствие-исполнителеи-между-собои\",\"children\":[]},{\"level\":2,\"title\":\"Взаимодействие пулов между собой\",\"slug\":\"взаимодеиствие-пулов-между-собои\",\"link\":\"#взаимодеиствие-пулов-между-собои\",\"children\":[]},{\"level\":2,\"title\":\"Типичные ошибки и способ их решения\",\"slug\":\"типичные-ошибки-и-способ-их-решения\",\"link\":\"#типичные-ошибки-и-способ-их-решения\",\"children\":[]},{\"level\":2,\"title\":\"Факультатив\",\"slug\":\"факультатив\",\"link\":\"#факультатив\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":1.49,\"words\":447},\"filePathRelative\":\"bpmn/6_lesson.md\",\"excerpt\":\"\\n<p>В этом письме заканчиваем тему базовых элементов. Я расскажу, как использовать дорожки и пулы правильно и избежать ошибок.</p>\\n<h2>Пулы</h2>\\n<p>Пулы отображают участников взаимодействия СНАРУЖИ процесса -  можно понимать организации, отделы, процессы — это зависит от вашей точки зрения на процесс. Как правило, если вы рисуете сквозной процесс, у вас будет один пул для вашей организации и прочие — для ваших клиентов, партнёров и так далее.</p>\"}")
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
