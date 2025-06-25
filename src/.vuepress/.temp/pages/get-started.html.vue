<template><div><h1 id="_1-схема-архитектуры" tabindex="-1"><a class="header-anchor" href="#_1-схема-архитектуры"><span>1. Схема архитектуры</span></a></h1>
<p>Если использовать все возможности системы, то компонентная архитектура будет выглядеть так <a href="https://stormbpmn.com/app/plant/f3af4a00-b1dd-4666-ad10-82f89705c74e" target="_blank" rel="noopener noreferrer">ссылка.<ExternalLinkIcon/></a></p>
<h2 id="архитектура-stormbpmn" tabindex="-1"><a class="header-anchor" href="#архитектура-stormbpmn"><span>Архитектура StormBPMN</span></a></h2>
<h3 id="основнои-компонент" tabindex="-1"><a class="header-anchor" href="#основнои-компонент"><span>Основной компонент</span></a></h3>
<ul>
<li><strong>Приложение StormBPMN</strong><br>
Центральное веб-приложение, поставляемое командой StormBPMN. Отвечает за моделирование, хранение и управление бизнес-процессами.</li>
</ul>
<hr>
<h3 id="используемая-инфраструктура-на-стороне-заказчика" tabindex="-1"><a class="header-anchor" href="#используемая-инфраструктура-на-стороне-заказчика"><span>Используемая инфраструктура (на стороне заказчика)</span></a></h3>
<h4 id="инфраструктурные-компоненты" tabindex="-1"><a class="header-anchor" href="#инфраструктурные-компоненты"><span>Инфраструктурные компоненты</span></a></h4>
<table>
<thead>
<tr>
<th>Компонент</th>
<th>Назначение</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Балансировщик нагрузки (рекомендуем nginx)</strong></td>
<td>Обеспечивает HTTPS, распределение трафика</td>
</tr>
<tr>
<td><strong>База данных (PostgreSQL 12+)</strong></td>
<td>Хранение всей информации</td>
</tr>
<tr>
<td><strong>Хранилище файлов (MinIO или любой S3-совместимый)</strong></td>
<td>Хранение документов, превью, вложений</td>
</tr>
<tr>
<td><strong>SMTP-сервер (внутренний)</strong></td>
<td>Отправка писем</td>
</tr>
<tr>
<td><strong>Keycloak / OAuth2 / LDAP</strong></td>
<td>Используются для авторизации пользователей</td>
</tr>
<tr>
<td><strong>Log Collector (например, Syslog)</strong></td>
<td>Сбор логов безопасности</td>
</tr>
<tr>
<td><strong>Prometheus</strong></td>
<td>Сбор метрик</td>
</tr>
<tr>
<td><strong>Grafana</strong></td>
<td>Визуализация метрик, алерты</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>LDAP</strong> помечен как устаревший способ авторизации и не рекомендуется к использованию в новых установках.</p>
</blockquote>
<hr>
<h3 id="внешние-open-source-решения" tabindex="-1"><a class="header-anchor" href="#внешние-open-source-решения"><span>Внешние open-source решения</span></a></h3>
<table>
<thead>
<tr>
<th>Компонент</th>
<th>Назначение</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>ListMonk</strong></td>
<td>Используется при сложной генерации и рассылке писем</td>
</tr>
<tr>
<td><strong>PlantUML</strong></td>
<td>Генерация UML-диаграмм</td>
</tr>
<tr>
<td><strong>Gotenberg</strong></td>
<td>Конвертация изображений и HTML в PDF</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="пользователи-системы" tabindex="-1"><a class="header-anchor" href="#пользователи-системы"><span>Пользователи системы</span></a></h3>
<table>
<thead>
<tr>
<th>Тип</th>
<th>Описание</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Пользователь</strong></td>
<td>Работа с процессами и шаблонами</td>
</tr>
<tr>
<td><strong>Администратор</strong></td>
<td>Настройка приложений, систем, метрик</td>
</tr>
<tr>
<td><strong>Администратор ИБ</strong></td>
<td>Настройка логирования и контроля безопасности</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="основные-взаимодеиствия" tabindex="-1"><a class="header-anchor" href="#основные-взаимодеиствия"><span>Основные взаимодействия</span></a></h3>
<ul>
<li>
<p>Пользователи и администраторы взаимодействуют с системой через балансировщик по HTTPS.</p>
</li>
<li>
<p>Приложение <code v-pre>stormbpmn</code>:</p>
<ul>
<li>сохраняет данные в PostgreSQL;</li>
<li>отправляет и принимает файлы через S3-совместимое хранилище;</li>
<li>отправляет письма через SMTP (или через ListMonk для сложной генерации);</li>
<li>обращается к системам авторизации: Keycloak, OAuth, LDAP;</li>
<li>генерирует диаграммы через PlantUML и PDF-документы через Gotenberg;</li>
<li>отправляет логи в Log Collector;</li>
<li>отдаёт метрики Prometheus.</li>
</ul>
</li>
<li>
<p>Prometheus собирает метрики с приложения.</p>
</li>
<li>
<p>Grafana отображает метрики и настраивает алерты.</p>
</li>
</ul>
<hr>
<h3 id="безопасность" tabindex="-1"><a class="header-anchor" href="#безопасность"><span>Безопасность</span></a></h3>
<ul>
<li>Все внешние подключения защищены через HTTPS.</li>
<li>Для админов и ИБ доступны SSH-подключения.</li>
<li>Устаревший LDAP выделен как компонент, не рекомендуемый к использованию.</li>
</ul>
</div></template>


