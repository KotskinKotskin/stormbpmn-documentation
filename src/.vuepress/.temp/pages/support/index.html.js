import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/support/index.html.vue"
const data = JSON.parse("{\"path\":\"/support/\",\"title\":\"Тех.поддержка и администрирование\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":-1,\"link\":true,\"text\":\"Тех.поддержка\",\"collapsible\":false},\"index\":true,\"icon\":\"handshake-angle\",\"order\":-1},\"headers\":[{\"level\":2,\"title\":\"Каналы поддержки\",\"slug\":\"каналы-поддержки\",\"link\":\"#каналы-поддержки\",\"children\":[]},{\"level\":2,\"title\":\"Информация для устранения неисправности\",\"slug\":\"информация-для-устранения-неисправности\",\"link\":\"#информация-для-устранения-неисправности\",\"children\":[]},{\"level\":2,\"title\":\"SLA\",\"slug\":\"sla\",\"link\":\"#sla\",\"children\":[]}],\"git\":{\"createdTime\":1715247837000,\"updatedTime\":1732523898000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":11}]},\"readingTime\":{\"minutes\":0.8,\"words\":239},\"filePathRelative\":\"support/README.md\",\"localizedDate\":\"9 мая 2024 г.\"}")
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
