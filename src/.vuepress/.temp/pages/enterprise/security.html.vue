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
<p>Поддерживается 3 типа авторизации - keycloak, oauth2, ldap.  Рекомендуем использовать ouath2.</p>
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
  "timestamp": "2007-12-03T10:15:30:55.000000", // временная метка в таймзоне сервера
  "sessionId": "ergjieor-ergjniuo-qjwer", // уникальная ID сессии пользователя. 
  "forwarder": null, // пустота
  "source": "stormbpmn", // название нашего приложения. Может быть изменено
  "subject": "kotov@bpmn2.ru", // почта пользователя, соверщающего запрос.
  "subjectIP": "192.168.0.1", // ip-адрес пользователя. Получается от прокси-сервера из заголовка X-Forwarded-For. Если заголовок отсутствует, то значение будет отсутствовать. 
  "object": "uaerhgae-aerj3234-egerg", // ID объекта, надо который совершается операция.
  "resourse": "diagram", // тип объекта, над который совершается операция.
  "ctp": null, //служебное поле
  "tags": [ 
    "storm",
    "users_audit",
    "iia",
    null,
    null
  ], //служебные поля
  "payload": {
    "method": "POST", //вызванный метод
    "url": "/api/v1/diagram", //вызванный URL
    "request": { //присланный запрос, уникальный объект для каждого URL
       ...
    },
    "response": { //полученный ответ, уникальный объект для каждого URL
      
    }
  },
  "result": "sucess" // success если код ответа 2ХХ, в противом случае "error"
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="настроика-syslog" tabindex="-1"><a class="header-anchor" href="#настроика-syslog"><span>Настройка Syslog</span></a></h3>
<p>Для включения SIEM-логирования в syslog необходимо установить следующие ENV-переменные:</p>
<ul>
<li>TBD - включает SIEM-логирование. По-умолчанию - false.</li>
<li>TBD - указывает сервера syslog. Можно указать несолько через запятую. Протокол передачи данных - TCP, без SSL.</li>
</ul>
</div></template>


