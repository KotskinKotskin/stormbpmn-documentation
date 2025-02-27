<template><div><h1 id="авторизация" tabindex="-1"><a class="header-anchor" href="#авторизация"><span>Авторизация</span></a></h1>
<p>Поддерживается 4 типа авторизации - keycloak, oauth2, ldap, встроенная.  Рекомендуем использовать ouath2. Для встроенной авторизации дополнительных настроек не требуется.</p>
<h2 id="настроика-keycloak" tabindex="-1"><a class="header-anchor" href="#настроика-keycloak"><span>Настройка keycloak</span></a></h2>
<p>В данном разделе перечислены настройки, которые связаны с авторизацией с использованием keycloak:</p>
<h4 id="переменные-окружения" tabindex="-1"><a class="header-anchor" href="#переменные-окружения"><span>Переменные окружения</span></a></h4>
<p>Осуществляется путем задания ENV-переменных:</p>
<ul>
<li><strong>KEYCLOAK_ENABLED</strong> - включение интеграции. Значение по-умолчанию - false.</li>
<li><strong>KEYCLOAK_URL</strong> - URL авторизационного сервера. Используется для формирования ссылки для endpoint-а userInfo.</li>
<li><strong>KEYCLOAK_REALM</strong> - название REALMa. Используется для формирования ссылки для endpoint-а userInfo.</li>
<li><strong>KEYCLOAK_FRONT_REALM</strong> - используется для отдачи на фронт и правильного формирования кнопки.</li>
<li><strong>KEYCLOAK_FRONT_CLIENT_ID</strong> - используется для отдачи на фронт и правильного формирования кнопки.</li>
<li><strong>KEYCLOAK_FRONT_URL</strong> - используется для отдачи на фронт и правильного формирования кнопки.</li>
</ul>
<h2 id="административная-панель" tabindex="-1"><a class="header-anchor" href="#административная-панель"><span>Административная панель</span></a></h2>
<p>Осуществляется путем указания значения переменных на странице администрирования /app/admin:</p>
<ul>
<li><strong>showCustomSSOLoginButtonName</strong> - отображать кнопку входа через Keycloak. По умолчанию - false.</li>
<li><strong>customSSOLoginButtonName</strong> - текст на кнопке  входа через Keycloak. По умолчанию - &quot;Войти&quot;</li>
<li><strong>showSSOLogin</strong> - отображать кнопку входа keycloak. По умолчанию - нет.</li>
</ul>
<h2 id="настроика-ldap" tabindex="-1"><a class="header-anchor" href="#настроика-ldap"><span>Настройка LDAP</span></a></h2>
<p>При использовании LDAP окно авторизации остается таким же как и при базовой авторизации, но полученные данные проходят проверку в LDAP-сервере.</p>
<h4 id="переменные-окружения-1" tabindex="-1"><a class="header-anchor" href="#переменные-окружения-1"><span>Переменные окружения</span></a></h4>
<ul>
<li><strong>LDAP_ENABLE</strong> - включить LDAP. По-умолчанию - false.</li>
<li><strong>LDAP_PRINCIPAL</strong> - учетная запись, от которой можно делать проверку (userDn) Ожидаемое значение похоже на &quot;cn=admin,dc=example, dc=org&quot;</li>
<li><strong>LDAP_URL</strong> - адрес сервера LDAP. Ожидаемое значение похоже на &quot;ldap://localhost:389&quot;, &quot;ldaps://localhost:636&quot;</li>
<li><strong>LDAP_BASE</strong> - местоположение в каталоге, с которого начинается поиск.  Ожидаемое значение похоже на&quot;ou=SUPERGROUP,dc=example,dc=org&quot;</li>
<li><strong>LDAP_PASSWORD</strong> - пароль учетной записи LDAP_PRINCIPAL.</li>
</ul>
<p>Active directory kerberos SSO  не поддерживается, только simple bind.</p>
<h2 id="настроика-oauth2" tabindex="-1"><a class="header-anchor" href="#настроика-oauth2"><span>Настройка Oauth2</span></a></h2>
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
<h3 id="пример-создания-и-настроики-oauth2-клиента-в-keycloak-26-0-7" tabindex="-1"><a class="header-anchor" href="#пример-создания-и-настроики-oauth2-клиента-в-keycloak-26-0-7"><span>Пример создания и настройки Oauth2-клиента в Keycloak 26.0.7</span></a></h3>
<ol>
<li>Создать клиента в нужном realm</li>
<li>Указать clientId</li>
<li>Указать Valid redirect URIs  как ${BASEURL}/app/signin (например https://stormbpmn.com/app/signin)</li>
<li>Указать Web origins как * или ${BASEURL} (например https://stormbpmn.com)</li>
<li>Client authentication -&gt; ON</li>
<li>Authorization -&gt; OFF</li>
<li>Standard flow -&gt; ON</li>
<li>Implicit flow -&gt; ON</li>
<li>На вкладке Credentianals:  Client Authenticator -&gt; Client Id and Secret</li>
<li>Получить Client secret</li>
<li>На вкладке Client Scopes убедиться, что email и profile default</li>
<li>В настройках storm указать:</li>
</ol>
<ul>
<li>Client Id</li>
<li>Client Secret</li>
<li>URL авторизации (например http://localhost:8888/realms/master/protocol/openid-connect/auth)</li>
<li>URL получения информации о пользователе (например http://localhost:8888/realms/master/protocol/openid-connect/userinfo)</li>
<li>URL получения токена (например http://localhost:8888/realms/master/protocol/openid-connect/token)</li>
<li>Текст на кнопке входа (например Войти через ouath)</li>
<li>URL для редиректа (например https://stormbpmn.com/app/signin)\</li>
<li>Включить кастомный провайдер Oauth - ON</li>
</ul>
</div></template>


