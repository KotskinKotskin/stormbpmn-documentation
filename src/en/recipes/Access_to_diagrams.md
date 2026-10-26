---
source_hash: bda7e13e09e701a9
---
# Access Rights Separation for Diagrams {#разделение-прав-доступа-к-диаграммам}

Stormbpmn offers a powerful toolkit for managing access to process models. Numerous parameters influence the ability to view a specific diagram or a list of diagrams.

This article covers typical tasks and how to resolve them through system configuration.

## What affects access to a specific diagram {#что-влияет-на-получение-доступа-к-конкретнои-диаграмме}

Access to a specific diagram is affected by several factors in the following order:

### 1. Diagram Status {#_1-статус-диаграммы}

The diagram status determines the maximum access level to the diagram. If the diagram is in the following status:

-   "Ready"
-   "Under Review"
-   "Archive"

The maximum access level (regardless of other settings) is **READ**.

### 2. Server settings {#_2-настроики-сервера}

-   **ENV variable STORM_DISABLE_ANON_SHARING** — if set to `true`, **any unauthenticated** user will not have access to any process model, regardless of other settings.
-   **Setting allDiagramsAnonAccess** — if set to `true`, **any unauthenticated** user WILL have access to the process model **at least for reading**, regardless of other settings.

### 3. Diagram Publicity {#_3-публичность-диаграммы}

If the diagram is hidden (the "eye" button at the top), no one other than the author will have access to the diagram, regardless of other settings.

### 4. Diagram Access Settings {#_4-настроики-прав-диаграммы}

-   If **Link Access** is enabled in the "Share" settings of a specific diagram, any **unauthenticated** user will have **read-only** access to the diagram.
-   If a user's e-mail address is specified in the "Share" settings of a specific diagram, that user will have access to the diagram with the specified permissions.

### 5. Folder and Parent Folder Permission Settings {#_5-настроики-прав-на-папку-и-родительские-папки}

If the "Share" settings of the folder **or its parent folders** containing the diagram specify a user's e-mail address, that user will gain access to the diagrams in the folder with the specified permissions. Permissions propagate down the folder tree.

### 6. Participation in the diagram author's team {#_6-участие-в-команде-с-автором-диаграммы}

If the diagram author and the diagram reader belong to the same team, access checks will evaluate the **reader's** permissions, granting them access **for reading at a minimum**. For details on the permissions available to team members and how they are configured via groups, see [Team member roles and permissions](./Roles_and_privileges.md).

### 7. Reader — Administrator {#_7-читатель-—-администратор}

If the reader is part of the administrative team, they always have access to edit all diagrams.

## What affects access to process model lists in the table and folder structure {#что-влияет-на-получение-доступа-к-спискам-моделеи-в-таблице-и-структуре-папок}

### 1. Server settings {#_1-настроики-сервера}

**allDiagramsAnonAccess setting** — if set to `true`, **any authenticated** user will have access to lists of all diagrams for searching in the table.

### 2. Joining a team {#_2-вхождение-в-команду}

By default, any team member receives access to view process model lists and the folder structure.

### 3. Granular folder permissions within a team {#_3-гранулярные-права-на-папки-в-команде}

If a team member is denied read access to "Folders", they will not see the folder structure. For details on restrictions and inheritance, see the [Restricting access to folders and wiki](./Roles_and_privileges.md#ограничение-доступа-к-папкам-и-вики) section.

## Access configuration recipes {#рецепты-настроики-доступа}

### Recipe No. 1 — Multiple distinct teams, each performing its own tasks, occasionally sharing diagrams with one another {#рецепт-no1-—-много-разных-команд-каждая-делает-свое-изредка-показывая-схемы-друг-другу}

**Solution:** Create several distinct teams, configure nothing additional at the server level, and use diagram-level settings.

### Recipe No. 2 — Multiple different teams, each doing its own work, all constantly monitoring each other's work {#рецепт-no2-—-много-разных-команд-каждая-делает-свое-все-постоянно-смотрят-чужое}

**Solution:** Create several different teams and configure **allDiagramsAnonAccess** in `true`.

### Recipe No. 3 — One superuser wants to see all diagrams of all teams, while teams do not want to show anything to anyone {#рецепт-no3-—-один-суперпользователь-хочет-видеть-все-схемы-всех-команд-а-команды-не-хотят-ничего-никому-показывать}

**Solution:** The superuser must belong to the administrative team.

### Recipe No. 4 — We want a single folder structure for the entire server {#рецепт-no4-—-хотим-одну-структуру-папок-на-весь-сервер}

**Solution:** All participants must be grouped into a single team.

## Related documentation {#связанная-документация}

-   **[Team member roles and permissions](./Roles_and_privileges.md)** — member permissions, permission groups, and the full list of privileges
-   **[Information security](../configure/SECURE.md)** — public access settings and corporate parameters
