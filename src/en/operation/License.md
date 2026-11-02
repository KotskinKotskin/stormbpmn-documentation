---
source_hash: 62e7fe7651e01c14
---
# How licenses work {#как-работают-лицензии}

StormBPMN supports two types of licenses to manage user access to the system.

::: tip License types
**Named licenses** - for specific users  
**Concurrent licenses** - for simultaneous work
:::

::: info Operation in an air-gapped environment
There is no licensing server: the application verifies the key signature `LICENSE_KEY_V2` locally
using a public key embedded in the image. Neither during activation nor while running does the application require
internet access or communication with the vendor. The activation code from page `/admin-onboarding` can be
entered into the [Enterprise portal](/en/install/portal.md#лицензионныи-ключ) from any computer, and
the resulting key can be manually transferred into the air-gapped environment.
Operation is limited only by the key's expiration date and the number of seats — see
["License exhaustion"](#исчерпание-лицензии) and ["License expiration"](#истечение-срока-лицензии).
:::

## License Types {#типы-лицензии}

### Named Licenses {#именные-лицензии}

**Named licenses** allow specific users to access the system at any time.

**Operating principle:**

-   Number of licenses = number of active accounts
-   The restriction applies to accounts in the **enabled state**
-   User status is displayed in the administrative interface

**Example:** With 30 named licenses, exactly 30 users can have active accounts.

### Concurrent Licenses {#конкурентные-лицензии}

**Concurrent licenses** allow a specified number of users to be connected simultaneously online (within a 1-minute range).

**Operating principle:**

-   Number of licenses = number of simultaneous sessions
-   Time quantum for checking: **1 minute**
-   The limit on the number of registered accounts **does not apply**
-   User inclusion checking **is not performed** from a licensing perspective. It is still checked for login capability.

**Example:** With 30 concurrent licenses, 30 people can work in the system simultaneously.

---

## General Licensing Principles {#общие-принципы-лицензирования}

### Additional License {#дополнительная-лицензия}

::: tip Bonus License
**The system automatically provides +1 license to the declared quantity** to ensure uninterrupted operation for administrators.

For example: when purchasing 30 licenses, 31 seats are actually available.
:::

### Who Is Subject to Licensing {#кто-подвергается-лицензированию}

**Only users with accounts in the system are subject to licensing:**

-   **Registered users** - those who have completed the registration procedure
-   **Imported users** - added via the administrative interface
-   **Users from external systems** - when integrating with LDAP/Active Directory

In other words, any account.

::: warning Exceptions
**Anonymous visitors** (those who do not log in to the system) are not counted when calculating licenses.
:::

---

## Installation Activation {#активация-инсталляции}

::: warning Keys are issued only in the Enterprise portal
Obtain license keys in the portal
[portal.enterprise.stormbpmn.com](https://portal.enterprise.stormbpmn.com), in the
**"License keys"** section. If you are not yet registered in the portal, register — see
["Enterprise Portal: Access to Images and Keys"](/en/install/portal.md). Keys are issued under a valid license agreement or for a trial period; a technical support agreement for keys does not provide them.
:::

::: warning Transition period: v1 and v2 keys are supported
The existing **`LICENSE_KEY`** continues to be temporarily supported: there is no need to immediately change the key in all installations. v1 licenses are deprecated and have a known security limitation, so gradually migrate installations to **`LICENSE_KEY_V2`**. A new v2 key is issued separately for each installation and is not transferred between them.
:::

If a non-empty **`LICENSE_KEY_V2`** is specified, the application uses only it, even when a **`LICENSE_KEY`** is stored nearby. An incorrect v2 key does not trigger an automatic fallback to v1: correct or remove `LICENSE_KEY_V2` and restart all application instances.

First, install the application version with v2 support (the current version is listed in the Changelog section). Older images do not use `LICENSE_KEY_V2`; when updating an existing installation, keep the working `LICENSE_KEY`, and then proceed to v2 activation.

On the first installation, open `/admin-onboarding` without logging in, obtain the code, and activate the license, then create the first administrator in the setup wizard. Until the license is activated, do not open the installation to regular users. An empty or missing v2 selects the legacy path; the absence of both keys does not guarantee access blocking.

On an already running installation with `LICENSE_KEY`, the code is obtained in the same place — without logging in and without running the wizard; details and the method without a browser are in the section
["Where to Get the Activation Code on an Existing Installation"](#где-взять-код-активации-на-существующеи-инсталляции).

**How to obtain and install the key:**

| Step | Action |
| --- | -------- |
| 1 | Open **`/admin-onboarding`** on the required installation (for example, `https://ваш-домен/admin-onboarding`). The page opens without logging in and on a running installation with a valid `LICENSE_KEY` |
| 2 | Copy the **entire activation code without abbreviation** from the "Your Activation Code" block. You do not need to click anything else on the page |
| 3 | In the [Enterprise portal](/en/install/portal.md#лицензионныи-ключ), register the installation (the "Installations" section), paste the full code in the "License keys" section, and obtain `LICENSE_KEY_V2` specifically for this installation |
| 4 | Add `LICENSE_KEY_V2` to the configuration or secret store; for the duration of verification, you can leave `LICENSE_KEY` nearby for rollback |
| 5 | Restart all application instances and wait for successful health checks |
| 6 | Ensure that the obtained `LICENSE_KEY_V2` is set in the running instances; on `/admin-onboarding`, check for the absence of errors, expiration date, seats, and AI. After configuring users, verify login and required functions, including DES, with a regular account |
| 7 | After successful verification of this installation, remove `LICENSE_KEY` from its working configuration; keep it in the rollback store only while rollback to v1 is supported |

**A separate key is required for each installation.** Production, each test environment, a disaster recovery (DR) site, a clone, and a system migrated to a new environment are licensed separately. Before a mass update, compile their list and obtain a key for each in the portal in advance. Under the agreement, one test and one production installation are registered in the portal; if more are needed (DR, clones), contact your manager — after the agreement is amended, keys for them are also issued in the portal.

::: tip The activation code has changed
If a different code is displayed on the `/admin-onboarding` screen, obtain a new `LICENSE_KEY_V2` in the
[Enterprise portal](/en/install/portal.md#лицензионныи-ключ) using the entire displayed code without abbreviation.
:::

### How to obtain the activation code on an existing installation {#где-взять-код-активации-на-существующеи-инсталляции}

The activation code is a 64-character string bound to a specific installation. It does not depend on the current `LICENSE_KEY` or image version, so you can retrieve it from a running installation in advance and obtain `LICENSE_KEY_V2` in the portal before the update window. No system login is required; reading the code does not change anything in the installation.

| Method | Available since version | How |
| --- | --- | --- |
| `/admin-onboarding` page | 6.6.2310 | Open `https://ваш-домен/admin-onboarding`. The code is in the **"Your activation code"** block at the top of the page, with a copy button next to it. The page opens without login and with a valid v1 license |
| API without a browser | 6.6.2229 | `curl -s https://ваш-домен/api/v1/license-signature` — the response is the code. If the API port is published, you can access it directly from the application host: `curl -s http://localhost:8082/api/v1/license-signature`. Convenient for inventorying multiple installations |
| Version older than 6.6.2229 | — | First, update the image while preserving the working `LICENSE_KEY`, then retrieve the code using any of the methods above |

::: warning Do not run anything on `/admin-onboarding`
The **"Start setup"** button opens the initial setup wizard. It is not needed on an already configured installation: the backend will reject the repeated creation of the first administrator. To obtain the code, simply copy it from the block at the top of the page.
:::

**What to specify in the portal** along with the full code (all 64 characters, without abbreviation):

-   which installation this is — test or production: each requires its own key;
-   the installation questionnaire (environment, OS, deployment method, PostgreSQL version, support contact) — the key will not be issued without it.

The license type, number of seats, term, and AI (`enableAiFeatures`) and DES (`enableDes`) modules are taken by the portal from the license agreement. In v2, AI and DES are disabled by default, even if simulations worked in v1: if they are not in the agreement, contact your manager.

The portal will issue `LICENSE_KEY_V2`, issued specifically for this code. Then — steps 4–7 from the table above.

**When the code changes:**

-   image updates, replacement of `LICENSE_KEY`, new users, and data **do not change** the code;
-   restoring a dump to a new database, migrating to a different environment, cloning the installation, or changing the application configuration may result in a **new code** — a key for the old code will be rejected with the reason `OTHER_INSTALLATION`;
-   the code must match across all instances of a single installation. If it differs, the instance configurations are inconsistent — align them before requesting the key.

Retrieve the code when the database and configuration are final. If the code has changed, obtain a new key in the portal — see ["Diagnostics and Recovery"](#диагностика-и-восстановление).

### v2 Format and Module Access {#формат-v2-и-доступ-к-модулям}

V2 is a PS256 JWS signed key bound to the activation code. The backend verifies the signature using the public key; the private signing key remains with the issuing service and is not installed in the application. Legacy v1 is deprecated because the historical mechanism includes the private key in the distributed application.

The expiration date, type, and number of seats, as well as **AI (`enableAiFeatures`)** and **DES (`enableDes`)**, are included in the key from the license agreement. In v2, both permissions are disabled by default. The backend checks access to simulations: a running DES container alone does not grant access. v1 retains the previous DES behavior, so when migrating, separately verify simulation startup under a regular user. If DES is required, ensure it is included in the agreement and obtain a v2 with `enableDes=true` before switching production.

The portal issues only v2 keys. The fields `enableBaseRegister`,
`enableHelpDesk`, and `enableCloudMetrics` relate to legacy v1 and are not included in the signed
claims of v2. There is no separate key version indicator on `/admin-onboarding`: verify the selected
mode via the configuration of running instances, and permissions via actual access.

**If an incorrect `LICENSE_KEY_V2` is specified:**

The backend may start in a locked license mode to preserve a recovery path for the owner. The fact of startup and a successful health check do not confirm access for regular
users.

1. Log in as the owner — an account from the administrator team — and open
   `/admin-onboarding`. This mode is not intended for regular users.
2. Copy the full activation code and obtain the key in the [Enterprise portal](/en/install/portal.md#лицензионныи-ключ).
3. Set `LICENSE_KEY_V2` and restart all application instances.
4. Wait for successful health checks, verify the license status, and log in as a licensed regular
   user. Data is preserved during this process.

### Version Switching and Rollback {#переключение-и-откат-версии}

Migrate installations one by one: add `LICENSE_KEY_V2`, restart all instances, verify the license as a regular user, and only then remove `LICENSE_KEY` from the working configuration of that installation. Other installations may continue to run with `LICENSE_KEY` until their migration window.

While a quick configuration rollback is required, it is acceptable to keep both variables: a non-empty `LICENSE_KEY_V2` has exclusive priority, while `LICENSE_KEY` remains a fallback only after removing or clearing `LICENSE_KEY_V2` and restarting. To roll back to a version using v1, save `LICENSE_KEY`, the compatible database, and the image according to the rollback procedure. After closing the rollback window and completing a successful migration, remove the outdated secret according to the established secret management procedure.

### Diagnostics and Recovery {#диагностика-и-восстановление}

- If an incorrect `LICENSE_KEY_V2` is added while a working `LICENSE_KEY` is present, the application does not automatically revert to v1. Correct v2 or delete or clear it, restart all instances, and recheck the license.
- If the full activation code on `/admin-onboarding` differs from the code for which the current key was issued, obtain a new `LICENSE_KEY_V2` for the new code in the Enterprise portal.
- If the status **`SIGNATURE_UNAVAILABLE`** is displayed, do not request a reissue solely because of this status: keep the key unchanged, collect logs, and contact support to restore access to the database identifier. The backend repeats the check on subsequent requests (by default, no more than once every 30 seconds) and removes this block after a successful check without a restart. Replacing the key alone does not resolve this cause.
- After any recovery, wait for health checks, ensure the license is active, and verify login and the licensed feature under a regular user account, not only under the owner account.

**Key-to-Installation Binding Errors:**

The following messages may be displayed on the `/admin-onboarding` page:

| Message | Cause | Action |
| --- | --- | --- |
| “License key is not set or cannot be read” | `LICENSE_KEY_V2` is missing, empty, or corrupted | Set a valid `LICENSE_KEY_V2` and restart all instances |
| “License key was issued without installation binding” | The key was issued before the binding mechanism was introduced | Obtain a new key in the [Enterprise portal](/en/install/portal.md#лицензионныи-ключ) |
| “License key does not match this installation” | The key was issued for a different installation | Obtain a new key in the Enterprise portal using the current installation code |
| “Failed to verify license binding” | Temporary verification error | Click the **“Retry”** button; if the error persists, contact support |

### Backup and DR {#резервное-копирование-и-dr}

Store the used `LICENSE_KEY_V2` and, while a specific installation has not yet been migrated or allows rollback to v1, its `LICENSE_KEY` in a secure secrets storage that is part of the DR procedure or is restored separately from the database. Do not assume that a PostgreSQL dump contains these secrets. If the v1 configuration is restored, verify operation with `LICENSE_KEY` and schedule the migration separately. If v2 is used, open `/admin-onboarding` and compare the full activation code with the code for which the saved key was issued. If the code has changed, obtain a separate `LICENSE_KEY_V2` for the new code in the Enterprise portal; if it has not changed, use the saved key. In both cases, complete the verification by logging in as a licensed regular user and performing a licensed function available to them.

The activation code is bound to a specific installation. Restore the application configuration from the secure storage together with the database and keep it identical across all instances of the same installation. Restoring a dump to a new database, migrating, or changing the configuration may alter the code: before switching, verify it on `/admin-onboarding` and, if necessary, obtain a new v2 key in the portal.

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

In this case, the user immediately gains access to the system after registration.
:::

### "Pending Activation" Accounts {#учетные-записи-«ожидает-активации»}

To make Step 1 work when auto-issuance is disabled, enable the **createPendingEnterpriseUsers** setting ("Create an inactive account if license auto-issuance is disabled", group "Business Logic"). Then, any login or registration attempt (SSO, LDAP, registration form) creates an **inactive** account:

-   the account **does not consume a license** until activated — deactivated users are not included in the license count;
-   the user sees the message "contact the administrator" on every login attempt;
-   in the "User Management" section, such accounts are highlighted with the **"Pending Activation"** status (separate from manually deactivated accounts);
-   the administrator activates the account with a single click — from that moment, it consumes a license. If no free licenses are available, activation will fail with the error "No free licenses";
-   password recovery and the activation email **do not activate** such an account — only the administrator can.

If the setting is disabled (default), login for an unknown user when auto-issuance is disabled is prohibited, and the account is not created.

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
-   When sessions are terminated by other users, slots are released automatically

**Solution:**

1. **Waiting** - slots will be released automatically when users log out
2. **Forced termination** - the administrator can terminate user sessions via the administrative panel

::: warning License Monitoring
Regularly monitor the usage of **named** licenses through the administrative panel to prevent lockouts
:::

---

## License Expiration {#истечение-срока-лицензии}

Upon license expiration:

::: danger Access Lockout
**Login validation blocks users, including administrators.** If a v2 key has already been rejected by the startup check (for example, if the application was started with an expired v2 key), the existing owner from the administrator team retains access for recovery via `/admin-onboarding`. This exception applies to a locked v2 key and does not guarantee owner access in the case of a standard expiration of a previously accepted key during application runtime.

To restore functionality, the license key must be updated.
:::

---

## License Status Page `/license-active` {#страница-статуса-лицензии-license-active}

The public site's Enterprise installation does not have: any access to an address outside the application (not `/app/...`)
automatically redirects the visitor to the **`/license-active`** page. This is the "entry point" of your
installation, and its behavior depends on whether the visitor is authorized:

-   **Authorized user** sees a greeting with a 3-second countdown and is automatically
    redirected to their processes. The redirect can be canceled with a button — in which case, the
    license status page will remain.
-   **Unauthorized visitor** sees the license status (type, expiration date) and action buttons:
    login, registration (if the `showRegistraton` setting is enabled), password reset.

::: tip Login Page Design
The company name and logo, brand color, greeting, support links, and login methods are configured in Administration, on the **"Branding and Login Page"** tab. Detailed instructions: ["Branding and Login Page"](/en/configure/branding.md).
:::

::: tip Registration and Terms Agreement
Starting from version 6.6.6668, with an active Enterprise license, the terms of use agreement checkbox
on the registration form is **automatically hidden** — corporate users do not need to accept the public offer. No separate setting is required for this.
:::

### Customizing the License Page {#кастомизация-страницы-лицензии}

Starting from version 6.6.6668, you can add a custom HTML block to the page `/license-active` — for example, a corporate greeting, internal support contacts, or links to regulations.

::: tip There is a more convenient way
You can enter the same text on the **"Branding and Login Page"** tab (the "Login Page Text" block) and immediately see how it looks. See ["Branding and Login Page"](/en/configure/branding.md).
:::

**How to configure via application settings:**

1. Open **Admin Panel → Application Settings → "Business Logic" group**.
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
