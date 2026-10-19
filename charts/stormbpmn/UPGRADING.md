# Миграция 3.x → 9.x (StormBPMN 6.6 → 9.x)

С этой версии номер чарта совпадает с версией StormBPMN, а сам чарт публикуется в
`https://enterprise.stormbpmn.com/helm` (`helm repo add stormbpmn …`).

Перед `helm upgrade` сделайте бэкап PostgreSQL и S3, затем приведите values:

| Было (3.x) | Стало | Почему |
|---|---|---|
| `storm.security.sessionExpirationMs: "86400000"` | `storm.security.sessionExpirationSeconds: "86400"` или пусто | `SESSION_EXPIRATION` теперь в секундах; значение больше 90 суток не даёт приложению стартовать |
| `storm.jwt.secret` ≥ 32 символов | ≥ 64 символов | HS512: с коротким ключом вход падает с `WeakKeyException` |
| `storm.license.key` | `storm.license.keyV2` (+ `key` на время проверки) | Лицензия v2 на инсталляцию: код с `/admin-onboarding` → ключ у менеджера |
| — | `storm.s3.externalEndpoint` | `S3_EXTERNAL_ENDPOINT`, если браузер ходит в S3 по другому адресу |
| — | `storm.ai.mcpEnabled`, `storm.ai.retentionEnabled` | AI-модуль |
| `storm.audit.channel`: console / syslog | + `database` и `storm.audit.database.*` | Аудит в TimescaleDB |
| — | `des.*` | Модуль симуляций `storm-des` в том же релизе |
| `storm.flags.*` (в старом `airgap.yaml`) | удалить | Такого ключа в чарте не было |

До запуска 9.x добавьте в PostgreSQL расширения **pgvector** и **pg_trgm**, иначе миграции
упадут на старте (см. «Требования к PostgreSQL» в документации). Если `GOTENBERG_URL` не задан,
приложение печатает PDF через публичный demo.gotenberg.dev, поэтому в проде укажите свой сервис.

```bash
helm get values storm -n stormbpmn > old-values.yaml
# правки по таблице выше → my-values.yaml
helm repo add stormbpmn https://enterprise.stormbpmn.com/helm && helm repo update
helm upgrade storm stormbpmn/stormbpmn -n stormbpmn -f my-values.yaml
```

---

# Миграция 2.x → 3.0.0

## TL;DR

Чарт `3.0.0` — breaking refresh. Структура и набор ENV выровнены строго под
актуальную enterprise-доку ([enterprise.stormbpmn.com](https://enterprise.stormbpmn.com)).
SaaS-only переменные удалены — их в enterprise-дистрибутиве нет.

Перед `helm upgrade`:
1. Бэкап PostgreSQL и S3-бакетов.
2. `helm get values storm -n stormbpmn > old-values.yaml`
3. Перепишите values по новой структуре.
4. `helm diff upgrade ...` (опционально).
5. `helm upgrade ...`

---

## Что поменялось

### Образ

| 2.x | 3.0.0 |
|---|---|
| Старый образ из Yandex Container Registry (`stormfullstack:latest`) | `cr.selcloud.ru/stormbpmn-enterprise/stormbpmn_fullstack_enterprise:6.6.5181` |
| Один параметр `image.repository` | Разделены `image.registry` + `image.repository` (удобно для air-gap). |

### ENV — переименования (AWS SDK v2, 6.6.4154+)

| 2.x | 3.0.0 (ENV в ConfigMap) | values |
|---|---|---|
| `MINIO_ENDPOINT` | `S3_ENDPOINT` | `storm.s3.endpoint` |
| `MINIO_ACCESSKEY` | `S3_ACCESS_KEY` | `storm.s3.accessKey` |
| `MINIO_SECRETKEY` | `S3_SECRET_KEY` | `storm.s3.secretKey` |
| `MINIO_DEFAULTBUCKET` | `S3_BUCKET_UPLOADS` + `S3_BUCKET_USERS` + `S3_BUCKET_IMPORTS` | `storm.s3.buckets.*` |

### ENV — удалены (нет в enterprise-доке)

| ENV | Причина |
|---|---|
| `ELASTICSEARCH_URL` | Не используется. |
| `MAUTIC_URL` / `MAUTIC_USERNAME` / `MAUTIC_PASSWORD` | Заменён на `EMAIL_PROVIDER=smtp/listmonk`. |
| `KEYCLOAK_ENABLED` / `KEYCLOAK_URL` / `KEYCLOAK_REALM` / `KEYCLOAK_FRONT_*` | В enterprise OAuth2 настраивается через **админ-панель** `/app/admin`, не ENV (см. ниже). |
| `LDAP_ENABLE` / `LDAP_URL` / `LDAP_BASE` / `LDAP_PRINCIPAL` / `LDAP_USERNAME` / `LDAP_PASSWORD` | LDAP в enterprise-доке не описан. |
| `CRM_TRACKING` | SaaS-only. |
| `STORM_ENABLE_SAAS_FEATURES` | SaaS-only (подписки, биллинг). |

### ENV — добавлены

| ENV | values | Назначение |
|---|---|---|
| `REDIS_ENABLED` | `storm.redis.enabled` | Явный switch. |
| `CONTAINER_ROLE` | `storm.general.containerRole` | FRONT/BACK/FULLSTACK (split-роли). |
| `JAVA_OPTS` | `storm.general.javaOpts` | По доке `-Xmx8g`. |
| `S3_REGION` / `S3_VIRTUAL_HOST` / `S3_SINGLE_USERS_BUCKET` | `storm.s3.*` | AWS SDK v2. |
| `EMAIL_PROVIDER` + `SMTP_*` / `LISTMONK_*` | `storm.email.*` | Унификация email. |
| `SESSION_EXPIRATION` | `storm.security.sessionExpirationMs` | Срок жизни сессии. |
| `AUDIT_ENABLED` / `AUDIT_CHANNEL` / `SYSLOG_*` / `AUDIT_*PATH` | `storm.audit.*` | SIEM-логирование (важно для банков). |

### Структура `values.yaml`

В 2.x все ENV лежали на верхнем уровне (`JDBC_URL: ...`, `MINIO_ENDPOINT: ...`).
В 3.0.0 — сгруппированы в `storm.*`:

```yaml
storm:
  general:  {springProfile, timezone, javaOpts, containerRole}
  database: {url, username, password}
  license:  {key}
  jwt:      {secret}
  s3:       {endpoint, region, virtualHost, singleUsersBucket, buckets.{uploads,users,imports}, accessKey, secretKey}
  redis:    {enabled, host, port, database, timeout, password}
  email:
    provider: "nop" | "smtp" | "listmonk"
    smtp:     {host, port, protocol, useAuth, from, username, password}
    listmonk: {baseUrl, username, password}
  integrations: {plantumlServer, gotenbergUrl}
  security: {allowedOrigins, disableSimpleAuth, disableEnvInUi, disableAnonSharing, sessionExpirationMs}
  audit:    {enabled, channel, includeUnauthPaths, excludeAuthPaths, syslog.{servers, source, messageFormat}}
```

### Probes

| 2.x | 3.0.0 |
|---|---|
| `/api/health/liveness` на порту 8080 | `/actuator/health/liveness` на backend-порту 8082 |
| `/api/health/readiness` на порту 8080 | `/actuator/health/readiness` на backend-порту 8082 |
| Нет startupProbe | Есть startupProbe, 5 минут на старт JVM |

### Порты

| 2.x | 3.0.0 |
|---|---|
| `service.port: 8080` (legacy UI) | `service.port: 8081` (новый UI через nginx) |
| Нет metrics-порта | `service.metricsPort: 8082` (`/actuator/prometheus`) |

### Kubernetes API

| 2.x | 3.0.0 |
|---|---|
| `autoscaling/v2beta1` (удалён в k8s 1.26) | `autoscaling/v2` |
| Ingress с semverCompare-логикой (поддерживал v1beta1) | Только `networking.k8s.io/v1` (k8s ≥ 1.19) |
| Нет PodDisruptionBudget | Опциональный `policy/v1` PDB |
| Нет ServiceMonitor | Опциональный `monitoring.coreos.com/v1` ServiceMonitor |

### Безопасность

В 2.x: root, все ENV (включая публичные) в Secret через `data: + b64enc`.

В 3.0.0:
- `drop ALL capabilities` и `seccompProfile: RuntimeDefault` по умолчанию; образ работает под uid 100 — другой `runAsUser` ломает nginx внутри образа
- Публичные ENV → ConfigMap, чувствительные → Secret (правильная семантика)
- Поддержка `existingSecret` (для SealedSecrets / Vault / external-secrets)

### Ingress

В 3.0.0 по умолчанию для nginx-ingress задано (из enterprise-доки):
- `proxy-body-size: 50m`
- `proxy-read/send-timeout: 86400`
- `affinity: cookie` (sticky для collaborative editing)

---

## Переход OAuth2 / SSO

В 2.x SSO настраивался через `KEYCLOAK_*` ENV-переменные.

В 3.0.0 (и в актуальном enterprise-дистрибутиве) OAuth2 конфигурируется
**через админ-панель** `/app/admin` — параметры хранятся в БД:

| Параметр | Описание |
|---|---|
| `OAuthIsEnabled` | Включить OAuth2 |
| `OAuthClientId` | Client ID в IdP |
| `OAuthClientSecret` | Client Secret |
| `OAuthAuthorizeUri` | URL авторизации (например, `https://keycloak.bank/auth/realms/master/protocol/openid-connect/auth`) |
| `OAuthUserInfoUri` | URL получения user info |
| `OAuthTokenUri` | URL получения токена |
| `OAuthRedirectUri` | URL возврата (`https://stormbpmn.bank.local/app/signin`) |
| `OAuthButtonLabel` | Текст на кнопке (например, "Войти через корпоративный аккаунт") |

Поддерживаются: Keycloak, Azure AD, ADFS, любой OAuth2/OIDC IdP.

---

## Пошаговый рецепт миграции

### 1. Зафиксируйте старые values

```bash
helm get values storm -n stormbpmn > old-values.yaml
```

### 2. Перенесите параметры

Возьмите `values-examples/on-prem-ru.yaml` как шаблон и подставьте свои значения.

Таблица соответствий:

| 2.x | 3.0.0 |
|---|---|
| `JDBC_URL` | `storm.database.url` |
| `JDBC_USERNAME` | `storm.database.username` |
| `JDBC_PASSWORD` | `storm.database.password` |
| `LICENSE_KEY` | `storm.license.key` |
| `JWTSECRET` | `storm.jwt.secret` |
| `MINIO_ENDPOINT` | `storm.s3.endpoint` |
| `MINIO_ACCESSKEY` | `storm.s3.accessKey` |
| `MINIO_SECRETKEY` | `storm.s3.secretKey` |
| `MINIO_DEFAULTBUCKET` | `storm.s3.buckets.uploads` (+ users + imports) |
| `REDIS_*` | `storm.redis.*`, **обязательно `storm.redis.enabled: true`** |
| `PLANTUML_SERVER` | `storm.integrations.plantumlServer` |
| `GOTENBERG_URL` | `storm.integrations.gotenbergUrl` |
| `SPRING_PROFILES_ACTIVE` | `storm.general.springProfile` |
| `TZ` | `storm.general.timezone` |
| `STORM_ALLOWED_ORIGINS` | `storm.security.allowedOrigins` |
| `STORM_DISABLE_SIMPLE_AUTH` | `storm.security.disableSimpleAuth` |
| `STORM_DISABLE_ENV_IN_UI` | `storm.security.disableEnvInUi` |
| `STORM_DISABLE_ANON_SHARING` | `storm.security.disableAnonSharing` |
| `KEYCLOAK_*` | **переехало** → в админ-панель `/app/admin` (OAuth2 настройки) |
| `LDAP_*` | **удалено** (нет в enterprise-доке) |
| `MAUTIC_*` | **удалено** → используйте `storm.email.provider: smtp` или `listmonk` |
| `ELASTICSEARCH_URL` | **удалено** |
| `CRM_TRACKING` | **удалено** |
| `STORM_ENABLE_SAAS_FEATURES` | **удалено** |
| `image.repository: cr.yandex/...` | `image.registry: cr.selcloud.ru` + `image.repository: stormbpmn-enterprise/stormbpmn_fullstack_enterprise` |
| `image.tag: latest` | `image.tag: ""` (=appVersion из Chart.yaml) или конкретный тег |

### 3. Сгенерируйте JWTSECRET ≥32 символов

Если ваш старый `JWTSECRET` короче 32 символов — приложение (Spring Boot 3 / Java 21, 6.6.3748+) не стартанёт:

```bash
openssl rand -hex 32
```

### 4. Перенесите OAuth2 настройки

Если у вас был SSO через `KEYCLOAK_*` ENV:
1. После `helm upgrade` зайдите в `/app/admin`.
2. Заполните `OAuthIsEnabled`, `OAuthClientId`, `OAuthClientSecret`,
   `OAuthAuthorizeUri`, `OAuthUserInfoUri`, `OAuthTokenUri`, `OAuthRedirectUri`.
3. Логаут — логин через "Войти через корпоративный аккаунт".

### 5. Бэкап перед upgrade

```bash
pg_dump -h <pg-host> -U <user> storm > storm-backup-$(date +%F).sql
# S3 — через `aws s3 sync` или `mc mirror`
```

### 6. Helm diff (опционально)

```bash
helm plugin install https://github.com/databus23/helm-diff
helm diff upgrade storm . -n stormbpmn -f my-values.yaml
```

### 7. Upgrade

```bash
helm upgrade storm . -n stormbpmn -f my-values.yaml
kubectl --namespace stormbpmn rollout status deployment/storm-stormbpmn
```

### 8. Откат

```bash
helm rollback storm -n stormbpmn
# и восстановите БД из бэкапа, если применялись миграции
```
