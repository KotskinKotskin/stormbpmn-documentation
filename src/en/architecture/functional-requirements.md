---
title: Functional Requirements
order: 4
source_hash: 117090ac1d2045d5
---

[[toc]]

# Functional Requirements {#функциональные-требования}

Catalog of functional requirements for the platform: what the system can do in terms suitable for internal architecture reviews and deployment scope verification.

::: tip How to use the catalog
Copy the tables into your document and cross out the features you are not deploying in the first iteration. Requirements are grouped by module, and each has an identifier that is convenient to reference in review protocols and acceptance checks.

The "Type" column indicates whether a feature is included in the base delivery: **base** — always available, **option** — enabled via configuration or requires a separate license.
:::

## Notations {#обозначения}

| Notation | Meaning |
| --- | --- |
| FR-1xx … FR-14xx | Requirement identifier by modules |
| Base | Function of the base delivery |
| Option | Requires enabling, a separate component, or a separate license |

## FR-1xx. Process Modeling {#fr-1xx-моделирование-процессов}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-101 | Creation of business process models in BPMN 2.0 notation in the web editor without client installation | Base |
| FR-102 | Creation of models in other supported notations, including data flow diagrams and information flow schemas | Base |
| FR-103 | Creation of a model from a template, including from a team corporate template | Base |
| FR-104 | Automatic saving of changes during work | Base |
| FR-105 | Maintenance of model version history with indication of author and time of change | Base |
| FR-106 | Viewing and comparing model versions | Base |
| FR-107 | Restoration of a model from a previous version | Base |
| FR-108 | Simultaneous work of multiple users on one model | Base (Redis for multiple instances) |
| FR-109 | Description of diagram elements: text descriptions, attribute values | Base |
| FR-110 | Linking diagram elements with roles and architecture elements | Base |
| FR-111 | References between models: transition from an element to a subprocess or related model | Base |
| FR-112 | Validation of the model for compliance with notation rules and assessment of model quality | Base |
| FR-113 | Copying, moving, and duplicating models between folders | Base |
| FR-114 | Import of models in BPMN XML format, including bulk import via API | Base |
| FR-115 | Export of a model in BPMN XML format | Base |
| FR-116 | Export of a model image | Base |
| FR-117 | Generation of a document for a model in PDF format | Option (Gotenberg) |
| FR-118 | Generation of diagrams using PlantUML | Option (PlantUML) |
| FR-119 | Attaching files to models and elements | Base (S3) |

## FR-2xx. Material Organization and Search {#fr-2xx-организация-материалов-и-поиск}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-201 | Folder hierarchy for storing process models | Base |
| FR-202 | Moving models and folders within the tree | Base |
| FR-203 | Tags and labels for classifying process models | Base |
| FR-204 | Searching process models by name and content | Base |
| FR-205 | Semantic search across platform materials | Base (pgvector) |
| FR-206 | Filtering the process model list by status, author, folder, and tags | Base |
| FR-207 | Personal sections: My Models, Favorites, Recent | Base |
| FR-208 | "Tasks" section with actions assigned to the user | Base |
| FR-209 | Portfolio view: summary dashboards for processes and catalogs | Base |

## FR-3xx. Approval and Process Model Lifecycle {#fr-3xx-согласование-и-жизненныи-цикл-модели}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-301 | Process model statuses: "New", "In Progress", "Under Review", "Ready", "Archived" | Base |
| FR-302 | Submission of a process model for approval to a list of approvers | Base |
| FR-303 | Linking an approval request to a specific version of the process model | Base |
| FR-304 | Automatic closure of outdated requests upon submission of a new version | Base |
| FR-305 | Approver decision of "approved" or "rejected" with a comment | Base |
| FR-306 | Prohibition of changing the process model status from "Under Review" until all decisions are received | Base |
| FR-307 | Restriction of access to the process model to read-only level in "Under Review", "Ready", and "Archived" statuses | Base |
| FR-308 | Approval registry: incoming and outgoing requests for the user | Base |
| FR-309 | Notification to the author upon completion of the approval process, via the interface and email | Base (SMTP) |
| FR-310 | Submission of an approval request to a person not yet in the system, with subsequent linking to their account | Base |
| FR-311 | Commenting on the process model, including linking a comment to a diagram element | Base |

## FR-4xx. Process Registry {#fr-4xx-реестр-процессов}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-401 | Maintenance of process cards with name, description, and owner | Base |
| FR-402 | Process hierarchy and levels of detail | Base |
| FR-403 | Configurable process statuses with specification of the initial status | Base |
| FR-404 | Validation of mandatory fields upon status change | Base |
| FR-405 | Custom fields of arbitrary types for cards | Base |
| FR-406 | Custom reference lists and their values | Base |
| FR-407 | Linking one or more process models to a process card | Base |
| FR-408 | Reusable process flag | Base |
| FR-409 | Key performance indicators for the process | Base |
| FR-410 | Registry views: tree, table, graphical visualization | Base |
| FR-411 | Filtering and search in the registry considering user permissions | Base |
| FR-412 | Export of the process registry to a tabular format | Base |
| FR-413 | Import of processes from a tabular file | Base |
| FR-414 | Display of process links to roles, departments, and information systems | Base |

## FR-5xx. Org Structure and Roles {#fr-5xx-организационная-структура-и-роли}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-501 | Maintenance of the org structure: departments and their hierarchy | Base |
| FR-502 | Maintenance of employees and their affiliation with departments | Base |
| FR-503 | Organization roles registry | Base |
| FR-504 | Linking roles to departments and employees | Base |
| FR-505 | Linking roles to process model elements | Base |
| FR-506 | Import and export of the org structure in tabular format | Base |
| FR-507 | Common org structure for all installation teams | Option (`enableCommonUsers`) |
| FR-508 | Common roles registry for all installation teams | Option (`enableCommonRoles`) |

## FR-6xx. Architecture and Information Systems {#fr-6xx-архитектура-и-информационные-системы}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-601 | Maintenance of the registry of architecture elements: information systems and their components | Base |
| FR-602 | Types and statuses of architecture elements: new, pilot, operation, decommissioning, archive | Base |
| FR-603 | Linking architecture elements with process model elements | Base |
| FR-604 | Graphical representation of links between processes and information systems | Base |
| FR-605 | Loading and updating of architecture elements via REST API | Base |
| FR-606 | Common registry of architecture elements for all installation teams | Option (`enableCommonAssets`) |

## FR-7xx. Wikis and Regulations {#fr-7xx-вики-и-регламенты}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-701 | Maintenance of wiki pages with formatted text and tables | Base |
| FR-702 | Hierarchy of wiki pages | Base |
| FR-703 | Insertion into pages of process models, process cards, and other system objects | Base |
| FR-704 | Publication of pages for reading by participants | Base |
| FR-705 | Access restrictions to wiki pages and branches | Base |
| FR-706 | Import and export of wiki pages | Base |

## FR-8xx. Collaboration and Access {#fr-8xx-совместная-работа-и-доступ}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-801 | Workspaces (teams) with their own member composition and materials | Base |
| FR-802 | Inviting team members via email address | Base |
| FR-803 | Team member permissions: administrator, read and write, read-only, view | Base |
| FR-804 | Permission groups with a configurable set of privileges | Base |
| FR-805 | Granting personal access to a specific process model with an access level | Base |
| FR-806 | Granting access to a folder with propagation to nested objects | Base |
| FR-807 | "Allow" and "Deny" rules on folders and wiki pages with inheritance | Base |
| FR-808 | Access to a process model via link for unauthenticated users | Option, disabled `STORM_DISABLE_ANON_SHARING` |
| FR-809 | Public access mode for all process models in the installation | Option (`allDiagramsAnonAccess`) |
| FR-810 | Administrative team with access to all materials in the installation | Option |
| FR-811 | Hiding a specific process model from everyone except the author | Base |

## FR-9xx. Notifications {#fr-9xx-уведомления}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-901 | In-interface notifications for events: approval request, decision, comment | Base |
| FR-902 | Emails for events: team invitation, approval request, approval completion, new comment, access grant | Base (SMTP) |
| FR-903 | Configurable email templates | Base |
| FR-904 | Disabling email notifications by the user in the profile | Base |
| FR-905 | Advanced templated mass mailings | Option (ListMonk) |

## FR-10xx. Surveys and Feedback {#fr-10xx-опросы-и-обратная-связь}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-1001 | Creating surveys for processes and process models | Base |
| FR-1002 | Collecting participant responses | Base |
| FR-1003 | Viewing survey results | Base |

## FR-11xx. Integrations and API {#fr-11xx-интеграции-и-api}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-1101 | REST API for reading and writing process models, architecture elements, registry, and org structure | Base |
| FR-1102 | API request authentication via team key | Base |
| FR-1103 | Bulk upload of models from external systems, including exports from process execution engines | Base |
| FR-1104 | Retrieval of approvals and their statuses via API | Base |
| FR-1105 | Exposing application metrics in Prometheus format | Base |
| FR-1106 | Forwarding the action log to an external system via the syslog protocol | Base |

## FR-12xx. AI Assistant {#fr-12xx-ai-ассистент}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-1201 | Conversational assistant for platform materials | Option (AI module) |
| FR-1202 | Knowledge base for organizational documents with semantic search | Option |
| FR-1203 | Preparation and modification of process models based on textual descriptions | Option |
| FR-1204 | Attaching files to the dialogue for analysis | Option |
| FR-1205 | Voice input for queries | Option |
| FR-1206 | Operation with a language model deployed within the customer's environment | Option |

Composition and configuration — see the [AI Assistant](/en/ai/README.md) section.

## FR-13xx. Simulation modeling {#fr-13xx-имитационное-моделирование}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-1301 | Configuration of simulation parameters for the process model: intensity, durations, resources | Option (separate license) |
| FR-1302 | Running a simulation experiment and obtaining results | Option |
| FR-1303 | Assessment of resource utilization, execution time, and process cost | Option |
| FR-1304 | Comparison of "as-is" and "to-be" scenarios | Option |

Composition and configuration — see the [Simulations](/en/simulation/README.md) section.

## FR-14xx. Administration {#fr-14xx-администрирование}

| ID | Requirement | Type |
| --- | --- | --- |
| FR-1401 | Administrative panel with installation settings | Base |
| FR-1402 | Authentication configuration via corporate IdP | Base |
| FR-1403 | Disabling built-in authentication and registration form | Base |
| FR-1404 | User management for the installation: enabling and disabling accounts | Base |
| FR-1405 | Monitoring of occupied license seats and license status | Base |
| FR-1406 | Mail server configuration and email sending verification | Base |
| FR-1407 | Audit logging configuration and channel selection: console, syslog, separate database | Base |
| FR-1408 | Restriction of request sources (CORS) and session parameters | Base |
| FR-1409 | Configuration of the installation appearance and menu sections | Base |
| FR-1410 | System update via container image update | Base |

## Decision Boundaries {#границы-решения}

To avoid inflated expectations during review, it is useful to define what the system does not do:

- **Does not execute processes.** Stormbpmn describes and approves processes but is not an execution engine: process instances are not started, and tasks are not routed to assignees.
  Models can be passed to execution systems via API.
- **Does not replace the corporate directory.** User accounts are managed in the IdP; the system stores profiles and permissions within workspaces.
- **Is not an electronic document management system.** Approval applies to process models within the platform and does not replace legally significant document workflows.
- **Does not maintain accounting or HR records.** The org structure is used to link processes with roles and departments, not for HR operations.
