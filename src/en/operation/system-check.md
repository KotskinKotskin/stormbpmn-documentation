---
title: System Check
source_hash: 348aba9ccc33a0d1
---

[[toc]]

# System Check {#проверка-системы}

Stormbpmn Enterprise includes automatic environment checks: database, license, application address, email, file storage, PDF export, and other external services. They indicate what is misconfigured **before** users encounter issues and suggest how to fix it.

::: tip What this provides

-   The administrator sees the cause of the failure in plain language and a link to the relevant documentation section.
-   Configuration cannot be completed "blindly": as long as a check is red, the wizard will not proceed.
-   Support receives a report showing the installation status.

:::

## Where to Find {#где-наити}

Checks are available to the administrator with full permissions in two places:

1.  **Initial Setup Wizard (Administrator Onboarding)**, "System Check" step. The wizard opens upon the first login to a new installation.
2.  **Admin Panel → "System Status" tab** after setup is complete. If the last check found errors, was performed long ago (more than 7 days), or the system has been updated to a new version, the tab displays a "Requires Attention" marker and a prompt to re-check the system.

Checks are triggered when the page is opened and via the "Check Again" button. All checks run in parallel; each is time-limited (10 seconds, 40 seconds for Gotenberg). If a service does not respond within this time, the check receives an "Error" status with the note "no response within N s".

## Statuses {#статусы}

| Status | Meaning | Blocks completion of configuration |
| ------ | ------------ | :----------------------------: |
| **OK** ("Working") | Check passed | No |
| **WARN** ("Warning") | Working, but the configuration looks suspicious: most likely a typo or an inappropriate selection | No |
| **FAIL** ("Error") | The feature is not working or will not work | **Yes** |
| **SKIPPED** ("Not configured") | An optional service is not connected; there is nothing to check | No |

Each check has a brief explanation of the reason, a hint on what to fix, a "How to configure" link to the documentation section, and (where appropriate) an "Open configuration" button. If a check has technical details, they can be expanded via the "More details" link. Next to the configuration, the source of the value is indicated: an environment variable, an application setting, or a default value.

## Which checks are performed {#какие-проверки-выполняются}

| Check | What it does | Typical causes of a red status |
| -------- | ---------- | --------------------------------- |
| **Database** | Queries the PostgreSQL version, database encoding, and list of extensions | Database is unavailable (incorrect address, login, or password, network between containers); extensions `vector`, `pg_trgm`, `pgcrypto`, `uuid-ossp`, `hstore` are not installed; database encoding is not `UTF8`. Requirements — see the [“PostgreSQL Requirements”](/en/install/README.md#требования-к-postgresql-расширения-и-кодировка) section |
| **License** | Verifies that the license key is accepted and bound to this installation | `LICENSE_KEY_V2` is not set or the key cannot be read; the key was issued without binding to this installation or for a different installation; failed to calculate the activation code. See [“Diagnostics and Recovery”](/en/operation/License.md#диагностика-и-восстановление) |
| **Application Address** | Checks the `baseUrl` setting: links in emails are built based on it, and Gotenberg uses it to open the application | `baseUrl` is not set (**Error**). If the administrator page is opened via a different address than specified in `baseUrl`, — **Warning**: this can happen behind a proxy, but more often it is a typo |
| **Email (SMTP)** | Connects to the SMTP server (and authenticates if authentication is enabled), but does **not** send an email. For providers other than SMTP (for example, ListMonk), the check is not performed — they are verified in their own dashboard | `EMAIL_PROVIDER=smtp` or `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` are not set; the server is unavailable from the Stormbpmn container; incorrect `SMTP_USERNAME` and `SMTP_PASSWORD`; the server requires a different port or encryption |
| **File Storage (S3)** | Verifies writing, reading, and deleting a test file in the upload and import buckets (and in the common user bucket when `S3_SINGLE_USERS_BUCKET=true`). If a bucket is created for each user, it also checks the permission to create buckets. Then, access from the browser is verified (see below) | A placeholder address remains instead of `S3_ENDPOINT`; incorrect access keys; no permissions for the buckets; the bucket does not exist; the S3 gateway returned data different from what was written |
| **PDF Export (Gotenberg)** | Three steps: the address is not a public demo service; Gotenberg responds to the health check request; Gotenberg opens the application page and returns a PDF | A public demo service `demo.gotenberg.dev` is specified; the Gotenberg container is not running or `GOTENBERG_URL` is unavailable from the Stormbpmn container; Gotenberg is alive, but cannot see the application at address `baseUrl` or `gotenbergOverrideBaseUrl` (different Docker network, DNS, self-signed certificate) |
| **PlantUML Diagrams** | Sends a test diagram to the server and waits for a response with an image in SVG format | A placeholder address remains instead of `PLANTUML_SERVER`; the server is unavailable; the server responded with an error or returned non-SVG |
| **Simulations (DES)** | Requests the limitations of the DES service from it | `DES_BASE_URL` is not set if the module is present in the license; the DES container is not running or is unavailable from the Stormbpmn container |
| **Voice Input (storm-media)** | Verifies that the speech recognition service responds | Address `stormMediaBaseUrl` is set, but the token `stormMediaToken` is empty; the service is unavailable from the Stormbpmn container (the address is specified as the service root, without `/v1`) |
| **AI Model (LLM)** | Checks the language model settings **without making a request to it**; a live request is made via a separate button | The `bpmnAiCompletion` setting is not enabled or the model address is not specified if the AI module is present in the license; the address is not a URL |

### Mandatory and Optional Services {#обязательные-и-необязательные-сервисы}

The DES, storm-media, and language model services are optional, so by default:

-   if the address or keys are **not specified**, the check receives the status "Not Configured" and does not block anything;
-   if the address is **specified**, the service is checked, and unavailability is considered an error.

There is an exception to this rule: **if a module is included in the license, connection is mandatory**. You have a license for this module, so unfilled settings are considered an error, not "Not Configured":

-   **Simulation Modeling (DES).** Mandatory if the module is issued with a signed key `LICENSE_KEY_V2`. Older keys `LICENSE_KEY` (v1) do not have a module indicator, so DES connection is not required for them.
-   **AI Module.** Mandatory if AI features are included in the active license: `bpmnAiCompletion` must be enabled, and the address, token, and model must be specified.

The storm-media service (voice input) is not designated as a separate module in the license and is checked only when an address is specified.

### Verifying File Storage from the Browser {#проверка-фаилового-хранилища-из-браузера}

The Stormbpmn server can operate with S3 via an internal address `S3_ENDPOINT`, while the user's browser opens files through links that you expose externally. If the external address is unavailable, the server functions correctly, but users cannot open attachments and images.

Therefore, after a successful S3 check, the system places a test image in the uploads bucket, and the administrator page attempts to open it **from the browser** via a temporary link (valid for 10 minutes). If the image does not open, the message "browser cannot open files from storage" is displayed.

What to do: check the variable `S3_EXTERNAL_ENDPOINT` — this is the address used by the browser to open file links. If it is not set, `S3_ENDPOINT` is used. The address must be accessible from user computers (consider HTTPS, host name, and CORS). For details: ["S3 File Storage"](/en/install/production/components.md#s3-хранилище-для-фаилов).

### Language Model Check: Paid Request {#проверка-языковои-модели-платныи-запрос}

The automatic model check only verifies the settings: address, token, and model name. It may display a warning:

-   the address is specified with `/v1` (specify the gateway root; the application appends the API version automatically);
-   the token is not set `bpmnAiCompletionToken` (only a gateway without authorization is suitable).

These cases do not block the configuration: the application removes `/v1` on its own, and a gateway without authorization is an acceptable option.

To ensure that the model actually responds, click **"Check Model (Paid Request)"**. The system will send the model a short request with a short response; **the provider will charge for this**, so it is not executed automatically. The model is assembled using the same settings and the same channel as in the chat, so exactly what will work for users is being tested. The time limit is 20 seconds. The model settings are described in the article ["AI Assistant Configuration"](/en/ai/AI_CHAT.md#шаг-2-где-настраивается-модель).

### Test Email {#тестовое-письмо}

The mail check only connects to the SMTP server. To ensure that emails are delivered, enter an address and click **"Send test email"**. The email is sent immediately, not through a queue, so the reason for an SMTP rejection is visible on the spot. A successful send replaces the mail check result: a delivered email is considered stronger evidence than a mere connection.

## How to fix errors {#как-исправлять-ошибки}

1.  Open the card for the failed check, read the reason and hint, and expand "Details" if necessary.
2.  If the value is set by an environment variable, correct it in `.env` and **restart the Stormbpmn container**: changes in `.env` are applied only after a restart.
3.  After the restart, open the page again. In the configuration wizard, you will return to the "System Check" step: **the wizard will continue from this step**, so there is no need to start over.
4.  If the value is set by an application setting (for example, `baseUrl` or `stormMediaBaseUrl`), click "Open setting" — the admin panel will open with the found setting, and a restart is not required.
5.  Click "Check again".

The "Copy report for support" button generates a text report: version and build, date, address, check results, and configuration completion details. You can send it to support.

## Completing Setup and Failed Checks {#завершение-настроики-и-красные-проверки}

Onboarding cannot be completed while at least one check has a status of "Error." The server makes this decision based on the last saved report (if it is not older than 15 minutes; otherwise, the checks are re-run), not the browser: the result cannot be altered on the page side. Warnings and "Not Configured" do not prevent completion.

In addition to the checks, upon completion, the wizard asks you to specify:

-   the date of the last backup restore check (it cannot be in the future);
-   the name and email or phone number of the responsible administrator;
-   confirmation that you are ready to send HAR files, logs, and the version tag to support when submitting requests.

### Bypassing checks: `?skipChecks=1` {#обход-проверок-skipchecks-1}

If you cannot fix the error right now (for example, the mail server will be connected next week), you can complete the setup by bypassing the checks. To do this, open the wizard at:

```
https://<ваш-адрес>/admin-onboarding?skipChecks=1
```

In this mode, red checks do not block the "Next" button, and a prominent warning appears on the page: "Checks bypassed — this will be recorded." To complete the setup, you must:

1.  Describe the reason: **from 10 to 500 characters**.
2.  Confirm that **requests for modules with failed checks are not covered by SLA** until the checks are fixed.

::: warning Bypass is recorded

The server records in the completion entry: who completed it (email and user identifier), when, the version, the list of failed checks, the reason, and the SLA condition confirmation. The same fact is logged in the application log (warning level) and in [telemetry](#что-уходит-в-телеметрию). The recorded values cannot be modified from the admin panel.

If there are no errors and the wizard is opened with `?skipChecks=1`, bypassing is not required, but the fact of launching in this mode will also be recorded.

:::

### Installations configured before the update {#инсталляции-настроенные-до-обновления}

If onboarding was completed before the introduction of automatic checks, such an installation is considered configured: the completion record is marked as "configuration completed before the introduction of automatic checks" (legacy), and the wizard is not displayed again. You can check the system state at any time on the "System State" tab of the admin panel.

## What is sent to telemetry {#что-уходит-в-телеметрию}

A section `diagnostics` is added to the vendor telemetry (which is sent along with other installation data). It contains two blocks.

**Last check run:**

| Field | Content |
| ---- | ---------- |
| `ranAt` | Start time |
| `ranBy` | Identifier of the user who started the run, as a hash |
| `ranByEmail` | Email of the administrator who started the run |
| `version` | Application version |
| `checks` | For each check: identifier, status, message, duration in milliseconds |

**Onboarding completion record:**

| Field | Content |
| ---- | ---------- |
| `completedAt` | Completion time |
| `completedBy` | Identifier of the user who completed the onboarding, as a hash |
| `completedByEmail` | Email of the administrator who completed the onboarding |
| `bypassed`, `failedChecks` | Whether a bypass occurred and which checks were red |
| `bypassReason`, `slaAcknowledged` | Reason for the bypass and confirmation of the SLA condition |
| `restoreTestedOn` | Date of the last backup restoration check |
| `supportConfirmed` | Confirmation of readiness to send materials to support |
| `responsibleContact` | Contact of the responsible administrator |
| `version` | Application version |
| `legacy` | Configuration was completed before automatic checks appeared |

::: info Emails and contacts are transmitted intentionally

Unlike the rest of the telemetry, where users are anonymized, this section **intentionally includes the administrator's email and the responsible contact**: support needs to know who to contact regarding the installation and who completed the configuration. Configuration values, passwords, tokens, and keys are not included in the telemetry. Logins and passwords in addresses are removed from check messages.

:::

## Parameters (for the container administrator) {#параметры-для-администратора-контеинера}

Check durations and timeouts are defined in `application.properties` and are typically not changed:

| Parameter | Default Value | Purpose |
| -------- | --------------------- | ---------- |
| `storm.diagnostics.probe-timeout` | `10s` | How long to wait for a single check |
| `storm.diagnostics.gotenberg-timeout` | `40s` | Gotenberg check timeout (longer than others: it renders the page) |
| `storm.diagnostics.llm-timeout` | `20s` | Timeout for a live request to the process model |
| `storm.diagnostics.report-max-age` | `15m` | How fresh the report must be to complete setup without a new run |
| `storm.diagnostics.browser-probe-url-ttl` | `10m` | Expiration of the S3 link to the preview image |
| `storm.diagnostics.stale-after` | `7d` | After how long the report is considered stale |

## Related documentation {#связанная-документация}

-   [External services (S3, PlantUML, Gotenberg, mail)](/en/install/production/components.md)
-   [System configuration](/en/configure/README.md)
-   [How licenses work](/en/operation/License.md)
-   [AI assistant configuration](/en/ai/AI_CHAT.md)
-   [Voice input and storm-media](/en/ai/voice-input.md)
-   [Simulation module](/en/simulation/install.md)
