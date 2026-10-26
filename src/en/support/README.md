---
dir:
  order: 8
  link: true
  text: 8. Technical Support
  collapsible: false
order: 8
source_hash: f89384801f5fd313
---

[[toc]]

# Support Channels {#каналы-поддержки}

> 🆘 **Something broke or you have a question?** Where to write, what to attach to your request to get help quickly, and what the response time guarantees (SLA) are — all here.

### Available Communication Channels {#доступные-способы-связи}

| Channel            | Description                                     | Availability | Response Time    |
| ---------------- | -------------------------------------------- | ----------- | --------------- |
| **Email**        | help@stormbpmn.com                           | All versions  | Up to 16 hours     |
| **Telegram bot** | [@Stormbpmn_bot](https://t.me/stormbpmn_bot) | All versions  | Quick questions |

### Selecting a communication channel {#выбор-канала-связи}

-   **Email** - for detailed inquiries with attachments
-   **Telegram** - for urgent questions

---

## Diagnostic Information {#информация-для-диагностики}

### Required Information {#обязательная-информация}

When contacting support, you **must** provide the following:

| Issue Type                | Required Information                                              |
| --------------------------- | ------------------------------------------------------------------- |
| **User Error** | Browser version, HAR archive, user email, link to the diagram |
| **Server Error**        | Container image version, container logs, system configuration     |
| **Technical Issue**    | Scenario description, reproduction steps, expected result        |

### Detailed checklist {#детальныи-чек-лист}

-   [ ] **Browser version** _(for UI issues)_
-   [ ] **Container image version** _(for Enterprise)_
-   [ ] **HAR archive** _(recorded at the time of the error)_
-   [ ] **Container logs** _(current)_
-   [ ] **Reproduction scenario** _(step-by-step)_
-   [ ] **User email** _(for account issues)_
-   [ ] **Diagram link** _(if the issue is with a specific diagram)_
-   [ ] **System configuration** _(docker-compose.yml, ENV variables)_
-   [ ] **Contents of the sm_settings table**

::: tip HAR archive
The [instructions for creating a HAR archive](https://yandex.cloud/ru/docs/support/create-har) will help us quickly diagnose browser issues.
:::

---

## Diagnostic Commands {#команды-диагностики}

### Docker commands {#docker-команды}

**Viewing the image version:**

```bash
docker ps -a --format '{{.ID}} {{.Image}} {{.Names}}'
```

**Collecting container logs:**

```bash
# Просмотр логов
docker logs <container_name_or_id>

# Сохранение в файл
docker logs stormbpmn > logs_$(date +%Y%m%d_%H%M%S).txt

# Последние 1000 строк
docker logs --tail 1000 stormbpmn > recent_logs.txt
```

---

## SLA (Service Level Agreement) {#sla-соглашение-об-уровне-обслуживания}

### Version Guarantees {#гарантии-по-версиям}

| Metric                       | Team (Cloud)    | Enterprise      |
| ---------------------------- | --------------- | --------------- |
| **Response Time**            | 5 business days | 16 hours        |
| **Critical Failures**        | 30 business days| 15 business days|
| **Support Priority**         | Standard        | High            |
| **Technical Consulting**     | Basic           | Extended        |

### Working Hours {#рабочее-время}

-   **Working Hours:** 11:00 - 20:00 MSK (GMT+3)
-   **Working Days:** Monday - Friday
-   **Days Off:** In accordance with the Labor Code of the Russian Federation

### Critical Failures {#критические-неисправности}

**A failure is considered critical if:**

-   System access is impossible for 100% of users
-   The service is completely unavailable

---

## Self-Service {#самообслуживание}

### Knowledge Base {#база-знании}

-   **[Configuration](../configure/README.md)** - system configuration
-   **[Maintenance](../operation/README.md)** - administration
-   **[Security](/en/configure/security/)** - security settings
-   **[Production](/en/install/production/)** - deployment

### Finding Solutions {#поиск-решении}

1. **Check the documentation** - most questions are already covered
2. **Review the logs** - they often contain hints about the issue
3. **Check the configuration** - ensure the settings are correct
4. **Contact support** - if you cannot resolve the issue on your own

::: tip Effective Request
The more detailed your problem description and the diagnostic information you provide, the faster we can help!
:::

---

## Feedback {#обратная-связь}

### Improvement Suggestions {#предложения-улучшении}

Your ideas help us improve:

-   **New features** - what you would like to see in the product ([roadmap.stormbpmn.com](https://roadmap.stormbpmn.com))
-   **UX improvements** - how to make the interface more convenient
-   **Documentation** - which sections need to be expanded
-   **Support** - how to improve the service
