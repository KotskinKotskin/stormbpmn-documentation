---
source_hash: 6a21628633c93af6
---
# Migrating the StormBPMN Database to UTF-8 {#миграция-бд-stormbpmn-на-utf-8}

A guide for the database administrator of an on-premise installation. The goal is to convert the StormBPMN database from `SQL_ASCII` to `UTF-8` to ensure that case-insensitive search and deduplication for Cyrillic characters work correctly.

> All commands and thresholds have been verified on PostgreSQL 16, database `SQL_ASCII | C | C` (matching the target installation). Before proceeding, read the entire document, especially section **3 (data diagnostics)**.

---

## 1. Why {#_1-зачем}

StormBPMN supports databases only in **UTF-8** encoding — this is an official requirement of Storm
Storm Enterprise ([install](https://enterprise.stormbpmn.com/install/),
[get-started](https://enterprise.stormbpmn.com/get-started.html)): *"UTF8 encoding — correct text storage, ICU collation, and natural sorting of names"*. This
instruction aligns the installation on `SQL_ASCII` with this requirement.

In addition to the official requirement: encoding alone is insufficient — a **UTF-8-compatible locale** is also
required. ICU collation fixes *sorting*, but case handling (`lower()`,
case-insensitive search) depends on `LC_CTYPE`. On `SQL_ASCII` (and on `UTF-8` with the
`C` locale), the `lower()` function does not convert Cyrillic characters to
lowercase → case-insensitive search for Russian names/titles (employees, roles,
diagrams, departments, comments, etc.) and deduplication during import do not work correctly: searching
for "иванов" does not find "Иванов".

| encoding \| LC_CTYPE | `lower('Иванов')` | `'Иванов' ILIKE '%иванов%'` |
|---|---|---|
| `SQL_ASCII` \| `C` | `Иванов` ❌ | `false` ❌ |
| `UTF8` \| `C` | `Иванов` ❌ | `false` ❌ |
| `UTF8` \| `C.UTF-8` | `иванов` ✅ | `true` ✅ |
| `UTF8` \| `ru_RU.UTF-8` / `en_US.UTF-8` | `иванов` ✅ | `true` ✅ |

> **Important:** changing only `encoding` is not enough — the locale (`LC_CTYPE`) must also be
> UTF-8-compatible (`C.UTF-8`, `ru_RU.UTF-8`, `en_US.UTF-8`), **not `C`**.

---


## 2. Preparation (pre-flight) {#_2-подготовка-pre-flight}

- [ ] Agree on the **downtime window** (the application is stopped during the dump → restore process;
      duration ≈ depends on the database size, estimate it on a copy).
- [ ] **Fresh backup** of the entire database, verified for restorability.
- [ ] **Free disk space** ≈ 2× the database size (dump + new database simultaneously).
- [ ] Verify that the required UTF-8 locale is installed in the OS: `locale -a | grep -i utf`.
      If `ru_RU.UTF-8` is not available — `C.UTF-8` (usually present) or `en_US.UTF-8` will suffice.
      If necessary: `localedef -i ru_RU -f UTF-8 ru_RU.UTF-8` (Debian/RHEL).
- [ ] **Target** (new database server/container where the database will be migrated) — PostgreSQL **14+**, **16–17** recommended.
      The easiest option is to use the ready-made image `pgvector/pgvector:pg17` (mirror
      `cr.selcloud.ru/stormbpmn-enterprise/pgvector:pg17`): it **already includes** PostgreSQL 17,
      the pgvector package, and ICU support — there is **no need** to install or build them separately. Specifically,
      PG17 is not mandatory (minimum is 14), but this image is the simplest way to get a build
      where pgvector and ICU are already in place.
- [ ] **Required extensions** for Storm — `pgvector`, `pg_trgm`, `pgcrypto`, `uuid-ossp`,
      `hstore`. Their packages are already included in the `pgvector/pgvector:pg17` image; nothing needs to be installed —
      they are enabled via the `CREATE EXTENSION` commands in step 4 (therefore, the base `postgres` image without
      pgvector will not work). ICU is not an extension but a collation provider; it is built into the image.
- [ ] The source and target PG versions **do not need** to match: a dump from an older version
      restores correctly to a newer one (PG17).
- [ ] Performed by a **DBA** — especially if "corrupted" bytes are detected in step 3.

---

## 3. Diagnostics (MANDATORY before migration) {#_3-диагностика-обязательно-до-миграции}

### 3.1. Current encoding/locale {#_3-1-текущая-кодировка-локаль}

```sql
SELECT datname,
       pg_encoding_to_char(encoding) AS encoding,
       datcollate, datctype
FROM pg_database
WHERE datname = current_database();

-- Контрольная проба: если вернулось 'Иванов' (регистр не изменился) — миграция нужна.
SELECT lower('Иванов');
```

### 3.2. Are the data valid UTF-8 — a critical step {#_3-2-валидны-ли-данные-как-utf-8-—-критическии-шаг}

`SQL_ASCII` stores bytes "as is," without validation. The subsequent fate of the migration depends on the encoding in which the Cyrillic characters are actually stored:

- **Storm writes data as UTF-8** (the driver uses `client_encoding=UTF8`) — the expected case, in which the migration is straightforward (scenario **A**).
- However, if data from legacy sources or manual edits in **CP1251 (Windows-1251)** or another single-byte encoding ended up in the database, it cannot simply be "renamed" to UTF-8; transcoding is required (scenario **B**).

**Quick indicator (single-byte vs. UTF-8).** For UTF-8, Cyrillic characters occupy 2 bytes per character, while for CP1251 they occupy 1 byte. Take a known value and compare its length in bytes:

```sql
-- для 'Иванов' (6 символов): 12 → UTF-8; 6 → однобайтовая (CP1251)
SELECT octet_length(last_name) AS bytes, last_name
FROM sm_persons
WHERE last_name IS NOT NULL
ORDER BY id LIMIT 20;
```

**Reliable check — "test dump to UTF-8".** `pg_dump --encoding=UTF8` fails on the very first invalid byte, thus serving as a validator for the entire database at once:

```bash
pg_dump -U <user> --encoding=UTF8 -Fc -d <db> -f /tmp/storm.utf8.dump
# Успех (exit 0) → данные — валидный UTF-8, идём по сценарию A (этот же дамп и используем).
# Ошибка вида:
#   pg_dump: detail: invalid byte sequence for encoding "UTF8": 0xc8 0xe2
# → есть «битые»/однобайтовые данные, сценарий B.
```

**List of specific corrupted strings** (if targeted cleanup is needed) — for each text column, for example:

```sql
DO $$
DECLARE r record; bad int[] := '{}';
BEGIN
  FOR r IN SELECT id, last_name AS v FROM sm_persons LOOP
    BEGIN PERFORM convert_from(r.v::bytea, 'UTF8');
    EXCEPTION WHEN others THEN bad := bad || r.id; END;
  END LOOP;
  RAISE NOTICE 'sm_persons с битыми байтами (id): %', bad;
END $$;
```

> ⚠️ **Dangerous nuance.** A standard `pg_dump` (without `--encoding=UTF8`) + `pg_restore` will **silently carry over** corrupted bytes to the new UTF-8 database (restore inherits `client_encoding=SQL_ASCII` from the dump and does not validate). The database will be "UTF-8," but it will contain invalid byte mines inside. Therefore, always use `--encoding=UTF8` for dumps — it prevents dirty data from migrating unnoticed.

---

## 4. Migration (with downtime) {#_4-миграция-с-даунтаимом}

The encoding of the existing database cannot be changed in place (`ALTER DATABASE ... ENCODING` does not exist) — only dump → new UTF-8 database → restore.

```bash
# 0. Бэкап уже сделан (раздел 2).

# 1. Остановить приложение (Storm backend), чтобы не было записи.

# 2. Дамп + валидация одним шагом (см. 3.2). Если упал — сценарий B, см. ниже.
pg_dump -U <user> --encoding=UTF8 -Fc -d <db> -f /tmp/storm.utf8.dump

# 3. Создать новую UTF-8 БД с UTF-8-локалью (обязательно из template0).
createdb -U <user> --encoding=UTF8 \
         --lc-ctype=ru_RU.UTF-8 --lc-collate=ru_RU.UTF-8 \
         --template=template0 storm_utf8
#   (нет ru_RU.UTF-8 → используйте C.UTF-8)
#   Альтернатива — новый кластер: initdb --encoding=UTF8 --locale=ru_RU.UTF-8 -D <newdir>

# 4. Restore. PGCLIENTENCODING=UTF8 гарантирует валидацию на вставке.
PGCLIENTENCODING=UTF8 pg_restore -U <user> -d storm_utf8 -j 4 /tmp/storm.utf8.dump
#   -j 4 — параллельные воркеры (ускоряет; подберите по числу ядер).
#   При проблемах с владельцами/ролями: добавьте --no-owner --role=<user>.

# 5. Обязательные расширения. pg_dump переносит их сам, но проверяем явно
#    (Storm требует создавать pg_trgm вручную, иначе автокомплит молча не работает):
psql -U <user> -d storm_utf8 <<'EOSQL'
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS hstore;
EOSQL

# 6. Переключить datasource приложения на storm_utf8 и запустить backend.
```

### Scenario B — data in CP1251 (if step 2 failed) {#сценарии-b-—-данные-в-cp1251-если-шаг-2-упал}

Transcoding is required. It is safer to do this on a text dump via `iconv` (ASCII parts are invariant):

```bash
pg_dump -U <user> -Fp -d <db> -f /tmp/storm.plain.sql          # plain-text дамп (как есть)
iconv -f WINDOWS-1251 -t UTF-8 /tmp/storm.plain.sql -o /tmp/storm.win1251-to-utf8.sql
# Убедиться, что в шапке дампа client_encoding = UTF8 (поправить при необходимости),
# затем восстановить в UTF-8 БД из раздела 4 шаг 3:
PGCLIENTENCODING=UTF8 psql -U <user> -d storm_utf8 -f /tmp/storm.win1251-to-utf8.sql
```

> If the database **mixes** UTF-8 and CP1251 (a common result of a long life with SQL_ASCII) — a single `iconv`
> is not enough; such cases are handled by the DBA line by line (based on the list from 3.2). Do not migrate "blindly".

---

## 5. Post-migration verification {#_5-проверка-после-миграции}

```sql
\c storm_utf8
-- кодировка/локаль
SELECT pg_encoding_to_char(encoding), datcollate, datctype
FROM pg_database WHERE datname = current_database();   -- ожидаем UTF8 + *.UTF-8

-- фолдинг кириллицы
SELECT lower('Иванов');                                -- ожидаем 'иванов'

-- данные на месте и не «кракозябры»
SELECT count(*) FROM sm_persons;                       -- сверить с источником
SELECT id, last_name, first_name FROM sm_persons ORDER BY id LIMIT 10;

-- обязательные расширения на месте (ожидаем 5 строк)
SELECT extname FROM pg_extension
WHERE extname IN ('vector','pg_trgm','pgcrypto','uuid-ossp','hstore') ORDER BY extname;
```

- [ ] Compare the **row count of key tables** with the source.
- [ ] Spot-check Cyrillic characters: values are read correctly, without garbage.
- [ ] **5 required extensions** are present (especially `pg_trgm` — otherwise autocomplete silently fails).
- [ ] Smoke test in the application: searching for the employee "ivanov" finds "Ivanov".

---

## 6. Rollback {#_6-откат}

- Do **not** delete the old database until the new one has been verified and the application has run normally.
- Rollback = revert the application's datasource to the old database and restart the backend.

---

## 7. Notes {#_7-замечания}

- `--template=template0` is required when changing the locale relative to `template1`.
- After switching to UTF-8, ICU-collation `natural_sort` will be applied (changeset DEV-871 intentionally skipped it for non-UTF8) — "human" sorting of numbers in names.
- Extensions/roles/sequences `pg_dump -Fc`/`pg_restore` are migrated automatically, but the receiver binary must contain the packages (hence the image `pgvector/pgvector:pg17`); `pg_trgm` Storm requires explicit creation (step 4, item 5). In case of owner mismatch — `--no-owner --role=<user>`, create roles in advance.

---

## 8. If migration is not performed {#_8-если-миграцию-не-делают}

Case-insensitive search and deduplication for Cyrillic characters on `SQL_ASCII` will not work — this is a limitation of the specific installation, not a defect of Stormbpmn. Workarounds on the application side for unsupported encodings are not provided.
