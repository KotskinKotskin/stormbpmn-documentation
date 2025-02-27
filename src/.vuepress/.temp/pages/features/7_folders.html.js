import comp from "D:/stormbpmn-documentation/src/.vuepress/.temp/pages/features/7_folders.html.vue"
const data = JSON.parse("{\"path\":\"/features/7_folders.html\",\"title\":\"Папки и теги\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":7},\"headers\":[{\"level\":2,\"title\":\"Создание новой папки, тэга\",\"slug\":\"создание-новои-папки-тэга\",\"link\":\"#создание-новои-папки-тэга\",\"children\":[]},{\"level\":2,\"title\":\"Управление папками\",\"slug\":\"управление-папками\",\"link\":\"#управление-папками\",\"children\":[]},{\"level\":2,\"title\":\"Использование тэгов\",\"slug\":\"использование-тэгов\",\"link\":\"#использование-тэгов\",\"children\":[]}],\"git\":{\"createdTime\":1714504462000,\"updatedTime\":1718606800000,\"contributors\":[{\"name\":\"VovaGDX\",\"email\":\"vladimir.shishkin@gmail.com\",\"commits\":5},{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":2}]},\"readingTime\":{\"minutes\":0.77,\"words\":230},\"filePathRelative\":\"features/7_folders.md\",\"localizedDate\":\"30 апреля 2024 г.\",\"excerpt\":\"\\n<p>Папки и тэги - предназначены для организации хранения диаграмм бизнес-процессов и их структурирования по общему признаку.\\nТаким признаком может быть принадлежность к направлению деятельности, продукту, функции, подразделению компании, владельцу процесса и т.п.\\nЧто является таким признаком Вы определяете сами, исходя из своих целей.\\nПапки и тэги помогают группировать связанные диаграммы процессов под \\\"общим флагом\\\". Это облегчает их поиск, управление ими.\\nИ особенно полезно при работе с большим количеством схем и сложной связанностью между ними.</p>\"}")
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
