---
source_hash: 62255d9b63f9af9c
---
# Data Migration from Cloud (cloud → on-prem) {#перенос-данных-из-облака-cloud-→-on-prem}

> 📦 **Migrating from the StormBPMN cloud to your own (on-prem) installation?** Here is the complete
> procedure for migrating your team: what to prepare, which permissions to grant, and how to upload
> the data archive.

[[toc]]

::: warning When to perform the migration
The migration is initiated within a narrow window: **after** the initial deployment via
[Quick Start](/en/install/quickstart/), but **before** completing onboarding — that is,
**before creating the first administrator, team, and users**.

The reason is that the import works only on an empty database (see [key principles](#главные-принципы)
below). Once you create your first user or team, the database will no longer be empty, and
the import will require recreating the schema and clearing the data.
:::

The migration works as follows: **we** export your team from the cloud into a
self-contained archive bundle (a file with the `.storm` extension) on our side, and **you** upload it to a fresh
on-prem installation via the application's REST API. The service will automatically parse the archive, distribute rows
across tables, and upload files (avatars, diagram previews, attachments) to your S3 object storage.

::: tip Who is involved
The migration typically involves several roles on your side:

-   **Server Administrator** — performs the steps on the server.
-   **DBA / Database Administrator** — grants temporary permission for a single privilege (see below).

On the Storm side, your manager oversees the migration: we prepare and transfer the bundle file
to you and provide real-time communication support.
:::

---

## Key Principles {#главные-принципы}

-   **Migration is a snapshot at the time of export.** Once the `.storm` bundle is downloaded from the cloud, any subsequent changes in the cloud **will not migrate** to the on-prem environment — there is no continuous synchronization between the cloud and on-prem. Therefore, coordinate the migration window in advance: during the migration, team work in the cloud is paused, the import completion is awaited, and work resumes in the on-prem environment.

-   **Import only into an empty database.** The import is designed for a fresh database (immediately after the initial Liquibase initialization). If the database already contains users, the import will stop with an error. On a fresh installation, the database is empty by default; however, if the service has already been used, back up all necessary data and settings before resetting the database.

-   **Temporary permission for one database privilege is required.** During the upload, the application disables foreign key checks (`session_replication_role = replica`) within its own session, then re-enables them and verifies data integrity after loading. For this, the user with which Storm connects to the database requires the `SUPERUSER` role **or** a specific grant of `SET ON PARAMETER` (PostgreSQL 14+). This permission can be granted for the duration of the migration and revoked immediately afterward — it does not affect anything other than the import session.

-   **Migration is a one-pass operation.** The import runs in a single transaction: it either completes entirely or rolls back, leaving the database in a clean state. Do not run the import again over already imported data — recreate the schema first.

---

## Readiness Checklist {#чек-лист-готовности}

Go through the list **before** we start the export from the cloud. The application will automatically re-verify most of the items during import, but it is better to address them in advance — this saves time within the granted access window.

### Access and Infrastructure {#доступы-и-инфраструктура}

-   [ ] Access to the server where the stack is deployed is available.
-   [ ] The application is connected to S3 (the `S3_ENDPOINT` variable is set).
-   [ ] The S3 account has permissions to create buckets **or** the required buckets have already been created manually (we will provide the names — they must match the archive).

### Time Zone {#часовои-пояс}

-   [ ] The application's time zone matches yours (for example, `Europe/Moscow`).
        Check `TZ` and/or `-Duser.timezone` in the `JAVA_OPTS` container.

::: tip Why this matters
Some dates in the data are stored without a time zone. We recalculate them to your time zone **on export**, so inform your manager of your time zone in advance and keep the same value in the application and in Postgres.
:::

### Database Permissions {#права-базы-данных}

-   [ ] The database account used by the application (`JDBC_URL` / `USERNAME` /
        `PASSWORD`) has been verified, and a window for granting permissions has been coordinated with the DBA / security team.

Connect to the database using the application account and run:

```sql
SELECT
  current_user AS me,
  rolsuper AS i_am_super,
  has_parameter_privilege(current_user, 'session_replication_role', 'SET') AS can_set,
  current_setting('server_version') AS pg_version
FROM pg_roles
WHERE rolname = current_user;
```

The import will succeed if **at least one** of the columns `i_am_super` or `can_set` is equal to `t` (true).

### Data Backup (Optional) {#бэкап-данных-опционально}

-   [ ] All necessary data and settings have been saved — **only if this is not the initial installation** and the service has already been used.

---

## Migration Procedure {#процедура-переноса}

### Step 1. Grant the database privilege {#шаг-1-выдать-право-на-привилегию-бд}

If both checks above `i_am_super` and `can_set` are `f` (false), ask the DBA (under the superuser or provider admin role — `rds_superuser`, `cloudsqlsuperuser`, etc.) to execute:

```sql
GRANT SET ON PARAMETER session_replication_role TO <db_user>;
```

where `<db_user>` is the account from `current_user` in the check. After this, repeat the verification `SELECT` and ensure that `can_set` has become `t`.

::: tip The privilege can be granted at the last minute
If the security team is not ready to keep the grant for a long time — agree on a narrow window. The migration is fast (usually a few minutes), the grant is only needed during the import itself and is revoked immediately after.
:::

### Step 2. Reset the database — only if the service has already been used {#шаг-2-сбросить-базу-—-только-если-сервис-уже-использовался}

::: tip Skip this step for a fresh installation
After the Quick Start, the database is already empty — proceed directly to Step 3. A reset is required
**only if** the on-prem service has already been used and the database contains users/data (import
works only on an empty database).
:::

To return the database to an empty state:

1.  Stop the container `stormbpmn`.
2.  Reset the schema using the application account:

    ```sql
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    ```

### Step 3. Update the image, enable the import profile, and deploy {#шаг-3-обновить-образ-включить-импорт-профиль-и-развернуть}

Update the image version to the latest one (see [Changelog](/en/Changelog/)) and set/verify the environment variables.

| Variable | Value |
|---|---|
| `S3_BUCKET_UPLOADS` | storm-prod-uploads |
| `S3_BUCKET_USERS` | storm-prod-users |
| `S3_BUCKET_IMPORTS` | storm-prod-imports |
| `S3_SINGLE_USERS_BUCKET` | `true` |
| `SPRING_PROFILES_ACTIVE` | `prod,handover-import` |

::: warning Bucket names must match the archive
The archive transfers files while preserving the original bucket names. If the names in `S3_BUCKET_*` do not match those hardcoded in the bundle, the import will stop and indicate the expected name. Use exactly the values we provide.
:::

Apply the changes and wait for the string `Started BackendApplicationKt in … seconds` in the logs.

### Step 4. Wait for the file and grant, verify availability {#шаг-4-дождаться-фаила-и-гранта-проверить-доступность}

1.  Wait for the bundle file (`*.storm`) from the Storm manager.
2.  Ensure that the privilege grant has been issued (repeat `SELECT`, `can_set = t`).
3.  Log in to the server via SSH and verify that the service responds locally:

    ```bash
    curl http://localhost:8080/api/health/liveness
    # ожидаемый ответ: {"status":"UP"}
    ```

::: tip Without the grant, the handler will reject the request
Import begins with a permissions check. If the grant has not yet been issued, the application will return an error without loading the data. Therefore, wait for confirmation from the DBA before sending the file.
:::

### Step 5. Upload the archive {#шаг-5-загрузить-архив}

Copy the received `.storm` file to the server (for example, via `scp`):

```bash
scp Команда-20260429-101020.storm <user>@<STORM_HOST>:/tmp/
```

Then, **from the server itself**, send the file to the locally started service.

```bash
curl -# -X POST \
  -F "bundle=@/tmp/Команда-20260429-101020.storm" \
  http://localhost:8080/api/v1/handover/import
```

After the file is uploaded, the service takes a few more minutes to unpack the data
and write files to S3 — you can monitor this in the container logs.

A successful response is `200 OK` with a JSON summary: how many rows were loaded for each table, how
many files were uploaded to S3, and how long the import took. Save the `sourceTeamId` from the response — it
will be needed in Step 8.

```json
{
    "ok": true,
    "errors": [],
    "sourceTeamId": "7d8fc07d-ced8-4615-9d33-a83364e42ae5",
    "sourceTeamName": "Команда ...",
    "blobsDeclared": 282,
    "blobsUploaded": 282,
    "blobsFailed": 0,
    "userSetSize": 20,
    "durationMs": 34294
}
```

If the response comes with `"ok": false` or with an HTTP status of `422` — see
the [errors section](#устранение-неполадок) below: in the `errors` field, the application provides detailed information
about what is wrong and how to fix it.

### Step 6. Complete onboarding and verify data {#шаг-6-проити-онбординг-и-проверить-данные}

Open Storm in your browser at your installation address. Complete the onboarding following the standard scenario, during which you will create a team and a server administrator account.

Using this account, open the **Administration** section and verify the following:

-   [ ] **User Management** — the number of users and active accounts matches the expected value (former cloud team members are transferred as disabled and do not occupy license seats).
-   [ ] Ask a colleague to log in to Storm using their usual cloud login and password, and verify that all data is present: **diagrams, roles, architecture elements, org structure**, etc.
-   [ ] Verify S3 functionality: for users migrated from the cloud, their **avatar** is displayed, **diagram previews** appear on hover, and **file downloads** work in **Application Settings → Document Templates**.

### Step 7. Complete the migration (revert temporary settings) {#шаг-7-завершить-перенос-откат-временных-настроек}

After colleagues confirm that the data is in place:

1.  Ask the DBA to **revoke the grant** on the privilege, if it was necessary to issue it.
2.  Remove `handover-import` from `SPRING_PROFILES_ACTIVE` (leave only `prod`) and restart the container.

### Step 8. Post-configuration {#шаг-8-пост-настроика}

Under the administrator account in **Administration → Application Settings**:

-   [ ] **General Settings** — specify the system `baseUrl` (your DNS).
-   [ ] **Business Logic → Onboarding and Teams** — set `autoJoinTeamId` to the UUID of the migrated team (this is the `sourceTeamId` from the response in Step 5; it is also visible in **Team Management**).
-   [ ] *(Optional)* If you saved the previous service settings during the preparation stage — restore them in the corresponding sections of the administration panel.

::: info Data has been migrated
Next, bring the installation to a production state following the
[Production installation](/en/install/production/) instructions — SSL/HTTPS, SSO, monitoring, backup
and other infrastructure.
:::

---

## Troubleshooting {#устранение-неполадок}

::: details Error regarding permissions for session_replication_role
The grant is missing or has been issued to the wrong account. Repeat the verification `SELECT` using the application account and ensure that `i_am_super = t` **or** `can_set = t`. On managed Postgres, the grant is issued by the provider's admin role.
:::

::: details "N users already exist in the on-prem environment"
The database is not empty — import works only on a fresh schema. Perform `DROP SCHEMA public CASCADE;
CREATE SCHEMA public;`, restart the container (Liquibase will reapply the schema), and retry the import.
:::

::: details Error regarding S3 bucket names
The names in `S3_BUCKET_UPLOADS` / `S3_BUCKET_USERS` / `S3_BUCKET_IMPORTS` do not match those hardcoded in the archive. The error message specifies the expected name — set it in the corresponding variable and restart the import.
:::

::: details ok=false and a list of "orphan-FK relations"
After loading, the application detected integrity violations and **rolled back** the entire import — the database remained clean. This indicates that the archive contained inconsistent data or that the cloud and on-prem schemas diverged. Send the service response with the error list to the Storm manager — we will resolve it on our side.
:::
