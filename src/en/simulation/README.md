---
dir:
  order: 5
  link: true
  text: 5. Simulations (DES)
  collapsible: true
index: true
order: 5
source_hash: b19d1d3a776fc6d4
---

[[toc]]

# Simulation Module (DES) {#модуль-симуляции-des}

The Simulation Module allows you to **run business processes "in the digital" before changing them in real life**.
You take a BPMN diagram, set parameters (request flow, operation durations, resources and their
schedules, cost) — and get a process simulation run using the Discrete Event Simulation (DES) method: where the queue builds up, what the actual cycle time is,
how loaded the performers are, and what it costs to run one process instance.

What the module provides:

-   **Bottleneck identification** — which operations and resources slow down the process and create queues;
-   **Cycle time and SLA** — how long it actually takes to process a request, taking into account queues and schedules;
-   **Resource utilization** — who is overloaded and who is idle;
-   **Process economics** — cost per instance and cost breakdown;
-   **"What-if" scenarios** — comparing process variants before implementing changes.

::: info Separate license
The Simulation Module **is not included in the standard delivery** of StormBPMN Enterprise and is licensed separately —
just like the AI module. To include the module in your license, contact your account manager or
write to us via the [form on the website](https://stormbpmn.com/contact-sales).
:::

::: tip AI analysis of results
Automatic analysis of the simulation report by a language model (conclusions and recommendations based on the run results)
additionally requires the **AI module** license and a configured [AI assistant](/en/ai/). The simulations
themselves work without it.
:::

## How the module works {#как-устроен-модуль}

Simulations are calculated by a **separate container `storm-des`** — a computational service running alongside the main application. It is intentionally separated from the main container: a simulation run is a resource-intensive task, and a separate service does not consume CPU and memory from application users, while allowing independent scaling when necessary.

Integration with the application occurs through two paths:

1.  **Database queue** — the main application enqueues a simulation run (a table in the same PostgreSQL database), and container `storm-des` retrieves tasks from the queue, calculates them, and writes the results back. No separate message broker is required.
2.  **HTTP within the perimeter** — synchronous operations (configuration validation before launch, parameter preview, configuration schemas) are requested by the main application directly from `storm-des` via HTTP (port 8081). This port is required **only by the main application** — it should not and does not need to be exposed externally.

This implies two properties important for operations:

-   `storm-des` connects **to the same PostgreSQL database** as the main application — a separate database is not needed, and the service does not perform schema migrations (all tables are created by the main application);
-   if **multiple** containers `storm-des` are started, they will process the shared queue in parallel — this is how simulation throughput scales.

## Resource Requirements {#требования-к-ресурсам}

| Configuration | CPU | RAM | Disk | Parallel simulations |
| --- | --- | --- | --- | --- |
| **Minimum** | 2 vCPU | 8 GB | 10 GB | 1 |
| **Recommended** | 4 vCPU | 16 GB | 20 GB | 2 |

Memory is the primary resource: running a large process with a long simulation horizon keeps all statistics in JVM memory. The number of parallel runs is set by the variable `SIMULATION_MAX_CONCURRENT` (default is 2) — when increasing it, also increase the container memory (guideline — 6 GB of JVM heap per parallel simulation plus 2 GB for the service itself). Disk space is required only for logs and debug files.

## Sections {#разделы}

1. **[Installation and Connection](./install.md)** — image, docker-compose, environment variables,
   connection to the main application, functionality check.
2. **[Operations and Monitoring](./operation.md)** — service health, Prometheus metrics,
   limits and protection against "stuck" simulations, common issues and their diagnostics.
