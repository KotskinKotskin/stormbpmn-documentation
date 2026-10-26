---
title: System Design and NFT
order: 5
source_hash: 8314fd6fa83bf20d
---

[[toc]]

# System Design and Non-Functional Requirements {#системныи-дизаин-и-нефункциональные-требования}

This page compiles information typically recorded in an application card within an internal wiki:
what the solution consists of, how it is deployed, what data it processes, and what requirements
it imposes on operations.

::: warning Some values are provided by the customer
Metrics that depend on your installation — size, target RTO and RPO, data classification,
number of users — are marked as “defined by the customer.” For each, the source of the
initial data is specified.
:::

## System Design Card {#карточка-системного-дизаина}

| Category | Decision |
| --- | --- |
| Deployment Model | On-premise or private cloud on the customer's infrastructure. Delivery — container image from the supplier's registry with a Cosign signature |
| Non-Production Environments | A separate stand is recommended for update verification; stand licensing is agreed upon with the supplier |
| Operating System | Any OS with container support. Verified on Ubuntu, Debian, RHEL-compatible, Astra Linux, ALT Linux, RED OS. Runtime environment — Docker, Podman, CRI-O, containerd |
| Special Platforms | Not required. Kubernetes is supported but not mandatory: a single application instance is sufficient for most installations |
| Database Software | PostgreSQL 14 or newer (16–17 recommended), UTF8 encoding, extensions `vector` (pgvector), `pg_trgm`, `pgcrypto`, `uuid-ossp`, `hstore`. A managed database from a provider is acceptable if the extensions are available |
| Object Storage | Any S3-compatible storage: MinIO, SeaweedFS, provider-managed S3 |
| Encryption | Transport — TLS at the load balancer and to external services. Data at rest — using the customer's database, storage, and disk subsystem mechanisms. Passwords for built-in accounts are stored as hashes, session tokens are signed with the HS512 algorithm using a key `JWTSECRET` of at least 64 characters in length |
| Installation Size | Minimum 12 vCPU, 24 GB RAM, 300 GB disk for the entire system; recommended configuration — 16 vCPU, 32 GB, 500 GB. Breakdown by containers — [System Requirements](/en/install/README.md#системные-требования) |
| Application Availability | Web interface via HTTPS through a corporate load balancer. No separate client is installed. There is no mobile application; the interface is adapted for tablets-optimized |
| Authentication | OAuth2 / OIDC (PKCE mode recommended), Microsoft ADFS, Keycloak. Built-in login and password authentication is disabled in production. LDAP — deprecated method |
| Authorization | Role model: team member rights, privilege groups, access rules for folders and wiki pages, personal access to process models. See [Role Model](./roles-raci.md) |
| Integrations | Outgoing: PostgreSQL, S3, SMTP, IdP, and if used, Redis, PlantUML, Gotenberg, ListMonk, LLM provider. Incoming: REST API with a team key. Event export to SIEM via syslog, metrics for Prometheus |
| Application Logging | Application log to the container's standard output, collection — using containerization platform tools |
| Application Monitoring | Metrics in Prometheus format at endpoint `/actuator`, health checks; visualization and alerts — Grafana |
| Performance Management | No separate APM agent is provided; application and database metrics are used for performance assessment |
| Development Tool | Server-side — Kotlin and Spring Boot on Java 21, client-side — Vue 3 and TypeScript |
| Data Storage | All platform data — in the customer's database, files — in their object storage. There are no built-in automatic data deletion policies: the retention period is determined by the customer's regulations and is ensured by backup and manual deletion |

## Processed Data {#обрабатываемые-данные}

| Data Category | Composition | Note |
| --- | --- | --- |
| User credentials | Email address, last name, first name, patronymic, position, interface language, avatar, creation date, and last login date | Populated from the corporate directory or by the user. Passwords are stored only when built-in authentication is enabled |
| Working materials | Process models, process cards, descriptions, comments, nested files | Content is determined by the organization and may contain restricted-access information |
| Organizational data | Departments, positions, employees, roles | Populated by the organization; may contain employee personal data |
| Technical logs | Event timestamp, user and session identifier, request method and path, response code, client address | Forwarded to the selected audit channel |

::: tip The data classification is determined by the customer
The system does not define the confidentiality level: it depends on the processes you describe within it. For the application card, specify the category according to your internal methodology and list the categories of personal data subjects — typically, these are organization employees, and when describing external interactions, also counterparty representatives.
:::

## Non-Functional Requirements {#нефункциональные-требования}

| Requirement | Value |
| --- | --- |
| Availability | Defined by the customer. The application does not have a built-in cluster: the standard installation is a single instance, with fault tolerance provided by virtualization and backup solutions. Multiple instances require Redis |
| Planned Unavailability | Version update — stopping and starting the container, typically up to 15 minutes. Database migrations are performed at startup |
| RTO (Recovery Time Objective) | Defined by the customer. Recovery involves deploying the container and restoring the database and object storage from backups |
| RPO (Recovery Point Objective) | Defined by the customer and equal to the backup interval. Recommended schedule — daily full backup of the database |
| Number of Users | Defined by the license: named seats or concurrent sessions. See [How Licenses Work](/en/operation/License.md) |
| Number of Operations | Defined by the customer. Load profile — interactive work in the browser: opening and saving process models, search, reading the registry |
| Performance | Key operations — opening a process model, saving changes, searching materials, building registry views. Target values are fixed during acceptance testing on the customer's infrastructure |
| Scalability | Vertical — by increasing application and database resources. Horizontal — by multiple application instances behind a load balancer with shared database, object storage, and Redis |
| Compatibility | Modern Chromium-based, Firefox, and Safari browsers |
| Localization | Interface in Russian and English |

## Maintenance and Support {#обслуживание-и-поддержка}

| Requirement | Value |
| --- | --- |
| Planned Maintenance | Updating the application version as releases are issued; updating and maintaining the database, object storage, and OS according to the customer's procedures |
| Update | Replacing the container image with a new version and restarting it. The procedure and warnings for critical updates are in the [Changelog](/en/Changelog/README.md) and the [Maintenance](/en/operation/README.md#обновление-версии) section |
| Condition-Based Maintenance | Responding to events: database and object storage disk space exhaustion, increased response time, health check errors, failed backups |
| Backup | PostgreSQL database, object storage contents, configuration files, and environment variables. A daily database backup and a weekly storage backup with success verification are recommended |
| Recovery | Recovery and verification procedure — [Maintenance](/en/operation/README.md#восстановление-из-резервнои-копии) |
| Monitoring | Prometheus metrics, health checks, Grafana alerts. The recommended minimum set of alerts includes application unavailability, backup errors, and disk space exhaustion |
| Vendor Support | Contact **help@stormbpmn.com**; response mode and timeframes are defined by the contract. See [Technical Support](/en/support/README.md) |
| Customer Responsibility | Infrastructure, OS and its updates, database, object storage, certificates, backups, IdP integration, and user permissions within teams |

## Service Accounts {#сервисные-учетные-записи}

The system does not require service accounts in the customer's domain. Below are the technical access credentials that must be created during deployment.

| Account | Target Resource | Permissions |
| --- | --- | --- |
| Application database user | PostgreSQL | Full permissions on the application schema. On first startup, the ability to create extensions is required, or the extensions must be created in advance by the database administrator |
| Object storage access key | S3-compatible storage | Read, write, and delete objects in the dedicated bucket |
| Email sender account | SMTP server | Sending emails from the system address |
| Application client in IdP | Corporate IdP | Confidential OAuth2 client with scopes `openid profile email` |
| Container registry account | Vendor registry | Uploading images for subsequent transfer to the internal registry |
| Team API key | StormBPMN | External system access to the REST API within the scope of team permissions |

## Limitations {#ограничения}

- **Licensing.** The number of users is limited by the license: named seats or concurrent sessions. When seats are exhausted, new accounts transition to the "Pending activation" state.
- **Technological.** PostgreSQL with the listed extensions and an S3-compatible storage are mandatory. The official PostgreSQL image does not include pgvector — a build with this extension is used.
- **Functional.** The system describes and approves processes but does not execute them; the scope of the solution is listed in the [functional requirements catalog](./functional-requirements.md#границы-решения).
- **Operational.** There is no built-in high-availability cluster: fault tolerance is provided by the customer's infrastructure.
- **Network.** The system does not initiate requests to the internet. Exceptions are enabled by the customer intentionally: an external LLM provider when using the AI module and pulling images from the vendor's registry during updates.
- **Geographical.** There are no restrictions on the deployment region: all components operate within the customer's perimeter.

## Related sections {#связанные-разделы}

- [Architecture diagram](/en/get-started.md) — component composition and interactions
- [Installation](/en/install/README.md) — system requirements, ports, deployment configurations
- [Information security](/en/configure/security/README.md) — security parameters and checklist
- [Audit logging](/en/configure/security/audit-logging.md) — event composition and channels
- [Maintenance](/en/operation/README.md) — updates, backups, disaster recovery
- [Implementation plan](/en/recipes/Implementation_plan.md) — project phases and responsibility zones
