---
dir:
  name: 1. Architecture diagram
  order: 1
  link: true
index: true

order: 1
source_hash: b3dee0cfe62ff6f4
---

# 1. Architecture Diagram {#_1-схема-архитектуры}

If all system capabilities are utilized, the component architecture will look as follows [link.](https://stormbpmn.com/app/plant/f3af4a00-b1dd-4666-ad10-82f89705c74e)

## StormBPMN Architecture {#архитектура-stormbpmn}

### Core Component {#основнои-компонент}

-   **StormBPMN Application**  
    The central web application provided by the StormBPMN team. Responsible for modeling, storing, and managing business processes.

---

### Infrastructure Used (on the Customer's Side) {#используемая-инфраструктура-на-стороне-заказчика}

#### Infrastructure Components {#инфраструктурные-компоненты}

| Component                                             | Purpose                                 |
| ----------------------------------------------------- | ------------------------------------------ |
| **Load Balancer (nginx recommended)**        | Provides HTTPS, traffic distribution  |
| **Database (PostgreSQL 14+)**                      | Storage of all information. We recommend PostgreSQL **16–17**. Encoding **UTF8** + extensions **pgvector**, **pg_trgm**, **pgcrypto**, **uuid-ossp**, **hstore** — see [requirements](/en/install/README.md) |
| **File Storage (MinIO or any S3-compatible)** | Storage of documents, previews, attachments      |
| **SMTP Server (internal)**                          | Email sending                             |
| **Keycloak / OAuth2 / LDAP**                          | Used for user authorization |
| **Log Collector (e.g., Syslog)**                  | Collection of security logs                    |
| **Prometheus**                                        | Collection of metrics                                |
| **Grafana**                                           | Visualization of metrics, alerts                |

::: warning Deprecated Login Methods
**LDAP** and direct (built-in) integration with Keycloak are deprecated and not recommended for new installations. Use **OAuth2**: Keycloak, Azure AD, ADFS, and other providers are connected via this method, see [Authorization System](/en/configure/security/authorization.md). LDAP configuration instructions are provided through the account manager.
:::

---

### External open-source solutions {#внешние-open-source-решения}

| Component     | Purpose                                          |
| ------------- | --------------------------------------------------- |
| **ListMonk**  | Used for complex email generation and distribution |
| **PlantUML**  | UML diagram generation                              |
| **Gotenberg** | Conversion of images and HTML to PDF                |

---

### System Users {#пользователи-системы}

| Type                  | Description                                      |
| -------------------- | --------------------------------------------- |
| **User**             | Working with processes and templates               |
| **Administrator**    | Configuring applications, systems, and metrics          |
| **Security Administrator** | Configuring logging and security controls |

---

### Core Interactions {#основные-взаимодеиствия}

-   Users and administrators interact with the system via a load balancer over HTTPS.
-   Application `stormbpmn`:

    -   stores data in PostgreSQL;
    -   sends and receives files through an S3-compatible storage;
    -   sends emails via SMTP (or via ListMonk for complex generation);
    -   connects to authorization systems: Keycloak, OAuth, LDAP;
    -   generates diagrams via PlantUML and PDF documents via Gotenberg;
    -   sends logs to Log Collector;
    -   exposes Prometheus metrics.

-   Prometheus collects metrics from the application.
-   Grafana displays metrics and configures alerts.

---

### Security {#безопасность}

-   All external connections are secured via HTTPS.
-   SSH connections are available for administrators and information security personnel.
-   Legacy LDAP is isolated as a component and is not recommended for use.
