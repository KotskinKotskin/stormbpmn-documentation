---
title: 'Monitoring, hardening, backup'
order: 3
source_hash: 6ef03e9113ea544f
---

[[toc]]

# Monitoring, hardening, and backup {#мониторинг-хардендинг-и-резервное-копирование}

Operational post-configuration of a production installation. Application and external service installation is covered in the [overview](./README.md) and [External services](./components.md).

## Monitoring and Metrics {#мониторинг-и-метрики}

Stormbpmn provides metrics in Prometheus format for monitoring system status.

::: tip Monitoring is an optional component
Prometheus and Grafana are listed as the recommended solution but **are not mandatory**. You can use any monitoring system compatible with the Prometheus metrics format or your existing corporate monitoring infrastructure.
:::

### Option 1: Prometheus + Grafana (recommended) {#вариант-1-prometheus-grafana-рекомендуемыи}

```bash
# docker-compose.yml для мониторинга
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
```

### Option 2: Alternative Monitoring Systems {#вариант-2-альтернативные-системы-мониторинга}

StormBPMN is compatible with any systems that support collecting metrics in Prometheus format:

| System | Description | Note |
|---------|----------|------------|
| **Glaber** | Zabbix fork with Prometheus support | Suitable for import substitution |
| **Zabbix** | With prometheus-exporter | Corporate standard |
| **VictoriaMetrics** | High-performance Prometheus alternative | For high loads |
| **InfluxDB + Telegraf** | Time-series database with collection agent | Universal solution |

#### Configuration for Glaber / Zabbix {#настроика-для-glaber-zabbix}

StormBPMN exports metrics at endpoint `/actuator/prometheus`. To connect:

1. Configure a scrape task for the URL: `http://stormbpmn-host:8082/actuator/prometheus`
2. Collection interval: 15-30 seconds recommended
3. Metrics include: JVM, HTTP requests, application business metrics

::: tip Corporate Monitoring
If the organization already has a centralized monitoring system (Zabbix, Glaber, Nagios, etc.), it is recommended to integrate with it rather than deploying a separate Prometheus.
:::

::: tip Detailed Instructions
A detailed guide on configuring monitoring: [Monitoring and Support](/en/support/README.md)
:::

---

---

## Security and Hardening {#безопасность-и-хардендинг}

### Mandatory security measures {#обязательные-меры-безопасности}

1. **SSL/TLS** - all communication only over HTTPS
2. **Strong passwords** - for all service accounts
3. **Network isolation** - database in a private network
4. **Regular updates** - OS and containers


### Audit Logging {#аудит-логирование}

StormBPMN allows you to maintain a log of all user actions, with delivery to the console, to an external SIEM via Syslog, or to a dedicated TimescaleDB database.

::: tip Detailed instructions
Configuration and audit channels: [Audit Logging](/en/configure/security/audit-logging.md)
:::

---

---

## Backup {#резервное-копирование}

### What to back up {#что-необходимо-резервировать}

-   **PostgreSQL database** - all application data
-   **S3 storage** - files and documents
-   **Configuration files** - settings and environment variables

### Recommended Schedule {#рекомендуемое-расписание}

-   **Daily** - full database backup
-   **Weekly** - full S3 storage backup
-   **Monthly** - archiving of old backups

---

---

## Configuring Business Parameters {#настроика-бизнес-параметров}

### Main parameters in the administrative interface (`/app/admin`) {#основные-параметры-в-административном-интерфеисе-app-admin}

| Parameter                        | Description                                   | Recommendation                             |
| ------------------------------- | ------------------------------------------ | ---------------------------------------- |
| **enableCommonAssets**          | Common architecture elements for all teams | Enable for large organizations         |
| **enableCommonRoles**           | Common roles for all teams                 | Enable for standardization                  |
| **enableCommonUsers**           | Common org structure                         | Enable for centralized management |
| **allDiagramsAnonAccess**       | Anonymous access to all diagrams        | Disable for security               |
| **enableAnonSearchPage**        | Search for anonymous users          | As required by business                    |
| **autoEnableEnterpriseLicense** | Automatic license issuance             | Enable for simplification                   |
| **autoJoinTeamId**              | Automatic addition to a team        | Specify the ID of the main team              |
| **disableTeamPopUp**            | Disable the prompt to create a team      | Enable for centralized management      |
| **disableTeamCreation**         | Prohibit team creation                  | Enable for strict control            |

### AI features {#ai-функции}

AI features are invoked as a REST API in OpenAI format, so you must specify a compatible endpoint and token.

**How to enable:**

-   In the administrative interface `/app/admin`, go to **System Settings → Business Logic → AI features**.
-   Activate the **"Enable BPMN autocomplete"** toggle.
-   Specify the **base URL** of the AI service (compatible with the OpenAI API).
-   Set the **token** for requests to this API.

:::: warning License requirement
Autocomplete works only when the AI module is activated in the licenses.
::::

### Interface and Menu Configuration {#настроика-интерфеиса-и-меню}

#### Custom Menu Items {#пользовательские-пункты-меню}

StormBPMn allows you to add custom menu items to the top-right corner of the interface for quick access to important company resources.

**Accessing the configuration:**

-   In the administrative interface (`/app/admin`), locate the **"Custom Menu Items"** parameter in the "Interface" group
-   The configuration is a JSON array of objects

**Format of each menu item:**

```json
{
    "label": "Название пункта",
    "icon": "ИМЯ_ИКОНКИ",
    "link": "https://ссылка.на.ресурс",
    "type": "external"
}
```

**Parameters:**

-   **`label`** - the display name of the menu item
-   **`icon`** - an icon from the PrimeVue library (the list is available at [primevue.org/icons](https://v3.primevue.org/icons/))
-   **`link`** - the URL for navigation
-   **`type`** - the link type:
    -   `external` - opens in a new tab

**Configuration examples:**

1. **Knowledge base and documentation:**

```json
[
    {
        "label": "База знаний",
        "icon": "PrimeIcons.BOOK",
        "link": "https://docs.company.com",
        "type": "external"
    },
    {
        "label": "Внутренние стандарты",
        "icon": "PrimeIcons.FILE",
        "link": "https://standards.company.com",
        "type": "external"
    }
]
```

### Required settings {#обязательные-настроики}

| Parameter    | Description                         | Example                          |
| ----------- | -------------------------------- | ------------------------------- |
| **baseUrl** | Base URL for links in emails | `https://stormbpmn.company.com` |

::: warning Visibility settings
The "Visibility settings" parameter allows passing values to the frontend. **Do not enable** for passwords and confidential data!
:::

---
