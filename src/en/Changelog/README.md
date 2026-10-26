---
dir:
  order: 10
  link: true
  text: 10. Latest Version and Change History
  collapsible: true
order: 10
source_hash: e727e52d5b28e03b
---

# Changelog {#changelog}

This section (left menu) automatically publishes links to new builds of the enterprise version. Consider the version with the most recent date as the current one. If there are several, choose the one with the higher index.

You can update across multiple versions at once unless otherwise specified. Below on the page is the [release feed](#лента-релизов) with all versions; read the upgrade warnings first.


::: danger ⚠️ From version 6.6.XXXX, a v1/v2 licensing transition mode is available
`6.6.XXXX` — blocking release placeholder: it must be replaced with the actual version number before publishing the release. Until the number is confirmed, do not insert a guessed version.

Starting from version **6.6.XXXX**, the existing **`LICENSE_KEY`** continues to work temporarily:
there is no need to immediately change the configuration or reissue keys for all installations.
v1 licenses are deprecated and have a known security limitation, so plan to migrate
each installation to a separate **`LICENSE_KEY_V2`**.

If a non-empty `LICENSE_KEY_V2` is set, only it is used. An incorrect v2 does not trigger
an automatic fallback to `LICENSE_KEY`.

**Migrate installations gradually:**

1. Compile a list of all installations: production, test environments, disaster recovery (DR) sites,
   and clones.
2. On each running installation, open **`/admin-onboarding`** (for example,
   `https://ваш-домен/admin-onboarding`) and copy the **entire activation code without truncation**.
   Login is not required, and the configuration wizard does not need to be run. The code is independent of the image version
   (the page has been available since 6.6.2310, the endpoint `GET /api/v1/license-signature` — since 6.6.2229), so it
   can be retrieved before the update — see
   ["Where to get the activation code on an existing installation"](/en/operation/License.md#где-взять-код-активации-на-существующеи-инсталляции).
3. Provide the full code to the manager and receive a separate `LICENSE_KEY_V2` for this installation.
   Then update the installation to a version with v2 support, keeping the working `LICENSE_KEY`.
4. Add `LICENSE_KEY_V2`, without removing `LICENSE_KEY` until verification and the end of the agreed
   rollback window.
5. Restart all instances, ensure that the received `LICENSE_KEY_V2` is set in them,
   wait for health checks, and check the license status on `/admin-onboarding`.
   Then verify regular user access and the required AI/DES modules: in v2, both permissions
   are disabled by default and must be agreed upon when issuing the key.
6. After successful verification and the end of the rollback window, remove `LICENSE_KEY` from the working configuration of this installation.
   Other installations may temporarily continue operating with v1 until their migration window.

One key cannot be transferred between installations. A separate key is required for production,
each test environment, DR site, and each clone.

**If an incorrect `LICENSE_KEY_V2` is set:** the presence of a working `LICENSE_KEY` does not enable fallback.
Correct the v2 or remove or clear it to return to v1, then restart all application instances.
The backend may operate in a license-locked mode so that the owner —
an account from the administrative team — can open `/admin-onboarding` and perform
recovery. Data is not lost in this case; a successful health check alone does not confirm
licensed access for regular users.

For details, see the ["Installation Activation"](/en/operation/License.md#активация-инсталляции) section.
:::

::: danger ⚠️ From version 6.6.5952, the PostgreSQL `pgvector` extension is required
Starting from version [6.6.5952](./6.6.5952.md) (dated 09.06.2026), the **pgvector** extension is a **mandatory platform requirement**: it powers the **fast universal (semantic) search** across your data — this is required for **all installations, regardless of the presence of the AI module**. The AI chat knowledge base is just one consumer of this engine, not the reason for the requirement.

Without the extension, the database migration will not complete, and the backend **will not start** (there is no graceful degradation). Versions **up to and including `6.6.5694`** did not require the extension — when updating from them, prepare PostgreSQL **before** changing the application version:

1. Switch PostgreSQL to a build with pgvector — for example, the **`pgvector/pgvector:pgXX`** image for your PostgreSQL major version (`pg15`/`pg16`/`pg17`); for enterprise, an internal mirror `cr.selcloud.ru/stormbpmn-enterprise/pgvector:pg17` is available. Alternatively, install the extension package in the current DBMS (for example, `postgresql-17-pgvector`) and restart it. For managed databases (DBaaS), ensure that the provider offers `pgvector`.
2. Pre-create the extensions in the **application database** (as a superuser or a role with the `CREATE EXTENSION` privilege):

```sql
CREATE EXTENSION IF NOT EXISTS vector;     -- pgvector, обязательно с 6.6.5952
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- автодополнение пользователей (приложение не создаёт его само)
```

Details and the update order are in the [6.6.5952 version description](./6.6.5952.md). The full list of extensions, database encoding, and image recommendations are in the ["PostgreSQL Requirements"](/en/install/README.md) section. About the knowledge base itself — ["AI Chat Knowledge Base"](/en/ai/KnowledgeBase.md).
:::

::: warning
From version >6.6.1861, the Oauth2 integration has been significantly changed. Do not forget to take a backup and be ready to install the previous version.
:::

::: warning Migration to Spring Boot 3 (version 6.6.3748+)
From version 6.6.3748, the transition to Spring Boot 3 and Java 21 has been completed. Before updating, check:
- **PATH**: Must point to `/opt/java/openjdk/bin` instead of `/usr/local/openjdk-11/bin`
- **JWTSECRET**: Minimum 64 characters (HS512 key, 512 bits) — with a short key, login will fail with `WeakKeyException`

For details, see [Version 6.6.3748](./6.6.3748.md#%E2%9A%A0%EF%B8%8F-%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-enterprise-%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%BE%D0%B2)
:::

::: warning Migration to AWS SDK v2 (version 6.6.4154+)
In version 6.6.4154, the internal client for working with file storage was replaced from MinioClient SDK to AWS SDK v2 S3Client.

For details, see [Version 6.6.4154](./6.6.4154.md)
:::

::: warning Limit on the size of the administrative team (version 6.6.4630+)
From version 6.6.4630, a limit on the number of accounts in the administrative team has been introduced (flag `full_access` in the DB).

**Why:** all members of such a team had all privileges in the system regardless of permission settings. To avoid errors, we:
- allowed having a **maximum of 2 accounts** in the administrative team;
- prohibited adding new members to it.

**What to do if the administrative team already has more than 2 members:**
1. Create a new team via the admin panel.
2. Add a new account to it or move the administrator account there.
3. In the DB, remove the flag `full_access` from the **current** administrative team.
4. In the DB, set the flag `full_access` on the **new** team.

This may require an additional license, but we always issue +1 seat specifically for these purposes.
:::

## Release Notes {#лента-релизов}

Newest versions at the top. Each entry expands to show a breakdown of changes from the release description; the full text, including upgrade schemas and commands, is available via the link in the entry.

<ChangelogTimeline />

## Policy for Handling Known Vulnerabilities {#политика-по-работе-с-известными-уязвимостями}

We assign high priority to resolving known vulnerabilities and, given the technical capability, address such unknowns first.
