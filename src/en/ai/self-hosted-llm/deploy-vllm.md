---
title: Deployment on vLLM
order: 2
redirectFrom:
    - /en/configure/VLLM.html
source_hash: e101dc4412f9a709
---

[[toc]]

# Deploying a Custom Model on vLLM {#развертывание-собственнои-модели-на-vllm}

This article is a step-by-step guide on how to spin up a **custom OpenAI-compatible LLM endpoint on
[vLLM](https://docs.vllm.ai/)**, which is then connected to the [Storm AI assistant](../AI_CHAT.md).
The breakdown is based on **our actual production configuration** — explaining **why** each
parameter was chosen and what performance lessons we learned.

::: tip Why self-hosting
Cloud providers (OpenAI, Anthropic, ProxyAPI) offer the fastest start. However, if you need **data to remain
within the perimeter**, no external dependencies, or cost control — you host the model yourself.
vLLM provides an OpenAI-compatible API, so Storm works with it just as it does with the cloud.
:::

::: warning What this article does NOT cover
- Installing NVIDIA / CUDA / `nvidia-container-toolkit` drivers — it is assumed that `nvidia-smi`
  and `docker run --gpus all` are already working.
- Other engines (Ollama, llama.cpp, TGI) — the principle is the same (OpenAI-compatible endpoint), but the flags differ.
- Hardware selection/rental — we only provide VRAM guidelines.
:::

---

## Hardware Requirements {#требования-к-железу}

vLLM keeps the **model weights + KV cache** in video memory. A rough VRAM guideline:

| Model | Quantization | Required VRAM (weights) | + KV cache |
| ------ | ----------- | ----------------- | -------- |
| 8–14B  | fp8/awq     | ~10–16 GB         | + headroom for context |
| 30–32B | fp8         | ~32–40 GB         | + headroom |
| 80B (MoE A3B) | fp8  | ~80 GB            | + headroom |

**Our example (production):**
- 1× GPU **NVIDIA RTX PRO 6000 Blackwell, 96 GB VRAM** — the recommended Qwen3.6-35B-A3B model in fp8
  takes up ~35 GB, with the remainder allocated for the KV cache, parallelism, and voice input (the card can also handle 80B in fp8).
- 32 vCPU, 186 GB RAM (CPU/RAM are barely loaded — all processing happens on the GPU).
- Disk space for the HuggingFace weights cache (35B ≈ 35–70 GB on disk).

::: tip Main rule
**The weights must fit entirely in VRAM** (vLLM does not handle offloading to RAM well). What remains after the weights
is allocated to the KV cache, which determines how many requests of what length can be served in parallel.
:::

---

## Model Selection — Brief Overview {#выбор-модели-—-кратко}

We deploy **`Qwen/Qwen3.6-35B-A3B`**. Why this specific model — a benchmark of 10 models via a real Storm chat (with verification against the database), a candidate table under 96 GB, and measured speeds are on the adjacent page **[Model Selection](./README.md)**. In short: it grounds answers through the knowledge base (91% versus 0% for the previous choice, Qwen3-Next-80B), assembles a large process model, and is **measured to be faster** than the previous choice (245 vs. 154 tok/s). Here, one requirement for any model you deploy is critical:

::: danger Function-calling is mandatory
The Storm AI assistant works **exclusively through tool calls** (diagram creation/editing, search, assignments). A model without reliable tool/function-calling is unsuitable — it will "talk" rather than act. Ensure the model supports tool-calling and that the **correct tool parser** is specified for it in vLLM (`--tool-call-parser`; for Qwen3.6 — `qwen3_coder`, for Qwen3-Next — `hermes`, see the parser table on the [Model Selection](./README.md) page). Without this, the Storm chat will not function.
:::

---

## docker-compose.yml {#docker-compose-yml}

We run vLLM in Docker (image `vllm/vllm-openai`) + a lightweight **nginx proxy** in front of it. Full example
(secrets as placeholders):

```yaml
services:
  vllm:
    image: vllm/vllm-openai:latest
    container_name: storm-vllm
    restart: unless-stopped
    runtime: nvidia
    shm_size: 16gb                       # vLLM активно использует /dev/shm; мало — будут падения
    environment:
      - HF_HUB_ENABLE_HF_TRANSFER=1      # быстрая загрузка весов с HuggingFace
      - HF_TOKEN=hf_xxxxxxxxxxxxxxxxx    # токен HF (для gated-моделей)
    volumes:
      - ./hf-cache:/root/.cache/huggingface   # кэш весов — чтобы не качать при каждом рестарте
    ports:
      - "127.0.0.1:8000:8000"           # vLLM слушает ТОЛЬКО на localhost — наружу его даёт nginx
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: ["gpu"]
    command:
      - "--model"
      - "Qwen/Qwen3.6-35B-A3B"
      - "--served-model-name"
      - "qwen36-35b-a3b"
      - "--quantization"
      - "fp8"
      - "--trust-remote-code"
      - "--max-model-len"
      - "65536"
      - "--gpu-memory-utilization"
      - "0.92"
      - "--max-num-seqs"
      - "8"
      - "--attention-backend"
      - "flashinfer"
      - "--kv-cache-dtype"
      - "fp8_e4m3"
      - "--enable-prefix-caching"
      - "--enable-chunked-prefill"             # обязательно для гибридных Qwen (mamba/gated-delta)
      - "--speculative-config"
      - '{"method": "mtp", "num_speculative_tokens": 3}'   # MTP-спекулятив — ускоряет decode
      - "--enable-auto-tool-choice"
      - "--tool-call-parser"
      - "qwen3_coder"
      - "--reasoning-parser"
      - "qwen3"
      - "--host"
      - "0.0.0.0"
      - "--port"
      - "8000"
    healthcheck:
      test: ["CMD-SHELL", "curl -sf http://127.0.0.1:8000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 1800s               # первый старт 80B долгий (загрузка + компиляция CUDA-графов)

  nginx:
    image: nginx:alpine
    container_name: storm-nginx
    restart: unless-stopped
    depends_on: [vllm]
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

---

## Breaking Down vLLM Flags (and Why) {#разбор-флагов-vllm-и-почему-так}

This is the most important part. Each parameter `command` and its rationale:

| Flag | Our Value | Why |
| ---- | ------------- | ------ |
| `--model` | `Qwen/Qwen3.6-35B-A3B` | The model ID on HuggingFace (or a path to local weights). |
| `--served-model-name` | `qwen36-35b-a3b` | The name under which the model is visible in the API. **This is exactly what goes into the "Model" field in the Storm admin panel.** |
| `--quantization` | `fp8` | 35B-A3B in fp8 ≈ 35 GB — fits on a single 96 GB card with plenty of headroom for the KV-cache and voice input. fp8 loses almost no quality. |
| `--trust-remote-code` | (enabled) | The Qwen3.6 architecture ships with model code — vLLM must execute it. |
| `--max-model-len` | `65536` | Maximum context (input+output) per request. **A direct trade-off with parallelism** — see below. 64K is more than enough for the Storm chat (diagrams + knowledge base + tool schemas). |
| `--gpu-memory-utilization` | `0.92` | The share of VRAM allocated to vLLM. The rest goes to the system; for a lightweight 35B-A3B, this is more than sufficient. |
| `--max-num-seqs` | `8` | How many requests the engine processes **simultaneously** (batch). Increase for higher loads. |
| `--attention-backend` | `flashinfer` | A fast attention backend for Blackwell (sm_120). |
| `--kv-cache-dtype` | `fp8_e4m3` | fp8 KV-cache — halves memory usage for context, increases parallelism (speed profile; in the quality profile, this flag is removed in favor of bf16 precision). |
| `--enable-prefix-caching` | (enabled) | **Key optimization** — caches the common prompt prefix across requests. See the tuning section. |
| `--enable-chunked-prefill` | (enabled) | **Mandatory** for hybrid Qwen models (mamba/gated-delta) — otherwise vLLM crashes on the mamba-cache assertion. |
| `--speculative-config` | `mtp, n=3` | MTP speculative decoding — speeds up generation on "easy" tokens. |
| `--enable-auto-tool-choice` | (enabled) | **Mandatory for the Storm chat** — allows the model to decide on its own which tool to call. |
| `--tool-call-parser` | `qwen3_coder` | Tool-call format parser for Qwen3.6. For Qwen3-Next, it would be `hermes`. Without the correct parser, tools are not recognized. |
| `--reasoning-parser` | `qwen3` | Reasoning block parser (the model is hybrid). By default (speed profile), reasoning is disabled — see below. |
| `--host` / `--port` | `0.0.0.0` / `8000` | Inside the container; the container exposes port `ports:` to the outside only on localhost. |

::: danger Without `--enable-auto-tool-choice` + the correct `--tool-call-parser`, the chat will not work
These are not optional "enhancements" but **mandatory** flags: the entire Storm assistant is built on tool calls. If you forget the tool parser or specify the wrong one (`hermes` instead of `qwen3_coder`), the model will write "done" without doing anything.
:::

::: tip Speed vs. Quality Profile (hybrid thinking models)
Qwen3.6-35B-A3B can "think." Reasoning is a **request parameter** `enable_thinking`, and the launch profile only sets the default and the KV-cache type. **For the Storm chat, the speed profile (thinking off) is recommended:** the model delivers top results even without reasoning, while enabling "thinking" only multiplies token consumption (and latency) per response without speeding up decoding. The **quality** profile = remove `--kv-cache-dtype fp8_e4m3` (revert to bf16 KV) and send `enable_thinking=true`; keep it as an optional reserve for difficult tasks.
:::

::: warning Blackwell (sm_120) Specifics
On the RTX PRO 6000 (sm_120), **do not force** the FlashInfer-MoE environment variables from B200 recipes (`VLLM_USE_FLASHINFER_MOE_*`) — the corresponding kernels are not supported there, and vLLM will select MARLIN on its own.
For MXFP4 models (gpt-oss), flashinfer-attention is disabled; for GPTQ models (GLM), vLLM detects the quantization itself (`gptq_marlin`), and the `--quantization` flag is not needed.
:::

---

## nginx proxy: why it is needed {#nginx-прокси-зачем-он}

vLLM listens only on `127.0.0.1:8000`. It is exposed externally via **nginx on :80**. Why not directly:

- **Single point** for TLS, BasicAuth, rate-limit, and logs — in case you need to restrict the endpoint.
- The Storm backend connects to `http://<llm-host>` (port 80) — there is no need to access vLLM directly.

Minimal `nginx.conf` (proxying):

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://vllm:8000;
        proxy_read_timeout 600s;   # генерация бывает долгой — не рубим по таймауту
        proxy_buffering off;       # стриминг ответов
    }
}
```

::: tip External access — secure it
If the box is exposed to the internet, you must add **BasicAuth/TLS** to nginx or restrict access by IP.
An open LLM endpoint = free generation for everyone.
:::

---

## Startup and Autostart {#запуск-и-автозагрузка}

```bash
cd /opt/storm-llm
docker compose up -d              # первый старт 80B — несколько минут (загрузка весов + CUDA-графы)
docker logs -f storm-vllm         # ждём "Application startup complete"
curl -sf http://127.0.0.1:8000/health && echo OK
```

To start on server reboot — `restart: unless-stopped` is already present in compose; additionally, you can wrap it in a **systemd unit** that triggers `docker compose up`:

```ini
# /etc/systemd/system/storm-llm.service
[Unit]
Description=Storm LLM (vLLM + nginx) via docker compose
Requires=docker.service
After=docker.service
[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/storm-llm
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable --now storm-llm.service
```

---

## Connecting Storm to the Endpoint {#подключение-storm-к-эндпоинту}

In the Storm admin panel ([AI chat configuration](../AI_CHAT.md)), specify the following:

| Field | Value |
| ---- | -------- |
| API Format | `OPENAI` (vLLM OpenAI-compatible) |
| Base URL | `http://<llm-host>` — **without `/v1`** (Storm will append `/v1/chat/completions` automatically) |
| Model | `qwen36-35b-a3b` (exactly `--served-model-name`) |
| Token | Leave empty if the endpoint has no authentication; otherwise, use your key from nginx-auth |

---

## Performance Tuning and Diagnostics {#тюнинг-и-диагностика-производительности}

vLLM writes metrics to the log every ~10 seconds — this is the primary diagnostic tool:

```
Avg prompt throughput: 4630 tokens/s, Avg generation throughput: 45 tokens/s,
Running: 2 reqs, Waiting: 0 reqs, GPU KV cache usage: 10.1%, Prefix cache hit rate: 44.9%
```

How to read this:
- **Running / Waiting** — the number of requests in progress and in the queue. A stable Waiting > 0 indicates that you have hit the `max-num-seqs` or KV cache limit.
- **generation throughput** — tokens per second per generation. It decreases as Running increases (compute is shared among requests) — this is normal batching behavior.
- **GPU KV cache usage** — KV cache utilization. Approaching 100% leads to preemption and a sharp slowdown.
- **Prefix cache hit rate** — the proportion of prompt tokens retrieved from the cache (see below).

### Prefix caching — the main lever for chat {#prefix-caching-—-главныи-рычаг-для-чата}

The chat sends the **same system prompt + tool schemas on every turn** (thousands of tokens). Without prefix caching, vLLM reprocesses them on every request — wasting GPU resources. `--enable-prefix-caching` caches this common prefix.

In our case, enabling it increased the **hit rate from 0% to ~45%** (and higher for multi-turn dialogues): nearly half of the prefill is served from the cache → less load, faster responses, especially under parallel load.

::: warning Hybrid models (Qwen3-Next, Mamba) — prefix caching is experimental
For hybrid architectures, vLLM enables prefix caching in `Mamba cache 'align'` mode and marks it as **experimental**. It works stably for us, but verify it on your vLLM version and workload. If you encounter anomalies — disable the flag (`--no-enable-prefix-caching` / remove `--enable-prefix-caching`).
:::

### Context ↔ Parallelism {#контекст-↔-параллельность}

`--max-model-len` and parallelism are related: the KV cache is shared among requests, and the longer the maximum request, the fewer fit simultaneously.

> Real-world measurement: with `--max-model-len 131072`, the maximum concurrency for full-size requests was ~4×; with `65536`, it became **8.24×** — twice as many parallel requests with the same KV cache.

Therefore: **do not set the context larger than actually needed.** For the Storm chat, 64K is more than enough, and the freed-up KV cache goes toward parallelism.

### "Slow Response" — Checklist {#«медленно-отвечает»-—-чек-лист}

```bash
# 1. GPU занят генерацией или простаивает?
nvidia-smi --query-gpu=utilization.gpu,memory.used,temperature.gpu --format=csv,noheader
#    100% util + 1 запрос = модель просто считает (норма для тяжёлого хода)
#    100% util + 6-8 запросов = контеншн: per-request генерация просядет

# 2. Очередь / вытеснение / hit-rate
docker logs storm-vllm 2>&1 | grep -E "Running:|Preempt|Prefix cache hit" | tail -10

# 3. Память под KV
docker logs storm-vllm 2>&1 | grep -E "KV cache size|Maximum concurrency"
```

Typical conclusions:
- **100% util with a single request** — this is not overload, but the computation of a heavy step (large context + long generation). It is resolved by prefix caching and slimming down prompts/context.
- **Many Running + throughput drop** — actual GPU contention. Prefix caching helps (less duplicate prefill), and, if necessary, a second card / a lighter model for reading.
- **Preempt in logs** — KV cache is full: reduce `--max-model-len` or `--max-num-seqs`.

---

## Known nuances {#известные-нюансы}

- **fp8** — excellent quality/memory balance for large models; for small ones, use `awq`/`gptq`.
- **Hybrid thinking models** (Qwen3.6) — reasoning is enabled via the request parameter `enable_thinking`,
  not a launch flag; for the Storm chat, keep them **disabled** (speed profile). When reasoning is enabled,
  allocate more `--max-model-len`/`maxTokens` and account for a significantly higher token consumption and
  response latency (see [AI chat configuration](../AI_CHAT.md), the section on reasoning).
- **Parser per model** — changing the model → change `--tool-call-parser` (Qwen3.6 → `qwen3_coder`,
  Qwen3-Next → `hermes`, Llama → `llama3_json`, GLM → `glm45`, gpt-oss → `openai`, Mistral → `mistral`).
- **First start is slow** — vLLM compiles CUDA graphs; `start_period: 1800s` in the healthcheck
  accounts for this. Weights are cached in `hf-cache`, so subsequent restarts are faster.
