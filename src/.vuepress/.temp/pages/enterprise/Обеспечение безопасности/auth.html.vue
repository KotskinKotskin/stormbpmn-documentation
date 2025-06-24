<template><div><h1 id="авторизация" tabindex="-1"><a class="header-anchor" href="#авторизация"><span>Авторизация</span></a></h1>
<p>Поддерживается 2 типа авторизации -  oauth2 и встроенная.  Рекомендуем использовать ouath2. Для встроенной авторизации дополнительных настроек не требуется.</p>
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
<h3 id="проверка-claims-внутри-ответа" tabindex="-1"><a class="header-anchor" href="#проверка-claims-внутри-ответа"><span>Проверка Claims внутри ответа</span></a></h3>
<p>Система позволяет проверить наличие и значение конкретного Claim в ответе. Чтобы это заработало, необходимо внестри 3 настройки в разделе администрирования:</p>
<ol>
<li>OAuthCheckClaim - true</li>
<li>OAuthClaimName - название клейма</li>
<li>OAuthClaimValue - значение клейма</li>
</ol>
<p>Таким образом можно проверять не просто авторизацию в KK, а наличие полномочий в КК.</p>
<h3 id="вход-с-базовои-авторизациеи-даже-когда-она-отключена" tabindex="-1"><a class="header-anchor" href="#вход-с-базовои-авторизациеи-даже-когда-она-отключена"><span>Вход с базовой авторизацией, даже когда она отключена</span></a></h3>
<p>Для админских целей можно в query параметры на странице входа указать showBasicLogin=true, тогда отобразится базовая форма входа</p>
</div></template>


