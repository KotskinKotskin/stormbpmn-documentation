---
dir:
  order: 6
  link: true
  text: 6. Maintenance
  collapsible: true
source_hash: 77afb07f341ffd62
---

[[toc]]

# System Administration {#администрирование-системы}

> 🔧 **Is the system already running and needs maintenance?** Monitoring, backups, version updates, and recovery from failures — all covered here.

A guide to monitoring, backup, updating, and troubleshooting StormBPMN Enterprise.

::: tip Core administrator tasks

-   **Monitoring** - tracking system status and performance
-   **Backup** - regular data preservation
-   **Updates** - installing new versions and patches
-   **Troubleshooting** - diagnosing and resolving issues

:::

## System Monitoring {#мониторинг-системы}

### Prometheus Metrics {#метрики-prometheus}

Stormbpmn provides an HTTP endpoint with metrics in Micrometer format for monitoring via Prometheus.

**Prometheus Configuration:**

```yaml
- job_name: "stormbpmn-node-1"
  metrics_path: "/actuator/prometheus"
  scrape_interval: 15s
  static_configs:
      - targets: ["10.1.0.3:8080"]
```

::: tip Ready-made Grafana dashboard
Use the [Spring Boot Statistics Dashboard](https://grafana.com/grafana/dashboards/12835-spring-boot-statistics-6756-tomcat/) to visualize metrics.
:::

### Alert Configuration {#настроика-алертов}

Recommended thresholds for alert triggers:

| Metric                    | Trigger Condition    | Description                    |
| -------------------------- | ----------------------- | --------------------------- |
| **CPU Usage**              | > 90% for 5 minutes | High processor load |
| **Request Count /api/v1/** | > 100 requests per minute | Abnormally high load  |
| **HEAP Memory Used**       | > 90% for 5 minutes | JVM memory shortage         |
| **No Data**                | > 5 minutes without data    | Service unavailability       |

::: warning When alerts trigger
Proceed to the [Disaster Recovery](#при-базовои-эксплуатации) section
:::

### Health Checks {#health-checks}

StormBPMN provides endpoints for checking the status:

```yaml
livenessProbe:
    httpGet:
        path: /api/health/liveness
        port: 8080
    initialDelaySeconds: 30
    periodSeconds: 5

readinessProbe:
    httpGet:
        path: /api/health/readiness
        port: 8080
    initialDelaySeconds: 30
    periodSeconds: 5
```

---

## Backup {#резервное-копирование}

### What to copy {#что-необходимо-копировать}

Diagrams, descriptions, and users are stored in PostgreSQL. License secrets
`LICENSE_KEY_V2` and the temporarily used or saved for rollback `LICENSE_KEY` are located
outside the database: include their secure storage in the DR procedure or provide a separate
secret recovery.

::: tip Database, files, and secrets
PostgreSQL contains the core data. S3 files (images, documents) are also recommended
to be included in the backup strategy, and external secrets, including current license keys,
must be stored in a secure storage.
:::

### Creating a Backup {#создание-резервнои-копии}

**Example command for PostgreSQL:**

```bash
pg_dump -h localhost -d storm_db -U storm_user -W -Ft -b > /backup/storm_$(date +%Y%m%d_%H%M%S).tar
```

**Recommended automation script:**

```bash
#!/bin/bash
BACKUP_DIR="/backup/stormbpmn"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/storm_backup_$DATE.tar"

# Создание резервной копии
pg_dump -h $DB_HOST -d $DB_NAME -U $DB_USER -W -Ft -b > $BACKUP_FILE

# Проверка успешности
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
    # Отправка уведомления об успехе
else
    echo "Backup failed!"
    # Отправка алерта администратору
fi

# Очистка старых копий (старше 30 дней)
find $BACKUP_DIR -name "storm_backup_*.tar" -mtime +30 -delete
```

### Backup Requirements {#требования-к-резервному-копированию}

-   [ ] **Daily schedule** - automatic creation of copies
-   [ ] **Space monitoring** - monitoring of free space
-   [ ] **Notifications** - informing about the status of the backup
-   [ ] **Testing** - regular verification of restoration
-   [ ] **Remote storage** - copies in a different data center

---

## Restoring from a backup {#восстановление-из-резервнои-копии}

### Restoring PostgreSQL {#восстановление-postgresql}

```bash
# Остановка приложения
docker stop stormbpmn

# Восстановление базы данных
pg_restore --format=t -c -N -O -h localhost -p 5432 -U storm_user -d storm_db /backup/storm_backup_20231201_120000.tar

# Запуск приложения
docker start stormbpmn
```

### Recovery Verification {#проверка-восстановления}

1. **Verify the connection** to the database
2. **Ensure that** health checks are running
3. **Restore the license secrets** from the secure storage: `LICENSE_KEY_V2` and, while the installation uses v1 or allows rollback to it, `LICENSE_KEY`
4. **Verify the selected license mode**: for v1, confirm operation with the restored `LICENSE_KEY`; for v2, compare the full activation code on `/admin-onboarding` with the code for which the key was issued, and if it has changed, obtain a reissued key for this installation
5. **Check the license as a regular user**: log in and open a licensed feature
6. **Test the core functions** (for example, creating a diagram)
7. **Check the logs** for errors

---

## Version Update {#обновление-версии}

### Update Procedure {#процедура-обновления}

| Step | Action                                      | Description                                     |
|-----|-----------------------------------------------|----------------------------------------------|
| 0   | **Back up the database**                 |                                              |
| 1   | **Verify that the database backup can be restored** |                                              |
| 2   | **Determine the current version**                 | `docker images \| grep stormbpmn`            |
| 3   | **Review the changelog**                         | [Change Log](/en/Changelog/README.md)     |
| 4   | **Select the target version**                    | Check compatibility                      |
| 4.1 | **Inventory all installations**        | Production, test environments, DR, and clones. On each, remove the activation code from `/admin-onboarding` and request `LICENSE_KEY_V2` in advance — see [where to get the code](/en/operation/License.md#где-взять-код-активации-на-существующеи-инсталляции) |
| 4.2 | **Plan the license migration**           | The existing `LICENSE_KEY` works temporarily; v2 can be rolled out per installation |
| 5   | **Create a backup**                   | Mandatory before any update          |
| 6   | **Save the current image**                   | `docker save stormbpmn:current > backup.tar` |
| 7   | **Download the new version**                      | `docker pull stormbpmn....`                  |
| 8   | **Prepare the migration to v2**               | First, update the image with the working `LICENSE_KEY`; then substitute the pre-obtained `LICENSE_KEY_V2` according to the [activation order](/en/operation/License.md#активация-инсталляции) |
| 9   | **Update the tag in the current container**         | Change the image version                       |
| 10  | **Restart all application instances**   | `docker-compose up -d`                       |
| 11  | **Check health checks and the license**        | Verify the current mode and regular user access. When migrating to v2, check AI/DES and remove `LICENSE_KEY` only after a successful check and the end of the rollback window |

### Zero-Downtime Update {#обновление-без-простоя}

The application performs database migrations itself at startup (Liquibase). If multiple instances start simultaneously, one of them applies the migrations, while the others wait for the lock in the `databasechangeloglock` table and start after it.

| Installation Scheme | What Happens During Update |
| --- | --- |
| Single instance (Docker, Podman, one replica in Kubernetes) | Short downtime: the old container stops, the new one applies migrations and starts. Usually up to 15 minutes: the first start with migrations takes up to 5 minutes |
| Two or more replicas in Kubernetes | Zero downtime. The chart updates pods one by one (`maxSurge: 1`, `maxUnavailable: 0`): the new pod applies migrations, passes the readiness check, and only then is the old pod removed from load balancing |

Migrations are written so that the previous version of the application continues to work on the updated schema: new columns and tables are added, existing ones are not deleted or renamed in the same release. Similarly, our cloud service is updated via a rolling update across nodes. Updates that require special actions are listed in the "Critical Updates" section below — read it before updating.

During the rolling update, open connections to the old pod (collaborative editing, AI chat) are dropped, so it is best to schedule the update during off-peak hours.

::: tip Skipped Several Versions
You can update across multiple versions at once: migrations for all intermediate versions will be applied in order at startup. Before doing so, read "Critical Updates" for each skipped version.
:::

### Version Rollback {#откат-версии}

There are no reverse migrations: the database schema cannot be rolled back using the application's built-in tools. There are two ways to perform a rollback.

| Method | When it applies | How |
| --- | --- | --- |
| Image only | The new version started, but there is a runtime error, and the data is intact | Revert to the previous image tag (`helm rollback <релиз> -n <namespace>` or the previous tag in `docker-compose.yml`) and restart. The previous version works with the updated schema: the new version's migrations only add structures. Records of new migrations in `databasechangelog` do not interfere with the old version |
| Image and database | The migration failed, the data is corrupted, or the release Changelog states that an image rollback is not possible | Stop all instances, restore the database from the backup taken before the update, and start the previous image — see [“Disaster Recovery → During an update”](#при-обновлении). Changes made by users after the update will be lost |

Therefore, before each update, a database backup and a verification that it can be restored (steps 0–1 above) are mandatory.

::: tip What's New Feed
In the on-prem version, the What's New feed displays static content baked into the image at build time. There are no external links to the blog, and the date is displayed as the build date. The feed updates automatically when the application version is updated.
:::

### Critical updates {#критические-обновления}

::: danger Version ≥ 7.10.13 — v1/v2 licensing transition mode
The existing `LICENSE_KEY` continues to work temporarily, so immediate reissuance of all keys is not required. V1 is deprecated and has a known security limitation: gradually migrate production, test environments, DR, and clones, obtaining a separate `LICENSE_KEY_V2` for each. A non-empty v2 has exclusive priority, and there is no automatic fallback to v1 in case of an error. After substituting v2, restart all instances, verify the license, and only then remove `LICENSE_KEY` from the working configuration of this installation. Details — [«Installation Activation»](/en/operation/License.md#активация-инсталляции).
:::

::: danger Version < 6.3.231 → newer
**Database migration required:**

```sql
UPDATE databasechangelog
SET filename = CONCAT('/db/changelog/changes/', SUBSTRING(filename, 35));
```

:::

::: warning Version ≥ 6.6.441
**New ENV variables required:**

| Variable                     | Value                | Description                             |
| ------------------------------ | ----------------------- | ------------------------------------ |
| **STORM_ALLOWED_ORIGINS**      | `https://your.domain`   | CORS settings (do not use `*`!) |
| **STORM_DISABLE_SIMPLE_AUTH**  | `false`                 | Disabling basic authorization       |
| **STORM_DISABLE_ENV_IN_UI**    | `true`                  | Hiding ENV in the admin panel                |
| **STORM_DISABLE_ANON_SHARING** | `true`                  | Prohibition of anonymous access            |
| **STORM_SENTRY_ENABLE**        | `false`                 | Disabling Sentry                    |
| **STORM_ENABLE_SAAS_FEATURES** | `false`                 | Disabling SaaS features              |
| **GOTENBERG_URL**              | `http://gotenberg:3001` | Conversion service URL              |

:::

::: warning Version ≥ 6.6.559
**PostgreSQL extension required:**

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

:::

::: danger The pgvector extension will become mandatory (fast search + knowledge base)
The **pgvector** extension becomes a **basic platform requirement**: it powers fast universal (semantic) search over data — this is required for **all installations, regardless of the presence of the AI module** (the AI chat knowledge base is just one of the consumers). In upcoming versions, pgvector will become a **hard dependency**: without it, migration will not be performed, and the backend will not start. **Prepare in advance** (you can do it now):

1. Switch to a PostgreSQL build with pgvector — for example, the **`pgvector/pgvector:pg17`** image (the same PostgreSQL + standard contrib modules + pgvector), or install pgvector in your build/DBaaS.
2. Ensure that the required extensions are available in the **application database**. Superuser privileges or a role with the `CREATE EXTENSION` right are sufficient:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- для автодополнения, приложение его не создаёт само
```

The full list of extensions and DB encoding — in the [«PostgreSQL Requirements»](/en/install/README.md) section.
:::

---

## Disaster Recovery {#disaster-recovery}

### When updating {#при-обновлении}

If the update fails:

1. **Save container logs**

    ```bash
    docker logs stormbpmn > /tmp/update_error_logs.txt
    ```

2. **Restore the database**

    ```bash
    pg_restore --format=t -c -N -O -h localhost -p 5432 -U storm_user -d storm_db /backup/latest_backup.tar
    ```

3. **Roll back the container version**

    ```bash
    docker load < backup_image.tar
    docker-compose up -d
    ```

    To roll back the license, keep both variables until the end of the agreed window. A non-empty
    `LICENSE_KEY_V2` takes precedence; to temporarily revert to v1, remove or clear v2,
    restore `LICENSE_KEY` and restart all application instances.

4. **Restart containers**

    ```bash
    docker-compose restart
    ```

5. **Verify recovery**: wait for health checks, check the license status, then
   log in and open a licensed feature under a regular user account.

6. **Contact support** with the following information:
    - Original version
    - Target version
    - Error logs
    - System configuration

### Basic Operations {#при-базовои-эксплуатации}

If the system encounters issues:

1. **Save logs**

    ```bash
    docker logs stormbpmn > /tmp/error_logs.txt
    ```

2. **Restart containers**

    ```bash
    docker-compose restart
    ```

3. **Check status**

    - Health checks respond
    - Metrics are within normal range
    - Users can log in

4. **If issues persist** - contact support

---

## Related documentation {#связанная-документация}

-   **[System Check](./system-check.md)** - automatic checks for the database, license, mail, S3, Gotenberg, and other services
-   **[Configuration](../configure/README.md)** - system configuration
-   **[Production-Ready](/en/install/production/)** - deployment for production
-   **[Security](/en/configure/security/)** - security settings
