---
title: Session Binding to SSO
order: 3
source_hash: 8ac0033d5ec826cf
---

[[toc]]

# Session Binding to SSO (Renewal via refresh_token) {#привязка-сессии-к-sso-продление-по-refresh-token}

By default, after a successful login, StormBPMN issues its **own** access token and uses it until expiration, regardless of what happens to the user's session with the authentication provider. This is acceptable for many installations, but the security departments of banks and government companies prohibit such behavior: the application must not have its own long-lived session and is required to renew access with the provider using the standard procedure (RFC 6749 §6).

The **OAuthUseRefreshTokens** setting switches StormBPMN to this mode.

| Item | Without the setting | With the setting |
| --- | --- | --- |
| StormBPMN token lifetime | `SESSION_EXPIRATION` (default 7 days) | Exactly the same as the provider's access token |
| Renewal | Not required | Via `grant_type=refresh_token` with the provider |
| Session revocation at the provider | No impact on StormBPMN until token expiration | User is logged out at the next renewal |

::: warning PKCE mode only
Binding works only with `OAuthFlowMode = PKCE`. In legacy mode `implicit_flow`, the application does not receive a `refresh_token` from the provider, so there is nothing to renew — the setting does not apply there.
:::

## Enabling {#включение}

| Parameter | Value | Note |
| --- | --- | --- |
| **OAuthUseRefreshTokens** | `true` | Disabled by default |

This setting is located in the **Security** section of the instance settings screen, alongside the other OAuth2 parameters.

### What the provider must return {#что-должен-отдавать-проваидер}

The token endpoint response must contain:

- **`refresh_token`** — non-empty;
- **`expires_in`** — greater than zero.

Additionally, `refresh_expires_in` is used if the provider returns it: StormBPMN uses it to determine until when the session can be extended. Providers that do not return this field are supported — see [Storage and cleanup](#хранение-и-очистка).

::: danger Login will be rejected if the provider does not issue a refresh_token
When the setting is enabled, StormBPMN **does not issue** its own long-lived token under any circumstances — otherwise, the promise that "the application has no sessions of its own" would be silently violated, and this could only be detected from the logs.

Therefore, if the provider does not return `refresh_token` or `expires_in`, SSO login is **rejected** with the message "Authentication provider did not issue a refresh_token — login is prohibited by security policy." An ERROR-level entry appears in the application log indicating what to check.

Before enabling the setting, ensure that the client in the provider actually issues `refresh_token`. In Keycloak, this is handled by **Use Refresh Tokens** in the client settings.
:::

::: tip Testing with a single user
The setting applies to the entire instance at once. If there are doubts about the provider configuration, enable it during off-peak hours: with incorrect client settings, SSO login will stop working for everyone, and only an administrator who logs in with a password can disable the setting again.
:::

## How It Works {#как-это-работает}

1. The user logs in via the provider. StormBPMN receives `access_token`, `refresh_token`, and expiration times from the token endpoint.
2. `refresh_token` is stored **only on the server** in encrypted form. It is never sent to the browser; the StormBPMN token contains only the session row identifier.
3. The StormBPMN token is issued for the duration of the `expires_in` provider — typically minutes, not days.
4. The interface refreshes the token proactively, without waiting for it to expire: via a timer, upon returning to the tab, and upon receiving a "token expired" response to any request. The refresh is transparent to the user.
5. Refreshing is performed through the provider. As long as the provider agrees to extend the session, work is not interrupted.

### When a session terminates {#когда-сессия-прекращается}

| Event | What happens |
| --- | --- |
| Provider denied renewal (`invalid_grant`) | The user is logged out, and the server-side session record is deleted |
| User signed out of their account | The server-side session record is deleted immediately, rather than waiting for expiration |
| Account disabled by an administrator | The next renewal is rejected, and the record is deleted |
| User forcibly logged out by an administrator | Session records are deleted immediately |
| Account deleted | Session records are deleted along with it |
| Setting disabled | Renewal is closed for **all** issued tokens, and users must log in again |

::: tip Provider unavailability does not log out users
If the provider is temporarily unavailable (restart, network failure), StormBPMN responds with "try again later" and **preserves** the session. The interface retries with an increasing delay. Only an explicit provider denial triggers logout — otherwise, a Keycloak restart would log out all users at once.
:::

## Storage and Cleanup {#хранение-и-очистка}

`refresh_token` and `id_token` are stored in the `sm_oauth_refresh_sessions` table **in encrypted form** — the encryption key is derived from the `JWTSECRET` installation.

Records are deleted:

- upon session termination under any scenario listed in the table above;
- after the expiration of `refresh_expires_in`, if the provider provided it;
- after 30 days without a single renewal — a safeguard for providers that do not return `refresh_expires_in`.

Background cleanup runs every 6 hours.

::: warning The table is not included in the installation transfer
`sm_oauth_refresh_sessions` is excluded from the installation transfer bundle: live provider refresh tokens must not leave the environment in which they were issued. After the transfer, users must sign in again — this is expected behavior, not data loss.
:::

## Provider Request Timeouts {#таим-ауты-обращения-к-проваидеру}

The extension request is sent to the provider over HTTP. Timeouts are configured via application properties:

| Property | Default Value | Purpose |
| --- | --- | --- |
| `oauth.http.connect-timeout-ms` | `5000` | Establishing a connection to the provider |
| `oauth.http.read-timeout-ms` | `10000` | Waiting for a response from the token endpoint |

You should only change these values if the provider responds through a slow corporate proxy. Note: increasing the timeout also extends the time a user waits when the provider is unavailable.

## SESSION_EXPIRATION is specified in seconds {#session-expiration-задается-в-секундах}

::: danger A value in milliseconds will prevent the application from starting
The variable **`SESSION_EXPIRATION`** sets the lifetime of the StormBPMN token and is measured in **seconds**.

The application **does not start** if the value exceeds 90 days (`7776000`) and writes to the log what to check. The threshold is chosen to filter out values written in milliseconds: for example, `86400000` is not one day, but 2.7 years.

If your installation explicitly sets `SESSION_EXPIRATION`, check the unit of measurement: one day is `86400`, one week is `604800`.
:::

The `OAuthUseRefreshTokens` setting does not affect this: when binding is enabled, the token lifetime is determined by the provider, and `SESSION_EXPIRATION` continues to apply for password-based login and for installations without binding.

## Diagnostics {#диагностика}

| Symptom | Probable cause |
| --- | --- |
| SSO login rejected with a mention of `refresh_token` | The client in the provider does not issue `refresh_token` (in Keycloak — **Use Refresh Tokens**) or the response does not contain no `expires_in` |
| The setting is enabled, but sessions are still long | `implicit_flow` mode is set — binding works only with `PKCE` |
| Users are logged out shortly after login | The provider revokes the session upon renewal. Check the client's restrictions on refresh token reuse and the SSO session duration in the realm |
| The application does not start after an update | `SESSION_EXPIRATION` is specified in milliseconds — see the section above |
