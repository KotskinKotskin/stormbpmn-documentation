---
source_hash: f6dbf495ce956211
---
# Installing pgvector in PostgreSQL {#установка-pgvector-в-postgresql}

> 🧩 **Upgrading to a version where Storm requires `pgvector`?** Here are step-by-step scenarios for delivering the extension to your DBMS.

[[toc]]

## Why {#зачем}

Starting with version `6.6.5952`, the application **requires** PostgreSQL with the **`pgvector`** extension. On startup, the migration performs `CREATE EXTENSION vector`; without the extension, the container terminates abnormally — there is no graceful degradation.

**Update order:** First, start PostgreSQL **with pgvector**, and only then update the application.

> ℹ️ **Do not change the major version of PostgreSQL.** Tag `pg17` corresponds to PostgreSQL 17. Changing the major version (17 → 18) is a separate `pg_upgrade` and `postgresql-18-pgvector` package, and is not performed "on the fly." Substitute **your** major version everywhere below.
>
> The Enterprise mirror contains an image for **PostgreSQL 17** (`cr.selcloud.ru/stormbpmn-enterprise/pgvector:pg17`).
> If you have a different major version and need a mirror — **contact technical support**, and we will provide an image for your version.

## Which scenario to choose {#какои-сценарии-выбрать}

- **PostgreSQL in Docker** → [Option 1. Via Docker image](#вариант-1-через-docker-образ)
- **PostgreSQL on the OS** (bare-metal / VM) → [Option 2. OS package](#вариант-2-установить-пакет-в-ос)

---

## Option 1. Using a Docker image {#вариант-1-через-docker-образ}

### 1.1. Switch to the official image `pgvector/pgvector:pgXX` + REINDEX {#_1-1-переити-на-официальныи-образ-pgvector-pgvector-pgxx-reindex}

**When:** You want the simplest path and are ready for a one-time reindexing (on small DBs — seconds). The official image is built on a different Debian base, so glibc/ICU change → `REINDEX` + collation marker update is required.

**1. Swap the image** (do not touch the volume — data is on it):

- **docker-compose:** change the DB service's `image: postgres:17` → `image: pgvector/pgvector:pg17`
  (or the enterprise mirror), then:
  ```bash
  docker compose up -d <db_service>
  ```
- **Portainer (without compose):** Containers → `<pg>` → **Duplicate/Edit** → **Image** field →
  `pgvector/pgvector:pg17` → the same mount `/var/lib/postgresql/data` to the same volume →
  **Deploy**.

**2. After startup — reindexing and collation marker update**:

Open a psql session as the superuser:

```bash
docker exec -it <pg> psql -U <user> -d <db>
# пример: docker exec -it postgres psql -U stormbpmn -d stormbpmn
```

Then execute the following in this session:

```sql
-- перестроить индексы под новые библиотеки (ОБЯЗАТЕЛЬНО, делается ДО refresh):
REINDEX DATABASE <db>;

-- обновить маркеры версий у всех баз:
ALTER DATABASE <db>      REFRESH COLLATION VERSION;
ALTER DATABASE postgres  REFRESH COLLATION VERSION;
ALTER DATABASE template1 REFRESH COLLATION VERSION;

-- массовый рефреш всех коллаций-объектов (БЕЗ ; перед \gexec):
SELECT format('ALTER COLLATION %I.%I REFRESH VERSION;', n.nspname, c.collname)
FROM pg_collation c JOIN pg_namespace n ON n.oid = c.collnamespace
WHERE c.collversion IS NOT NULL
  AND c.collversion <> pg_collation_actual_version(c.oid)
\gexec

-- проверка: должно вернуть 0
SELECT count(*) FROM pg_collation
WHERE collversion IS NOT NULL AND collversion <> pg_collation_actual_version(oid);
```

**3. Verify the extension:**

Choose based on the application schema. It is specified in the `JDBC_URL` container of Storm, parameter `currentSchema` (no parameter → `public`).

```sql
-- public
CREATE EXTENSION IF NOT EXISTS vector;
SELECT '[1,2,3]'::vector;
-- custom
CREATE EXTENSION IF NOT EXISTS vector SCHEMA <schema>;
SELECT '[1,2,3]'::<schema>.vector;
```

**4. Ensure there are no collation-warnings in the logs:**

```bash
docker logs <pg> --since 2m 2>&1 | grep -i collation || echo "OK: no collation warnings"
```

> ⚠️ **Order matters: first `REINDEX`, then `REFRESH`.** `REINDEX` rebuilds indexes
> for the current libraries, `REFRESH` only removes the warning. `REFRESH` without `REINDEX`
> is **not allowed** — it hides potentially incorrect indexes.

### 1.2. Build your own pgvector image based on the current PostgreSQL (without reindex) {#_1-2-собрать-свои-образ-pgvector-на-базе-текущего-postgresql-без-reindex}

**When:** you do not want reindexing, the database is large, or you want to stay on your own image.
The extension is delivered on top of **your own** image → glibc/ICU remain unchanged → `REINDEX`
is not required.

> **Invariant:** `FROM` must point to **the image currently running in the
> container** (by its actual digest), not to a floating tag `postgres:17` — otherwise
> a different base will be pulled and the same collation problem will return.

**1. Tag the current container image as the base:**

```bash
docker inspect <pg> --format '{{.Image}}'      # -> sha256:...
docker tag <sha256...> storm-postgres:base
```
*(or in Portainer: Images → image used by the container → Add tag → `storm-postgres:base`)*

**2. Build the image with pgvector**:

```dockerfile
FROM storm-postgres:base
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-17-pgvector && rm -rf /var/lib/apt/lists/*
```
```bash
docker build -t storm-postgres:pgvector .
```
*(or Portainer → Images → Build a new image → Web editor)*

**3. Recreate the container** on the `storm-postgres:pgvector` image, using the same volume (similar to p.1.1.1).
In Portainer, when using Duplicate/Edit — **disable Always pull the image** (the image is local,
it is not in the registry).

**4. Verify** — there will be no collation warning, and reindex is not needed:

Choose based on the application schema. It is specified in the `JDBC_URL` container of Storm,
parameter `currentSchema` (if the parameter is absent → `public`).

```sql
-- public
CREATE EXTENSION IF NOT EXISTS vector;
SELECT '[1,2,3]'::vector;
-- custom
CREATE EXTENSION IF NOT EXISTS vector SCHEMA <schema>;
SELECT '[1,2,3]'::<schema>.vector;
```

---

## Option 2. Install the package in the OS {#вариант-2-установить-пакет-в-ос}

**When:** PostgreSQL is installed as a package in the OS (not in Docker). OS libraries are not modified →
`REINDEX` is not required, and the package is installed permanently.

```bash
# Debian/Ubuntu (репозиторий PGDG):
sudo apt-get update
sudo apt-get install -y postgresql-17-pgvector
sudo systemctl restart postgresql
```

Then, connect **to the application database** (`<db>` — the StormBPMN database, for example `stormbpmn`) and check the extension:
```bash
sudo -u postgres psql -d <db>
```

Select based on the application schema. It is specified in the `JDBC_URL` Storm container,
parameter `currentSchema` (if the parameter is absent → `public`).

```sql
-- public
CREATE EXTENSION IF NOT EXISTS vector;
SELECT '[1,2,3]'::vector;
-- custom
CREATE EXTENSION IF NOT EXISTS vector SCHEMA <schema>;
SELECT '[1,2,3]'::<schema>.vector;
```