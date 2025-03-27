import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/get-started.html.vue"
const data = JSON.parse("{\"path\":\"/get-started.html\",\"title\":\"С чего начать\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":1},\"index\":true,\"icon\":\"play\",\"order\":1},\"headers\":[{\"level\":2,\"title\":\"Какие задачи решает Stormbpmn\",\"slug\":\"какие-задачи-решает-stormbpmn\",\"link\":\"#какие-задачи-решает-stormbpmn\",\"children\":[]},{\"level\":2,\"title\":\"Ваш первый процесс от идеи до заказчика за 5 минут\",\"slug\":\"ваш-первыи-процесс-от-идеи-до-заказчика-за-5-минут\",\"link\":\"#ваш-первыи-процесс-от-идеи-до-заказчика-за-5-минут\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.71,\"words\":214},\"filePathRelative\":\"get-started.md\",\"excerpt\":\"\\n<p>Stormbpmn  - это лучший веб-сервис для <strong>полноценного</strong> моделирования бизнес-процессов с использованием BPMN. В отличии от прочих сервисов, в Storm можно описывать все аспекты процессов:</p>\\n<ul>\\n<li>Cхему взаимодействия участников в BPMN;</li>\\n<li>Задачи участников;</li>\\n<li>Самих участников, как в виде ролей, так и на оргструктуре;</li>\\n<li>Длительность выполнения задач;</li>\\n<li>Использование систем, документов в бизнес-процессах;</li>\\n<li>Связь процессов друг с другом;</li>\\n</ul>\"}")
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
