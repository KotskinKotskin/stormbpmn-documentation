---
title: Architecture diagrams and elements
order: 1
source_hash: c18631852c6d0e70
---

[[toc]]

# Diagrams and Architecture Elements {#диаграммы-и-элементы-архитектуры}

REST API methods for working with diagrams and architecture elements. General rules (authentication via
`X-Api-Key`, limits) — see the [REST API overview](./README.md).

## Loading Diagrams {#загрузка-диаграмм}

### Main method {#основнои-метод}

**Path:** `POST /public-api/v1/upload-diagrams`

### Request Structure {#структура-запроса}

```json
[
    {
        "id": "Meeting Scheduling:1:1123",
        "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
        "name": "Meetings",
        "source": "CamundaMeetingsBackend"
    }
]
```

### Request parameters {#параметры-запроса}

| Field       | Type      | Required | Description                            |
| ---------- | -------- | ------------ | ----------------------------------- |
| **id**     | `string` | ✅           | External process identifier      |
| **xml**    | `string` | ✅           | XML diagram body (escaped) |
| **name**   | `string` | ✅           | Process name (important for updates) |
| **source** | `string` | ✅           | Version source for history         |

### Response Structure {#структура-ответа}

```json
{
    "errors": {
        "emptyName": [],
        "emptyDefinition": [],
        "notXml": []
    },
    "createdDiagrams": [],
    "updatedDiagrams": [
        {
            "stormDiagramId": "94d2e63f-f84a-40d4-b4a3-592b0cc7c7d9",
            "sourceDiagramId": "rhsrthsrth"
        }
    ]
}
```

### Key features {#важные-особенности}

-   **Maximum of 20 diagrams** per request
-   **The name field is critical** - do not modify it in Storm for updates
-   **Versioning** - diagrams with the same ID are updated sequentially
-   **Version history** - different versions can be uploaded in a single request

### Shell script example for Camunda {#пример-shell-скрипта-для-camunda}

::: tip Automation for Camunda
Use this script to automatically update diagrams after deployment:
:::

```bash
#!/bin/bash
# Сбор BPMN файлов и отправка в StormBPMN
files=($(ls ./src/main/resources/bpmn/*.bpmn))
size=${#files[@]}
echo '[' > temp.json
counter=1

echo "Начинаем обработку файлов..."
for file in ${files[*]}; do
  id="$(grep -Po '(?<=<bpmn:process\sid=")[^"]+' $file)"
  content="$(cat $file | sed 's/"/\\"/g;')"
  name="$(basename $file .bpmn)"
  echo '{"id":"'$id'","xml":"'$content'", "name": "'$name'", "source": "app"}' >> temp.json

  # Запятые между объектами (не в конце списка)
  if ((counter % 20)) && ((size != counter)) ; then
    echo ',' >> temp.json
  fi

  # Отправка пакета по 20 диаграмм
  if ! ((counter % 20)); then
    echo ']' >> temp.json
    curl -X POST -H "X-Api-Key: API-KEY" -H "Content-Type: application/json" \
         -d @temp.json stormbpmn.com/public-api/v1/upload-diagrams -i
    rm temp.json
    echo '[' > temp.json
  fi

  ((counter=counter+1))

  # Соблюдение лимита скорости
  if ((counter > 100)); then
    sleep 60
  fi
done

# Отправка оставшихся диаграмм
echo ']' >> temp.json
curl -X POST -H "X-Api-Key: API_KEY" -H "Content-Type: application/json" \
     -d @temp.json stormbpmn.com/public-api/v1/upload-diagrams -i
rm temp.json
```

---

## Managing Architecture Elements {#управление-элементами-архитектуры}

### Loading and Updating {#загрузка-и-обновление}

**Path:** `POST /public-api/v1/assets`

### Request Structure {#структура-запроса-1}

```json
[
    {
        "id": null,
        "externalId": null,
        "name": "B2C USER",
        "description": "",
        "externalUrl": null,
        "type": "CLIENT",
        "status": "NEW"
    }
]
```

### Request parameters {#параметры-запроса-1}

| Field            | Type      | Required | Description                       |
| --------------- | -------- | ------------ | ------------------------------ |
| **id**          | `number` | 📎           | Element ID in the system          |
| **externalId**  | `string` | 📎           | Element ID in the external system |
| **name**        | `string` | ✅           | Element name              |
| **description** | `string` | 📄           | HTML description (unescaped)      |
| **externalUrl** | `string` | 📄           | Link with placeholders        |
| **type**        | `enum`   | 📄           | Architecture element type       |
| **status**      | `enum`   | 📄           | Element status                |

### Architecture Element Types {#типы-элементов-архитектуры}

### Architecture element types {#типы-элементов-архитектуры-1}

| Value        | Description                     |
| --------------- | ---------------------------- |
| `UNSPECIFIED`   | Not specified                   |
| `DOCUMENT`      | Document                     |
| `SYSTEM`        | System                      |
| `DATA`          | Data                       |
| `CUSTOM`        | Custom types        |

::: warning Type changes
Built-in types, except for `DOCUMENT` and `SYSTEM`, have become custom types. When importing data (including Excel) and working via the API, only the values listed above are supported. Attempting to use deprecated types (for example, `CLIENT`, `ENTITY`) will result in a validation error.
:::

### Element statuses {#статусы-элементов}

| Value          | Description              |
| ----------------- | --------------------- |
| `NEW`             | New                 |
| `TRIAL`           | Testing          |
| `PRODUCTION`      | Production              |
| `DECOMMISSIONING` | Decommissioned |
| `ARCHIVE`         | Archive                 |

### Update Logic {#логика-обновления}

| Condition                  | Action                     |
| ------------------------ | ---------------------------- |
| **externalId only**    | Update by external ID    |
| **id only**            | Update by internal ID |
| **Both id and externalId**   | Update by internal ID |
| **Neither id nor externalId** | Create a new element     |

---

## Getting the list of diagrams {#получение-списка-диаграмм}

### Main method {#основнои-метод-1}

**Path:** `GET /public-api/v1/get-diagram-list`

### Query parameters {#query-параметры}

| Parameter | Type      | Required | Description             |
| --------- | --------- | -------- | ----------------------- |
| **page**  | `number` | ✅       | Page number (starting from 0) |

### Response Structure {#структура-ответа-1}

```json
{
    "totalElements": 223,
    "page": 0,
    "size": 20,
    "returnDiagrams": [
        {
            "id": "6b547a8f-a78f-4375-b39e-59c4afd9388e",
            "name": "Draft",
            "status": "NEW",
            "versionNumber": 3,
            "updatedBy": "kotov@bpmn2.ru",
            "teamName": "Мои кредиты",
            "type": "BCM",
            "public": true,
            "createdOn": "2024-05-02T17:19:41.459888",
            "updatedOn": "2024-05-02T17:28:07.695362"
        }
    ]
}
```

::: info Access Rights
The list of diagrams depends on the team administrator's permissions for the diagrams.
:::

---

## Getting a diagram by ID {#получение-диаграммы-по-id}

### Main method {#основнои-метод-2}

**Path:** `GET /public-api/v1/get-diagram-by-id`

### Query parameters {#query-параметры-1}

| Parameter      | Type    | Required | Description                           |
| ------------- | ------ | ------------ | ---------------------------------- |
| **diagramId** | `UUID` | ✅           | Unique identifier of the diagram |

### Key response fields {#ключевые-поля-ответа}

| Field              | Type      | Description                 |
| ----------------- | -------- | ------------------------ |
| **id**            | `UUID`   | Diagram identifier  |
| **name**          | `string` | Diagram name       |
| **body**          | `string` | XML content of the diagram |
| **versionNumber** | `number` | Version number             |
| **status**        | `string` | Diagram status         |
| **type**          | `string` | Diagram type            |

::: warning Contract changes
The API contract may change. Use a tolerant reader to retrieve the required fields (usually the `body` field).
:::

---

## Updating the element description {#обновление-описания-элемента}

### Main method {#основнои-метод-3}

**Path:** `POST /public-api/v1/element-description/{diagramId}/{elementId}`

### Path Parameters {#параметры-пути}

| Parameter      | Type      | Description                |
| ------------- | -------- | ----------------------- |
| **diagramId** | `UUID`   | Diagram identifier |
| **elementId** | `string` | Element identifier  |

### Request Structure {#структура-запроса-2}

```json
{
    "description": "Подробное описание элемента",
    "duration": 3600,
    "externalLink": "https://wiki.company.com/process"
}
```

### Request parameters {#параметры-запроса-2}

| Field             | Type      | Description                       |
| ---------------- | -------- | ------------------------------ |
| **description**  | `string` | HTML description (escaped) |
| **duration**     | `number` | Duration in seconds        |
| **externalLink** | `string` | External link                 |

---

## Obtaining approvals {#получение-согласовании}

### Main method {#основнои-метод-4}

**Path:** `GET /public-api/v1/approvals`

### Query parameters {#query-параметры-2}

| Parameter       | Type       | Required | Description                |
| -------------- | --------- | ------------ | ----------------------- |
| **userEmail**  | `string`  | ✅           | Team member email |
| **status**     | `enum`    | 📄           | Approval status     |
| **isApprover** | `boolean` | 📄           | Approver flag    |

### Approval statuses {#статусы-согласовании}

| Value    | Description             |
| ----------- | -------------------- |
| `PENDING`   | Pending approval |
| `ACCEPTED`  | Approved              |
| `DECLINED`  | Rejected            |
| `COMPLETED` | Completed            |

### Response Structure {#структура-ответа-2}

```json
{
    "content": [
        {
            "id": "867bc39c-9145-4eb5-b59f-00545a6a9a3f",
            "approverEmail": "user@company.com",
            "diagramId": "fbeb4c64-e172-4e09-9fa1-6e509a11ffde",
            "diagramName": "Работа с подрядчиком",
            "status": "PENDING",
            "createdOn": "2025-01-23T17:44:27.323817",
            "diagramVersion": "11"
        }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 20,
    "number": 0
}
```

---
