---
title: Warm-ups (Storm Wizard)
order: 6
source_hash: 221bba23a1250ff1
---

[[toc]]

# Warm-ups: Letters from the Storm Master {#прогревы-письма-мастера-шторма}

Warm-ups are personalized letters that Stormbpmn writes to employees when there is a clear reason for them to return to work: an approval is pending, a diagram has not been touched for a long time, colleagues have left comments, or a person has returned from vacation. The letters are signed by the "Storm Master," written by your language model based on facts from the system, and the button in the letter leads directly to the task — to the diagram, the approval, or the AI chat where the assistant is already continuing the conversation.

Available in builds after October 7, 2026. Everything is disabled by default.

## Why This Is Needed {#зачем-это-нужно}

Process modeling involves work with long pauses: diagrams are started and shelved, sent for approval and forgotten, or a colleague is invited but never logs in. Warm-ups address exactly these pauses:

- **Approvals do not stall** — the approver is reminded about a pending decision, and the author is notified about a rejected diagram;
- **Started diagrams are completed** — the author of a stalled diagram is prompted to invite colleagues for approval;
- **Newcomers get onboarded** — those who have been granted access or assigned an approval are explained what is expected of them;
- **Returning is easier** — after leave, a person receives a brief summary of what has changed.

The message always focuses on a specific fact (e.g., "The 'Procurement' approval has been waiting for your decision for 9 days"), rather than being a generic "come visit us" broadcast. If there is nothing substantive to say, no email is sent.

## How It Works {#как-это-работает}

```
00:30 МСК, по будням           ночной прогон: кому и о чём писать
   │  отбор сотрудников → поиск повода → факты из базы → текст пишет языковая модель → проверки
   ▼
sm_retention_nudge             черновики писем со временем отправки
   │
каждую минуту                  отправка созревших черновиков (если включена)
   ▼
почта (SMTP или ListMonk)  →   сотрудник → кнопка → схема / согласование / AI-чат
```

1. **Nightly Run.** On weekdays at 00:30 Moscow time, the engine selects employees and identifies the most important reason for each. The run operates only at night (from 23:00 to 07:00 Moscow time) — if it does not complete in time, the remainder will be processed the following night. Only one run executes at a time, even with multiple backend instances.
2. **Text.** Based on the reason's facts, the language model generates the subject line, email body, and the first message for the AI chat. The code validates the response: all numbers must match the data, mandatory facts must be mentioned, the tone must be formal ("you"), and there must be no reproaches. Text that fails validation is not sent; the engine attempts a backup reason.
3. **Draft.** The completed email is saved as a draft for the morning of the nearest working day: by default at 11:00 in the employee's company time zone (or Moscow time if unknown), with a random spread of up to one hour to prevent all emails from being sent simultaneously. A draft remains valid for 3 days — if it is not sent, it is considered outdated.
4. **Sending.** Mature drafts are sent via your email provider once per minute.
5. **Continuation in Chat.** If the [AI assistant](./AI_CHAT.md) is enabled, a conversation is created for the email: the button opens a chat where Storm Master has already written the first message and displayed what it sees in the process model. Without AI chat, the button leads to the process model or the application.

### Who receives them and how often {#кому-и-как-часто}

- Only **editors** (not readers) with email notifications enabled and who have not unsubscribed from nurture campaigns receive emails.
- The employee must be "active": they must have logged in within the last 90 days or registered no more than 30 days ago.
- **No more than one email per 7 days** per person.
- For the same process model or approval — **no more than once every 28 days**, regardless of the trigger.
- If a person ignores an email regarding a specific trigger (does not log in or take no action for 3 days), that trigger is considered exhausted for them.

### Unsubscribe {#отписка}

Each email contains an "Unsubscribe from Storm Master Tips" link. This link opens a confirmation page in your Stormbpmn (mail gateways that pre-open links will not accidentally unsubscribe anyone). Unsubscribing disables **all** nurture emails for this employee; you can resubscribe from the same page. Regular notifications (comments, approvals) are not affected by unsubscribing.

## Letter Triggers {#поводы-писем}

If an employee has multiple triggers, the more important one takes precedence (top to bottom).

| Trigger | When it triggers | Where the button leads |
|---|---|---|
| **Simulation Showcase** (`DES_SHOWCASE`) | The employee recently edited a process model, the system automatically ran it through the [simulation module](/en/simulation/) and displays the metrics. **Only when DES is deployed** | Simulation results |
| **Approval Pending** (`STUCK_APPROVAL`) | An incoming approval has been pending without a decision for 5 to 45 days | AI chat / process model |
| **Model Rejected** (`DECLINED_AND_DROPPED`) | The author's approval was rejected, and there has been no new attempt for 3+ days | AI chat / process model |
| **First Approval** (`NEWCOMER_APPROVAL`) | An approval was addressed to a new employee | AI chat / process model |
| **Welcome Back** (`RETURN_BRIEFING`) | The employee returned after an absence of 90 days — what has changed | AI chat |
| **Streak Broken** (`STREAK_BREAK`) | The employee worked for 8+ consecutive days and then disappeared | AI chat / process model |
| **Stagnant Model** (`STALE_DIAGRAM`) | The employee's own process model has not been edited for 7 to 45 days — we suggest inviting colleagues for approval | Process model, approval window |
| **Model Shared With You** (`INVITED_DIAGRAM`) | A new employee was granted access to someone else's process model | AI chat / process model |
| **Colleagues Editing Your Model** (`COLLABORATOR_EDIT_BURST`) | Colleagues saved 3+ versions of the author's process model within a week | AI chat / process model |
| **New Readers for Your Model** (`DIAGRAM_AUDIENCE`) | While the author was absent for 3–30 days, access to their process models was granted or comments were left | AI chat / process model |
| **What Has Accumulated** (`DORMANT_RECAP`) | The employee has not logged in for 14–90 days, and they have accumulated approvals, comments, and unfinished process models | AI chat |
| **Weekly Summary** (`WEEKLY_RECAP`) | For active employees — a weekly summary (based on 5+ saves) | AI chat |
| **What Awaits You** (`DIGEST`) | Fallback trigger: a short digest if there is no urgent trigger | AI chat |

Day thresholds are configurable settings; see ["What Can Be Configured"](#что-можно-настроить).

## Enabling {#включение}

### 1. Environment Variable {#_1-переменная-окружения}

In the backend container environment:

```bash
STORM_RETENTION_ENABLED=true
```

After a restart, the nightly run and the manual run button appear. Without this variable, warm-ups do not work, even if everything else is configured.

::: info Enterprise Contour
In enterprise builds, the **"Retention"** tab is available in the admin panel. If the `STORM_RETENTION_ENABLED` flag is not set, an informational message about the need to enable it is displayed on the tab.
:::

### 2. Language Model {#_2-языковая-модель}

The language model generates the texts; without it, the run cannot be started. A **separate** model configuration is required for warm-ups — `bpmnAiRetentionModel` (in the admin panel: **Admin Panel → “Retention” tab**, field “Retention LLM: model”). The API address, token, and format are taken by default from the [AI assistant](./AI_CHAT.md) settings; if necessary, they can be overridden with separate settings `bpmnAiRetention*`.

The chat model is **not** automatically substituted by design: employee names and schema names are included in the prompt (see [“What data the model receives”](#какие-данные-получает-модель)), and this must be a deliberate decision. A model of the same level as the one used for AI chat is suitable, including a [self-hosted](./self-hosted-llm/) model.

The system prompt (`retentionCopySystemPrompt`) is pre-filled during installation — it does not need to be changed.

### 3. Email {#_3-почта}

- **Simple SMTP** — no additional configuration is required: warm-up emails are composed within the application.
- **ListMonk** — click **"Configure basic templates in Listmonk"** on the "📧 Email" tab of the application settings: this will create a template for warm-up emails (`retentionEmailTemplateId`). For details, see ["Configuring email notifications"](/en/install/production/components.md#настроика-почтовых-уведомлении).

If email is not configured at all, warm-ups will wait for it: drafts will not be marked as sent.

### 4. Toggles {#_4-тумблеры}

On the **Retention** tab of the admin panel, there are three toggles:

| Toggle | Function |
|---|---|
| `retentionEngineEnabled` | Enables the engine: text generation |
| `retentionScheduleEnabled` | Enables the scheduled nightly run |
| `retentionSendEnabled` | Enables email sending. While disabled, the engine only prepares drafts |

::: tip Recommended startup sequence
1. Enable `retentionEngineEnabled` and `retentionScheduleEnabled`, **do not enable sending**.
2. Start the run using the button on the "Retention" tab (or wait for the night).
3. Review the drafts in the `sm_retention_nudge` table (columns `email_subject`, `email_body`) — check if the tone and content meet your requirements.
4. Enable `retentionSendEnabled` — emails will start sending from the next morning.
:::

### 5. Closed Loop {#_5-закрытыи-контур}

If the server has no internet access, disable the employee company determination by email domain (external DaData service): `retentionCompanyLookupMax = 0`. Otherwise, each run will spend up to 30 seconds on this attempt. The sending time zone will then be Moscow time.

### 6. Simulation Showcase — DES only {#_6-витрина-симуляции-—-только-с-des}

The "Simulation Showcase" event automatically runs employee schemas through the simulation module, so it requires a deployed DES. It is disabled by default (`retentionDesShowcaseEnabled = false`) — enable it only if [simulation](/en/simulation/) is working in your environment. This event requires a dedicated template in ListMonk (`retentionEmailTemplateId.DES_SHOWCASE`): the default button template does not cover it.

## Tier {#тариф}

With an active enterprise license, all employees are considered to be on the maximum tier: warm-ups do not restrict the reasons and phrasing in the way they do for free cloud users.

## What can be configured {#что-можно-настроить}

All settings are located on the **Retention** tab of the admin panel. Changes take effect from the next run.

### Schedule and Frequency {#расписание-и-частота}

| Setting | Default | What it defines |
|---|---|---|
| `retentionSendHour` | `11` | The hour of sending in the employee's company time zone (emails are sent on weekdays, with a variance of up to one hour) |
| `retentionNudgeTtlDays` | `3` | How many days a draft waits for sending before expiring |
| `retentionMinDaysBetweenNudges` | `7` | Minimum number of days between emails to the same person |
| `retentionEntityCooldownDays` | `28` | Minimum number of days between emails regarding the same schema or approval |
| `retentionPessimizationMinDays` | `3` | How many days after a reason is ignored it is considered exhausted |
| `retentionRunCap` | `6000` | Maximum number of employees processed per run (`0` — no limit) |
| `retentionNightOnly`, `retentionNightStartHour`, `retentionNightEndHour` | `true`, `23`, `7` | Nighttime window for the run (Moscow time) |
| `retentionHoldoutPercent` | `10` | Percentage of employees in the control group: texts are prepared for them but **not sent** — to compare with those who received them. If effect evaluation is not needed, set `0` |

### Event Thresholds {#пороги-поводов}

| Setting | Default | Event |
|---|---|---|
| `retentionStuckApprovalDays`, `retentionStuckApprovalDaysMax` | `5`, `45` | Approval pending |
| `retentionDeclinedMinDays` | `3` | Diagram rejected |
| `retentionStaleDiagramDaysMin`, `retentionStaleDiagramDaysMax` | `7`, `45` | Stagnant diagram |
| `retentionStaleDiagramMinElements` | `10` | Number of elements required in a diagram to consider it actively started |
| `retentionStreakMinDays` | `8` | Streak broken |
| `retentionReturnGapDays`, `retentionReturnRecentDays` | `90`, `7` | Welcome back |
| `retentionEditBurstMinVersions` | `3` | Colleagues are editing your diagram |
| `retentionDiagramAudienceMinDays`, `retentionDiagramAudienceMaxDays` | `3`, `30` | Diagram has gained readers |
| `retentionDormantDaysMin`, `retentionDormantDaysMax` | `14`, `90` | What has accumulated; `…DaysMax` — also the upper limit for an "active" employee |
| `retentionNewbieDaysMax` | `30` | Number of days from registration during which an employee is considered a newcomer |
| `retentionRecapMinActions` | `5` | Weekly summary |
| `retentionDigestMinAwayDays` | `3` | What awaits you |

### Email Texts {#тексты-писем}

| Setting | What it defines |
|---|---|
| `retentionCopySystemPrompt` | General system prompt: tone, rules, and assistant capabilities. Pre-filled during installation |
| `retentionPromptGuidance.<повод>` | Prompt supplement for a specific trigger, for example `retentionPromptGuidance.stuck-approval`. If empty, the built-in prompt is used |
| `retentionEmailCallToAction.<ПОВОД>` | Button label for the email trigger, for example `retentionEmailCallToAction.STALE_DIAGRAM` = "Send for approval →". General label — `retentionEmailCallToAction`. An empty value removes the call to action |
| `retentionSubjectMaxLength` | Maximum length of the email subject (default is 70 characters) |

### Email Layout {#верстка-писем}

- **SMTP:** Layout is built-in (logo, "Storm Master · wrote to you" card, button, unsubscribe link).
- **ListMonk:** Edit the template from `retentionEmailTemplateId` in ListMonk. The subject line is passed to `{{ .Tx.Data.subject }}`,
  the body is provided as ready-made HTML in `{{ .Tx.Data.body }}` (render it via `{{ with .Tx.Data.body }}{{ Safe . }}{{ end }}`).
  For a specific trigger, you can create a custom template and specify its ID in `retentionEmailTemplateId.<ПОВОД>`.

## What data the process model receives {#какие-данные-получает-модель}

The following data is passed to the prompt for generating the email:

- the employee's name (only if it resembles a name), their role, and tasks from the registration profile;
- the company's name, industry, and size;
- the number of days since the employee last logged in;
- the name of the process model or approval workflow the email concerns, and the relevant context details — for example, process model names, colleagues' names, and the text of the rejection reason in the approval workflow.

The email address is not passed to the prompt. Model prompts and responses are stored in the database for 30 days (`retentionTraceTtlDays`) to review disputed emails, after which they are deleted.

If the model is external, take this into account when making your choice: use [your own model](./self-hosted-llm/) for sensitive data.

## Diagnostics {#диагностика}

### Manual Run {#ручнои-запуск}

The **Retention** tab includes a run trigger button. You can limit the run to a single trigger, a single employee (by ID), and disable the frequency limit — useful for checking what a specific person will receive. The run executes in the background; results appear in the table `sm_retention_nudge` and the backend logs.

### Table `sm_retention_nudge` {#таблица-sm-retention-nudge}

Each letter is a row with fields `trigger_type` (reason), `email_subject`, `email_body`, `scheduled_send_at`,
`sent_on`, and a status:

| Status | Meaning |
|---|---|
| `DRAFT` | Text is ready, awaiting send time |
| `HOLDOUT` | Control group — not sent |
| `SENDING` | Being handed over to the email provider |
| `SENT` | Handed over to the email provider (delivery is confirmed by the provider) |
| `EXPIRED` | Not sent on time — expired |
| `SKIPPED_NO_FACT` | Reason existed, but there was insufficient data or the text failed validation |
| `FAILED` | Generation error (e.g., process model unavailable) |

### Logs {#логи}

Engine messages in the backend logs start with `ретеншн:` (run start and results, sending, errors), while simulation dashboard messages start with `витрина DES:`.

### Frequently Asked Questions {#частые-вопросы}

| Situation | What to check |
|---|---|
| Run does not start | `STORM_RETENTION_ENABLED=true` and restart; `retentionEngineEnabled`; `bpmnAiRetentionModel` is set; `retentionCopySystemPrompt` is not empty |
| Drafts exist, but no emails | Is `retentionSendEnabled` enabled; is email configured; has morning not yet arrived (`scheduled_send_at`) |
| Many `SKIPPED_NO_FACT` | Normal on the first nights: some employees have no reason. If almost all — check the process model and prompt |
| Many `FAILED` | Model is unavailable or returns an error — check the address and token |
| Employee does not receive emails | They are a reader, disabled email notifications, unsubscribed, are in the control group (`HOLDOUT`), or the email was less than 7 days ago |
