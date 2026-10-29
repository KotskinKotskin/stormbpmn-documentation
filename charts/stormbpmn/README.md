# StormBPMN Enterprise — Helm chart

Чарт для установки **StormBPMN Enterprise** в Kubernetes 1.23+.

**Инструкция для пользователей:** https://enterprise.stormbpmn.com/install/kubernetes.html

```bash
helm repo add stormbpmn https://enterprise.stormbpmn.com/helm
helm install storm stormbpmn/stormbpmn -n stormbpmn -f my-values.yaml
```

## Версии

Версия чарта совпадает с версией StormBPMN. Номера в `Chart.yaml` нужны только для установки прямо
из git. Опубликованные пакеты собирает `scripts/helm-repo.mjs` при каждом деплое сайта документации:
для каждой версии из `src/Changelog/X.Y.Z.md`, начиная с `MIN_VERSION`, он выставляет
`version = appVersion = X.Y.Z`. Поэтому новый релиз в Changelog сам публикует новый чарт.

Опубликованные версии неизменны: скрипт скачивает их архивы с сайта и пакует только новые
версии. Значит, правка шаблонов попадёт в чарт со следующим релизом приложения. Чтобы
осознанно перевыпустить уже опубликованную версию, задайте в CI переменную `HELM_REPACK=X.Y.Z`.

## Состав

| Ресурс | Когда |
|---|---|
| Deployment, Service, ConfigMap, Secret, ServiceAccount | всегда (Secret — если не задан `existingSecret`) |
| Ingress | `ingress.enabled` |
| HTTPRoute (Gateway API) | `httpRoute.enabled` |
| HPA / PDB | `autoscaling.enabled` / `podDisruptionBudget.enabled` |
| ServiceMonitor | `metrics.serviceMonitor.enabled` (Prometheus Operator) |
| NetworkPolicy | `networkPolicy.enabled`, исходящие — `networkPolicy.egress.*` |
| Deployment + Service `storm-des` | `des.enabled` (модуль симуляций) |
| Pod `helm test` | `helm test <релиз>` |

## Главные values

| Параметр | По умолчанию | ENV / описание |
|---|---|---|
| `image.registry` / `image.repository` | `cr.selcloud.ru` / `stormbpmn-enterprise/stormbpmn_fullstack_enterprise` | Для закрытого контура — свой реестр |
| `image.tag` | `""` → версия чарта | |
| `storm.database.*` | — | `JDBC_URL`, `JDBC_USERNAME`, `JDBC_PASSWORD` (PostgreSQL c pgvector) |
| `storm.license.keyV2` | `""` | `LICENSE_KEY_V2` (ключ по коду с `/admin-onboarding`) |
| `storm.license.key` | `""` | `LICENSE_KEY` (v1, устаревший) |
| `storm.jwt.secret` | `""` | `JWTSECRET`, ≥ 64 символов |
| `storm.s3.*` | — | `S3_*`, включая `S3_EXTERNAL_ENDPOINT` |
| `storm.email.*` | `smtp` | `EMAIL_PROVIDER`, `SMTP_*` / `LISTMONK_*` |
| `storm.integrations.*` | `""` | `PLANTUML_SERVER`, `GOTENBERG_URL` (пустой = публичный demo.gotenberg.dev) |
| `storm.ai.*` | `false` | `MCP_ENABLED`, `STORM_RETENTION_ENABLED` |
| `storm.security.*` | — | `STORM_ALLOWED_ORIGINS`, `STORM_DISABLE_*`, `SESSION_EXPIRATION` (секунды, ≤ 7776000) |
| `storm.audit.*` | выкл. | `AUDIT_*`, `SYSLOG_*`, `AUDIT_DB_*` (каналы console / syslog / database) |
| `des.*` | выкл. | `storm-des`: та же БД, TZ и версия; приложению — `DES_BASE_URL` |
| `existingSecret` | `""` | Свой Secret с ключами-именами ENV |
| `extraEnv` / `extraEnvFrom` | `[]` | Любые ENV, которых нет в чарте |

Полный список с комментариями — [`values.yaml`](values.yaml), примеры — [`examples/`](examples/).

## Проверка изменений чарта

```bash
helm lint charts/stormbpmn --set storm.jwt.secret=$(openssl rand -hex 32)
helm template t charts/stormbpmn -f charts/stormbpmn/examples/on-prem-ru.yaml --set storm.jwt.secret=$(openssl rand -hex 32)
node scripts/helm-repo.mjs   # собрать репозиторий локально в src/.vuepress/public/helm/
```

Миграция с чарта 3.x — [UPGRADING.md](UPGRADING.md).
