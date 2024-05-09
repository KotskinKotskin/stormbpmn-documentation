import comp from "C:/Users/kotov/stormbpmn-documentation/src/.vuepress/.temp/pages/main_menu/index.html.vue"
const data = JSON.parse("{\"path\":\"/main_menu/\",\"title\":\"\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":3,\"link\":true,\"text\":\"Главная страница\",\"collapsible\":false},\"index\":true,\"icon\":\"handshake-angle\",\"order\":-1},\"headers\":[],\"git\":{\"createdTime\":null,\"updatedTime\":null,\"contributors\":[]},\"readingTime\":{\"minutes\":0.06,\"words\":17},\"filePathRelative\":\"main_menu/README.md\"}")
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
