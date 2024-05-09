<template><div><h1 id="enterprise-версия" tabindex="-1"><a class="header-anchor" href="#enterprise-версия"><span>Enterprise-версия</span></a></h1>
<p>Enterprise-версия, в отличии от облака, обладает рядом приемуществ и дает дополнительные функции, связанные с эксплуатацией в мульти-командном окружении и на своих серверах.</p>
<table>
<thead>
<tr>
<th style="text-align:center">#</th>
<th style="text-align:center">Параметр</th>
<th style="text-align:center">Team</th>
<th style="text-align:center">Enterprise</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">1</td>
<td style="text-align:center">Функционал моделирования процессов</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">2</td>
<td style="text-align:center">Управление серверами Camunda</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">3</td>
<td style="text-align:center">Установка на свои сервера</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">4</td>
<td style="text-align:center">Корпоративное обучение</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">5</td>
<td style="text-align:center">Базовый SLA ( 5 дней реакция, 30 дней устранение)</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center">6</td>
<td style="text-align:center">Расширенный SLA (2 часа реакция, 5 дней устранение)</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">7</td>
<td style="text-align:center">Интеграция с BI</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">8</td>
<td style="text-align:center">Интеграция через public api</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">9</td>
<td style="text-align:center">SSO</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">10</td>
<td style="text-align:center">Аудит событий информационной безопасности</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">11</td>
<td style="text-align:center">Влияние на роудмап продукта</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">12</td>
<td style="text-align:center">Выделенный менеджер поддержки</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">13</td>
<td style="text-align:center">Массовая выгрузка в BPMN</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">14</td>
<td style="text-align:center">Централизованное управление командами и пользователями</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">15</td>
<td style="text-align:center">Бесплатные лицензии на просмотр</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">16</td>
<td style="text-align:center">Удобный способ предоставлять доступ на просмотр на уровне предприятия</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center">17</td>
<td style="text-align:center">Уровень управления</td>
<td style="text-align:center">Команда</td>
<td style="text-align:center">Команды</td>
</tr>
</tbody>
</table>
<h2 id="архитектура" tabindex="-1"><a class="header-anchor" href="#архитектура"><span>Архитектура</span></a></h2>
<p>Stormbpmn используется в своей работе несколько Open-source решений, которые поставляются как docker-контейнеры, а так же инфраструктуру заказчика:</p>
<p><img src="@source/enterprise/storm-arch.png" alt="image"></p>
<p>В некоторых ситуациях Stormbpmn предлагает опции по использованию компонент:</p>
<ul>
<li><strong>Аутентификация</strong> (Keycloak/LDAPS/Внутренний механизм) : на выбор прямая интеграция с LDAP, через Keycloak или встроенный механизм. Keycloak позволяет подключить другие провайдеры авторизации, но требует отдельного обслуживания.</li>
<li><strong>E-mail уведомления</strong> (SMTP/Mautic) интеграция через mautic дает возможность шаблонизировать письма под ваши потребности, но требует отдельного обслуживания.</li>
<li><strong>Отрисовка PlantUML</strong> (PlantUML/Не использовать): позволяет рисовать в Stormbpmn PlantUML диаграммы.</li>
<li><strong>Мониторинг</strong> (Prometheus/Не использовать):  позволяет анализировать работоспособность системы.</li>
</ul>
<h2 id="админинистративныи-интерфеис" tabindex="-1"><a class="header-anchor" href="#админинистративныи-интерфеис"><span>Админинистративный интерфейс</span></a></h2>
<p>Административный интерфейс получают все члены <em>специальной команды</em> на сервере. Вот как туда попасть:
<img src="@source/enterprise/admin-link.png" alt="image"></p>
<h3 id="управление-пользователями" tabindex="-1"><a class="header-anchor" href="#управление-пользователями"><span>Управление пользователями</span></a></h3>
<p>Это вкладка позволяет:</p>
<ul>
<li>Поменять почту, емейл, имя, должность пользователя.</li>
<li>Заблокировать пользователя и освободить лицензию.</li>
<li>Войти в систему под пользователем.</li>
</ul>
<h3 id="управление-командами" tabindex="-1"><a class="header-anchor" href="#управление-командами"><span>Управление командами</span></a></h3>
<p>Эта вкладка позволяет:</p>
<ul>
<li>Посмотреть все команды на сервере</li>
<li>Добавить пользователя в команду</li>
<li>Сделать пользователя администратором команды</li>
</ul>
<h3 id="лицензия" tabindex="-1"><a class="header-anchor" href="#лицензия"><span>Лицензия</span></a></h3>
<p>Это вкладка отображает актуальную информацию по вашей лицензии и позволяет выкидывать текущих пользователей (при конкурентных лицензия).</p>
<h3 id="переменные-окружения" tabindex="-1"><a class="header-anchor" href="#переменные-окружения"><span>Переменные окружения</span></a></h3>
<p>Это вкладка показывает технические настройки, с которыми запущен контейнер приложения.</p>
<h3 id="настроика-приложения" tabindex="-1"><a class="header-anchor" href="#настроика-приложения"><span>Настройка приложения</span></a></h3>
<p>Это вкладка позволяет менять настройки приложения,а именно:</p>
<ul>
<li>baserUrl - базовый урл системы, используется для формирования ссылок в письмах.</li>
<li>showRegistraton - показывать или нет регистрацию.</li>
<li>showCustomLoginButtonName - показывать уникальный текст на кнопке входа.</li>
<li>CustomLoginButtonName - текст на кнопке входа.</li>
<li>enableCommonAssets - сделать Элементы архитектуры общими для всех пользователей системы.</li>
<li>enableCommonRoles - сделать Роли общими для всех пользователей системы.</li>
<li>showSSOLogin - показывать кнопку авторизации Keycloak.</li>
<li>enableCommonUsers - сделать Пользователей (для участников диаграммы) общими для всех пользователей системы.</li>
<li>allDiagramsAnonAccess - сделать анонимный доступ до всех диаграмм без авторизации.</li>
<li>enableAnonSearchPage - отображать вместо главной страницу поиска по диаграммам для анонимов.</li>
<li>enableCaptchaCheck - проверка Captcha при регистрации и приглашении пользователей.</li>
<li>enablePreventAutosave - включить проверка версии автосохранения.</li>
<li>yandexPrivateKey - закрытый ключ авторизации из сервисного аккаунта яндекса ( используется для интеграции с YandexGPT).</li>
<li>yandexOpenKeyId - идентификатор открытого ключа из сервисного аккаунта яндекса ( используется для интеграции с YandexGPT).</li>
<li>yandexServiceAccountId - идентификатор сервисного аккаунта яндекса ( используется для интеграции с YandexGPT).</li>
<li>yandexXFolderId - идентификатор папки в яндекс облаке ( используется для интеграции с YandexGPT).</li>
<li>stormVersion - HTML разметка, которая вставляется в футер. Обновляется автоматически при установке новых версий.</li>
<li>checkDuplicates - при сохранении диаграмм позволяет проверить и вывести уведомление о совпадении имен.</li>
<li>simpleEmailEnabled - включен простой отправитель писем. (изменения применяется ТОЛЬКО после перезагрузки приложения).</li>
<li>simpleSmtpHost - SMTP хост. (изменения применяется ТОЛЬКО после перезагрузки приложения).</li>
<li>simpleSmtpPort- SMTP порт. TLS протокол установлен по-умолчанию. (изменения применяется ТОЛЬКО после перезагрузки приложения).</li>
<li>simpleSmtpUsername - SMTP пользователь (аутентификация и отправка “ОТ”). (изменения применяется ТОЛЬКО после перезагрузки приложения).</li>
<li>simpleSmtpPassword - SMTP пароль.(изменения применяется ТОЛЬКО после перезагрузки приложения).</li>
<li>baseTemplateId - UUID базового шаблона для генерации регламентов бизнес-процессов.</li>
<li>autoEnableEnterpriseLicense - автоматическая выдача лицензии любому, кто залогинился в систему.</li>
</ul>
<p>Настройка видимости в “настройке” разрешает возвращать настройку на фронт, т.е. делает доступным просмотр для клиента. Не устанавливаете ее для паролей и прочих вещей, которые не влияют на поведение приложения на фронте.</p>
<h2 id="инструкция-по-установке" tabindex="-1"><a class="header-anchor" href="#инструкция-по-установке"><span>Инструкция по установке</span></a></h2>
<p>По запросу через менеджера, с которым вы работаете.</p>
</div></template>


