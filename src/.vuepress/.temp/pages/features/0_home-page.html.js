import comp from "C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/features/0_home-page.html.vue"
const data = JSON.parse("{\"path\":\"/features/0_home-page.html\",\"title\":\"Главная страница\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":1,\"icon\":null},\"headers\":[],\"git\":{\"createdTime\":1715247837000,\"updatedTime\":1715247837000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":0.03,\"words\":9},\"filePathRelative\":\"features/0_home-page.md\",\"localizedDate\":\"9 мая 2024 г.\",\"excerpt\":\"\\n<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">Предупреждение</p>\\n<p>Страница в разработке</p>\\n</div>\\n\"}")
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
