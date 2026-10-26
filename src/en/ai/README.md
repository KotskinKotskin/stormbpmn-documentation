---
dir:
  order: 4
  link: true
  text: 4. AI Assistant
  collapsible: true
index: true
order: 4
source_hash: 17286e9d7fd83549
---

[[toc]]

# StormBPMN AI Assistant {#ai-ассистент-stormbpmn}

The AI Assistant is a chat built into the application that reads your diagrams, processes, roles, and documents, answers questions from the knowledge base, and **actually creates and edits BPMN diagrams**, assigns roles, and links documents — by invoking tools, rather than fabricating results.

All AI functionality is included in the **AI module** of the license (`enableAiFeatures`) and is enabled on the server via the environment variable `MCP_ENABLED`. Fine-tuning is available in the admin panel, under the “🤖 AI Assistant” section.

::: tip pgvector Required
The vector engine (which powers the knowledge base and the platform's fast semantic search) requires the **pgvector** extension in PostgreSQL. This is a basic platform requirement, not part of the AI module — see [“PostgreSQL Requirements”](/en/install/README.md).
:::

## Sections {#разделы}

1. **[Enabling and Connecting a Process Model](./AI_CHAT.md)** — how to enable the chat (ENV + license + toggle) and
   connect a language model: API format, base URL, token, separate write model, prompts.
2. **[Knowledge Base (RAG)](./KnowledgeBase.md)** — uploading reference documents so that the chat responds based on
   their content; indexing and search parameters.
3. **[Self-hosted LLM](./self-hosted-llm/)** — how to run your own model on your GPU:
   [model selection](./self-hosted-llm/) (benchmark) and [deployment on vLLM](./self-hosted-llm/deploy-vllm.md).
4. **[Voice Input](./voice-input.md)** — dictating messages in the chat: deploying the storm-media speech recognition service (Whisper) and settings in the admin panel. Available from version 6.6.6668.
5. **[File Attachments and Diagram Import](./file-attachments.md)** — files in chat messages: documents
   (pdf/docx/txt, etc.) are sent to the model context, while BPMN / draw.io / Visio diagrams are converted into Storm diagrams with a single click. Available in versions after 6.6.6955.
6. **[Warm-ups (Storm Master)](./retention.md)** — personalized emails to employees with a reason to return to
   work: pending approvals, stalled diagrams, summaries. The texts are written by your model; enabling the `STORM_RETENTION_ENABLED` variable. Available in builds after October 7, 2026.

## Getting Started {#с-чего-начать}

- **Cloud model (quick start)** — connect OpenAI / Anthropic / ProxyAPI following the instructions in
  ["Enabling and Connecting a Model"](./AI_CHAT.md). No own infrastructure is required.
- **Data within the perimeter** — deploy a [self-hosted LLM](./self-hosted-llm/) on your GPU and
  connect Storm to its endpoint.
