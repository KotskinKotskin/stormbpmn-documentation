---
order: 3
index: true
---

# Авторизация
Поддерживается 4 типа авторизации - keycloak, oauth2, ldap, встроенная.  Рекомендуем использовать ouath2. Для встроенной авторизации дополнительных настроек не требуется.

## Настройка keycloak

В данном разделе перечислены настройки, которые связаны с авторизацией с использованием keycloak:
#### Переменные окружения
Осуществляется путем задания ENV-переменных:
- **KEYCLOAK_ENABLED** - включение интеграции. Значение по-умолчанию - false.
- **KEYCLOAK_URL** - URL авторизационного сервера. Используется для формирования ссылки для endpoint-а userInfo.
- **KEYCLOAK_REALM** - название REALMa. Используется для формирования ссылки для endpoint-а userInfo.
- **KEYCLOAK_FRONT_REALM** - используется для отдачи на фронт и правильного формирования кнопки.
- **KEYCLOAK_FRONT_CLIENT_ID** - используется для отдачи на фронт и правильного формирования кнопки.
- **KEYCLOAK_FRONT_URL** - используется для отдачи на фронт и правильного формирования кнопки.

## Административная панель
Осуществляется путем указания значения переменных на странице администрирования /app/admin:
- **showCustomSSOLoginButtonName** - отображать кнопку входа через Keycloak. По умолчанию - false.
- **customSSOLoginButtonName** - текст на кнопке  входа через Keycloak. По умолчанию - "Войти"
- **showSSOLogin** - отображать кнопку входа keycloak. По умолчанию - нет.

## Настройка LDAP

При использовании LDAP окно авторизации остается таким же как и при базовой авторизации, но полученные данные проходят проверку в LDAP-сервере.
#### Переменные окружения
- **LDAP_ENABLE** - включить LDAP. По-умолчанию - false.
- **LDAP_PRINCIPAL** - учетная запись, от которой можно делать проверку (userDn) Ожидаемое значение похоже на "cn=admin,dc=example, dc=org"
- **LDAP_URL** - адрес сервера LDAP. Ожидаемое значение похоже на "ldap://localhost:389", "ldaps://localhost:636"
- **LDAP_BASE** - местоположение в каталоге, с которого начинается поиск.  Ожидаемое значение похоже на"ou=SUPERGROUP,dc=example,dc=org"
- **LDAP_PASSWORD** - пароль учетной записи LDAP_PRINCIPAL.
 
Active directory kerberos SSO  не поддерживается, только simple bind.


## Настройка Oauth2
Самый простой и продвинутый способ авторизации. Задачется через административную панель:
- **OAuthIsEnabled** - включение кастомного провайдера Oauth. 
- **OAuthClientId** - clientId приложения, зарегистрированного в кастомном провайдере Oauth.
- **OAuthClientSecret** - clientSecret приложения, зарегистрированного в кастомном провайдере Oauth.
- **OAuthAuthorizeUri** - URL авторизации в кастомном провайдере.
- **OAuthUserInfoUri** - URL получения информации о пользователе.
- **OAuthTokenUri** - URL для запроса токена.
- **OAuthButtonLabel** - текст на кнопке авторизации.
- **OAuthRedirectUri** - URL для редиректа в приложение ( укажите ваш базовый URL + /app/sigin).

### Пример создания и настройки Oauth2-клиента в Keycloak 26.0.7
1. Создать клиента в нужном realm
2. Указать clientId
3. Указать Valid redirect URIs  как ${BASEURL}/app/signin (например https://stormbpmn.com/app/signin)
4. Указать Web origins как * или ${BASEURL} (например https://stormbpmn.com)
5. Client authentication -> ON
6. Authorization -> OFF
7. Standard flow -> ON
8. Implicit flow -> ON
9. На вкладке Credentianals:  Client Authenticator -> Client Id and Secret
10. Получить Client secret
11. На вкладке Client Scopes убедиться, что email и profile default
12. В настройках storm указать:
- Client Id
- Client Secret
- URL авторизации (например http://localhost:8888/realms/master/protocol/openid-connect/auth)
- URL получения информации о пользователе (например http://localhost:8888/realms/master/protocol/openid-connect/userinfo)
- URL получения токена (например http://localhost:8888/realms/master/protocol/openid-connect/token)
- Текст на кнопке входа (например Войти через ouath)
- URL для редиректа (например https://stormbpmn.com/app/signin)\
- Включить кастомный провайдер Oauth - ON

