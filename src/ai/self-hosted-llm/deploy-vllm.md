---
title: "Развёртывание на vLLM"
order: 2
redirectFrom:
    - /configure/VLLM.html
---

[[toc]]

# Развёртывание собственной модели на vLLM

Эта статья — пошаговая инструкция, как поднять **собственный OpenAI-совместимый эндпоинт LLM на
[vLLM](https://docs.vllm.ai/)**, к которому потом подключается [AI-ассистент Storm](../AI_CHAT.md).
Разбор построен на **нашей реальной production-конфигурации** — с объяснением, **почему** выбран каждый
параметр, и какие уроки по производительности мы вынесли.

::: tip Зачем self-hosting
Облачные провайдеры (OpenAI, Anthropic, ProxyAPI) — самый быстрый старт. Но если нужны **данные внутри
периметра**, отсутствие внешних зависимостей или контроль над стоимостью — модель поднимают у себя.
vLLM даёт OpenAI-совместимый API, поэтому Storm работает с ним так же, как с облаком.
:::

::: warning Что эта статья НЕ покрывает
- Установку драйверов NVIDIA / CUDA / `nvidia-container-toolkit` — предполагается, что `nvidia-smi`
  и `docker run --gpus all` уже работают.
- Другие движки (Ollama, llama.cpp, TGI) — принцип тот же (OpenAI-совместимый эндпоинт), но флаги свои.
- Выбор/аренду железа — даём только ориентиры по VRAM.
:::

---

## Требования к железу

vLLM держит **веса модели + KV-кэш** в видеопамяти. Грубый ориентир по VRAM:

| Модель | Квантизация | Нужно VRAM (веса) | + KV-кэш |
| ------ | ----------- | ----------------- | -------- |
| 8–14B  | fp8/awq     | ~10–16 ГБ         | + запас под контекст |
| 30–32B | fp8         | ~32–40 ГБ         | + запас |
| 80B (MoE A3B) | fp8  | ~80 ГБ            | + запас |

**Наш пример (production):**
- 1× GPU **NVIDIA RTX PRO 6000 Blackwell, 96 ГБ VRAM** — рекомендованная модель Qwen3.6-35B-A3B в fp8
  занимает ~35 ГБ, остальное идёт под KV-кэш, параллельность и голосовой ввод (карта тянет и 80B в fp8).
- 32 vCPU, 186 ГБ RAM (CPU/RAM почти не нагружены — вся работа на GPU).
- Диск под кэш весов HuggingFace (35B ≈ 35–70 ГБ на диске).

::: tip Главное правило
**Веса должны помещаться в VRAM целиком** (vLLM не любит выгрузку в RAM). Что осталось после весов —
идёт под KV-кэш, а он определяет, сколько запросов и какой длины обслуживаются параллельно.
:::

---

## Выбор модели — кратко

Разворачиваем **`Qwen/Qwen3.6-35B-A3B`**. Почему именно она — бенчмарк 10 моделей через реальный чат
Storm (с проверкой по факту в базе данных), таблица кандидатов под 96 ГБ и замеренные скорости — на
соседней странице **[Выбор модели](./README.md)**. Коротко: грунтит ответы через базу знаний (91% против
0% у прежнего выбора Qwen3-Next-80B), собирает крупный процесс и при этом **замерена быстрее** прежнего
выбора (245 против 154 tok/s). Здесь важно одно требование к любой модели, которую вы развернёте:

::: danger Function-calling обязателен
AI-ассистент Storm работает **только через вызовы инструментов** (создание/правка диаграмм, поиск,
назначения). Модель без надёжного tool/function-calling не годится — она будет «рассказывать», а не
делать. Убедитесь, что у модели есть поддержка tool-calling и что для неё в vLLM указан **правильный
парсер тулов** (`--tool-call-parser`; для Qwen3.6 — `qwen3_coder`, для Qwen3-Next — `hermes`, см.
таблицу парсеров на странице [Выбор модели](./README.md)). Без этого чат Storm не заработает.
:::

---

## docker-compose.yml

Мы запускаем vLLM в Docker (образ `vllm/vllm-openai`) + лёгкий **nginx-прокси** перед ним. Полный пример
(секреты — плейсхолдерами):

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

## Разбор флагов vLLM (и почему так)

Это самое важное. Каждый параметр `command` и его обоснование:

| Флаг | Наше значение | Почему |
| ---- | ------------- | ------ |
| `--model` | `Qwen/Qwen3.6-35B-A3B` | ID модели на HuggingFace (или путь к локальным весам). |
| `--served-model-name` | `qwen36-35b-a3b` | Имя, под которым модель видна в API. **Именно это вписывается в поле «Модель» в админке Storm.** |
| `--quantization` | `fp8` | 35B-A3B в fp8 ≈ 35 ГБ — влезает в одну 96 ГБ карту с большим запасом под KV-кэш и голосовой ввод. fp8 почти не теряет качество. |
| `--trust-remote-code` | (вкл) | Архитектура Qwen3.6 поставляется кодом модели — vLLM должен его исполнить. |
| `--max-model-len` | `65536` | Максимальный контекст (вход+выход) на запрос. **Прямой компромисс с параллельностью** — см. ниже. 64K с запасом хватает чату Storm (схемы + база знаний + схемы тулов). |
| `--gpu-memory-utilization` | `0.92` | Доля VRAM под vLLM. Остальное — системе; для лёгкой 35B-A3B этого хватает с избытком. |
| `--max-num-seqs` | `8` | Сколько запросов движок обрабатывает **одновременно** (батч). Под более высокую нагрузку поднимают. |
| `--attention-backend` | `flashinfer` | Быстрый attention-бэкенд под Blackwell (sm_120). |
| `--kv-cache-dtype` | `fp8_e4m3` | fp8 KV-кэш — вдвое меньше памяти под контекст, выше параллельность (профиль speed; в quality этот флаг убирают ради bf16-точности). |
| `--enable-prefix-caching` | (вкл) | **Ключевая оптимизация** — кэширует общий префикс промптов между запросами. См. раздел про тюнинг. |
| `--enable-chunked-prefill` | (вкл) | **Обязательно** для гибридных Qwen (mamba/gated-delta) — иначе vLLM падает на ассерте mamba-кэша. |
| `--speculative-config` | `mtp, n=3` | MTP-спекулятивное декодирование — ускоряет генерацию на «лёгких» токенах. |
| `--enable-auto-tool-choice` | (вкл) | **Обязательно для чата Storm** — разрешает модели самой решать, какой тул вызвать. |
| `--tool-call-parser` | `qwen3_coder` | Парсер формата tool-call под Qwen3.6. Для Qwen3-Next был бы `hermes`. Без правильного парсера тулы не распознаются. |
| `--reasoning-parser` | `qwen3` | Парсер блока размышлений (модель гибридная). По умолчанию (профиль speed) размышления выключены — см. ниже. |
| `--host` / `--port` | `0.0.0.0` / `8000` | Внутри контейнера; наружу контейнера порт даёт `ports:` только на localhost. |

::: danger Без `--enable-auto-tool-choice` + правильного `--tool-call-parser` чат не работает
Это не опциональные «улучшалки», а **обязательные** флаги: весь ассистент Storm построен на вызовах
инструментов. Забыли парсер тулов или указали чужой (`hermes` вместо `qwen3_coder`) — модель будет
писать «готово», ничего не делая.
:::

::: tip Профиль speed vs quality (гибридные thinking-модели)
Qwen3.6-35B-A3B умеет «размышлять». Размышления — это **параметр запроса** `enable_thinking`, а профиль
запуска лишь задаёт дефолт и тип KV-кэша. **Для чата Storm рекомендуется speed (thinking off):** модель и
без размышлений даёт топ-результат, а включённое «думание» лишь кратно увеличивает расход токенов (и
латенси) на ответ, не ускоряя decode. Профиль **quality** = убрать `--kv-cache-dtype fp8_e4m3` (вернуть
bf16 KV) и слать `enable_thinking=true`; держите его как опциональный запас под трудные задачи.
:::

::: warning Особенности Blackwell (sm_120)
На RTX PRO 6000 (sm_120) **не форсируйте** FlashInfer-MoE env-переменные из рецептов для B200
(`VLLM_USE_FLASHINFER_MOE_*`) — соответствующие кернелы там не поддерживаются, vLLM сам выберет MARLIN.
Для MXFP4-моделей (gpt-oss) flashinfer-attention отключают; для GPTQ-моделей (GLM) квантизацию vLLM
определяет сам (`gptq_marlin`), флаг `--quantization` не нужен.
:::

---

## nginx-прокси: зачем он

vLLM слушает только на `127.0.0.1:8000`. Наружу его публикует **nginx на :80**. Зачем не напрямую:

- **Единая точка** для TLS, BasicAuth, rate-limit, логов — если понадобится закрыть эндпоинт.
- Storm-бэкенд ходит на `http://<llm-host>` (порт 80) — а внутрь vLLM лезть напрямую не нужно.

Минимальный `nginx.conf` (проксирование):

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

::: tip Доступ извне — закройте
Если бокс смотрит в интернет — обязательно добавьте в nginx **BasicAuth/TLS** или ограничьте по IP.
Открытый LLM-эндпоинт = бесплатная генерация для всех желающих.
:::

---

## Запуск и автозагрузка

```bash
cd /opt/storm-llm
docker compose up -d              # первый старт 80B — несколько минут (загрузка весов + CUDA-графы)
docker logs -f storm-vllm         # ждём "Application startup complete"
curl -sf http://127.0.0.1:8000/health && echo OK
```

Для старта при перезагрузке сервера — `restart: unless-stopped` в compose уже есть; дополнительно можно
завернуть в **systemd-юнит**, который дёргает `docker compose up`:

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

## Подключение Storm к эндпоинту

В админке Storm ([настройка AI-чата](../AI_CHAT.md)) укажите:

| Поле | Значение |
| ---- | -------- |
| Формат API | `OPENAI` (vLLM OpenAI-совместим) |
| Базовый URL | `http://<llm-host>` — **без `/v1`** (Storm допишет `/v1/chat/completions` сам) |
| Модель | `qwen36-35b-a3b` (ровно `--served-model-name`) |
| Токен | пусто, если эндпоинт без авторизации; иначе — ваш ключ из nginx-auth |

---

## Тюнинг и диагностика производительности

vLLM каждые ~10 секунд пишет в лог метрики — это главный инструмент диагностики:

```
Avg prompt throughput: 4630 tokens/s, Avg generation throughput: 45 tokens/s,
Running: 2 reqs, Waiting: 0 reqs, GPU KV cache usage: 10.1%, Prefix cache hit rate: 44.9%
```

Как это читать:
- **Running / Waiting** — сколько запросов в работе и в очереди. Waiting > 0 стабильно → упёрлись в `max-num-seqs` или KV-кэш.
- **generation throughput** — токенов/с генерации. Падает при росте Running (компьют делится между запросами) — это норма батчинга.
- **GPU KV cache usage** — заполнение KV-кэша. Близко к 100% → начнётся вытеснение (preemption) и резкое замедление.
- **Prefix cache hit rate** — доля токенов промпта, взятых из кэша (см. ниже).

### Prefix caching — главный рычаг для чата

Чат шлёт **одинаковый системный промпт + схемы тулов каждый ход** (это тысячи токенов). Без префикс-кэша
vLLM пере-обрабатывает их заново на каждом запросе — впустую жжёт GPU. `--enable-prefix-caching` кэширует
этот общий префикс.

В нашем случае включение подняло **hit rate с 0% до ~45%** (а на многоходовых диалогах — выше): почти
половина prefill берётся из кэша → меньше нагрузка, быстрее ответы, особенно под параллельной нагрузкой.

::: warning Гибридные модели (Qwen3-Next, Mamba) — prefix caching экспериментальный
Для гибридных архитектур vLLM включает префикс-кэш в режиме `Mamba cache 'align'` и помечает его как
**experimental**. У нас работает стабильно, но проверьте на своей версии vLLM и нагрузке. Если ловите
аномалии — отключите флаг (`--no-enable-prefix-caching` / убрать `--enable-prefix-caching`).
:::

### Контекст ↔ параллельность

`--max-model-len` и параллельность связаны: KV-кэш делится между запросами, и чем длиннее максимальный
запрос, тем меньше их влезает одновременно.

> Реальный замер: при `--max-model-len 131072` максимальная конкурентность полноразмерных запросов была
> ~4×, при `65536` стала **8.24×** — вдвое больше параллельных запросов при том же KV-кэше.

Поэтому: **не ставьте контекст больше, чем реально нужно.** Для чата Storm 64K — с запасом, а
освободившийся KV-кэш идёт под параллельность.

### «Медленно отвечает» — чек-лист

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

Типичные выводы:
- **util 100% при одном запросе** — это не перегрузка, а компьют тяжёлого хода (большой контекст +
  длинная генерация). Лечится prefix-кэшем и слимом промптов/контекста.
- **много Running + просадка throughput** — реальная конкуренция за GPU. Помогает prefix caching
  (меньше дублирующего prefill) и, при необходимости, вторая карта / более лёгкая модель для чтения.
- **Preempt в логах** — KV-кэш переполнен: уменьшите `--max-model-len` или `--max-num-seqs`.

---

## Известные нюансы

- **fp8** — отличный баланс качество/память для больших моделей; на маленьких можно `awq`/`gptq`.
- **Гибридные thinking-модели** (Qwen3.6) — размышления включаются параметром запроса `enable_thinking`,
  а не флагом запуска; для чата Storm держите их **выключенными** (профиль speed). При включённых
  размышлениях заложите больший `--max-model-len`/`maxTokens` и учтите кратно больший расход токенов и
  латенси на ответ (см. [настройку AI-чата](../AI_CHAT.md), раздел про reasoning).
- **Парсер под модель** — меняете модель → меняйте `--tool-call-parser` (Qwen3.6 → `qwen3_coder`,
  Qwen3-Next → `hermes`, Llama → `llama3_json`, GLM → `glm45`, gpt-oss → `openai`, Mistral → `mistral`).
- **Первый старт долгий** — vLLM компилирует CUDA-графы; `start_period: 1800s` в healthcheck это
  учитывает. Веса кэшируются в `hf-cache`, поэтому последующие рестарты быстрее.
