import comp from "C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/bpmn/7_lesson.html.vue"
const data = JSON.parse("{\"path\":\"/bpmn/7_lesson.html\",\"title\":\"7 урок: Проверка BPMN-схем на корректность\",\"lang\":\"ru-RU\",\"frontmatter\":{\"index\":false},\"headers\":[{\"level\":2,\"title\":\"Идея\",\"slug\":\"идея\",\"link\":\"#идея\",\"children\":[]},{\"level\":2,\"title\":\"Раздвилка ИЛИ\",\"slug\":\"раздвилка-или\",\"link\":\"#раздвилка-или\",\"children\":[]},{\"level\":2,\"title\":\"Развилка И\",\"slug\":\"развилка-и\",\"link\":\"#развилка-и\",\"children\":[]},{\"level\":2,\"title\":\"Пример проверки схем через token game\",\"slug\":\"пример-проверки-схем-через-token-game\",\"link\":\"#пример-проверки-схем-через-token-game\",\"children\":[]},{\"level\":2,\"title\":\"Проверка больших схем\",\"slug\":\"проверка-больших-схем\",\"link\":\"#проверка-больших-схем\",\"children\":[]}],\"git\":{\"createdTime\":1715029278000,\"updatedTime\":1715029278000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":0.85,\"words\":256},\"filePathRelative\":\"bpmn/7_lesson.md\",\"localizedDate\":\"7 мая 2024 г.\",\"excerpt\":\"\\n<p>Настало время научиться проверять, что схема, которую мы составили, не содержит логических ошибок. Для этого в BPMN-науке используется воображаемая игра — Token game.</p>\\n<h2>Идея</h2>\\n<p>Token games — это игра с жетонами, или “токенами”. Такая же, как любая настольная игра. Только вместо поля настольной игры используется поле вашего процесса.</p>\"}")
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
