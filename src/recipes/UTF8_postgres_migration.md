# Миграция БД StormBPMN на UTF-8

Руководство для администратора БД on-premise инсталляции. Цель — перевести базу
StormBPMN с `SQL_ASCII` на `UTF-8`, чтобы корректно работал регистронезависимый поиск
и дедупликация по кириллице.

> Все команды и пороги проверены на PostgreSQL 16, БД `SQL_ASCII | C | C` (как у целевой
> инсталляции). Перед выполнением — прочитать целиком, особенно раздел **3 (диагностика данных)**.

---

## 1. Зачем

StormBPMN поддерживает БД только в кодировке **UTF-8** — это официальное требование Storm
Enterprise ([install](https://enterprise.stormbpmn.com/install/),
[get-started](https://enterprise.stormbpmn.com/get-started.html)): *«Кодировка UTF8 —
корректное хранение текста, ICU-коллация и натуральная сортировка названий»*. Эта инструкция
приводит инсталляцию на `SQL_ASCII` в соответствие с ним.

Дополнительно к официальному требованию: одной только кодировки мало — нужна и
**UTF-8-совместимая локаль**. ICU-коллация чинит *сортировку*, но регистр (`lower()`,
регистронезависимый поиск) зависит от `LC_CTYPE`. На `SQL_ASCII` (и на `UTF-8` с локалью
`C`) функция `lower()` не приводит кириллицу к
нижнему регистру → регистронезависимый поиск по русским именам/названиям (сотрудники, роли,
диаграммы, подразделения, комментарии и т.д.) и дедуп при импорте работают неверно: поиск
«иванов» не находит «Иванов».

| encoding \| LC_CTYPE | `lower('Иванов')` | `'Иванов' ILIKE '%иванов%'` |
|---|---|---|
| `SQL_ASCII` \| `C` | `Иванов` ❌ | `false` ❌ |
| `UTF8` \| `C` | `Иванов` ❌ | `false` ❌ |
| `UTF8` \| `C.UTF-8` | `иванов` ✅ | `true` ✅ |
| `UTF8` \| `ru_RU.UTF-8` / `en_US.UTF-8` | `иванов` ✅ | `true` ✅ |

> **Важно:** сменить только `encoding` недостаточно — локаль (`LC_CTYPE`) тоже должна быть
> UTF-8-совместимой (`C.UTF-8`, `ru_RU.UTF-8`, `en_US.UTF-8`), **а не `C`**.

---

## 2. Подготовка (pre-flight)

- [ ] Согласовать **окно даунтайма** (приложение останавливается на время dump → restore;
      длительность ≈ зависит от размера БД, прикинуть на копии).
- [ ] **Свежий бэкап** всей БД, проверенный на восстановимость.
- [ ] **Свободное место** на диске ≈ 2× размера БД (дамп + новая БД одновременно).
- [ ] Проверить, что нужная UTF-8-локаль установлена в ОС: `locale -a | grep -i utf`.
      Если `ru_RU.UTF-8` нет — подойдёт `C.UTF-8` (есть почти всегда) или `en_US.UTF-8`.
      При необходимости: `localedef -i ru_RU -f UTF-8 ru_RU.UTF-8` (Debian/RHEL).
- [ ] **PostgreSQL 12+**; на приёмнике рекомендуется образ `pgvector/pgvector:pg17`
      (PG17 + pgvector + ICU; зеркало `cr.selcloud.ru/stormbpmn-enterprise/pgvector:pg17`).
      По возможности — та же мажорная версия на источнике и приёмнике.
- [ ] На приёмнике доступны **обязательные расширения** Storm: `pgvector`, `pg_trgm`,
      `pgcrypto`, `uuid-ossp`, `hstore`. Поэтому базовый образ `postgres` не подойдёт — нужен
      `pgvector/pgvector:pg17` (содержит пакеты pgvector и пр.). Создание — на шаге 4.
- [ ] Выполняет **DBA** — особенно если на шаге 3 обнаружатся «битые» байты.

---

## 3. Диагностика (ОБЯЗАТЕЛЬНО до миграции)

### 3.1. Текущая кодировка/локаль

```sql
SELECT datname,
       pg_encoding_to_char(encoding) AS encoding,
       datcollate, datctype
FROM pg_database
WHERE datname = current_database();

-- Контрольная проба: если вернулось 'Иванов' (регистр не изменился) — миграция нужна.
SELECT lower('Иванов');
```

### 3.2. Валидны ли данные как UTF-8 — критический шаг

`SQL_ASCII` хранит байты «как есть», без проверки. Дальнейшая судьба миграции зависит от
того, в какой кодировке реально лежит кириллица:

- **Storm пишет данные как UTF-8** (драйвер использует `client_encoding=UTF8`) — ожидаемый
  случай, тогда миграция простая (сценарий **A**).
- Но если в БД попадали данные из легаси-источников/ручных правок в **CP1251 (Windows-1251)**
  или иной однобайтовой кодировке — их нельзя просто «переобозвать» в UTF-8, нужно
  транскодирование (сценарий **B**).

**Быстрый признак (однобайтовая vs UTF-8).** Для UTF-8 кириллица занимает 2 байта/символ,
для CP1251 — 1 байт. Возьмите заведомо известное значение и сравните длину в байтах:

```sql
-- для 'Иванов' (6 символов): 12 → UTF-8; 6 → однобайтовая (CP1251)
SELECT octet_length(last_name) AS bytes, last_name
FROM sm_persons
WHERE last_name IS NOT NULL
ORDER BY id LIMIT 20;
```

**Надёжная проверка — «пробный дамп в UTF-8».** `pg_dump --encoding=UTF8` падает на ПЕРВОМ же
невалидном байте, то есть служит валидатором всей БД сразу:

```bash
pg_dump -U <user> --encoding=UTF8 -Fc -d <db> -f /tmp/storm.utf8.dump
# Успех (exit 0) → данные — валидный UTF-8, идём по сценарию A (этот же дамп и используем).
# Ошибка вида:
#   pg_dump: detail: invalid byte sequence for encoding "UTF8": 0xc8 0xe2
# → есть «битые»/однобайтовые данные, сценарий B.
```

**Список конкретных битых строк** (если нужно точечно почистить) — по каждой текстовой
колонке, например:

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

> ⚠️ **Опасный нюанс.** Обычный `pg_dump` (без `--encoding=UTF8`) + `pg_restore` **молча
> протащит** битые байты в новую UTF-8 БД (restore наследует `client_encoding=SQL_ASCII` из
> дампа и не валидирует). БД будет «UTF-8», но с невалидными байтами-минами внутри. Поэтому
> для дампа **всегда** используйте `--encoding=UTF8` — он не даст мигрировать грязные данные
> незаметно.

---

## 4. Миграция (с даунтаймом)

Кодировку существующей БД нельзя сменить на месте (`ALTER DATABASE ... ENCODING` не
существует) — только dump → новая UTF-8 БД → restore.

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

### Сценарий B — данные в CP1251 (если шаг 2 упал)

Нужно транскодировать. Безопаснее — на текстовом дампе через `iconv` (ASCII-части инвариантны):

```bash
pg_dump -U <user> -Fp -d <db> -f /tmp/storm.plain.sql          # plain-text дамп (как есть)
iconv -f WINDOWS-1251 -t UTF-8 /tmp/storm.plain.sql -o /tmp/storm.win1251-to-utf8.sql
# Убедиться, что в шапке дампа client_encoding = UTF8 (поправить при необходимости),
# затем восстановить в UTF-8 БД из раздела 4 шаг 3:
PGCLIENTENCODING=UTF8 psql -U <user> -d storm_utf8 -f /tmp/storm.win1251-to-utf8.sql
```

> Если в БД **смешаны** UTF-8 и CP1251 (частый итог долгой жизни SQL_ASCII) — единого `iconv`
> мало; такие случаи разбираются DBA построчно (по списку из 3.2). Не мигрируйте «вслепую».

---

## 5. Проверка после миграции

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

- [ ] Сверить **row count по ключевым таблицам** с источником.
- [ ] Spot-check кириллицы: значения читаются корректно, без мусора.
- [ ] **5 обязательных расширений** присутствуют (особенно `pg_trgm` — иначе автокомплит молча не работает).
- [ ] Smoke-тест в приложении: поиск сотрудника «иванов» находит «Иванов».

---

## 6. Откат

- Старую БД **не удалять**, пока новая не проверена и приложение не отработало штатно.
- Откат = вернуть datasource приложения на старую БД и перезапустить backend.

---

## 7. Замечания

- `--template=template0` обязателен при смене локали относительно `template1`.
- После перехода на UTF-8 начнёт применяться ICU-collation `natural_sort` (changeset DEV-871
  намеренно пропускал её на не-UTF8) — «человеческая» сортировка чисел в именах.
- Расширения/роли/последовательности `pg_dump -Fc`/`pg_restore` переносят сами, но бинарь
  приёмника должен содержать пакеты (отсюда образ `pgvector/pgvector:pg17`); `pg_trgm` Storm
  требует создавать явно (шаг 4, п. 5). При расхождении владельцев — `--no-owner --role=<user>`,
  роли создать заранее.

---

## 8. Если миграцию не делают

Регистронезависимый поиск и дедуп по кириллице на `SQL_ASCII` работать не будут — это
ограничение конкретной инсталляции, а не дефект StormBPMN. Обходные решения на стороне
приложения для неподдерживаемой кодировки не предоставляются.
