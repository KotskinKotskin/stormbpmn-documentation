---
source_hash: f96c719b97ad4a50
---
# Team Member Roles and Permissions {#роли-и-права-участников-команды}

A participant's permissions in StormBPMn are determined by two settings applied sequentially:

1. **Team member permission** — the upper limit of a person's capabilities, assigned upon invitation.
2. **Permission groups** — what a person can do with system objects: folders, reference data, architecture elements, and org structure.

Each subsequent setting can only narrow the result of the previous one: the final access level equals the strictest of the restrictions.

::: tip Access to a specific diagram
This article describes permissions for **system objects**. For information on what affects opening a **specific process model** — statuses, anonymous access, folder shares, and the administrative command — see [Access Rights Separation for Diagrams](./Access_to_diagrams.md).
:::

::: warning Information is for reference purposes
The granular permissions of the role model are **continuously refined**: as new features are released, new objects and actions appear, and default permission group sets may change from release to release. This article describes the model as of the time of publication — the current set of privileges is always visible in the permission groups configuration interface.

If you are unsure how to configure permissions for your use case, or if the system behavior differs from what is described here, contact [technical support](../support/README.md): **help@stormbpmn.com**.
:::

## Team Member Role {#право-участника-в-команде}

Basic configuration. Defines which workspace the organization pays for and sets a ceiling that **cannot be raised** by permission groups or personal access grants to a diagram.

| Role                  | What it provides                                                                                          | Restrictions                                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Admin**              | Full rights in the team: managing members, permission groups, settings, and all materials                  | —                                                                                                                          |
| **Read and Write**     | Editing team materials within the scope of the permission groups the member belongs to                     | Mandatory requirement for editing others' diagrams and for granting access to other users                                   |
| **Read Only**          | Reading team materials. Full control over one's own diagrams is retained                                   | Others' diagrams are available for viewing only                                                                            |
| **View**               | View-only workspace: reading materials to which access is granted                                          | Cannot be part of permission groups. Any access level of "Edit" or "Comment" is downgraded to view                          |

Roles are changed in the team section: select members and click **"Change Roles"**.

::: warning The "View" role cannot be bypassed
Even if such a member is added to a group with edit permissions, the group's permissions **will not apply**. The restriction is checked twice: during permission calculation and when opening each diagram.
:::

Separate from roles, a member has a **status** reflecting the state of their account in the team:

-   **Invited** — an invitation has been sent but not yet accepted
-   **Member** — active in the team
-   **Admin** — team administrator

## Permission Groups {#группы-прав}

Privileges are not granted directly to an individual, but to a **group**; a member receives permissions by joining a group. When a team is created, three groups are automatically provisioned. Their composition can be modified, and custom groups can be created for your own processes.

| Group                      | Privileges | Permission Set                                                                                                                                                                    | Suitable For                                                                             |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Administrators**          | 72 of 72   | All privileges without exceptions                                                                                                                                                  | Methodology owners: manage reference data, architecture, org structure, and team settings      |
| **Read and Edit**           | 57 of 72   | Everything except 15 administrative privileges: managing architecture elements and roles, registry structure, reference data, surveys, team settings, and deleting team diagrams          | The majority of analysts: model processes using existing reference data            |
| **Read Only**           | 27 of 72   | Reading all objects, plus working with connections on the diagram and full control over their own diagrams                                                                              | Participants who read others' processes and maintain their own drafts                      |

### Rules to know when configuring {#правила-которые-важно-знать-при-настроике}

1. A user can belong to **multiple groups** — permissions are cumulative.
2. A user with the **"View"** permission is not included in groups: their permission ceiling overrides any group permissions.
3. If a user is **not included in any group**, they receive the set of permissions based on their team permission — access is not lost.
4. If a user is included in a group where **no privileges are checked**, they will have no permissions: an empty group is considered an intentional administrator configuration.

::: tip Why "Read-only" can change something
This set intentionally includes links between architecture elements and roles with diagram elements, as well as full control over their own diagrams. This allows a user to manage their drafts and annotate processes with ready-made reference data, without gaining the right to edit shared reference data or other users' diagrams.
:::

### All Privileges by Groups {#все-привилегии-по-группам}

The complete list of privileges that an administrator checks when configuring a group. The three columns show the composition of the default groups, and the last column represents the ceiling for a participant with the **"View"** right: it applies on top of any group the person is included in. The list is provided as of the time of publication and may be expanded — in case of discrepancies, refer to the group configuration interface.

| Object | Action | Administrators | Read and Edit | Read Only | "View" Right |
| --- | --- | :---: | :---: | :---: | :---: |
| __Folders__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Process Registry__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Process Registry Structure__ | Create | yes | — | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | — | — | — |
|  | Delete | yes | — | — | — |
| __My Models__ | Create | yes | yes | yes | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | yes | — |
|  | Delete | yes | yes | yes | — |
| __Team Models__ | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | — | — | — |
| __Architecture Elements__ | Create | yes | — | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | — | — | — |
|  | Delete | yes | — | — | — |
| __Links Between Architecture Elements and Diagram Elements__ | Create | yes | yes | yes | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | yes | — |
|  | Delete | yes | yes | yes | — |
| __Roles__ | Create | yes | — | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | — | — | — |
|  | Delete | yes | — | — | — |
| __Links Between Roles and Diagram Elements__ | Create | yes | yes | yes | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | yes | — |
|  | Delete | yes | yes | yes | — |
| __Org Structure Elements__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Org Structure Employees__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Links Between Org Structures__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Links Between Roles and Org Structure Elements__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Links Between Employees and Org Structure Elements__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Custom Fields__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __User Dictionaries__ | Create | yes | — | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | — | — | — |
| __Wikis__ | Create | yes | yes | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | yes | — | — |
| __Surveys__ | Create | yes | — | — | — |
|  | Read | yes | yes | yes | yes |
|  | Modify | yes | yes | — | — |
|  | Delete | yes | — | — | — |
| __Team Settings__ | View Section | yes | — | — | — |

## Access Restrictions for Folders and Wiki {#ограничение-доступа-к-папкам-и-вики}

A mechanism for organizations that need to restrict access to certain materials from the rest of the team. Access is configured at the diagram folder or wiki page level and applies to all content within.

| Setting            | Options                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Granted to**    | Entire team · individual user · permission group                                                                                              |
| **Permissions**  | Read · Modify · Manage access · Full access                                                                                       |
| **Rule type**      | Allow or Deny. **Deny always takes precedence over Allow**, regardless of who issued it                                                          |
| **Inheritance**     | By default, the rule applies to nested folders and pages; inheritance can be disabled — in which case, the rule applies only at its own level |

The decision is made as follows:

1. Verify that the user is a member of the team.
2. If there is a matching **deny** rule for the object — access is denied, and no further checks are performed.
3. If there is a matching **allow** rule — access is granted.
4. In all other cases, access is denied. Read, modify, and manage permissions are checked independently of each other.

::: tip
If no restrictions have been configured, the team's behavior remains unchanged: the mechanism is activated only upon the creation of the first rule.
:::

::: warning Folder restrictions take precedence over corporate access
The "entire team sees all diagrams" mode removes permission-based restrictions but **does not override closed folders**. This is intentional: the promise of a closed folder takes precedence over the general rule.

The only exception is **personal access granted for a specific diagram**: it overrides the folder restriction on editing.
:::

## Who Can Grant Access {#кто-может-выдавать-доступы}

Granting access to other users' diagrams and folders is a separate action with its own conditions. To grant access, you must meet **all three** of the following:

1. Team permission — **"Read and Edit"** or **"Admin"**.
2. Privilege to modify team diagrams.
3. Permission to modify the folder containing the diagram — if the folder is restricted.

The author of a diagram grants access to it themselves, within the scope of their own privileges. Granting access to a folder reveals all its contents, so it requires permission to modify the folder itself.

::: warning
The check is applied to the action itself, not just in the interface: it cannot be bypassed via the REST API or integrations.
:::

## Related documentation {#связанная-документация}

-   **[Access rights separation for diagrams](./Access_to_diagrams.md)** — what affects opening a specific process model
-   **[Information security](../configure/SECURE.md)** — public access settings and corporate parameters
-   **[Configuration](../configure/README.md)** — complete reference of settings
