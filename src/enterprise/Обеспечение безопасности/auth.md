---
order: 3
index: true
---

# Авторизация
Поддерживается 2 типа авторизации -  oauth2 и встроенная.  Рекомендуем использовать ouath2. Для встроенной авторизации дополнительных настроек не требуется.


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

### Проверка Claims внутри ответа

Система позволяет проверить наличие и значение конкретного Claim в ответе. Чтобы это заработало, необходимо внестри 3 настройки в разделе администрирования:
1. OAuthCheckClaim - true
2. OAuthClaimName - название клейма
3. OAuthClaimValue - значение клейма

Таким образом можно проверять не просто авторизацию в KK, а наличие полномочий в КК.
