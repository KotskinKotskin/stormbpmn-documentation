---
title: Installation in Kubernetes (Helm)
order: 3
source_hash: 51223f098664f937
---

[[toc]]

# Installation in Kubernetes (Helm) {#установка-в-kubernetes-helm}

StormBPMN is installed in Kubernetes using the official Helm chart from our Helm registry.

::: tip Chart version = StormBPMN version
A chart with the same version number is published for each release in the [Changelog](/en/Changelog/README.md): chart `9.1.302`
deploys StormBPMN `9.1.302`. A new version appears in the registry on the day of the release, so
updating consists of `helm repo update` and `helm upgrade`.
:::

The chart deploys the application container and, if the license includes the simulations module, the optional `storm-des` service. You deploy PostgreSQL, S3,
Gotenberg, PlantUML, and SMTP yourself or use corporate instances. The requirements for them are the same as
for the Docker installation: see [“Installation”](./README.md) and [“Production installation”](./production/README.md).

## Prerequisites {#что-нужно-заранее}

| Item | Requirement |
| --- | --- |
| Kubernetes | 1.23 or later |
| Helm | 3.8 or later |
| PostgreSQL | A database with UTF8 encoding and the **pgvector** and **pg_trgm** extensions. The application will not start without pgvector; see the [“PostgreSQL Requirements”](./README.md#требования-к-postgresql-расширения-и-кодировка) section for details |
| S3 | Any S3-compatible storage |
| Gotenberg | A dedicated service is required. If its address is not specified, PDFs will be printed via the public demo.gotenberg.dev |
| Access to `cr.selcloud.ru` | Your account manager provides the registry login and password |

## Installation {#установка}

### 1. Connect the repository {#_1-подключите-репозитории}

```bash
helm repo add stormbpmn https://enterprise.stormbpmn.com/helm
helm repo update
helm search repo stormbpmn          # последняя версия
helm search repo stormbpmn -l       # все доступные версии
```

### 2. Create the registry namespace and secret {#_2-создаите-namespace-и-секрет-реестра}

```bash
kubectl create namespace stormbpmn
kubectl -n stormbpmn create secret docker-registry regcred \
  --docker-server=cr.selcloud.ru \
  --docker-username='<логин>' --docker-password='<пароль>'
```

### 3. Prepare values {#_3-подготовьте-values}

Minimal `my-values.yaml`:

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

The command `helm show values stormbpmn/stormbpmn` outputs all parameters with comments. Ready-made examples are located in the chart, in the `examples/` directory (`helm pull stormbpmn/stormbpmn --untar`):

| File | Scenario |
| --- | --- |
| `single-instance.yaml` | Pilot: one pod, email disabled |
| `on-prem-ru.yaml` | Production installation: 3+ replicas, HPA, PDB, ServiceMonitor, audit in SIEM via Syslog |
| `airgap.yaml` | Closed environment: all images from the internal registry |

::: tip Secrets not in values
Passwords, the license key, and `JWTSECRET` can be stored in your own Secret (Vault, External Secrets, Sealed Secrets): specify its name in `existingSecret`. The keys in it are named the same as environment variables: `JDBC_PASSWORD`, `JWTSECRET`, `LICENSE_KEY_V2`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`,
`SMTP_PASSWORD`, etc.
:::

### 4. Install {#_4-установите}

```bash
helm install storm stormbpmn/stormbpmn -n stormbpmn -f my-values.yaml
kubectl -n stormbpmn rollout status deployment/storm-stormbpmn
helm test storm -n stormbpmn
```

To install a specific version, add `--version <версия>`.

### 5. Activate the license {#_5-активируите-лицензию}

Open `https://<ваш домен>/admin-onboarding`, copy the activation code in its entirety, and send it to your manager.
Enter the received key in `storm.license.keyV2` (or in the `LICENSE_KEY_V2` key of your Secret) and run
`helm upgrade`. If the key is stored in a Secret from `values`, the pods will restart automatically. If you are using your own Secret
(`existingSecret`), the chart will not detect the key change, and the pods must be restarted manually:
`kubectl -n stormbpmn rollout restart deployment`. Then, create the first administrator in the setup wizard.
See the [“Installation Activation”](/en/operation/License.md#активация-инсталляции) section for details.

## Industrial deployment {#промышленная-установка}

For multiple replicas, use `examples/on-prem-ru.yaml` as a base and verify the following:

- **Ingress allows large uploads and long-running requests.** The ingress-nginx chart sets this by default:

  ```yaml
  ingress:
    annotations:
      nginx.ingress.kubernetes.io/proxy-body-size: "50m"
      nginx.ingress.kubernetes.io/proxy-read-timeout: "86400"
      nginx.ingress.kubernetes.io/proxy-send-timeout: "86400"
  ```

  For a different controller, set similar limits. For Gateway API, see below.
- **PDB and HPA** (`podDisruptionBudget.enabled`, `autoscaling.enabled`): node updates will not terminate all pods at once.
- **Custom Gotenberg** in `storm.integrations.gotenbergUrl`; otherwise, documents printed to PDF are sent to a public service.
- **`storm.security.allowedOrigins`** — the application domain, not `*`.
- **Metrics**: `metrics.serviceMonitor.enabled: true`, if the cluster has Prometheus Operator.
- **Backups** of PostgreSQL and S3 on a schedule. The application pods do not contain data that needs to be persisted.
- **NetworkPolicy** (`networkPolicy.enabled`), if network policies are required by security standards — see below.

### NetworkPolicy {#networkpolicy}

The chart creates a NetworkPolicy for the application and `storm-des` if `networkPolicy.enabled` is enabled.
A CNI with network policy support (Calico, Cilium, etc.) is required. Policies are disabled by default.

**Inbound traffic.** The application accepts connections only on two ports:

| Port | Purpose | Allowed sources | Parameter |
| --- | --- | --- | --- |
| 8081 | Web interface and API for users | Ingress controller or Gateway | `networkPolicy.ingress.from` |
| 8082 | Actuator and Prometheus metrics | Prometheus | `networkPolicy.ingress.metricsFrom` |

An empty list allows traffic from any source, but only on these ports. `storm-des` accepts
requests only from application pods; the chart sets this rule automatically. If you restrict `ingress.from`,
`helm test` will fail: the test pod connects to the service directly. Kubelet health checks are usually not affected by network policies.

**Outbound traffic.** Not restricted by default. If you enable `networkPolicy.egress.enabled`,
only DNS and application requests to `storm-des` are allowed, and other destinations must be listed
in `networkPolicy.egress.extraRules`:

| Destination | Default port | Requirement |
| --- | --- | --- |
| PostgreSQL (primary and audit DB) | 5432 | Always (and for `storm-des`) |
| S3 storage | 443 or 9000 | Always |
| SMTP | 587 or 465 | If email is enabled |
| IdP (Keycloak, OIDC, ADFS) | 443 | If SSO login is used |
| Redis | 6379 | If more than one replica |
| Gotenberg | 3001 | For PDF export |
| PlantUML | 8090 | If used |
| Syslog / SIEM | 514 or 601 | If audit is sent to SIEM |
| LLM provider | 443 | If the AI module is enabled |

Example: allow users only from ingress-nginx and permit outbound traffic only to the database and S3.

```yaml
networkPolicy:
  enabled: true
  ingress:
    from:
      - namespaceSelector:
          matchLabels:
            kubernetes.io/metadata.name: ingress-nginx
    metricsFrom:
      - namespaceSelector:
          matchLabels:
            kubernetes.io/metadata.name: monitoring
  egress:
    enabled: true
    extraRules:
      - to:
          - ipBlock: { cidr: 10.10.0.15/32 }   # PostgreSQL
        ports:
          - { port: 5432, protocol: TCP }
      - to:
          - ipBlock: { cidr: 10.10.0.20/32 }   # S3
        ports:
          - { port: 443, protocol: TCP }
```

The application does not make direct requests to the internet, so egress rules to the internet are not required, except for an external LLM provider for the AI module.

### Gateway API instead of Ingress {#gateway-api-вместо-ingress}

If your cluster uses Gateway API (Envoy Gateway, Istio, Cilium, Traefik, NGINX Gateway Fabric, etc.) instead of an Ingress controller, disable `ingress` and enable `httpRoute`:

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

The TLS certificate, upload size limit (no less than 50 MB), and timeouts are configured on the Gateway or in your controller's policies.

After `helm install` and `helm upgrade`, the chart outputs hints and warnings about what is missing in your values. Read them.

## Trial installation on a laptop {#пробная-установка-на-ноутбуке}

To inspect the chart before deploying it to a production cluster, deploy everything in
[minikube](https://minikube.sigs.k8s.io/) along with test PostgreSQL and MinIO instances. You will need
Docker, approximately 8 GB of free memory, and access to `cr.selcloud.ru`.

::: warning For verification only
The passwords below are exposed, and the data is stored inside the pods and will be lost upon pod restart. This setup is not suitable for production use.
:::

1. Start the cluster and create a namespace with the registry secret:

   ```bash
   minikube start --cpus=4 --memory=12g --addons=ingress
   kubectl create namespace storm
   kubectl -n storm create secret docker-registry regcred \
     --docker-server=cr.selcloud.ru \
     --docker-username='<логин>' --docker-password='<пароль>'
   ```

2. Save the dependencies to `deps.yaml` and apply them using the `kubectl -n storm apply -f deps.yaml` command:

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

3. Save `values-local.yaml`:

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

4. Connect the repository as in step 1 of the installation, then install the chart and wait for it to be ready:

   ```bash
   kubectl -n storm wait --for=condition=available deploy --all --timeout=300s
   helm install storm stormbpmn/stormbpmn -n storm -f values-local.yaml
   kubectl -n storm rollout status deployment/storm-stormbpmn --timeout=10m
   helm test storm -n storm
   ```

5. Open the application:

   ```bash
   kubectl -n storm port-forward svc/storm-stormbpmn 8081:8081
   ```

   Then navigate to `http://127.0.0.1:8081/admin-onboarding` and activate the installation, as in step 5 of the installation.

To remove everything: `minikube delete`.

## Update {#обновление}

Before updating, back up PostgreSQL and S3 and read the warnings in the [Changelog](/en/Changelog/README.md).

```bash
helm repo update
helm upgrade storm stormbpmn/stormbpmn -n stormbpmn -f my-values.yaml
```

With two or more replicas, the update proceeds without downtime: the chart replaces pods one by one (`maxSurge: 1`, `maxUnavailable: 0`), and the first new pod applies the database migrations. With a single replica, there will be a brief pause while the new pod starts.

Rolling back the image is `helm rollback storm -n stormbpmn`. There are no reverse migrations: the previous version works with the updated schema, but if data was affected, restore the database from the backup taken before the update. For details, see
["Zero-Downtime Update" and "Version Rollback"](/en/operation/README.md#обновление-без-простоя).

If you are upgrading from chart 3.x (StormBPMN 6.6), first read `UPGRADING.md` in the chart. In 9.x, the required parameters have changed:

- `SESSION_EXPIRATION` is set in **seconds** (`storm.security.sessionExpirationSeconds`). The old
  value of `86400000` in milliseconds will prevent the application from starting.
- `JWTSECRET` must be at least 64 characters long.
- The license now uses the key `LICENSE_KEY_V2` (`storm.license.keyV2`).
- PostgreSQL requires pgvector.

## Simulation Module {#модуль-симуляции}

::: info Optional module
`storm-des` is required only for process simulations and works only if the simulation module is included in your
license key. Without it, Stormbpmn functions fully. By default, the module is disabled (`des.enabled: false`).
:::

If the license includes the simulation module, enable it in the same release:

```yaml
des:
  enabled: true
  resources:
    requests: { cpu: 2, memory: 14Gi }
    limits: { memory: 14Gi }
```

The chart automatically sets `storm-des` the same database, time zone, and image version as the application, and passes
`DES_BASE_URL` to the application. For more details about the module: [“Simulations”](/en/simulation/install.md).

## Closed Loop {#закрытыи-контур}

Transfer the images to the internal registry. The versions must match those of the chart:

```bash
V=<версия чарта>
for img in stormbpmn_fullstack_enterprise storm-des; do
  docker pull cr.selcloud.ru/stormbpmn-enterprise/$img:$V
  docker tag  cr.selcloud.ru/stormbpmn-enterprise/$img:$V harbor.company.local/stormbpmn/$img:$V
  docker push harbor.company.local/stormbpmn/$img:$V
done
```

Download the chart itself on a machine with internet access using the command `helm pull stormbpmn/stormbpmn --version $V` and install it from the file `.tgz`. Specify the registry as shown in the example `examples/airgap.yaml`. Before transferring, verify the image signatures as described in [Changelog → "Image Signature Verification"](/en/Changelog/README.md).

## If Something Went Wrong {#если-что-то-пошло-не-так}

| Symptom | Cause |
| --- | --- |
| `helm install` rejects `storm.jwt.secret` | Key is shorter than 64 characters |
| `helm install` rejects `sessionExpirationSeconds` | More than 90 days specified. Most likely, this is milliseconds |
| Pod is restarting, error `extension "vector"` in the log | pgvector is missing in PostgreSQL |
| Simulations fail with "DES node did not respond" | `storm-des` has a different time zone. It is common in the chart, check `des.extraEnv` |
| On first installation, error `relation "sm_background_tasks" does not exist` in log `storm-des` | `storm-des` started before the application created the tables. The error resolves itself a few seconds after the application starts |
| Pod in `ImagePullBackOff` with `pull access denied` | Secret `regcred` is not created in the release namespace or `imagePullSecrets` is not specified |
| Application pod in `CrashLoopBackOff` shortly after start | Insufficient memory: check `resources.limits.memory` and `storm.general.javaOpts` (`-Xmx` must be less than the limit) |
