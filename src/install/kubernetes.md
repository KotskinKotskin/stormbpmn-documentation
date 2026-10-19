---
title: "Установка в Kubernetes (Helm)"
order: 3
---

[[toc]]

# Установка в Kubernetes (Helm)

StormBPMN ставится в Kubernetes официальным Helm-чартом из нашего Helm-репозитория.

::: tip Версия чарта = версия StormBPMN
Для каждой версии из [Changelog](/Changelog/README.md) публикуется чарт с тем же номером: чарт `9.1.302`
разворачивает StormBPMN `9.1.302`. Новая версия появляется в репозитории в день выхода релиза, поэтому
обновление сводится к `helm repo update` и `helm upgrade`.
:::

Чарт разворачивает контейнер приложения и, если в лицензии есть модуль симуляций, необязательный сервис `storm-des`. PostgreSQL, S3,
Gotenberg, PlantUML и SMTP вы поднимаете сами или берёте корпоративные. Требования к ним те же, что
при установке в Docker: см. [«Установка»](./README.md) и [«Production-установка»](./production/README.md).

## Что нужно заранее

| Что | Требование |
| --- | --- |
| Kubernetes | 1.23 или новее |
| Helm | 3.8 или новее |
| PostgreSQL | База в UTF8 с расширениями **pgvector** и **pg_trgm**. Без pgvector приложение не запустится, подробнее в разделе [«Требования к PostgreSQL»](./README.md#требования-к-postgresql-расширения-и-кодировка) |
| S3 | Любое S3-совместимое хранилище |
| Gotenberg | Нужен свой сервис. Если не указать его адрес, PDF будут печататься через публичный demo.gotenberg.dev |
| Доступ к `cr.selcloud.ru` | Логин и пароль реестра выдаёт ваш менеджер |

## Установка

### 1. Подключите репозиторий

```bash
helm repo add stormbpmn https://enterprise.stormbpmn.com/helm
helm repo update
helm search repo stormbpmn          # последняя версия
helm search repo stormbpmn -l       # все доступные версии
```

### 2. Создайте namespace и секрет реестра

```bash
kubectl create namespace stormbpmn
kubectl -n stormbpmn create secret docker-registry regcred \
  --docker-server=cr.selcloud.ru \
  --docker-username='<логин>' --docker-password='<пароль>'
```

### 3. Подготовьте values

Минимальный `my-values.yaml`:

```yaml
storm:
  database:
    url: "jdbc:postgresql://postgres.company.local:5432/storm"
    username: "stormuser"
    password: "<пароль БД>"
  jwt:
    secret: "<вывод openssl rand -hex 32>"   # не менее 64 символов
  s3:
    endpoint: "https://s3.company.local"
    accessKey: "<access key>"
    secretKey: "<secret key>"
  email:
    provider: "smtp"
    smtp:
      host: "smtp.company.local"
      from: "stormbpmn@company.local"
      username: "stormbpmn@company.local"
      password: "<пароль SMTP>"
  integrations:
    gotenbergUrl: "http://gotenberg.company.local:3001"
  security:
    allowedOrigins: "https://stormbpmn.company.local"

ingress:
  enabled: true
  hosts:
    - host: stormbpmn.company.local
      paths:
        - path: /
          pathType: Prefix
```

Все параметры с комментариями выводит команда `helm show values stormbpmn/stormbpmn`. Готовые примеры
лежат в чарте, в каталоге `examples/` (`helm pull stormbpmn/stormbpmn --untar`):

| Файл | Сценарий |
| --- | --- |
| `single-instance.yaml` | Пилот: один под, почта выключена |
| `on-prem-ru.yaml` | Промышленная установка: 3+ реплики, HPA, PDB, ServiceMonitor, аудит в SIEM по Syslog |
| `airgap.yaml` | Закрытый контур: все образы из внутреннего реестра |

::: tip Секреты не в values
Пароли, ключ лицензии и `JWTSECRET` можно держать в своём Secret (Vault, External Secrets, Sealed
Secrets): укажите его имя в `existingSecret`. Ключи в нём называются так же, как переменные
окружения: `JDBC_PASSWORD`, `JWTSECRET`, `LICENSE_KEY_V2`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`,
`SMTP_PASSWORD` и т. д.
:::

### 4. Установите

```bash
helm install storm stormbpmn/stormbpmn -n stormbpmn -f my-values.yaml
kubectl -n stormbpmn rollout status deployment/storm-stormbpmn
helm test storm -n stormbpmn
```

Чтобы поставить конкретную версию, добавьте `--version <версия>`.

### 5. Активируйте лицензию

Откройте `https://<ваш домен>/admin-onboarding`, скопируйте код активации целиком и передайте его менеджеру.
Полученный ключ укажите в `storm.license.keyV2` (или в ключе `LICENSE_KEY_V2` вашего Secret) и выполните
`helm upgrade`. Если ключ лежит в Secret из `values`, поды перезапустятся сами. Если вы используете свой Secret
(`existingSecret`), чарт не узнаёт об изменении ключа, и поды нужно перезапустить вручную:
`kubectl -n stormbpmn rollout restart deployment`. Затем создайте первого администратора в мастере настройки.
Подробности в разделе [«Активация инсталляции»](/operation/License.md#активация-инсталляции).

## Промышленная установка

Для нескольких реплик возьмите за основу `examples/on-prem-ru.yaml` и проверьте:

- **Ingress пропускает большие загрузки и долгие запросы.** Для ingress-nginx чарт задаёт это по
  умолчанию:

  ```yaml
  ingress:
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: "50m"
      nginx.ingress.kubernetes.io/proxy-read-timeout: "86400"
      nginx.ingress.kubernetes.io/proxy-send-timeout: "86400"
  ```

  Для другого контроллера задайте аналогичные лимиты. Для Gateway API см. ниже.
- **PDB и HPA** (`podDisruptionBudget.enabled`, `autoscaling.enabled`): обновление узлов не выключит все
  поды разом.
- **Свой Gotenberg** в `storm.integrations.gotenbergUrl`, иначе документы при печати в PDF уходят на
  публичный сервис.
- **`storm.security.allowedOrigins`** — домен приложения, а не `*`.
- **Метрики**: `metrics.serviceMonitor.enabled: true`, если в кластере есть Prometheus Operator.
- **Резервные копии** PostgreSQL и S3 по расписанию. В подах приложения нет данных, которые нужно сохранять.

### Gateway API вместо Ingress

Если в кластере вместо Ingress-контроллера используется Gateway API (Envoy Gateway, Istio, Cilium,
Traefik, NGINX Gateway Fabric и др.), выключите `ingress` и включите `httpRoute`:

```yaml
ingress:
  enabled: false
httpRoute:
  enabled: true
  parentRefs:
    - name: main-gateway          # ваш Gateway
      namespace: gateway-system
  hostnames:
    - stormbpmn.company.local
  timeouts:
    request: "300s"               # долгие запросы: импорт, выгрузки
```

TLS-сертификат, лимит размера загрузки (не меньше 50 МБ) и таймауты настраиваются на Gateway или в
политиках вашего контроллера.

После `helm install` и `helm upgrade` чарт выводит подсказки и предупреждения о том, чего не хватает
в ваших values. Прочитайте их.

## Пробная установка на ноутбуке

Чтобы посмотреть чарт в деле до установки в рабочий кластер, разверните всё в
[minikube](https://minikube.sigs.k8s.io/) вместе с тестовыми PostgreSQL и MinIO. Понадобятся
Docker, около 8 ГБ свободной памяти и доступ к `cr.selcloud.ru`.

::: warning Только для проверки
Пароли ниже открытые, данные хранятся внутри подов и пропадут при их перезапуске. Для работы эта
схема не годится.
:::

1. Запустите кластер и создайте namespace с секретом реестра:

   ```bash
   minikube start --cpus=4 --memory=12g --addons=ingress
   kubectl create namespace storm
   kubectl -n storm create secret docker-registry regcred \
     --docker-server=cr.selcloud.ru \
     --docker-username='<логин>' --docker-password='<пароль>'
   ```

2. Сохраните зависимости в `deps.yaml` и примените их командой `kubectl -n storm apply -f deps.yaml`:

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata: {name: pg-init}
   data:
     init.sql: |
       CREATE EXTENSION IF NOT EXISTS vector;
       CREATE EXTENSION IF NOT EXISTS pg_trgm;
   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata: {name: postgres}
   spec:
     selector: {matchLabels: {app: postgres}}
     template:
       metadata: {labels: {app: postgres}}
       spec:
         imagePullSecrets: [{name: regcred}]
         containers:
           - name: pg
             image: cr.selcloud.ru/stormbpmn-enterprise/pgvector:pg17
             env:
               - {name: POSTGRES_DB, value: storm}
               - {name: POSTGRES_USER, value: stormuser}
               - {name: POSTGRES_PASSWORD, value: stormpass}
             volumeMounts: [{name: init, mountPath: /docker-entrypoint-initdb.d}]
             readinessProbe: {exec: {command: [pg_isready, -U, stormuser, -d, storm]}}
         volumes: [{name: init, configMap: {name: pg-init}}]
   ---
   apiVersion: v1
   kind: Service
   metadata: {name: postgres}
   spec: {selector: {app: postgres}, ports: [{port: 5432}]}
   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata: {name: minio}
   spec:
     selector: {matchLabels: {app: minio}}
     template:
       metadata: {labels: {app: minio}}
       spec:
         containers:
           - name: minio
             image: bitnamilegacy/minio:2025.7.23-debian-12-r5
             env:
               - {name: MINIO_ROOT_USER, value: minioadmin}
               - {name: MINIO_ROOT_PASSWORD, value: minioadmin123}
               - {name: MINIO_DEFAULT_BUCKETS, value: "storm-uploads,storm-users,storm-imports"}
             readinessProbe: {httpGet: {path: /minio/health/ready, port: 9000}}
   ---
   apiVersion: v1
   kind: Service
   metadata: {name: minio}
   spec: {selector: {app: minio}, ports: [{port: 9000}]}
   ```

3. Сохраните `values-local.yaml`:

   ```yaml
   imagePullSecrets: [{name: regcred}]
   storm:
     general:
       javaOpts: "-Xmx3g"
     database:
       url: "jdbc:postgresql://postgres:5432/storm"
       username: "stormuser"
       password: "stormpass"
     jwt:
       secret: "<вывод openssl rand -hex 32>"
     s3:
       endpoint: "http://minio:9000"
       accessKey: "minioadmin"
       secretKey: "minioadmin123"
     email:
       provider: "nop"
   des:
     enabled: false           # true — только если в ключе лицензии есть модуль симуляций
     javaOpts: "-Xmx2g"
   ingress:
     enabled: true
     hosts:
       - host: storm.local
         paths: [{path: /, pathType: Prefix}]
   ```

4. Подключите репозиторий, как в шаге 1 установки, затем установите чарт и дождитесь готовности:

   ```bash
   kubectl -n storm wait --for=condition=available deploy --all --timeout=300s
   helm install storm stormbpmn/stormbpmn -n storm -f values-local.yaml
   kubectl -n storm rollout status deployment/storm-stormbpmn --timeout=10m
   helm test storm -n storm
   ```

5. Откройте приложение:

   ```bash
   kubectl -n storm port-forward svc/storm-stormbpmn 8081:8081
   ```

   Затем перейдите на `http://127.0.0.1:8081/admin-onboarding` и активируйте инсталляцию, как в шаге 5 установки.

Удалить всё: `minikube delete`.

## Обновление

Перед обновлением сделайте резервную копию PostgreSQL и S3 и прочитайте предупреждения в [Changelog](/Changelog/README.md).

```bash
helm repo update
helm upgrade storm stormbpmn/stormbpmn -n stormbpmn -f my-values.yaml
```

Если обновляетесь с чарта 3.x (StormBPMN 6.6), сначала прочитайте `UPGRADING.md` в чарте. В 9.x изменились
обязательные параметры:

- `SESSION_EXPIRATION` задаётся в **секундах** (`storm.security.sessionExpirationSeconds`). Старое
  значение `86400000` в миллисекундах не даст приложению стартовать.
- `JWTSECRET` должен быть не короче 64 символов.
- Лицензия переходит на ключ `LICENSE_KEY_V2` (`storm.license.keyV2`).
- В PostgreSQL нужен pgvector.

## Модуль симуляций

::: info Необязательный модуль
`storm-des` нужен только для симуляций процессов и работает, только если модуль симуляций есть в вашем
ключе лицензии. Без него StormBPMN работает полностью. По умолчанию модуль выключен (`des.enabled: false`).
:::

Если в лицензии есть модуль симуляций, включите его в том же релизе:

```yaml
des:
  enabled: true
  resources:
    requests: { cpu: 2, memory: 14Gi }
    limits: { memory: 14Gi }
```

Чарт сам задаёт `storm-des` ту же базу, часовой пояс и версию образа, что у приложения, и передаёт
приложению `DES_BASE_URL`. Подробнее о модуле: [«Симуляции»](/simulation/install.md).

## Закрытый контур

Перенесите образы во внутренний реестр. Нужны те же версии, что у чарта:

```bash
V=<версия чарта>
for img in stormbpmn_fullstack_enterprise storm-des; do
  docker pull cr.selcloud.ru/stormbpmn-enterprise/$img:$V
  docker tag  cr.selcloud.ru/stormbpmn-enterprise/$img:$V harbor.company.local/stormbpmn/$img:$V
  docker push harbor.company.local/stormbpmn/$img:$V
done
```

Сам чарт скачайте на машине с интернетом командой `helm pull stormbpmn/stormbpmn --version $V` и ставьте
из файла `.tgz`. Реестр укажите по примеру `examples/airgap.yaml`. Перед переносом проверьте подпись
образов, как описано в [Changelog → «Проверка подписи образа»](/Changelog/README.md).

## Если что-то пошло не так

| Симптом | Причина |
| --- | --- |
| `helm install` отклоняет `storm.jwt.secret` | Ключ короче 64 символов |
| `helm install` отклоняет `sessionExpirationSeconds` | Задано больше 90 суток. Скорее всего, это миллисекунды |
| Под перезапускается, в логе ошибка `extension "vector"` | В PostgreSQL нет pgvector |
| Симуляции падают с «DES-нода не ответила» | У `storm-des` другой часовой пояс. В чарте он общий, проверьте `des.extraEnv` |
| При первой установке в логе `storm-des` ошибка `relation "sm_background_tasks" does not exist` | `storm-des` запустился раньше, чем приложение создало таблицы. Ошибка проходит сама через несколько секунд после старта приложения |
| Под в `ImagePullBackOff` с `pull access denied` | Не создан секрет `regcred` в namespace релиза или не указан `imagePullSecrets` |
| Под приложения в `CrashLoopBackOff` вскоре после старта | Мало памяти: проверьте `resources.limits.memory` и `storm.general.javaOpts` (`-Xmx` должен быть меньше лимита) |
