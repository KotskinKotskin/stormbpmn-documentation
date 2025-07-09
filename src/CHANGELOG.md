---
dir:
    order: 8
    link: true
    text: 8. История изменений
    collapsible: false
order: 8
---

[[toc]]

# Актуальная версия и Changelog

Актуальная информация об обновлениях и новых возможностях StormBPMN Enterprise.

::: tip Актуальная версия
**Версия:** `6.6.1663`  
**Дата:** 09.07.2025  
**Образ:** `cr.selcloud.ru/stormbpmn-enterprise/stormbpmn_enterprise_experimental:6.6.1663`
:::

---

## Изменения в сборках

### 6.6.1662

Основные изменения:

🔧 Backend (Kotlin):

Удален PGConfig.kt (65 строк)
Рефакторинг ProcessStatusService, TeamService, OrgService
Обновления JPA сущностей (CustomfieldValueBase, Diagram, Process)
Изменения в конфигурации приложения


🎨 Frontend (Vue/TypeScript):
Организационная структура: масштабные изменения в useOrgItems.ts (+797 строк) и типах (+138 строк)
Редактор орг.структуры: переработка OrgStructureEditor.vue (+202 строки), удаление CustomNode.vue и NodeToolbar.vue
Кастомные поля: обновление логики и интерфейсов
Реестр: рефакторинг stores и типов
Онбординг: существенные изменения в стилях (+447 строк SCSS)
Платежи: обновление API и типов
Статистика: 85 файлов, +2456/-1199 строк

Суть: крупное обновление с фокусом на организационную структуру, реестр процессов, UX, устранение багов, в частности в Public API, /assets. Реестр процессов выходит в **Ранний доступ** и доступен для тестирования Enterprise клиентам.


## Последние пользовательские обновления

### v8.7.0 - Токены и цвета команды

**Подробности:** [Storm Updates v8.7.0](https://stormbpmn.com/blog/storm-updates/v870-token-i-cveta-komandy)
