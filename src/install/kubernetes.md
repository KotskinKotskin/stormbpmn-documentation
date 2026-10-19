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

Чарт разворачивает контейнер приложения и, если нужно, сервис симуляций `storm-des`. PostgreSQL, S3, Redis,
Gotenberg, PlantUML и SMTP вы поднимаете сами или берёте корпоративные. Требования к ним те же, что
при установке в Docker: см. [«Установка»](./README.md) и [«Production-установка»](./production/README.md).

## Что нужно заранее

| Что | Требование |
| --- | --- |
| Kubernetes | 1.23 или новее |
| Helm | 3.8 или новее |
| PostgreSQL | База в UTF8 с расширениями **pgvector** и **pg_trgm**. Без pgvector приложение не запустится, подробнее в разделе [«Требования к PostgreSQL»](./README.md#требования-к-postgresql-расширения-и-кодировка) |
| Redis | Нужен, если реплик больше одной |
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
| `single-instance.yaml` | Пилот: один под без Redis, почта выключена |
| `on-prem-ru.yaml` | Промышленная установка: 3+ реплики, Redis, HPA, PDB, ServiceMonitor, аудит в SIEM по Syslog |
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
`helm upgrade`. Поды перезапустятся сами. Затем создайте первого администратора в мастере настройки.
Подробности в разделе [«Активация инсталляции»](/operation/License.md#активация-инсталляции).

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
| Совместное редактирование рвётся при нескольких репликах | Не включён Redis или не настроены sticky-сессии на ingress |
| Симуляции падают с «DES-нода не ответила» | У `storm-des` другой часовой пояс. В чарте он общий, проверьте `des.extraEnv` |
