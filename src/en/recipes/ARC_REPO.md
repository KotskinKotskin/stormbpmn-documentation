---
source_hash: 2cc6a1779cb6d54c
---
# Architectural Repository {#архитектурныи-репозитории}

This article explains how to establish a unified workspace for architects and business analysts and ensure traceability of architectural element usage in processes.

## Task Description {#описание-задачи}

Many organizations have two roles related to processes: architects and analysts. However, they interact with processes differently and solve different tasks within the process context. "Architects" is a label for those who solve the specified tasks. They may also be referred to as System, Enterprise, Solution, etc.

### Architect tasks: {#задачи-архитекторов}

-   Ensure a clear and up-to-date description of the architecture of systems, applications, servers, and so on.
-   Track changes in the architecture and their impact on business processes.
-   Manage the catalog of architectural components and their interrelationships.
-   Control the compliance of process implementation with architectural principles and standards.
-   Ensure integrative compatibility between various systems within processes.
-   Conduct analysis of architectural risks and their impact on critical business processes.
-   Plan architectural evolution taking into account the development of the organization's process model.
-   Define technical requirements for process support systems.
-   Develop key performance indicators (KPIs) for processes.
-   Coordinate the implementation of process changes with IT departments.

### Analyst tasks: {#задачи-аналитиков}

-   Provide a clear and up-to-date description of business processes, including the surrounding context such as systems, documents, and so on.
-   Analyze the efficiency of current processes and identify bottlenecks.
-   Model optimized processes taking architectural constraints into account.
-   Document requirements for information systems from the perspective of business processes.
-   Ensure that processes comply with regulatory requirements and standards.
-   Conduct an analysis of the impact of process changes on the IT landscape architecture.
-   Ensure traceability of business requirements to architectural decisions.

### Role Interaction {#взаимодеиствие-ролеи}

The intersection area contains the **Architectural Components Catalog and Process Tracing**, where both roles collaborate on:

-   Unified description of architectural elements
-   Linking business processes with technical components
-   Ensuring data currency and consistency
-   Tracing changes from business requirements to architecture

## Solving the problem in Stormbpmn {#решение-задачи-в-stormbpmn}

To solve the described problems, the organization must implement two systems with established integration between them:

-   **System for describing architectural components and their relationships** (e.g., DocHub)
-   **Stormbpmn process management system**

### Principles of Responsibility Separation {#принципы-разделения-ответственности}

**TL;DR:** Architectural descriptions are not stored in Stormbpmn.

As of June 2025, Stormbpmn is a tool for process analysts and consumers of their work — employees, managers, and other stakeholders. We have intentionally limited the model for describing architectural elements and do not support their independent (outside the context of business processes) linking and tracing.

### Architectural Element Model in Stormbpmn {#модель-архитектурного-элемента-в-stormbpmn}

The architectural element model in Stormbpmn contains the following attributes:

-   **Name** — human-readable name of the element
-   **Type** — predefined types (System, Document, etc.) or custom types
-   **Element Color** — for visual separation on diagrams
-   **External System ID** — identifier in the architects' system
-   **External System Link** — direct link to the detailed description
-   **Text Description** — brief description of the element's purpose
-   **Status** — element lifecycle:
    -   New
    -   Being Implemented
    -   In Operation
    -   Decommissioning
    -   Archive
-   **Link to Tasks** — establishes a connection to processes through tasks

### Sufficiency of the model for different roles {#достаточность-модели-для-разных-ролеи}

**For business analysts**, this model fully addresses the following tasks:

-   Tracing architectural elements to processes
-   Visualizing connections between processes and systems
-   Analyzing the impact of architecture changes on processes

**For architects**, this model is insufficient, as it does not cover:

-   Detailed description of technical characteristics
-   Complex interdependencies between architectural components
-   Architectural patterns and design principles
-   Version control of architectural decisions

### Bridging Two Worlds {#как-подружить-2-мира}

We propose addressing this issue through integration and specific agreements:

1. **Single source of architectural components** — all architectural components are stored and described in a system for describing architectural components and linking architectural components (for example, DocHub).

2. **Automatic synchronization** — the architectural component description system delivers their representation in Stormbpmn format via the [REST API](/en/REST%20API/diagrams.md#управление-элементами-архитектуры) upon the creation, deletion, or modification of elements.

3. **Access rights separation** — analysts are prohibited from creating or editing architectural elements in Stormbpmn at the access rights level.

4. **Analytical queries** — usage and tracing queries are performed at the SQL and DWH level, as Stormbpmn implements a high-quality database table model that allows obtaining any required information through JOINs.

### Advantages of the Proposed Approach {#преимущества-предлагаемого-подхода}

**For architects:**

-   A consistent world model between architects and analysts
-   The ability to run analytical queries in a few SQL queries with guaranteed data accuracy
-   A single source of truth for all architectural components
-   Automatic synchronization of changes

**For business analysts:**

-   Direct access to detailed descriptions of architectural elements via external links
-   Up-to-date information on architectural components without the need for manual updates
-   The ability to visualize the tracing of elements to processes
-   A simplified model for working with processes

**For the organization as a whole:**

-   Elimination of data duplication
-   Reduced risk of information desynchronization
-   Clear division of responsibility between roles
-   Improved quality of architectural decisions

### Technical Implementation {#техническая-реализация}

The following API methods are used to implement the integration:

-   **[POST /public-api/v1/assets](/en/REST%20API/diagrams.md#загрузка-и-обновление)** — uploading and updating architecture elements
-   **[GET /public-api/v1/get-diagram-list](/en/REST%20API/diagrams.md#получение-списка-диаграмм)** — retrieving the list of diagrams for analysis
-   **SQL queries to the DB** — for complex analytical tasks and report generation
