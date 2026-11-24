---
dir:
  order: 7
  link: true
  text: 7. REST API
  collapsible: true
index: true
order: 7
source_hash: db6f9488c8b167bd
---

[[toc]]

# REST API {#rest-api}

The system provides a REST API for automating core tasks, such as retrieving and modifying diagrams, and managing architecture elements. The API operates over the HTTP protocol with JSON serialization.

::: warning Limits by plan
In the cloud at stormbpmn.com the API is available on the Team and Business plans and is rate limited. Enterprise (on your own servers) has no rate limits. See [Limits by plan](#ограничения-по-тарифам).
:::

Method addresses: all paths start with `/public-api/v1`.

-   in the cloud: `https://stormbpmn.com/public-api/v1/...`
-   in Enterprise: `https://<your Stormbpmn address>/public-api/v1/...`

---

## Authorization {#авторизация}

### Getting an API key {#получение-ключа-api}

The API key belongs to the team, not to an individual. Only a team administrator can create it.

1. Open **"Team settings"** → **"General settings"**.
2. In the **"API key"** card, click **"Generate"**.
3. Copy the key and store it, for example in an environment variable of your integration.

![API Key Generation](api-1.png)

A team has one key. If you generate the key again, the old one stops working immediately: replace the key in all integrations. Do the same if the key has leaked.

::: warning The API key and the MCP key are different keys
The MCP key is created in your profile (**"MCP keys"**) and starts with `sk_storm_`. It does not work for the REST API.
:::

### Using the key {#использование-ключа}

| Parameter        | Value              | Description                                              |
| ---------------- | ------------------ | -------------------------------------------------------- |
| **Header**       | `X-Api-Key`        | Pass it in every request                                 |
| **Permissions**  | Team administrator | Actions are performed on behalf of the team administrator |
| **Security**     | Confidential       | Do not share the key with third parties                  |

```bash
curl -H "X-Api-Key: YOUR_KEY" "https://stormbpmn.com/public-api/v1/get-diagram-list?page=0"
```

Requests run on behalf of a team administrator: the team creator if they are still an administrator, otherwise always the same other administrator. The API shows the models that this administrator can access, and they appear as the author of changes in the version history.

---

## Limits by plan {#ограничения-по-тарифам}

| Plan                           | API access | Request rate                    |
| ------------------------------ | ---------- | ------------------------------- |
| Personal                       | no         | —                               |
| Trial period                   | no         | —                               |
| Team                           | yes        | 1 request per second per team   |
| Business                       | yes        | 5 requests per second per team  |
| Enterprise (on your servers)   | yes        | unlimited                       |

The rate is counted per team: all integrations using the team's key share one limit, counted per second. Other plan limits also apply to the API: for example, if the new models in a batch do not fit within the plan's model limit, the whole batch is not uploaded. The account is not blocked for exceeding the rate; just repeat the request.

### Error responses {#ответы-с-ошибкои}

| Code | When | What to do |
| ---- | ---- | ---------- |
| `400`, `Missing Header: X-Api-Key` | the request has no `X-Api-Key` header | add the header |
| `400`, `"details": "Invalid team API key"` | the key is wrong or has been replaced by a new one | take the current key from the team settings |
| `403`, `"code": "PLAN_LIMIT"` | Personal plan or trial period, or the plan limit is exhausted (models, architecture elements) | switch to a suitable plan or free up space |
| `404` | the model or record is not found in the key's team, or there is no access | check the identifier |
| `429 Too Many Requests` | the request rate is exceeded | wait as many seconds as the `Retry-After` header says, then repeat |

Example of a `429` response:

```json
{
    "time": "2026-11-24T10:15:03.438+00:00",
    "message": "Too Many Requests",
    "details": "Превышена частота запросов к API: не больше 1 в секунду на вашем тарифе. Повторите позже или перейдите на Business",
    "code": "PLAN_LIMIT",
    "meta": null
}
```

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

-   **Key:** store it in an environment variable or a secrets vault, not in code or a public repository.
-   **Batches:** send up to 20 models per request and pause at least a second between requests on the Team plan.
-   **Retries:** on `429`, repeat the request after the pause from the `Retry-After` header; do not blindly retry other errors, check the response first.
-   **Responses:** read only the fields you need and do not fail when a new field appears: responses are extended over time.
-   **Rotation:** if the key leaks, generate a new one; the old one stops working.

::: tip CI/CD Integration
Integrate the API into deployment pipelines to automatically update diagrams after code changes.
:::

---

## Related sections {#связанные-разделы}

-   **[Configuration](/en/configure/README.md)** - system configuration
-   **[Security](/en/configure/security/)** - security settings
-   **[Support](/en/support/README.md)** - assistance with API issues
