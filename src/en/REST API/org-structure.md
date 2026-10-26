---
title: Org structure
order: 3
source_hash: d298251a0d648cd6
---

[[toc]]

# Org Structure {#организационная-структура}

Working with the org structure via the REST API: org units, positions, employees, and the relationships between them. General rules (authentication, limits) are covered in the [REST API overview](./README.md).

## Working with the org structure {#работа-с-организационнои-структурои}

The org structure consists of several key entities:

### Core Entities {#основные-сущности}

**OrgItem** - an element of the org structure. It can be of two types:

-   **Position** - for example, "Chief Executive Officer"
-   **Group** - for example, "Financial Control Department"

::: tip Relationship with Roles

Roles are an internal abstraction in Stormbpmn. OrgItems can be assigned to roles. In this case, they cannot be deleted via the API; you must perform reassignment through the UI.

:::

**OrgItemEdge** - a link between org structure elements, representing subordination.

-   For example: "Financial Control Department" is subordinate to "Chief Executive Officer"
-   Each OrgItem can have only one parent link (dual subordination is not allowed)

**Person** - an organization employee

**OrgItemPersonEdge** - assignment of an employee to an org structure element

-   For example: "Kotov D.G." is assigned to the "Chief Executive Officer" position
-   A Person can be assigned to multiple OrgItems
-   A Person can be assigned ONLY to OrgItems of the "Position" type

::: tip Important
Operations on entities are separated into individual methods. Integrity from a business logic perspective is maintained by the calling system. Integrity from a validation and inter-entity relationship perspective is ensured by the system.
:::

---

### Entity Attribute Composition {#атрибутивныи-состав-сущностеи}

#### OrgItem {#orgitem}

| Attribute       | Type    | Description                                      |
| ------------- | ------ | --------------------------------------------- |
| `id`          | UUID   | Internal identifier                      |
| `externalId`  | string | Identifier in the external system (unique) |
| `type`        | ENUM   | `POSITION` (position) or `OU` (group)      |
| `name`        | string | Name                                      |
| `description` | string | Description in HTML format                       |
| `color`       | string | Color in HEX format                            |

#### OrgItemEdge {#orgitemedge}

| Attribute            | Type    | Description                                 |
| ------------------ | ------ | ---------------------------------------- |
| `id`               | UUID   | Internal identifier                 |
| `sourceId`         | UUID   | Parent element identifier     |
| `targetId`         | UUID   | Child element identifier         |
| `externalSourceId` | string | External parent identifier           |
| `externalTargetId` | string | External child element identifier |

#### Person {#person}

| Attribute      | Type    | Description                                         |
| ------------ | ------ | ------------------------------------------------ |
| `id`         | UUID   | Internal identifier                         |
| `externalId` | string | Identifier in the external system (unique)    |
| `email`      | string | Email address                                |
| `phone`      | string | Phone number                                          |
| `firstName`  | string | First name                                              |
| `lastName`   | string | Last name                                          |
| `patronymic` | string | Patronymic                                         |
| `photoUrl`   | string | Link to a photo (via the file upload API) |

#### OrgItemPersonEdge {#orgitempersonedge}

| Attribute            | Type    | Description                      |
| ------------------ | ------ | ----------------------------- |
| `id`               | UUID   | Internal identifier      |
| `sourceId`         | UUID   | OrgItem identifier         |
| `personId`         | UUID   | Person identifier          |
| `externalSourceId` | string | External OrgItem identifier |
| `externalPersonId` | string | External Person identifier  |

---

### API Methods {#методы-api}

#### Creating an OrgItem {#создание-orgitem}

**Path:** `POST /public-api/v1/org-items`

**Request structure:**

```json
[
    {
        "externalId": "CEO_POSITION_001",
        "type": "POSITION",
        "name": "Генеральный директор",
        "description": "<p>Руководитель организации</p>",
        "color": "#FF6B6B"
    }
]
```

**Request parameters:**

| Field            | Type      | Required | Description                                    |
| --------------- | -------- | ------------ | ------------------------------------------- |
| **externalId**  | `string` | ✅           | Unique identifier in the external system |
| **type**        | `enum`   | ✅           | `POSITION` (position) or `OU` (group)    |
| **name**        | `string` | ✅           | Element name                           |
| **description** | `string` | 📄           | Description in HTML format                     |
| **color**       | `string` | 📄           | Color in HEX format                          |

**Response structure:**

```json
{
    "created": [
        {
            "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "externalId": "CEO_POSITION_001",
            "type": "POSITION",
            "name": "Генеральный директор",
            "description": "<p>Руководитель организации</p>",
            "color": "#FF6B6B"
        }
    ],
    "errors": []
}
```

#### Reading an OrgItem {#чтение-orgitem}

**Path:** `GET /public-api/v1/org-items`

**Query parameters:**

| Parameter | Type      | Required | Description                          |
| -------- | -------- | ------------ | --------------------------------- |
| **page** | `number` | 📄           | Page number (default 0)   |
| **size** | `number` | 📄           | Page size (default 20) |

**Retrieval by ID:**

**Path:** `GET /public-api/v1/org-items/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Retrieval by external ID:**

**Path:** `GET /public-api/v1/org-items/by-external-id/{externalId}`

**Path parameters:**

| Parameter       | Type      | Description                       |
| -------------- | -------- | ------------------------------ |
| **externalId** | `string` | External identifier of the element |

**Response structure:**

```json
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "externalId": "CEO_POSITION_001",
    "type": "POSITION",
    "name": "Генеральный директор",
    "description": "<p>Руководитель организации</p>",
    "color": "#FF6B6B",
    "parentItems": {},
    "childItems": [
        {
            "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
            "externalId": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
            "name": "Заместитель генерального директора"
        }
    ],
    "assignedPersons": [
        {
            "externalId": "CEO_POSITION_001",
            "id": "c3d4e5f6-g7h8-9012-cdef-345678901234",
            "firstName": "Дмитрий",
            "lastName": "Котов",
            "email": "kotov@company.com"
        }
    ]
}
```

#### Updating an OrgItem {#обновление-orgitem}

**Path:** `PUT /public-api/v1/org-items/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Update by external ID:**

**Path:** `PUT /public-api/v1/org-items/by-external-id/{externalId}`

**Request structure:**

```json
{
    "name": "Генеральный директор (обновлено)",
    "description": "<p>Главное лицо организации</p>",
    "color": "#4ECDC4"
}
```

**Request parameters:**

| Field            | Type      | Required | Description              |
| --------------- | -------- | ------------ | --------------------- |
| **name**        | `string` | 📄           | New name        |
| **description** | `string` | 📄           | New description in HTML |
| **color**       | `string` | 📄           | New color in HEX      |

::: warning Important
The element type (`type`) cannot be changed after creation. To change the type, you must delete and create a new element.
:::

#### Deleting an OrgItem {#удаление-orgitem}

**Path:** `DELETE /public-api/v1/org-items/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Deletion by external ID:**

**Path:**Path:** `DELETE /public-api/v1/org-items/by-external-id/{externalId}`

**Response structure:**

```json
{
    "deleted": true,
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "message": "OrgItem успешно удален"
}
```

**Deletion conditions:**

-   ✅ An element without connections can be deleted immediately
-   ⚠️ An element with child connections can only be deleted after all connections are removed
-   ⚠️ An element with assigned employees can only be deleted after all assignments are revoked

::: danger Cascading deletion
Cascading deletion is not supported.
:::

#### Creating a Person {#создание-person}

**Path:** `POST /public-api/v1/persons`

**Request structure:**

```json
[
    {
        "externalId": "KOTOV_DG_001",
        "email": "kotov@company.com",
        "phone": "+7 (495) 123-45-67",
        "firstName": "Дмитрий",
        "lastName": "Котов",
        "patronymic": "Георгиевич",
        "photoUrl": "/userFiles/1.png"
    }
]
```

**Request parameters:**

| Field           | Type      | Required | Description                                         |
| -------------- | -------- | ------------ | ------------------------------------------------ |
| **externalId** | `string` | 📄           | Unique identifier in the external system      |
| **email**      | `string` | 📄           | Employee's email address                     |
| **phone**      | `string` | 📄           | Employee's phone number                               |
| **firstName**  | `string` | ✅           | Employee's first name                                   |
| **lastName**   | `string` | 📄           | Employee's last name                               |
| **patronymic** | `string` | 📄           | Employee's patronymic                              |
| **photoUrl**   | `string` | 📄           | Link to the photo (via the file upload API) |

**Response structure:**

```json
{
    "created": [
        {
            "id": "c3d4e5f6-g7h8-9012-cdef-345678901234",
            "externalId": "KOTOV_DG_001",
            "email": "kotov@company.com",
            "phone": "+7 (495) 123-45-67",
            "firstName": "Дмитрий",
            "lastName": "Котов",
            "patronymic": "Георгиевич",
            "photoUrl": "https://company.com/photos/kotov.jpg"
        }
    ],
    "errors": []
}
```

#### Reading a Person {#чтение-person}

**Path:** `GET /public-api/v1/persons`

**Query parameters:**

| Parameter  | Type      | Required | Description                          |
| --------- | -------- | ------------ | --------------------------------- |
| **page**  | `number` | 📄           | Page number (default 0)   |
| **size**  | `number` | 📄           | Page size (default 20) |
| **email** | `string` | 📄           | Filter by email address       |

**Retrieval by ID:**

**Path:** `GET /public-api/v1/persons/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Retrieval by external ID:**

**Path:** `GET /public-api/v1/persons/by-external-id/{externalId}`

**Path parameters:**

| Parameter       | Type      | Description                       |
| -------------- | -------- | ------------------------------ |
| **externalId** | `string` | External identifier of the element |

**Response structure:**

```json
{
    "id": "c3d4e5f6-g7h8-9012-cdef-345678901234",
    "externalId": "KOTOV_DG_001",
    "email": "kotov@company.com",
    "phone": "+7 (495) 123-45-67",
    "firstName": "Дмитрий",
    "lastName": "Котов",
    "patronymic": "Георгиевич",
    "photoUrl": "https://company.com/photos/kotov.jpg",
    "assignedPositions": [
        {
            "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "externalId": "CEO_POSITION_001",
            "name": "Генеральный директор",
            "type": "POSITION"
        }
    ]
}
```

#### Updating a Person {#обновление-person}

**Path:** `PUT /public-api/v1/persons/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Update by external ID:**

**Path:** `PUT /public-api/v1/persons/by-external-id/{externalId}`

**Request structure:**

```json
{
    "email": "d.kotov@company.com",
    "phone": "+7 (495) 987-65-43",
    "firstName": "Дмитрий",
    "lastName": "Котов",
    "patronymic": "Георгиевич",
    "photoUrl": "/photos/kotov_new.jpg"
}
```

**Request parameters:**

| Field           | Type      | Required | Description                   |
| -------------- | -------- | ------------ | -------------------------- |
| **email**      | `string` | 📄           | New email address    |
| **phone**      | `string` | 📄           | New phone number              |
| **firstName**  | `string` | 📄           | New first name                  |
| **lastName**   | `string` | 📄           | New last name              |
| **patronymic** | `string` | 📄           | New patronymic             |
| **photoUrl**   | `string` | 📄           | New link to the photo |

#### Deleting a Person {#удаление-person}

**Path:** `DELETE /public-api/v1/persons/{id}`

**P**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Deletion by external ID:**

**Path:** `DELETE /public-api/v1/persons/by-external-id/{externalId}`

**Response structure:**

```json
{
    "deleted": true,
    "id": "c3d4e5f6-g7h8-9012-cdef-345678901234",
    "message": "Person успешно удален"
}
```

**Deletion conditions:**

-   ✅ An employee without assignments can be deleted immediately
-   ⚠️ An employee with active assignments can only be deleted after all assignments are revoked

::: warning Important
When deleting an employee, related `OrgItemPersonEdge` are not automatically deleted. You must first delete all assignments.
:::

#### Creating an OrgItemEdge {#создание-orgitemedge}

**Path:** `POST /public-api/v1/org-item-edges`

**Request structure:**

```json
[
    {
        "sourceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "targetId": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
        "externalSourceId": "CEO_POSITION_001",
        "externalTargetId": "DEPUTY_CEO_001"
    }
]
```

**Request parameters:**

| Field                 | Type      | Required | Description                             |
| -------------------- | -------- | ------------ | ------------------------------------ |
| **sourceId**         | `UUID`   | 📎           | Internal ID of the parent element |
| **targetId**         | `UUID`   | 📎           | Internal ID of the child element     |
| **externalSourceId** | `string` | 📎           | External ID of the parent element    |
| **externalTargetId** | `string` | 📎           | External ID of the child element        |

::: tip Creation logic
You can use either internal IDs (`sourceId`, `targetId`) or external IDs (`externalSourceId`, `externalTargetId`). If both internal and external IDs are specified, internal IDs take precedence.
:::

**Response structure:**

```json
{
    "created": [
        {
            "id": "d4e5f6g7-h8i9-0123-defg-456789012345",
            "sourceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "targetId": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
            "externalSourceId": "CEO_POSITION_001",
            "externalTargetId": "DEPUTY_CEO_001",
            "sourceItem": {
                "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "name": "Генеральный директор"
            },
            "targetItem": {
                "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
                "name": "Заместитель генерального директора"
            }
        }
    ],
    "errors": []
}
```

#### Reading an OrgItemEdge {#чтение-orgitemedge}

**Path:** `GET /public-api/v1/org-item-edges`

**Query parameters:**

| Parameter             | Type      | Required | Description                          |
| -------------------- | -------- | ------------ | --------------------------------- |
| **page**             | `number` | 📄           | Page number (default 0)   |
| **size**             | `number` | 📄           | Page size (default 20) |
| **sourceId**         | `UUID`   | 📄           | Filter by parent element  |
| **targetId**         | `UUID`   | 📄           | Filter by child element      |
| **externalSourceId** | `string` | 📄           | Filter by parent external ID    |

**Retrieval by ID:**

**Path:** `GET /public-api/v1/org-item-edges/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Response structure:**

```json
{
    "id": "d4e5f6g7-h8i9-0123-defg-456789012345",
    "sourceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "targetId": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
    "externalSourceId": "CEO_POSITION_001",
    "externalTargetId": "DEPUTY_CEO_001",
    "sourceItem": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "externalId": "CEO_POSITION_001",
        "name": "Генеральный директор",
        "type": "POSITION"
    },
    "targetItem": {
        "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
        "externalId": "DEPUTY_CEO_001",
        "name": "Заместитель генерального директора",
        "type": "POSITION"
    }
}
```

#### Updating an OrgItemEdge {#обновление-orgitemedge}

**Path:** `PUT /public-api/v1/org-item-edges/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Request structure:**

```json
{
    "sourceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "targetId": "c3d4e5f6-g7h8-9012-cdef-345678901234",
    "externalSourceId": "CEO_POSITION_001",
    "externalTargetId": "HR_MANAGER_001"
}
```

**Request parameters:**

| Field                 | Type      | Required | Description                        |
| -------------------- | -------- | ------------ | ------------------------------- |
| **sourceId**         | `UUID`   | 📎           | New ID of the parent element |
| **targetId**         | `UUID`   | 📎           | New ID of the child element     |
| **externalSourceId** | `string` | 📎           | New external ID of the parent       |
| **externalTargetId** | `string` | 📎           | New external ID of the child      |

#### Deleting an OrgItemEdge {#удаление-orgitemedge}

**Path:** `DELETE /public-api/v1/org-item-edges/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Deletion by relationship:**

**Path:** `DELETE /public-api/v1/org-item-edges/by-relation`

**Query parameters:**

| Parameter             | Type      | Required | Description                  |
| -------------------- | -------- | ------------ | ------------------------- |
| **sourceId**         | `UUID`   | 📎           | ID of the parent element |
| **targetId**         | `UUID`   | 📎           | ID of the child element     |
| **externalSourceId** | `string` | 📎           | External ID of the parent  |
| **externalTargetId** | `string` | 📎           | External ID of the child      |

**Response structure:**

```json
{
    "deleted": true,
    "id": "d4e5f6g7-h8i9-0123-defg-456789012345",
    "message": "OrgItemEdge успешно удален"
}
```

**Deletion conditions:**

-   ✅ A relationship can be deleted at any time
-   ⚠️ When a relationship is deleted, the child element becomes a root element (without a parent)

::: warning Important
Deleting a relationship does not delete the OrgItem elements themselves. Only the subordination relationship between them is removed.
:::

#### Creating an OrgItemPersonEdge {#создание-orgitempersonedge}

**Path:** `POST /public-api/v1/org-item-person-edges`

**Request structure:**

```json
[
    {
        "sourceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "personId": "c3d4e5f6-g7h8-9012-cdef-345678901234",
        "externalSourceId": "CEO_POSITION_001",
        "externalPersonId": "KOTOV_DG_001"
    }
]
```

**Request parameters:**

| Field                 | Type      | Required | Description                            |
| -------------------- | -------- | ------------ | ----------------------------------- |
| **sourceId**         | `UUID`   | 📎           | Internal ID of the org structure element |
| **personId**         | `UUID`   | 📎           | Internal ID of the employee            |
| **externalSourceId** | `string` | 📎           | External ID of the org structure element    |
| **externalPersonId** | `string` | 📎           | External ID of the employee               |

::: tip Creation logic
You can use either internal IDs (`sourceId`, `personId`) or external IDs (`externalSourceId`, `externalPersonId`). If both internal and external IDs are specified, internal IDs take precedence.
:::

::: warning Constraints
An employee can be assigned ONLY to an element of type `POSITION` (position). Assignment to groups (`OU`) is not supported.
:::

**Response structure:**

```json
{
    "created": [
        {
            "id": "e5f6g7h8-i9j0-1234-efgh-567890123456",
            "sourceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "personId": "c3d4e5f6-g7h8-9012-cdef-345678901234",
            "externalSourceId": "CEO_POSITION_001",
            "externalPersonId": "KOTOV_DG_001",
            "orgItem": {
                "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "name": "Генеральный директор",
                "type": "POSITION"
            },
            "person": {
                "id": "c3d4e5f6-g7h8-9012-cdef-345678901234",
                "firstName": "Дмитрий",
                "lastName": "Котов",
                "email": "kotov@company.com"
            }
        }
    ],
    "errors": []
}
```

#### Reading an OrgItemPersonEdge {#чтение-orgitempersonedge}

**Path:** `GET /public-api/v1/org-item-person-edges`

**Query parameters:**

| Parameter             | Type      | Required | Description                          |
| -------------------- | -------- | ------------ | --------------------------------- |
| **page**             | `number` | 📄           | Page number (default 0)   |
| **size**             | `number` | 📄           | Page size (default 20) |
| **sourceId**         | `UUID`   | 📄           | Filter by org structure element   |
| **personId**         | `UUID`   | 📄           | Filter by employee              |
| **externalSourceId** | `string` | 📄           | Filter by position external ID   |
| **email**            | `string` | 📄           | Filter by employee email        |

**Retrieval by ID:**

**Path:** `GET /public-api/v1/org-item-person-edges/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Response structure:**

```json
{
    "id": "e5f6g7h8-i9j0-1234-efgh-567890123456",
    "sourceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "personId": "c3d4e5f6-g7h8-9012-cdef-345678901234",
    "externalSourceId": "CEO_POSITION_001",
    "externalPersonId": "KOTOV_DG_001",
    "orgItem": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "externalId": "CEO_POSITION_001",
        "name": "Генеральный директор",
        "type": "POSITION",
        "description": "<p>Руководитель организации</p>",
        "color": "#FF6B6B"
    },
    "person": {
        "id": "c3d4e5f6-g7h8-9012-cdef-345678901234",
        "externalId": "KOTOV_DG_001",
        "firstName": "Дмитрий",
        "lastName": "Котов",
        "patronymic": "Георгиевич",
        "email": "kotov@company.com",
        "phone": "+7 (495) 123-45-67"
    }
}
```

#### Updating OrgItemPersonEdge {#обновление-orgitempersonedge}

**Path:** `PUT /public-api/v1/org-item-person-edges/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Request structure:**

```json
{
    "sourceId": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
    "personId": "c3d4e5f6-g7h8-9012-cdef-345678901234",
    "externalSourceId": "DEPUTY_CEO_001",
    "externalPersonId": "KOTOV_DG_001"
}
```

**Request parameters:**

| Field                 | Type      | Required | Description                       |
| -------------------- | -------- | ------------ | ------------------------------ |
| **sourceId**         | `UUID`   | 📎           | New org structure element ID |
| **personId**         | `UUID`   | 📎           | New employee ID            |
| **externalSourceId** | `string` | 📎           | New external position ID     |
| **externalPersonId** | `string` | 📎           | New external employee ID    |

#### Deleting OrgItemPersonEdge {#удаление-orgitempersonedge}

**Path:** `DELETE /public-api/v1/org-item-person-edges/{id}`

**Path parameters:**

| Parameter | Type    | Description                 |
| -------- | ------ | ------------------------ |
| **id**   | `UUID` | Internal identifier |

**Deletion by assignment:**

**Path:** `DELETE /public-api/v1/org-item-person-edges/by-assignment`

**Query parameters:**

| Parameter             | Type      | Required | Description                 |
| -------------------- | -------- | ------------ | ------------------------ |
| **sourceId**         | `UUID`   | 📎           | Org structure element ID |
| **personId**         | `UUID`   | 📎           | Employee ID            |
| **externalSourceId** | `string` | 📎           | External position ID     |
| **externalPersonId** | `string` | 📎           | External employee ID    |

**Deletion of all employee assignments:**

**Path:** `DELETE /public-api/v1/org-item-person-edges/by-person`

**Query parameters:**

| Parameter             | Type      | Required | Description              |
| -------------------- | -------- | ------------ | --------------------- |
| **personId**         | `UUID`   | 📎           | Employee ID         |
| **externalPersonId** | `string` | 📎           | External employee ID |

**Response structure:**

```json
{
    "deleted": true,
    "id": "e5f6g7h8-i9j0-1234-efgh-567890123456",
    "message": "OrgItemPersonEdge успешно удален"
}
```

**Deletion conditions:**

-   ✅ An assignment can be revoked at any time
-   ✅ When all of an employee's assignments are deleted, the employee becomes unassigned
-   ✅ When an assignment is deleted, the position remains vacant

::: warning Important
Deleting an assignment does not delete the employee or the position. Only the link between them is removed.
:::

---

### Recommended Work Scenarios {#рекомендуемые-сценарии-работы}

#### Initial Creation of the Org Structure {#первичное-создание-организационнои-структуры}

1. **Create OrgItems** (positions and groups)
2. **Create OrgItemEdges** (subordination links)
3. **Create Person** (employees)
4. **Create OrgItemPersonEdge** (assignments to positions)

#### Updating Attributes (Without Changing Links) {#обновление-атрибутов-без-изменения-связеи}

-   **OrgItem/Person**: update via the corresponding method with `externalId`

#### Updating Links (OrgItemEdges, OrgItemPersonEdge) {#обновление-связеи-orgitemedges-orgitempersonedge}

1. Ensure that the required `sourceId`, `targetId`, `personId` are created and up to date
2. Update the corresponding links

#### Deleting Structure Elements (OrgItem, Person) {#удаление-элементов-структуры-orgitem-person}

1. **Delete all associated bindings**
2. **Delete OrgItem/Person**

#### Deleting Links (OrgItemEdges, OrgItemPersonEdge) {#удаление-связеи-orgitemedges-orgitempersonedge}

1. **Delete/modify** all dependent bindings via `sourceId`, `targetId`, `personId`
2. **Delete** OrgItemEdges/OrgItemPersonEdge

---
