---
dir:
  order: 3
  link: true
  text: 3. Configuration
  collapsible: true
index: true
order: 3
source_hash: c44cf60949b52876
---

[[toc]]

# System Configuration {#конфигурация-системы}

Stormbpmn uses a **two-tier configuration system** that provides configuration flexibility for various deployment scenarios.

::: tip Two configuration levels
**Level 1:** Environment variables (ENV) - basic infrastructure settings
**Level 2:** Admin panel - business logic and functionality
:::

## Level 1: Environment Variables (ENV) {#уровень-1-переменные-окружения-env}

Environment variables are configured **before starting the container** and define the system's base infrastructure. These parameters **require a restart** of the application to apply changes.

| Variable                 | Description                                         | Example Value                            | Required  |
|----------------------------|--------------------------------------------------|--------------------------------------------|--------------|
| **JDBC_URL**               | PostgreSQL connection string                  | `jdbc:postgresql://192.168.0.6:5432/storm` | ✅            |
| **JDBC_USERNAME**          | Database username                     | `stormuser`                                | ✅            |
| **JDBC_PASSWORD**          | User password                              | `secure_password_123`                      | ✅            |
| **JAVA_OPTS**              | JVM memory settings                         | `"-Xmx8g"`                                 | ✅            |
| **SPRING_PROFILES_ACTIVE** | Spring Boot profile                              | `prod`                                     | ✅            |
| **JWTSECRET**              | Salt for password encryption                      | At least 64 random characters             | ✅            |
| **LICENSE_KEY_V2**         | Enterprise v2 license key                   | Obtain using the full installation activation code — [where to get the code](/en/operation/License.md#где-взять-код-активации-на-существующеи-инсталляции) | When migrating to v2; not required for v1 |
| **LICENSE_KEY**            | Deprecated Enterprise v1 license key        | Existing value                      | Temporarily supported |
| **S3_ENDPOINT**            | URL of S3-compatible storage                    | `http://192.168.0.4:9000`                  | Files        |
| **S3_ACCESS_KEY**          | S3 access key                                | `stormbpmn-s3-user`                        | Files        |
| **S3_SECRET_KEY**          | S3 secret key                                | `stormbpmn-s3-password`                    | Files        |
| **S3_REGION**              | S3 region (if applicable)                         | `ru-3`                                     | Files        |
| **S3_BUCKET_UPLOADS**      | Default bucket                               | `storm-uploads`                            | Files        |
| **S3_BUCKET_USERS**        | Bucket for users                          | `storm-users`                              | Files        |
| **S3_BUCKET_IMPORTS**      | Bucket for imports                               | `storm-imports`                            | Files        |
| **S3_VIRTUAL_HOST**        | vHosted addressing type                            | `false`                                    | Files        |
| **S3_SINGLE_USERS_BUCKET** | Single bucket mode for users           | `true`                                     | Files        |
| **S3_EXTERNAL_ENDPOINT**   | S3 address for links opened by the browser (if different from `S3_ENDPOINT`) | `https://s3.company.com` | Files (optional) |
| **PLANTUML_SERVER**        | PlantUML server URL                             | `http://192.168.0.5:8090/`                 | Optional  |
| **GOTENBERG_URL**          | Gotenberg service URL. If not specified, the public demo service `https://demo.gotenberg.dev` is used — specify your own in production | `http://192.168.0.5:3001` | PDF |
| **GOTENBERG_WAIT_FOR_EXPRESSION** | Expression that Gotenberg waits for on the page before printing to PDF (do not change) | `window.overlayReady != undefined && window.overlayReady` | PDF (optional) |
| **EMAIL_PROVIDER**         | Email provider type                         | `listmonk` or `smtp`                      | ✅            |
| **LISTMONK_BASE_URL**      | ListMonk API URL                                 | `http://localhost:9000/api`                | ✅            |
| **LISTMONK_USERNAME**      | API username                             | `stormbpmn`                                | ✅            |
| **LISTMONK_PASSWORD**      | API token                                        | `api-token-here`                           | ✅            |
| **REDIS_ENABLED**          | Enable Redis (for collaborative editing) | `true`                                     | Collaboration |
| **REDIS_HOST**             | Redis host                                       | `192.168.0.7`                              | Collaboration |
| **REDIS_PORT**             | Redis port                                       | `6379`                                     | Collaboration |
| **REDIS_PASSWORD**         | Redis password                                     | `your-password`                            | Collaboration |
| **REDIS_DATABASE**         | Redis database number                          | `0`                                        | Collaboration |
| **REDIS_TIMEOUT**          | Redis connection timeout                      | `1000ms`                                   | Collaboration |
| **AUDIT_ENABLED**          | Enable request audit                        | `true`                                     | Security |
| **AUDIT_CHANNEL**          | Audit log channel                                | `syslog`                                   | Security |
| **SYSLOG_SERVERS**         | List of syslog servers                           | `localhost:514,192.168.78.53:601`          | Security |
| **SYSLOG_SOURCE**          | Application name in logs                      | `stormbpmn`                                | Security |
| **SMARTCAPTCHA_SECRET**    | Yandex SmartCaptcha secret key, required only when captcha is enabled | `ysc1_...` (obtain in the Yandex SmartCaptcha dashboard) | Optional |

::: tip Captcha is disabled by default in Enterprise
Captcha on login and registration forms is enabled by the **`enableCaptchaCheck`** setting in
the administrative panel (Security group). Password login checks the captcha only if
the setting is explicitly enabled. If you open standalone registration via the form
(`showRegistraton`), explicitly disable `enableCaptchaCheck`: until the setting is saved, the
registration form assumes captcha is enabled. Enable captcha only if built-in password login is accessible from the internet: in that case, the key
`SMARTCAPTCHA_SECRET` and application access to `smartcaptcha.yandexcloud.net` are required. If Yandex
is unavailable, the check is skipped, and login is not blocked. The captcha cannot be replaced with another service.

When logging in via SSO (OAuth2/OIDC, Keycloak, ADFS), the captcha is not used: the provider confirms the login, and its protection policies apply. Do not enable the captcha in a closed environment.
:::

::: warning Important notes

-   **PostgreSQL schema:** To connect to a specific schema, use: `jdbc:postgresql://localhost:5432/mydatabase?currentSchema=myschema`
-   **PostgreSQL extensions:** the database must use the **UTF8** encoding and have the **pgvector** (`vector`), **pg_trgm**, **pgcrypto**, **uuid-ossp**, and **hstore** extensions. `pg_trgm` is created manually; the others are created by migrations on the first run. The standard `postgres:17` **does not include pgvector** — use the `pgvector/pgvector:pg17` image. For details, see [“PostgreSQL Requirements”](/en/install/README.md).
-   **S3 storage:** Without S3, functionality is limited: there are no diagram thumbnails, user avatars, or document handling.
-   **EMAIL_PROVIDER:** For ListMonk, specify `listmonk`; for simple SMTP, specify `smtp`
-   **SMTP settings:** The host, port, credentials, and sender are configured only via the environment variable `SMTP_*` — see [“Simple SMTP”](/en/install/production/components.md#вариант-2-простои-smtp)

:::

### Mandatory Legend {#легенда-обязательности}

| Symbol       | Meaning                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------- |
| ✅           | **Mandatory** - the system will not start without these parameters                                  |
| Files        | **For files** - required for working with documents and images                              |
| Optional     | **Optional** - for additional functionality                                        |
| PDF          | **For PDF** - required for document generation                                             |
| Collaboration | **Collaborative editing** - Redis for multi-instance, not required for a single instance   |
| Security     | **For security** - required to meet information security requirements                                 |

## Level 2: Admin Panel {#уровень-2-административная-панель}

Settings in the admin panel control the **business logic** of the application and can be changed **without restarting** the system.

::: tip Access to the Admin Panel
The admin panel is available at: `/app/admin`
Team administrator privileges are required.
:::

### General System Settings {#общие-настроики-системы}

#### Basic Parameters {#базовые-параметры}

| Parameter    | Description                         | Example Value                 | Required |
| ----------- | -------------------------------- | ------------------------------- | ----------- |
| **baseUrl** | Base URL for links in emails | `https://stormbpmn.company.com` | ✅          |

#### Team and User Settings {#настроики-команд-и-пользователеи}

| Parameter                | Description                                                      | Recommendation                                |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| **enableCommonAssets**  | Common architecture elements for all teams                    | ✅ Enable for large organizations         |
| **enableCommonRoles**   | Common roles for all teams                                    | ✅ Enable for standardization                  |
| **enableCommonUsers**   | Common org structure                               | ✅ Enable for centralized management |
| **autoJoinTeamId**      | Team ID for automatically adding new users | Specify the ID of the main team                 |
| **disableTeamPopUp**    | Disable the prompt to create a team                         | ✅ Enable for centralized management |
| **disableTeamCreation** | Prohibit team creation                                     | ✅ Enable for strict control            |

#### Public Access {#публичныи-доступ}

| Parameter                  | Description                            | Recommendation                  |
| ------------------------- | ----------------------------------- | ----------------------------- |
| **allDiagramsAnonAccess** | Anonymous access to all diagrams | ❌ Disable for security |
| **enableAnonSearchPage**  | Search for anonymous users   | As required by business         |

#### Login Screen and Registration {#экран-входа-и-регистрация}

| Parameter            | Description                                                                                                                                           | Recommendation                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **showRegistraton** | Display basic registration. When disabled, the "Create now" link on the login screen, the registration form, and the registration button on the license page are hidden (from version 6.6.6668) | ❌ Disable if users are created only by the administrator/via SSO |

::: tip The configuration key is exactly `showRegistraton`
The letter "i" is historically missing from the key (not `showRegistration`). Find the setting in the admin panel by the name **"Display basic registration"** (group "Security").
:::

#### Licensing {#лицензирование}

| Parameter                        | Description                       | Recommendation              |
| ------------------------------- | ------------------------------ | ------------------------- |
| **autoEnableEnterpriseLicense** | Automatic license issuance | ✅ Enable for simplification |
| **createPendingEnterpriseUsers** | Create an inactive account upon login attempt if automatic license issuance is disabled. The account appears in "User Management" with the status **"Pending Activation"** and does not consume a license until the administrator activates it. Details: ["Pending Activation" Accounts](/en/operation/License.md#учетные-записи-«ожидает-активации») | Enable if licenses are issued via support requests |
| **licensePageHtml**             | Custom HTML block on the license status page `/license-active` (from version 6.6.6668). Details: [License Page Customization](/en/operation/License.md#кастомизация-страницы-лицензии) | As required by business     |

#### Branding and Login Page {#брендинг-и-страница-входа}

Company name and logo, greeting, brand color, support links, and login methods are more convenient to configure on a separate tab **"Branding and Login Page"** (Administration). All these settings are public: the login page reads them before authentication. Details and list of keys (`brandCompanyName`, `brandWelcomeTitle`, `brandLogo`, `brandLogoDark`, `brandPrimaryColor`, `brandColorOverridesTeams`, `supportMode`, `kbMode`, and others): ["Branding and Login Page"](/en/configure/branding.md).

::: tip "License Issuance via Requests" Scenario (STP)
If licenses are issued via approved requests, disable **autoEnableEnterpriseLicense** and enable **createPendingEnterpriseUsers**:

1. A user logs in for the first time via SSO/LDAP (or registers) — the account is created as **inactive**, and no license is consumed. The user sees the message "account created, but license not issued — contact the server administrator".
2. The administrator sees such accounts with the status **"Pending Activation"** in "User Management" and activates the required one with a single click. If there are no free licenses available, activation will end with a clear error.
3. After activation, the user logs in without restrictions, and the account begins to consume a license.

If both settings are disabled, login for an unknown user is prohibited, and no account is created (previous behavior).
:::

::: warning Binding v2 Key to Installation
The license key **LICENSE_KEY_V2** is bound to a specific installation. If the key does not match, the system will not start, and one of the following messages will be displayed on the login screen:

- **"License key is not set or cannot be read"** — the variable `LICENSE_KEY_V2` is not set or contains invalid data.
- **"License key was issued without installation binding"** — the key was issued before the binding mechanism was introduced and is no longer valid. Obtain a new key.
- **"License key does not match this installation"** — the key was issued for a different installation. Obtain a new key.
- **"Failed to verify license binding"** — technical error during verification. Click the **"Retry"** button.

Priority: if **LICENSE_KEY_V2** is set, it is used instead of the deprecated **LICENSE_KEY**.
:::

### Simple SMTP Settings {#настроики-простого-smtp}

::: warning Environment variables only
Simple SMTP is configured using the backend container's environment variables (`EMAIL_PROVIDER=smtp` and `SMTP_*`) — see [«Simple SMTP»](/en/install/production/components.md#вариант-2-простои-smtp). The SMTP section in the administrative panel has been removed. If the host, port, or credentials were previously specified there, migrate them to environment variables before updating — otherwise, emails will stop being sent. Changes take effect after restarting the container.
:::

### ListMonk template settings {#настроики-шаблонов-listmonk}

Use the expression `{{ .Tx.Data.storm_placeholder }}` in the template, where `storm_placeholder` is the substitution name from the table.

::: tip Example
The expression `{{ .Tx.Data.diagram_name }}` will display the diagram name in the email.
:::

| Parameter                               | Notification type                     | Substitutions                                                    |
| -------------------------------------- | ----------------------------------- | -------------------------------------------------------------- |
| **commentEmailTemplateId**             | New comment                   | `comment_author`, `diagram_name`, `diagram_url`, `html_text`   |
| **approvalTemplateId**                 | Approval request              | `invite_author`, `diagram_name`, `diagram_url`                 |
| **restorePasswordTemplateId**          | Password recovery               | `restoreCode`                                                  |
| **approvalCompletedTemplateId**        | Approval completed              | `diagram_name`, `diagram_url`                                  |
| **userActivationTemplateId**           | User activation              | `activation_token`                                             |
| **secureUpdateTemplateId**             | Diagram invitation             | `invite_author`, `diagram_name`, `diagram_url`                 |
| **inviteDiagramAndRegisterTemplateId** | Invitation + registration           | `invite_author`, `diagram_name`, `diagram_url`, `register_url` |
| **teamInviteTemplateId**               | Team invitation               | `invite_author`, `team_name`                                   |
| **teamInviteAndRegisterTemplateId**    | Team invitation + registration | `invite_author`, `team_name`, `register_url`                   |

### Additional settings {#дополнительные-настроики}

#### For complex network configurations {#для-сложных-сетевых-конфигурации}

| Parameter                     | Description                                | Example value              |
| ---------------------------- | --------------------------------------- | ---------------------------- |
| **gotenbergOverrideBaseUrl** | Direct address to bypass load balancers | `http://corp.storm.internal` |

---

## Configuration Order {#порядок-конфигурации}

### 1. Configuring ENV variables {#_1-настроика-env-переменных}

1. **Core parameters**:

    ```bash
    JDBC_URL=jdbc:postgresql://db:5432/stormbpmn
    JDBC_USERNAME=stormbpmn_user
    JDBC_PASSWORD=secure_password
    JAVA_OPTS="-Xmx8g"
    SPRING_PROFILES_ACTIVE=prod
    JWTSECRET=your-secret-key-here
    LICENSE_KEY_V2=your-license-v2
    ```

    Existing installations may temporarily continue using `LICENSE_KEY` without immediate configuration changes. v1 licenses are deprecated and have a known security limitation; therefore, use `LICENSE_KEY_V2` for new installations and planned migrations.

    If a non-empty `LICENSE_KEY_V2` is specified, the application uses only it. An invalid v2 does not trigger a fallback to `LICENSE_KEY`: correct it, or remove or clear v2 and restart all instances. With an invalid non-empty v2, the backend may start in a license-locked mode, preserving access for the existing owner to recover via `/admin-onboarding`. With an empty v2, the legacy path applies: the absence of both keys does not guarantee user lockout. For the initial startup and module verification, follow the [activation order](/en/operation/License.md#активация-инсталляции).

2. **Additional services** (as needed):

    ```bash
    # S3-хранилище
    MINIO_ENDPOINT=http://minio:9000
    MINIO_ACCESSKEY=stormbpmn-user
    MINIO_SECRETKEY=secure-password

    # Почта
    EMAIL_PROVIDER=listmonk
    LISTMONK_BASE_URL=http://listmonk:9000/api
    LISTMONK_USERNAME=stormbpmn
    LISTMONK_PASSWORD=api-token

    # Redis (для совместного редактирования, обязателен при multi-instance)
    REDIS_ENABLED=true
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=your-password
    ```

3. **Restart the container** to apply the changes

### 2. Configuration via the Admin Panel {#_2-настроика-через-админку}

1. **Log in to the admin panel**: `/app/admin`
2. **Configure basic parameters**:
    - `baseUrl` - required for correct links
    - Team and user policies
3. **Configure integrations**:
    - Email templates (for ListMonk)
    - SMTP parameters (for simple email)
4. **Save changes** - applied instantly

---

## Configuration Check {#проверка-конфигурации}

### Checklist {#проверочныи-список}

-   [ ] **The application starts** without errors
-   [ ] **The database** is connected (migration logs are present)
-   [ ] **S3 storage** is working (diagram thumbnails are visible)
-   [ ] **Email notifications** are working (test: `@email@company.com test`)
-   [ ] **Redis** is connected (if multi-instance: open the diagram in 2 tabs and verify synchronization)
-   [ ] **The administrative panel** is accessible
-   [ ] **The license** is activated

### Common Issues {#распространенные-проблемы}

| Problem                  | Cause                     | Solution                                       |
| ------------------------- | --------------------------- | --------------------------------------------- |
| Application does not start | Incorrect JDBC parameters     | Check the database connection                    |
| No diagram thumbnails     | Incorrect MINIO parameters    | Check S3 availability                      |
| Emails are not being sent        | Incorrect email settings | Check EMAIL_PROVIDER and parameters          |
| License errors           | No suitable key or an incorrect `LICENSE_KEY_V2` is specified | Note the exclusive priority of a non-empty v2, verify the full code on `/admin-onboarding`; see the [license recovery section](/en/operation/License.md#диагностика-и-восстановление) for the procedure |
| PDF does not download        | Gotenberg is not configured        | Check GOTENBERG_URL and service availability |
| No collaborative editing | REDIS_ENABLED=false or Redis is unavailable | Check REDIS_ENABLED, REDIS_HOST, and the connection |

---

## Related documentation {#связанная-документация}

-   **[Quick Start](../install/quickstart/README.md)** - minimal configuration
-   **[Production-Ready](/en/install/production/)** - full configuration
-   **[Security](/en/configure/security/)** - SIEM and audit
-   **[Monitoring](../support/README.md)** - metrics and alerts

::: tip Need help?
If you have questions about configuration, contact **help@stormbpmn.com** or your account manager.
:::

## Settings Visibility for Unauthenticated Users {#видимость-настроек-для-неавторизованных-пользователеи}

In the admin panel, each setting has a **"Settings Visibility"** toggle — it allows the value to be passed to the frontend **before user login** (login screen, license page).

::: warning Rules have been tightened since version 6.6.6668
Previously, a setting with **unchecked** visibility could be included in the anonymous output. Now, unauthenticated users receive **only** settings with explicitly enabled visibility. After updating, verify that the toggle is enabled for settings that affect the login screen:

-   `showBasicLogin`, `showCustomLoginButtonName`, `CustomLoginButtonName`
-   `enableYandexSSO`
-   `showRegistraton`
-   `customMenuItems`
-   `licensePageHtml`

If the login form "disappears" after the update — open the login page with the parameter `?showBasicLogin=true` and enable visibility for the required settings in the admin panel.
:::

::: warning Secrets are not provided to anonymous users even with visibility enabled
Settings whose names contain the substrings `secret`, `token`, `password`, `passwd`, `private`, `credential`, `apikey`, `api_key`, `smtp`, `prompt`, `ldap` are always excluded from the anonymous output — this is a protection against accidental leakage. The downside: **do not use these words** in the names of custom settings that must be visible before login. Also, continue to **not enable** visibility for passwords and confidential data.
:::
