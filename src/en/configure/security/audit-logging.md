---
title: Audit Logging
order: 4
source_hash: 82cf3e6e68d83a98
---

[[toc]]

# Audit Logging {#аудит-логирование}

Stormbpmn maintains a complete log of user actions: one audit entry is written for each "request + response" pair. Log delivery is configured via a **channel** (`AUDIT_CHANNEL`):

-   **`console`** — JSON strings in the application log (container stdout). Default value.
-   **`syslog`** — sending to an external SIEM via the Syslog protocol.
-   **`database`** — writing to a dedicated **TimescaleDB** database, separate from the business database.

---

## Enabling {#включение}

| Variable        | Description                              | Example value             |
| ----------------- | ------------------------------------- | --------------------------- |
| **AUDIT_ENABLED** | Enabling audit                      | `true`                      |
| **AUDIT_CHANNEL** | Log delivery channel                | `console` / `syslog` / `database` |

::: warning Audit is disabled by default
Without `AUDIT_ENABLED=true`, no log is kept at all, even if `AUDIT_CHANNEL` is specified. If the channel
is not specified, `console` is used.
:::

---

## What is logged {#что-попадает-в-журнал}

One entry is written for each "request + response" pair. Preflight requests `OPTIONS` (CORS preflight) are not logged. The rest is filtered as follows:

-   **Authenticated requests** (with the `Authorization` header) — all are logged, **except** paths from
    `AUDIT_EXCLUDE_AUTH_PATH`.
-   **Unauthenticated requests** — logged **only** for paths from `AUDIT_INCLUDE_UNAUTH_PATH`
    (by default — only login).

| Variable                    | Description                                                     | Default                               |
| ----------------------------- | ------------------------------------------------------------ |--------------------------------------------|
| **AUDIT_EXCLUDE_AUTH_PATH**   | Comma-separated RegExp — which authenticated paths to exclude    | `.*/heartbeat$` (service internal request) |
| **AUDIT_INCLUDE_UNAUTH_PATH** | Comma-separated RegExp — which unauthenticated paths to log | `.*/auth/signin$` (system login)         |

::: warning Nuances when specifying values
-   **Escape `$` where the value passes through Docker Compose.** In `docker-compose.yml`
    (section `environment:`) and in Portainer Stacks, `$` means variable substitution, so
    the regex end-of-line anchor must be doubled — `$$`:
    `AUDIT_EXCLUDE_AUTH_PATH=.*/heartbeat$$,.*/diagram/.*/autosave$$`. However, if the variable is set
    as a "raw" container value (the Env field for the container in Portainer, `docker run -e`) — `$`
    is taken literally, and doubling is not required. If in doubt — verify the actual value in
    the container: `docker exec stormbpmn printenv AUDIT_EXCLUDE_AUTH_PATH`.
-   **No spaces around commas.** The list is split strictly by comma; a space will end up inside
    the pattern and break the match.
-   **The pattern is matched against the entire path**, not by substring — start with `.*` to
    catch the path suffix.
:::

### Masking {#маскирование}

Before writing the values of sensitive fields in the body and query parameters, they are replaced with `XXX`:
`password`, `client_secret`, `access_token`, etc.

### Original User IP {#оригинальныи-ip-пользователя}

The IP is taken from the `X-Real-IP` header, or from `X-Forwarded-For` if that header is absent. To ensure the log contains the actual client address rather than the container address, the upstream proxy/load balancer must forward one of these headers.

---

## Channel `console` (default) {#канал-console-по-умолчанию}

The simplest mode: the audit record is serialized to JSON and written to the application log (container stdout). This is convenient when your stack already collects container logs (Loki, ELK, etc.) — no additional infrastructure is required.

Record structure: `timestamp`, `email`, `method`, `path`, `query`, `request`, `response`,
`status`.

---

## Channel `syslog` (SIEM) {#канал-syslog-siem}

Sending logs to an external SIEM via the Syslog protocol.

| Variable                | Description                    | Example value                   | Default |
| ------------------------- |-----------------------------|-----------------------------------|------------- |
| **SYSLOG_SERVERS**        | List of syslog servers      | `localhost:514,192.168.78.53:601` | ❌  |
| **SYSLOG_SOURCE**         | Application name in logs | `stormbpmn`                       | ✅          |
| **SYSLOG_MESSAGE_FORMAT** | Message format (`RFC_3164` / `RFC_5424` / `RFC_5425`)         | `RFC_3164`  | ✅          |

### Record Structure {#структура-записи}

```json
{
  "timestamp": "2007-12-03T10:15:30:55.000000",
  "sessionId": "n8o7vty4o78cymruxjor84unrjo",
  "source": "stormbpmn",
  "subject": "user@example.com",
  "subjectIP": "192.168.0.1",
  "object": "41bc85d9-1bb5-4d9b-97bd-0193d9807b8b",
  "resource": "diagram",
  "action": "CHANGE",
  "payload": {
    "method": "POST",
    "url": "/api/v1/diagram",
    "request": { "..." },
    "response": { "..." }
  },
  "result": "SUCCESSFUL"
}
```

### Event Types {#типы-событии}

| Action   | Description          |
| ---------- | ----------------- |
| **GET**    | View object  |
| **CREATE** | Create object  |
| **CHANGE** | Modify object |
| **DELETE** | Delete object  |

| Result        | Description          |
| ---------------- | ----------------- |
| **SUCCESSFUL**   | Successful operation |
| **CLIENT_ERROR** | Client error    |
| **SERVER_ERROR** | Server error    |

---

## Channel `database` (TimescaleDB) {#канал-database-timescaledb}

Writing the journal to a **separate TimescaleDB database** (essentially a standard PostgreSQL with an extension), isolated from the business database: its own connection pool, its own schema, and its own lifecycle. This is the recommended mode for independent audit storage: the journal is stored in a structured format, allowing SQL queries for forensics, while TimescaleDB automatically compresses and deletes outdated data.

### Why TimescaleDB {#зачем-timescaledb}

The audit table is a **hypertable** with time-based partitioning, which provides three built-in mechanisms out of the box:

-   **Partitioning** by `timestamp` (daily chunks) — fast range queries.
-   **Compression** of chunks older than 2 days (columnar compression, segmentation by `email`) — significant space savings and targeted forensics for "what did user X do".
-   **Retention**: chunks older than **14 days** are automatically removed (instant DROP, without heavy DELETE).

### Configuration {#настроика}

| Variable                  | Description                                              | Example value                               | Default |
| --------------------------- | ----------------------------------------------------- |-----------------------------------------------|---------|
| **AUDIT_DB_URL**            | JDBC-URL of the audit database (TimescaleDB)                       | `jdbc:postgresql://timescale:5432/storm_audit` | ❌        |
| **AUDIT_DB_USERNAME**       | Audit database user                                 | `audit`                              | ❌        |
| **AUDIT_DB_PASSWORD**       | Password                                                | `password`                                    | ❌        |
| **AUDIT_DB_BODY_MAX_CHARS** | Maximum number of characters in the body; excess is replaced with the marker `_originalChars` | `16384`                                       | ✅       |
| **AUDIT_DB_QUEUE_CAPACITY** | Write buffer capacity                                 | `10000`                                       | ✅       |
| **AUDIT_DB_BATCH_SIZE**     | Insert batch size                                  | `500`                                         | ✅       |
| **AUDIT_DB_FLUSH_INTERVAL_MS** | Maximum delay for flushing a batch, ms             | `1000`                                        | ✅       |

### Database Deployment Example {#пример-развертывания-базы-данных}

::: warning A Community build of TimescaleDB is required.
Use the `timescale/timescaledb` **Community license** image. The tag with the **`-oss` suffix is not suitable** — it is an Apache build without compression and segmentation, on which schema initialization will fail and the application will not start.
:::

A separate TimescaleDB instance is started with a single compose file — the image automatically creates the user, database, and extension `timescaledb`; no manual database configuration is required:

```yaml
name: storm-audit
services:
  audit:
    image: timescale/timescaledb:2.28.0-pg17 # Community-сборка, НЕ -oss
    restart: unless-stopped
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: storm_audit
      POSTGRES_USER: <логин>
      POSTGRES_PASSWORD: <пароль>
    volumes: ["audit-data:/var/lib/postgresql/data"]
volumes:
  audit-data:
```

```bash
docker compose up -d
```

Next, configure the application connection parameters according to the table above and restart it — Liquibase will apply the schema (table, hypertable, compression and retention policies) at startup. The application must have network access to this database at the address specified in `AUDIT_DB_URL` (shared Docker network or accessible host).

### Table structure `audit_log` {#структура-таблицы-audit-log}

| Column        | Type           | Description                                 |
| -------------- | ------------- | ---------------------------------------- |
| **timestamp**  | `timestamptz` | Request time                            |
| **email**      | `text`        | User (subject)                   |
| **session_id** | `text`        | Session ID                                |
| **subject_ip** | `text`        | User IP                          |
| **method**     | `text`        | HTTP method                               |
| **path**       | `text`        | Request path                             |
| **query**      | `text`        | Query string                             |
| **status**     | `integer`     | HTTP response status                       |
| **request**    | `jsonb`       | Request body  |
| **response**   | `jsonb`       | Response body                              |

Bodies are stored as `jsonb` — they can be used for structural queries. A body longer than
`AUDIT_DB_BODY_MAX_CHARS` is not stored in full, but is marked with the marker `{"_originalChars": N}`
(where `N` is the original length) to prevent the log from bloating. Non-JSON bodies are wrapped in a JSON string.

### Forensic Query Example {#пример-форензик-запроса}

"What did the user do today":

```sql
SELECT timestamp, method, path, status
FROM audit_log
WHERE email = 'user@company.com'
  AND timestamp >= current_date
ORDER BY timestamp DESC;
```

### Reliability {#надежность}

Database writes are **asynchronous**: the request thread only places the record in a buffer and immediately responds to the user, while a separate worker writes in batches. Auditing **never blocks or fails** a user request: if the database is unavailable or the buffer is full, records are discarded and logged in aggregate (ERROR), but the application continues to operate.

::: tip Configuring retention policies
Chunks of 1 day, compression for data older than 2 days, and a 14-day retention period are built-in policies defined during schema initialization. If a different retention period is required, you or your DBA can modify the policy using standard TimescaleDB functions (`add_retention_policy` / `remove_retention_policy`, etc.) on the `audit_log` table. The audit database is separate—manage its backup and maintenance independently of the business database.
:::