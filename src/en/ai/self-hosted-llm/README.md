---
title: Selecting a process model
order: 1
dir:
  order: 3
  link: true
  text: Self-hosted LLM
  collapsible: true
index: true
redirectFrom:
  - /en/operation/LocalLLM.html
source_hash: 3aa36099dbc785c6
---

# Self-hosted LLM — Model Selection {#self-hosted-llm-—-выбор-модели}

The Stormbpmn AI chat operates through tools: it creates and edits diagrams, creates roles and documents, links them to the process, and answers product-related questions via the knowledge base. By default, the engine is an external model with an OpenAI-compatible API. It can be replaced with a **custom model on your own GPU**: data does not leave the perimeter, and the cost does not depend on the number of requests.

This page covers which model we recommend, on what hardware, at what speed, and how many tokens a single user consumes. All figures were measured on our Stormbpmn cloud, where this same configuration serves the AI chat for all users.

::: tip A two-part section
**This page** — what to choose and what it takes. How to deploy the model — in the article **[Deployment on vLLM](./deploy-vllm.md)**: ready-made docker-compose, flag breakdown, diagnostics.
:::

::: tip Changing the model — two settings, no code changes
The engine is switched via the `bpmnAiCompletionBaseUrl` and `bpmnAiCompletionModel` parameters in the application settings. The format is OpenAI-compatible, so both cloud APIs and a self-hosted server on vLLM are suitable.
:::

[[toc]]

## Recommendation {#рекомендация}

| | What to deploy |
|---|---|
| **Model** | **Qwen3.8-27B** |
| **Weight build** | `unsloth/Qwen3.8-27B-NVFP4` (NVFP4 quantization, approx. 22 GB of VRAM) |
| **GPU** | 1× NVIDIA RTX PRO 6000 Blackwell, 96 GB |
| **Engine** | vLLM `v0.27.1` with a fix for MTP and prefix caching (see [Deployment on vLLM](./deploy-vllm.md)) |
| **Context** | 262,144 tokens (full model window) |
| **Concurrency** | up to 16 simultaneous requests |
| **Generation acceleration** | MTP speculative decoding, 3 tokens ahead |
| **Reasoning** | in Stormbpmn — `enabled` (`bpmnAiChatThinking`), disabled by default on the server |
| **Quality** | 93% on our AI chat evaluation suite (tool selection, process construction, knowledge base responses) |

Why this model: it reliably handles long chains of tool calls, retrieves answers from the knowledge base rather than hallucinating, and constructs large processes in a single pass. At the same time, the weights occupy less than a quarter of the GPU, leaving the remaining VRAM for the KV cache: full context window and 16 concurrent requests.

### If the GPU is not Blackwell {#если-gpu-не-blackwell}

NVFP4 quantization works only on NVIDIA Blackwell cards (RTX PRO 6000, RTX 50xx, B200). For Hopper (H100, H200) and Ada (L40S, RTX 6000 Ada), use the FP8 build: `Qwen/Qwen3.8-27B-FP8`, approximately 28 GB for weights. The other flags remain the same. We have not measured the speed on these cards; refer to your own benchmark.

On a card with 48 GB of VRAM, reduce `--max-model-len` to 131,072 and `--max-num-seqs` to 8: this is sufficient for the Stormbpmn chat window. We have not verified this configuration; it will accommodate fewer concurrent requests than in the benchmarks below.

## Speed on a single card {#скорость-на-однои-карте}

Benchmark on RTX PRO 6000 Blackwell with the configuration from [Deployment on vLLM](./deploy-vllm.md), responses of 512 tokens:

| Concurrent requests | Generation, total tokens/s | Per request, tokens/s |
|:---:|:---:|:---:|
| 1 | 110 | 110 |
| 4 | 298 | ~75 |
| 8 | 742 | ~93 |
| 16 | 1 252 | ~78 |

A response of 512 tokens arrives in 4–6 seconds. The total speed grows almost linearly up to 16 requests: a single card handles peak load without queuing.

## How many tokens does one user consume {#сколько-токенов-тратит-один-пользователь}

Stormbpmn cloud AI chat data for 12.10–01.11.2026: 1,963 users, approximately 9,900 chat turns, all users without plan filters. A "turn" is a single user message and the entire response to it, including tool calls.

| | Input, median | Input, 90th percentile | Output, median | Output, 90th percentile |
|---|---:|---:|---:|---:|
| **Single turn** | 150k | 560k | 4.7k | 25k |
| **User per day of chat usage** | 370k | 2.5M | 15k | 79k |
| **User over 3 weeks** | 400k | 3.9M | 16k | 107k |

How to interpret these figures:

- **Input is tens of times larger than output** because a turn consists of an average of 7 requests to the model: the model calls a tool, receives the result, and continues. Each request carries the system prompt, tool descriptions, and dialogue history anew. The actual context size of a single request is approximately 43k tokens (median). The repeating part is retrieved from the vLLM prefix cache and places almost no load on the GPU. With cloud providers that support prompt caching, it is billed at a reduced rate.
- **Output** includes the model's reasoning: in the cloud, these are included, and approximately 90% of turns are processed with them.
- **Users do not work with the chat every day**: on average, 1.4 days over 3 weeks. Mean values are 3–4 times higher than medians: a small number of active users build large processes and consume the majority of tokens.

For budget planning with an external provider, calculate based on a **day of chat usage**: on average, 1.35M input tokens and 34k output tokens per user.

## How many users a single GPU card handles {#сколько-пользователеи-тянет-одна-карта}

A single RTX PRO 6000 with this configuration serves the entire AI chat for the Stormbpmn cloud. Load data based on chat metrics from 12.10 to 01.11.2026 and vLLM logs for the week prior to 04.11.2026:

| Metric | Value |
|---|---|
| Chat users on a weekday | 150 (median), up to 190 |
| Chat users per week | 700–850 |
| Peak hour | 32 users, 73 turns |
| Concurrent requests at peak | 16, exactly `--max-num-seqs` |
| Average generation on weekdays | 230–330 tokens/s, out of 1,250 available |
| KV-cache utilization at peak | up to 82% |

Benchmark: **one card — up to 200 active chat users per day**. The bottleneck is not generation speed, but the number of concurrent requests and the KV-cache. If `Waiting` in the vLLM logs grows steadily or the KV-cache approaches 100%, add a second card with the same compose and a load balancer in front of them.

## What we do not recommend {#что-не-рекомендуем}

| Option | Why not |
|---|---|
| MTP with 4-token lookahead | on vLLM `v0.27.1` it crashes with `CUDA illegal memory access` at 16 concurrent requests |
| SGLang with DFlash speculative decoding on a single GPU | faster for 1–4 requests (up to +40%), but 36% slower than vLLM at 16 requests |
| DeepSeek V4 Flash | does not fit on a single 96 GB GPU, and in our tests performs at the level of Qwen3.8-27B |
| vLLM `latest` instead of a pinned version | a new version may change the behavior of tool parsers and the cache. Update deliberately, after running on a test stand |

## What to consider before running {#что-учесть-до-запуска}

- **Tool call parser** is required: `--enable-auto-tool-choice --tool-call-parser qwen3_coder`. Without it, the process model reports "done" without doing anything.
- **Reasoning**: In Stormbpmn, set `bpmnAiChatThinking = enabled` and enable response streaming so that the user can see the model's thought process. If streaming is not available, set `disabled`. For more details, see [Reasoning (thinking)](../AI_CHAT.md#размышления-thinking).
- The **gateway in front of the model** (corporate proxy, API gateway) must allow streaming responses. If it returns `400` for `"stream": true`, disable the "Response streaming" toggle — see [AI Assistant Configuration](../AI_CHAT.md#стриминг-ответа).
- No changes to the **system prompt** are needed.

## How to switch the process model {#как-переключить-модель}

Parameters are set in the application settings (AI section) and applied **without a restart**:

| Parameter | What it sets | Value |
|---|---|---|
| `bpmnAiCompletionBaseUrl` | Address of the OpenAI-compatible server, **without** `/v1` (Stormbpmn will append it automatically) | `http://<llm-host>` |
| `bpmnAiCompletionModel` | Model name on the server, exactly `--served-model-name` | `qwen3.8-27b` |
| `bpmnAiCompletionTemperature` | Temperature | `0.2` |
| `bpmnAiChatThinking` | Reasoning | `enabled` (with streaming) |

::: tip How to migrate from another model
If you are already running a different model, deploy the new one alongside it and switch a subset of users or a test environment to it. After 1–2 weeks, compare the response quality ratings in the chat and the response time, then switch everyone over.
:::

## Related documentation {#связанная-документация}

- **[Deployment on vLLM](./deploy-vllm.md)** — docker-compose, flag breakdown, performance diagnostics
- **[Enabling and connecting the model](../AI_CHAT.md)** — connecting the model to Stormbpmn and configuring chat behavior
- **[AI chat knowledge base (RAG)](../KnowledgeBase.md)** — how the chat responds based on your reference documents
- **[System configuration](/en/configure/README.md)** — application settings and ENV variables
