# Установка pgvector в PostgreSQL

> 🧩 **Обновляетесь на версию, где Storm требует `pgvector`?** Здесь — пошаговые сценарии,
> как доставить расширение в вашу СУБД.

[[toc]]

## Зачем

Начиная с версии `6.6.5952` приложению **обязательно** нужна PostgreSQL с расширением
**`pgvector`**. На старте миграция выполняет
`CREATE EXTENSION vector`; без расширения контейнер аварийно завершается — мягкой
деградации нет.

**Порядок при обновлении:** сначала поднимаете PostgreSQL **с pgvector**, и только потом
обновляете приложение.

> ℹ️ **Мажорную версию PostgreSQL не меняем.** Тег `pg17` — это PostgreSQL 17. Смена мажора
> (17 → 18) — это отдельный `pg_upgrade` и пакет `postgresql-18-pgvector`, «на лету» не
> выполняется. Везде ниже подставляйте **свою** мажорную версию.
>
> Enterprise-зеркало содержит образ под **PostgreSQL 17** (`cr.selcloud.ru/stormbpmn-enterprise/pgvector:pg17`). 
> Если у вас другой мажор и нужно зеркало — **напишите в техподдержку**, предоставим образ под вашу версию.

## Какой сценарий выбрать

- **PostgreSQL в Docker** → [Вариант 1. Через Docker образ](#вариант-1-через-docker-образ)
- **PostgreSQL на ОС** (bare-metal / VM) → [Вариант 2. Пакет в ОС](#вариант-2-установить-пакет-в-ос)

---

## Вариант 1. Через Docker образ

### 1.1. Перейти на официальный образ `pgvector/pgvector:pgXX` + REINDEX

**Когда:** хотите самый простой путь и готовы на разовую переиндексацию (на небольших
БД — секунды). Официальный образ собран на другой Debian-базе, поэтому glibc/ICU
меняются → нужен `REINDEX` + обновление маркеров коллаций.

**1. Подменить образ** (volume не трогаем — данные на нём):

- **docker-compose:** поменяйте у сервиса БД `image: postgres:17` → `image: pgvector/pgvector:pg17`
  (или enterprise-зеркало), затем:
  ```bash
  docker compose up -d <db_service>
  ```
- **Portainer (без compose):** Containers → `<pg>` → **Duplicate/Edit** → поле **Image** →
  `pgvector/pgvector:pg17` → тот же mount `/var/lib/postgresql/data` на тот же volume →
  **Deploy**.

**2. После старта — переиндексация и обновление маркеров коллаций**:

Откройте psql-сессию под суперюзером:

```bash
docker exec -it <pg> psql -U <user> -d <db>
# пример: docker exec -it postgres psql -U stormbpmn -d stormbpmn
```

Дальше выполните в этой сессии:

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

**3. Проверить расширение:**

Выберите в зависимости от схемы приложения. Она указана в `JDBC_URL` контейнера Storm,
параметр `currentSchema` (параметра нет → `public`).

```sql
-- public
CREATE EXTENSION IF NOT EXISTS vector;
SELECT '[1,2,3]'::vector;
-- custom
CREATE EXTENSION IF NOT EXISTS vector SCHEMA <schema>;
SELECT '[1,2,3]'::<schema>.vector;
```

**4. Убедиться, что в логах нет collation-warning:**

```bash
docker logs <pg> --since 2m 2>&1 | grep -i collation || echo "OK: no collation warnings"
```

> ⚠️ **Порядок важен: сначала `REINDEX`, потом `REFRESH`.** `REINDEX` перестраивает индексы
> под текущие библиотеки, `REFRESH` лишь снимает предупреждение. `REFRESH` без `REINDEX`
> делать **нельзя** — он прячет потенциально некорректные индексы.

### 1.2. Собрать свой образ pgvector на базе текущего PostgreSQL (без reindex)

**Когда:** не хотите переиндексацию, БД большая, или хотите остаться на своём образе.
Расширение доставляется поверх **вашего же** образа → glibc/ICU не меняются → `REINDEX`
не нужен.

> **Инвариант:** `FROM` должен указывать на **тот образ, что прямо сейчас запущен в
> контейнере** (по его реальному digest), а не на плавающий тег `postgres:17` — иначе
> подтянется другая база и вернётся та же collation-проблема.

**1. Тегнуть текущий образ контейнера как базовый:**

```bash
docker inspect <pg> --format '{{.Image}}'      # -> sha256:...
docker tag <sha256...> storm-postgres:base
```
*(или в Portainer: Images → образ, используемый контейнером → Add tag → `storm-postgres:base`)*

**2. Собрать образ с pgvector**:

```dockerfile
FROM storm-postgres:base
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-17-pgvector && rm -rf /var/lib/apt/lists/*
```
```bash
docker build -t storm-postgres:pgvector .
```
*(или Portainer → Images → Build a new image → Web editor)*

**3. Пересоздать контейнер** на образе `storm-postgres:pgvector`, тот же volume (аналогично п.1.1.1).
В Portainer при Duplicate/Edit — **Always pull the image выключить** (образ локальный,
в реестре его нет).

**4. Проверить** — collation-warning'а не будет, reindex не нужен:

Выберите в зависимости от схемы приложения. Она указана в `JDBC_URL` контейнера Storm,
параметр `currentSchema` (параметра нет → `public`).

```sql
-- public
CREATE EXTENSION IF NOT EXISTS vector;
SELECT '[1,2,3]'::vector;
-- custom
CREATE EXTENSION IF NOT EXISTS vector SCHEMA <schema>;
SELECT '[1,2,3]'::<schema>.vector;
```

---

## Вариант 2. Установить пакет в ОС

**Когда:** PostgreSQL установлен пакетом в ОС (не в Docker). Библиотеки ОС не меняются →
`REINDEX` не нужен, пакет ставится навсегда.

```bash
# Debian/Ubuntu (репозиторий PGDG):
sudo apt-get update
sudo apt-get install -y postgresql-17-pgvector
sudo systemctl restart postgresql
```

Затем подключитесь **к базе приложения** (`<db>` — БД StormBPMN, например `stormbpmn`) и проверьте расширение:
```bash
sudo -u postgres psql -d <db>
```

Выберите в зависимости от схемы приложения. Она указана в `JDBC_URL` контейнера Storm,
параметр `currentSchema` (параметра нет → `public`).

```sql
-- public
CREATE EXTENSION IF NOT EXISTS vector;
SELECT '[1,2,3]'::vector;
-- custom
CREATE EXTENSION IF NOT EXISTS vector SCHEMA <schema>;
SELECT '[1,2,3]'::<schema>.vector;
```