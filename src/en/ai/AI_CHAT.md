---
title: Enabling and Connecting a Process Model
order: 1
redirectFrom:
    - /en/configure/AI_CHAT.html
source_hash: 7c232f57235a6d6b
---

[[toc]]

# Configuring the AI Assistant (Chat) {#настроика-ai-ассистента-чат}

The StormBPMN AI assistant is a chat embedded in the application. It can read your diagrams,
processes, roles, and documents, answer questions from the knowledge base, **create and edit
BPMN diagrams**, assign roles, and link documents — all through actual tool calls, rather than
fabricating results.

To get the assistant working, you need two things: **connect a language model** (LLM) and **enable the chat**.
Both settings are covered in this article.

::: warning What this article does NOT cover
Here we **do not deploy our own model** (vLLM, Ollama, llama.cpp, etc.) — there is a separate section on
deploying self-hosted LLMs: [Self-hosted LLM](./self-hosted-llm/). In this article, we
**connect Storm to an already running model endpoint** — whether cloud-based (OpenAI, Anthropic, ProxyAPI, etc.)
or your own — and configure the chat behavior.
:::

::: tip Two levels of configuration
Like all StormBPMN configuration (see [System Configuration](/en/configure/README.md)), chat configuration is divided into:

**Level 1 — Server-side enablement:** the environment variable `MCP_ENABLED` and a **license with the AI module**
(`enableAiFeatures`). The ENV variable requires an application restart; the AI module requires the corresponding license.

**Level 2 — Admin panel (fine-tuning):** the **"Enable AI Chat"** toggle, model, token,
temperature, prompts, and quality threshold. These are applied **on the fly**, without a restart.
:::

---

## Step 1. Enabling the chat {#шаг-1-включение-чата}

For the chat button to appear for the user, **all** of the following conditions must be met.

| Parameter                       | Location                                  | Description                                                                                          | Default |
| ------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------- | ------------ |
| **MCP_ENABLED**                | Environment variable (ENV)           | Enables all chat services on the backend. Without it, the chat is completely disabled.                              | `false`      |
| **AI module in the license**       | License (`enableAiFeatures`)        | The chat, like all AI functionality, is part of the **AI module**. Without it, the chat API is closed, and the button is not displayed. | —            |
| **AI Chat enablement**          | Admin panel → “🤖 AI assistant”     | Toggle to display the chat button. Allows enabling/disabling the chat without modifying the license and ENV.            | enabled      |

In total, for the chat to be available to the user:

1. `MCP_ENABLED=true` is set on the backend (after changing it — **restart the container**);
2. The license includes the **AI module** (`enableAiFeatures`);
3. The **“AI Chat enablement”** toggle is enabled in the admin panel (enabled by default);
4. The user is authenticated.

::: warning The chat button is missing, although `MCP_ENABLED=true`?
Check in order: (1) the license contains the **AI module** (`enableAiFeatures`); (2) in the admin panel,
section **“🤖 AI assistant”**, the **“AI Chat enablement”** toggle is enabled; (3) you are authenticated. The toggle is
the fastest way to hide or show the chat without changing the license or ENV.
:::

---

## Step 2. Where the process model is configured {#шаг-2-где-настраивается-модель}

All other settings are located in the **admin panel**, in the **«🤖 AI Assistant»** section. Key blocks for the chat:

1. **Enable AI Chat** — toggle to display the chat button (see [Step 1](#шаг-1-включение-чата));
2. **Primary model** — model for reading and standard responses;
3. **Separate model for edits (write)** — *optional*: you can route turns that modify data to a more reliable/powerful model;
4. **Edit quality threshold** — automatic diagram refinement for the linter;
5. **System prompts** — instructions for the assistant (base + separate one for edits).

The same section below contains settings for "classic" AI features (BPMN autocomplete, process analysis, Assistants API) — these are not directly related to the chat.

::: tip
Changes made in the admin panel take effect on the next chat request — **no restart is required**. The token is displayed as a password field (masked).
:::

---

## Core Model {#основная-модель}

The minimum set of fields required for the chat to function.

| Field           | Type               | Req. | Description                                                                                           |
| -------------- | ----------------- | :---: | -------------------------------------------------------------------------------------------------- |
| **API Format** | selection             |  ✅   | `OPENAI` or `ANTHROPIC` — which API "dialect" the endpoint uses. Must match the URL and model.       |
| **Base URL**| string            |  ✅   | The model endpoint address **without** `/v1` — the path is appended automatically.                             |
| **Token**      | password            |  ✅¹  | Provider API key. Masked in the interface.                                                      |
| **Model**     | string            |  ✅   | Model identifier (e.g., `gpt-4.1`, current Claude ID, or the name of your self-hosted model).  |
| **Temperature**| number (decimal)   |   —   | Response creativity, `0.0`–`2.0`. **Empty = parameter is not sent** (required for reasoning models).|
| **Token Limit**| number (integer)   |   —   | Maximum tokens in the response. Empty — the model uses its default (for ANTHROPIC, `4096` is applied). |
| **Response Streaming**| toggle        |   —   | Print the response as it is generated. Enabled by default; disable only if the gateway does not accept streaming responses (see [Response Streaming](#стриминг-ответа)). |

¹ The token can be empty only for a self-hosted endpoint without authentication.

::: tip Configuration Keys
In the admin panel, each field has a key — use it to find the setting via search, and the [System Check](/en/operation/system-check.md) and support service refer to them by these names.

| Field                  | Configuration Key              |
| --------------------- | --------------------------- |
| Model Enablement      | `bpmnAiCompletion`          |
| API Format            | `bpmnAiChatFormat`          |
| Base URL           | `bpmnAiCompletionBaseUrl`   |
| Token                 | `bpmnAiCompletionToken`     |
| Model                | `bpmnAiCompletionModel`     |
| Temperature           | `bpmnAiCompletionTemperature` |
| Token Limit         | `bpmnAiCompletionMaxTokens` |
| Response Streaming       | `bpmnAiCompletionStream`    |
| Thinking (reasoning)| `bpmnAiChatThinking`        |

For individual model write operations, keys start with `bpmnAiWrite`: `bpmnAiWriteModel`, `bpmnAiWriteBaseUrl`, `bpmnAiWriteToken`, `bpmnAiWriteFormat`, `bpmnAiWriteTemperature`, `bpmnAiWriteMaxTokens`, `bpmnAiWriteThinking`.
:::

::: info Connection Check
The [System Check](/en/operation/system-check.md) section automatically verifies these settings, and the "Check Model (paid request)" button sends a short request to the model and shows whether it responds. If the AI module is included in your license but the model is not configured, the check is considered an error and prevents completing the initial setup.
:::

### API Format: `OPENAI` or `ANTHROPIC` {#формат-api-openai-или-anthropic}

The format defines the contract under which Storm communicates with the model:

- **`OPENAI`** — OpenAI-compatible API. Suitable for **OpenAI, DeepSeek, OpenRouter, ProxyAPI**, as well as most self-hosted solutions (**vLLM, Ollama, llama.cpp** in OpenAI-compatible mode).
  Storm accesses the path `…/v1/chat/completions`.
- **`ANTHROPIC`** — Native Anthropic (Claude) API. Storm accesses the path `…/v1/messages`,
  authentication is performed via the `x-api-key` header.

::: warning The format, URL, and model must be consistent
You cannot specify the `OPENAI` format with an Anthropic URL, or a Claude model with the `OPENAI` format. A mismatch
results in `400`/`404` errors from the provider.
:::

### Base URL — without `/v1`! {#базовыи-url-—-без-v1}

Specify the **root** endpoint, **without** `/v1` and without `/chat/completions`. Storm automatically appends the required path depending on the format.

| Provider / case                 | Base URL                                  |
| ---------------------------------- | -------------------------------------------- |
| OpenAI directly                    | `https://api.openai.com`                     |
| Anthropic directly                 | `https://api.anthropic.com`                  |
| ProxyAPI — OpenAI                  | `https://api.proxyapi.ru/openai`             |
| ProxyAPI — DeepSeek / OpenRouter   | `https://api.proxyapi.ru/openrouter`         |
| ProxyAPI — Anthropic               | `https://api.proxyapi.ru/anthropic`          |
| Self-hosted (OpenAI-compatible)   | `http://10.0.0.5:8000` (your service address)|

### Temperature {#температура}

Controls "creativity": lower values yield more stable and predictable outputs, while higher values produce more diverse results. For a work assistant, **`0.2`** is recommended.

::: danger Reasoning models and temperature
Some models (OpenAI o-series, `deepseek-reasoner`, and similar "thinking" models) **do not accept** the temperature parameter and return `400` if it is provided. For such models, **leave the temperature field empty** — Storm will then not send this parameter.
:::

### Token limit {#лимит-токенов}

Maximum length of the model's response.

- **`OPENAI`:** If the field is empty, the parameter is not sent, and the model's default applies.
- **`ANTHROPIC`:** The parameter is required; if the field is empty, Storm substitutes `4096`.

Increase the value if responses are cut off mid-word.

---

## Response Streaming {#стриминг-ответа}

By default, the assistant **prints the response as it is generated**: the user sees the first words within a second or so and reads the text while the model is still working. This is how the chat works out of the box, and there is no need to change this.

The **"Response Streaming"** toggle (in the "🤖 AI Assistant" section) exists for one specific case: **your LLM gateway does not accept streaming responses** and returns an error `400`. This occurs with corporate gateways and some self-hosted proxies that proxy the model but do not support `Server-Sent Events`.

| Toggle Position | What is sent in the request | How the response appears |
| ------------------ | -------------------- | --------------------------------------------------------- |
| Enabled (default) | `"stream": true` | Text is printed gradually, as in familiar chatbots. |
| Disabled | `"stream": false` | The response appears in full, as a single block, after waiting. |

::: warning This degrades the chat experience
Without streaming, the user stares at a loading indicator for several dozen seconds and then receives a "wall" of text all at once. Disable the toggle only if the chat **does not work at all** with it enabled.
:::

What **does not change**:

- **Tool calls** work identically in both modes. Prompts like "Searching for diagrams…", "Editing…" arrive as usual — they do not depend on the text stream.
- **Diagram edits, search, knowledge base** — remain unchanged.
- The mode is common to both the **main** and the separate **write model**: there is no need to configure it twice.

::: tip Storm does not send the `stream_options` parameter
Some gateways complain specifically about `stream_options: {"include_usage": true}`. Storm **does not pass this parameter in any mode**. If your gateway reports it, the request almost certainly does not come from Storm — you should check the raw request body in the gateway logs.
:::

::: danger Long responses and timeout
With streaming disabled, a read timeout of **180 seconds** applies to each HTTP request to the model (this is a limit per single request, not for the entire turn: when working with tools, Storm makes several requests in a row, and each has its own timeout). If the model on your equipment responds more slowly, the turn will end with an error. With streaming enabled, there is no such limitation.
:::

---

## Thinking {#размышления-thinking}

Available in versions **after 6.6.6955**.

"Thinking" is a mode where the model **thinks before responding**, and the chain of thought is streamed to the user as a live collapsible **"Chain of Thought"** block above the response: you can see what the assistant is doing during long steps and why it arrived at a specific result. The block collapses with the first word of the response.

It is controlled by the **"AI Thinking (thinking)"** setting (`bpmnAiChatThinking`) in the
"🤖 AI Assistant" section. This is a choice among three values:

| Value | When to choose | What is sent in the request |
| -------- | -------------- | -------------------- |
| **`unsupported`** (default) | The provider does not understand the `chat_template_kwargs` parameter — cloud OpenAI, most proxies | The parameter is not sent at all |
| **`disabled`** | The model is on **vLLM**, but thinking is not needed | `enable_thinking: false` — important for Qwen3 and newer: otherwise the model "thinks" by default and wastes tokens |
| **`enabled`** | The model is on **vLLM**, thinking is needed | `enable_thinking: true` — the chain of thought is streamed to the user |

For a separate write model, there is a paired setting **`bpmnAiWriteThinking`** with the same values.
It is **not inherited** from the main model — if you use a write model, set the value explicitly.

::: warning Limitations
-   Works only with the **`OPENAI`** format over **vLLM**: cloud OpenAI rejects
    `chat_template_kwargs` with error `400` — for it, leave `unsupported`.
-   `enabled` requires the **"Response Streaming"** toggle to be enabled (`bpmnAiCompletionStream`); in
    blocking mode, thinking is ignored.
-   Cost: the response becomes longer and more expensive due to reasoning tokens (on the order of hundreds of tokens even for a simple question). After enabling, monitor the latency of your LLM server.
:::

::: warning Enable after a full update
Enable `enabled` only when **both the backend and the frontend** have been updated to a version with thinking support: old interface builds do not know about the thought stream and may display it as part of the regular response. The default value (`unsupported`) excludes this.
:::

---

## Connection Examples {#примеры-подключения}

::: tip ProxyAPI (Russian proxy for foreign LLMs)
[ProxyAPI](https://proxyapi.ru/docs) provides access to OpenAI / Anthropic / DeepSeek from the Russian Federation. The base URL
depends on the provider, and the path is `/openai`, `/openrouter`, or `/anthropic`.
:::

::: warning Important regarding `/v1` and ProxyAPI
In the **official ProxyAPI documentation**, the base URL is specified as `https://api.proxyapi.ru/openai/v1`
(**with** `/v1`) — this is what the OpenAI client expects. **In Storm, do NOT write `/v1`** — the application appends
`/v1/chat/completions` automatically. Therefore, in the "Base URL" field, enter `https://api.proxyapi.ru/openai`
(**without** `/v1`). The same rule applies to any OpenAI-compatible endpoint (vLLM, Ollama, etc.).
:::

**OpenAI via ProxyAPI:**

| Field        | Value                          |
| ----------- | --------------------------------- |
| API Format  | `OPENAI`                          |
| Base URL | `https://api.proxyapi.ru/openai`  |
| Model      | `gpt-4.1` (or another OpenAI model)     |
| Token       | Key from the ProxyAPI personal account |

**DeepSeek via ProxyAPI** (routed through `/openrouter`):

| Field        | Value                              |
| ----------- | ------------------------------------- |
| API Format  | `OPENAI`                              |
| Base URL | `https://api.proxyapi.ru/openrouter`  |
| Model      | `deepseek/deepseek-chat-v3.1`         |
| Token       | ProxyAPI key                         |

**Anthropic (Claude) via ProxyAPI:**

| Field          | Value                              |
| ------------- | ------------------------------------- |
| API Format    | `ANTHROPIC`                           |
| Base URL   | `https://api.proxyapi.ru/anthropic`   |
| Model        | Current Claude ID (see Anthropic docs) |
| Token         | ProxyAPI key                         |
| Token Limit | For example, `4096`                       |

**Direct OpenAI:**

| Field        | Value                  |
| ----------- | ------------------------- |
| API Format  | `OPENAI`                  |
| Base URL | `https://api.openai.com`  |
| Model      | `gpt-4.1`                 |
| Token       | OpenAI key (`sk-...`)    |

**Self-hosted OpenAI-compatible endpoint** (for example, your model behind vLLM or Ollama):

| Field        | Value                              |
| ----------- | ------------------------------------- |
| API Format  | `OPENAI`                              |
| Base URL | `http://10.0.0.5:8000` (your address)    |
| Model      | Model name as provided by the service       |
| Token       | Your key or empty (if no authentication) |

::: warning Deploying your own model is a separate topic
How to set up vLLM/Ollama, which models to choose, and how to maintain them — see the separate section
[Self-hosted LLM](./self-hosted-llm/). Here, it is assumed that you **already have a working
OpenAI-compatible endpoint**, and we are simply pointing Storm to it.
:::

---

## Separate model for edits (write) — optional {#отдельная-модель-для-правок-write-—-необязательно}

Steps that **modify data** (create/modify a diagram, assign a role, link a document) are more complex than standard reads: weaker models are more prone to errors. Therefore, such steps can be routed to a **separate, more reliable model** (for example, a cloud-based one), while keeping reads on the primary model.

The **"Separate model for edits (write)"** block contains the same fields as the primary model (Format / Base URL / Token / Model / Temperature / Token Limit), but all of them are **optional**.

::: tip How inheritance works
- **The "Model" field is the activation key.** If it is **empty**, the entire write block is ignored, and edits are routed to the **primary** model.
- If "Model" is specified — write steps are routed to the write model, and **any empty field is inherited from the primary** (URL, token, format, temperature, limit — whatever is not set is taken from the primary model).
:::

**When this is useful:** the primary model is fast/low-cost (including self-hosted) for reads, while edits are handled by a more "intelligent" cloud model for reliability.

---

## Edit Quality Threshold {#порог-качества-правок}

| Field                  | Type             | Default | Range   |
| --------------------- | --------------- | ------------ | ---------- |
| **Quality Threshold**    | number (decimal) | `8.0`        | `0.0`–`10.0` |

After the assistant edits the diagram, Storm runs it through its own
**quality linter** (a deterministic BPMN check). If the score is **below the threshold**, the assistant
**silently reworks** the diagram to satisfy the linter — and only then displays the response to the user.

- A higher threshold (closer to `10`) — stricter quality requirements, more frequent auto-refinement.
- A lower threshold — more lenient, less frequent intervention.

---

## System Prompts {#системные-промпты}

Prompts are instructions that define the assistant's behavior. There are two of them, and they are **separated by turn type**:

| Prompt                                  | When applied                                  | Type                |
| --------------------------------------- | -------------------------------------------------- | ------------------ |
| **Base system prompt**            | Read turns / questions / clarifications (read)           | multiline text |
| **System prompt for edits (write)** | Turns that modify data (write) — *optional*   | multiline text |

::: tip How they interact
- On **read turns**, the **base** prompt is active.
- On **write turns**, the base prompt is **completely replaced** by the write prompt (it is focused on executing edits and prohibiting "fabricated" results).
- If the write prompt is **empty** — the base prompt is used on write turns.
:::

Both prompts are edited directly in the admin panel (the "multiline text" field). A character counter and a save button are displayed below the field.

::: warning Prompts are provided optimized — changing them is not recommended
System prompts are carefully tuned for the assistant's behavior (off-topic filter, tool usage, anti-fabrication, BPMN rules). **We recommend not changing them** unless necessary — an inaccurate edit can easily break the chat functionality.
:::

::: danger Prompts may be overwritten during an update
System prompts are updated along with StormBPMN (via migrations). **If you customized a prompt for your needs — when updating the version, your edit may be overwritten** by our new version of the prompt.
Therefore: **save your version of the prompt separately** (for example, in your repository/document) so that you can manually restore it after an update if necessary.
:::

---

## Diagnostics (FAQ) {#диагностика-faq}

::: details Provider returns 400 / 404
- **Base URL with `/v1` at the end** — remove `/v1`, Storm appends the path itself.
- **Format mismatch** — for example, `OPENAI` format with an Anthropic URL. Verify Format ↔ URL ↔ Model.
- **Temperature on reasoning models** — leave the temperature field empty (o-series, `deepseek-reasoner`, etc.).
- **Gateway does not accept streaming response** — if the gateway logs show a rejection for `"stream": true`,
  turn off the **«Response Streaming»** toggle (see [section above](#стриминг-ответа)).
:::

::: details Chat is not responding, gateway complains about `stream` / `stream_options`
Turn off the **«Response Streaming»** toggle — Storm will send `"stream": false` and retrieve the response
in a single request. Responses will arrive in full after a wait, but the chat will work.

The `stream_options` parameter is **never sent** by Storm, neither in streaming mode nor in standard mode.
:::

::: details Enabled reasoning — nothing changed or error 400
Check in order: (1) API format — `OPENAI`, the model runs on **vLLM** (cloud OpenAI
responds with `400` to `chat_template_kwargs` — revert `unsupported`); (2) the **«Response Streaming»** toggle is enabled —
without it, reasoning is ignored; (3) both parts of the application (backend and
frontend) are updated to a version after 6.6.6955; (4) if edits go through a separate write model —
it has its own `bpmnAiWriteThinking` setting, which is not inherited.
:::

::: details ANTHROPIC: error regarding max_tokens
For the `ANTHROPIC` format, the token limit is mandatory. If the field is empty, Storm will insert `4096`; if
an error occurs — set the limit explicitly (for example, `4096`).
:::

::: details Responses are cut off midway
Increase the **Token Limit** in the model settings.
:::

::: details Chat button is missing from the interface
Check: (1) `MCP_ENABLED=true` on the backend and the container has been restarted; (2) the license includes the AI module
(`enableAiFeatures`); (3) in the admin panel, the "🤖 AI Assistant" section, the "Enable AI Chat" toggle is on;
(4) you are authorized.
:::

::: details Changed settings — not applied
Model/prompt settings from the admin panel are applied **on the next request** in the chat, no restart is
needed. However, `MCP_ENABLED` (ENV) requires a **restart** of the container.
:::
