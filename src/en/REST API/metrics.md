---
title: Process Metrics
order: 2
source_hash: d207885e37bf3a00
---

[[toc]]

# Process Metrics {#метрики-процессов}

Managing process metrics via the REST API. General rules (authentication, limits) — see the
[REST API overview](./README.md).

## Process Metrics Management {#управление-метриками-процессов}

### Updating a metric value {#обновление-значения-метрики}

**Path:** `POST /public-api/v1/processes/metrics`

This method allows you to populate or update metric values for processes. The metric itself (custom field) must be created in advance in the system interface.

### Request Structure {#структура-запроса}

```json
{
    "processId": "94d2e63f-f84a-40d4-b4a3-592b0cc7c7d9",
    "metricName": "Среднее время выполнения",
    "metricValue": 45.5,
    "metricPlanValue": 30.0,
    "comment": "Значение за январь 2025",
    "metricDate": "2025-01-15T10:30:00"
}
```

### Request Parameters {#параметры-запроса}

| Field               | Type       | Required | Description                     |
| ------------------- | ---------- | -------- | ------------------------------- |
| **processId**       | `UUID`     | ✅       | Process identifier              |
| **metricName**      | `string`   | ✅       | Metric name                     |
| **metricValue**     | `number`   | 📄       | Actual metric value             |
| **metricPlanValue** | `number`   | 📄       | Planned metric value            |
| **comment**         | `string`   | 📄       | Comment on the value            |
| **metricDate**      | `datetime` | 📄       | Measurement date/time (ISO 8601) |

### Response Structure {#структура-ответа}

```json
{
    "processId": "94d2e63f-f84a-40d4-b4a3-592b0cc7c7d9",
    "metricName": "Среднее время выполнения",
    "metricValue": 45.5,
    "metricPlanValue": 30.0,
    "delta": 15.5,
    "comment": "Значение за январь 2025",
    "metricDate": "2025-01-15T10:30:00"
}
```

### Response Fields {#поля-ответа}

| Field                | Type        | Description                                            |
| ------------------- | ---------- | --------------------------------------------------- |
| **processId**       | `UUID`     | Process identifier                              |
| **metricName**      | `string`   | Metric name                                    |
| **metricValue**     | `number`   | Actual metric value                        |
| **metricPlanValue** | `number`   | Planned metric value                           |
| **delta**           | `number`   | Deviation from plan (metricValue - metricPlanValue) |
| **comment**         | `string`   | Comment on the value                              |
| **metricDate**      | `datetime` | Measurement date/time                                |

::: tip Use Cases
- **BPMS Integration**: Automatic loading of performance metrics from process execution systems (Camunda, Activiti, etc.)
- **BI Systems**: Export of analytical indicators from data warehouses
- **SLA Monitoring**: Automatic updating of SLA compliance indicators
:::

---
