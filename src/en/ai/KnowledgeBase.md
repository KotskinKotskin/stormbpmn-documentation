---
order: 2
title: AI Chat Knowledge Base
redirectFrom:
    - /en/operation/KnowledgeBase.html
source_hash: 3f9409ecf96ee948
---

# AI Chat Knowledge Base (RAG) {#база-знании-ai-чата-rag}

The knowledge base allows you to upload reference documents for your service (help articles, regulations, instructions), so the AI chat can answer users **based on their content** rather than making things up. Technically, this is RAG — Retrieval-Augmented Generation.

::: warning Only when the AI module is enabled
The knowledge base is part of the **AI module**. This section is available if the AI module is included in your license and is enabled.
If the license is active but the AI module is not connected, the “Knowledge Base” tab in the admin panel is displayed **for reference only** — settings are visible but cannot be modified (marked with a lock). To use it, connect the AI module.
:::

[[toc]]

## How It Works {#как-это-работает}

**When a document is uploaded:**

1. The document is split into small fragments (chunks) with overlap.
2. Each fragment is converted into a vector (embedding) by a local model directly on the server, **without calling external services** (document text does not leave the system).
3. Vectors and the original content are stored in the database (Postgres + extension `pgvector`).

::: warning pgvector extension required
The vector engine (which also powers the platform's fast universal search) requires the **pgvector** extension in PostgreSQL; without it, the backend will not start. This is a basic requirement, not part of the AI module. The standard `postgres` pgvector image does not include it: use `pgvector/pgvector:pg17` or install pgvector in your build/DBaaS. For details, see [“PostgreSQL Requirements”](/en/install/README.md).
:::

**When a user writes in the chat:**

1. The system searches for the most relevant fragments based on the user's query—**hybridly**: by meaning (vector search) and by exact words (full-text search). Vector search catches synonyms, while word-based search catches exact terms, codes, and abbreviations.
2. The relevant fragments are provided to the model as reference material.
3. The model formulates an answer based on them and, if necessary, cites the source.

::: tip Reference ≠ Action
If a user requests to **perform** an action (“create role X”), the chat executes it via tools rather than restating the instructions. The knowledge base is used for **answering questions** (“how to create a role?”), not as a substitute for actions.
:::

## Parameters and Default Values {#параметры-и-значения-по-умолчанию}

Parameters are configured in the admin panel and applied **without a restart**.

| Parameter | Default | Description | Reindexing Required? |
|---|---|---|---|
| Chunk size | **320** | The number of tokens to split the document into during indexing. Smaller values are more precise but fragmented; larger values dilute the meaning. | Yes |
| Chunk overlap | **48** | Overlap between adjacent fragments (≈10–15%) — preserves meaning at boundaries. | Yes |
| Relevance threshold | **0.84** | Minimum fragment similarity required to be included in the chat response. Fragments below this threshold are excluded from the response. | No |
| Fragments in response (topK) | **4** | The number of fragments to pass to the model. Typically 3–5. | No |
| Hybrid search | **on** | Combines semantic and lexical search. Recommended to keep enabled. | No |
| Word match threshold | **0.82** | Minimum similarity for fragments found via exact word matches (keyword search). Filters out "noise" in the lexical branch of hybrid search. | No |

::: warning Chunk size is measured in conditional tokens
Chunk size is calculated in the indexer's internal tokens, **not** in the embedding model's tokens. For Russian, these differ: a value of **320 ≈ 230–275 model tokens** given the model's limit of 512 — meaning there is a safety margin. The safe upper limit is approximately **600**. Do not increase the chunk size to 512 "because the model supports 512" — these are different units; otherwise, part of the text will be truncated during indexing.
:::

::: tip Hybrid search and word threshold
The **Word match threshold** parameter works only when **hybrid search** is enabled. It filters out fragments that matched by words but are too distant in meaning (low cosine similarity). This prevents "junk" found only by matching abbreviations or terms but irrelevant in context from appearing in the response.
:::

## What and Where to Change {#что-и-где-менять}

Everything is done in the admin panel (full access rights required):

- **Administration → "Knowledge Base" tab** — main screen:
  - **Upload / update** documents (`.md`, `.txt`). The "eye" button — view the original, the update button — replace the file, the trash can — delete (with confirmation).
  - **"Test Search"** — enter a query and see which fragments and with what similarity are retrieved, before the model responds. The "by words" badge indicates an exact word match. The main debugging tool.
  - **Parameters** — chunk size, overlap, threshold, topK, hybrid + **"Reindex"** button.
- **Administration → "Application Settings"** — the same parameters are available here as well (AI section), as regular settings.

::: tip When to Click "Reindex"
After changing the **chunk size** or **overlap**, you need to reindex — the system will re-split and recalculate all documents (from the saved originals). Threshold, topK, and hybrid are applied immediately, without reindexing.
:::

## API-Based Population (Programmatic) {#наполнение-по-api-программно}

In addition to manual uploads via the admin panel, the knowledge base can be populated **programmatically** — for example, by synchronizing it with your wiki, helpdesk, or CMS using an external pipeline (n8n, script, CI). Documents are delivered in batches; updates and deletions are idempotent.

::: warning AI module required
The endpoint works only when the AI module is enabled (as with the entire knowledge base).
:::

**Authentication.** Header `X-Api-Key` — team integration key (the same mechanism as for the rest of the public API). Only a team with **full access** can write to the knowledge base.

**Base path:** `/api/v1/integration/kb-documents`

### Upload / Update — `POST /batch` {#загрузка-обновление-—-post-batch}

The body is a set of documents from a single source. `sourceSystem` — your source code (any string up to 64 characters, excluding the reserved `manual`), `externalId` — the document identifier in your system. The pair `(sourceSystem, externalId)` — **idempotency key**: re-uploading the same document will update it, rather than creating a duplicate.

```bash
curl -X POST https://<ваш-сервер>/api/v1/integration/kb-documents/batch \
  -H "X-Api-Key: <ключ-команды>" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceSystem": "my-wiki",
    "items": [
      {
        "externalId": "article-42",
        "title": "Как создать роль",
        "content": "# Создание роли\n\nЧтобы создать роль, откройте…",
        "moreUrl": "https://wiki.example.com/articles/42"
      },
      { "externalId": "article-7", "deleted": true }
    ]
  }'
```

| Field | Required | Purpose |
|---|---|---|
| `sourceSystem` | yes | Source code (for the entire batch). Up to 64 characters, excluding `manual`. |
| `items[].externalId` | yes | Document identifier in the source. Up to 256 characters. |
| `items[].title` | for upsert | Title (if empty, `externalId` will be substituted). |
| `items[].content` | for upsert | Text (Markdown / plain), UTF-8. |
| `items[].moreUrl` | no | "More details" link — the chat will display it to the user next to the response. |
| `items[].deleted` | no | `true` → unpublish the document (only `externalId` is required). |

The response includes counters `created` / `updated` / `tombstoned` / `skipped` and a list `errors` for specific items: one malformed document does not fail the entire batch. Unchanged documents are skipped (`skipped`) — re-uploading the same content does not trigger any recalculation.

::: tip Up to 500 documents per request
Upload in large batches (200–300 is fine). For very large volumes, split into chunks of ≤500.
:::

### Full synchronization — `POST /prune` {#полная-синхронизация-—-post-prune}

To remove documents from the database that have been deleted at the source, send the **complete list of current** `externalId` for this source at the end of the run. Anything not included in this list will be removed (tombstone).

```bash
curl -X POST https://<ваш-сервер>/api/v1/integration/kb-documents/prune \
  -H "X-Api-Key: <ключ-команды>" \
  -H "Content-Type: application/json" \
  -d '{ "sourceSystem": "my-wiki", "keepExternalIds": ["article-42", "article-7"] }'
```

::: warning Protection against accidental deletion
If `keepExternalIds` is empty, but there are active documents in the source, the request is rejected — to prevent a failed pipeline (sending an empty list) from deleting the entire source. To intentionally clear the source, pass `"force": true`.
:::

::: tip Indexing — background
The endpoint accepts documents and responds immediately; vectorization runs **in the background** (usually within a few minutes). Therefore, a newly uploaded document appears in chat search with a slight delay — this is normal. You do not need to click “Reindex”: new and modified documents are indexed automatically.
:::

## How to tune parameters {#как-подобрать-параметры}

Tuning "by eye" is useless — use "Check search":

1. Collect 10–15 typical user questions.
2. Run them, changing **one** parameter at a time.
3. Check: does the required article appear in the top results, and is its similarity score higher than that of irrelevant ones?
4. If you changed the chunk size/overlap — click "Reindex".

The greatest impact comes from **the quality of the source articles** and **the chunk size**, not from fine-tuning the threshold. Clean, structured articles tailored to specific questions work best.

## Embeddings Model {#модель-эмбеддингов}

A compact multilingual model (multilingual-e5-small) is used, which runs locally on the server. It is provided with the system — no separate configuration is required. Document data during indexing and search **does not leave the server**.
