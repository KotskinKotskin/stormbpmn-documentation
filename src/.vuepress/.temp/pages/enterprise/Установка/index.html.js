import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/Установка/index.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0/\",\"title\":\"Установка\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":2,\"dir\":{\"text\":\"Установка\",\"order\":2,\"link\":true,\"icon\":\"computer\"},\"index\":true},\"headers\":[{\"level\":3,\"title\":\"Требования к ресурсам\",\"slug\":\"требования-к-ресурсам\",\"link\":\"#требования-к-ресурсам\",\"children\":[]}],\"git\":{\"createdTime\":1740668561000,\"updatedTime\":1740668561000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":0.34,\"words\":102},\"filePathRelative\":\"enterprise/Установка/README.md\",\"localizedDate\":\"27 февраля 2025 г.\",\"excerpt\":\"\\n<p>Stormbpmn поставляется как docker-контейнер из приватного репозитория, который включается в себя и front, и back. Установка заключается в правильном указании .ENV-перменных внутрь контейнера, поднятии смежных контейнеров (если необходимо), и манипуляции в административном интерфейсе.</p>\\n<div class=\\\"hint-container tip\\\">\\n<p class=\\\"hint-container-title\\\">Совет</p>\\n<p>Контейнер расположен в приватном репозитории, запросите доступ к нему через менеджера, с которым работаете.</p>\\n</div>\"}")
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
