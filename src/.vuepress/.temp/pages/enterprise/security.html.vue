<template><div><div class="hint-container caution">
<p class="hint-container-title">Предупреждение</p>
<p>Раздел в разработке</p>
</div>
<h1 id="обеспечение-информационнои-безопасности" tabindex="-1"><a class="header-anchor" href="#обеспечение-информационнои-безопасности"><span>Обеспечение информационной безопасности</span></a></h1>
<p>Мы серьезно относимся к обеспечению информационной безопасности при использовании нашего решения. Помимо регулярного обновления зависимостей, сканирования приложения сканерами уязвимости и устранение найденных уязвимостей, мы предоставляем важные настройки, которые позволяют существенно органичить возможности системы для неавторизованных пользователей.</p>
<h2 id="возможные-настроики" tabindex="-1"><a class="header-anchor" href="#возможные-настроики"><span>Возможные настройки</span></a></h2>
<p>В данном разделе перечислены общие настройки, которые могут быть связаны с обеспечением безопасности и удобства использования системы:</p>
<h3 id="переменные-окружения" tabindex="-1"><a class="header-anchor" href="#переменные-окружения"><span>Переменные окружения</span></a></h3>
<p>Настройки задаются с помощью ENV-переменных, переданных в контейнер:</p>
<ul>
<li><strong>STORM_ALLOWED_ORIGINS</strong> - определяет источник запросов из браузера (CORS). Значение по-умолчанию - *.</li>
<li><strong>STORM_DISABLE_SIMPLE_AUTH</strong> - запрещает авторизацию в системе по внутреннему механизму. Значение по-умолчанию - false.</li>
<li><strong>STORM_DISABLE_ENV_IN_UI</strong> - запрещает просмотр ENV-переменных в интерфейсе администратора системы. Значение по-умолчанию - false.</li>
<li><strong>STORM_DISABLE_ANON_SHARING</strong> - запрещает возможность поделиться диаграммой для анонимных пользователей. Значение по-умолчанию - false.</li>
<li><strong>JWT_SECRET</strong> - соль для паролей в базе.</li>
</ul>
<h3 id="административная-панель" tabindex="-1"><a class="header-anchor" href="#административная-панель"><span>Административная панель</span></a></h3>
<p>Переменные в административной панели:</p>
<ul>
<li><strong>showRegistraton</strong> - отображать или нет возможность регистрации в системы. По-умолчанию - true.</li>
<li><strong>showBasicLogin</strong> - отображать поля для входа с логином и паролем. По-умолчанию - true.</li>
<li><strong>showCustomLoginButtonName</strong> - отображать уникальный текст на кнопке входа. По-умолчанию - false.</li>
<li><strong>CustomLoginButtonName</strong>- текст на кнопке входа. По-умолчанию -&quot;Войти&quot;.</li>
<li><strong>enableAnonSearchPage</strong> - разрешить отображение страницы поиска для неавторизированных пользователей. По-умолчанию - false.</li>
<li><strong>enableCommonAssets</strong> - сделать элементы архитектуры общими для всего сервера. По-умолчанию - false.</li>
<li><strong>enableCommonRoles</strong> - сделать роли общими для всего сервера. По-умолчанию - false.</li>
<li><strong>enableCommonUsers</strong> - сделать всех сотрудников и оргструктуру общей для всего сервера. По-умолчанию - false.</li>
<li><strong>allDiagramsAnonAccess</strong> - разрешить анонимный доступ ко всех диаграммам. По-умолчанию - false..</li>
</ul>
<h2 id="авторизация" tabindex="-1"><a class="header-anchor" href="#авторизация"><span>Авторизация</span></a></h2>
<p>Поддерживается 4 типа авторизации - keycloak, oauth2, ldap, встроенная.  Рекомендуем использовать ouath2. Для встроенной авторизации дополнительных настроек не требуется.</p>
<h3 id="настроика-keycloak" tabindex="-1"><a class="header-anchor" href="#настроика-keycloak"><span>Настройка keycloak</span></a></h3>
<p>В данном разделе перечислены настройки, которые связаны с авторизацией с использованием keycloak:</p>
<h4 id="переменные-окружения-1" tabindex="-1"><a class="header-anchor" href="#переменные-окружения-1"><span>Переменные окружения</span></a></h4>
<p>Осуществляется путем задания ENV-переменных:</p>
<ul>
<li><strong>KEYCLOAK_ENABLED</strong> - включение интеграции. Значение по-умолчанию - false.</li>
<li><strong>KEYCLOAK_URL</strong> - URL авторизационного сервера. Используется для формирования ссылки для endpoint-а userInfo.</li>
<li><strong>KEYCLOAK_REALM</strong> - название REALMa. Используется для формирования ссылки для endpoint-а userInfo.</li>
<li><strong>KEYCLOAK_FRONT_REALM</strong> - используется для отдачи на фронт и правильного формирования кнопки.</li>
<li><strong>KEYCLOAK_FRONT_CLIENT_ID</strong> - используется для отдачи на фронт и правильного формирования кнопки.</li>
<li><strong>KEYCLOAK_FRONT_URL</strong> - используется для отдачи на фронт и правильного формирования кнопки.</li>
</ul>
<h4 id="административная-панель-1" tabindex="-1"><a class="header-anchor" href="#административная-панель-1"><span>Административная панель</span></a></h4>
<p>Осуществляется путем указания значения переменных на странице администрирования /app/admin:</p>
<ul>
<li><strong>showCustomSSOLoginButtonName</strong> - отображать кнопку входа через Keycloak. По умолчанию - false.</li>
<li><strong>customSSOLoginButtonName</strong> - текст на кнопке  входа через Keycloak. По умолчанию - &quot;Войти&quot;</li>
<li><strong>showSSOLogin</strong> - отображать кнопку входа keycloak. По умолчанию - нет.</li>
</ul>
<h3 id="настроика-ldap" tabindex="-1"><a class="header-anchor" href="#настроика-ldap"><span>Настройка LDAP</span></a></h3>
<p>При использовании LDAP окно авторизации остается таким же как и при базовой авторизации, но полученные данные проходят проверку в LDAP-сервере.</p>
<h4 id="переменные-окружения-2" tabindex="-1"><a class="header-anchor" href="#переменные-окружения-2"><span>Переменные окружения</span></a></h4>
<ul>
<li><strong>LDAP_ENABLE</strong> - включить LDAP. По-умолчанию - false.</li>
<li><strong>LDAP_PRINCIPAL</strong> - учетная запись, от которой можно делать проверку (userDn) Ожидаемое значение похоже на &quot;cn=admin,dc=example, dc=org&quot;</li>
<li><strong>LDAP_URL</strong> - адрес сервера LDAP. Ожидаемое значение похоже на &quot;ldap://localhost:389&quot;, &quot;ldaps://localhost:636&quot;</li>
<li><strong>LDAP_BASE</strong> - местоположение в каталоге, с которого начинается поиск.  Ожидаемое значение похоже на&quot;ou=SUPERGROUP,dc=example,dc=org&quot;</li>
<li><strong>LDAP_PASSWORD</strong> - пароль учетной записи LDAP_PRINCIPAL.</li>
</ul>
<p>Active directory kerberos SSO  не поддерживается, только simple bind.</p>
<h3 id="настроика-oauth2" tabindex="-1"><a class="header-anchor" href="#настроика-oauth2"><span>Настройка Oauth2</span></a></h3>
<p>Самый простой и продвинутый способ авторизации. Задачется через административную панель:</p>
<ul>
<li><strong>OAuthIsEnabled</strong> - включение кастомного провайдера Oauth.</li>
<li><strong>OAuthClientId</strong> - clientId приложения, зарегистрированного в кастомном провайдере Oauth.</li>
<li><strong>OAuthClientSecret</strong> - clientSecret приложения, зарегистрированного в кастомном провайдере Oauth.</li>
<li><strong>OAuthAuthorizeUri</strong> - URL авторизации в кастомном провайдере.</li>
<li><strong>OAuthUserInfoUri</strong> - URL получения информации о пользователе.</li>
<li><strong>OAuthTokenUri</strong> - URL для запроса токена.</li>
<li><strong>OAuthButtonLabel</strong> - текст на кнопке авторизации.</li>
<li><strong>OAuthRedirectUri</strong> - URL для редиректа в приложение ( укажите ваш базовый URL + /app/sigin).</li>
</ul>
<h2 id="регистрация-событии-безопасности-и-интеграции-с-siem-лог-коллекторами" tabindex="-1"><a class="header-anchor" href="#регистрация-событии-безопасности-и-интеграции-с-siem-лог-коллекторами"><span>Регистрация событий безопасности и интеграции с SIEM\лог-коллекторами</span></a></h2>
<p>Мы предоставляем возможность получать информацию о всех операциях, выполняемых авторизированными пользователями в отдельном хранилище. Сейчас поддерживается Syslog как транспорт, сообщите менеджерам, если вам требуется другой транспорт, например Kafka.</p>
<h3 id="особенности" tabindex="-1"><a class="header-anchor" href="#особенности"><span>Особенности</span></a></h3>
<ul>
<li>SIEM-логирование работает только для авторизованных методов</li>
<li>Мы маскируем авторизационные заголовки и пароли, их невозможно найти в логах.</li>
<li>Мы не сохраняем большие элементы запросов (body диаграмм).</li>
</ul>
<h3 id="принцип-работы" tabindex="-1"><a class="header-anchor" href="#принцип-работы"><span>Принцип работы</span></a></h3>
<p>Каждый запрос-ответ от пользователя формирует следующий объект:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>{
  "timestamp": "2007-12-03T10:15:30:55.000000", // Временная метка в таймзоне сервера
  "sessionId": "ergjieor-ergjniuo-qjwer", // Уникальный ID сессии пользователя 
  "forwarder": null, // Служебное поле
  "source": "stormbpmn", // Название нашего приложения. Может быть изменено в ENV переменной SYSLOG_SOURCE.
  "subject": "kotov@bpmn2.ru", // Почта пользователя, соверщающего запрос
  "subjectIP": "192.168.0.1", // IP-адрес пользователя. Проставляется при наличии заголовка X-Forwarded-For от прокси-сервера.
  "object": "uaerhgae-aerj3234-egerg", // ID объекта, над которым совершается операция
  "resourse": "diagram", // Тип объекта, над которым совершается операция. Список возможных значений: GET /api/v1/syslog/resources
  "ctp": null, // Служебное поле
  "action": "CHANGE" // Тип события. Возможные значения: [ GET, CREATE, CHANGE, DELETE ]
  "tags": [ 
    "storm",
    "users_audit",
    "iia",
    null,
    null
  ], // Служебные поля
  "payload": {
    "method": "POST", // Вызванный метод
    "url": "/api/v1/diagram", // Вызванный URL
    "request": { // Присланный запрос, уникальный объект для каждого URL
       ...
    },
    "response": { // Полученный ответ, уникальный объект для каждого URL
       ...
    }
  },
  "result": "SUCCESSFUL" // Статус ответа. Возможные значения: [ SUCCESSFUL, CLIENT_ERROR, SERVER_ERROR ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="настроика-syslog" tabindex="-1"><a class="header-anchor" href="#настроика-syslog"><span>Настройка Syslog</span></a></h3>
<p>Для включения SIEM-логирования в syslog необходимо установить следующие ENV-переменные:</p>
<table>
<thead>
<tr>
<th style="text-align:center">Название</th>
<th style="text-align:center">Описание</th>
<th style="text-align:center">Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">AUDIT_ENABLED</td>
<td style="text-align:center">Флаг включения аудита запросов</td>
<td style="text-align:center">true</td>
</tr>
<tr>
<td style="text-align:center">AUDIT_CHANNEL</td>
<td style="text-align:center">Канал аудит логов</td>
<td style="text-align:center">syslog</td>
</tr>
<tr>
<td style="text-align:center">SYSLOG_SERVERS</td>
<td style="text-align:center">Список syslog серверов для стриминга<br>(протокол TCP, формат сообщений <a href="https://datatracker.ietf.org/doc/html/rfc3164" target="_blank" rel="noopener noreferrer">RFC 3164<ExternalLinkIcon/></a>)</td>
<td style="text-align:center">localhost:514,192.168.78.53:601<br>(пример)</td>
</tr>
<tr>
<td style="text-align:center">SYSLOG_SOURCE</td>
<td style="text-align:center">Название приложения<br>(передается серверам и в поле source самого лога)</td>
<td style="text-align:center">stormbpmn<br>(по умолчанию)</td>
</tr>
</tbody>
</table>
</div></template>


