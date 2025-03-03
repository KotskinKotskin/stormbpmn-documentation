import comp from "C:/StormBPMN/Stormdocs 20250301/stormbpmn-documentation/src/.vuepress/.temp/pages/enterprise/Обслуживание/index.html.vue"
const data = JSON.parse("{\"path\":\"/enterprise/%D0%9E%D0%B1%D1%81%D0%BB%D1%83%D0%B6%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5/\",\"title\":\"Задачи администрирования\",\"lang\":\"ru-RU\",\"frontmatter\":{\"dir\":{\"order\":4,\"link\":true,\"text\":\"Обсуживание\",\"collapsible\":true},\"index\":true,\"icon\":\"handshake-angle\",\"order\":-1},\"headers\":[{\"level\":2,\"title\":\"Мониторинг\",\"slug\":\"мониторинг\",\"link\":\"#мониторинг\",\"children\":[{\"level\":3,\"title\":\"Настройка алертов\",\"slug\":\"настроика-алертов\",\"link\":\"#настроика-алертов\",\"children\":[]},{\"level\":3,\"title\":\"Liveness и readiness probe\",\"slug\":\"liveness-и-readiness-probe\",\"link\":\"#liveness-и-readiness-probe\",\"children\":[]}]},{\"level\":2,\"title\":\"Резверное копирование\",\"slug\":\"резверное-копирование\",\"link\":\"#резверное-копирование\",\"children\":[]},{\"level\":2,\"title\":\"Восстановление резервной копии\",\"slug\":\"восстановление-резервнои-копии\",\"link\":\"#восстановление-резервнои-копии\",\"children\":[]},{\"level\":2,\"title\":\"Обновление версии\",\"slug\":\"обновление-версии\",\"link\":\"#обновление-версии\",\"children\":[]},{\"level\":2,\"title\":\"Disaster recovery plan при обновлении\",\"slug\":\"disaster-recovery-plan-при-обновлении\",\"link\":\"#disaster-recovery-plan-при-обновлении\",\"children\":[]},{\"level\":2,\"title\":\"Disaster recovery plan при базовой эксплуатации\",\"slug\":\"disaster-recovery-plan-при-базовои-эксплуатации\",\"link\":\"#disaster-recovery-plan-при-базовои-эксплуатации\",\"children\":[]},{\"level\":2,\"title\":\"Особенности\",\"slug\":\"особенности\",\"link\":\"#особенности\",\"children\":[]}],\"git\":{\"createdTime\":1715247837000,\"updatedTime\":1740668561000,\"contributors\":[{\"name\":\"Denis Kotov\",\"email\":\"31292696+KotskinKotskin@users.noreply.github.com\",\"commits\":1}]},\"readingTime\":{\"minutes\":1.87,\"words\":560},\"filePathRelative\":\"enterprise/Обслуживание/README.md\",\"localizedDate\":\"9 мая 2024 г.\",\"excerpt\":\"\\n<h2>Мониторинг</h2>\\n<p>Система предоставляет http-endpoint с метриками приложения в формате Micrometer.</p>\\n<p>Для сбора этих метрик необходимо использовать Prometeus с такой конфигурацией:</p>\\n<div class=\\\"language-text\\\" data-ext=\\\"text\\\" data-title=\\\"text\\\"><pre class=\\\"language-text\\\"><code>- job_name: 'storm-1' //повторить для всех нод\\n    metrics_path: '/actuator/prometheus'\\n    scrape_interval: 15s\\n    static_configs:\\n    - targets: ['10.1.0.3:80'] // ip-адрес сервиса\\n</code></pre></div>\"}")
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
