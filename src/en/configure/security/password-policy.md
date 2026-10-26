---
title: Password Policy
order: 5
source_hash: cbf7473e835a0227
---

[[toc]]

# Password Policy {#политика-паролеи}

The Enterprise installation administrator defines rules for StormBPMN built-in login passwords: length and complexity,
lockout after failed login attempts, password expiration, and prohibition of reusing recent passwords.

Settings are located in the admin panel: **Administration → Settings → Security → Password Policy**.
They appear only when a license is enabled.

::: info Which logins are affected by the policy
The policy applies to StormBPMN username and password login: the application login form and the login form when connecting
AI agents via MCP (OAuth). The policy does not affect logins via LDAP, Keycloak, Microsoft ADFS, or other OAuth2 providers:
passwords for these users are stored and verified by your identity provider, and rules are configured there.
:::

---

## Settings {#настроики}

| Setting | Key | Default | Description |
| --- | --- | --- | --- |
| Password: minimum length | `passwordMinLength` | `8` | Minimum number of characters, from 8 to 64 |
| Password: require complexity | `passwordRequireComplexity` | disabled | Password must contain a lowercase and uppercase letter, a digit, and a special character |
| Login: failed attempts before lockout | `passwordMaxFailedAttempts` | `0` (do not lock) | Number of consecutive incorrect passwords allowed, up to 99 |
| Login: lockout duration, minutes | `passwordLockoutMinutes` | `15` | How many minutes password login is locked, from 1 to 1440 |
| Password: expiration, days | `passwordMaxAgeDays` | `0` (no expiration) | Number of days after which the password must be changed, up to 3650 |
| Password: prohibit reuse of recent | `passwordHistoryDepth` | `0` (do not check) | Number of recent passwords, including the current one, that cannot be reused, up to 24 |

Default values preserve the previous behavior: after an update, nothing changes until the administrator modifies the settings.

---

## Length and Complexity {#длина-и-сложность}

Rules are validated for each new password: during registration, when changing the password in the profile, when recovering via a link from an email, and when creating or modifying an account by an administrator. Already set passwords are not re-validated, so after tightening the rules, users do not need to urgently change their passwords.

Regardless of the settings, the following basic requirements apply:

-   at least 8 characters;
-   no more than 72 bytes in UTF-8 encoding;
-   the password is not included in the list of common passwords.

Letters are considered to be letters of any alphabet, with Cyrillic treated equally to Latin. A special character is any character other than letters, digits, and spaces.

---

## Lockout after failed attempts {#блокировка-после-неудачных-попыток}

When a user enters an incorrect password consecutively the number of times specified in `passwordMaxFailedAttempts`, password login for their account is locked for `passwordLockoutMinutes` minutes. The user sees the message "Too many attempts, login is locked until HH:MM".

-   During the lockout period, even the correct password is rejected.
-   The lockout is automatically lifted after the time expires. A successful login resets the failed attempt counter.
-   Attempts on the application login form and the MCP login form are counted together.

::: tip Recommendation
5–10 attempts and a 15–30 minute lockout. With these values, password guessing is practically impossible, and a user who makes a few mistakes does not remain without access for a long time.
:::

---

## Password Expiration {#срок-деиствия-пароля}

If `passwordMaxAgeDays` is specified, when logging in with a password older than this period, StormBPMN displays the message "Password has expired" and prompts the user to set a new one immediately. The new password is validated against all policy rules and cannot match the expired one. After the change, the user is immediately logged into the system.

For passwords set before this setting was enabled, the expiration period is counted from the first login after enabling it. Therefore, enabling this setting will not force all users to change their passwords on the same day.

On the MCP login form, an expired password cannot be changed: the user will see the message "Password has expired. Log in to Storm and set a new password."

---

## Prohibition of Reusing Recent Passwords {#запрет-повтора-последних-паролеи}

If `passwordHistoryDepth` is specified, the new password cannot match the current password or any of the previous passwords within the specified number. For example, with a value of `3`, the current password and the two previous passwords cannot be used. The user will see the message "Password matches one of the last 3".

StormBPMN stores only hashes of previous passwords (bcrypt), not the passwords themselves. The history starts accumulating after upgrading to the version with the password policy.

---

## Recommended values {#рекомендуемые-значения}

| Setting | Baseline level | Enhanced requirements |
| --- | --- | --- |
| Minimum length | 10 | 12 |
| Complexity | disabled | enabled |
| Failed attempts before lockout | 10 | 5 |
| Lockout duration, minutes | 15 | 30 |
| Expiration period, days | 0 | 90 |
| Prohibition of repeating the last | 3 | 5 |

::: info About password expiration
NIST SP 800-63B does not recommend regular forced password changes unless there are signs of compromise. Enable the expiration period if required by your security policy.
:::

---

## Related documentation {#связанная-документация}

-   **[Security](./README.md)** — environment variables and checklist
-   **[Authorization system](./authorization.md)** — OAuth2, Keycloak, ADFS
-   **[Audit logging](./audit-logging.md)** — user action log
