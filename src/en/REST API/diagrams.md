---
title: Architecture diagrams and elements
order: 1
source_hash: d6345ca84368ff7e
---

[[toc]]

# Diagrams and Architecture Elements {#диаграммы-и-элементы-архитектуры}

REST API methods for working with diagrams and architecture elements. General rules (authentication via
`X-Api-Key`, limits) — see the [REST API overview](./README.md).

## Loading Diagrams {#загрузка-диаграмм}

The method creates new BPMN models and updates existing ones. It is usually called after deploying an application to Camunda so that the schemes in Stormbpmn match the executable ones.

### Main method {#основнои-метод}

**Path:** `POST /public-api/v1/upload-diagrams`

### Request Structure {#структура-запроса}

The request body is an array of models, **no more than 20 per request**.

```json
[
    {
        "id": "Meeting_Scheduling:1:1123",
        "name": "Meeting scheduling",
        "source": "CamundaMeetingsBackend",
        "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><bpmn:definitions ...>...</bpmn:definitions>"
    }
]
```

### Request parameters {#параметры-запроса}

| Field      | Type     | Required | Description                                                                              |
| ---------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| **id**     | `string` | ✅       | Model identifier in your system; returned in the response for matching                   |
| **name**   | `string` | ✅       | Model name, up to 255 characters; **the model is looked up by it for updates**           |
| **xml**    | `string` | ✅       | Full BPMN XML as a JSON string (quotes and line breaks are escaped)                      |
| **source** | `string` | 📄       | Source system; goes into the version comment                                             |

### Create or update {#создание-или-обновление}

-   If the team **already has a model with the same `name`**, the uploaded XML becomes its new version. Otherwise a new BPMN model is created.
-   If you rename the model in Stormbpmn, the link is lost: the next upload creates a new model with the old name. Do not rename models that are updated through the API.
-   A single request can contain several versions of a model with the same `name`: they are applied in order, and the last one becomes current.
-   On every upload the model description and the version comment are replaced with a service string like `uploaded via Api from <source> at <time>, source id <id>`. Keep your own description elsewhere, for example in the process card in the registry.

::: warning Which XML is accepted
A full BPMN 2.0 file with the graphical part of the diagram (`bpmndi:BPMNDiagram`), as saved by Camunda Modeler, is required. A file with only the process logic and no shape coordinates will not be uploaded.
:::

### Response Structure {#структура-ответа}

```json
{
    "createdDiagrams": [
        { "stormDiagramId": "94d2e63f-f84a-40d4-b4a3-592b0cc7c7d9", "sourceDiagramId": "Meeting_Scheduling:1:1123" }
    ],
    "updatedDiagrams": [],
    "errors": {
        "emptyName": [],
        "nameTooLong": [],
        "emptyDefinition": [],
        "notXml": []
    }
}
```

`stormDiagramId` is the model identifier in Stormbpmn, `sourceDiagramId` is your `id`. `errors` lists your `id`s of the models that were not uploaded; the other models in the batch are uploaded.

| Key in `errors`   | Reason                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `emptyName`       | empty `name`                                                                                                                                       |
| `nameTooLong`     | `name` is longer than 255 characters                                                                                                               |
| `emptyDefinition` | no `xml`                                                                                                                                           |
| `notXml`          | `xml` is not XML                                                                                                                                   |
| `BPMN_NOT_BPMN`   | the XML is not a BPMN model                                                                                                                        |
| `BPMN_MISSING_DI` | the BPMN has no graphical part of the diagram                                                                                                      |
| `noEditAccess`    | a model with this name exists, but the administrator on whose behalf the key works cannot edit it (someone else's personal model, read-only)      |

The keys `BPMN_NOT_BPMN`, `BPMN_MISSING_DI` and `noEditAccess` appear in the response only if there are such errors.

### Whole-request errors {#ошибки-всего-запроса}

-   `400` `No diagrams in request` — empty array.
-   `400` `More than 20 diagrams in request` — more than 20 models.
-   `403` with `"code": "PLAN_LIMIT"` — the new models do not fit within the plan's model limit; no model of the batch is uploaded.
-   `429` — the request rate is exceeded, repeat after the pause from the `Retry-After` header.

### Example: upload all .bpmn files from a folder {#пример-загрузить-все-bpmn-из-папки}

::: tip Automation for Camunda
A Python 3 script with no external libraries: it takes all `.bpmn` files from a folder, sends them in batches of 20, pauses between requests and repeats the request on `429`. Suitable as a CI step after deployment.
:::

```python
import json, os, pathlib, sys, time, urllib.error, urllib.request

BASE = os.environ.get("STORM_URL", "https://stormbpmn.com")
KEY = os.environ["STORM_API_KEY"]
FOLDER = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "src/main/resources/bpmn")

def send(batch):
    body = json.dumps(batch, ensure_ascii=False).encode("utf-8")
    for attempt in range(5):
        req = urllib.request.Request(
            f"{BASE}/public-api/v1/upload-diagrams", data=body, method="POST",
            headers={"X-Api-Key": KEY, "Content-Type": "application/json; charset=utf-8"})
        try:
            with urllib.request.urlopen(req) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(int(e.headers.get("Retry-After", "1")) + 1)
                continue
            sys.exit(f"Ошибка {e.code}: {e.read().decode('utf-8', 'replace')}")
    sys.exit("Не удалось отправить пакет: слишком много повторов")

files = sorted(FOLDER.glob("*.bpmn"))
for i in range(0, len(files), 20):
    batch = [{"id": f.stem, "name": f.stem, "source": "ci",
              "xml": f.read_text(encoding="utf-8")} for f in files[i:i + 20]]
    result = send(batch)
    print(f"создано {len(result['createdDiagrams'])}, обновлено {len(result['updatedDiagrams'])}")
    for reason, ids in result["errors"].items():
        if ids:
            print(f"не загружены ({reason}): {', '.join(ids)}")
    time.sleep(1.1)  # на тарифе Команда — 1 запрос в секунду
```

Run: `STORM_API_KEY=your_key python upload_bpmn.py path/to/folder`. The model name here equals the file name without `.bpmn`; to take it from the `name` attribute of the process inside the file, change the line with `"name"`.

---

## Managing Architecture Elements {#управление-элементами-архитектуры}

### Loading and Updating {#загрузка-и-обновление}

**Path:** `POST /public-api/v1/assets`

### Request Structure {#структура-запроса-1}

The request body is an array of elements. One request can both create and update elements.

```json
[
    {
        "externalId": "CMDB-1042",
        "name": "1C:Accounting",
        "description": "<p>Primary documents and postings</p>",
        "externalUrl": "https://cmdb.company.ru/systems/${externalId}",
        "type": "SYSTEM",
        "status": "PRODUCTION"
    }
]
```

### Request parameters {#параметры-запроса-1}

| Field                     | Type     | Required     | Description                                      |
| ------------------------- | -------- | ------------ | ------------------------------------------------ |
| **id**                    | `number` | 📎           | Element ID in Stormbpmn, for updates             |
| **externalId**            | `string` | 📎           | Element ID in the external system                |
| **name**                  | `string` | ✅           | Element name                                     |
| **type**                  | `enum`   | ✅           | `SYSTEM`, `DOCUMENT` or `CUSTOM`                 |
| **customAssetDefinition** | `object` | for `CUSTOM` | Custom type: `{"id": "<type UUID>"}`             |
| **status**                | `enum`   | 📄           | Status, `NEW` by default                         |
| **description**           | `string` | 📄           | HTML description (unescaped)                     |
| **externalUrl**           | `string` | 📄           | Link to the element in the external system       |
| **color**                 | `string` | 📄           | HEX color, for example `#4ECDC4`                 |

### Architecture Element Types {#типы-элементов-архитектуры}

| Value      | Description                                                                 |
| ---------- | --------------------------------------------------------------------------- |
| `SYSTEM`   | System                                                                      |
| `DOCUMENT` | Document                                                                    |
| `CUSTOM`   | Element of a custom type: role, data, client and any types of the team      |

::: warning Changing types
The former built-in types (`CLIENT`, `ENTITY`, `DATA`, `UNSPECIFIED` and others) became custom. Passing them in `type` returns an error: specify `CUSTOM` and the type identifier in `customAssetDefinition`.
:::

```json
[
    {
        "externalId": "SEG-B2C",
        "name": "Private client",
        "type": "CUSTOM",
        "customAssetDefinition": { "id": "3f0c2a8e-1b7d-4c55-9a61-0d2f7e4b9c10" }
    }
]
```

### Element statuses {#статусы-элементов}

| Value             | Description        |
| ----------------- | ------------------ |
| `NEW`             | New                |
| `TRIAL`           | Testing            |
| `PRODUCTION`      | In operation       |
| `DECOMMISSIONING` | Being decommissioned |
| `ARCHIVE`         | Archive            |

### Update Logic {#логика-обновления}

| Condition                  | Action                                                                          |
| -------------------------- | ------------------------------------------------------------------------------- |
| **Only id**                | Update by internal ID                                                           |
| **Only externalId**        | Update by external ID; if no element with this `externalId` exists, it is created |
| **Both id and externalId** | Update by internal ID                                                           |
| **Neither id nor externalId** | Create a new element                                                         |

### Link to the external system {#ссылка-на-внешнюю-систему}

In `externalUrl` you can use the `${externalId}` template: Stormbpmn replaces it with the element's external identifier. Links with the `javascript:`, `data:` and `vbscript:` schemes are not accepted.

### Response {#ответ}

An array of the saved elements in the same format, with `id`, creation and modification dates and the login of whoever changed the element last filled in. If the new elements do not fit within the plan's architecture element limit, `403` with `"code": "PLAN_LIMIT"` is returned.

---

## Getting the list of diagrams {#получение-списка-диаграмм}

### Main method {#основнои-метод-1}

**Path:** `GET /public-api/v1/get-diagram-list`

### Query parameters {#query-параметры}

| Parameter | Type     | Required | Description                              |
| --------- | -------- | -------- | ---------------------------------------- |
| **page**  | `number` | 📄       | Page number, from 0; 0 by default        |

A page holds 20 diagrams; the page size cannot be changed. To get all of them, increase `page` until you have collected `totalElements` records.

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
            "teamFolderName": "Продажи",
            "createdOn": "2024-05-02T17:19:41.459888",
            "updatedOn": "2024-05-02T17:28:07.695362"
        }
    ]
}
```

::: info Access Rights
The list depends on the permissions of the team administrator on whose behalf the key works. The response contains other fields too; read only the ones you need.
:::

---

## Getting a diagram by ID {#получение-диаграммы-по-id}

### Main method {#основнои-метод-2}

**Path:** `GET /public-api/v1/get-diagram-by-id`

### Query parameters {#query-параметры-1}

| Parameter     | Type   | Required | Description                      |
| ------------- | ------ | -------- | -------------------------------- |
| **diagramId** | `UUID` | ✅       | Unique identifier of the diagram |

### Key response fields {#ключевые-поля-ответа}

| Field             | Type     | Description                    |
| ----------------- | -------- | ------------------------------ |
| **id**            | `UUID`   | Diagram identifier             |
| **name**          | `string` | Diagram name                   |
| **body**          | `string` | XML content of the diagram     |
| **versionNumber** | `number` | Version number                 |
| **status**        | `string` | Diagram status                 |
| **type**          | `string` | Diagram type, for example `BPMN` |

::: warning Contract changes
The set of fields is extended over time: read only the ones you need (usually `body`). If the diagram is not in the key's team or there is no access, `404` is returned.
:::

---

## Updating the element description {#обновление-описания-элемента}

### Main method {#основнои-метод-3}

**Path:** `POST /public-api/v1/element-description/{diagramId}/{elementId}`

### Path Parameters {#параметры-пути}

| Parameter     | Type     | Description        |
| ------------- | -------- | ------------------ |
| **diagramId** | `UUID`   | Diagram identifier |
| **elementId** | `string` | Element identifier |

### Request Structure {#структура-запроса-2}

```json
{
    "description": "Detailed description of the element",
    "duration": 3600,
    "externalLink": "https://wiki.company.com/process"
}
```

### Request parameters {#параметры-запроса-2}

| Field            | Type     | Description                |
| ---------------- | -------- | -------------------------- |
| **description**  | `string` | HTML description (escaped) |
| **duration**     | `number` | Duration in seconds        |
| **externalLink** | `string` | External link              |

---

## Obtaining approvals {#получение-согласовании}

The method returns approvals related to a team member: where they are the approver or where they sent a model for approval.

### Main method {#основнои-метод-4}

**Path:** `GET /public-api/v1/approvals`

### Query parameters {#query-параметры-2}

| Parameter       | Type      | Required | Description                                                                         |
| --------------- | --------- | -------- | ----------------------------------------------------------------------------------- |
| **userEmail**   | `string`  | ✅       | Team member's email                                                                 |
| **status**      | `enum`    | 📄       | Status filter                                                                       |
| **isApprover**  | `boolean` | 📄       | `true` — only where the member is the approver                                      |
| **isCreator**   | `boolean` | 📄       | `true` — only approvals created by the member                                       |
| **view**        | `enum`    | 📄       | `USER` (default) — the member's approvals; `TEAM` — all approvals of the team       |
| **diagramName** | `string`  | 📄       | Part of the model name                                                              |
| **createdOn**   | `date`    | 📄       | Approval creation date, ISO 8601                                                    |
| **approvedOn**  | `date`    | 📄       | Decision date, ISO 8601                                                             |
| **page**        | `number`  | 📄       | Page number, from 0                                                                 |
| **size**        | `number`  | 📄       | Page size, 20 by default                                                            |

The newest approvals come first. If there is no member with this email in the key's team, `403` is returned.

### Statuses {#статусы}

Statuses in the response:

| Value      | Description      |
| ---------- | ---------------- |
| `PENDING`  | Awaiting approval |
| `ACCEPTED` | Accepted         |
| `DECLINED` | Declined         |

The `status` filter additionally accepts `COMPLETED` — all finished ones: both accepted and declined. The response never has this status.

### Response Structure {#структура-ответа-2}

```json
{
    "content": [
        {
            "id": "867bc39c-9145-4eb5-b59f-00545a6a9a3f",
            "approverEmail": "ivanova@company.ru",
            "approverName": "Anna Ivanova",
            "createdBy": "petrov@company.ru",
            "diagramId": "fbeb4c64-e172-4e09-9fa1-6e509a11ffde",
            "diagramName": "Работа с подрядчиком",
            "diagramVersion": "11",
            "status": "PENDING",
            "comment": null,
            "createdOn": "2026-01-23T17:44:27.323817",
            "approvalTime": null
        }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 20,
    "number": 0
}
```

| Field                                              | Description                                |
| -------------------------------------------------- | ------------------------------------------ |
| **approverEmail**, **approverName**                | The approver                               |
| **createdBy**                                      | Who sent the model for approval            |
| **diagramId**, **diagramName**, **diagramVersion** | The model and the version being approved   |
| **comment**                                        | The approver's comment                     |
| **createdOn**                                      | When the approval was created              |
| **approvalTime**                                   | When the decision was made                 |

---
