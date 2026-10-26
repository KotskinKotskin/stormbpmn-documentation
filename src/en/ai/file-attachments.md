---
title: File Attachments and Schema Import
order: 5
source_hash: 8ad7876c50fe92de
---

[[toc]]

# File Attachments in AI Chat and Diagram Import {#вложения-фаилов-в-ai-чат-и-импорт-схем}

Available in versions **after 6.6.6955**.

You can attach files to a message in the AI chat using the paperclip button or by dragging and dropping them directly into the chat panel (up to **3 files per message**). The subsequent behavior depends on the file type:

-   **Documents** (txt, pdf, docx, etc.) — Storm extracts text from them, and the assistant responds based on the content: "create a diagram based on this regulation," "compare the process with this instruction."
-   **Diagrams** (BPMN, draw.io, Visio) — a button appears on the attachment card that converts the diagram into a Storm diagram with a single click.

This feature is **disabled** by default and can be enabled via a toggle in the admin panel (see [Step 3](#шаг-3-включить-в-админ-панели)).

## Two File Classes {#два-класса-фаилов}

| Class | Extensions | Processed By | Size Limit |
| ----- | ---------- | ---------------- | ------------- |
| **Documents** | `.txt` `.md` `.markdown` `.csv` `.json` `.doc` `.docx` `.pdf` | **storm-media** service (see Step 2) | `chatFileMaxBytes` setting, default **25 MB** |
| **Schemas** | `.bpmn` `.drawio` `.vsdx` | Storm backend itself, **storm-media not required** | Fixed **10 MB** |

How storm-media processes documents:

-   `.txt` / `.csv` / `.json` — as text; `.md` / `.markdown` — as markdown;
-   `.docx` — conversion to markdown;
-   `.doc` — conversion via LibreOffice (headless, included in the image);
-   `.pdf` — text layer; pages without a text layer (scans) are sent to **OCR** (tesseract,
    Russian + English out of the box).

::: tip No GPU required for documents
Text extraction from documents runs **on CPU** — the GPU in storm-media is only needed for local
speech recognition (Whisper). If you do not need voice input, storm-media can be deployed on a
standard machine without a graphics card.
:::

## How It Works {#как-это-работает}

```
Браузер (скрепка / drag&drop, ≤3 файлов)
   │  файл
   ▼
Бэкенд Storm ──► S3 (bucket uploads)
   │
   │  POST /v1/jobs/from-url  { sourceUrl: <presigned-ссылка на S3, TTL 15 мин> }
   ▼
storm-media ──── скачивает файл из S3 сам ────► извлекает текст
   ▲                                                │
   └────────── бэкенд поллит статус до READY ◄──────┘

Текст вложения подмешивается в контекст хода (бюджет символов настраивается)
```

Two important details of this scheme:

-   **The file does not pass through the storm-media backend.** The backend places it in S3 and passes a **presigned link** to storm-media — storm-media downloads the file itself. Therefore, S3 must be **accessible from the storm-media host** (see Step 1).
-   Schemas (`.bpmn` / `.drawio` / `.vsdx`) are not sent to storm-media at all — the backend parses them itself. Schema import works even where storm-media is not deployed (but then attached documents will not be processed).

## Importing diagrams into a model {#импорт-схем-в-модели}

A button appears on the attached diagram card — the label depends on the format and accurately reflects what will happen:

| Format | Button | What happens |
| ------ | ------ | -------------- |
| `.bpmn` | **“Load as model”** | The file is saved using the same path as the “Load BPMN” dialog: one-to-one layout, version #1, quality check, search indexing. Nothing is redrawn. |
| `.drawio` | **“Build model from diagram”** | Storm deterministically parses the diagram’s shapes and lanes; if it recognizes them with confidence, the LLM is not involved. Otherwise, the LLM reconstructs the diagram. |
| `.vsdx` (Visio) | **“Build model from diagram”** | Similar to draw.io: first, deterministic parsing based on master shapes, with the LLM used only as a fallback. |

Pressing the button again **does not create a duplicate** — the already created diagram is returned; a link to it remains on the card.

::: warning Limitations of “Build model from diagram”
-   If the **LLM** reconstructed the diagram, the result must be visually verified: the model may make errors in the number of elements or labels. Lanes are lost on the LLM path.
-   Lanes from **Visio** are not transferred: the association of a shape with a lane is defined by geometry, not by the file structure.
-   Lanes are preserved in the deterministic parsing of draw.io and in direct loading `.bpmn`.
:::

## Step 1. Requirements {#шаг-1-требования}

| Condition | Location | Comment |
| ------- | --- | ----------- |
| `MCP_ENABLED=true` + AI module in the license | ENV / license | Attachments are part of the AI chat (see [Enabling chat](./AI_CHAT.md)) |
| Connected LLM | Admin panel | Required for chat in general and for the LLM path of schema import |
| storm-media service | Separate host/container | **For documents only.** Schemas work without it |
| S3 is accessible from the storm-media host | Your network | storm-media downloads files via presigned links |

::: warning S3 and the `S3_EXTERNAL_ENDPOINT` variable
Presigned links are built from the **external** S3 address — property `s3.externalEndpoint`
(ENV `S3_EXTERNAL_ENDPOINT`); if it is not set, the primary `s3.endpoint`
(ENV `S3_ENDPOINT` / `MINIO_ENDPOINT`) is used. Verify that this specific address resolves and is open
**from the storm-media machine** — this is the most common cause of the "file is being processed forever" issue.
:::

## Step 2. storm-media {#шаг-2-storm-media}

The service deployment is described in the article ["Voice input (storm-media)"](./voice-input.md) — this is **the same container**: if voice input is already working for you, no additional deployment is required; document processing is already included (tesseract and LibreOffice are built into the image, and no separate secrets are required).

Connecting the backend to storm-media uses the same two admin panel settings as voice input: **`stormMediaBaseUrl`** and **`stormMediaToken`** (section "🤖 AI assistant"). If these are not filled in, attached documents will not be processed (the user will see "Chat attachments are not configured"); schemas will continue to work.

Fine-tuning of the document pipeline is done via storm-media ENV variables (defaults are reasonable and usually do not need to be changed): `OCR_LANGUAGES` (default is `rus+eng`), `MAX_PDF_PAGES`, `DOC_CONCURRENCY`, etc. — see the image's `.env.example`.

::: warning Update order: first storm-media, then the backend
Support for `.json` and `.csv` appeared in storm-media simultaneously with the attachments feature. If you update the backend while leaving the old storm-media in place, these formats will receive an "Unsupported format" error. Update the storm-media container **before** (or at the same time as) updating the main application.
:::

## Step 3. Enable in the admin panel {#шаг-3-включить-в-админ-панели}

Section **«🤖 AI Assistant»**, file settings subgroup. Changes take effect immediately, without a restart.

| Setting (key) | Type | Default | Description |
| ---------------- | --- | ------------ | -------- |
| **Files in chat** (`chatFileUploadEnabled`) | toggle | **disabled** | Displays the paperclip icon and enables attachment intake |
| **Maximum size** (`chatFileMaxBytes`) | number | `26214400` (25 MB) | Upper limit for a single file size in bytes. For diagrams (`.bpmn`/`.drawio`/`.vsdx`), a separate 10 MB limit applies independently |
| **Character budget per turn** (`chatFileContextCharBudget`) | number | `150000` | The total number of characters from attachments injected into a single turn. Content that does not fit is truncated with an explicit note in the prompt, and the assistant is aware of this |

Final checklist:

1.  Chat is working (LLM connected, `MCP_ENABLED=true`, license with the AI module);
2.  storm-media is running, `GET /ready` responds successfully, `stormMediaBaseUrl` and `stormMediaToken` are populated (for documents);
3.  The S3 address from presigned links is accessible from the storm-media host;
4.  The **«Files in chat»** toggle is enabled — a paperclip icon has appeared in the input field.

## Troubleshooting {#устранение-неполадок}

| Symptom | Cause | Solution |
| ------- | ------- | ------- |
| No paperclip in the chat | The `chatFileUploadEnabled` toggle is off or the chat itself is unavailable | Enable the toggle; check the chat's operational conditions |
| "Chat attachments are not configured" | Empty `stormMediaBaseUrl` / `stormMediaToken` | Fill in both settings (see [Voice input](./voice-input.md), Steps 3–4) |
| Document is "processing forever" or fails | storm-media cannot download the file from S3 | Check the availability of the address from `S3_EXTERNAL_ENDPOINT` (or `S3_ENDPOINT`) from the storm-media host; check storm-media logs |
| `.json` / `.csv` → "Unsupported format" | Outdated storm-media image | Update the storm-media container |
| "File is too large" | Exceeded `chatFileMaxBytes` (documents) or 10 MB (schemas) | Reduce the file size or increase the setting (for documents) |
| Scanned PDF recognized with errors | Scan quality / language not in `rus+eng` | Add the language to `OCR_LANGUAGES` in storm-media; OCR is not omnipotent for poor scans |
| "Wrong" diagram built from the schema | The schema was reconstructed by an LLM (the "Build model from schema" button) | Verify and correct the result in the editor; this is expected behavior for the LLM path |
