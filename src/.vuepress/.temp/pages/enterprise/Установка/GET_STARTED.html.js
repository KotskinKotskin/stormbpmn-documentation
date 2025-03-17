import comp from "C:/StormBPMN/Stormdocs 20250317/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/Установка/GET_STARTED.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0/GET_STARTED.html\",\"title\":\"Get started\",\"lang\":\"ru-RU\",\"frontmatter\":{\"order\":-1,\"dir\":{\"link\":true},\"index\":true,\"icon\":\"\"},\"headers\":[{\"level\":2,\"title\":\"Настройка базы\",\"slug\":\"настроика-базы\",\"link\":\"#настроика-базы\",\"children\":[]},{\"level\":2,\"title\":\"Настройка приложения через .ENV-переменные\",\"slug\":\"настроика-приложения-через-env-переменные\",\"link\":\"#настроика-приложения-через-env-переменные\",\"children\":[]},{\"level\":2,\"title\":\"Создание административной учетной записи\",\"slug\":\"создание-административнои-учетнои-записи\",\"link\":\"#создание-административнои-учетнои-записи\",\"children\":[]},{\"level\":2,\"title\":\"Настройка авторизации\",\"slug\":\"настроика-авторизации\",\"link\":\"#настроика-авторизации\",\"children\":[]}],\"git\":{\"createdTime\":1740668561000,\"updatedTime\":1740668561000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":1.11,\"words\":332},\"filePathRelative\":\"enterprise/Установка/GET_STARTED.md\",\"localizedDate\":\"27 февраля 2025 г.\",\"excerpt\":\"\\n<p>Для минимальной работы приложения вам нужно всего 2 контейнера - сам контейнер приложения и база данных.</p>\\n<h2>Настройка базы</h2>\\n<ul>\\n<li>Разверните в докере Postgresql (12 или старше версии) или воспользуйтесь существующей инфраструктурой в компании.</li>\\n<li>Создайте схему (не обязательно, будет использоваться public по умолчанию). Запомните название.</li>\\n<li>Создайте базу. Запомните название.</li>\\n<li>Создайте пользователя с полными правами доступа к базе (и схему). Запомните логин и пароль.</li>\\n<li>Узнайте порт, на котором работает сервер БД. Запомните его.</li>\\n<li>Обеспечьте сетевую доступность между базой и предполагаемым местом установки основного контейнера.</li>\\n</ul>\"}")
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
