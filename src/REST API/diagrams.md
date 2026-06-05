---
title: "Диаграммы и элементы архитектуры"
order: 1
---

[[toc]]

# Диаграммы и элементы архитектуры

Методы REST API для работы с диаграммами и элементами архитектуры. Общие правила (авторизация по
`X-Api-Key`, лимиты) — в [обзоре REST API](./README.md).

## Загрузка диаграмм

### Основной метод

**Путь:** `POST /public-api/v1/upload-diagrams`

### Структура запроса

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

### Параметры запроса

| Поле       | Тип      | Обязательное | Описание                            |
| ---------- | -------- | ------------ | ----------------------------------- |
| **id**     | `string` | ✅           | Внешний идентификатор процесса      |
| **xml**    | `string` | ✅           | XML тело диаграммы (экранированное) |
| **name**   | `string` | ✅           | Имя процесса (важно для обновлений) |
| **source** | `string` | ✅           | Источник версии для истории         |

### Структура ответа

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

### Важные особенности

-   **Максимум 20 диаграмм** в одном запросе
-   **Поле name критично** - не изменяйте в Storm для обновлений
-   **Версионность** - диаграммы с одинаковым ID обновляются по порядку
-   **История версий** - можно загружать разные версии в одном запросе

### Пример shell-скрипта для Camunda

::: tip Автоматизация для Camunda
Используйте этот скрипт для автоматического обновления диаграмм после деплоя:
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

## Управление элементами архитектуры

### Загрузка и обновление

**Путь:** `POST /public-api/v1/assets`

### Структура запроса

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

### Параметры запроса

| Поле            | Тип      | Обязательное | Описание                       |
| --------------- | -------- | ------------ | ------------------------------ |
| **id**          | `number` | 📎           | ID элемента в системе          |
| **externalId**  | `string` | 📎           | ID элемента во внешней системе |
| **name**        | `string` | ✅           | Название элемента              |
| **description** | `string` | 📄           | HTML описание (unescaped)      |
| **externalUrl** | `string` | 📄           | Ссылка с плейсхолдерами        |
| **type**        | `enum`   | 📄           | Тип элемента архитектуры       |
| **status**      | `enum`   | 📄           | Статус элемента                |

### Типы элементов архитектуры

| Значение        | Описание                     |
| --------------- | ---------------------------- |
| `UNSPECIFIED`   | Не определено (по умолчанию) |
| `DOCUMENT`      | Документ                     |
| `SYSTEM`        | Система                      |
| `COMMUNICATION` | Коммуникация                 |
| `CLIENT`        | Клиент                       |
| `ENTITY`        | Сущность                     |
| `ACTION`        | Действие                     |
| `OTHER`         | Прочее                       |

### Статусы элементов

| Значение          | Описание              |
| ----------------- | --------------------- |
| `NEW`             | Новый                 |
| `TRIAL`           | Тестирование          |
| `PRODUCTION`      | Продакшн              |
| `DECOMMISSIONING` | Вывод из эксплуатации |
| `ARCHIVE`         | Архив                 |

### Логика обновления

| Условие                  | Действие                     |
| ------------------------ | ---------------------------- |
| **Только externalId**    | Обновление по внешнему ID    |
| **Только id**            | Обновление по внутреннему ID |
| **И id, и externalId**   | Обновление по внутреннему ID |
| **Ни id, ни externalId** | Создание нового элемента     |

---

## Получение списка диаграмм

### Основной метод

**Путь:** `GET /public-api/v1/get-diagram-list`

### Query-параметры

| Параметр | Тип      | Обязательный | Описание             |
| -------- | -------- | ------------ | -------------------- |
| **page** | `number` | ✅           | Номер страницы (с 0) |

### Структура ответа

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

::: info Права доступа
Список диаграмм зависит от прав администратора команды на диаграммы.
:::

---

## Получение диаграммы по ID

### Основной метод

**Путь:** `GET /public-api/v1/get-diagram-by-id`

### Query-параметры

| Параметр      | Тип    | Обязательный | Описание                           |
| ------------- | ------ | ------------ | ---------------------------------- |
| **diagramId** | `UUID` | ✅           | Уникальный идентификатор диаграммы |

### Ключевые поля ответа

| Поле              | Тип      | Описание                 |
| ----------------- | -------- | ------------------------ |
| **id**            | `UUID`   | Идентификатор диаграммы  |
| **name**          | `string` | Название диаграммы       |
| **body**          | `string` | XML содержимое диаграммы |
| **versionNumber** | `number` | Номер версии             |
| **status**        | `string` | Статус диаграммы         |
| **type**          | `string` | Тип диаграммы            |

::: warning Изменения контракта
Контракт API может измениться. Используйте tolerant reader для получения нужных полей (обычно это поле `body`).
:::

---

## Обновление описания элемента

### Основной метод

**Путь:** `POST /public-api/v1/element-description/{diagramId}/{elementId}`

### Параметры пути

| Параметр      | Тип      | Описание                |
| ------------- | -------- | ----------------------- |
| **diagramId** | `UUID`   | Идентификатор диаграммы |
| **elementId** | `string` | Идентификатор элемента  |

### Структура запроса

```json
{
    "description": "Подробное описание элемента",
    "duration": 3600,
    "externalLink": "https://wiki.company.com/process"
}
```

### Параметры запроса

| Поле             | Тип      | Описание                       |
| ---------------- | -------- | ------------------------------ |
| **description**  | `string` | HTML описание (экранированное) |
| **duration**     | `number` | Длительность в секундах        |
| **externalLink** | `string` | Внешняя ссылка                 |

---

## Получение согласований

### Основной метод

**Путь:** `GET /public-api/v1/approvals`

### Query-параметры

| Параметр       | Тип       | Обязательный | Описание                |
| -------------- | --------- | ------------ | ----------------------- |
| **userEmail**  | `string`  | ✅           | Email участника команды |
| **status**     | `enum`    | 📄           | Статус согласования     |
| **isApprover** | `boolean` | 📄           | Признак согласующего    |

### Статусы согласований

| Значение    | Описание             |
| ----------- | -------------------- |
| `PENDING`   | Ожидает согласования |
| `ACCEPTED`  | Принято              |
| `DECLINED`  | Отклонено            |
| `COMPLETED` | Завершено            |

### Структура ответа

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
