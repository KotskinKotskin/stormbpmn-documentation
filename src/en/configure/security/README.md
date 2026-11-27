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
source_hash: d848dbe0a033702c
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
| **showRegistraton**          | Show the registration form   | ❌ Disable                          |
| **showBasicLogin**            | Show login/password fields   | ❌ When using OAuth2           |
| **showCustomLoginButtonName** | Custom login button text | As required                         |
| **CustomLoginButtonName**     | Login button text        | `"Войти через корпоративный аккаунт"` |

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

**Do not replace Java's default `cacerts` with a newly created truststore containing only your private CA.** That removes trusted public CAs and can break HTTPS to S3, your IdP, or other services. Copy the **existing** `cacerts` from the same StormBPMN image version and import your private CA into that copy instead.

### Step 1. Verify the path in the running container {#шаг-1-создание-truststore-jks}

```bash
docker exec stormbpmn sh -c 'echo "$JAVA_HOME"; ls -l "$JAVA_HOME/lib/security/cacerts"'
```

`stormbpmn` is an example container name; use yours. The path `/opt/java/openjdk/lib/security/cacerts` below is **only an example**. Confirm it for your specific image and Java version.

### Step 2. Copy the default truststore and import your CA {#шаг-2-путь-к-truststore-в-контеинере}

```bash
# -L copies the referenced file even if cacerts is a symbolic link.
docker cp -L stormbpmn:/opt/java/openjdk/lib/security/cacerts ./storm-cacerts
keytool -importcert \
  -file minio-ca.crt \
  -alias my-root-ca \
  -keystore ./storm-cacerts \
  -storepass changeit \
  -noprompt
```

`changeit` is the usual password for Java's default `cacerts`. Use the actual password if your image uses a different one. Keep private keys or other sensitive truststore contents out of source control.

### Step 3. Mount the extended truststore {#шаг-3-запуск-с-заменои-truststore}

In `docker-compose.yml` (verify the destination path against your container):

```yaml
services:
  stormbpmn:
    image: your-stormbpmn-image
    volumes:
      - ./storm-cacerts:/opt/java/openjdk/lib/security/cacerts:ro
```

Recreate the container after editing its volumes. After upgrading the application image or Java, re-check and refresh the copied `cacerts` so that public CA updates are not lost.

### Result {#результат}

Java keeps trusting the original public CAs and additionally trusts the imported corporate CA. After restarting, verify both your internal S3 connection and any other HTTPS integrations.

---

## Running the container with restricted privileges {#запуск-контейнера-с-ограниченными-правами}

The image (versions after 9.29.139) runs without root and without extra privileges:

-   the process runs as uid 999 with group 0; any uid with group 0 also works (OpenShift restricted-v2), another group does not;
-   no capabilities are needed: `cap_drop: [ALL]` and `no-new-privileges` are fine;
-   the root filesystem can be read-only. `/tmp` and `/var/cache/storm/djl` must be writable and **not `noexec`**: the knowledge base search loads its native libraries from there;
-   the image has no package manager, curl or wget. Use orchestrator HTTP probes for health checks, or bash: `bash -c 'exec 3<>/dev/tcp/127.0.0.1/8082 && printf "GET /actuator/health/readiness HTTP/1.0\r\nHost: localhost\r\n\r\n" >&3 && cat <&3'`.

Docker compose example:

```yaml
services:
  stormbpmn:
    image: registry.stormbpmn.com/stormbpmn-enterprise/stormbpmn_fullstack_enterprise:<version>
    read_only: true
    tmpfs:
      - /tmp:exec,size=1g
      - /var/cache/storm/djl:exec,size=1g
    cap_drop: [ALL]
    security_opt: [no-new-privileges:true]
    stop_grace_period: 90s
```

In Kubernetes, set the same in the chart values: `securityContext.readOnlyRootFilesystem: true` and an `emptyDir` on `/tmp` and `/var/cache/storm/djl` via `extraVolumes` / `extraVolumeMounts`.

---

## Security checklist {#чек-лист-безопасности}

### Mandatory settings {#обязательные-настроики}

-   [ ] **CORS configured** - specific domains are specified instead of `*`
-   [ ] **OAuth2 configured** - corporate authentication is active
-   [ ] **Registration disabled** - `showRegistraton = false`
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
-   [ ] **Restricted container privileges** - read-only root filesystem, `cap_drop: ALL` ([running the container with restricted privileges](#запуск-контейнера-с-ограниченными-правами))
-   [ ] **Image signature verified** - the `cosign verify` command is in the notes of every version

---

---

## Related documentation {#связанная-документация}

-   **[Configuration](/en/configure/README.md)** - complete settings reference
-   **[Production-Ready](/en/install/production/)** - production setup
-   **[Monitoring](/en/support/README.md)** - metrics and alerts

::: tip Need help?
For security-related inquiries, contact **help@stormbpmn.com** or your account manager.
:::
