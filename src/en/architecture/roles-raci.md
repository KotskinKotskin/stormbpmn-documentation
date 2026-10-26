---
title: Role Model and RACI
order: 2
source_hash: ac0e50af7936149a
---

[[toc]]

# Role Model and RACI {#ролевая-модель-и-raci}

This section addresses two questions from the architectural review: how access control (RBAC) is structured within the system, and who in the organization is responsible for each process related to its operation (RACI).

## How permissions are composed {#как-складываются-права}

A participant's access is determined by three settings applied sequentially. Each subsequent setting can only **narrow** the result of the previous one: the final access equals the strictest of the restrictions.

| Level | Setting | Set by | Defines |
| --- | --- | --- | --- |
| 1 | Participant's team permission | Team administrator | Capability ceiling: administrator, read and write, read-only, view |
| 2 | Permission groups | Team administrator | Specific allowed actions on objects: folders, registry, reference books, org structure |
| 3 | Folder and wiki page restrictions | Team administrator or folder owner | Restricted areas: "allow" and "deny" rules with inheritance down the tree |

On top of these three levels, two additional restrictions apply that do not depend on permission settings:

- **Process model status.** In the "Under Review," "Ready," and "Archive" statuses, the process model is available for read-only access — regardless of the user's permissions.
- **Personal access grant.** The process model author or a participant with write permission can grant access to a specific process model or folder to an individual within their own privileges.

::: tip Full privilege matrix
The list of all privileges for system objects and their composition in default groups is in the article
[Team member roles and permissions](/en/recipes/Roles_and_privileges.md). The order of access checks for a specific process model is in the article
[Access rights separation for diagrams](/en/recipes/Access_to_diagrams.md).
:::

### Team Member Permission {#право-участника-в-команде}

| Permission | What it provides | Restrictions |
| --- | --- | --- |
| Administrator | Full rights within the team: members, permission groups, settings, all materials | — |
| Read and Write | Editing of team materials within the scope of assigned permission groups | Mandatory condition for editing other users' process models and granting access |
| Read Only | Reading team materials, full control over own process models | Other users' process models — view only |
| View | View-only workspace: reading content for which access is granted | Not included in permission groups; any granted access is downgraded to View |

::: warning The "View" permission cannot be bypassed
Even if such a member is added to a group with write permissions, the group's permissions will not take effect: the restriction is checked both when calculating permissions and when opening each process model.
:::

### Permission Groups {#группы-прав}

Privileges are not granted directly to an individual, but to a group; a participant receives permissions by joining a group.
When a team is created, three default groups are established: "Administrators", "Read and Edit", and "Read Only". Their composition can be modified, and custom groups can be created.
A participant can belong to multiple groups — permissions are cumulative.

### Access Restrictions for Folders and Wiki {#ограничение-доступа-к-папкам-и-вики}

| Setting | Options |
| --- | --- |
| Granted to | Entire team, individual member, permission group |
| Allowed actions | Read, modify, access management, full access |
| Rule type | Allow or deny; **deny always takes precedence over allow** |
| Inheritance | By default, applies to nested folders and pages; can be disabled |

The decision is made in the following order: team membership check → deny → allow → deny.
Read, modify, and access management are checked independently of each other.

## Standard Roles and Their Configuration {#типовые-роли-и-их-настроика}

The roles below are organizational: in the system, they are assembled from team permissions and permission groups. The table shows how they are typically configured. The composition can be adjusted to fit your processes.

| Organizational Role | Team Permission | Permission Group | Typical Tasks |
| --- | --- | --- | --- |
| Methodologist, Methodology Owner | Administrator | Administrators | Manages the registry structure, reference data, architecture elements, roles, and team settings |
| Business Analyst | Read and Modify | Read and Edit | Models processes, fills out cards, submits models for approval |
| Process Owner | Read and Modify | Read and Edit | Responsible for process content, initiates changes, and accepts the outcome |
| Approver | Read-only or Read and Modify | Read-only | Reviews models and makes approval decisions |
| Reader, Executor | View or Read-only | Read-only (no group is assigned for "View") | Reads approved models and process cards |
| Team Administrator | Administrator | Administrators | Manages participants, permission groups, and folder restrictions |
| System Administrator | No team permission required | — | Deploys and updates the system, responsible for configuration and backup |
| Information Security Service | No team permission required | — | Configures and monitors audit logging, verifies access rights |

::: tip System Administrator — Not a Team Administrator
These are different roles: the system administrator works with infrastructure, environment variables, and the administrative panel, while the team administrator works with participants and permissions within the workspace. Combining them in one person is not required.
:::

## Who Can Grant Access {#кто-может-выдавать-доступы}

To grant access to someone else's process model or folder, you must meet **all three** conditions:

1. Team permission — "Read and Edit" or "Administrator".
2. Privilege to modify team process models.
3. Permission to modify the folder containing the process model — if the folder is restricted.

The author of a process model grants access to it themselves, within the limits of their own privileges. The check is applied to the action itself, not just in the interface: it cannot be bypassed via the REST API or integrations.

## RACI Matrix for Processes {#матрица-raci-по-процессам}

The matrix describes the distribution of responsibilities during a typical deployment. R — Responsible, A — Accountable, C — Consulted, I — Informed.

| Process | Process Owner | Business Analyst | Methodologist | Approver | Team Administrator | System Administrator | Information Security Service |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Creating and editing a process model | A | R | C | — | — | — | — |
| Submitting a model for approval | A | R | I | I | — | — | — |
| Approving a model | C | I | I | R | — | — | — |
| Publishing a model (status "Ready") | A | R | C | I | — | — | — |
| Archiving an outdated model | A | R | C | — | — | — | — |
| Maintaining the process card in the registry | A | R | C | — | — | — | — |
| Configuring the registry structure, statuses, and fields | C | C | A/R | — | I | — | — |
| Maintaining reference data, roles, and architecture elements | C | C | A/R | — | I | — | — |
| Maintaining the org structure | C | R | A | — | I | — | — |
| Inviting participants to the team | I | I | C | — | A/R | I | I |
| Assigning permissions and groups | I | I | C | — | A/R | I | C |
| Restricting access to folders and wiki | C | I | C | — | A/R | — | C |
| Blocking and deleting a user account | I | — | — | — | R | A | C |
| Tracking license seats | — | — | I | — | R | A | I |
| Installing and updating the system | — | — | I | — | I | A/R | C |
| Configuring authentication and IdP integration | — | — | — | — | I | R | A |
| Configuring and monitoring audit logging | — | — | — | — | I | R | A |
| Backup and recovery | — | — | — | — | I | A/R | C |
| Monitoring and incident response | — | — | — | — | I | A/R | C |

::: warning The matrix is a starting point
The distribution depends on how process ownership is organized within the organization and who is responsible for methodology. Align the matrix with process owners before the project review: reviewers almost always ask who specifically makes the decision to publish a model and who is responsible for granting permissions.
:::

## Separation of Duties {#разделение-обязанностеи}

Recommendations typically expected by the information security department:

- **Rights are granted by someone other than the user.** Team administrators should not overlap with the main body of analysts; for large organizations, create separate teams for each department with their own administrators.
- **The approver does not coincide with the author.** The system allows sending a process model for approval to yourself, but such requests are meaningless — control is ensured by the procedure.
- **The system administrator is not required to have access to content.** For operation, they do not need membership in teams: configuration and updates are performed outside of workspaces.
- **View-only roles for a broad audience.** For employees who only need to read approved processes, grant the "View" permission: it does not allow modifying others' materials under any group settings.
- **Regular review of access rights.** The composition of participants and groups is exported by the team administrator; permission grant events are recorded in the [action log](/en/configure/security/audit-logging.md).
