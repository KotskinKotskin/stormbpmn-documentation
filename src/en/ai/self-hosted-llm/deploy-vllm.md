---
title: Deployment on vLLM
order: 2
redirectFrom:
  - /en/configure/VLLM.html
source_hash: 67ae1f3ef68d235f
---

[[toc]]

# Deploying a Custom Model on vLLM {#развертывание-собственнои-модели-на-vllm}

A step-by-step guide on how to start a **custom OpenAI-compatible model server on
[vLLM](https://docs.vllm.ai/)** and connect the [Stormbpmn AI assistant](../AI_CHAT.md) to it. The configuration
below is the one used by our cloud AI chat; each parameter is explained to clarify its purpose.
For information on which model to choose and how many users a single GPU can handle, see the [Model Selection](./README.md) page.

::: warning What this article does not cover
- Installing NVIDIA drivers, CUDA, and `nvidia-container-toolkit`: it is assumed that `nvidia-smi`
  and `docker run --gpus all` are already working.
- Other engines (Ollama, llama.cpp, SGLang): the principle is the same (OpenAI-compatible server), but the flags differ.
:::

---

## Hardware Requirements {#требования-к-железу}

| | Our server | Minimum |
|---|---|---|
| GPU | 1× NVIDIA RTX PRO 6000 Blackwell, 96 GB | A card with 48 GB (with reduced context, see [Model Selection](./README.md#если-gpu-не-blackwell)) |
| CPU / RAM | 32 vCPU, 186 GB | Lightly loaded: all processing is done on the GPU |
| Disk | SSD for weight cache | At least 50 GB of free space (vLLM image and weights) |
| Driver | NVIDIA with CUDA 12.8+ support | Same |

The Qwen3.8-27B weights in NVFP4 occupy approximately 22 GB of VRAM. The rest is allocated by vLLM to the KV cache, which determines how many requests of what length are processed simultaneously.

::: tip Main rule
The weights must fit entirely in VRAM: vLLM does not offload them to system memory.
:::

---

## Files on the server {#фаилы-на-сервере}

```
/opt/storm-llm/
├── docker-compose.yml
├── nginx.conf
├── pr-48375.patch        # исправление vLLM для MTP + кэша префиксов
├── patch-and-run.sh      # накладывает исправление и запускает vLLM
└── hf-cache/             # кэш весов HuggingFace
```

### vLLM Fix {#исправление-vllm}

In vLLM `v0.27.1`, MTP speculative decoding combined with prefix caching on hybrid models (which includes Qwen3.8) sometimes restores state from unverified tokens. The fix is available in [vllm-project/vllm#48375](https://github.com/vllm-project/vllm/pull/48375). Until it is included in a release, we apply it at container startup.

Download the patch without tests:

```bash
cd /opt/storm-llm
gh pr diff 48375 --repo vllm-project/vllm \
  | awk '/^diff --git /{keep = ($0 !~ /tests\//)} keep' > pr-48375.patch
```

`patch-and-run.sh`:

```sh
#!/bin/sh
set -eu
TARGET=/usr/local/lib/python3.12/dist-packages
FILE=$TARGET/vllm/v1/core/single_type_kv_cache_manager.py
if grep -q 'max_num_blocks -= 1' "$FILE"; then
  echo "[pr-48375] уже наложен"
elif patch -p1 -d "$TARGET" --fuzz=3 --forward < /tmp/pr-48375.patch && grep -q 'max_num_blocks -= 1' "$FILE"; then
  echo "[pr-48375] наложен"
else
  echo "[pr-48375] не наложился, запуск без исправления отменён" >&2
  exit 1
fi
exec vllm serve "$@"
```

::: warning Without the fix
If the patch cannot be applied, remove `--speculative-config` from the command. The model will work correctly, but generation will be slower.
:::

---

## docker-compose.yml {#docker-compose-yml}

```yaml
services:
  vllm:
    image: vllm/vllm-openai:v0.27.1            # версия закреплена, см. «Обновление vLLM»
    container_name: storm-vllm
    restart: unless-stopped
    runtime: nvidia
    shm_size: 16gb                             # vLLM активно использует /dev/shm
    environment:
      - HF_HUB_ENABLE_HF_TRANSFER=1            # быстрая загрузка весов
      - HF_TOKEN=${HF_TOKEN}                   # токен HuggingFace из .env, в файл не вписывать
    volumes:
      - ./hf-cache:/root/.cache/huggingface    # кэш весов: не качать при каждом рестарте
      - ./pr-48375.patch:/tmp/pr-48375.patch:ro
      - ./patch-and-run.sh:/usr/local/bin/patch-and-run.sh:ro
    entrypoint: ["/bin/sh", "/usr/local/bin/patch-and-run.sh"]
    ports:
      - "127.0.0.1:8000:8000"                  # только localhost, наружу публикует nginx
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: ["gpu"]
    command:
      - "unsloth/Qwen3.8-27B-NVFP4"
      - "--served-model-name"
      - "qwen3.8-27b"
      - "--trust-remote-code"
      - "--max-model-len"
      - "262144"
      - "--kv-cache-dtype"
      - "fp8"
      - "--gpu-memory-utilization"
      - "0.85"
      - "--max-num-seqs"
      - "16"
      - "--enable-prefix-caching"
      - "--enable-chunked-prefill"
      - "--speculative-config"
      - '{"method":"mtp","num_speculative_tokens":3}'
      - "--enable-auto-tool-choice"
      - "--tool-call-parser"
      - "qwen3_coder"
      - "--reasoning-parser"
      - "qwen3"
      - "--default-chat-template-kwargs"
      - '{"enable_thinking": false, "preserve_thinking": true}'
      - "--override-generation-config"
      - '{"temperature":0.7,"top_p":0.8,"top_k":20,"repetition_penalty":1.0}'
      - "--host"
      - "0.0.0.0"
      - "--port"
      - "8000"
    healthcheck:
      test: ["CMD-SHELL", "curl -sf http://127.0.0.1:8000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 1800s                      # первый старт: загрузка весов и компиляция CUDA-графов

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

On non-Blackwell cards, replace the first line `command` with `Qwen/Qwen3.8-27B-FP8`, and leave the rest unchanged.

---

## Flag Breakdown {#разбор-флагов}

| Flag | Value | Purpose |
| ---- | -------- | ----- |
| model (first argument) | `unsloth/Qwen3.8-27B-NVFP4` | Weights on HuggingFace or a path to a local folder with weights. |
| `--served-model-name` | `qwen3.8-27b` | Model name in the API. **This is the value to enter in `bpmnAiCompletionModel` in Stormbpmn.** |
| `--trust-remote-code` | enabled | The Qwen3.8 architecture is provided by the model code. |
| `--max-model-len` | `262144` | Full model context window. On 96 GB, it fits along with 16 parallel requests thanks to the fp8 KV cache. |
| `--kv-cache-dtype` | `fp8` | KV cache is half the size of bf16, with no noticeable loss in quality. |
| `--gpu-memory-utilization` | `0.85` | Share of VRAM for vLLM. The remainder is allocated for voice input on the same card and system needs. |
| `--max-num-seqs` | `16` | Number of requests processed simultaneously. At peak, our cloud uses this fully. |
| `--enable-prefix-caching` | enabled | **Main optimization for chat**: the system prompt, tool descriptions, and dialogue history are repeated in each request and are retrieved from the cache rather than recalculated. |
| `--enable-chunked-prefill` | enabled | **Required** for hybrid Qwen models; otherwise, vLLM crashes during cache validation. |
| `--speculative-config` | MTP, 3 tokens | The model predicts several tokens ahead and verifies them in a single step. Speeds up generation, most significantly with a low number of concurrent requests. A value of 4 on `v0.27.1` crashes under load. |
| `--enable-auto-tool-choice` | enabled | **Required**: the model decides which tool to invoke. |
| `--tool-call-parser` | `qwen3_coder` | **Required**: parses tool calls in the Qwen3.8 format. |
| `--reasoning-parser` | `qwen3` | Separates the model's reasoning from the response. |
| `--default-chat-template-kwargs` | `enable_thinking: false`, `preserve_thinking: true` | By default, the model responds without reasoning. Stormbpmn enables them automatically if `bpmnAiChatThinking = enabled`. `preserve_thinking` preserves past reasoning in the history, so the prefix cache hits more often. |
| `--override-generation-config` | `temperature 0.7, top_p 0.8, top_k 20` | Recommended Qwen parameters for the no-reasoning mode. The temperature from the Stormbpmn request (`bpmnAiCompletionTemperature`, 0.2) is applied by vLLM on top of this. |
| `--host` / `--port` | `0.0.0.0` / `8000` | Inside the container; externally, the port is accessible only on localhost. |

::: danger Chat does not work without a tool parser
`--enable-auto-tool-choice` and `--tool-call-parser qwen3_coder` are mandatory flags. If they are missing or
a different parser is specified, the model writes "done" without doing anything.
:::

---

## nginx {#nginx}

vLLM listens only on `127.0.0.1:8000`, and nginx exposes it externally on port 80. Using nginx makes it convenient to add TLS, authentication, IP restrictions, and request logging.

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://vllm:8000;
        proxy_read_timeout 600s;   # длинные ответы не обрываем по таймауту
        proxy_buffering off;       # нужен для стриминга ответов
    }
}
```

::: tip Restrict external access
If the server is accessible from the internet, add TLS and authentication to nginx or restrict access by IP.
:::

---

## Startup and Autostart {#запуск-и-автозагрузка}

```bash
cd /opt/storm-llm
echo "HF_TOKEN=hf_..." > .env && chmod 600 .env
docker compose up -d              # первый старт — до 30 минут: загрузка весов и CUDA-графы
docker logs -f storm-vllm         # ждём "[pr-48375] наложен" и "Application startup complete"
curl -sf http://127.0.0.1:8000/health && echo OK
```

`restart: unless-stopped` starts the containers after a server reboot. If an explicit system service is required:

```ini
# /etc/systemd/system/storm-llm.service
[Unit]
Description=Stormbpmn LLM (vLLM + nginx)
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

## Connecting Stormbpmn {#подключение-stormbpmn}

In the AI assistant settings ([Enabling and connecting the model](../AI_CHAT.md)), specify:

| Field | Value |
| ---- | -------- |
| API Format | `OPENAI` |
| Base URL | `http://<llm-host>`, **without `/v1`** |
| Model | `qwen3.8-27b` (exactly `--served-model-name`) |
| Token | empty if the server has no authorization; otherwise, the key that nginx validates |
| Reasoning (`bpmnAiChatThinking`) | `enabled` if response streaming is enabled; otherwise `disabled` |

Verification from the Stormbpmn server:

```bash
curl -s http://<llm-host>/v1/models
```

---

## Performance Diagnostics {#диагностика-производительности}

Every 10 seconds, vLLM writes metrics to the log:

```
Avg prompt throughput: 4630 tokens/s, Avg generation throughput: 310 tokens/s,
Running: 9 reqs, Waiting: 0 reqs, GPU KV cache usage: 41.0%, Prefix cache hit rate: 87.5%
```

- **Running / Waiting** — requests in progress and in the queue. `Waiting` consistently greater than zero — you have hit the
  `--max-num-seqs` or the KV cache limit.
- **generation throughput** — generation rate, tokens per second, aggregated across all requests.
- **GPU KV cache usage** — KV cache utilization. Around 100% — request eviction and a sharp slowdown will begin.
- **Prefix cache hit rate** — the proportion of input retrieved from the cache. For the Stormbpmn chat, it is high because
  each turn's request repeats the beginning of the previous one. A sharp drop indicates that the cache is disabled
  or insufficient.

### When to add capacity {#когда-добавлять-мощность}

| What is observed | Action |
|---|---|
| `Waiting > 0` during business hours, KV cache below 80% | increase `--max-num-seqs` to 24–32 |
| KV cache around 100%, `Preempt` in logs | decrease `--max-model-len` to 131072 or add a second card |
| More than 200 chat users per day | add a second card with the same compose and a load balancer in front of them |

Quick check:

```bash
nvidia-smi --query-gpu=utilization.gpu,memory.used,temperature.gpu --format=csv,noheader
docker logs storm-vllm 2>&1 | grep -E "Running:|Preempt" | tail -10
```

---

## Updating vLLM {#обновление-vllm}

The image version is pinned (`v0.27.1`) because tool parsers, prefix cache, and MTP depend on the version. Upgrade to the new version as follows:

1. Verify that the fix for [#48375](https://github.com/vllm-project/vllm/pull/48375) is included in the release.
   If it is, remove `entrypoint`, the patch, and the script from compose.
2. Deploy the new version to a test environment and verify the chat: process model creation, knowledge base response, and 16 concurrent requests.
3. Only then update the image on the main server.
