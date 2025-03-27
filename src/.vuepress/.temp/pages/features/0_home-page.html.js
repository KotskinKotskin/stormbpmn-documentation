import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/features/0_home-page.html.vue"
const data = JSON.parse("{\"path\":\"/features/0_home-page.html\",\"title\":\"Главная страница\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":1,\"icon\":null},\"headers\":[],\"git\":{},\"readingTime\":{\"minutes\":0.03,\"words\":9},\"filePathRelative\":\"features/0_home-page.md\",\"excerpt\":\"\\n<div class=\\\"hint-container caution\\\">\\n<p class=\\\"hint-container-title\\\">Предупреждение</p>\\n<p>Страница в разработке</p>\\n</div>\\n\"}")
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
