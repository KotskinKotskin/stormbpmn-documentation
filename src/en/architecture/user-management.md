---
title: User Management
order: 3
source_hash: 4496dcfe3cb92436
---

[[toc]]

# User Management {#управление-пользователями}

This section describes the full lifecycle of a user account: how an employee appears in the system, how they obtain permissions, what happens when their role changes, and how access is terminated. This is the artifact requested during architectural reviews under the name "user management process."

Process diagram — [DFD-3](./processes.md#dfd-3-управление-пользователями-и-правами).

## Where the Account Resides {#где-живет-учетная-запись}

In an enterprise scenario, the source of truth for employee data remains the **corporate directory**:
accounts are created, blocked, and deleted there, while Stormbpmn receives confirmed
attributes upon login.

| What | Where Stored | Who Manages |
| --- | --- | --- |
| Employee existence, password, second factors | Corporate IdP (Keycloak, ADFS, Azure AD, etc.) | HR department, IdP owner |
| System profile: email, full name, position, interface language | Stormbpmn | Populated from IdP upon login, edited by the user |
| Team membership and team rights | Stormbpmn | Team administrator |
| Permission groups and privileges | Stormbpmn | Team administrator |
| Access restrictions to folders and wiki | Stormbpmn | Team administrator, folder owner |
| Occupied license seat | Stormbpmn | Calculated by the system |

::: tip The system does not maintain a separate user directory
Stormbpmn does not replace the corporate directory and does not store employee passwords if
corporate authentication is enabled. Built-in authentication by login and password is disabled
in a production installation using the variable `STORM_DISABLE_SIMPLE_AUTH`.
:::

## Authentication Methods {#способы-аутентификации}

| Method | When Applied | Configuration |
| --- | --- | --- |
| OAuth2 / OIDC, PKCE mode | Recommended for corporate installations | [Authorization System](/en/configure/security/authorization.md) |
| OAuth2, implicit mode (legacy) | Provider does not support PKCE or issues an opaque token | Same as above |
| Microsoft ADFS | Installations with ADFS | Same as above |
| Built-in authentication | Pilots and test environments without directory integration | Disabled in the product |
| LDAP | Deprecated method, not recommended for new installations | Instructions — via the manager |

The session lifetime is set by the variable `SESSION_EXPIRATION`. By default, after login, the system issues its own token and operates independently of the provider. If the security policy requires that a session revocation in the provider immediately logs the user out, [session binding to SSO](/en/configure/security/sso-session-binding.md) is enabled: the token is refreshed via `refresh_token`, and revocation in the IdP stops operation in StormBPMN.

## Account Lifecycle {#жизненныи-цикл-учетнои-записи}

| Stage | Event | What Happens in the System | Who Initiates |
| --- | --- | --- | --- |
| 1. Employee Onboarding | Employee is added to the corporate directory | Nothing happens in StormBPMN: the system does not poll the directory | HR Department |
| 2. First Login | Employee opens the system URL and authenticates via the IdP | A profile is created based on verified attributes: email, full name. A license seat is occupied | Employee |
| 3. Team Invitation | Team administrator adds the employee by email address | A participant is created with the status "Invited," and an email is sent. Upon acceptance, the status changes to "Member" | Team Administrator |
| 4. Permission Assignment | Administrator sets permissions within the team and adds the participant to permission groups | Permissions take effect immediately | Team Administrator |
| 5. Role Change | Employee transfer, change of duties | Permissions within the team or group membership are changed; folder access rules are updated if necessary | Team Administrator |
| 6. Access Suspension | Employee is on extended leave, incident investigation | Blocking in the IdP prevents login. Additionally, the account can be disabled in the administrative panel | IdP Owner, System Administrator |
| 7. Access Termination | Employee termination | The account is blocked in the IdP; the team administrator removes the participant from teams, releasing permissions | IdP Owner, Team Administrator |
| 8. Profile Deletion | Data retention policy requirement | The account is deleted, and the license seat is released | System Administrator |

::: warning Blocking in the IdP does not remove team membership
If an employee is blocked only in the directory, they will not be able to log in, but they will remain in team participant lists and assigned permission groups. To properly revoke access, remove them from teams; otherwise, access will be automatically restored when the account is unblocked in the directory.
:::

### How an employee joins the system {#как-сотрудник-попадает-в-систему}

Three methods are supported; the first two are typically used in corporate deployments.

1. **Self-service login via the corporate directory.** The profile is created upon the first successful login based on attributes from the provider (email is required; full name is included if the provider supplies it). No separate request is needed: the right to log in is determined by the employee being present in the directory and having access to the application granted on the IdP side.
2. **Team invitation.** The team administrator specifies email addresses. Individuals not yet in the system receive an invitation email; the account is created when the person logs in.
3. **Built-in registration.** A self-service registration form; disabled in production deployments via the `showRegistration` parameter.

::: tip Limiting the user base
Access to the application is restricted on the IdP side by assigning the application to specific directory groups. Additionally, the team administrator controls who joins workspaces and with what permissions.
:::

### What is stored in the profile {#что-хранится-в-профиле}

| Attribute | Source | Required |
| --- | --- | --- |
| Email address | IdP or registration | Yes, serves as the identifier |
| Full name, first name, last name | IdP (synchronized on every login) or user input | No |
| Job title | User input | No |
| Interface language | User selection | No |
| Avatar | User upload | No |
| Creation date and last login date | System | Yes |
| Account enabled flag | System administrator | Yes |

The composition of personal data and its classification for the application card is described in the section
[Processed data](./system-design.md#обрабатываемые-данные).

### License Seats {#лицензионные-места}

A named license is occupied by an active user account, while a concurrent license is occupied by a simultaneous session.
If no seats are available upon first login, the account is created in the “Pending Activation” state: the person exists in the system but cannot work until an administrator frees or adds a seat. For details, see [How Licenses Work](/en/operation/License.md).

For the user management process, this means: **revoking access for terminated employees must be completed** — only freeing a seat allows onboarding a new employee without expanding the license.

## Terminating Access {#прекращение-доступа}

Procedure for termination or transfer:

1. Block or delete the account in the corporate directory — access is terminated immediately.
2. Remove the participant from all teams — permissions are revoked and the workspace slot is freed.
3. Check personal access rights granted to this person for specific process models and folders.
4. Transfer models where the terminated employee was the author to another employee, if required by the procedure.
5. Delete the account if necessary to free up a license slot.

::: tip Models remain in the system
Deleting an account does not delete the models, process cards, and comments created by it — these are the organization's working materials. Authorship is preserved in the version history.
:::

## User Operations Audit {#аудит-операции-с-пользователями}

All actions are processed through the REST API and logged in the action log. The log records logins and logouts, data access requests, and changes to permissions and settings; each entry includes the timestamp, user identifier, session, request method and path, response code, and client address.

The log is directed to one of the following channels: output to the container console, transmission to a SIEM via the syslog protocol, or writing to a separate TimescaleDB database for long-term storage and incident analysis. The activation order and entry structure are described in [Audit Logging](/en/configure/security/audit-logging.md).

## Information Security Checklist {#чек-лист-для-службы-информационнои-безопасности}

- [ ] Built-in authentication is disabled (`STORM_DISABLE_SIMPLE_AUTH`); access is only via IdP.
- [ ] Self-registration form is disabled (`showRegistration`).
- [ ] Access to the application in the IdP is granted to specific directory groups, not to all employees.
- [ ] A decision has been made on whether [session binding to SSO](/en/configure/security/sso-session-binding.md) is required, and the session lifetime has been configured.
- [ ] Team administrators and the procedure for requesting access rights have been defined.
- [ ] An audit channel and log retention period have been configured.
- [ ] The procedure for revoking access upon termination, including removal from teams, has been documented.
- [ ] A policy for periodic access rights review has been agreed upon.
