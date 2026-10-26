---
title: Voice Input (storm-media)
order: 4
source_hash: c185e6d9062fb625
---

[[toc]]

# Voice Input in AI Chat {#голосовои-ввод-в-ai-чат}

Starting from version **6.6.6668**, you can dictate messages by voice in the AI chat: the microphone button in the input field
(or the hotkey <kbd>Ctrl</kbd>+<kbd>Space</kbd>) records a voice note of up to 60 seconds,
recognizes it, and inserts the text into the input field.

Speech recognition is performed by a **separate service `storm-media`** (Whisper model). The main
application remains a thin proxy: the browser sends the recording to the Storm backend, which forwards it to
storm-media and returns the recognized text. This article describes how to deploy storm-media and
enable voice input.

::: tip storm-media is not just for voice
The same service extracts text from **AI chat file attachments** (pdf with OCR, docx, doc, etc.) — see
[“File Attachments and Diagram Import”](./file-attachments.md). Document processing runs on **CPU**:
a GPU is only required for local Whisper. If voice input is not needed but attachments are — storm-media
can be deployed on a machine without a graphics card.
:::

## How It Works {#как-это-работает}

```
Браузер (запись микрофоном, ≤60 сек)
   │  POST /api/v1/ai/chat/transcribe
   ▼
Бэкенд Storm  ──── Authorization: Bearer <stormMediaToken> ────►  storm-media (Whisper)
   ▲                                                                 │
   └──────────────── распознанный текст ◄────────────────────────────┘
```

-   The browser records the audio (MediaRecorder), so the Storm page must be opened over **HTTPS** — otherwise, the browser will not grant access to the microphone.
-   Limits: up to **60 seconds** and up to **4 MB** per note (one minute of voice in webm/opus is approximately 1 MB).
-   Recognizing a one-minute note on the GPU takes a few seconds.

## Step 1. Requirements {#шаг-1-требования}

| Condition | Location | Comment |
| ------- | --- | ----------- |
| `MCP_ENABLED=true` | Main application ENV | Voice input is part of the AI module, just like chat (see [Enabling chat](./AI_CHAT.md)) |
| AI module in the license | License (`enableAiFeatures`) | Without it, the chat API is disabled |
| HTTPS for Storm | Your proxy/load balancer | Browser requirement for microphone access |
| storm-media service | Separate host/container | See Step 2. Local recognition requires an **NVIDIA GPU** |

::: tip Is a GPU required?
storm-media supports two recognition modes (`ASR_BACKEND`):

-   **`local`** (default) — the faster-whisper model `large-v3` runs inside the container.
    Data does not leave your perimeter, but an NVIDIA GPU (~5 GB of VRAM) is required. It is possible to run on CPU
    (`ASR_DEVICE=cpu`), but recognition will be significantly slower.
-   **`remote`** — storm-media proxies audio to an external OpenAI-compatible endpoint
    `/v1/audio/transcriptions` (your own Whisper server or a cloud service). No GPU is required on the storm-media host.
:::

## Step 2. Deploy storm-media {#шаг-2-развернуть-storm-media}

The image is built in the same registry as the enterprise application:

```bash
docker pull cr.selcloud.ru/stormbpmn-enterprise/storm-media:latest
```

Example `docker-compose.yml` for local recognition on GPU:

```yaml
services:
  storm-media:
    image: cr.selcloud.ru/stormbpmn-enterprise/storm-media:latest
    restart: unless-stopped
    environment:
      INTERNAL_TOKEN: "<секрет — придумайте длинную случайную строку>"
      ASR_BACKEND: "local"
    ports:
      - "8085:8080"                        # порт наружу — на ваше усмотрение
    volumes:
      - whisper_models:/models/whisper     # кэш весов модели (~3 ГБ), переживает обновления
      - media_tmp:/tmp/storm-media
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 5

volumes:
  whisper_models:
  media_tmp:
```

For `remote` mode, remove the `deploy:` block (GPU is not required) and add the following variables:

```yaml
    environment:
      INTERNAL_TOKEN: "<секрет>"
      ASR_BACKEND: "remote"
      ASR_BASE_URL: "http://whisper-host:8000"   # OpenAI-совместимый эндпоинт, БЕЗ /v1
      ASR_API_KEY: "<ключ, если требуется>"
```

Key environment variables for storm-media:

| Variable | Description | Default |
| ---------- | -------- | ------------ |
| **INTERNAL_TOKEN** | Shared-secret: requests without the `X-Internal-Token` header are rejected. Empty = validation disabled (for trusted networks only) | empty |
| **ASR_BACKEND** | `local` (Whisper built-in) or `remote` (external endpoint) | `local` |
| **ASR_MODEL** | faster-whisper model | `large-v3` |
| **ASR_DEVICE** | `cuda` / `cpu` / `auto` | `cuda` |
| **ASR_CACHE_DIR** | Weights cache directory (mount a volume) | `/models/whisper` |
| **ASR_BASE_URL** | For `remote`: endpoint address without `/v1` | empty |
| **ASR_API_KEY** | For `remote`: external service key | empty |

Health check: `GET /health` (liveness), `GET /ready` (model loaded and ready),
`GET /metrics` (Prometheus).

::: warning First run in local mode
Whisper weights (~3 GB) are **not embedded in the image** — on first start, the service downloads them from Hugging Face
into the `whisper_models` volume. The host requires one-time internet access. For a fully isolated
environment, pre-populate the volume (copy the cache directory from a machine with internet access) — the service
will then operate offline. While the model is loading, `GET /ready` returns an error — this is normal.
:::

## Step 3. Configure backend access to storm-media {#шаг-3-настроить-доступ-бэкенда-к-storm-media}

The Storm backend sends requests to storm-media with the **`Authorization: Bearer <stormMediaToken>`** header, while storm-media itself validates the **`X-Internal-Token`** header. There are two ways to link them:

**Option A — Direct (trusted private network).** Start storm-media with an empty
`INTERNAL_TOKEN` (validation disabled) and specify the service address directly in the Storm configuration.
Ensure that the storm-media port is not accessible from outside the perimeter.

**Option B — Via reverse-proxy (recommended).** Place nginx in front of storm-media to validate the Bearer token and inject `X-Internal-Token`:

```nginx
location /media/ {
    if ($http_authorization != "Bearer <ваш-внешний-токен>") { return 401; }
    proxy_set_header X-Internal-Token "<значение INTERNAL_TOKEN storm-media>";
    proxy_pass http://127.0.0.1:8085/;   # порт storm-media
    client_max_body_size 10m;
}
```

## Step 4. Enable voice input in the admin panel {#шаг-4-включить-голосовои-ввод-в-админ-панели}

All settings are located in the **Admin Panel**, in the **«🤖 AI Assistant»** section, under the **«Voice Input»** subgroup. Changes are applied on the fly, without a restart.

| Setting (key) | Type | Description |
| ---------------- | --- | -------- |
| **Voice input in chat** (`voiceInputEnabled`) | toggle | Displays the microphone button in the chat. **Disabled** by default |
| **storm-media: Base URL** (`stormMediaBaseUrl`) | string | The storm-media address, **without** `/v1` — the path is appended automatically. For Option A: `http://media-host:8085`; for Option B: `https://host/media` |
| **storm-media: token (Bearer)** (`stormMediaToken`) | string | The token that the backend sends in `Authorization: Bearer`. For Option A, specify any non-empty string (the service does not validate it); for Option B — the external token from the nginx configuration. This field is required: empty = "not configured" |
| **Recognition language (voice)** (`voiceInputLanguage`) | selection | `auto` / `ru` / `en` / `de`. Empty = `auto` (auto-detection occasionally fails on short clips — for a homogeneous audience, it is better to fix the language) |

Final checklist:

1. storm-media is running, and `GET /ready` responds successfully;
2. `MCP_ENABLED=true`, license with the AI module;
3. In the admin panel, `stormMediaBaseUrl` and `stormMediaToken` are filled in, and the "Voice input in chat" toggle is enabled;
4. Storm is opened via HTTPS — the microphone button has appeared in the chat input field.

## Troubleshooting {#устранение-неполадок}

| Symptom | Cause | Solution |
| ------- | ------- | ------- |
| Microphone button is missing | Toggle `voiceInputEnabled` is off, chat is unavailable (`MCP_ENABLED`/license) | Check the conditions from the checklist; the chat itself must be working |
| Browser does not grant access to the microphone | Storm is opened over HTTP | Configure HTTPS (a browser requirement, not a Storm requirement) |
| “Voice input is not configured” | Empty `stormMediaBaseUrl` or `stormMediaToken` | Fill in both settings in the admin panel |
| “Voice input is disabled” | Toggle `voiceInputEnabled` is off | Enable the toggle |
| “Failed to recognize the recording” | storm-media is unavailable, incorrect token/URL, recognition error | Check `GET /health` and `GET /ready` of storm-media, backend logs (lines `storm-media`), and storm-media container logs |
| “Audio recording is longer than 60 seconds” / “too large” | Note limits exceeded (60 sec / 4 MB) | Dictate shorter — the limit protects the GPU from long files |
| First requests fail after restarting storm-media | The model is still loading | Wait for a successful `GET /ready` |
