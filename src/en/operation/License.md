---
source_hash: 109719b26fae05e5
---
# How Licenses Work {#как-работают-лицензии}

Stormbpmn supports two types of licenses to manage user access to the system.

::: tip License Types
**Named licenses** - for specific users  
**Concurrent licenses** - for simultaneous work
:::

## License Types {#типы-лицензии}

### Named Licenses {#именные-лицензии}

**Named licenses** allow specific users to access the system at any time.

**How it works:**

-   Number of licenses = number of active accounts
-   The restriction applies to accounts in the **enabled state**
-   User status is displayed in the administrative interface

**Example:** With 30 named licenses, exactly 30 users can have active accounts.

### Concurrent Licenses {#конкурентные-лицензии}

**Concurrent licenses** allow a specified number of users to be connected simultaneously online (within a 1-minute range).

**Operating principle:**

-   Number of licenses = number of concurrent sessions
-   Time quantum for verification: **1 minute**
-   The limit on the number of registered accounts **does not apply**
-   User inclusion verification **is not performed** from a licensing perspective. It is still checked for login capability.

**Example:** With 30 concurrent licenses, 30 users can work in the system simultaneously.

---

## General Licensing Principles {#общие-принципы-лицензирования}

### Additional License {#дополнительная-лицензия}

::: tip Bonus License
**The system automatically provides +1 license to the declared quantity** to ensure uninterrupted operation for administrators.

For example: when purchasing 30 licenses, 31 seats are actually available.
:::

### Who Is Subject to Licensing {#кто-подвергается-лицензированию}

**Only users with accounts in the system are subject to licensing:**

-   **Registered users** - those who have completed the registration process
-   **Imported users** - added through the administrative interface
-   **Users from external systems** - when integrating with LDAP/Active Directory

In other words, any account.

::: warning Exceptions
**Anonymous visitors** (those who do not log in to the system) are not counted when calculating licenses.
:::

---

## Installation Activation {#активация-инсталляции}

::: warning Transition period: v1 and v2 keys are supported
The existing **`LICENSE_KEY`** continues to be temporarily supported: there is no need to change the key in all installations immediately. v1 licenses are deprecated and have a known security limitation, so migrate installations to **`LICENSE_KEY_V2`** gradually. The new v2 key is issued separately for each installation and is not transferred between them.
:::

If a non-empty **`LICENSE_KEY_V2`** is specified, the application uses only it, even if **`LICENSE_KEY`** is stored nearby. An incorrect v2 key does not trigger an automatic fallback to v1: correct or remove `LICENSE_KEY_V2` and restart all application instances.

First, install the version of the application that is consistent with the manager and supports v2. Old images do not use `LICENSE_KEY_V2`; when updating an existing installation, preserve the working `LICENSE_KEY`, and then proceed to v2 activation.

On the first installation, open `/admin-onboarding` without logging in, obtain the code, and activate the license, then create the first administrator in the setup wizard. Until the license is activated, do not open the installation to regular users. An empty or missing v2 selects the legacy path; the absence of both keys does not guarantee access blocking.

On an already running installation with `LICENSE_KEY`, the code is obtained there — without logging in and without launching the wizard; details and the browserless method are in the section
["Where to get the activation code on an existing installation"](#где-взять-код-активации-на-существующеи-инсталляции).

**How to obtain and install the key:**

| Step | Action |
| --- | -------- |
| 1 | Open **`/admin-onboarding`** on the required installation (for example, `https://ваш-домен/admin-onboarding`). The page opens without logging in and on a running installation with a valid `LICENSE_KEY` |
| 2 | Copy the **entire activation code without abbreviation** from the "Your activation code" block. You do not need to click anything else on the page |
| 3 | Pass the full code to the manager and receive `LICENSE_KEY_V2` specifically for this installation |
| 4 | Add `LICENSE_KEY_V2` to the configuration or secret storage; for the duration of the check, you can leave `LICENSE_KEY` nearby for rollback |
| 5 | Restart all application instances and wait for successful health checks |
| 6 | Ensure that the received `LICENSE_KEY_V2` is set in the running instances; on `/admin-onboarding`, check for the absence of errors, expiration date, seats, and AI. After configuring users, check login and required functions, including DES, with a regular account |
| 7 | After successful verification of this installation, remove `LICENSE_KEY` from its working configuration; in the rollback storage, keep it only while rollback to v1 is supported |

**A separate key is required for each installation.** Production, each test environment, disaster recovery (DR) site, clone, and a system migrated to a new environment are licensed separately. Before a mass update, compile their list and request a key for each in advance.

::: tip The activation code has changed
If a different code is displayed on the `/admin-onboarding` screen, request a new `LICENSE_KEY_V2` from the manager and pass him the entire displayed code without abbreviation.
:::

### Where to Get the Activation Code on an Existing Installation {#где-взять-код-активации-на-существующеи-инсталляции}

The activation code is a 64-character string bound to a specific installation. It does not depend on the current `LICENSE_KEY` or image version, so you can retrieve it from a running installation in advance and request a `LICENSE_KEY_V2` before the update window. No system login is required; reading the code does not change anything in the installation.

| Method | Available from version | How |
| --- | --- | --- |
| `/admin-onboarding` page | 6.6.2310 | Open `https://ваш-домен/admin-onboarding`. The code is in the **"Your activation code"** block at the top of the page, with a copy button next to it. The page opens without login and with a valid v1 license |
| API without a browser | 6.6.2229 | `curl -s https://ваш-домен/api/v1/license-signature` — the response is the code. If the API port is published, you can access it directly from the application host: `curl -s http://localhost:8082/api/v1/license-signature`. Convenient for inventorying multiple installations |
| Version older than 6.6.2229 | — | First, update the image while preserving the working `LICENSE_KEY`, then retrieve the code using any of the methods above |

::: warning Do not run anything on `/admin-onboarding`
The **"Start setup"** button opens the initial setup wizard. It is not needed on an already configured installation: the backend will reject the re-creation of the first administrator. To obtain the code, it is sufficient to copy it from the block at the top of the page.
:::

**What to provide to the manager** along with the full code (all 64 characters, without abbreviation):

-   which installation this is — production, test environment, DR site, or clone: each requires its own key;
-   license type, number of seats, and term — as in the current `LICENSE_KEY`, if nothing changes;
-   whether AI (`enableAiFeatures`) and DES (`enableDes`) are needed — in v2, both are disabled by default, even if simulations worked on v1.

In response, you will receive a `LICENSE_KEY_V2` issued specifically for this code. Next — steps 4–7 from the table above.

**When the code changes:**

-   image updates, replacement of `LICENSE_KEY`, new users, and data **do not change** the code;
-   restoring a dump to a new database, migrating to a different environment, cloning the installation, or changing the application configuration may result in a **new code** — a key for the old code will be rejected with the reason `OTHER_INSTALLATION`;
-   the code must match across all instances of a single installation. If it differs, the instance configurations are inconsistent — align them before requesting the key.

Retrieve the code when the database and configuration are final. If the code has changed, request a key reissue — see ["Diagnostics and Recovery"](#диагностика-и-восстановление).

### v2 Format and Module Access {#формат-v2-и-доступ-к-модулям}

V2 is a PS256 JWS signed key bound to the activation code. The backend verifies the signature using the public key; the signing private key remains with the issuing service and is not installed in the application. Legacy v1 is deprecated because the historical mechanism contains the private key in the distributed application.

When requesting a key, specify the duration, type, and number of seats, as well as **AI (`enableAiFeatures`)** and **DES (`enableDes`)**. In v2, both permissions are disabled by default. The backend checks access to simulations: a running DES container alone does not grant access. v1 retains the previous DES behavior, so when migrating, separately verify simulation startup under a regular user. If DES is required, request v2 with `enableDes=true` before switching production.

A manager using the Telegram bot selects **`/license 2`** for v2 and provides the full activation code. For legacy v1, explicitly specify **`/license 1`**: in the updated bot, the standard **`/license`** issues v2 by default. Fields `enableBaseRegister`,
`enableHelpDesk` and `enableCloudMetrics` relate to legacy v1 and are not included in the signed
claims of v2. There is no separate key version indicator on `/admin-onboarding`: verify the selected
mode by the configuration of running instances, and permissions by actual access.

**If an incorrect `LICENSE_KEY_V2` is specified:**

The backend may start in a locked license mode to preserve a recovery path for the owner. The fact of startup and a successful health check do not confirm access for regular
users.

1. Log in as the owner — the account from the administrator team — and open
   `/admin-onboarding`. This mode is not intended for regular users.
2. Copy the full activation code and obtain the key from the manager.
3. Set `LICENSE_KEY_V2` and restart all application instances.
4. Wait for successful health checks, verify the license status and the login of a licensed regular
   user. Data is preserved in this process.

### Switching and Rolling Back a Version {#переключение-и-откат-версии}

Migrate installations one at a time: add `LICENSE_KEY_V2`, restart all instances, verify the license as a regular user, and only then remove `LICENSE_KEY` from the working configuration of that installation. Other installations may continue to run with `LICENSE_KEY` until their migration window.

While a quick configuration rollback is required, it is acceptable to keep both variables: a non-empty `LICENSE_KEY_V2` has exclusive priority, and `LICENSE_KEY` remains a fallback only after removing or clearing `LICENSE_KEY_V2` and restarting. To roll back to a version using v1, keep `LICENSE_KEY`, the compatible database, and the image according to the rollback procedure. After the rollback window is closed and the migration is successful, remove the outdated secret according to the established secret management procedure.

### Diagnostics and Recovery {#диагностика-и-восстановление}

- If an incorrect `LICENSE_KEY_V2` is added while a working `LICENSE_KEY` is present, the application does not automatically revert to v1. Correct v2 or delete or clear it, restart all instances, and recheck the license.
- If the full activation code on `/admin-onboarding` differs from the code for which the current key was issued, provide the new code to your manager and request reissuance of the `LICENSE_KEY_V2`.
- If the status **`SIGNATURE_UNAVAILABLE`** is displayed, do not request reissuance solely because of this status: keep the key unchanged, collect logs, and contact support to restore access to the database identifier. The backend repeats the check on subsequent requests (by default, no more than once every 30 seconds) and removes this lock after a successful check without a restart. Replacing the key alone does not resolve this issue.
- After any recovery, wait for health checks, ensure the license is active, and verify login and the licensed feature under a regular user account, not only under the owner account.

**Key-to-installation binding errors:**

The following messages may be displayed on the `/admin-onboarding` page:

| Message | Cause | Action |
| --- | --- | --- |
| “License key is not set or cannot be read” | `LICENSE_KEY_V2` is missing, empty, or corrupted | Set a valid `LICENSE_KEY_V2` and restart all instances |
| “License key was issued without installation binding” | The key was issued before the binding mechanism was introduced | Obtain a new key from your manager |
| “License key does not match this installation” | The key was issued for a different installation | Provide your manager with the current installation code and obtain a new key |
| “Failed to verify license binding” | Temporary verification error | Click the **“Retry”** button; if the error persists, contact support |

### Backup and DR {#резервное-копирование-и-dr}

Store the used `LICENSE_KEY_V2` and, while a specific installation has not yet been migrated or allows rollback to v1, its `LICENSE_KEY` in a secure secret storage that is part of the DR procedure or is restored separately from the database. Do not assume that a PostgreSQL dump contains these secrets. If the v1 configuration is restored, verify operation with `LICENSE_KEY` and schedule the migration separately. If v2 is used, open `/admin-onboarding` and compare the full activation code with the code for which the saved key was issued. If the code has changed, provide the new code to the manager and obtain a separate `LICENSE_KEY_V2`; if it has not changed, use the saved key. In both cases, complete the verification by logging in as a licensed regular user and performing a licensed function available to them.

The activation code is bound to a specific installation. Restore the application configuration from secure storage along with the database and keep it identical across all instances of the same installation. Restoring a dump to a new database, migrating, or changing the configuration may alter the code: before switching, verify it on `/admin-onboarding` and reissue v2 if necessary. Only the activation code is provided to the manager.

---

## License Management {#управление-лицензиями}

### License Issuance {#выдача-лицензии}

By default, automatic license issuance is **disabled**.

**Standard algorithm for all license types:**

| Step | Action                      | Description                                                          |
| --- | ----------------------------- | ----------------------------------------------------------------- |
| 1   | **User Registration**  | The user logs in or registers for the first time                    |
| 2   | **Activation by Administrator** | The administrator enables the user in the administrative interface |
| 3   | **System Access**          | The user gains the ability to log in to the system               |

::: tip Automatic License Issuance
To simplify the process, the option **"Automatic license issuance to anyone who has logged into the system"** can be enabled in the administrative panel.

In this case, the user gains immediate access to the system after registration.
:::

### "Pending Activation" Accounts {#учетные-записи-«ожидает-активации»}

To make Step 1 work when auto-issuance is disabled, enable the **createPendingEnterpriseUsers** setting ("Create an inactive account if license auto-issuance is disabled", group "Business Logic"). Then, any login or registration attempt (SSO, LDAP, registration form) creates an **inactive** account:

-   The account **does not consume a license** until activated — deactivated users are not included in the license count;
-   The user sees a "contact the administrator" message with each login attempt;
-   In the "User Management" section, such accounts are highlighted with the **"Pending Activation"** status (separately from manually deactivated accounts);
-   The administrator activates the account with a single click — from that moment, it consumes a license. If no free licenses are available, activation will fail with the error "No free licenses";
-   Password recovery and the activation email **do not activate** such an account — only the administrator can.

If the setting is disabled (default), login for an unknown user when auto-issuance is disabled is prohibited, and no account is created.

---

## License Exhaustion {#исчерпание-лицензии}

### Named Licenses {#именные-лицензии-1}

**Situation:** All seats are occupied by users

**Consequences:**

-   Users **will not be able to log in** to the system
-   **The administrator retains access** to the administrative panel

**Solution:**

1. The administrator logs in to the administrative panel
2. Disables unnecessary users, which frees up licenses

### Concurrent Licenses {#конкурентные-лицензии-1}

**Situation:** The limit of simultaneous connections has been reached

**Consequences:**

-   New users **will not be able to log in** for 1 minute
-   **The administrator retains access** to the administrative panel
-   When sessions are terminated by other users, slots are freed automatically

**Solution:**

1. **Waiting** - slots will be freed automatically when users log out
2. **Forced termination** - the administrator can terminate user sessions via the administrative panel

::: warning License Monitoring
Regularly monitor the usage of **named** licenses through the administrative panel to prevent lockouts
:::

---

## License Expiration {#истечение-срока-лицензии}

Upon license expiration:

::: danger Access Lockout
**Login validation blocks users, including administrators.** If a v2 key has already been rejected by the startup check (for example, if the system was started with an expired v2 key), the existing owner from the administrator team retains access for recovery via `/admin-onboarding`. This exception applies to a blocked v2 key and does not guarantee owner access during the normal expiration of a previously accepted key while the application is running.

To restore functionality, the license key must be updated.
:::

---

## License Status Page `/license-active` {#страница-статуса-лицензии-license-active}

The public site's Enterprise installation does not have: any access to an address outside the application (not `/app/...`) automatically redirects the visitor to the **`/license-active`** page. This is the "entry point" of your installation, and its behavior depends on whether the visitor is authenticated:

-   An **authenticated user** sees a greeting with a 3-second countdown and is automatically redirected to their processes. The redirect can be canceled with a button — in which case, the license status page will remain.
-   An **unauthenticated visitor** sees the license status (type, expiration date) and action buttons: login, registration (if the `showRegistraton` setting is enabled), password reset.

::: tip Login Page Design
The company name and logo, brand color, greeting, support links, and login methods are configured in Administration, on the **"Branding and Login Page"** tab. Detailed instructions: ["Branding and Login Page"](/en/configure/branding.md).
:::

::: tip Registration and Terms of Service Consent
Starting from version 6.6.6668, with an active Enterprise license, the terms of service consent checkbox on the registration form is **automatically hidden** — corporate users do not need to accept the public offer. No separate setting is required for this.
:::

### Customizing the License Page {#кастомизация-страницы-лицензии}

Starting from version 6.6.6668, you can add a custom HTML block to the page `/license-active` — for example, a corporate greeting, internal support contacts, or links to regulations.

::: tip There is a more convenient way
You can enter the same text on the **"Branding and Login Page"** tab (the "Login Page Text" block) and immediately see how it looks. See ["Branding and Login Page"](/en/configure/branding.md).
:::

**How to configure via application settings:**

1. Open **Administrative Panel → Application Settings → "Business Logic" group**.
2. Find the setting **"HTML block on the license status page"** (`licensePageHtml`) and
   paste your HTML into the text field.
3. Ensure that the **"Visibility Setting"** toggle is enabled for this setting — the page is visible to
   unauthenticated visitors; without visibility, the HTML will not reach them.

**Behavior:**

-   If HTML is specified — it is displayed **above** the license status, and the status itself collapses
    into an expandable panel.
-   If the setting is empty — the page looks as before: an expanded license status.
-   HTML is sanitized (scripts and dangerous constructs are removed), and images are automatically
    limited by width. Use static markup: headings, text, links, images.

Changes are applied immediately; no restart is required.
