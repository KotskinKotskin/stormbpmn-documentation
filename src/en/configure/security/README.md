---
title: Security
order: 1
dir:
  order: 1
  link: true
  text: Security
  collapsible: true
index: true
redirectFrom:
  - /en/configure/SECURE.html
source_hash: 07b5eae22f77c849
---

[[toc]]

[[toc]]

# Information Security {#информационная-безопасность}

StormBPMN Enterprise ensures a high level of information security through a multi-layered protection system, including regular dependency updates, vulnerability scanning, and flexible access settings.

::: tip Security Principles

-   **Least Privilege** - only the necessary permissions
-   **Defense in Depth** - multi-layered security system
-   **Audit of All Actions** - complete logging of operations
-   **Data Encryption** - protection of passwords and confidential information

:::

---

---

## Security Environment Variables {#переменные-окружения-безопасности}

Basic security settings are configured via ENV variables:

| Variable                     | Description                                | Example Value                 | Default |
| ------------------------------ | --------------------------------------- | ------------------------------- | ------------ |
| **STORM_ALLOWED_ORIGINS**      | Allowed request origins (CORS)   | `https://stormbpmn.company.com` | `*`          |
| **STORM_DISABLE_SIMPLE_AUTH**  | Disable built-in authorization        | `true`                          | `false`      |
| **STORM_DISABLE_ENV_IN_UI**    | Hide ENV variables in the admin panel         | `true`                          | `false`      |
| **STORM_DISABLE_ANON_SHARING** | Prohibit anonymous access to diagrams | `true`                          | `false`      |
| **JWTSECRET**                  | Salt for password encryption             | Minimum 64 random characters   | -            |
| **SESSION_EXPIRATION**         | Session lifetime, **in seconds** (no more than 7776000) | `86400`              | 7 days      |

::: warning Security Recommendations

-   **STORM_ALLOWED_ORIGINS:** You must specify specific domains instead of `*` in production
-   **JWTSECRET:** Use a cryptographically secure random string of at least 64 characters — tokens are signed with the HS512 algorithm, which requires a key of ≥512 bits. With a short key, user login will fail with `WeakKeyException`
-   **STORM_DISABLE_ENV_IN_UI:** Enable in production to hide confidential data

:::

### Password Requirements {#требования-к-паролям}

When creating user accounts, changing a password, or restoring access, the system validates the password against the following requirements:

-   **Minimum length** — 8 characters
-   **Maximum length** — 72 bytes in UTF-8 encoding
-   **Prohibition of common passwords** — the password must not be included in the list of frequently used values

::: warning Error when setting a password
If the password does not meet the requirements, the system will return an error: "This password is too common — choose another one."
:::

In an Enterprise installation, the requirements can be tightened: length and complexity, lockout after failed login attempts,
password expiration, prohibition of repeating recent passwords — **[Password Policy](./password-policy.md)**.


---

---

## Settings in the Admin Panel {#настроики-в-административнои-панели}

### User Management {#управление-пользователями}

| Parameter                      | Description                     | Recommendation for production           |
| ----------------------------- | ---------------------------- | ------------------------------------- |
| **showRegistration**          | Show the registration form   | ❌ Disable                          |
| **showBasicLogin**            | Show login/password fields   | ❌ When using OAuth2           |
| **showCustomLoginButtonName** | Custom login button text | As required                         |
| **customLoginButtonName**     | Login button text        | `"Войти через корпоративный аккаунт"` |

### Public Access {#публичныи-доступ}

| Parameter               | Description                          | Production Recommendation |
| ----------------------- | ------------------------------------ | ------------------------- |
| **enableAnonSearchPage** | Search for unauthenticated users     | ❌ Disable                |
| **allDiagramsAnonAccess** | Anonymous access to all diagrams     | ❌ Disable                |

### Corporate Settings {#корпоративные-настроики}

| Parameter               | Description                                   | Recommendation                     |
| ---------------------- | ------------------------------------------ | -------------------------------- |
| **enableCommonAssets** | Common architecture elements for all teams | ✅ Enable for large companies |
| **enableCommonRoles**  | Common roles for all teams                 | ✅ Enable for standardization       |
| **enableCommonUsers**  | Common org structure for all teams         | ✅ Enable for centralization    |

---

---

## Audit Logging {#аудит-логирование}

Complete logging of all user actions — to the console, to a SIEM via Syslog, or to a dedicated TimescaleDB database: **[Audit Logging](./audit-logging.md)**.

---

---

## Authentication System {#система-авторизации}

Corporate authentication (OAuth2, Keycloak, Microsoft ADFS), claims validation, and built-in login are covered in a separate article — **[Authentication System](./authorization.md)**.

---

## Adding Custom SSL Certificates {#добавление-собственных-ssl-сертификатов}

### Problem {#проблема}

If you use your own MinIO, S3, or another HTTPS service with a self-signed certificate, Java inside the container may not trust it. This will result in the following error:

```
javax.net.ssl.SSLHandshakeException: PKIX path building failed
```

### Solution {#решение}

You need to mount your own `truststore.jks`, replacing the standard Java truststore.

### Step 1. Creating truststore.jks {#шаг-1-создание-truststore-jks}

If you have a certificate file (for example, `minio-ca.crt`), run:

```bash
keytool -importcert \
  -file minio-ca.crt \
  -alias my-root-ca \
  -keystore truststore.jks \
  -storepass changeit \
  -noprompt
```

::: tip Truststore password
The password `changeit` is standard for a Java truststore. You can use a different one, but it must match in the command and at startup.
:::

### Step 2. Truststore path in the container {#шаг-2-путь-к-truststore-в-контеинере}

The StormBPMN container uses the image `eclipse-temurin:11-jre-alpine`. The path to the standard truststore:

```
/opt/java/openjdk/lib/security/cacerts
```

::: warning Path verification
If mounting does not work, check the current path using the command:

```bash
docker run --rm eclipse-temurin:11-jre-alpine find /opt -name "cacerts" 2>/dev/null
```

:::

### Step 3. Run with truststore replacement {#шаг-3-запуск-с-заменои-truststore}

In `docker-compose.yml`:

```yaml
services:
    stormbpmn:
        image: _ваш_образ_
        volumes:
            - ./truststore.jks:/opt/java/openjdk/lib/security/cacerts:ro
```

Or in the command line:

```bash
docker run \
  -v $(pwd)/truststore.jks:/opt/java/openjdk/lib/security/cacerts:ro \
  _ваш_образ_
```

### Result {#результат}

Java in the container will use your truststore and trust the specified certificates. No changes to environment variables are required.

---

## Security checklist {#чек-лист-безопасности}

### Mandatory settings {#обязательные-настроики}

-   [ ] **CORS configured** - specific domains are specified instead of `*`
-   [ ] **OAuth2 configured** - corporate authentication is active
-   [ ] **Registration disabled** - `showRegistration = false`
-   [ ] **Anonymous access prohibited** - all `*AnonAccess = false` parameters
-   [ ] **ENV hidden** - `STORM_DISABLE_ENV_IN_UI = true`
-   [ ] **Password policy** - [lockout after failed attempts](./password-policy.md) is enabled if built-in login is used

### Additional measures {#дополнительные-меры}

-   [ ] **Claims verification** - group/role verification in OAuth2 is configured
-   [ ] **Network isolation** - access only from the corporate network
-   [ ] **SSL/TLS** - mandatory traffic encryption
-   [ ] **Backup** - regular database backups
-   [ ] **Monitoring** - tracking of suspicious activity
-   [ ] **Audit logging** - [action log](./audit-logging.md) is enabled

---

---

## Related documentation {#связанная-документация}

-   **[Configuration](/en/configure/README.md)** - complete settings reference
-   **[Production-Ready](/en/install/production/)** - production setup
-   **[Monitoring](/en/support/README.md)** - metrics and alerts

::: tip Need help?
For security-related inquiries, contact **help@stormbpmn.com** or your account manager.
:::
