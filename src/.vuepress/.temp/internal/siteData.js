export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"ru-RU\",\"title\":\"База знаний Enterprise Stormbpmn\",\"description\":\"Всё о Enterprise-версии Stormbpmn\",\"head\":[[\"link\",{\"rel\":\"icon\",\"href\":\"favicon.svg\",\"type\":\"image/svg+xml\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
