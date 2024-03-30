export const themeData = JSON.parse("{\"repo\":\"KotskinKotskin/stormbpmn-documentation\",\"repoLabel\":\"Улучшить документацию\",\"docsRepo\":\"KotskinKotskin/stormbpmn-documentation\",\"docsDir\":\"docs\",\"docsBranch\":\"main\",\"editLinks\":true,\"editLinkText\":\"Помогите нам улучшить документацию\",\"displayAllHeaders\":true,\"smoothScroll\":true,\"lastUpdated\":\"Обновлено\",\"sidebar\":[\"/\",\"/get-started\",\"/real-life-scenarios/\",\"/features/\",\"/team-work/\",\"/api/\",\"/examples/\",\"/usefull-link/\",\"/how-to/\",\"/enterprise/\"],\"logo\":\"https://stormbpmn.com/static/img/bpmnstorm_small.png\",\"navbar\":[\"/\",\"/get-started\"],\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
