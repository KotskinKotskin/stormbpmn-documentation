---
title: Model Selection
order: 1
dir:
  order: 3
  link: true
  text: Self-hosted LLM
  collapsible: true
index: true
redirectFrom:
  - /en/operation/LocalLLM.html
source_hash: 03ae4ddb33af2d52
---

# Self-hosted LLM — Model Selection {#self-hosted-llm-—-выбор-модели}

The Storm AI chat orchestrates internal tools (create a diagram, create roles and documents, link them to a process, add descriptions, answer product questions via the knowledge base). By default, the engine is an external model via an OpenAI-compatible API. This model can be replaced with a **local LLM on your own GPU** — this is cheaper to operate, and data does not leave the perimeter. Voice input can be deployed next to the model on the same card.

We ran **10 models** through the actual Storm chat with real MCP tools on real user requests and selected the one that best handles the agent scenario in production. Below is the recommendation and justification.

::: tip A two-part section
**This page** — which model to choose and why (benchmark, candidates, speed). How to deploy the selected model in production — in the adjacent article **[Deployment on vLLM](./deploy-vllm.md)** (docker-compose, flag breakdown, performance tuning).
:::

::: tip Changing the model is two settings, without code changes
The engine is switched by the `bpmnAiCompletionBaseUrl` and `bpmnAiCompletionModel` parameters in the application settings. The format is **OpenAI-compatible**, so both cloud APIs and self-hosted servers (vLLM/SGLang) are suitable. No application code changes are required.
:::

[[toc]]

## In Brief {#коротко}

On simple tasks, almost all models perform equally well — which is misleading. In this round (10 models, including the new **Qwen 3.6**), **all of them managed to build a diagram** — there were no more empty schemas or hallucinated successes. The differences emerged along two more nuanced axes:

1. **Grounding via the knowledge base** — for product-related questions like “how to do X,” some models invoke a search over your knowledge base and answer based on facts, while others fabricate answers from memory. Half of the candidates (including the previous choice, Qwen3-Next-80B) **do not invoke the knowledge base at all** — for a product, this is a direct risk of hallucinations.
2. **Scale** — for a large process consisting of 30–40 elements in a single pass, most models assembled 34–38 nodes, but some models build it “coarsely” (one model produced only 4 nodes).

One model passed both filters the cleanest — and it is **no longer the same model as it was a year ago**.

| Priority | Model | Knowledge Base | Scale | Verdict |
|---|---|:---:|:---:|---|
| 🥇 Primary choice | **Qwen3.6-35B-A3B** | 91% | 38 nodes | Best balance: grounds answers via the knowledge base, assembles large processes, and selects tools cleanly (100% battery). MoE with 3B active parameters — **faster than the previous choice** (measured 245 vs 154 tok/s), leaving VRAM headroom for voice input. |
| ⚡ Strong alternatives | **gpt-oss-120B** / **Llama-3.3-70B** | 91% / 100% | 36 / 36 | Both ground the knowledge base and build large processes. Llama offers mature tool-calling; gpt-oss offers high decode speed. Heavier on VRAM. |
| ↩️ Previous choice | Qwen3-Next-80B-A3B | **0%** | 34 nodes | Builds reliably and quickly (measured 154 tok/s), but **does not invoke the knowledge base** — for product-related questions, it answers from memory. This is the gap that the new recommendation closes. |
| ⚠️ With caveats | Qwen3-30B-2507 / Qwen3-32B | 25% / 16% | **4** / 21 | 30B-2507 is fast but cannot handle large processes (builds ~4 nodes). 32B is slow (dense) and weaker in tool selection. |

## Candidates (all fit within 96 GB) {#кандидаты-все-влезают-в-96-гб}

The budget is a single NVIDIA RTX PRO 6000 card (96 GB). All models fit within this budget with one form of quantization or another. For each model, the **tool-call parser** in vLLM is specified — without the correct parser, the chat does not perform actions (see [Deployment on vLLM](./deploy-vllm.md)).

| Model | Type / Active | Quantization for 96 GB | Tool Parser | Note |
|---|---|---|---|---|
| **Qwen3.6-35B-A3B** | MoE / 3B | fp8 ~35 GB | `qwen3_coder` | 🥇 Primary choice; hybrid-thinking |
| Qwen3.6-27B | Dense / 27B | fp8 ~27 GB | `qwen3_coder` | Hybrid-thinking |
| Qwen3-Next-80B-A3B | MoE / 3B | fp8 ~80 GB | `hermes` | Previous choice; broad knowledge |
| Qwen3-Coder-30B-A3B | MoE / 3B | fp8 ~30 GB | `qwen3_coder` | Agentic-coding, very lightweight |
| Qwen3-30B-A3B-2507 | MoE / 3B | fp8 ~30 GB | `hermes` | Fast, but builds large processes in detail |
| Qwen3-32B | Dense / 32B | fp8 ~32 GB | `hermes` | Hybrid-thinking, heavy |
| Mistral-Small-3.2-24B | Dense / 24B | bf16 / fp8 ~24 GB | `mistral` | Lightweight; knowledge base — 0% |
| gpt-oss-120B | MoE / 5B | MXFP4 ~61 GB | `openai` | Reasoning (always thinks) |
| GLM-4.5-Air | MoE / 12B | GPTQ-Int4 ~55 GB | `glm45` | Reasoning; agentic profile |
| Llama-3.3-70B | Dense / 70B | fp8 ~70 GB | `llama3_json` | Mature tool-calling; chat-template required |

## How We Tested {#как-мы-тестировали}

Requests were sent to the **real** Storm backend (built from source) and its actual MCP tools — without emulation. The results were verified **not by the model's output, but by the facts in the database**: what was actually created, who the roles are assigned to, and what is described and linked. Prompts were taken from **live user requests** (what people actually ask the chat). Each "model × scenario" pair was run **twice** to account for the probabilistic nature of LLMs, and the final diagrams were rendered using the same library that draws them in Storm.

Scenario types:

- **Tool selection** — standard read requests plus off-topic queries: is the correct tool chosen, and does the model avoid rambling.
- **Simple creation scenario** — a single prompt assembles a diagram, tasks, roles with assignments, a document with linkage, and descriptions (~15 calls, requiring `id` to be passed between them).
- **Large process** — "Consumer Loan Issuance" (20–30 elements) and a full cycle of **30–40 elements** in one pass: gateways, branches, a rework loop, roles, documents, and descriptions.
- **Multi-turn conversation** — the process is assembled over several consecutive messages, as in a real chat: does the model lose context, and does it accurately summarize the assembled content at the end.
- **Knowledge base** — product questions like "how to do X": does the model invoke a search in the knowledge base or make things up.
- **Reading/analysis** — "describe the diagram," "what to improve" on an existing schema.

## What the run showed {#что-показал-прогон}

**Parity is better than before, both in simple scenarios and at scale.** All 10 process models build non-empty diagrams, and the majority (not only MoE Qwen, as was the case before — Llama, Mistral, and gpt-oss as well) built the large process with 34–38 nodes. Notable failures at scale — **Qwen3-30B-2507** (builds the large process "coarsely," ~4 nodes instead of 30–40).

**The decisive difference was the discipline of querying the knowledge base.** On product-related questions, half of the models do not invoke the knowledge base search and answer from memory — this is a direct risk of hallucinating about the product:

- Ground answers in facts from the knowledge base: **Llama-3.3-70B and GLM-4.5-Air (100%)**, **Qwen3.6-35B-A3B and gpt-oss-120B (91%)**.
- **Do not invoke the knowledge base at all (0%):** Qwen3-Next-80B (previous choice), Mistral-Small, Qwen3-Coder-30B.

::: warning Main conclusion of the round
The previous choice (Qwen3-Next-80B) builds reliably and quickly, but on "how to do X" questions **does not query the knowledge base** — it answers from memory. The new choice **Qwen3.6-35B-A3B** closes exactly this gap (91% grounding) without losing in building and **winning in speed**.
:::

## Speed on a single card {#скорость-на-однои-карте}

Locally, decode speed is limited by memory: `tok/s ≈ ПСП / (активные_параметры × байт)`. MoE models have few active parameters, making them **several times faster** than dense models at comparable quality. Figures marked "measured" were obtained via direct testing on our hardware (RTX PRO 6000, fp8, speed profile); the rest are estimates.

| Model | Active | decode tok/s | Source |
|---|---|---|---|
| **Qwen3.6-35B-A3B** | MoE 3B | **~245** | measured |
| Qwen3-Next-80B | MoE 3B | **~154** | measured |
| gpt-oss-120B | MoE 5B | ~67 | estimate |
| GLM-4.5-Air | MoE 12B | ~54 | estimate |
| Qwen3-30B-2507 | MoE 3B | ~41 | estimate |
| Qwen3-Coder-30B | MoE 3B | ~23 | estimate |
| Llama-3.3-70B | dense 70B | ~14 | estimate |
| Mistral-Small-24B | dense 24B | ~10 | estimate |
| Qwen3-32B | dense 32B | slow | estimate |

::: tip Speed is not a bottleneck for selection
The winner is deployed on our own GPU, where MoE models with 3B active parameters are fast: **Qwen3.6-35B-A3B measured faster than the previous choice** (245 vs. 154 tok/s) and has fewer total parameters → more VRAM headroom. With 2–3 simultaneous chats, the card is not saturated for any model — continuous batching provides an aggregate throughput higher than single-threaded. Exact figures for your hardware are obtained via a 5-minute run `vllm bench`.
:::

## Profile: speed vs quality (for hybrid models) {#профиль-speed-vs-quality-для-гибридных-моделеи}

Qwen3.6-35B-A3B is a **hybrid thinking model**: the reasoning mode is enabled via a request parameter `enable_thinking` (on the box — via the launch profile). We measured both modes with a direct probe:

| Mode | decode | what happens | meaning |
|---|---|:---:|---|
| **thinking OFF** (speed) | ~232 tok/s | full coherent response | what is needed for chat |
| **thinking ON** (quality) | ~259 tok/s | the entire token budget is spent on reasoning before the response | thinks with many tokens → higher latency to response |

::: tip Conclusion on the profile — deploy in speed (thinking off)
Decoding is equally fast in both modes (faster than the previous choice in any case). The cost of "quality" is **not slow decoding, but token volume**: with reasoning, the model spends a large budget on reasoning before the response, multiplying the latency. Meanwhile, 35B-A3B **already without reasoning** delivers a top result (knowledge base 91%, large process 38 nodes, tool selection 100%). Reasoning is not needed for Storm chat — it is an optional reserve for truly difficult reasoning tasks.
:::

## What to consider for self-hosting {#что-учесть-при-self-host}

Several self-host server settings that should be verified before production:

- **Configure the tool-call parser** for the selected model (`--tool-call-parser`; for Qwen3.6 — `qwen3_coder`) — otherwise, tool calls are sent as text, and the chat stops performing actions.
- **Hybrid architectures** (Qwen3-Next, Qwen3.6 — mamba/gated-delta) require `--enable-chunked-prefill`, otherwise vLLM fails on the mamba cache assertion.
- **Context**: the new default selection runs on a smaller window (32K) than the previous one (64K). For large diagrams + knowledge bases, increase `--max-model-len` to 65536 — 35B-A3B is smaller than 80B in total, and the KV cache for 64K fits in 96 GB with room to spare.
- **System prompt** does not need to be changed — it already requires explicit tool invocation and grounding through the knowledge base.
- **Gateway in front of the model** (corporate proxy, API-gateway) must allow streaming responses. If it returns `400` to `"stream": true`, disable the "Response streaming" toggle — see [AI Assistant Configuration](../AI_CHAT.md#стриминг-ответа). vLLM itself supports streaming; the issue is almost always in the intermediary layer.

## How to switch the process model {#как-переключить-модель}

Parameters are set in the application settings (AI section) and are applied **without a restart**:

| Parameter | What it sets | Value for the new selection |
|---|---|---|
| `bpmnAiCompletionBaseUrl` | Base URL of the OpenAI-compatible endpoint (**without** `/v1` — Storm will append it automatically) | `http://<llm-host>` |
| `bpmnAiCompletionModel` | Model name on this endpoint (exactly `--served-model-name`) | `qwen36-35b-a3b` |
| `bpmnAiCompletionTemperature` | Temperature | `0.2` |

::: tip Deployment Plan
Deploy **Qwen3.6-35B-A3B** (vLLM, fp8, speed profile / thinking off) on a 96 GB card — VRAM is sufficient with room to spare, and voice input fits alongside it. It is best to roll out **via an A/B flag for a subset of users** (share → chat metrics for 1–2 weeks → further), rather than a hard switch: this allows you to see if hallucinations about the product have disappeared (database grounding 0% → 91%) and whether quality is maintained on large diagrams.
:::

::: warning Run Conditions
The comparison was performed using the actual Storm backend and real MCP tools, on self-hosted vLLM (RTX PRO 6000, 96 GB), speed profile (for hybrid models, reasoning is disabled — in quality mode, their quality is even higher). Verification is done **based on the actual database state**, not on the model's response text; 2 repetitions to counter non-determinism; diagrams are rendered with the same library used in Storm. Speed is a reference, secondary criterion (quality is the priority).
:::

## Related documentation {#связанная-документация}

- **[Deployment on vLLM](./deploy-vllm.md)** — how to deploy the selected process model on vLLM (compose, flag breakdown, performance tuning)
- **[Enabling and connecting the model](../AI_CHAT.md)** — connecting the process model to Storm and configuring chat behavior
- **[AI chat knowledge base (RAG)](../KnowledgeBase.md)** — how the chat responds based on your reference documents
- **[System configuration](/en/configure/README.md)** — application settings and ENV variables
