---
order: 4
dir:
  text: 2. Installation
  order: 2
  link: true
index: true
source_hash: 18cc8ca6b8fd7bd1
---

[[toc]]

# Installation {#установка}

> 📦 **Deploying StormBPMN from scratch?** This is the place for you. Follow the steps in order: first **“Quick Start”**, then **“Production Installation”** — skipping stages is not allowed.

Stormbpmn is provided as a Docker container from a private registry, which includes both the frontend and backend. Installation involves correctly specifying environment variables, deploying adjacent containers (if necessary), and configuring the system in the administrative interface.

::: tip Access to the registry
The container is located in a private registry. Request access through the manager you are working with.
The current container version is listed in the Changelog section of this documentation.
:::

::: tip 2 installation stages
The menu on the left outlines two stages: “Quick Start” and “Production-ready”. They must be performed sequentially; skipping is not allowed.
:::

::: tip Kubernetes
For Kubernetes, there is an official Helm chart, and its version matches the StormBPMN version: [“Installation in Kubernetes (Helm)”](./kubernetes.md).
:::

::: warning Using corporate services
**Recommendation:** If your organization has centralized infrastructure services, use them:

-   **DBaaS** (Database as a Service) instead of deploying PostgreSQL independently
-   **S3aaS** or a corporate file storage instead of MinIO
-   **Managed SMTP** instead of your own mail server
-   **Corporate SSO/SAML** instead of Keycloak
-   **Centralized monitoring** (Prometheus/Grafana) instead of local

This will simplify deployment, ensure better support, and comply with corporate security standards.
:::

## System Requirements {#системные-требования}

### General Minimum Requirements for the Entire System {#общие-минимальные-требования-для-всеи-системы}

| Component         | CPU         | RAM       | Disk       | Note                     |
| ----------------- | ----------- | --------- | ---------- | ------------------------ |
| **General Resources** | **12 vCPU** | **24 GB** | **300 GB** | Minimum for the full system |
| **Recommended**   | **16 vCPU** | **32 GB** | **500 GB** | For stable operation     |
| **Production**    | **24 vCPU** | **32 GB** | **500 GB** | For high load            |

The values above are for the full system with all services, including monitoring and Keycloak. If
PostgreSQL, S3, SSO, and email are corporate, resources are required only for the application — see
["Deployment Configurations"](#конфигурации-развертывания).

### User Count Reference {#ориентир-по-числу-пользователеи}

The load profile is interactive work in the browser: opening and saving process models, searching, and viewing the registry. The load is determined by the number of people working simultaneously, not the number of user accounts. The values below are a reference for the application and database without the simulations module; target metrics should be verified during acceptance testing on your infrastructure.

| Users | StormBPMN Application | PostgreSQL | PostgreSQL Disk |
| --- | --- | --- | --- |
| **up to 50** | 1 instance, 4 vCPU, 8 GB | 2 vCPU, 4 GB | SSD, 50–100 GB |
| **50–300** | 1–2 instances of 4 vCPU, 8 GB | 4 vCPU, 8 GB | SSD, 100–200 GB |
| **more than 300** | 2 or more instances of 4–8 vCPU, 8–16 GB, Redis | 4–8 vCPU, 16 GB | SSD, from 200 GB |

-   **Disks.** PostgreSQL requires an SSD: the database handles short transactions when opening and saving process models, and disk latency is directly visible to users. The reference is at least 1,000 IOPS and latency up to 5 ms; this is provided by any server SSD or cloud provider SSD disk. The database size grows primarily due to the history of process model versions.
-   **Files.** Attachments, images, and exports are stored in S3. Storage volume depends on how many files are attached to processes; 50–100 GB is sufficient to start.
-   **Simulations module** adds 4 vCPU and 16 GB regardless of the number of users.

### Container Requirements {#требования-по-контеинерам}

#### Core Components (Mandatory) {#основные-компоненты-обязательные}

| Container      | CPU    | RAM  | Disk   | Ports          | Description               |
| -------------- | ------ | ---- | ------ | -------------- | ---------------------- |
| **StormBPMN**  | 4 vCPU | 8 GB | 20 GB  | 8080,8081,8082 | Main application    |
| **PostgreSQL** | 2 vCPU | 4 GB | 100 GB | 5432           | Database            |
| **Nginx**      | 1 vCPU | 1 GB | 5 GB   | 80, 443        | Load balancer |

#### Storage and Files {#хранилище-и-фаилы}

| Container | CPU    | RAM  | Disk   | Ports      | Description                                 |
| --------- | ------ | ---- | ------ | ---------- | ---------------------------------------- |
| **MinIO** | 1 vCPU | 2 GB | 100 GB | 9000, 9001 | S3-compatible storage (API + Console) |

#### Authentication and Security {#авторизация-и-безопасность}

| Container       | CPU      | RAM    | Disk  | Ports        | Description            |
| --------------- | -------- | ------ | ----- | ------------ | ------------------- |
| **Keycloak**    | 2 vCPU   | 3 GB   | 10 GB | 8180         | Authentication system |
| **SMTP Server** | 0.5 vCPU | 512 MB | 5 GB  | 25, 587, 465 | Mail server     |

#### Monitoring (Optional) {#мониторинг-опционально}

| Container      | CPU      | RAM  | Disk  | Ports | Description            |
| -------------- | -------- | ---- | ----- | ----- | ------------------- |
| **Prometheus** | 1 vCPU   | 2 GB | 50 GB | 9090  | Metrics collection         |
| **Grafana**    | 0.5 vCPU | 1 GB | 5 GB  | 3000  | Metrics visualization |

#### Collaborative Editing (Optional) {#совместное-редактирование-опционально}

| Container | CPU      | RAM    | Disk | Ports | Description                                          |
| --------- | -------- | ------ | ---- | ----- | ------------------------------------------------- |
| **Redis** | 0.5 vCPU | 512 MB | 1 GB | 6379  | Pub/Sub and collaborative editing sessions        |

::: tip When is Redis required?
Redis is **required** when deploying multiple instances of StormBPMN (multi-instance / HA). For a single instance, data is stored in the application memory, and Redis is not required.
:::

#### Additional Services (Optional) {#дополнительные-сервисы-опционально}

| Container     | CPU      | RAM  | Disk | Ports | Description           |
| ------------- | -------- | ---- | ---- | ----- | ------------------ |
| **ListMonk**  | 0.5 vCPU | 1 GB | 5 GB | 9000  | Mailing system   |
| **PlantUML**  | 0.5 vCPU | 1 GB | 2 GB | 8090  | Diagram generation |
| **Gotenberg** | 1 vCPU   | 2 GB | 5 GB | 3001  | PDF conversion  |

#### Simulation Module (Separate License) {#модуль-симуляции-отдельная-лицензия}

| Container     | CPU    | RAM   | Disk  | Ports             | Description                                                        |
| ------------- | ------ | ----- | ----- | ----------------- | --------------------------------------------------------------- |
| **Storm DES** | 4 vCPU | 16 GB | 20 GB | 8081 (internal) | Process simulation engine — see the [“Simulations”](/en/simulation/) section |

### PostgreSQL Requirements: Extensions and Encoding {#требования-к-postgresql-расширения-и-кодировка}

**PostgreSQL 14 or later** is required for the main and audit databases; we recommend **16–17** for new installations. On PostgreSQL 13 and earlier, the application stops before migrations are executed.

StormBPMN uses several PostgreSQL extensions. Before installation, ensure they are **available in your database build** and that the database is created with **UTF8** encoding.

| Extension / Parameter | Purpose | Requirement |
|---|---|---|
| **UTF8** Encoding | Correct text storage, ICU collation, and natural sorting of names | Mandatory |
| **pgvector** (`vector`) | Fast universal (semantic) search across the platform; also used by the AI chat knowledge base. Required for **all** installations, not just those with the AI module | Mandatory (see warning below) |
| **pg_trgm** | User autocomplete and search by partial name/email (trigrams) | Mandatory for autocomplete |
| **pgcrypto** | Cryptographic functions | Mandatory |
| **uuid-ossp** | UUID generation | Mandatory |
| **hstore** | Key-value storage for the vector search engine | Mandatory |

**What is created automatically vs. manually:**

- Extensions `vector`, `uuid-ossp`, `hstore`, and `pgcrypto` are created by migrations on the first run (`CREATE EXTENSION IF NOT EXISTS …`) — **provided** that the corresponding packages are installed in the PostgreSQL build and the database user has the privilege to create extensions (superuser or a role with the necessary privileges).
- The **`pg_trgm`** extension is **not created** by the application. If it is missing, the autocomplete index migrations are **silently skipped**, and user search by partial name/email will not work. Create it in advance.

::: warning The official postgres image does not include pgvector
The standard image `postgres:17` includes contrib modules (`pg_trgm`, `pgcrypto`, `uuid-ossp`, `hstore`) but **does not include pgvector**. For self-managed deployments, use the **`pgvector/pgvector:pg17`** image — this is the same PostgreSQL with all standard modules plus pgvector. For managed databases (DBaaS), ensure in advance that the provider offers the `pgvector` extension and that the user has the privilege to create it.
:::

::: tip The pgvector image is available from our registry
If external registries (Docker Hub) are blocked, you do not need to pull `pgvector/pgvector:pg17` from an external source — we mirror the official image to our private registry and **sign it with the same Cosign signature** as the main StormBPMN image. It is available using the **same** credentials `cr.selcloud.ru`:

```bash
docker pull cr.selcloud.ru/stormbpmn-enterprise/pgvector:pg17
```

Transferring to your corporate registry follows the same steps as for the main image (see [Quick Start](/en/install/quickstart/QUICKSTART_MANUAL.md)). Signature verification is the same as for the main image (see [Changelog → “Image Signature Verification (Cosign)”](/en/Changelog/README.md)).
:::

::: tip Full set with a single command
If you are installing extensions manually — execute the following in the **application database** as a superuser:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS hstore;
```
:::

### Deployment Configurations {#конфигурации-развертывания}

#### Minimal Configuration (for testing) {#минимальная-конфигурация-для-тестирования}

```yaml
# Только основные компоненты
StormBPMN + PostgreSQL + Nginx
Итого: 7 vCPU, 13 GB RAM, 125 GB диск
```

#### Basic Configuration (for operation) {#базовая-конфигурация-для-работы}

```yaml
# Основные + авторизация + хранилище
StormBPMN + PostgreSQL + Nginx + MinIO + Keycloak + SMTP
Итого: 10.5 vCPU, 18.5 GB RAM, 240 GB диск
```

#### Corporate Configuration (with centralized services) {#корпоративная-конфигурация-с-централизованными-сервисами}

```yaml
# Только StormBPMN + внешние корпоративные сервисы
StormBPMN + Nginx + интеграция с:
    - DBaaS (внешний PostgreSQL)
    - S3aaS (внешнее хранилище)
    - Corporate SSO (внешняя авторизация)
    - Managed SMTP (внешняя почта)

Итого: 5 vCPU, 9 GB RAM, 25 GB диск
```

#### Full Configuration (Production) {#полная-конфигурация-production}

```yaml
# Все компоненты включая мониторинг
Все контейнеры из таблиц выше
Итого: 13 vCPU, 23.5 GB RAM, 307 GB диск
```

### Operating System Requirements {#требования-к-операционнои-системе}

#### Supported OS: {#поддерживаемые-ос}

Any OS where Docker runs, for example (not limited to):
-   **Ubuntu**: 20.04 LTS, 22.04 LTS, 24.04 LTS
-   **CentOS**: 8+, Stream 9
-   **RHEL**: 8+, 9+
-   **Debian**: 11+, 12+
-   **Amazon Linux**: 2, 2023

#### Russian OS: {#россииские-ос}

-   **Astra Linux**: 1.7+, 1.8 (SE, CE)
-   **ALT Linux**: 10+, Simply Linux
-   **RED OS**: 7.3+, 8
-   **ROSA Linux**: 12+
-   Any other Russian OS with Docker or Podman support

::: tip Containerization Import Substitution
To meet the requirements of the registry of domestic software, **Podman** can be used instead of Docker — an OCI-compatible alternative included in the registry of Russian software. For details, see the [Docker Alternatives](#альтернативы-docker-импортозамещение) section.
:::

### Disk Recommendations {#рекомендации-по-дискам}

| Data Type     | Recommended Disk Type | Note                                |
| -------------- | ----------------------- | ----------------------------------------- |
| **PostgreSQL** | SSD                     | Critical for performance           |
| **MinIO/S3**   | SSD or HDD             | Depends on file operation intensity |
| **Logs**       | HDD                     |                                           |
| **Applications** | HDD                     |                                           |

### Network requirements {#сетевые-требования}

#### Throughput: {#пропускная-способность}

-   **Minimum**: 100 Mbps
-   **Recommended**: 1 Gbps
-   **Production**: 10 Gbps (for high load)

#### Latency: {#latency}

-   **Between components**: < 1ms (within the same network)
-   **To users**: < 100ms
-   **To external APIs**: < 500ms

## Network Requirements {#сетевые-требования-1}

### Required ports {#обязательные-порты}

| Service        | Port             | Protocol   | Purpose                     |
| -------------- | ---------------- | ---------- | --------------------------- |
| **StormBPMN**  | 8080, 8081, 8082 | HTTP/HTTPS | Main web application        |
| **PostgreSQL** | 5432             | TCP        | Database                    |
| **Nginx**      | 80, 443          | HTTP/HTTPS | Load balancer, SSL termination |
| **MinIO**      | 9000, 9001       | HTTP/HTTPS | S3 API + web console        |

### Additional ports (optional) {#дополнительные-порты-опционально}

| Service        | Port         | Protocol   | Purpose                                   |
| -------------- | ------------ | ---------- | ----------------------------------------- |
| **Keycloak**   | 8180         | HTTP/HTTPS | Authorization system                      |
| **SMTP**       | 25, 587, 465 | SMTP/SMTPS | Mail server                               |
| **Redis**      | 6379         | TCP        | Collaborative editing (multi-instance)    |
| **Prometheus** | 9090         | HTTP       | Metrics collection                        |
| **Grafana**    | 3000         | HTTP       | Metrics visualization                     |
| **ListMonk**   | 9000         | HTTP       | Mailing system                            |
| **PlantUML**   | 8090         | HTTP       | Diagram generation                        |
| **Gotenberg**  | 3001         | HTTP       | PDF conversion                            |

### External Connections {#внешние-соединения}

-   **SMTP server**: port 587/465 (for notifications)
-   **LDAP/AD**: port 389/636 (for authentication)

### Offline operation (closed environment) {#работа-без-интернета-закрытыи-контур}

The application does not require internet access: it does not make requests to external networks, and the license is verified locally, without a licensing server (see ["How licenses work"](/en/operation/License.md)).
Internet access is only required if you enable one of the following features:

| Feature | External dependency | How to operate without internet |
| --- | --- | --- |
| Image loading during installation and updates | Registry `cr.selcloud.ru` | Download images on a machine with internet access and transfer them to the internal registry — see [Quick start](/en/install/quickstart/QUICKSTART_MANUAL.md) and [Kubernetes → Closed environment](./kubernetes.md#закрытыи-контур) |
| PDF export | Public `demo.gotenberg.dev`, if `GOTENBERG_URL` is not specified | Deploy your own Gotenberg instance and specify its address |
| AI module | External LLM provider | Connect a model deployed within the closed environment — see [AI module](/en/ai/) |
| Captcha on the login form | Yandex SmartCaptcha | Disabled by default; do not enable it in a closed environment — see [Configuration](/en/configure/README.md) |

## DNS Names and Certificates {#dns-имена-и-сертификаты}

### DNS Planning {#планирование-dns}

#### Required Records: {#обязательные-записи}

-   **stormbpmn.company.com** - main application domain. Must point to 8081
-   **stormbpmn-api.company.com** - API endpoints (optional). Must point to 8082

## Docker Alternatives (Import Substitution) {#альтернативы-docker-импортозамещение}

StormBPMN is provided as **OCI-compatible container images**, which allows the use of alternative containerization tools instead of Docker.

### Podman (recommended for import substitution) {#podman-рекомендуется-для-импортозамещения}

**Podman** is a fully Docker-compatible alternative that is included in the Russian software registry. Podman commands are identical to Docker commands.

#### Installation on Astra Linux / ALT Linux / RED OS {#установка-на-astra-linux-alt-linux-ред-ос}

```bash
# Astra Linux 1.8
sudo apt install podman podman-compose

# ALT Linux
sudo apt-get install podman podman-compose

# РЕД ОС
sudo dnf install podman podman-compose
```

#### Usage {#использование}

```bash
# Вместо docker используйте podman
podman pull cr.stormbpmn.com/stormbpmn:latest
podman run -d --name stormbpmn ...

# Вместо docker-compose используйте podman-compose
podman-compose up -d
```

::: tip Command compatibility
For convenience, you can create an alias: `alias docker=podman`
:::

### CRI-O (for Kubernetes) {#cri-o-для-kubernetes}

When deploying to Kubernetes, you can use **CRI-O** — a lightweight container runtime that is fully compatible with OCI images.

### Containerd {#containerd}

**Containerd** is a low-level runtime used in Kubernetes and compatible with all StormBPMN OCI images.

::: warning Important
Regardless of the containerization tool chosen, StormBPMN OCI images work identically. All instructions with `docker` in the documentation apply to `podman` without changes.
:::
