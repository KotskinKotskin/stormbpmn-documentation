---
source_hash: 38be3352e2a2570f
---
# StormBPMN Enterprise Implementation Plan {#план-внедрения-stormbpmn-enterprise}

This article outlines the complete plan for implementing StormBPMN Enterprise on the customer's side: from license procurement to production launch. The plan is high-level — details for each step are available in the corresponding sections of the documentation.

[[toc]]

## Project Overview {#сводка-проекта}

StormBPMN Enterprise is a corporate on-premise platform for business process modeling in BPMN 2.0. For a full description of features and architecture, see [Architecture Diagram](/en/get-started.html).

The documentation describes 4 deployment levels (minimal, basic, corporate, full). **Recommendation for full implementation — "Full Configuration"** (11 components). Details — [System Requirements](/en/install/).

### Estimated Timelines {#ориентировочные-сроки}

| Phase | Duration | In Parallel With |
|------|-------------|---------------|
| Phase 0: Preparation | 2-3 weeks | — |
| Phase 1: Infrastructure | 1-2 weeks | — |
| Phase 2: Security | 1-2 weeks | Phase 3 |
| Phase 3: Monitoring | 1 week | Phase 2 |
| Phase 4: Business Configuration | 1 week | — |
| Phase 5: Integrations (optional) | On request | — |
| Phase 6: Backups and DR | 1 week | Phase 5 |
| Phase 7: Vendor Training + Go-Live | ~1 month | — |
| Phase 8: Post-Go-Live | Ongoing | — |
| **Total to Production Launch** | **~12-16 weeks** | |

---

## Key Roles on the Customer Side {#ключевые-роли-у-заказчика}

::: warning Important
Without the assignment of these roles, the implementation project is doomed to stall. The customer must designate specific individuals and formalize this with an order/directive before the project starts.
:::

### Mandatory Roles {#обязательные-роли}

| Role | Who | Purpose | Without them... |
|------|---------|-------------|-------------|
| **System Owner (Business)** | Department Director / CFO level executive | Makes decisions on scope, priorities, and budget. Responsible for adoption. Removes organizational blockers | No quorum for approvals, no one drives progress within the organization |
| **IT System Owner** | IT department head or designated team lead | Makes technical decisions (infrastructure, integrations, security). Allocates IT team resources. Escalation point for technical issues | Servers are not allocated, security is not approved, network access is not opened — the project stalls |

### Recommended Roles {#желательные-роли}

| Role | Who | Purpose |
|------|---------|-------------|
| **Client-side PM** | Dedicated project manager | Coordinates internal work, tracks tasks on the client side |
| **System Administrator** | IT department engineer | Actually deploys, configures, and updates the system. Point of contact for operations |
| **Security Administrator** | Information security department employee | Approvals, SIEM, audit, access management |
| **Methodologist / Business Analyst Lead** | Experienced analyst | Defines the modeling methodology, trains colleagues, leads the pilot |
| **Champions (ambassadors)** | 2-3 active users | Evangelists within the organization, first line of support |

### Antipatterns {#антипаттерны}

-   "The system owner is the IT director, but he is busy" — appoint a deputy with full authority
-   "We haven't decided who is responsible yet" — **STOP**, do not start the project
-   "One admin does everything" — bus factor = 1 risk, require at least two people

---

## Separation of Responsibilities {#разделение-зон-ответственности}

> The Storm team is the provider of licenses and software. The Customer performs the primary implementation work. The Storm team provides consultations and support.

**Notations in tables:**

-   **Customer** — entirely on the Customer's side
-   **Storm assists** — The Customer performs the work; the Storm team provides consultations / answers questions
-   **Storm + Customer** — joint work
-   **Storm team** — on the Storm side

### Phase 0: Preparation {#фаза-0-подготовка}

| Task | Who |
|--------|-----|
| Appoint the system owner and IT owner | Customer |
| Coordination with Information Security (requests, access matrices, all internal procedures) | Customer |
| Allocation of server resources | Customer |
| Obtaining SSL certificates | Customer |
| Reserving DNS names | Customer |
| Determining the type and quantity of licenses | Storm assists |
| Providing the license key | Storm team |
| Providing access to Docker images (registry token) | Storm team |
| Providing documentation | Storm team |

### Phase 1: Infrastructure and Installation {#фаза-1-инфраструктура-и-установка}

| Task | Who |
|--------|-----|
| OS, Docker, and network installation | Customer |
| Transfer of the image to the corporate Registry | Customer |
| Deployment of all components (PostgreSQL with pgvector/pg_trgm extensions and others — see [requirements](/en/install/README.md), MinIO, Redis, Nginx, etc.) | Customer (per documentation) |
| Starting StormBPMN, initial configuration | Customer (per documentation) |
| License activation (full activation code — Storm Team — v2 key) | Storm + Customer |
| Assistance with installation issues | Storm provides support |

### Phase 2: Security {#фаза-2-безопасность}

| Task | Who |
|--------|-----|
| Deployment and configuration of Keycloak / ADFS | Customer |
| Integration of Keycloak with AD | Customer |
| Configuration of OAuth2 ENV in StormBPMN | Customer (per documentation) |
| Security configuration (CORS, disabling simple auth, etc.) | Customer (per documentation) |
| Completion of the security checklist | Customer |
| Consultations on configuring OAuth2, Claims, truststore | Storm provides assistance |

### Phase 3: Monitoring and SIEM {#фаза-3-мониторинг-и-siem}

| Task | Who |
|--------|-----|
| Deploying Prometheus + Grafana | Customer |
| Configuring SIEM integration | Customer |
| Configuring alerts | Customer |
| Providing metrics and health check endpoints | Already in the product |

### Phase 4: Business Configuration {#фаза-4-бизнес-конфигурация}

| Task | Who |
|--------|-----|
| Admin panel configuration (commands, access rights, email) | Customer (per documentation) |
| Definition of the access model to diagrams | Customer |
| Best practices consulting | Storm assists |

### Phase 5: Integrations (Optional) {#фаза-5-интеграции-опционально}

| Task | Who |
|--------|-----|
| Development of synchronization scripts (org structure, architecture, BPM) | Customer |
| Documentation of the REST API | Already included in the documentation |
| Consultation on API usage | Storm provides assistance |

### Phase 6: Backups, DR {#фаза-6-бэкапы-dr}

| Task | Who |
|--------|-----|
| Configuring backups, DR, and update procedures | Customer (per documentation) |
| Publishing changelogs and notifying about breaking changes | Storm team |

### Phase 7: Training and Launch {#фаза-7-обучение-и-запуск}

| Task | Who |
|--------|-----|
| User training (program ~1 month) | Storm team conducts |
| Assign participants, provide access to staging | Customer |
| Prepare internal instructions (for own processes) | Customer |
| Pilot with vendor support | Storm + Customer |
| Production launch, distribution of instructions, internal support | Customer |
| Content Hub (BPMN course) in the product | Already in the product |

### Phase 8: Post-launch {#фаза-8-пост-запуск}

| Task | Who |
|--------|-----|
| Current operations and updates | Customer |
| Technical support (SLA Enterprise: response 16h) | Storm Team |
| New versions and features | Storm Team |

### Summary: Storm Command scope {#сводка-scope-команды-storm}

1.  **Licenses** — provides and activates keys
2.  **Images** — provides access to the Docker registry
3.  **Documentation** — keeps it up to date
4.  **Training** — provides user training (~1 month)
5.  **Technical Support** — answers questions and helps with issues (Enterprise SLA)
6.  **Consulting** — assists with configuration, integrations, and methodology
7.  **Updates** — releases new versions with a changelog

Everything else is the Customer's responsibility.

---

## Deployment Phases {#фазы-внедрения}

```
Закупка ──► Фаза 0        ──► Фаза 1          ──► Фаза 2+3      ──► Фаза 4
лицензий    Подготовка         Инфраструктура      Безопасность       Бизнес-
            Согласования       Базовая установка    Мониторинг         конфигурация
                                                                           │
                                                    Фаза 5 ──► Фаза 6 ──► Фаза 7 ──► Фаза 8
                                                    Интеграции  Бэкапы/DR  Обучение    Пост-запуск
                                                    (опц.)                 Запуск
```

---

## License Procurement (Pre-Project Start) {#закупка-лицензии-до-старта-проекта}

::: warning Important
This is the first step. Without a license and access to the images, there is no point in starting the rest.
:::

| # | Task | Who | Details |
|---|--------|-----|--------|
| L.1 | Determine license type | Storm + Customer | **Named** or **Concurrent** — see [Licensing](/en/operation/License.html) |
| L.2 | Determine number of licenses | Storm + Customer | Named: number of users + 1. Concurrent: peak load + 1 |
| L.3 | Agree on and sign the contract | Storm + Customer | Including the support contract (Enterprise SLA) |
| L.4 | Payment | Customer | — |
| L.5 | Provide access to Docker registry (token) | Storm Team | — |
| L.6 | Provide documentation | Storm Team | — |
| L.7 | Agree on budget for server resources | Customer | See [System Requirements](/en/install/) |

After installation, obtain the full activation code without truncation at `/admin-onboarding` and pass it to the manager. Set the received key in `LICENSE_KEY_V2` and restart the application. A separate key is required for production, each test environment, DR site, and clone. Existing installations may temporarily continue operating with an outdated `LICENSE_KEY` without immediate replacement; due to a known security limitation, plan their phased migration to v2.

---

## Phase 0: Preparation and Approvals {#фаза-0-подготовка-и-согласования}

### Security Approval {#согласование-с-иб}

**Owner**: Customer's Information Security Administrator + System IT Owner

| # | Task | Artifact |
|---|--------|----------|
| 0.1 | Request to deploy new software in the corporate network | Request in the IS form |
| 0.2 | Approval of architecture and component composition | [Architecture Diagram](/en/get-started.html) |
| 0.3 | Approval of network ports and protocols | Access matrix from [System Requirements](/en/install/) |
| 0.4 | Approval of the authentication method (Keycloak/ADFS/OAuth2) | [Security — OAuth2](/en/configure/security/) |
| 0.5 | Approval of data storage (PostgreSQL, MinIO) | IS card in the IS registry |
| 0.6 | Approval of SIEM integration (Syslog) | [Security — SIEM](/en/configure/security/) |
| 0.7 | Vulnerability scan of Docker images (Cosign signature) | Scanning report |
| 0.8 | Approval of disabling simple authentication | [IS Checklist](/en/configure/security/) |
| 0.9 | Approval of the backup policy | [Maintenance — Backup](/en/operation/) |
| 0.10 | Approval of AI feature usage (if planned, separate project) | IS risk assessment |
| 0.11 | Obtaining SSL certificates (wildcard or per-host) | Certificates + keys |

### DNS and Certificates {#dns-и-сертификаты}

Reserve the following DNS names:

| DNS Name | Purpose |
|---------|-----------|
| `bpmn.company.ru` | Main StormBPMN application |
| `auth.company.ru` | Keycloak (if separate) |
| `s3.company.ru` | MinIO Console (optional) |
| `grafana.company.ru` | Monitoring (optional) |

### Choosing a Deployment Environment {#выбор-среды-развертывания}

| Option | Pros | Cons |
|---------|-------|--------|
| Docker Compose | Simplicity, quick start | No orchestration, limited HA |
| Kubernetes | Scalability, HA, separation of FRONT/BACK | More complex configuration |
| Podman | Import substitution, rootless | Less market expertise |

---

## Phase 1: Infrastructure and Basic Installation {#фаза-1-инфраструктура-и-базовая-установка}

**Objective**: Deploy all components, start Stormbpmn, activate the license, and run a smoke test.

**Who does it**: The customer follows the documentation; the Storm team assists with any issues.

**Documentation**:
-   [System requirements and components](/en/install/)
-   [Quick start (scripted)](/en/install/quickstart/QUICKSTART_SCRIPT.html) or [manual](/en/install/quickstart/QUICKSTART_MANUAL.html)
-   [Production-ready installation](/en/install/production/)
-   [Configuration (ENV + admin panel)](/en/configure/)
-   [Licensing](/en/operation/License.html)

**Outcome**: The application is accessible via HTTPS, and the smoke test has passed (login, diagram creation, S3, PlantUML, PDF, collaborative editing).

---

## Phase 2: Security and IdP Integration {#фаза-2-безопасность-и-интеграция-с-idp}

**Objective**: Configure SSO (Keycloak/ADFS), disable simple authentication, and complete the security checklist.

**Who does it**: The Customer; the Storm team provides consulting on OAuth2.

**Documentation**: [Security](/en/configure/security/) — OAuth2, Keycloak, ADFS, Claims, CORS, custom SSL, checklist.

**Result**: Access is available only via SSO, and the security checklist from the documentation has been completed.

---

## Phase 3: Monitoring, Logging, SIEM {#фаза-3-мониторинг-логирование-siem}

**Objective**: Configure metrics collection, alerts, and audit logging in SIEM.

**Responsible party**: Customer.

**Documentation**:
-   [Monitoring (Prometheus, Grafana, health checks)](/en/operation/)
-   [SIEM / Syslog audit](/en/configure/security/)

**Outcome**: Metrics are collected, alerts are triggered, and audit events reach the SIEM.

---

## Phase 4: Business Logic Configuration {#фаза-4-конфигурация-бизнес-логики}

**Objective**: Configure commands, email, access rights, and custom menu.

**Who does it**: The Customer follows the documentation; the Storm team consults on best practices.

**Documentation**:
-   [Configuration (ENV + admin panel)](/en/configure/)
-   [Diagram access model](/en/recipes/Access_to_diagrams.html)

**Result**: Business settings are implemented, and the verification checklist from the documentation is passed.

---

## Phase 5: Integrations (optional) {#фаза-5-интеграции-опционально-1}

> Performed only upon the Customer's request, if there is a need to integrate with external systems.

**Who does it**: The Customer develops, the Storm Team consults on the API.

**Documentation**:
-   [REST API](/en/REST%20API/) — org structure, architectural elements, diagrams, metrics
-   [Recipe: Architectural registry](/en/recipes/ARC_REPO.html)

---

## Phase 6: Backups, DR, Updates {#фаза-6-бэкапы-dr-обновления}

**Goal**: Configure backup, test restore, define RPO/RTO, and master the version update procedure.

**Who does it**: The Customer, following the documentation.

**Documentation**:
-   [Maintenance (backups, restore, updates, DR)](/en/operation/)
-   [Changelog and critical migrations](/en/Changelog/)

**Result**: Backups are automated, restore is tested, the used license secrets (`LICENSE_KEY_V2` and the temporarily required `LICENSE_KEY`) are stored in a secure vault, and DR procedures include verification of the selected license mode and regular user access.

---

## Phase 7: Training and Launch {#фаза-7-обучение-и-запуск-1}

### Vendor-led training (delivered by the Storm Team) {#обучение-от-вендора-проводит-команда-storm}

> **Duration: ~1 month.** Training is delivered by the StormBPMN team. Format, schedule, and curriculum are agreed upon separately.

Indicative program:

| Block | Audience | Format |
|------|-----------|--------|
| Basic BPMN modeling | All users | Webinar / workshop |
| Process registry, approval, regulations | Analysts | Workshop |
| Architectural elements and org structure | Architects | Workshop |
| Collaborative editing, building blocks | Advanced users | Workshop |
| REST API and integrations | Customer developers | Workshop |
| Administration and operations | Admins, ops engineers | Workshop |

Additionally: BPMN course in Content Hub (built into the product, self-study).

### What the client must prepare {#что-должен-подготовить-заказчик}

-   Assign training participants for each block
-   Provide access to the staging environment for practice
-   Designate internal Champions/ambassadors (2-3 people)
-   Prepare internal instructions (for their own processes and org structure)

### Pilot Launch {#пилотныи-запуск}

| Task | Duration |
|--------|-------------|
| Select a pilot group (10-20 users) | — |
| Pilot operation with vendor support | 2-3 weeks |
| Collect feedback, fix issues | 2-3 days |

### Production Launch {#продуктивныи-запуск}

-   Bulk user migration (via SSO — automatically upon login)
-   Send instructions to all users
-   Set up an internal support channel (first line)
-   Monitor adoption metrics (DAU, number of diagrams)

### Go/No-Go criteria {#go-no-go-критерии}

-   All components are deployed and operational (smoke test passed)
-   SSO is integrated and tested
-   SIEM logging is operational and aligned with security requirements
-   Monitoring is configured, and alerts are triggering correctly
-   Backups are configured, and restoration has been tested
-   License is activated
-   The pilot group has completed testing without critical bugs
-   Training materials are prepared
-   DR procedures are documented and tested
-   StormBPMN support contact is confirmed

---

## Phase 8: Post-launch {#фаза-8-пост-запуск-1}

### Current Maintenance (Customer Responsibility) {#текущее-сопровождение-ответственность-заказчика}

| Task | Frequency |
|--------|---------|
| Updating StormBPMN versions (per [changelog](/en/Changelog/)) | As released |
| SSL certificate rotation | Before expiration |
| Test restore from backup | Monthly |
| SIEM log review | Weekly |
| License usage monitoring | Monthly |
| Keycloak updates | As patches are released |

---

## Capacity Allocation {#выделение-мощностеи}

For minimum and recommended requirements, see [System Requirements](/en/install/).

**Summary**: 16-24 vCPU, 20-34 GB RAM, 270-420 GB SSD for the full configuration.

### Deployment Options {#варианты-размещения}

| Option | Description | When |
|---------|----------|-------|
| Single server | 24 vCPU, 32 GB, 500 GB SSD | Up to 100 users |
| Two servers (App + DB) | App: 16/16 GB. DB: 8/16 GB, 500 GB | 100-200 users |
| Kubernetes cluster | 3+ nodes, auto-scaling | 200+ users |

### Environments {#среды}

| Environment | Purpose | Resources |
|-------|-----------|---------|
| Staging | Testing updates, integration testing | ~50% of production |
| Production | Primary operations | 100% |

::: tip Recommendation
A staging environment must be available for testing updates before production.
:::

---

## Project Team and RACI {#команда-проекта-и-raci}

### Customer-side roles {#роли-на-стороне-заказчика}

| Role | Description | Quantity |
|------|----------|--------|
| **Project PM** | Coordination, deadlines, risks | 1 |
| **System administrator** | Servers, Docker, network | 1-2 |
| **Security administrator** | Security, SIEM, access control | 1 |
| **DevOps engineer** | CI/CD, monitoring, automation | 1 |
| **Business analyst (lead)** | Methodology, training, pilot | 1 |
| **Integration developer** | REST API, synchronization scripts | 1 |
| **Storm team** | License, support, consulting, training | Vendor |

### RACI Matrix {#raci-матрица}

| Task | PM | SysAdmin | Security | DevOps | BA | Dev | Vendor |
|--------|:--:|:--------:|:--:|:------:|:--:|:---:|:------:|
| Security approval | A | C | R | I | I | I | C |
| Server allocation | A | R | I | C | I | I | C |
| Infrastructure installation | I | R | I | R | I | I | C |
| SSO configuration | I | R | A | C | I | I | C |
| SIEM configuration | I | C | R | C | I | I | C |
| Monitoring configuration | I | I | I | R | I | I | C |
| Business configuration | I | I | I | I | R | I | C |
| Integrations (API) | I | I | I | I | C | R | C |
| User training | I | I | I | I | C | I | R |
| Pilot and launch | A | C | C | C | R | C | C |
| Backups and DR | I | R | I | R | I | I | C |

---

## Risks and Mitigations {#риски-и-митигации}

| # | Risk | Prob. | Impact | Mitigation |
|---|------|---------|---------|-----------|
| 1 | Delay in security approval | High | High | Involve security team from day one, start before server procurement |
| 2 | Incompatibility with corporate AD | Medium | High | Keycloak as a proxy, testing on staging |
| 3 | Insufficient server resources | Low | Medium | 30% buffer, monitoring from day one |
| 4 | Issues during version updates | Medium | High | Staging environment, backup before each update |
| 5 | Low user adoption | Medium | High | Pilot, training, Champions, Content Hub |
| 6 | File loss (MinIO failure) | Low | Critical | Regular backups, disk monitoring |
| 7 | JWT secret leak | Low | Critical | 64+ characters, ENV not in UI, rotation |
| 8 | License lockout (expiration) | Low | Critical | Deadline monitoring, renew key in advance |
| 9 | Import substitution requirement (Docker — Podman) | Low | Medium | Podman/CRI-O support confirmed |

---

## Acceptance Criteria {#критерии-приемки}

The system is considered deployed when the **outcome of each phase** has been achieved and the Go/No-Go criteria have been passed before the production launch.


## How to measure implementation results {#как-измерять-результат-внедрения}

After launch, use the [“Storm Implementation Pulse”](./Adoption_pulse.md) recipe: SQL queries for audience, retention, user activity, and the live process model registry, with chart examples and BI dashboard configuration.
