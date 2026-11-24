---
title: Process Metrics
order: 2
source_hash: 2633e42179dacd4f
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
    "metricName": "avg_execution_time",
    "metricValue": 45.5,
    "metricPlanValue": 30.0,
    "comment": "Value for January 2025"
}
```

### Request Parameters {#параметры-запроса}

| Field               | Type       | Required | Description                                                                                          |
| ------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------- |
| **processId**       | `UUID`     | ✅       | Process identifier                                                                                   |
| **metricName**      | `string`   | ✅       | Metric API name: the "API Name" field in the custom field settings, not its display name             |
| **metricValue**     | `number`   | 📄       | Actual metric value                                                                                  |
| **metricPlanValue** | `number`   | 📄       | Planned metric value                                                                                 |
| **comment**         | `string`   | 📄       | Comment on the value                                                                                 |
| **period**          | `date`     | 📄       | Periodic metrics only: the first day of the period (`YYYY-MM-DD`), see [below](#метрика-с-периодичностью) |
| **metricDate**      | `datetime` | 📄       | Not used: the server does not store this field, and it does not set the period                       |

### Response Structure {#структура-ответа}

```json
{
    "processId": "94d2e63f-f84a-40d4-b4a3-592b0cc7c7d9",
    "metricName": "avg_execution_time",
    "metricValue": 45.5,
    "metricPlanValue": 30.0,
    "delta": 15.5,
    "comment": "Value for January 2025",
    "metricDate": null,
    "period": null
}
```

### Response Fields {#поля-ответа}

| Field               | Type       | Description                                                                            |
| ------------------- | ---------- | -------------------------------------------------------------------------------------- |
| **processId**       | `UUID`     | Process identifier                                                                     |
| **metricName**      | `string`   | Metric API name                                                                        |
| **metricValue**     | `number`   | Actual metric value                                                                    |
| **metricPlanValue** | `number`   | Planned metric value                                                                   |
| **delta**           | `number`   | Deviation from plan, taking the metric direction into account                          |
| **comment**         | `string`   | Comment on the value                                                                   |
| **period**          | `date`     | For a periodic metric, the first day of the period the value was written to; otherwise `null` |
| **metricDate**      | `datetime` | Always `null`                                                                          |

### Periodic metrics {#метрика-с-периодичностью}

A metric can have a period: week, month, quarter or year. Its plan, actual value and comment are then stored separately for each period, and a request writes the value of one period.

- **Which period.** `period` is the first day of the period: Monday for a week, the 1st for a month, January 1, April 1, July 1 or October 1 for a quarter, January 1 for a year. Without `period`, the value goes to the current period in Moscow time.
- **The period value is replaced as a whole.** The period's actual value and comment become exactly what the request sends: a field missing from the request is not kept in the period. At least one of `metricValue` and `metricPlanValue` is required.
- **The plan carries over.** If a period has no plan of its own, the plan of the nearest past period applies. In the response, `metricPlanValue` and `delta` use the carried-over plan.
- **Future periods.** Only a plan can be written to a future period.
- **What the interface shows.** The process card, the registry and exports show the actual value of the latest period that has one, and the plan of that same period.

Example: actual and plan of a monthly metric for October 2026:

```json
{
    "processId": "94d2e63f-f84a-40d4-b4a3-592b0cc7c7d9",
    "metricName": "avg_execution_time",
    "metricValue": 45.5,
    "metricPlanValue": 30.0,
    "period": "2026-10-01"
}
```

The response contains the value of that period and `"period": "2026-10-01"`.

Error `400`:

- `period` is sent for a metric without a period;
- `period` is not the first day of a period (the error text gives the expected date);
- an actual value for a future period;
- both `metricValue` and `metricPlanValue` are empty;
- a required metric would be left with no period that has an actual value.

::: tip Use Cases
- **BPMS Integration**: Automatic loading of performance metrics from process execution systems (Camunda, Activiti, etc.)
- **BI Systems**: Export of analytical indicators from data warehouses
- **SLA Monitoring**: Automatic updating of SLA compliance indicators
:::

---
