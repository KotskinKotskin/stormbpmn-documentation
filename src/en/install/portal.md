---
title: 'Enterprise Portal: Access to images and keys'
order: 0
source_hash: 86a5e9dc1e93735b
---

[[toc]]

# Enterprise Portal: Access to Images and Keys {#портал-enterprise-доступ-к-образам-и-ключи}

Everything required to install Stormbpmn Enterprise is provided exclusively through the portal
**[portal.enterprise.stormbpmn.com](https://portal.enterprise.stormbpmn.com)**: access to images
in a private registry, license keys for each installation, and the trial period. We do not provide access or keys via email, messengers, or through a manager.

::: warning You cannot install Stormbpmn without registering on the portal
Register on the portal before starting the installation. Without this, you will not have either registry login credentials or a license key.
:::

## Registration {#регистрация}

1. Open [portal.enterprise.stormbpmn.com](https://portal.enterprise.stormbpmn.com) and click
   **"Sign up"**.
2. Provide your work email, country, and the organization's tax number (for Russia — INN) — the same one
   as in the contract with Stormbpmn.
3. If a license contract has already been signed, specify its number: it is listed on the first page of the contract.
4. Follow the link in the email. The link is valid for 30 minutes. There is no password in the portal: a new link is sent to your email with each
   login.

What happens next depends on the contract:

| Situation | What happens |
| --- | --- |
| A valid license contract number is specified | Access is granted immediately |
| The contract number is not specified or does not match | A manager will review the request within one business day and email you |
| No contract yet | The portal will process a request for a trial period: 30 days, 10 users, all modules. After approval, installation steps will appear in the portal |

Add colleagues from your organization in the **"Colleagues"** section: each employee who
installs or maintains Stormbpmn needs their own login.

::: tip Keys are provided only by a license contract
A technical support contract does not include keys or image access. You need a valid license
contract or an approved trial period is required.
:::

## Image access {#доступ-к-образам}

Stormbpmn images are located in the private registry **`registry.stormbpmn.com`**, project
`stormbpmn-enterprise`. In the portal section **"Image access"**, issue a company robot account.
It is read-only.

1. Click **"Get access"**. The portal will display the login and secret.
2. Save the secret immediately, for example, using the **"Download JSON"** button: we do not store it and will not display it again. If the secret is lost, issue a new one in the same section. The previous secret will stop working.
3. Log in to the registry on the installation server:

   ```bash
   docker login registry.stormbpmn.com -u '<portal login>'
   ```

   The robot account login contains the character `$`, so enclose it in single quotes.

Use this login to download all images mentioned in the documentation:

| Image | Purpose |
| --- | --- |
| `registry.stormbpmn.com/stormbpmn-enterprise/stormbpmn_fullstack_enterprise` | Application |
| `registry.stormbpmn.com/stormbpmn-enterprise/storm-des` | [Simulations (DES)](/en/simulation/install.md) |
| `registry.stormbpmn.com/stormbpmn-enterprise/storm-media` | [Voice Input](/en/ai/voice-input.md) |
| `registry.stormbpmn.com/stormbpmn-enterprise/pgvector:pg17` | PostgreSQL mirror with pgvector |
| `registry.stormbpmn.com/stormbpmn-enterprise/gotenberg:8` | Gotenberg mirror for PDF export |

Server without internet: download the images on a machine with access to the registry and transfer them to the internal registry — see ["Manual Installation"](/en/install/quickstart/QUICKSTART_MANUAL.md) and
["Kubernetes → Closed Environment"](./kubernetes.md#закрытыи-контур).

During the trial period, the robot account is valid until the end of the period. If the period is extended, issue a new secret: the previous one works only until the old expiration date.

## Installations {#инсталляции}

A key is issued for an installation registered in the portal. In the **Installations** section, register a test and a production installation and complete the questionnaire: environment, OS, deployment method, PostgreSQL version, and the contact person to notify if something happens to the installation. We will not issue a key without the questionnaire.

Per the license agreement, one test and one production installation are registered.

## License key {#лицензионныи-ключ}

The key `LICENSE_KEY_V2` is bound to the activation code of a specific installation. Its composition (license type, seats, AI and DES modules, term) is taken from the contract. To change the composition, contact your manager: after the contract is amended, a new key is issued in the portal.

### First key {#первыи-ключ}

1. Install Stormbpmn and open `https://<ваш домен>/admin-onboarding`. No login is required.
2. Copy the **entire activation code** from the "Your activation code" block, without truncation.
3. In the portal, open **"License keys"**, select the installation, paste the code, and click
   **"Get the key"**.
4. Set the key in the environment variable `LICENSE_KEY_V2` and restart the container. For details, see
   the section ["How licenses work"](/en/operation/License.md).

### Renewing the key {#продление-ключа}

The key is issued for no more than three months and not beyond the contract expiration date. To renew it:

1. Update Stormbpmn to a version no older than three months. New keys are issued only for recent versions: before issuance, the portal verifies that the company has downloaded this version.
2. In Stormbpmn, as an administrator, open "Administration" → "License" → "User Activity", click the arrow next to "Download XLSX", and select **"Download Telemetry (JSON)"**. The file is valid for 7 days.
3. In the portal, upload the file to the installation card and click **"Renew the key"**.

The previous key remains valid until its expiration date.

### Lost key {#потеряли-ключ}

In the installation card, click **"Lost the issued key? Get it again"** and paste the activation code for this installation. The portal will issue the same key with an expiration date no later than the originally issued one.

## If something goes wrong {#если-что-то-не-получается}

- The portal displays "No active contract" — the license contract has expired or has not yet been concluded.
  Contact your manager: the contact details are shown in the portal.
- You need an additional installation beyond the contract (DR site, clone) or a different key configuration —
  contact your manager. Once the contract is updated, the key is issued in the portal.
- Error in the portal itself — write to **help@stormbpmn.com**.
