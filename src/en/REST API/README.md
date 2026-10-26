---
dir:
  order: 7
  link: true
  text: 7. REST API
  collapsible: true
index: true
order: 7
source_hash: b1563819dc5fd7fa
---

[[toc]]

# REST API {#rest-api}

The system provides a REST API for automating core tasks, such as retrieving and modifying diagrams, and managing architecture elements. The API operates over the HTTP protocol with JSON serialization.

::: warning Cloud version limitations
The cloud version enforces limitations on API usage regarding request rate and size.
:::

---

## Authentication {#авторизация}

### Obtaining the API Key {#получение-ключа-api}

To obtain the API key, follow these steps:

1. Navigate to the **"Team"** section
2. Open the **"Team Settings"** tab
3. Click **"Generate Key"**

![API Key Generation](../../REST%20API/api-1.png)

### Using the key {#использование-ключа}

| Parameter         | Value              | Description                                     |
| ---------------- | --------------------- | -------------------------------------------- |
| **Header**    | `X-Api-Key`           | Add to all API requests              |
| **Permissions**        | Team administrator | Actions are performed on behalf of the administrator |
| **Security** | Confidential       | Do not share the key with third parties            |

---

## Cloud Version Limitations {#ограничения-облачнои-версии}

### Default Limits {#лимиты-по-умолчанию}

| Parameter               | Value          | Description                                      |
| ---------------------- | ----------------- | --------------------------------------------- |
| **Request rate**  | 5 requests/minute | Check the `X-Rate-Limit-Remaining` header |
| **Request size**     | 10 MB             | Maximum size of a single request            |
| **Diagrams per request** | 20           | For diagram loading methods                 |

### Limit Exceeded {#превышение-лимитов}

**Upon reaching the quota:**

```json
{
    "timestamp": "2022-06-28T12:03:03.438+00:00",
    "status": 429,
    "error": "Too Many Requests",
    "message": "You have exhausted your API Request Quota",
    "path": "/public-api/v1/upload-diagrams"
}
```

**Response headers:**

-   `X-Rate-Limit-Remaining` - remaining requests
-   `X-Rate-Limit-Retry-After-Seconds` - wait time until the next attempt

::: danger Account Lockout
If the limit is exceeded more than 3 times within 24 hours, the account will be locked. Contact support to unlock it.
:::

---

## Reference sections {#разделы-справочника}

- **[Architecture diagrams and elements](./diagrams.md)** — uploading diagrams, architecture elements, retrieving lists/by ID, descriptions, approvals.
- **[Process metrics](./metrics.md)** — managing process metrics.
- **[Org structure](./org-structure.md)** — org units, positions, employees, relationships.

::: warning Changing architecture element types
Built-in architecture element types (except **Document** and **System**) are now classified as **Custom types**. This affects the format of API requests and data import rules.
:::

---

## Best Practices {#лучшие-практики}

### Query Optimization {#оптимизация-запросов}

| Recommendation           | Description                               |
| ---------------------- | -------------------------------------- |
| **Batch processing** | Send up to 20 diagrams at a time      |
| **Compliance with limits** | Monitor rate limit headers        |
| **Retry logic**       | Implement retries with backoff |
| **Logging**        | Store request IDs for debugging     |

### Security {#безопасность}

| Aspect            | Recommendation                             |
| ----------------- | ---------------------------------------- |
| **API keys**     | Store them in environment variables           |
| **HTTPS**         | Use only secure connections |
| **Access rights** | Restrict API key permissions           |
| **Rotation**       | Regularly update keys               |

### Monitoring {#мониторинг}

-   **Track limits** via response headers
-   **Log errors** for problem analysis
-   **Monitor API response time**
-   **Analyze quota usage**

::: tip CI/CD Integration
Integrate the API into deployment pipelines to automatically update diagrams after code changes.
:::

---

## Related sections {#связанные-разделы}

-   **[Configuration](/en/configure/README.md)** - system configuration
-   **[Security](/en/configure/security/)** - security settings
-   **[Support](/en/support/README.md)** - assistance with API issues
