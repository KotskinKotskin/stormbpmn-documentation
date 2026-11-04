---
title: "Развёртывание на vLLM"
order: 2
redirectFrom:
    - /configure/VLLM.html
---

[[toc]]

# Развёртывание собственной модели на vLLM

Пошаговая инструкция, как поднять **собственный OpenAI-совместимый сервер модели на
[vLLM](https://docs.vllm.ai/)** и подключить к нему [AI-ассистента Stormbpmn](../AI_CHAT.md). Конфигурация
ниже — та, на которой работает AI-чат нашего облака; для каждого параметра объяснено, зачем он нужен.
Какую модель выбрать и сколько пользователей тянет одна карта — на странице [Выбор модели](./README.md).

::: warning Что эта статья не покрывает
- Установку драйверов NVIDIA, CUDA и `nvidia-container-toolkit`: предполагается, что `nvidia-smi`
  и `docker run --gpus all` уже работают.
- Другие движки (Ollama, llama.cpp, SGLang): принцип тот же (OpenAI-совместимый сервер), но флаги свои.
:::

---

## Требования к железу

| | Наш сервер | Минимум |
|---|---|---|
| GPU | 1× NVIDIA RTX PRO 6000 Blackwell, 96 ГБ | карта с 48 ГБ (с уменьшенным контекстом, см. [Выбор модели](./README.md#если-gpu-не-blackwell)) |
| CPU / RAM | 32 vCPU, 186 ГБ | нагружаются слабо: вся работа идёт на GPU |
| Диск | SSD под кэш весов | от 50 ГБ свободного места (образ vLLM и веса) |
| Драйвер | NVIDIA с поддержкой CUDA 12.8+ | то же |

Веса Qwen3.8-27B в NVFP4 занимают около 22 ГБ видеопамяти. Остальное vLLM отдаёт под KV-кэш: от него
зависит, сколько запросов и какой длины обрабатываются одновременно.

::: tip Главное правило
Веса должны целиком помещаться в видеопамять: vLLM не выгружает их в оперативную память.
:::

---

## Файлы на сервере

```
/opt/storm-llm/
├── docker-compose.yml
├── nginx.conf
├── pr-48375.patch        # исправление vLLM для MTP + кэша префиксов
├── patch-and-run.sh      # накладывает исправление и запускает vLLM
└── hf-cache/             # кэш весов HuggingFace
```

### Исправление vLLM

В vLLM `v0.27.1` спекулятивное декодирование MTP вместе с кэшем префиксов на гибридных моделях (к ним
относится Qwen3.8) иногда восстанавливает состояние из непроверенных токенов. Исправление —
[vllm-project/vllm#48375](https://github.com/vllm-project/vllm/pull/48375). Пока оно не вошло в
релиз, накладываем его при старте контейнера.

Скачайте патч без тестов:

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

::: warning Без исправления
Если наложить патч нельзя, уберите из команды `--speculative-config`. Модель будет работать корректно,
но генерация станет медленнее.
:::

---

## docker-compose.yml

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

На картах не Blackwell замените первую строку `command` на `Qwen/Qwen3.8-27B-FP8`, остальное оставьте.

---

## Разбор флагов

| Флаг | Значение | Зачем |
| ---- | -------- | ----- |
| модель (первый аргумент) | `unsloth/Qwen3.8-27B-NVFP4` | Веса на HuggingFace или путь к локальной папке с весами. |
| `--served-model-name` | `qwen3.8-27b` | Имя модели в API. **Именно его вписывают в `bpmnAiCompletionModel` в Stormbpmn.** |
| `--trust-remote-code` | вкл. | Архитектура Qwen3.8 поставляется кодом модели. |
| `--max-model-len` | `262144` | Полное окно модели. На 96 ГБ оно помещается вместе с 16 параллельными запросами благодаря fp8 KV-кэшу. |
| `--kv-cache-dtype` | `fp8` | KV-кэш вдвое меньше, чем в bf16, без заметной потери качества. |
| `--gpu-memory-utilization` | `0.85` | Доля видеопамяти для vLLM. Остаток — под голосовой ввод на той же карте и системные нужды. |
| `--max-num-seqs` | `16` | Сколько запросов обрабатывается одновременно. В пике нашего облака используется полностью. |
| `--enable-prefix-caching` | вкл. | **Главная оптимизация для чата**: системный промпт, описания инструментов и история диалога повторяются в каждом запросе и берутся из кэша, а не считаются заново. |
| `--enable-chunked-prefill` | вкл. | **Обязателен** для гибридных моделей Qwen, иначе vLLM падает на проверке кэша. |
| `--speculative-config` | MTP, 3 токена | Модель предсказывает несколько токенов вперёд и проверяет их за один шаг. Ускоряет генерацию, сильнее всего при небольшом числе одновременных запросов. Значение 4 на `v0.27.1` падает под нагрузкой. |
| `--enable-auto-tool-choice` | вкл. | **Обязателен**: модель сама решает, какой инструмент вызвать. |
| `--tool-call-parser` | `qwen3_coder` | **Обязателен**: разбирает вызовы инструментов в формате Qwen3.8. |
| `--reasoning-parser` | `qwen3` | Отделяет размышления модели от ответа. |
| `--default-chat-template-kwargs` | `enable_thinking: false`, `preserve_thinking: true` | По умолчанию модель отвечает без размышлений. Stormbpmn включает их сам, если `bpmnAiChatThinking = enabled`. `preserve_thinking` сохраняет прошлые размышления в истории, так кэш префиксов срабатывает чаще. |
| `--override-generation-config` | `temperature 0.7, top_p 0.8, top_k 20` | Рекомендованные параметры Qwen для режима без размышлений. Температуру из запроса Stormbpmn (`bpmnAiCompletionTemperature`, 0.2) vLLM ставит поверх этой. |
| `--host` / `--port` | `0.0.0.0` / `8000` | Внутри контейнера; снаружи порт доступен только на localhost. |

::: danger Без парсера инструментов чат не работает
`--enable-auto-tool-choice` и `--tool-call-parser qwen3_coder` — обязательные флаги. Если их нет или
указан чужой парсер, модель пишет «готово», ничего не сделав.
:::

---

## nginx

vLLM слушает только `127.0.0.1:8000`, наружу его публикует nginx на порту 80. Через nginx удобно
добавить TLS, авторизацию, ограничения по IP и журнал запросов.

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

::: tip Закройте доступ извне
Если сервер доступен из интернета, добавьте в nginx TLS и авторизацию или ограничьте доступ по IP.
:::

---

## Запуск и автозагрузка

```bash
cd /opt/storm-llm
echo "HF_TOKEN=hf_..." > .env && chmod 600 .env
docker compose up -d              # первый старт — до 30 минут: загрузка весов и CUDA-графы
docker logs -f storm-vllm         # ждём "[pr-48375] наложен" и "Application startup complete"
curl -sf http://127.0.0.1:8000/health && echo OK
```

`restart: unless-stopped` поднимает контейнеры после перезагрузки сервера. Если нужен явный
системный сервис:

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

## Подключение Stormbpmn

В настройках AI-ассистента ([Включение и подключение модели](../AI_CHAT.md)) укажите:

| Поле | Значение |
| ---- | -------- |
| Формат API | `OPENAI` |
| Базовый URL | `http://<llm-host>`, **без `/v1`** |
| Модель | `qwen3.8-27b` (ровно `--served-model-name`) |
| Токен | пусто, если сервер без авторизации; иначе ключ, который проверяет nginx |
| Размышления (`bpmnAiChatThinking`) | `enabled`, если включён стриминг ответа; иначе `disabled` |

Проверка с сервера Stormbpmn:

```bash
curl -s http://<llm-host>/v1/models
```

---

## Диагностика производительности

Каждые 10 секунд vLLM пишет в лог метрики:

```
Avg prompt throughput: 4630 tokens/s, Avg generation throughput: 310 tokens/s,
Running: 9 reqs, Waiting: 0 reqs, GPU KV cache usage: 41.0%, Prefix cache hit rate: 87.5%
```

- **Running / Waiting** — запросов в работе и в очереди. `Waiting` стабильно больше нуля — упёрлись в
  `--max-num-seqs` или в KV-кэш.
- **generation throughput** — генерация, токенов в секунду, суммарно по всем запросам.
- **GPU KV cache usage** — заполнение KV-кэша. Около 100% — начнётся вытеснение запросов и резкое
  замедление.
- **Prefix cache hit rate** — доля входа, взятая из кэша. У чата Stormbpmn она высокая, потому что
  каждый запрос хода повторяет начало предыдущего. Резкое падение — признак того, что кэш выключен
  или его не хватает.

### Когда добавлять мощность

| Что видно | Что делать |
|---|---|
| `Waiting > 0` в рабочие часы, KV-кэш ниже 80% | поднять `--max-num-seqs` до 24–32 |
| KV-кэш около 100%, в логах `Preempt` | уменьшить `--max-model-len` до 131072 или поставить вторую карту |
| Пользователей чата больше 200 в день | вторая карта с тем же compose и балансировщик перед ними |

Быстрая проверка:

```bash
nvidia-smi --query-gpu=utilization.gpu,memory.used,temperature.gpu --format=csv,noheader
docker logs storm-vllm 2>&1 | grep -E "Running:|Preempt" | tail -10
```

---

## Обновление vLLM

Версия образа закреплена (`v0.27.1`), потому что от версии зависят парсеры инструментов, кэш
префиксов и MTP. Переходите на новую версию так:

1. Проверьте, вошло ли исправление [#48375](https://github.com/vllm-project/vllm/pull/48375) в релиз.
   Если вошло — уберите `entrypoint`, патч и скрипт из compose.
2. Поднимите новую версию на тестовом стенде и проверьте чат: создание процесса, ответ по базе
   знаний, 16 одновременных запросов.
3. Только после этого меняйте образ на основном сервере.
